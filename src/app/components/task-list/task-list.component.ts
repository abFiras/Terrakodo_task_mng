import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Task } from '../../models/task.model';
import * as AuthActions from '../../store/auth/auth.actions';
import * as TaskActions from '../../store/tasks/task.actions';
import { selectCurrentUser } from '../../store/auth/auth.selectors';
import { selectAllTasks } from '../../store/tasks/task.selectors';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {
  currentUser$: Observable<string | null>;
  tasks$: Observable<Task[]>;
  activeTasks$: Observable<Task[]>;
  completedTasks$: Observable<Task[]>;
  currentUserId: string = '';
  showAddForm = false;
  editingTask: Task | null = null;

  constructor(
    private store: Store,
    private router: Router
  ) {
    this.currentUser$ = this.store.select(selectCurrentUser);
    
    // Get current user ID
    this.currentUser$.subscribe(userId => {
      if (userId) {
        this.currentUserId = userId;
      }
    });
    
    // Filter tasks by current user
    this.tasks$ = this.store.select(selectAllTasks).pipe(
      map(tasks => tasks.filter(t => t.userId === this.currentUserId))
    );
    
    this.activeTasks$ = this.tasks$.pipe(
      map(tasks => tasks.filter(t => !t.completed).sort((a, b) => b.priority - a.priority))
    );
    
    this.completedTasks$ = this.tasks$.pipe(
      map(tasks => tasks.filter(t => t.completed))
    );
  }

  ngOnInit(): void {}

  logout(): void {
    // Don't clear tasks - just logout
    this.store.dispatch(AuthActions.logout());
    this.router.navigate(['/login']);
  }

  toggleAddForm(): void {
    this.showAddForm = !this.showAddForm;
    this.editingTask = null;
  }

  onTaskAdded(): void {
    this.showAddForm = false;
  }

  onEditTask(task: Task): void {
    this.editingTask = task;
    this.showAddForm = true;
  }

  onTaskUpdated(): void {
    this.showAddForm = false;
    this.editingTask = null;
  }

  onDeleteTask(id: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
      this.store.dispatch(TaskActions.deleteTask({ id }));
    }
  }

  onToggleComplete(id: string): void {
    this.store.dispatch(TaskActions.toggleTaskCompletion({ id }));
  }

  getPriorityLabel(priority: number): string {
    const labels: { [key: number]: string } = {
      1: 'Très faible',
      2: 'Faible',
      3: 'Moyenne',
      4: 'Élevée',
      5: 'Critique'
    };
    return labels[priority] || '';
  }

  getPriorityClass(priority: number): string {
    return `priority-${priority}`;
  }
}