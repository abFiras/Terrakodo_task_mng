import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Task } from '../../models/task.model';
import * as TaskActions from '../../store/tasks/task.actions';
import { selectCurrentUser } from '../../store/auth/auth.selectors';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent implements OnInit {
  @Input() task: Task | null = null;
  @Output() taskSaved = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  taskForm: FormGroup;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private store: Store
  ) {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      priority: [3, [Validators.required, Validators.min(1), Validators.max(5)]],
      dueDate: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.task) {
      this.isEditMode = true;
      this.taskForm.patchValue({
        title: this.task.title,
        description: this.task.description,
        priority: this.task.priority,
        dueDate: this.formatDateForInput(this.task.dueDate)
      });
    }
  }

  formatDateForInput(date: Date): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      this.store.select(selectCurrentUser).pipe(take(1)).subscribe(userId => {
        if (userId) {
          const formValue = this.taskForm.value;
          
          if (this.isEditMode && this.task) {
            const updatedTask: Task = {
              ...this.task,
              title: formValue.title,
              description: formValue.description,
              priority: formValue.priority,
              dueDate: new Date(formValue.dueDate)
            };
            this.store.dispatch(TaskActions.updateTask({ task: updatedTask }));
          } else {
            const newTask: Task = {
              id: this.generateId(),
              userId: userId,
              title: formValue.title,
              description: formValue.description,
              priority: formValue.priority,
              dueDate: new Date(formValue.dueDate),
              completed: false,
              createdAt: new Date()
            };
            this.store.dispatch(TaskActions.addTask({ task: newTask }));
          }
          
          this.taskSaved.emit();
          this.taskForm.reset({ priority: 3 });
        }
      });
    }
  }

  onCancel(): void {
    this.cancelled.emit();
    this.taskForm.reset({ priority: 3 });
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}