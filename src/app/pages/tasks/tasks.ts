import { Component, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  TASK_PRIORITIES,
  TASK_STATUSES,
  TASK_TYPES,
  Task,
  TaskPriority,
  TaskStatus,
  TaskType,
} from '../../core/models';
import { FieldService } from '../../core/services/field.service';
import { TaskService } from '../../core/services/task.service';
import { WorkerService } from '../../core/services/worker.service';
import { today } from '../../core/utils/helpers';
import { ConfirmDialog } from '../../shared/components/confirm-dialog/confirm-dialog';
import { EmptyState } from '../../shared/components/empty-state/empty-state';
import { Modal } from '../../shared/components/modal/modal';
import { PageHeader } from '../../shared/components/page-header/page-header';
import { StatusBadge } from '../../shared/components/status-badge/status-badge';
import { DaysLeftPipe } from '../../shared/pipes/days-left-pipe';

@Component({
  selector: 'app-tasks',
  imports: [
    DatePipe,
    ReactiveFormsModule,
    DaysLeftPipe,
    PageHeader,
    StatusBadge,
    EmptyState,
    Modal,
    ConfirmDialog,
  ],
  templateUrl: './tasks.html',
})
export class Tasks {
  taskService = inject(TaskService);
  fieldService = inject(FieldService);
  workerService = inject(WorkerService);
  private fb = inject(NonNullableFormBuilder);

  types = TASK_TYPES;
  priorities = TASK_PRIORITIES;
  statuses = TASK_STATUSES;
  tabs = ['All', 'Pending', 'In Progress', 'Done', 'Overdue'];

  activeTab = signal('All');
  showForm = signal(false);
  editId = signal<string | null>(null);
  taskToDelete = signal<Task | null>(null);

  filteredTasks = computed(() => {
    const tasks = [...this.taskService.tasks()].sort((a, b) => a.dueDate.localeCompare(b.dueDate));
    const tab = this.activeTab();
    if (tab === 'All') {
      return tasks;
    }
    if (tab === 'Overdue') {
      return tasks.filter((t) => this.taskService.isOverdue(t));
    }
    return tasks.filter((t) => t.status === tab);
  });

  form = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    type: this.fb.control<TaskType>('Irrigation'),
    fieldId: ['', Validators.required],
    workerId: ['', Validators.required],
    dueDate: [today(), Validators.required],
    priority: this.fb.control<TaskPriority>('Medium'),
    status: this.fb.control<TaskStatus>('Pending'),
  });

  countFor(tab: string): number {
    if (tab === 'All') {
      return this.taskService.tasks().length;
    }
    if (tab === 'Overdue') {
      return this.taskService.overdueTasks().length;
    }
    return this.taskService.tasks().filter((t) => t.status === tab).length;
  }

  openAddForm(): void {
    this.editId.set(null);
    this.form.reset();
    this.showForm.set(true);
  }

  openEditForm(task: Task): void {
    this.editId.set(task.id);
    this.form.setValue({
      title: task.title,
      type: task.type,
      fieldId: task.fieldId,
      workerId: task.workerId,
      dueDate: task.dueDate,
      priority: task.priority,
      status: task.status,
    });
    this.showForm.set(true);
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const id = this.editId();
    if (id) {
      this.taskService.update(id, this.form.getRawValue());
    } else {
      this.taskService.add(this.form.getRawValue());
    }
    this.showForm.set(false);
  }

  deleteTask(): void {
    const task = this.taskToDelete();
    if (task) {
      this.taskService.delete(task.id);
    }
    this.taskToDelete.set(null);
  }
}
