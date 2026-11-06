import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { seedTasks } from '../data/seed-data';
import { Task } from '../models';
import { createId, today } from '../utils/helpers';
import { Observable, tap } from 'rxjs';
import { API_URL, addAll, deleteAll } from './api';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private http = inject(HttpClient);
  private url = `${API_URL}/tasks`;

  tasks = signal<Task[]>([]);
  overdueTasks = computed(() => this.tasks().filter((t) => this.isOverdue(t)));
  todayTasks = computed(() =>
    this.tasks().filter((t) => t.dueDate === today() && t.status !== 'Done'),
  );

  constructor() {
    this.load();
  }

  load(): void {
    this.http.get<Task[]>(this.url).subscribe((data) => this.tasks.set(data));
  }

  add(item: Omit<Task, 'id'>): void {
    this.http
      .post<Task>(this.url, { ...item, id: createId() })
      .subscribe((saved) => this.tasks.update((list) => [saved, ...list]));
  }

  update(id: string, item: Omit<Task, 'id'>): void {
    this.http
      .put<Task>(`${this.url}/${id}`, { ...item, id })
      .subscribe((saved) =>
        this.tasks.update((list) => list.map((t) => (t.id === id ? saved : t))),
      );
  }

  delete(id: string): void {
    this.http
      .delete(`${this.url}/${id}`)
      .subscribe(() => this.tasks.update((list) => list.filter((t) => t.id !== id)));
  }

  clearAll(): Observable<unknown> {
    return deleteAll(this.http, this.url, this.tasks());
  }

  addDemoData(): Observable<unknown> {
    return addAll(this.http, this.url, seedTasks()).pipe(tap(() => this.load()));
  }

  isOverdue(task: Task): boolean {
    return task.status !== 'Done' && task.dueDate < today();
  }

  openTaskCount(workerId: string): number {
    return this.tasks().filter((t) => t.workerId === workerId && t.status !== 'Done').length;
  }

  markDone(task: Task): void {
    const { id, ...rest } = task;
    this.update(id, { ...rest, status: 'Done' });
  }
}
