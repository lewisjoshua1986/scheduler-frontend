import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { of, throwError, firstValueFrom } from 'rxjs';

import { TaskService } from './task.service';
import { TaskApi } from '../api/interfaces/task-api.interface';
import { TaskDto } from '../models/task/task.dto';
import { Task } from '../models/task/task.model';

describe('TaskService (Vitest)', () => {
  let service: TaskService;

  let apiMock: {
    getAll: ReturnType<typeof vi.fn>;
    getById: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
    getTasksByEventId: ReturnType<typeof vi.fn>;
  };

  const baseDto: TaskDto = {
    id: '1',
    title: 'Test Task',
    description: 'Testing',
    completed: false,
    eventId: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  beforeEach(() => {
    apiMock = {
      getAll: vi.fn(),
      getById: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      getTasksByEventId: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [TaskService, { provide: TaskApi, useValue: apiMock }],
    });

    service = TestBed.inject(TaskService);
  });

  // ===============================
  // GET ALL
  // ===============================

  it('should fetch all tasks and map DTOs to Task instances', async () => {
    apiMock.getAll.mockReturnValue(of([baseDto]));

    const tasks = await firstValueFrom(service.getAll());

    expect(apiMock.getAll).toHaveBeenCalledOnce();
    expect(tasks).toHaveLength(1);
    expect(tasks[0]).toBeInstanceOf(Task);
    expect(tasks[0].id).toBe('1');
  });

  it('should return empty array when API returns empty array', async () => {
    apiMock.getAll.mockReturnValue(of([]));

    const tasks = await firstValueFrom(service.getAll());

    expect(tasks).toEqual([]);
  });

  // ===============================
  // GET BY ID
  // ===============================

  it('should fetch a task by id', async () => {
    apiMock.getById.mockReturnValue(of(baseDto));

    const task = await firstValueFrom(service.getById('1'));

    expect(apiMock.getById).toHaveBeenCalledWith('1');
    expect(task).toBeInstanceOf(Task);
    expect(task?.id).toBe('1');
  });

  // ===============================
  // CREATE
  // ===============================

  it('should create a task without eventId', async () => {
    apiMock.create.mockReturnValue(of(baseDto));

    const task = await firstValueFrom(service.create('New Task', 'Optional'));

    expect(apiMock.create).toHaveBeenCalled();
    expect(task).toBeInstanceOf(Task);
    expect(task.eventId).toBeNull();
  });

  it('should create a task with eventId', async () => {
    const dtoWithEvent = { ...baseDto, eventId: 'event-123' };
    apiMock.create.mockReturnValue(of(dtoWithEvent));

    const task = await firstValueFrom(service.create('Scheduled Task', 'event-123'));

    expect(task.eventId).toBe('event-123');
  });

  // ===============================
  // UPDATE
  // ===============================

  it('should update a task', async () => {
    const existingTask = new Task('1', 'Test', 'Desc', true, null, new Date(), new Date());

    apiMock.update.mockReturnValue(
      of({
        id: '1',
        title: 'Test',
        description: 'Desc',
        completed: true,
        eventId: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }),
    );

    const updated = await firstValueFrom(service.update(existingTask));

    expect(apiMock.update).toHaveBeenCalledWith('1', {
      title: 'Test',
      description: 'Desc',
      completed: true,
      eventId: null,
    });

    expect(updated.completed).toBe(true);
  });

  it('should allow updating eventId to null (decoupling)', async () => {
    const updatedDto = { ...baseDto, eventId: null };
    apiMock.update.mockReturnValue(of(updatedDto));

    const task = await firstValueFrom(service.update({ eventId: null } as Task));

    expect(task.eventId).toBeNull();
  });

  // ===============================
  // DELETE
  // ===============================

  it('should delete a task', async () => {
    apiMock.delete.mockReturnValue(of(void 0));

    const result = await firstValueFrom(service.delete('1'));

    expect(apiMock.delete).toHaveBeenCalledWith('1');
    expect(result).toBeUndefined();
  });

  // ===============================
  // GET TASKS BY EVENT ID
  // ===============================

  it('should get tasks by eventId', async () => {
    const dtoWithEvent = { ...baseDto, eventId: 'event-1' };
    apiMock.getTasksByEventId.mockReturnValue(of([dtoWithEvent]));

    const tasks = await firstValueFrom(service.getTasksForEvent('event-1'));

    expect(apiMock.getTasksByEventId).toHaveBeenCalledWith('event-1');
    expect(tasks).toHaveLength(1);
    expect(tasks[0].eventId).toBe('event-1');
  });

  it('should return empty array if no tasks for event', async () => {
    apiMock.getTasksByEventId.mockReturnValue(of([]));

    const tasks = await firstValueFrom(service.getTasksForEvent('missing-event'));

    expect(tasks).toEqual([]);
  });

  // ===============================
  // ERROR HANDLING
  // ===============================

  it('should propagate API errors from getAll', async () => {
    apiMock.getAll.mockReturnValue(throwError(() => new Error('API failure')));

    await expect(firstValueFrom(service.getAll())).rejects.toThrow('API failure');
  });

  it('should propagate API errors from update', async () => {
    apiMock.update.mockReturnValue(throwError(() => new Error('Update failed')));

    await expect(firstValueFrom(service.update({} as Task))).rejects.toThrow('Update failed');
  });
});
