import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { seedTasks } from '../data/seed-data';
import { Task } from '../models';
import { daysFromToday } from '../utils/helpers';
import { API_URL } from './api';
import { TaskService } from './task.service';

describe('TaskService', () => {
  let service: TaskService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(TaskService);
    httpMock = TestBed.inject(HttpTestingController);
    httpMock.expectOne(`${API_URL}/tasks`).flush(seedTasks());
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should load 12 tasks from the server', () => {
    expect(service.tasks().length).toBe(12);
  });

  it('should find overdue tasks and tasks due today', () => {
    expect(service.overdueTasks().length).toBe(3);
    expect(service.todayTasks().length).toBe(3);
  });

  it('should send a PUT request and update the list when a task is marked done', () => {
    const task = service.overdueTasks()[0];
    service.markDone(task);

    const request = httpMock.expectOne(`${API_URL}/tasks/${task.id}`);
    expect(request.request.method).toBe('PUT');
    expect(request.request.body.status).toBe('Done');
    request.flush(request.request.body);

    expect(service.overdueTasks().length).toBe(2);
  });

  it('should send a POST request when a task is added', () => {
    service.add({
      title: 'Check drip lines',
      type: 'Maintenance',
      fieldId: 'f1',
      workerId: 'w3',
      dueDate: daysFromToday(2),
      priority: 'Low',
      status: 'Pending',
    });

    const request = httpMock.expectOne(`${API_URL}/tasks`);
    expect(request.request.method).toBe('POST');
    request.flush(request.request.body as Task);

    expect(service.tasks().length).toBe(13);
  });
});
