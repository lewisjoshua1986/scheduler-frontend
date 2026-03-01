import { TaskDto } from "./task.dto";

// task.model.ts
export class Task {

  // 🔥 Factory method to convert API DTO → Task model
  static fromDto(dto: TaskDto): Task {
    return new Task(
      dto.id,
      dto.title,
      dto.description ?? '',
      dto.completed,
      new Date(dto.createdAt),
      new Date(dto.updatedAt)
    );
  }

  constructor(
    public readonly id: string,
    public title: string,
    public description: string | null,
    public completed: boolean,
    public readonly createdAt: Date,
    public updatedAt: Date
  ) {}

  toggle(): void {
    this.completed = !this.completed;
    this.touch();
  }

  markComplete(): void {
    if (!this.completed) {
      this.completed = true;
      this.touch();
    }
  }

  rename(newTitle: string): void {
    if (!newTitle.trim()) {
      throw new Error('Task title cannot be empty');
    }

    this.title = newTitle.trim();
    this.touch();
  }

  private touch(): void {
    this.updatedAt = new Date();
  }
}