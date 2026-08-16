import { Box, HStack, Text } from '@chakra-ui/react';
import type { Priority } from '../types';
import { PRIORITY_COLOR, PRIORITY_LABEL } from '../utils/priority';

interface PriorityBadgeProps {
  priority: Priority;
}

export default function PriorityBadge({ priority }: PriorityBadgeProps) {
  const color = PRIORITY_COLOR[priority];

  return (
    <HStack
      spacing={1.5}
      px={2}
      py={0.5}
      borderRadius="full"
      bg="blackAlpha.50"
      aria-label={PRIORITY_LABEL[priority]}
    >
      <Box w="6px" h="6px" borderRadius="full" bg={color} flexShrink={0} />
      <Text fontSize="xs" fontWeight="600" color="gray.700">
        {priority}
      </Text>
    </HStack>
  );
}
