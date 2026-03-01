import { Observable } from "rxjs";
import { Task } from "../../models/task.model";
import { CreateTaskDto } from "../../models/create-task.dto";
import { UpdateTaskDto } from "../../models/update-task.dto";

export interface TaskApi {
  getTasks(): Observable<Task[]>;
  getTask(id: string): Observable<Task>;
  createTask(task: CreateTaskDto): Observable<Task>;
  updateTask(id: string, task: UpdateTaskDto): Observable<Task>;
  deleteTask(id: string): Observable<void>;
}