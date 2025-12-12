export interface Task {
  id: string;
  userId: string;
  title: string;
  description: string;
  priority: number;
  dueDate: Date;
  completed: boolean;
  createdAt: Date;
}