export interface Task {
  id: number;
  title: string;
  description: string;
  duration: number;
  creationDate: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  userId: number | null;
}
