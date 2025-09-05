import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TaskForm from '../components/Tasks/TaskForm';

const mockProps = {
  onSubmit: jest.fn(),
  onCancel: jest.fn(),
  loading: false
};

describe('TaskForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders form fields correctly', () => {
    render(<TaskForm {...mockProps} />);
    
    expect(screen.getByLabelText(/titre/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/priorité/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/statut/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/date d'échéance/i)).toBeInTheDocument();
  });

  test('shows validation error for empty title', async () => {
    render(<TaskForm {...mockProps} />);
    
    const submitButton = screen.getByText(/créer la tâche/i);
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Le titre est obligatoire')).toBeInTheDocument();
    });
  });

  test('calls onSubmit with form data when valid', async () => {
    render(<TaskForm {...mockProps} />);
    
    fireEvent.change(screen.getByLabelText(/titre/i), {
      target: { value: 'Test Task' }
    });
    
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: 'Test Description' }
    });
    
    const submitButton = screen.getByText(/créer la tâche/i);
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockProps.onSubmit).toHaveBeenCalledWith({
        title: 'Test Task',
        description: 'Test Description',
        priority: 'medium',
        status: 'todo',
        dueDate: undefined
      });
    });
  });

  test('calls onCancel when cancel button is clicked', () => {
    render(<TaskForm {...mockProps} />);
    
    const cancelButton = screen.getByText(/annuler/i);
    fireEvent.click(cancelButton);
    
    expect(mockProps.onCancel).toHaveBeenCalled();
  });

  test('populates form with initial task data', () => {
    const initialTask = {
      title: 'Existing Task',
      description: 'Existing Description',
      priority: 'high',
      status: 'in_progress',
      dueDate: '2023-12-31'
    };
    
    render(<TaskForm {...mockProps} initialTask={initialTask} />);
    
    expect(screen.getByDisplayValue('Existing Task')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Existing Description')).toBeInTheDocument();
    expect(screen.getByDisplayValue('high')).toBeInTheDocument();
    expect(screen.getByDisplayValue('in_progress')).toBeInTheDocument();
  });

  test('shows loading state when submitting', () => {
    render(<TaskForm {...mockProps} loading={true} />);
    
    expect(screen.getByText(/chargement/i)).toBeInTheDocument();
  });
});
