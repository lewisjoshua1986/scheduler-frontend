import { Task } from './task.model';

describe('Task Model', () => {

  let task: Task;

  beforeEach(() => {
    task = new Task(
      '1',
      'Test Task',
      null,
      false,
      new Date(),
      new Date()
    );
  });

  it('should toggle completed state', () => {
    task.toggle();
    expect(task.completed).toBe(true);

    task.toggle();
    expect(task.completed).toBe(false);
  });

  it('should mark task complete', () => {
    task.markComplete();
    expect(task.completed).toBe(true);
  });

  it('should rename task', () => {
    task.rename('New Title');
    expect(task.title).toBe('New Title');
  });

  it('should throw error if renaming to empty string', () => {
    expect(() => task.rename('')).toThrow();
  });

});