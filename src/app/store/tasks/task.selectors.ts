import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TaskState } from './task.state';

export const selectTaskState = createFeatureSelector<TaskState>('tasks');

export const selectAllTasks = createSelector(
  selectTaskState,
  (state) => state.tasks
);

export const selectActiveTasks = createSelector(
  selectAllTasks,
  (tasks) => tasks.filter(task => !task.completed)
);

export const selectCompletedTasks = createSelector(
  selectAllTasks,
  (tasks) => tasks.filter(task => task.completed)
);

export const selectTasksByUser = (userId: string) => createSelector(
  selectAllTasks,
  (tasks) => tasks.filter(task => task.userId === userId)
);