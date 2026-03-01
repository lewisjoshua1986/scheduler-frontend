import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TaskApi } from '../interfaces/task-api.interface';
import { TaskDto } from '../../models/task/task.dto';

import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TaskApiHttp implements TaskApi {
  private readonly baseUrl = `${environment.apiUrl}/tasks`;

  constructor(private http: HttpClient) {}

  /**
   * Get all tasks
   */
  getAll(): Observable<TaskDto[]> {
    return this.http.get<TaskDto[]>(this.baseUrl);
  }

  /**
   * Get a single task by id
   */
  getById(id: string): Observable<TaskDto> {
    return this.http.get<TaskDto>(`${this.baseUrl}/${id}`);
  }

  /**
   * Get tasks optionally filtered by eventId
   * If eventId is undefined, returns ALL tasks
   */
  getTasksByEventId(eventId: string): Observable<TaskDto[]> {
    const params = new HttpParams().set('eventId', eventId);
    return this.http.get<TaskDto[]>(this.baseUrl, { params });
  }

  /**
   * Create a task
   * eventId is optional in DTO
   */
  create(task: TaskDto): Observable<TaskDto> {
    return this.http.post<TaskDto>(this.baseUrl, task);
  }

  /**
   * Update a task
   */
  update(id: string, task: Partial<TaskDto>): Observable<TaskDto> {
    return this.http.put<TaskDto>(`${this.baseUrl}/${id}`, task);
  }

  /**
   * Delete a task
   */
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
