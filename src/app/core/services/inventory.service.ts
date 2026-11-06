import { Injectable, computed, inject, signal } from '@angular/core';
import { seedInventory } from '../data/seed-data';
import { InventoryItem } from '../models';
import { createId } from '../utils/helpers';
import { StorageService } from './storage.service';

@Injectable({ providedIn: 'root' })
export class InventoryService {
  private storage = inject(StorageService);

  items = signal<InventoryItem[]>(this.storage.get('inventory', seedInventory()));
  lowStockItems = computed(() => this.items().filter((i) => i.quantity <= i.reorderLevel));

  add(item: Omit<InventoryItem, 'id'>): void {
    this.items.update((list) => [{ ...item, id: createId() }, ...list]);
    this.save();
  }

  update(id: string, item: Omit<InventoryItem, 'id'>): void {
    this.items.update((list) => list.map((i) => (i.id === id ? { ...item, id } : i)));
    this.save();
  }

  restock(id: string, quantity: number): void {
    if (quantity <= 0) {
      return;
    }
    this.items.update((list) =>
      list.map((i) => (i.id === id ? { ...i, quantity: i.quantity + quantity } : i)),
    );
    this.save();
  }

  delete(id: string): void {
    this.items.update((list) => list.filter((i) => i.id !== id));
    this.save();
  }

  reset(): void {
    this.items.set(seedInventory());
    this.save();
  }

  private save(): void {
    this.storage.set('inventory', this.items());
  }
}
