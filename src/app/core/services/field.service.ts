import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { seedFields } from '../data/seed-data';
import { Field } from '../models';
import { createId } from '../utils/helpers';
import { Observable, tap } from 'rxjs';
import { API_URL, addAll, deleteAll } from './api';

@Injectable({ providedIn: 'root' })
export class FieldService {
  private http = inject(HttpClient);
  private url = `${API_URL}/fields`;

  fields = signal<Field[]>([]);
  activeFields = computed(() => this.fields().filter((f) => f.status === 'Active'));
  totalArea = computed(() => this.fields().reduce((sum, f) => sum + f.area, 0));

  constructor() {
    this.load();
  }

  load(): void {
    this.http.get<Field[]>(this.url).subscribe((data) => this.fields.set(data));
  }

  add(item: Omit<Field, 'id'>): void {
    this.http
      .post<Field>(this.url, { ...item, id: createId() })
      .subscribe((saved) => this.fields.update((list) => [saved, ...list]));
  }

  update(id: string, item: Omit<Field, 'id'>): void {
    this.http
      .put<Field>(`${this.url}/${id}`, { ...item, id })
      .subscribe((saved) =>
        this.fields.update((list) => list.map((f) => (f.id === id ? saved : f))),
      );
  }

  delete(id: string, afterDelete?: () => void): void {
    this.http.delete(`${this.url}/${id}`).subscribe(() => {
      this.fields.update((list) => list.filter((f) => f.id !== id));
      afterDelete?.();
    });
  }

  clearAll(): Observable<unknown> {
    return deleteAll(this.http, this.url, this.fields());
  }

  addDemoData(): Observable<unknown> {
    return addAll(this.http, this.url, seedFields()).pipe(tap(() => this.load()));
  }

  getName(id: string): string {
    return this.fields().find((f) => f.id === id)?.name ?? '-';
  }
}
