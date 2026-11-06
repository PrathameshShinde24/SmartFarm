import { Injectable, computed, inject, signal } from '@angular/core';
import { seedCrops } from '../data/seed-data';
import { Crop } from '../models';
import { createId, daysBetween, today } from '../utils/helpers';
import { StorageService } from './storage.service';

@Injectable({ providedIn: 'root' })
export class CropService {
  private storage = inject(StorageService);

  crops = signal<Crop[]>(this.storage.get('crops', seedCrops()));
  activeCrops = computed(() => this.crops().filter((c) => c.stage !== 'Harvested'));

  add(crop: Omit<Crop, 'id'>): void {
    this.crops.update((list) => [{ ...crop, id: createId() }, ...list]);
    this.save();
  }

  update(id: string, crop: Omit<Crop, 'id'>): void {
    this.crops.update((list) => list.map((c) => (c.id === id ? { ...crop, id } : c)));
    this.save();
  }

  delete(id: string): void {
    this.crops.update((list) => list.filter((c) => c.id !== id));
    this.save();
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

  reset(): void {
    this.crops.set(seedCrops());
    this.save();
  }

  private save(): void {
    this.storage.set('crops', this.crops());
  }
}
