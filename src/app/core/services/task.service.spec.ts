import { TestBed } from '@angular/core/testing';
import { daysFromToday } from '../utils/helpers';
import { TaskService } from './task.service';

describe('TaskService', () => {
  let service: TaskService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskService);
  });

  it('should load 12 demo tasks', () => {
    expect(service.tasks().length).toBe(12);
  });

  it('should find overdue tasks and tasks due today', () => {
    expect(service.overdueTasks().length).toBe(3);
    expect(service.todayTasks().length).toBe(3);
  });

  it('should remove a task from overdue after marking it done', () => {
    const task = service.overdueTasks()[0];
    service.markDone(task.id);
    expect(service.overdueTasks().length).toBe(2);
  });

  it('should add a task and save it to localStorage', () => {
    service.add({
      title: 'Check drip lines',
      type: 'Maintenance',
      fieldId: 'f1',
      workerId: 'w3',
      dueDate: daysFromToday(2),
      priority: 'Low',
      status: 'Pending',
    });
    expect(service.tasks().length).toBe(13);
    expect(JSON.parse(localStorage.getItem('smartfarm_tasks') ?? '[]').length).toBe(13);
  });
});
