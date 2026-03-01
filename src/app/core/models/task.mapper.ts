// task.mapper.ts
import { Task } from './task.model';
import { TaskDto } from './task.dto';

export class TaskMapper {

  static fromDto(dto: TaskDto): Task {
    return new Task(
      dto.id,
      dto.title,
      dto.description ?? null,
      dto.completed,
      new Date(dto.createdAt),
      new Date(dto.updatedAt)
    );
  }

  static toDto(task: Task): TaskDto {
    return {
      id: task.id,
      title: task.title,
      description: task.description ?? undefined,
      completed: task.completed,
      createdAt: task.createdAt.toISOString(),
      updatedAt: task.updatedAt.toISOString()
    };
  }
}