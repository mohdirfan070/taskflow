import {
  Box,
  Text,
  HStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  IconButton,
} from '@chakra-ui/react';
import { HiOutlineDotsVertical, HiOutlineArrowRight } from 'react-icons/hi';
import type { Column, Task } from '../types';
import PriorityBadge from './PriorityBadge';

interface TaskCardProps {
  task: Task;
  columns: Column[];
  onEdit: () => void;
  onDelete: () => void;
  onMove: (columnId: number) => void;
}

export default function TaskCard({ task, columns, onEdit, onDelete, onMove }: TaskCardProps) {
  const otherColumns = columns.filter((c) => c.id !== task.column_id);

  return (
    <Box
      bg="white"
      borderRadius="lg"
      border="1px solid"
      borderColor="paper.200"
      p={3}
      boxShadow="sm"
      _hover={{ borderColor: 'brand.200', boxShadow: 'md' }}
      transition="all 0.15s ease"
      role="group"
    >
      <HStack justify="space-between" align="start" mb={2}>
        <Text fontWeight="600" fontSize="sm" lineHeight="1.3" flex="1">
          {task.title}
        </Text>
        <Menu placement="bottom-end">
          <MenuButton
            as={IconButton}
            aria-label={`Actions for "${task.title}"`}
            icon={<HiOutlineDotsVertical />}
            size="xs"
            variant="ghost"
            flexShrink={0}
          />
          <MenuList fontSize="sm">
            <MenuItem onClick={onEdit}>Edit task</MenuItem>
            {otherColumns.length > 0 && (
              <>
                <MenuDivider />
                {otherColumns.map((c) => (
                  <MenuItem
                    key={c.id}
                    icon={<HiOutlineArrowRight />}
                    onClick={() => onMove(c.id)}
                  >
                    Move to {c.name}
                  </MenuItem>
                ))}
              </>
            )}
            <MenuDivider />
            <MenuItem onClick={onDelete} color="red.600">
              Delete task
            </MenuItem>
          </MenuList>
        </Menu>
      </HStack>

      {task.description && (
        <Text fontSize="xs" color="gray.600" noOfLines={2} mb={2}>
          {task.description}
        </Text>
      )}

      <PriorityBadge priority={task.priority} />
    </Box>
  );
}
