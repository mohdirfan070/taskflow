import type { Priority } from '../types';

export const PRIORITY_COLOR: Record<Priority, string> = {
  High: 'priorityHigh',
  Medium: 'priorityMedium',
  Low: 'priorityLow',
};

export const PRIORITY_LABEL: Record<Priority, string> = {
  High: 'High priority',
  Medium: 'Medium priority',
  Low: 'Low priority',
};
