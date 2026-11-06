import { Component, computed, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  FIELD_STATUSES,
  Field,
  FieldStatus,
  IRRIGATION_TYPES,
  IrrigationType,
  SOIL_TYPES,
} from '../../core/models';
import { FieldService } from '../../core/services/field.service';
import { ConfirmDialog } from '../../shared/components/confirm-dialog/confirm-dialog';
import { EmptyState } from '../../shared/components/empty-state/empty-state';
import { Modal } from '../../shared/components/modal/modal';
import { PageHeader } from '../../shared/components/page-header/page-header';
import { StatusBadge } from '../../shared/components/status-badge/status-badge';

@Component({
  selector: 'app-fields',
  imports: [ReactiveFormsModule, PageHeader, StatusBadge, EmptyState, Modal, ConfirmDialog],
  templateUrl: './fields.html',
})
export class Fields {
  private fieldService = inject(FieldService);
  private fb = inject(NonNullableFormBuilder);

  soilTypes = SOIL_TYPES;
  irrigationTypes = IRRIGATION_TYPES;
  statuses = FIELD_STATUSES;

  search = signal('');
  statusFilter = signal('All');
  showForm = signal(false);
  editId = signal<string | null>(null);
  fieldToDelete = signal<Field | null>(null);

  totalArea = this.fieldService.totalArea;

  filteredFields = computed(() => {
    const text = this.search().toLowerCase();
    return this.fieldService.fields().filter((f) => {
      const matchesText =
        f.name.toLowerCase().includes(text) || f.location.toLowerCase().includes(text);
      const matchesStatus = this.statusFilter() === 'All' || f.status === this.statusFilter();
      return matchesText && matchesStatus;
    });
  });

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    area: [1, [Validators.required, Validators.min(0.1)]],
    soilType: ['', Validators.required],
    irrigation: this.fb.control<IrrigationType>('Drip'),
    location: ['', Validators.required],
    status: this.fb.control<FieldStatus>('Active'),
  });

  openAddForm(): void {
    this.editId.set(null);
    this.form.reset();
    this.showForm.set(true);
  }

  openEditForm(field: Field): void {
    this.editId.set(field.id);
    this.form.setValue({
      name: field.name,
      area: field.area,
      soilType: field.soilType,
      irrigation: field.irrigation,
      location: field.location,
      status: field.status,
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
      this.fieldService.update(id, this.form.getRawValue());
    } else {
      this.fieldService.add(this.form.getRawValue());
    }
    this.showForm.set(false);
  }

  deleteField(): void {
    const field = this.fieldToDelete();
    if (field) {
      this.fieldService.delete(field.id);
    }
    this.fieldToDelete.set(null);
  }
}
