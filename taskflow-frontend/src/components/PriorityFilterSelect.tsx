import { Select } from '@chakra-ui/react';
import { PRIORITIES } from '../types';
import type { PriorityFilter } from '../hooks/useBoard';

interface PriorityFilterSelectProps {
  value: PriorityFilter;
  onChange: (value: PriorityFilter) => void;
}

export default function PriorityFilterSelect({ value, onChange }: PriorityFilterSelectProps) {
  return (
    <Select
      value={value}
      onChange={(e) => onChange(e.target.value as PriorityFilter)}
      size="sm"
      w="auto"
      minW="160px"
      bg="white"
      borderRadius="md"
      aria-label="Filter tasks by priority"
    >
      <option value="All">All priorities</option>
      {PRIORITIES.map((p) => (
        <option key={p} value={p}>
          {p} priority only
        </option>
      ))}
    </Select>
  );
}
