import { describe, it, expect, beforeEach } from 'vitest';
import { firstValueFrom } from 'rxjs';
import { TaskApiMock } from './task-api.mock';
import { TaskDto } from '../../models/task/task.dto';

describe('TaskApiMock', () => {
  let api: TaskApiMock;

  const task1: TaskDto = {
    id: '1',
    title: 'Task One',
    description: 'First task',
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    eventId: 'event-1',
  };

  const task2: TaskDto = {
    id: '2',
    title: 'Task Two',
    description: 'Second task',
    completed: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    eventId: undefined,
  };

  beforeEach(() => {
    api = new TaskApiMock();
    (api as any).tasks = [task1, task2]; // seed in-memory store
  });

  it('should return all tasks', async () => {
    const tasks = await firstValueFrom(api.getAll());

    expect(tasks.length).toBe(2);
    expect(tasks).toContainEqual(task1);
    expect(tasks).toContainEqual(task2);
  });

  it('should return task by id', async () => {
    const task = await firstValueFrom(api.getById('1'));

    expect(task).toEqual(task1);
  });

  it('should return tasks filtered by eventId', async () => {
    const tasks = await firstValueFrom(api.getTasksByEventId('event-1'));

    expect(tasks.length).toBe(1);
    expect(tasks[0].id).toBe('1');
  });

  it('should return empty array if no tasks match eventId', async () => {
    const tasks = await firstValueFrom(api.getTasksByEventId('does-not-exist'));

    expect(tasks.length).toBe(0);
  });

  it('should create a task', async () => {
    const newTask: TaskDto = {
      id: '3',
      title: 'New Task',
      description: 'Created task',
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      eventId: undefined,
    };

    const created = await firstValueFrom(api.create(newTask));
    expect(created).toMatchObject({
      title: 'New Task',
      description: 'Created task',
      completed: false,
    });

    const tasks = await firstValueFrom(api.getAll());
    expect(tasks.length).toBe(3);
  });

  it('should update an existing task', async () => {
    const updatedTask: TaskDto = {
      ...task1,
      title: 'Updated Title',
    };

    const result = await firstValueFrom(api.update(updatedTask.id, updatedTask));
    expect(result.title).toBe('Updated Title');

    const fetched = await firstValueFrom(api.getById('1'));
    expect(fetched?.title).toBe('Updated Title');
  });

  it('should delete a task', async () => {
    await firstValueFrom(api.delete('1'));

    const tasks = await firstValueFrom(api.getAll());
    expect(tasks.length).toBe(1);
    expect(tasks.find((t) => t.id === '1')).toBeUndefined();
  });

  it('should not break when deleting non-existent task', async () => {
    await firstValueFrom(api.delete('does-not-exist'));

    const tasks = await firstValueFrom(api.getAll());
    expect(tasks.length).toBe(2);
  });

  it('should not include tasks without matching eventId when filtering', async () => {
    const tasks = await firstValueFrom(api.getTasksByEventId('event-1'));

    expect(tasks.every((t) => t.eventId === 'event-1')).toBe(true);
  });
});
