import React, { memo, useMemo } from 'react';
import { useTasks } from '../../hooks/useTasks';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../UI/Button';

const MemberDashboard = memo(() => {
  const { allTasks, loading, updateTask } = useTasks();
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

  const upcomingTasks = useMemo(() => {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    return myTasks
      .filter(task => {
        if (!task.dueDate || task.status === 'done') return false;
        const dueDate = new Date(task.dueDate);
        return dueDate >= today && dueDate <= nextWeek;
      })
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  }, [myTasks]);

  const activeTasks = useMemo(() => {
    return myTasks
      .filter(task => task.status !== 'done')
      .sort((a, b) => {
        // Trier par priorité puis par date de création
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        }
        return new Date(a.createdAt) - new Date(b.createdAt);
      });
  }, [myTasks]);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await updateTask(taskId, { status: newStatus });
      
      // Afficher un message de confirmation selon le nouveau statut
      if (newStatus === 'done') {
        alert('✅ Tâche marquée comme terminée ! L\'administrateur sera notifié.');
      } else if (newStatus === 'in_progress') {
        alert('▶ Tâche commencée ! L\'administrateur sera notifié.');
      } else if (newStatus === 'todo') {
        alert('↶ Tâche remise à faire ! L\'administrateur sera notifié.');
      }
    } catch (error) {
      alert('Erreur lors de la mise à jour: ' + error.message);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'todo': return 'text-gray-600';
      case 'in_progress': return 'text-warning-600';
      case 'done': return 'text-success-600';
      default: return 'text-gray-600';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-danger-600 bg-red-50 border-red-200';
      case 'medium': return 'text-warning-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-success-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const getStatusOptions = (currentStatus) => {
    const options = [
      { value: 'todo', label: 'À faire' },
      { value: 'in_progress', label: 'En cours' },
      { value: 'done', label: 'Terminé' }
    ];
    return options;
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête Membre */}
      <div className="glass-effect bg-gradient-to-r from-green-400 to-blue-500 dark:from-green-500 dark:to-blue-600 rounded-2xl shadow-2xl p-8 text-white animate-bounce-in floating-animation">
        <h1 className="text-4xl font-bold mb-3 animate-fade-in">🎯 Mes Tâches</h1>
        <p className="text-green-100 dark:text-green-200 text-lg animate-slide-in">
          Bonjour {user?.name}, voici vos tâches assignées
        </p>
      </div>

      {/* Statistiques personnelles */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card text-center dark:bg-gray-800">
          <div className="text-3xl font-bold text-gray-600 dark:text-gray-300 mb-2">{myTaskStats.total}</div>
          <div className="text-gray-500 dark:text-gray-400">Mes tâches</div>
        </div>
        <div className="card text-center dark:bg-gray-800">
          <div className="text-3xl font-bold text-gray-500 mb-2">{myTaskStats.todo}</div>
          <div className="text-gray-500">À faire</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-warning-600 mb-2">{myTaskStats.inProgress}</div>
          <div className="text-gray-500">En cours</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-success-600 mb-2">{myTaskStats.done}</div>
          <div className="text-gray-500">Terminées</div>
        </div>
      </div>

      {myTasks.length === 0 ? (
        <div className="card text-center py-12 dark:bg-gray-800">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucune tâche assignée</h3>
          <p className="text-gray-500">Vous n'avez actuellement aucune tâche assignée.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tâches actives */}
          <div className="card dark:bg-gray-800">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Tâches actives</h2>
              <span className="text-sm text-gray-500">{activeTasks.length} tâche(s)</span>
            </div>
            
            {activeTasks.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">🎉</div>
                <p className="text-gray-500">Toutes vos tâches sont terminées !</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {activeTasks.map((task) => (
                  <div key={task._id} className={`p-4 rounded-lg border ${getPriorityColor(task.priority)} ${task.status === 'done' ? 'opacity-75' : ''}`}>
                    <div className="flex justify-between items-start mb-2 ">
                      <h3 className={`font-medium ${task.status === 'done' ? 'line-through text-gray-500' : 'text-gray-900 dark:text-gray-200'}`}>
                        {task.title}
                        {task.status === 'done' && <span className="ml-2 text-green-600">✅</span>}
                      </h3>
                      <span className="text-xs px-2 py-1 rounded-full bg-white border dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300">
                        {task.priority === 'high' ? '🔥 Haute' : task.priority === 'medium' ? '⚡ Moyenne' : '📋 Basse'}
                      </span>
                    </div>
                    
                    {task.description && (
                      <p className={`text-sm mb-3 ${task.status === 'done' ? 'line-through text-gray-400' : 'text-gray-600 dark:text-gray-400'}`}>
                        {task.description}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <select
                          value={task.status}
                          onChange={(e) => handleStatusChange(task._id, e.target.value)}
                          className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        >
                          {getStatusOptions(task.status).map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      {task.dueDate && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          📅 {formatDate(task.dueDate)}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Échéances à venir */}
          <div className="card dark:bg-gray-800">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Échéances à venir</h2>
              <span className="text-warning-600 text-sm font-medium">📅 7 jours</span>
            </div>
            
            {upcomingTasks.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Aucune échéance prochaine</p>
            ) : (
              <div className="space-y-3">
                {upcomingTasks.map((task) => (
                  <div key={task._id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate pr-2">{task.title}</h3>
                      <div className="flex items-center space-x-2 text-sm">
                        <span className={getStatusColor(task.status)}>
                          {task.status === 'todo' ? 'À faire' : task.status === 'in_progress' ? 'En cours' : 'Terminé'}
                        </span>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-500">
                          {task.priority === 'high' ? 'Haute' : task.priority === 'medium' ? 'Moyenne' : 'Basse'}
                        </span>
                      </div>
                    </div>
                    <div className="text-xs text-warning-600 font-medium">
                      {formatDate(task.dueDate)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Actions membre */}
      <div className="card dark:bg-gray-800">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Actions disponibles</h2>
        <div className="flex flex-wrap gap-4">
          <Button disabled className="opacity-50 cursor-not-allowed">
            📋 Voir mes tâches ({myTasks.length})
          </Button>
          <Button variant="outline" disabled className="opacity-50 cursor-not-allowed">
            📊 Mon historique
          </Button>
          <div className="text-sm text-gray-500 flex items-center">
            ℹ️ Vous pouvez uniquement modifier le statut de vos tâches assignées
          </div>
        </div>
        
        <div className="mt-4">
          <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">✨ Synchronisation automatique :</h4>
          <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <p>• Vos changements de statut sont automatiquement visibles par l'administrateur</p>
            <p>• Les tâches terminées sont marquées d'une coche ✅ et barrées</p>
            <p>• L'administrateur reçoit une notification pour chaque mise à jour</p>
            <p>• Utilisez le menu déroulant "Statut" pour changer l'état de vos tâches</p>
          </div>
        </div>
      </div>
    </div>
  );
});

MemberDashboard.displayName = 'MemberDashboard';

export default MemberDashboard;
