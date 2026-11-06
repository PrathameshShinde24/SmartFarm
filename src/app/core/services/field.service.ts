import { Injectable, computed, inject, signal } from '@angular/core';
import { seedFields } from '../data/seed-data';
import { Field } from '../models';
import { createId } from '../utils/helpers';
import { StorageService } from './storage.service';

@Injectable({ providedIn: 'root' })
export class FieldService {
  private storage = inject(StorageService);

  fields = signal<Field[]>(this.storage.get('fields', seedFields()));
  activeFields = computed(() => this.fields().filter((f) => f.status === 'Active'));
  totalArea = computed(() => this.fields().reduce((sum, f) => sum + f.area, 0));

  add(field: Omit<Field, 'id'>): void {
    this.fields.update((list) => [{ ...field, id: createId() }, ...list]);
    this.save();
  }

  update(id: string, field: Omit<Field, 'id'>): void {
    this.fields.update((list) => list.map((f) => (f.id === id ? { ...field, id } : f)));
    this.save();
  }

  delete(id: string): void {
    this.fields.update((list) => list.filter((f) => f.id !== id));
    this.save();
  }

  getName(id: string): string {
    return this.fields().find((f) => f.id === id)?.name ?? '-';
  }

  reset(): void {
    this.fields.set(seedFields());
    this.save();
  }

  private save(): void {
    this.storage.set('fields', this.fields());
  }
}
