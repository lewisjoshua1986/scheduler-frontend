import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';

import { TaskApi } from '../interfaces/task-api.interface';
import { TaskDto } from '../../models/task/task.dto';

@Injectable()
export class TaskApiMock extends TaskApi {
  private tasks: TaskDto[] = [
    {
      id: '1',
      title: 'Fuel vehicle',
      description: 'Top off before departure',
      completed: false,
      eventId: 'event-1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '2',
      title: 'Confirm pickup time',
      description: '',
      completed: false,
      eventId: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  // --------------------------------------------------
  // READ
  // --------------------------------------------------

  getAll(): Observable<TaskDto[]> {
    return of([...this.tasks]).pipe(delay(200));
  }

  getById(id: string): Observable<TaskDto | null> {
    const found = this.tasks.find((t) => t.id === id) ?? null;
    return of(found).pipe(delay(200));
  }

  getTasksByEventId(eventId: string): Observable<TaskDto[]> {
    const filtered = this.tasks.filter((t) => t.eventId === eventId);
    return of(filtered).pipe(delay(200));
  }

  // --------------------------------------------------
  // CREATE
  // --------------------------------------------------

  create(dto: Partial<TaskDto>): Observable<TaskDto> {
    const now = new Date().toISOString();

    const newTask: TaskDto = {
      id: crypto.randomUUID(),
      title: dto.title ?? '',
      description: dto.description ?? '',
      completed: dto.completed ?? false,
      eventId: dto.eventId ?? null,
      createdAt: now,
      updatedAt: now,
    };

    this.tasks.push(newTask);

    return of(newTask).pipe(delay(200));
  }

  // --------------------------------------------------
  // UPDATE
  // --------------------------------------------------

  update(id: string, dto: Partial<TaskDto>): Observable<TaskDto> {
    const index = this.tasks.findIndex((t) => t.id === id);

    if (index === -1) {
      throw new Error(`Task with id ${id} not found`);
    }

    const existing = this.tasks[index];

    const updated: TaskDto = {
      ...existing,
      ...dto,
      updatedAt: new Date().toISOString(),
    };

    this.tasks[index] = updated;

    return of(updated).pipe(delay(200));
  }

  // --------------------------------------------------
  // DELETE
  // --------------------------------------------------

  delete(id: string): Observable<void> {
    this.tasks = this.tasks.filter((t) => t.id !== id);
    return of(void 0).pipe(delay(200));
  }
}
