export type TaskStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

export interface Task {
  id: number;
  title: string;
  description: string;
  duration: number;
  creationDate: string;
  date: string;
  status: TaskStatus;
  userId: number | null;
}
