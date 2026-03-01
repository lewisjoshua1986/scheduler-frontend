import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  provideHttpClientTesting,
  HttpTestingController,
} from '@angular/common/http/testing';

import { TaskService } from './task.service';
import { Task } from '../models/task/task.model';
import { TaskDto } from '../models/task/task.dto';
import { environment } from '../../../environments/environment';

describe('TaskService', () => {
  let service: TaskService;
  let httpMock: HttpTestingController;

  const mockTaskDto: TaskDto = {
    id: '1',
    title: 'Test Task',
    description: 'Testing task service',
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TaskService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(TaskService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch all tasks and map DTOs to Task instances (GET)', () => {
    service.getTasks().subscribe((tasks) => {
      expect(tasks.length).toBe(1);
      expect(tasks[0]).toBeInstanceOf(Task);
      expect(tasks[0].id).toBe(mockTaskDto.id);
      expect(tasks[0].createdAt).toBeInstanceOf(Date);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/tasks`);
    expect(req.request.method).toBe('GET');

    req.flush([mockTaskDto]);
  });

  it('should fetch a task by id and map to Task instance (GET)', () => {
    service.getTaskById('1').subscribe((task) => {
      expect(task).toBeInstanceOf(Task);
      expect(task.id).toBe('1');
      expect(task.title).toBe(mockTaskDto.title);
    });

    const req = httpMock.expectOne(
      `${environment.apiUrl}/tasks/1`
    );
    expect(req.request.method).toBe('GET');

    req.flush(mockTaskDto);
  });

  it('should create a task (POST)', () => {
    const createDto = {
      title: 'New Task',
      description: 'Created via test',
    };

    service.createTask(createDto).subscribe((task) => {
      expect(task).toBeInstanceOf(Task);
      expect(task.title).toBe(mockTaskDto.title);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/tasks`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(createDto);

    req.flush(mockTaskDto);
  });

  it('should update a task (PATCH)', () => {
    const updateDto = {
      completed: true,
    };

    service.updateTask('1', updateDto).subscribe((task) => {
      expect(task).toBeInstanceOf(Task);
      expect(task.id).toBe('1');
    });

    const req = httpMock.expectOne(
      `${environment.apiUrl}/tasks/1`
    );
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual(updateDto);

    req.flush(mockTaskDto);
  });

  it('should delete a task (DELETE)', () => {
    service.deleteTask('1').subscribe((response) => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne(
      `${environment.apiUrl}/tasks/1`
    );
    expect(req.request.method).toBe('DELETE');

    req.flush(null);
  });

  it('should propagate HTTP errors', () => {
    service.getTasks().subscribe({
      next: () => {
        throw new Error('Expected error, but got success');
      },
      error: (error) => {
        expect(error.status).toBe(500);
      },
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/tasks`);
    req.flush(
      { message: 'Server error' },
      { status: 500, statusText: 'Internal Server Error' }
    );
  });
});