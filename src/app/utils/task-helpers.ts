// src/app/utils/task-utils.ts

export interface Task {
  status: 'ACCEPTED' | 'PENDING' | 'REJECTED'
}

export interface TaskStats {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  rejectedTasks: number;
}

export function calculateTaskStats(tasks: Task[]): TaskStats {
  return {
    totalTasks: tasks.length,
    completedTasks: tasks.filter(task => task.status === 'ACCEPTED').length,
    pendingTasks: tasks.filter(task => task.status === 'PENDING').length,
    rejectedTasks: tasks.filter(task => task.status === 'REJECTED').length,
  };
}

export function assignTaskStats(component: any, tasks: Task[]) {
  const stats = calculateTaskStats(tasks);
  component.tasks = tasks;
  component.totalTasks = stats.totalTasks;
  component.completedTasks = stats.completedTasks;
  component.pendingTasks = stats.pendingTasks;
  component.rejectedTasks = stats.rejectedTasks;
}
