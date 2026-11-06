import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { seedInventory } from '../data/seed-data';
import { InventoryItem } from '../models';
import { createId } from '../utils/helpers';
import { Observable, tap } from 'rxjs';
import { API_URL, addAll, deleteAll } from './api';

@Injectable({ providedIn: 'root' })
export class InventoryService {
  private http = inject(HttpClient);
  private url = `${API_URL}/inventory`;

  items = signal<InventoryItem[]>([]);
  lowStockItems = computed(() => this.items().filter((i) => i.quantity <= i.reorderLevel));

  constructor() {
    this.load();
  }

  load(): void {
    this.http.get<InventoryItem[]>(this.url).subscribe((data) => this.items.set(data));
  }

  add(item: Omit<InventoryItem, 'id'>): void {
    this.http
      .post<InventoryItem>(this.url, { ...item, id: createId() })
      .subscribe((saved) => this.items.update((list) => [saved, ...list]));
  }

  update(id: string, item: Omit<InventoryItem, 'id'>): void {
    this.http
      .put<InventoryItem>(`${this.url}/${id}`, { ...item, id })
      .subscribe((saved) =>
        this.items.update((list) => list.map((i) => (i.id === id ? saved : i))),
      );
  }

  delete(id: string): void {
    this.http
      .delete(`${this.url}/${id}`)
      .subscribe(() => this.items.update((list) => list.filter((i) => i.id !== id)));
  }

  clearAll(): Observable<unknown> {
    return deleteAll(this.http, this.url, this.items());
  }

  addDemoData(): Observable<unknown> {
    return addAll(this.http, this.url, seedInventory()).pipe(tap(() => this.load()));
  }

  restock(item: InventoryItem, quantity: number): void {
    if (quantity <= 0) {
      return;
    }
    const { id, ...rest } = item;
    this.update(id, { ...rest, quantity: rest.quantity + quantity });
  }
}
