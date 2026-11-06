import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { seedCrops } from '../data/seed-data';
import { Crop } from '../models';
import { createId, daysBetween, today } from '../utils/helpers';
import { Observable, tap } from 'rxjs';
import { API_URL, addAll, deleteAll } from './api';

@Injectable({ providedIn: 'root' })
export class CropService {
  private http = inject(HttpClient);
  private url = `${API_URL}/crops`;

  crops = signal<Crop[]>([]);
  activeCrops = computed(() => this.crops().filter((c) => c.stage !== 'Harvested'));

  constructor() {
    this.load();
  }

  load(): void {
    this.http.get<Crop[]>(this.url).subscribe((data) => this.crops.set(data));
  }

  add(item: Omit<Crop, 'id'>): void {
    this.http
      .post<Crop>(this.url, { ...item, id: createId() })
      .subscribe((saved) => this.crops.update((list) => [saved, ...list]));
  }

  update(id: string, item: Omit<Crop, 'id'>): void {
    this.http
      .put<Crop>(`${this.url}/${id}`, { ...item, id })
      .subscribe((saved) =>
        this.crops.update((list) => list.map((c) => (c.id === id ? saved : c))),
      );
  }

  delete(id: string): void {
    this.http
      .delete(`${this.url}/${id}`)
      .subscribe(() => this.crops.update((list) => list.filter((c) => c.id !== id)));
  }

  clearAll(): Observable<unknown> {
    return deleteAll(this.http, this.url, this.crops());
  }

  addDemoData(): Observable<unknown> {
    return addAll(this.http, this.url, seedCrops()).pipe(tap(() => this.load()));
  }

  getProgress(crop: Crop): number {
    if (crop.stage === 'Harvested') {
      return 100;
    }
    const totalDays = daysBetween(crop.sowingDate, crop.harvestDate);
    const daysPassed = daysBetween(crop.sowingDate, today());
    if (totalDays <= 0) {
      return 100;
    }
    return Math.min(100, Math.max(0, Math.round((daysPassed / totalDays) * 100)));
  }
}
