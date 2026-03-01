import { Injectable } from "@angular/core";
import { delay, Observable, of } from "rxjs";
import { TaskApi } from "../interfaces/task-api.interface";
import { Task } from "../../models/task/task.model";
import { CreateTaskDto } from "../../models/task/create-task.dto";
import { UpdateTaskDto } from "../../models/task/update-task.dto";

@Injectable()
export class TaskApiMock implements TaskApi {

  private tasks: Task[] = [
    new Task('1', 'Mock Task 1', 'First mock task', false, null, new Date(), new Date()),
    new Task('2', 'Mock Task 2', 'Second mock task', true, null, new Date(), new Date())
  ];

  getTasks(): Observable<Task[]> {
    return of(this.tasks).pipe(delay(500));
  }

  getTask(id: string): Observable<Task> {
    const task = this.tasks.find(t => t.id === id);
    return of(task!).pipe(delay(500));
  }

  createTask(task: CreateTaskDto): Observable<Task> {
    const now = new Date();
    const newTask = new Task(
      crypto.randomUUID(),
      task.title,
      task.description ?? null,
      false,
      null,
      now,
      now
    );
    this.tasks.push(newTask);
    return of(newTask).pipe(delay(500));
  }

  updateTask(id: string, task: UpdateTaskDto): Observable<Task> {
    const existing = this.tasks.find(t => t.id === id);
    if (!existing) {
      throw new Error('Task not found');
    }
    if (task.title !== undefined) {
      existing.title = task.title;
    }
    if (task.description !== undefined) {
      existing.description = task.description;
    }
    if (task.completed !== undefined) {
      existing.completed = task.completed;
    }
    existing.updatedAt = new Date();
    return of(existing).pipe(delay(500));
  }

  deleteTask(id: string): Observable<void> {
    this.tasks = this.tasks.filter(t => t.id !== id);
    return of(void 0).pipe(delay(500));
  }
}