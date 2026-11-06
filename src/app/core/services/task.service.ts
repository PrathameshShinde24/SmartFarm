import { Injectable, computed, inject, signal } from '@angular/core';
import { seedTasks } from '../data/seed-data';
import { Task } from '../models';
import { createId, today } from '../utils/helpers';
import { StorageService } from './storage.service';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private storage = inject(StorageService);

  tasks = signal<Task[]>(this.storage.get('tasks', seedTasks()));
  overdueTasks = computed(() => this.tasks().filter((t) => this.isOverdue(t)));
  todayTasks = computed(() =>
    this.tasks().filter((t) => t.dueDate === today() && t.status !== 'Done'),
  );

  isOverdue(task: Task): boolean {
    return task.status !== 'Done' && task.dueDate < today();
  }

  openTaskCount(workerId: string): number {
    return this.tasks().filter((t) => t.workerId === workerId && t.status !== 'Done').length;
  }

  add(task: Omit<Task, 'id'>): void {
    this.tasks.update((list) => [{ ...task, id: createId() }, ...list]);
    this.save();
  }

  update(id: string, task: Omit<Task, 'id'>): void {
    this.tasks.update((list) => list.map((t) => (t.id === id ? { ...task, id } : t)));
    this.save();
  }

  markDone(id: string): void {
    this.tasks.update((list) =>
      list.map((t): Task => (t.id === id ? { ...t, status: 'Done' } : t)),
    );
    this.save();
  }

  delete(id: string): void {
    this.tasks.update((list) => list.filter((t) => t.id !== id));
    this.save();
  }

  reset(): void {
    this.tasks.set(seedTasks());
    this.save();
  }

  private save(): void {
    this.storage.set('tasks', this.tasks());
  }
}
