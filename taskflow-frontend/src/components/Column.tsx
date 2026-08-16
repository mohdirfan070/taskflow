import { Box, HStack, Text, VStack, IconButton, Tooltip } from '@chakra-ui/react';
import { HiOutlinePlus } from 'react-icons/hi';
import type { Column as ColumnType } from '../types';
import TaskCard from './TaskCard';

interface ColumnProps {
  column: ColumnType;
  columns: ColumnType[];
  onAddTask: (columnId: number) => void;
  onEditTask: (taskId: number) => void;
  onDeleteTask: (taskId: number) => void;
  onMoveTask: (taskId: number, columnId: number) => void;
}

export default function Column({
  column,
  columns,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onMoveTask,
}: ColumnProps) {
  return (
    <Box
      bg="paper.50"
      border="1px solid"
      borderColor="paper.200"
      borderRadius="xl"
      w="300px"
      flexShrink={0}
      display="flex"
      flexDirection="column"
      maxH="100%"
    >
      <HStack justify="space-between" px={4} py={3} borderBottom="1px solid" borderColor="paper.200">
        <HStack spacing={2}>
          <Text fontFamily="heading" fontWeight="600" fontSize="sm" letterSpacing="0.01em">
            {column.name}
          </Text>
          <Box
            as="span"
            bg="brand.100"
            color="brand.700"
            fontSize="xs"
            fontWeight="700"
            borderRadius="full"
            px={2}
            py={0.5}
            minW="1.5rem"
            textAlign="center"
          >
            {column.tasks.length}
          </Box>
        </HStack>
        <Tooltip label={`Add task to ${column.name}`} hasArrow>
          <IconButton
            aria-label={`Add task to ${column.name}`}
            icon={<HiOutlinePlus />}
            size="xs"
            variant="ghost"
            onClick={() => onAddTask(column.id)}
          />
        </Tooltip>
      </HStack>

      <VStack
        align="stretch"
        spacing={2}
        p={3}
        overflowY="auto"
        flex="1"
        minH="80px"
      >
        {column.tasks.length === 0 ? (
          <Box py={6} textAlign="center">
            <Text fontSize="xs" color="gray.500">
              No tasks here yet.
            </Text>
          </Box>
        ) : (
          column.tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              columns={columns}
              onEdit={() => onEditTask(task.id)}
              onDelete={() => onDeleteTask(task.id)}
              onMove={(columnId) => onMoveTask(task.id, columnId)}
            />
          ))
        )}
      </VStack>
    </Box>
  );
}
