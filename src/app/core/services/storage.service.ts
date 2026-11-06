import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class StorageService {
  get<T>(key: string, defaultValue: T): T {
    const saved = localStorage.getItem('smartfarm_' + key);
    return saved ? (JSON.parse(saved) as T) : defaultValue;
  }

  set<T>(key: string, value: T): void {
    localStorage.setItem('smartfarm_' + key, JSON.stringify(value));
  }

  remove(key: string): void {
    localStorage.removeItem('smartfarm_' + key);
  }
}
