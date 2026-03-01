import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

import { Task } from '../models/task.model';
import { CreateTaskDto } from '../models/create-task.dto';
import { UpdateTaskDto } from '../models/update-task.dto';

import { TaskDto } from '../models/task.dto';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/tasks`;

  getTasks(): Observable<Task[]> {
    return this.http.get<TaskDto[]>(this.baseUrl).pipe(
      map(dtos => dtos.map(dto => Task.fromDto(dto)))
    );
  }

  getTaskById(id: string): Observable<Task> {
    return this.http.get<TaskDto>(`${this.baseUrl}/${id}`).pipe(
      map(dto => Task.fromDto(dto))
    );
  }

  createTask(dto: any): Observable<Task> {
    return this.http.post<TaskDto>(this.baseUrl, dto).pipe(
      map(dto => Task.fromDto(dto))
    );
  }

  updateTask(id: string, dto: any): Observable<Task> {
    return this.http.patch<TaskDto>(`${this.baseUrl}/${id}`, dto).pipe(
      map(dto => Task.fromDto(dto))
    );
  }

  deleteTask(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}