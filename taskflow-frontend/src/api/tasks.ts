import { apiClient } from './client';
import type { Priority, Task } from '../types';

export interface CreateTaskInput {
  column_id: number;
  title: string;
  description?: string;
  priority?: Priority;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string | null;
  priority?: Priority;
}

export function createTask(input: CreateTaskInput): Promise<Task> {
  return apiClient.request<Task>('/tasks', { method: 'POST', body: input });
}

export function updateTask(id: number, input: UpdateTaskInput): Promise<Task> {
  return apiClient.request<Task>(`/tasks/${id}`, { method: 'PUT', body: input });
}

export function moveTask(id: number, columnId: number): Promise<Task> {
  return apiClient.request<Task>(`/tasks/${id}/move`, {
    method: 'PATCH',
    body: { column_id: columnId },
  });
}

export function deleteTask(id: number): Promise<void> {
  return apiClient.request<void>(`/tasks/${id}`, { method: 'DELETE' });
}
