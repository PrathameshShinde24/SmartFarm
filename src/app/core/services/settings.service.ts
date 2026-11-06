import { Injectable, inject, signal } from '@angular/core';
import { seedSettings } from '../data/seed-data';
import { AppSettings } from '../models';
import { StorageService } from './storage.service';

@Injectable({ providedIn: 'root' })
export class SettingsService {
  private storage = inject(StorageService);

  settings = signal<AppSettings>(this.storage.get('settings', seedSettings()));

  constructor() {
    this.applyTheme();
  }

  saveProfile(farmName: string, ownerName: string): void {
    this.settings.update((s) => ({ ...s, farmName, ownerName }));
    this.save();
  }

  toggleTheme(): void {
    this.settings.update((s) => ({ ...s, theme: s.theme === 'light' ? 'dark' : 'light' }));
    this.save();
    this.applyTheme();
  }

  reset(): void {
    this.settings.update((s) => ({ ...seedSettings(), theme: s.theme }));
    this.save();
  }

  private applyTheme(): void {
    document.documentElement.setAttribute('data-theme', this.settings().theme);
  }

  private save(): void {
    this.storage.set('settings', this.settings());
  }
}
