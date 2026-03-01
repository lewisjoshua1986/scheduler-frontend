import { Observable } from 'rxjs';
import { TaskDto } from '../../models/task/task.dto';

export abstract class TaskApi {
  abstract getAll(): Observable<TaskDto[]>;
  abstract getById(id: string): Observable<TaskDto | null>;
  abstract getTasksByEventId(eventId: string): Observable<TaskDto[]>;
  abstract create(dto: Partial<TaskDto>): Observable<TaskDto>;
  abstract update(id: string, dto: Partial<TaskDto>): Observable<TaskDto>;
  abstract delete(id: string): Observable<void>;
}
