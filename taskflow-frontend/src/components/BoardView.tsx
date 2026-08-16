import { useState } from 'react';
import { Box, HStack, VStack, Heading, Button, Text, Skeleton, useToast } from '@chakra-ui/react';
import { HiOutlinePlus } from 'react-icons/hi';
import { useBoard } from '../hooks/useBoard';
import { createTask, updateTask, moveTask, deleteTask } from '../api/tasks';
import { ApiError } from '../api/client';
import type { Task } from '../types';
import Column from './Column';
import PriorityFilterSelect from './PriorityFilterSelect';
import ErrorBanner from './ErrorBanner';
import TaskFormModal from './TaskFormModal';
import ConfirmDeleteDialog from './ConfirmDeleteDialog';

interface BoardViewProps {
  boardId: number;
}

export default function BoardView({ boardId }: BoardViewProps) {
  const { board, loading, error, priorityFilter, setPriorityFilter, refresh } = useBoard(boardId);
  const toast = useToast();

  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [formDefaultColumnId, setFormDefaultColumnId] = useState<number | undefined>(undefined);

  const [deleteTarget, setDeleteTarget] = useState<Task | null>(null);
  const [deleting, setDeleting] = useState(false);

  const notifyError = (err: unknown, fallback: string) => {
    const message = err instanceof ApiError ? err.message : fallback;
    toast({ title: message, status: 'error', duration: 4000, isClosable: true });
  };

  const openCreateForm = (columnId: number) => {
    setEditingTask(undefined);
    setFormDefaultColumnId(columnId);
    setFormOpen(true);
  };

  const openEditForm = (taskId: number) => {
    const task = board?.columns.flatMap((c) => c.tasks).find((t) => t.id === taskId);
    if (!task) return;
    setEditingTask(task);
    setFormOpen(true);
  };

  const handleFormSubmit = async (values: {
    title: string;
    description: string;
    priority: Task['priority'];
    columnId: number;
  }) => {
    try {
      if (editingTask) {
        await updateTask(editingTask.id, {
          title: values.title.trim(),
          description: values.description.trim() || null,
          priority: values.priority,
        });
        toast({ title: 'Task updated', status: 'success', duration: 2500 });
      } else {
        await createTask({
          column_id: values.columnId,
          title: values.title.trim(),
          description: values.description.trim() || undefined,
          priority: values.priority,
        });
        toast({ title: 'Task created', status: 'success', duration: 2500 });
      }
      await refresh();
    } catch (err) {
      throw new Error(err instanceof ApiError ? err.message : 'Could not save this task.');
    }
  };

  const handleMove = async (taskId: number, columnId: number) => {
    try {
      await moveTask(taskId, columnId);
      await refresh();
    } catch (err) {
      notifyError(err, 'Could not move this task. Please try again.');
    }
  };

  const handleDeleteConfirmed = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteTask(deleteTarget.id);
      toast({ title: 'Task deleted', status: 'success', duration: 2500 });
      setDeleteTarget(null);
      await refresh();
    } catch (err) {
      notifyError(err, 'Could not delete this task. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  if (loading && !board) {
    return (
      <VStack align="stretch" spacing={4} p={6}>
        <Skeleton height="32px" width="240px" />
        <HStack spacing={4} align="start">
          <Skeleton height="400px" width="300px" borderRadius="xl" />
          <Skeleton height="400px" width="300px" borderRadius="xl" />
          <Skeleton height="400px" width="300px" borderRadius="xl" />
        </HStack>
      </VStack>
    );
  }

  if (error && !board) {
    return (
      <Box p={6} maxW="480px">
        <ErrorBanner message={error} onRetry={refresh} />
      </Box>
    );
  }

  if (!board) return null;

  return (
    <Box display="flex" flexDirection="column" h="100%" px={{ base: 4, md: 8 }} py={6}>
      <VStack align="stretch" spacing={1} mb={5} flexShrink={0}>
        <HStack justify="space-between" align="start" flexWrap="wrap" rowGap={3}>
          <Box>
            <Heading as="h1" size="lg" fontFamily="heading">
              {board.name}
            </Heading>
            <Box
              mt={2}
              h="3px"
              w="72px"
              borderRadius="full"
              bgGradient="linear(to-r, brand.500, brand.200)"
            />
          </Box>
          <HStack spacing={3}>
            <PriorityFilterSelect value={priorityFilter} onChange={setPriorityFilter} />
            <Button
              leftIcon={<HiOutlinePlus />}
              colorScheme="brand"
              size="sm"
              isDisabled={board.columns.length === 0}
              onClick={() => openCreateForm(board.columns[0].id)}
            >
              New task
            </Button>
          </HStack>
        </HStack>

        {error && <ErrorBanner message={error} onRetry={refresh} />}
      </VStack>

      {board.columns.length === 0 ? (
        <Text color="gray.500">This board doesn&apos;t have any columns yet.</Text>
      ) : (
        <HStack
          align="start"
          spacing={4}
          overflowX="auto"
          flex="1"
          className="board-scroll"
          pb={4}
        >
          {board.columns.map((column) => (
            <Column
              key={column.id}
              column={column}
              columns={board.columns}
              onAddTask={openCreateForm}
              onEditTask={openEditForm}
              onDeleteTask={(taskId) => {
                const task = column.tasks.find((t) => t.id === taskId);
                if (task) setDeleteTarget(task);
              }}
              onMoveTask={handleMove}
            />
          ))}
        </HStack>
      )}

      <TaskFormModal
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        columns={board.columns}
        task={editingTask}
        defaultColumnId={formDefaultColumnId}
        onSubmit={handleFormSubmit}
      />

      <ConfirmDeleteDialog
        isOpen={Boolean(deleteTarget)}
        taskTitle={deleteTarget?.title ?? ''}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirmed}
        isDeleting={deleting}
      />
    </Box>
  );
}
