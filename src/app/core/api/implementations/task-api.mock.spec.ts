import { firstValueFrom } from 'rxjs';
import { TaskApiMock } from './task-api.mock';

describe('TaskApiMock', () => {

  let api: TaskApiMock;

  beforeEach(() => {
    api = new TaskApiMock();
  });

  it('should return initial tasks', async () => {
    const tasks = await firstValueFrom(api.getTasks());
    expect(tasks.length).toBeGreaterThan(0);
  });

  it('should create a new task', async () => {
    const created = await firstValueFrom(api.createTask({ title: 'New Task' }));
    const tasks = await firstValueFrom(api.getTasks());

    expect(tasks.find(t => t.id === created.id)).toBeTruthy();
  });

});