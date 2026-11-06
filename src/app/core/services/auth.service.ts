import { Injectable, computed, inject, signal } from '@angular/core';
import { User } from '../models';
import { StorageService } from './storage.service';

export const DEMO_EMAIL = 'admin@smartfarm.com';
export const DEMO_PASSWORD = 'farm123';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private storage = inject(StorageService);

  user = signal<User | null>(this.storage.get<User | null>('user', null));
  isLoggedIn = computed(() => this.user() !== null);

  login(email: string, password: string): boolean {
    if (email.trim().toLowerCase() !== DEMO_EMAIL || password !== DEMO_PASSWORD) {
      return false;
    }
    const user: User = { email: DEMO_EMAIL, name: 'Farm Admin' };
    this.user.set(user);
    this.storage.set('user', user);
    return true;
  }

  logout(): void {
    this.user.set(null);
    this.storage.remove('user');
  }
}
