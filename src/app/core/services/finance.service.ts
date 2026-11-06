import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { seedTransactions } from '../data/seed-data';
import { Transaction } from '../models';
import { createId } from '../utils/helpers';
import { Observable, tap } from 'rxjs';
import { API_URL, addAll, deleteAll } from './api';

export interface Summary {
  income: number;
  expense: number;
  profit: number;
}

@Injectable({ providedIn: 'root' })
export class FinanceService {
  private http = inject(HttpClient);
  private url = `${API_URL}/transactions`;

  transactions = signal<Transaction[]>([]);

  constructor() {
    this.load();
  }

  load(): void {
    this.http.get<Transaction[]>(this.url).subscribe((data) => this.transactions.set(data));
  }

  add(item: Omit<Transaction, 'id'>): void {
    this.http
      .post<Transaction>(this.url, { ...item, id: createId() })
      .subscribe((saved) => this.transactions.update((list) => [saved, ...list]));
  }

  update(id: string, item: Omit<Transaction, 'id'>): void {
    this.http
      .put<Transaction>(`${this.url}/${id}`, { ...item, id })
      .subscribe((saved) =>
        this.transactions.update((list) => list.map((t) => (t.id === id ? saved : t))),
      );
  }

  delete(id: string): void {
    this.http
      .delete(`${this.url}/${id}`)
      .subscribe(() => this.transactions.update((list) => list.filter((t) => t.id !== id)));
  }

  clearAll(): Observable<unknown> {
    return deleteAll(this.http, this.url, this.transactions());
  }

  addDemoData(): Observable<unknown> {
    return addAll(this.http, this.url, seedTransactions()).pipe(tap(() => this.load()));
  }

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
}
