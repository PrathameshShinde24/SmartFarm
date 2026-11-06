import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CropService } from '../../core/services/crop.service';
import { FieldService } from '../../core/services/field.service';
import { FinanceService } from '../../core/services/finance.service';
import { InventoryService } from '../../core/services/inventory.service';
import { SensorService } from '../../core/services/sensor.service';
import { SettingsService } from '../../core/services/settings.service';
import { TaskService } from '../../core/services/task.service';
import { WorkerService } from '../../core/services/worker.service';
import { ConfirmDialog } from '../../shared/components/confirm-dialog/confirm-dialog';
import { PageHeader } from '../../shared/components/page-header/page-header';

@Component({
  selector: 'app-settings',
  imports: [ReactiveFormsModule, PageHeader, ConfirmDialog],
  templateUrl: './settings.html',
})
export class Settings {
  settingsService = inject(SettingsService);
  private fieldService = inject(FieldService);
  private cropService = inject(CropService);
  private taskService = inject(TaskService);
  private inventoryService = inject(InventoryService);
  private workerService = inject(WorkerService);
  private financeService = inject(FinanceService);
  private sensorService = inject(SensorService);
  private fb = inject(NonNullableFormBuilder);

  showResetConfirm = signal(false);
  savedMessage = signal('');

  form = this.fb.group({
    farmName: [this.settingsService.settings().farmName, Validators.required],
    ownerName: [this.settingsService.settings().ownerName, Validators.required],
  });

  saveProfile(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { farmName, ownerName } = this.form.getRawValue();
    this.settingsService.saveProfile(farmName, ownerName);
    this.savedMessage.set('Profile saved.');
  }

  resetData(): void {
    this.fieldService.reset();
    this.cropService.reset();
    this.taskService.reset();
    this.inventoryService.reset();
    this.workerService.reset();
    this.financeService.reset();
    this.sensorService.reset();
    this.settingsService.reset();
    this.form.setValue({
      farmName: this.settingsService.settings().farmName,
      ownerName: this.settingsService.settings().ownerName,
    });
    this.showResetConfirm.set(false);
    this.savedMessage.set('Demo data has been reset.');
  }
}
