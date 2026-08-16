import { useEffect, useState } from 'react';
import { Box, HStack, Heading, Text, Center, Spinner } from '@chakra-ui/react';
import { fetchBoards } from './api/boards';
import { ApiError } from './api/client';
import BoardView from './components/BoardView';
import ErrorBanner from './components/ErrorBanner';

export default function App() {
  const [boardId, setBoardId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadBoards = async () => {
    setLoading(true);
    setError(null);
    try {
      const boards = await fetchBoards();
      if (boards.length === 0) {
        setError('No boards exist yet. Create one from the backend to get started.');
        return;
      }
      setBoardId(boards[0].id);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not load boards.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBoards();
  }, []);

  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      <HStack
        as="header"
        px={{ base: 4, md: 8 }}
        py={4}
        borderBottom="1px solid"
        borderColor="paper.200"
        bg="white"
        flexShrink={0}
      >
        <Heading as="h1" size="md" fontFamily="heading" color="brand.700">
          TaskFlow
        </Heading>
        <Text fontSize="sm" color="gray.500">
          task dashboard
        </Text>
      </HStack>

      <Box flex="1" overflow="hidden">
        {loading && (
          <Center h="100%" py={20}>
            <Spinner color="brand.500" />
          </Center>
        )}

        {!loading && error && (
          <Box p={6} maxW="480px">
            <ErrorBanner message={error} onRetry={loadBoards} />
          </Box>
        )}

        {!loading && !error && boardId !== null && <BoardView boardId={boardId} />}
      </Box>
    </Box>
  );
}
