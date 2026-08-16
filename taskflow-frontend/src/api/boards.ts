import { apiClient } from './client';
import type { Board, BoardSummary, Priority } from '../types';

export function fetchBoards(): Promise<BoardSummary[]> {
  return apiClient.request<BoardSummary[]>('/boards');
}

export function fetchBoard(boardId: number, priority?: Priority): Promise<Board> {
  const query = priority ? `?priority=${encodeURIComponent(priority)}` : '';
  return apiClient.request<Board>(`/boards/${boardId}${query}`);
}
