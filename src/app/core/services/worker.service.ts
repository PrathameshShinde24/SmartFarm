import { Injectable, inject, signal } from '@angular/core';
import { seedWorkers } from '../data/seed-data';
import { Worker } from '../models';
import { createId } from '../utils/helpers';
import { StorageService } from './storage.service';

@Injectable({ providedIn: 'root' })
export class WorkerService {
  private storage = inject(StorageService);

  workers = signal<Worker[]>(this.storage.get('workers', seedWorkers()));

  add(worker: Omit<Worker, 'id'>): void {
    this.workers.update((list) => [{ ...worker, id: createId() }, ...list]);
    this.save();
  }

  update(id: string, worker: Omit<Worker, 'id'>): void {
    this.workers.update((list) => list.map((w) => (w.id === id ? { ...worker, id } : w)));
    this.save();
  }

  delete(id: string): void {
    this.workers.update((list) => list.filter((w) => w.id !== id));
    this.save();
  }

  getName(id: string): string {
    return this.workers().find((w) => w.id === id)?.name ?? 'Unassigned';
  }

  reset(): void {
    this.workers.set(seedWorkers());
    this.save();
  }

  private save(): void {
    this.storage.set('workers', this.workers());
  }
}
