export type WorkerRole = 'Supervisor' | 'Field Worker' | 'Tractor Operator' | 'Sprayer';
export type WorkerStatus = 'Active' | 'On Leave';

export interface Worker {
  id: string;
  name: string;
  role: WorkerRole;
  phone: string;
  dailyWage: number;
  status: WorkerStatus;
}

export const WORKER_ROLES: WorkerRole[] = [
  'Supervisor',
  'Field Worker',
  'Tractor Operator',
  'Sprayer',
];
export const WORKER_STATUSES: WorkerStatus[] = ['Active', 'On Leave'];
