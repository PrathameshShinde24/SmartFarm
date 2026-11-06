import { Component, computed, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import {
  FormControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { INVENTORY_CATEGORIES, InventoryCategory, InventoryItem, UNITS } from '../../core/models';
import { InventoryService } from '../../core/services/inventory.service';
import { ConfirmDialog } from '../../shared/components/confirm-dialog/confirm-dialog';
import { EmptyState } from '../../shared/components/empty-state/empty-state';
import { Modal } from '../../shared/components/modal/modal';
import { PageHeader } from '../../shared/components/page-header/page-header';
import { StatusBadge } from '../../shared/components/status-badge/status-badge';
import { LowStock } from '../../shared/directives/low-stock';

@Component({
  selector: 'app-inventory',
  imports: [
    CurrencyPipe,
    ReactiveFormsModule,
    LowStock,
    PageHeader,
    StatusBadge,
    EmptyState,
    Modal,
    ConfirmDialog,
  ],
  templateUrl: './inventory.html',
})
export class Inventory {
  inventoryService = inject(InventoryService);
  private fb = inject(NonNullableFormBuilder);

  categories = INVENTORY_CATEGORIES;
  units = UNITS;

  search = signal('');
  categoryFilter = signal('All');
  showForm = signal(false);
  editId = signal<string | null>(null);
  itemToDelete = signal<InventoryItem | null>(null);
  itemToRestock = signal<InventoryItem | null>(null);

  filteredItems = computed(() => {
    const text = this.search().toLowerCase();
    return this.inventoryService
      .items()
      .filter(
        (i) =>
          i.name.toLowerCase().includes(text) &&
          (this.categoryFilter() === 'All' || i.category === this.categoryFilter()),
      );
  });

  form = this.fb.group({
    name: ['', Validators.required],
    category: this.fb.control<InventoryCategory>('Seeds'),
    quantity: [0, [Validators.required, Validators.min(0)]],
    unit: ['kg'],
    reorderLevel: [0, [Validators.required, Validators.min(0)]],
    costPerUnit: [0, [Validators.required, Validators.min(0)]],
  });

  restockQuantity = new FormControl(10, {
    nonNullable: true,
    validators: [Validators.required, Validators.min(1)],
  });

  openAddForm(): void {
    this.editId.set(null);
    this.form.reset();
    this.showForm.set(true);
  }

  openEditForm(item: InventoryItem): void {
    this.editId.set(item.id);
    this.form.setValue({
      name: item.name,
      category: item.category,
      quantity: item.quantity,
      unit: item.unit,
      reorderLevel: item.reorderLevel,
      costPerUnit: item.costPerUnit,
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
      this.inventoryService.update(id, this.form.getRawValue());
    } else {
      this.inventoryService.add(this.form.getRawValue());
    }
    this.showForm.set(false);
  }

  openRestock(item: InventoryItem): void {
    this.restockQuantity.setValue(item.reorderLevel);
    this.itemToRestock.set(item);
  }

  restock(): void {
    const item = this.itemToRestock();
    if (!item || this.restockQuantity.invalid) {
      this.restockQuantity.markAsTouched();
      return;
    }
    this.inventoryService.restock(item, this.restockQuantity.value);
    this.itemToRestock.set(null);
  }

  deleteItem(): void {
    const item = this.itemToDelete();
    if (item) {
      this.inventoryService.delete(item.id);
    }
    this.itemToDelete.set(null);
  }
}
