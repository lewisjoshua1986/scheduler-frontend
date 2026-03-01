import { TaskMapper } from './task.mapper';
import { TaskDto } from './task.dto';

describe('TaskMapper', () => {
  it('should convert DTO to Task', () => {
    const dto: TaskDto = {
      id: '1',
      title: 'Test',
      description: 'desc',
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const task = TaskMapper.fromDto(dto);

    expect(task.createdAt instanceof Date).toBe(true);
    expect(task.updatedAt instanceof Date).toBe(true);
  });

  it('should convert Task to DTO', () => {
    const dto: TaskDto = {
      id: '1',
      title: 'Test',
      description: undefined,
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const task = TaskMapper.fromDto(dto);
    const converted = TaskMapper.toDto(task);

    expect(typeof converted.createdAt).toBe('string');
    expect(typeof converted.updatedAt).toBe('string');
  });
});
