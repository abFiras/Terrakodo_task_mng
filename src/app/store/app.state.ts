import { ActionReducerMap } from '@ngrx/store';
import { AuthState } from './auth/auth.state';
import { TaskState } from './tasks/task.state';
import { authReducer } from './auth/auth.reducer';
import { taskReducer } from './tasks/task.reducer';

export interface AppState {
  auth: AuthState;
  tasks: TaskState;
}

export const reducers: ActionReducerMap<AppState> = {
  auth: authReducer,
  tasks: taskReducer
};