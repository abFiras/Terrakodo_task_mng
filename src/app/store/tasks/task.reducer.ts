import { createReducer, on } from '@ngrx/store';
import { TaskState, initialTaskState } from './task.state';
import * as TaskActions from './task.actions';

export const taskReducer = createReducer(
  initialTaskState,
  on(TaskActions.addTask, (state, { task }) => ({
    ...state,
    tasks: [...state.tasks, task]
  })),
  on(TaskActions.updateTask, (state, { task }) => ({
    ...state,
    tasks: state.tasks.map(t => t.id === task.id ? task : t)
  })),
  on(TaskActions.deleteTask, (state, { id }) => ({
    ...state,
    tasks: state.tasks.filter(t => t.id !== id)
  })),
  on(TaskActions.toggleTaskCompletion, (state, { id }) => ({
    ...state,
    tasks: state.tasks.map(t => 
      t.id === id ? { ...t, completed: !t.completed } : t
    )
  })),
  on(TaskActions.clearAllTasks, () => initialTaskState)
);