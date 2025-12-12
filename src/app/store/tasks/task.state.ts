import { Task } from '../../models/task.model';

export interface TaskState {
  tasks: Task[];
}

export const initialTaskState: TaskState = {
  tasks: []
};