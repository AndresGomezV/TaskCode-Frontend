export interface Notification {
  id: number;
  userId: number;
  senderUsername: string;
  taskId: number;
  taskTitle: string;
  notificationType: NotificationType;
  isRead: boolean;
  time: Date
}

export type NotificationType = 'TASK_ACCEPTED' | 'TASK_REJECTED' | 'TASK_PENDING'
