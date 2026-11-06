import { Component, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { WORKER_ROLES, WORKER_STATUSES, Worker, WorkerRole, WorkerStatus } from '../../core/models';
import { TaskService } from '../../core/services/task.service';
import { WorkerService } from '../../core/services/worker.service';
import { ConfirmDialog } from '../../shared/components/confirm-dialog/confirm-dialog';
import { EmptyState } from '../../shared/components/empty-state/empty-state';
import { Modal } from '../../shared/components/modal/modal';
import { PageHeader } from '../../shared/components/page-header/page-header';
import { StatusBadge } from '../../shared/components/status-badge/status-badge';

@Component({
  selector: 'app-workers',
  imports: [
    CurrencyPipe,
    ReactiveFormsModule,
    PageHeader,
    StatusBadge,
    EmptyState,
    Modal,
    ConfirmDialog,
  ],
  templateUrl: './workers.html',
})
export class Workers {
  workerService = inject(WorkerService);
  taskService = inject(TaskService);
  private fb = inject(NonNullableFormBuilder);

  roles = WORKER_ROLES;
  statuses = WORKER_STATUSES;

  showForm = signal(false);
  editId = signal<string | null>(null);
  workerToDelete = signal<Worker | null>(null);

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    role: this.fb.control<WorkerRole>('Field Worker'),
    phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
    dailyWage: [450, [Validators.required, Validators.min(100)]],
    status: this.fb.control<WorkerStatus>('Active'),
  });

  openAddForm(): void {
    this.editId.set(null);
    this.form.reset();
    this.showForm.set(true);
  }

  openEditForm(worker: Worker): void {
    this.editId.set(worker.id);
    this.form.setValue({
      name: worker.name,
      role: worker.role,
      phone: worker.phone,
      dailyWage: worker.dailyWage,
      status: worker.status,
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
      this.workerService.update(id, this.form.getRawValue());
    } else {
      this.workerService.add(this.form.getRawValue());
    }
    this.showForm.set(false);
  }

  deleteWorker(): void {
    const worker = this.workerToDelete();
    if (worker) {
      this.workerService.delete(worker.id);
    }
    this.workerToDelete.set(null);
  }
}
