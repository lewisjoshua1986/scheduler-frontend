import { Injectable } from "@angular/core";
import { delay, Observable, of } from "rxjs";
import { TaskApi } from "../interfaces/task-api.interface";
import { Task, CreateTaskDto, UpdateTaskDto } from "../models/task.model";

@Injectable()
export class TaskApiMock implements TaskApi {

  private tasks: Task[] = [
    { id: '1', title: 'Mock Task 1', completed: false },
    { id: '2', title: 'Mock Task 2', completed: true }
  ];

  getTasks(): Observable<Task[]> {
    return of(this.tasks).pipe(delay(500));
  }

  getTask(id: string): Observable<Task> {
    const task = this.tasks.find(t => t.id === id);
    return of(task!);
  }

  createTask(task: CreateTaskDto): Observable<Task> {
    const newTask = { ...task, id: crypto.randomUUID() };
    this.tasks.push(newTask);
    return of(newTask);
  }

  updateTask(id: string, task: UpdateTaskDto): Observable<Task> {
    const index = this.tasks.findIndex(t => t.id === id);
    this.tasks[index] = { ...this.tasks[index], ...task };
    return of(this.tasks[index]);
  }

  deleteTask(id: string): Observable<void> {
    this.tasks = this.tasks.filter(t => t.id !== id);
    return of(void 0);
  }
}