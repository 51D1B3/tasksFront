import { renderHook, act } from '@testing-library/react';
import { useTasks } from '../hooks/useTasks';
import { taskService } from '../services/api';

// Mock the API service
jest.mock('../services/api', () => ({
  taskService: {
    getTasks: jest.fn(),
    createTask: jest.fn(),
    updateTask: jest.fn(),
    deleteTask: jest.fn()
  }
}));

const mockTasks = [
  {
    _id: '1',
    title: 'Task 1',
    status: 'todo',
    priority: 'high',
    createdAt: '2023-01-01'
  },
  {
    _id: '2',
    title: 'Task 2',
    status: 'done',
    priority: 'medium',
    createdAt: '2023-01-02'
  }
];

describe('useTasks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    taskService.getTasks.mockResolvedValue({
      data: mockTasks,
      meta: { total: 2, page: 1, limit: 10, pages: 1 }
    });
  });

  test('fetches tasks on mount', async () => {
    const { result } = renderHook(() => useTasks());

    expect(result.current.loading).toBe(true);

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(taskService.getTasks).toHaveBeenCalled();
    expect(result.current.tasks).toEqual(mockTasks);
    expect(result.current.loading).toBe(false);
  });

  test('creates a new task', async () => {
    const newTask = { title: 'New Task', status: 'todo', priority: 'medium' };
    taskService.createTask.mockResolvedValue(newTask);

    const { result } = renderHook(() => useTasks());

    await act(async () => {
      await result.current.createTask(newTask);
    });

    expect(taskService.createTask).toHaveBeenCalledWith(newTask);
  });

  test('updates a task', async () => {
    const updatedTask = { ...mockTasks[0], title: 'Updated Task' };
    taskService.updateTask.mockResolvedValue(updatedTask);

    const { result } = renderHook(() => useTasks());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    await act(async () => {
      await result.current.updateTask('1', { title: 'Updated Task' });
    });

    expect(taskService.updateTask).toHaveBeenCalledWith('1', { title: 'Updated Task' });
  });

  test('deletes a task', async () => {
    taskService.deleteTask.mockResolvedValue({});

    const { result } = renderHook(() => useTasks());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    await act(async () => {
      await result.current.deleteTask('1');
    });

    expect(taskService.deleteTask).toHaveBeenCalledWith('1');
  });

  test('calculates task statistics correctly', async () => {
    const { result } = renderHook(() => useTasks());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.taskStats).toEqual({
      total: 2,
      todo: 1,
      inProgress: 0,
      done: 1,
      high: 1,
      medium: 1,
      low: 0
    });
  });

  test('filters tasks correctly', async () => {
    const { result } = renderHook(() => useTasks({ status: 'todo' }));

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.tasks).toHaveLength(1);
    expect(result.current.tasks[0].status).toBe('todo');
  });
});
