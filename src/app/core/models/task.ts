export type TaskType =
  'Irrigation' | 'Fertilizing' | 'Spraying' | 'Sowing' | 'Harvesting' | 'Maintenance';
export type TaskPriority = 'Low' | 'Medium' | 'High';
export type TaskStatus = 'Pending' | 'In Progress' | 'Done';

export interface Task {
  id: string;
  title: string;
  type: TaskType;
  fieldId: string;
  workerId: string;
  dueDate: string;
  priority: TaskPriority;
  status: TaskStatus;
}

export const TASK_TYPES: TaskType[] = [
  'Irrigation',
  'Fertilizing',
  'Spraying',
  'Sowing',
  'Harvesting',
  'Maintenance',
];
export const TASK_PRIORITIES: TaskPriority[] = ['Low', 'Medium', 'High'];
export const TASK_STATUSES: TaskStatus[] = ['Pending', 'In Progress', 'Done'];
