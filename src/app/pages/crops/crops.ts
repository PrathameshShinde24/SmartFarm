import { Component, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import {
  AbstractControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import {
  CROP_HEALTH,
  CROP_NAMES,
  CROP_STAGES,
  Crop,
  CropHealth,
  CropStage,
} from '../../core/models';
import { CropService } from '../../core/services/crop.service';
import { FieldService } from '../../core/services/field.service';
import { daysFromToday, today } from '../../core/utils/helpers';
import { ConfirmDialog } from '../../shared/components/confirm-dialog/confirm-dialog';
import { EmptyState } from '../../shared/components/empty-state/empty-state';
import { Modal } from '../../shared/components/modal/modal';
import { PageHeader } from '../../shared/components/page-header/page-header';
import { StatusBadge } from '../../shared/components/status-badge/status-badge';
import { DaysLeftPipe } from '../../shared/pipes/days-left-pipe';

function harvestAfterSowing(group: AbstractControl): ValidationErrors | null {
  const sowing: string = group.get('sowingDate')?.value;
  const harvest: string = group.get('harvestDate')?.value;
  return sowing && harvest && harvest <= sowing ? { harvestBeforeSowing: true } : null;
}

@Component({
  selector: 'app-crops',
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
  templateUrl: './crops.html',
})
export class Crops {
  cropService = inject(CropService);
  fieldService = inject(FieldService);
  private fb = inject(NonNullableFormBuilder);

  cropNames = CROP_NAMES;
  stages = CROP_STAGES;
  healthOptions = CROP_HEALTH;

  stageFilter = signal('All');
  healthFilter = signal('All');
  showForm = signal(false);
  editId = signal<string | null>(null);
  cropToDelete = signal<Crop | null>(null);

  filteredCrops = computed(() =>
    this.cropService
      .crops()
      .filter(
        (c) =>
          (this.stageFilter() === 'All' || c.stage === this.stageFilter()) &&
          (this.healthFilter() === 'All' || c.health === this.healthFilter()),
      ),
  );

  form = this.fb.group(
    {
      crop: ['', Validators.required],
      variety: ['', Validators.required],
      fieldId: ['', Validators.required],
      sowingDate: [today(), Validators.required],
      harvestDate: [daysFromToday(120), Validators.required],
      stage: this.fb.control<CropStage>('Sowing'),
      health: this.fb.control<CropHealth>('Healthy'),
      expectedYield: [10, [Validators.required, Validators.min(1)]],
    },
    { validators: harvestAfterSowing },
  );

  openAddForm(): void {
    this.editId.set(null);
    this.form.reset();
    this.showForm.set(true);
  }

  openEditForm(crop: Crop): void {
    this.editId.set(crop.id);
    this.form.setValue({
      crop: crop.crop,
      variety: crop.variety,
      fieldId: crop.fieldId,
      sowingDate: crop.sowingDate,
      harvestDate: crop.harvestDate,
      stage: crop.stage,
      health: crop.health,
      expectedYield: crop.expectedYield,
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
      this.cropService.update(id, this.form.getRawValue());
    } else {
      this.cropService.add(this.form.getRawValue());
    }
    this.showForm.set(false);
  }

  deleteCrop(): void {
    const crop = this.cropToDelete();
    if (crop) {
      this.cropService.delete(crop.id);
    }
    this.cropToDelete.set(null);
  }
}
