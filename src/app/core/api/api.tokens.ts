import { InjectionToken } from '@angular/core';
import { TaskApi } from './interfaces/task-api.interface';

export const TASK_API = new InjectionToken<TaskApi>('TASK_API');
