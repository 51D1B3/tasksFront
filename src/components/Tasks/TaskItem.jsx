import React, { memo, useCallback } from 'react';
import Button from '../UI/Button';

const TaskItem = memo(({ 
  task, 
  onToggleStatus, 
  onEdit, 
  onDelete 
}) => {
  const handleToggleStatus = useCallback(async () => {
    try {
      await onToggleStatus(task._id, task.status);
    } catch (error) {
      alert('Erreur lors de la mise à jour du statut: ' + error.message);
    }
  }, [task._id, task.status, onToggleStatus]);

  const handleEdit = useCallback(() => {
    onEdit(task);
  }, [task, onEdit]);

  const handleDelete = useCallback(() => {
    onDelete(task._id);
  }, [task._id, onDelete]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'todo': return 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 border border-gray-300';
      case 'in_progress': return 'bg-gradient-to-r from-sky-100 to-blue-200 text-sky-800 border border-sky-300';
      case 'done': return 'bg-gradient-to-r from-emerald-100 to-green-200 text-emerald-800 border border-emerald-300';
      default: return 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 border border-gray-300';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-gradient-to-r from-red-100 to-pink-200 text-red-800 border border-red-300';
      case 'medium': return 'bg-gradient-to-r from-yellow-100 to-orange-200 text-orange-800 border border-orange-300';
      case 'low': return 'bg-gradient-to-r from-green-100 to-emerald-200 text-green-800 border border-green-300';
      default: return 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 border border-gray-300';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'todo': return 'À faire';
      case 'in_progress': return 'En cours';
      case 'done': return 'Terminé';
      default: return status;
    }
  };

  const getPriorityText = (priority) => {
    switch (priority) {
      case 'high': return 'Haute';
      case 'medium': return 'Moyenne';
      case 'low': return 'Basse';
      default: return priority;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  return (
    <div className={`card-interactive animate-slide-in ${task.status === 'done' ? 'opacity-75' : ''}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-3">
            <h3 className={`text-lg font-semibold ${task.status === 'done' ? 'line-through text-gray-500' : 'gradient-text'}`}>
              {task.title}
            </h3>
            <span className={`px-3 py-1 rounded-full text-xs font-medium shadow-sm ${getStatusColor(task.status)}`}>
              {getStatusText(task.status)}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-medium shadow-sm ${getPriorityColor(task.priority)}`}>
              {getPriorityText(task.priority)}
            </span>
          </div>
          
          {task.description && (
            <p className={`text-gray-600 mb-3 ${task.status === 'done' ? 'line-through' : ''}`}>
              {task.description}
            </p>
          )}
          
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            {task.dueDate && (
              <span className="flex items-center">
                📅 Échéance: {formatDate(task.dueDate)}
              </span>
            )}
            {task.createdBy && (
              <span className="flex items-center">
                👤 Créé par: {task.createdBy.name || task.createdBy.email}
              </span>
            )}
            <span className="flex items-center">
              🕒 {formatDate(task.createdAt)}
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 ml-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleToggleStatus}
            className="whitespace-nowrap"
          >
            {task.status === 'done' ? '↶ Rouvrir' : task.status === 'in_progress' ? '✓ Terminer' : '▶ Commencer'}
          </Button>
          {task.status === 'done' && (
            <span className="text-green-600 text-sm font-medium">✅ Tâche terminée</span>
          )}
          <Button
            variant="secondary"
            size="sm"
            onClick={handleEdit}
          >
            ✏️ Modifier
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={handleDelete}
          >
            🗑️ Supprimer
          </Button>
        </div>
      </div>
    </div>
  );
});

TaskItem.displayName = 'TaskItem';

export default TaskItem;
