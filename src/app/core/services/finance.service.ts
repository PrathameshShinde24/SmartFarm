import { Injectable, inject, signal } from '@angular/core';
import { seedTransactions } from '../data/seed-data';
import { Transaction } from '../models';
import { createId } from '../utils/helpers';
import { StorageService } from './storage.service';

export interface Summary {
  income: number;
  expense: number;
  profit: number;
}

@Injectable({ providedIn: 'root' })
export class FinanceService {
  private storage = inject(StorageService);

  transactions = signal<Transaction[]>(this.storage.get('transactions', seedTransactions()));

  getByMonth(month: string): Transaction[] {
    return this.transactions()
      .filter((t) => t.date.startsWith(month))
      .sort((a, b) => b.date.localeCompare(a.date));
  }

  getSummary(month: string): Summary {
    let income = 0;
    let expense = 0;
    for (const t of this.getByMonth(month)) {
      if (t.type === 'Income') {
        income += t.amount;
      } else {
        expense += t.amount;
      }
    }
    return { income, expense, profit: income - expense };
  }

  add(transaction: Omit<Transaction, 'id'>): void {
    this.transactions.update((list) => [{ ...transaction, id: createId() }, ...list]);
    this.save();
  }

  update(id: string, transaction: Omit<Transaction, 'id'>): void {
    this.transactions.update((list) => list.map((t) => (t.id === id ? { ...transaction, id } : t)));
    this.save();
  }

  delete(id: string): void {
    this.transactions.update((list) => list.filter((t) => t.id !== id));
    this.save();
  }

  reset(): void {
    this.transactions.set(seedTransactions());
    this.save();
  }

  private save(): void {
    this.storage.set('transactions', this.transactions());
  }
}
