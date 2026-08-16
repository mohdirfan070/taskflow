import { useCallback, useEffect, useState } from "react";
import { fetchBoard } from "../api/boards";
import { ApiError } from "../api/client";
import type { Board, Priority } from "../types";

export type PriorityFilter = Priority | "All";

export function useBoard(boardId: number | null) {
  const [board, setBoard] = useState<Board | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>("All");

  const refresh = useCallback(async () => {
    if (boardId === null) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchBoard(
        boardId,
        priorityFilter === "All" ? undefined : priorityFilter,
      );
      setBoard(data);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Something went wrong loading the board.",
      );
    } finally {
      setLoading(false);
    }
  }, [boardId, priorityFilter]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { board, loading, error, priorityFilter, setPriorityFilter, refresh };
}
