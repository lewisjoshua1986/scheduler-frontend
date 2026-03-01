import { Injectable, Inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { Task } from '../models/task/task.model';
import { TaskDto } from '../models/task/task.dto';
import { TaskApi } from '../api/interfaces/task-api.interface';
import { TaskMapper } from '../models/task/task.mapper';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  constructor(@Inject(TaskApi) private readonly taskApi: TaskApi) {}

  // --------------------------------------------------
  // READ
  // --------------------------------------------------

  getAll(): Observable<Task[]> {
    return this.taskApi.getAll().pipe(map((dtos) => dtos.map((dto) => TaskMapper.fromDto(dto))));
  }

  getById(id: string): Observable<Task | null> {
    return this.taskApi.getById(id).pipe(map((dto) => (dto ? TaskMapper.fromDto(dto) : null)));
  }

  getTasksForEvent(eventId: string): Observable<Task[]> {
    return this.taskApi
      .getTasksByEventId(eventId)
      .pipe(map((dtos) => dtos.map((dto) => TaskMapper.fromDto(dto))));
  }

  getUnscheduled(): Observable<Task[]> {
    return this.getAll().pipe(map((tasks) => tasks.filter((t) => !t.eventId)));
  }

  // --------------------------------------------------
  // CREATE
  // --------------------------------------------------

  create(title: string, description?: string): Observable<Task> {
    const dto: Partial<TaskDto> = {
      title,
      description: description ?? '',
      completed: false,
      eventId: null,
    };

    return this.taskApi.create(dto).pipe(map((created) => TaskMapper.fromDto(created)));
  }

  // --------------------------------------------------
  // UPDATE
  // --------------------------------------------------

  update(p0: string, updateDto: { completed: boolean }, task: Task): Observable<Task> {
    const dto: Partial<TaskDto> = {
      title: task.title,
      description: task.description || undefined,
      completed: task.completed,
      eventId: task.eventId,
    };

    return this.taskApi.update(task.id, dto).pipe(map((updated) => TaskMapper.fromDto(updated)));
  }

  assignToEvent(task: Task, eventId: string): Observable<Task> {
    const dto: Partial<TaskDto> = {
      eventId,
    };

    return this.taskApi.update(task.id, dto).pipe(map((updated) => TaskMapper.fromDto(updated)));
  }

  unschedule(task: Task): Observable<Task> {
    const dto: Partial<TaskDto> = {
      eventId: null,
    };

    return this.taskApi.update(task.id, dto).pipe(map((updated) => TaskMapper.fromDto(updated)));
  }

  markComplete(task: Task): Observable<Task> {
    const dto: Partial<TaskDto> = {
      completed: true,
    };

    return this.taskApi.update(task.id, dto).pipe(map((updated) => TaskMapper.fromDto(updated)));
  }

  // --------------------------------------------------
  // DELETE
  // --------------------------------------------------

  delete(id: string): Observable<void> {
    return this.taskApi.delete(id);
  }
}
