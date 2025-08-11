export type Task = {
  localId: string;
  serverId?: number;
  title: string;
  description?: string;
  completed: boolean;
  updatedAt: number;
  synced?: boolean;
};

export type Op =
  | { type: 'create'; task: Task }
  | { type: 'update'; task: Task }
  | { type: 'delete'; localId: string; serverId?: number };

export const TASKS_KEY = 'TASKS_V1';
export const OPS_KEY = 'TASK_OPS_V1';
