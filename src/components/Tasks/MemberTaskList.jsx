import React, { memo, useMemo } from 'react';
import Button from '../UI/Button';
import { useTasks } from '../../hooks/useTasks';
import { useAuth } from '../../contexts/AuthContext';

const MemberTaskList = memo(() => {
  const { allTasks, loading, error, updateTask } = useTasks();
  const { user } = useAuth();

  // Filtrer uniquement les tâches assignées au membre connecté
  const myTasks = useMemo(() => {
    return allTasks.filter(task => 
      task.assignedTo && task.assignedTo._id === user?.id
    );
  }, [allTasks, user?.id]);

  const myTaskStats = useMemo(() => {
    const stats = {
      total: myTasks.length,
      todo: myTasks.filter(task => task.status === 'todo').length,
      inProgress: myTasks.filter(task => task.status === 'in_progress').length,
      done: myTasks.filter(task => task.status === 'done').length
    };
    return stats;
  }, [myTasks]);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await updateTask(taskId, { status: newStatus });
      
      // Message de confirmation avec notification admin
      if (newStatus === 'done') {
        alert('✅ Tâche marquée comme terminée ! L\'administrateur verra cette mise à jour automatiquement.');
      } else if (newStatus === 'in_progress') {
        alert('▶ Tâche commencée ! L\'administrateur verra cette mise à jour automatiquement.');
      } else if (newStatus === 'todo') {
        alert('↶ Tâche remise à faire ! L\'administrateur verra cette mise à jour automatiquement.');
      }
    } catch (error) {
      alert('Erreur lors de la mise à jour: ' + error.message);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'todo': return 'bg-gray-100 text-gray-700 border-gray-300';
      case 'in_progress': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'done': return 'bg-green-100 text-green-700 border-green-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const getStatusOptions = () => {
    return [
      { value: 'todo', label: 'À faire' },
      { value: 'in_progress', label: 'En cours' },
      { value: 'done', label: 'Terminé' }
    ];
  };

  if (error) {
    return (
      <div className="bg-danger-50 border border-danger-200 rounded-md p-4">
        <p className="text-danger-600">Erreur: {error}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête Membre avec statistiques */}
      <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-lg shadow-sm p-6 text-white">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">🎯 Mes Tâches Assignées</h1>
          <div className="text-sm bg-white bg-opacity-20 rounded-lg px-3 py-1">
            Membre: {user?.name}
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold">{myTaskStats.total}</div>
            <div className="text-sm text-green-100">Mes tâches</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{myTaskStats.todo}</div>
            <div className="text-sm text-green-100">À faire</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{myTaskStats.inProgress}</div>
            <div className="text-sm text-green-100">En cours</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{myTaskStats.done}</div>
            <div className="text-sm text-green-100">Terminées</div>
          </div>
        </div>
      </div>

      {/* Information sur les permissions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <span className="text-blue-600">ℹ️</span>
          <p className="text-blue-700 text-sm">
            <strong>Permissions:</strong> Vous pouvez uniquement modifier le statut de vos tâches assignées. 
            Pour toute autre modification, contactez votre administrateur.
          </p>
        </div>
      </div>

      {/* Liste des tâches */}
      {myTasks.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucune tâche assignée</h3>
          <p className="text-gray-500">Vous n'avez actuellement aucune tâche assignée.</p>
          <p className="text-gray-500 text-sm mt-2">Contactez votre administrateur pour obtenir des tâches.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {myTasks.map((task) => (
            <div key={task._id} className={`rounded-lg border-2 p-6 ${getPriorityColor(task.priority)} ${task.status === 'done' ? 'opacity-75' : ''}`}>
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className={`text-lg font-semibold mb-2 ${task.status === 'done' ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                    {task.title}
                    {task.status === 'done' && <span className="ml-2 text-green-600">✅</span>}
                  </h3>
                  {task.description && (
                    <p className={`mb-3 ${task.status === 'done' ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                      {task.description}
                    </p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs px-2 py-1 rounded-full bg-white border font-medium">
                    {task.priority === 'high' ? '🔥 Haute' : 
                     task.priority === 'medium' ? '⚡ Moyenne' : '📋 Basse'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Statut de la tâche
                  </label>
                  <select
                    value={task.status}
                    onChange={(e) => handleStatusChange(task._id, e.target.value)}
                    className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${getStatusColor(task.status)}`}
                  >
                    {getStatusOptions().map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Créé par
                  </label>
                  <div className="text-sm text-gray-600 py-2">
                    {task.createdBy?.name || 'Inconnu'}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date de création
                  </label>
                  <div className="text-sm text-gray-600 py-2">
                    {formatDate(task.createdAt)}
                  </div>
                </div>
              </div>

              {task.dueDate && (
                <div className="flex items-center space-x-2 text-sm">
                  <span className="text-gray-600">📅 Échéance:</span>
                  <span className={`font-medium ${
                    new Date(task.dueDate) < new Date() && task.status !== 'done' 
                      ? 'text-red-600' 
                      : 'text-gray-700'
                  }`}>
                    {formatDate(task.dueDate)}
                    {new Date(task.dueDate) < new Date() && task.status !== 'done' && (
                      <span className="ml-1 text-red-600">⚠️ En retard</span>
                    )}
                  </span>
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>Dernière modification: {formatDate(task.updatedAt)}</span>
                  <span>ID: {task._id.slice(-6)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Actions limitées pour les membres */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Actions disponibles</h3>
        <div className="flex flex-wrap gap-3">
          <Button disabled className="opacity-50 cursor-not-allowed">
            ➕ Créer une tâche (Admin uniquement)
          </Button>
          <Button disabled className="opacity-50 cursor-not-allowed">
            ✏️ Modifier les détails (Admin uniquement)
          </Button>
          <Button disabled className="opacity-50 cursor-not-allowed">
            🗑️ Supprimer (Admin uniquement)
          </Button>
          <div className="flex items-center text-sm text-gray-600">
            <span className="mr-2">✅</span>
            Vous pouvez modifier le statut de vos tâches
          </div>
        </div>
      </div>
    </div>
  );
});

MemberTaskList.displayName = 'MemberTaskList';

export default MemberTaskList;
