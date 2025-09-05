import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TaskItem from '../components/Tasks/TaskItem';

const mockTask = {
  _id: '1',
  title: 'Test Task',
  description: 'Test Description',
  status: 'todo',
  priority: 'medium',
  createdAt: '2023-01-01T00:00:00.000Z',
  createdBy: {
    name: 'Test User',
    email: 'test@example.com'
  }
};

const mockProps = {
  task: mockTask,
  onToggleStatus: jest.fn(),
  onEdit: jest.fn(),
  onDelete: jest.fn()
};

describe('TaskItem', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders task information correctly', () => {
    render(<TaskItem {...mockProps} />);
    
    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('À faire')).toBeInTheDocument();
    expect(screen.getByText('Moyenne')).toBeInTheDocument();
  });

  test('calls onToggleStatus when status button is clicked', () => {
    render(<TaskItem {...mockProps} />);
    
    const statusButton = screen.getByText('▶ Commencer');
    fireEvent.click(statusButton);
    
    expect(mockProps.onToggleStatus).toHaveBeenCalledWith('1', 'todo');
  });

  test('calls onEdit when edit button is clicked', () => {
    render(<TaskItem {...mockProps} />);
    
    const editButton = screen.getByText('✏️ Modifier');
    fireEvent.click(editButton);
    
    expect(mockProps.onEdit).toHaveBeenCalledWith(mockTask);
  });

  test('calls onDelete when delete button is clicked', () => {
    render(<TaskItem {...mockProps} />);
    
    const deleteButton = screen.getByText('🗑️ Supprimer');
    fireEvent.click(deleteButton);
    
    expect(mockProps.onDelete).toHaveBeenCalledWith('1');
  });

  test('shows correct status button text for different statuses', () => {
    // Test in_progress status
    const inProgressTask = { ...mockTask, status: 'in_progress' };
    const { rerender } = render(<TaskItem {...mockProps} task={inProgressTask} />);
    expect(screen.getByText('✓ Terminer')).toBeInTheDocument();

    // Test done status
    const doneTask = { ...mockTask, status: 'done' };
    rerender(<TaskItem {...mockProps} task={doneTask} />);
    expect(screen.getByText('↶ Rouvrir')).toBeInTheDocument();
  });

  test('applies correct styling for completed tasks', () => {
    const doneTask = { ...mockTask, status: 'done' };
    render(<TaskItem {...mockProps} task={doneTask} />);
    
    const title = screen.getByText('Test Task');
    expect(title).toHaveClass('line-through', 'text-gray-500');
  });
});
