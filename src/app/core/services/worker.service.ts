import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { seedWorkers } from '../data/seed-data';
import { Worker } from '../models';
import { createId } from '../utils/helpers';
import { Observable, tap } from 'rxjs';
import { API_URL, addAll, deleteAll } from './api';

@Injectable({ providedIn: 'root' })
export class WorkerService {
  private http = inject(HttpClient);
  private url = `${API_URL}/workers`;

  workers = signal<Worker[]>([]);

  constructor() {
    this.load();
  }

  load(): void {
    this.http.get<Worker[]>(this.url).subscribe((data) => this.workers.set(data));
  }

  add(item: Omit<Worker, 'id'>): void {
    this.http
      .post<Worker>(this.url, { ...item, id: createId() })
      .subscribe((saved) => this.workers.update((list) => [saved, ...list]));
  }

  update(id: string, item: Omit<Worker, 'id'>): void {
    this.http
      .put<Worker>(`${this.url}/${id}`, { ...item, id })
      .subscribe((saved) =>
        this.workers.update((list) => list.map((w) => (w.id === id ? saved : w))),
      );
  }

  delete(id: string, afterDelete?: () => void): void {
    this.http.delete(`${this.url}/${id}`).subscribe(() => {
      this.workers.update((list) => list.filter((w) => w.id !== id));
      afterDelete?.();
    });
  }

  clearAll(): Observable<unknown> {
    return deleteAll(this.http, this.url, this.workers());
  }

  addDemoData(): Observable<unknown> {
    return addAll(this.http, this.url, seedWorkers()).pipe(tap(() => this.load()));
  }

  getName(id: string): string {
    return this.workers().find((w) => w.id === id)?.name ?? 'Unassigned';
  }
}
