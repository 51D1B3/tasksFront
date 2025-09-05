import { useState, useEffect, useCallback, useMemo } from 'react';
import { taskService } from '../services/api';

export const useTasks = (initialFilters = {}) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 10, pages: 0 });

  const fetchTasks = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await taskService.getTasks({ ...filters, ...params });
      setTasks(response.data);
      setMeta(response.meta);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du chargement des tâches');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const createTask = useCallback(async (taskData) => {
    try {
      const response = await taskService.createTask(taskData);
      await fetchTasks();
      return response;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Erreur lors de la création de la tâche');
    }
  }, [fetchTasks]);

  const updateTask = useCallback(async (id, taskData) => {
    try {
      console.log('Tentative de mise à jour de la tâche:', { id, taskData });
      const response = await taskService.updateTask(id, taskData);
      console.log('Réponse du serveur:', response);
      
      // Le serveur retourne directement la tâche mise à jour
      const updatedTask = response;
      setTasks(prevTasks => 
        prevTasks.map(task => task._id === id ? updatedTask : task)
      );
      return updatedTask;
    } catch (err) {
      console.error('Erreur complète updateTask:', err);
      console.error('Réponse d\'erreur:', err.response);
      console.error('Status:', err.response?.status);
      console.error('Data:', err.response?.data);
      throw new Error(err.response?.data?.message || 'Erreur lors de la mise à jour de la tâche');
    }
  }, []);

  const deleteTask = useCallback(async (id) => {
    try {
      await taskService.deleteTask(id);
      setTasks(prevTasks => prevTasks.filter(task => task._id !== id));
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Erreur lors de la suppression de la tâche');
    }
  }, []);

  const toggleTaskStatus = useCallback(async (id, currentStatus) => {
    let newStatus;
    switch (currentStatus) {
      case 'todo':
        newStatus = 'in_progress';
        break;
      case 'in_progress':
        newStatus = 'done';
        break;
      case 'done':
        newStatus = 'todo';
        break;
      default:
        newStatus = 'todo';
    }
    
    try {
      const updatedTask = await updateTask(id, { status: newStatus });
      
      // Afficher un message de confirmation selon le nouveau statut
      if (newStatus === 'done') {
        alert('✅ Tâche marquée comme terminée !');
      } else if (newStatus === 'in_progress') {
        alert('▶ Tâche commencée !');
      } else if (newStatus === 'todo') {
        alert('↶ Tâche rouverte !');
      }
      
      return updatedTask;
    } catch (error) {
      throw error;
    }
  }, [updateTask]);

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      if (filters.status && task.status !== filters.status) return false;
      if (filters.priority && task.priority !== filters.priority) return false;
      return true;
    });
  }, [tasks, filters]);

  const taskStats = useMemo(() => {
    return {
      total: tasks.length,
      todo: tasks.filter(t => t.status === 'todo').length,
      inProgress: tasks.filter(t => t.status === 'in_progress').length,
      done: tasks.filter(t => t.status === 'done').length,
      high: tasks.filter(t => t.priority === 'high').length,
      medium: tasks.filter(t => t.priority === 'medium').length,
      low: tasks.filter(t => t.priority === 'low').length
    };
  }, [tasks]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return {
    tasks: filteredTasks,
    allTasks: tasks,
    loading,
    error,
    meta,
    filters,
    setFilters,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    taskStats
  };
};
