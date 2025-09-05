import React, { memo, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTasks } from '../../hooks/useTasks';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../UI/Button';

const AdminDashboard = memo(() => {
  const { allTasks, loading, taskStats } = useTasks();
  const { user } = useAuth();

  // Supprimé car remplacé par recentlyUpdatedTasks

  const recentlyUpdatedTasks = useMemo(() => {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    
    return allTasks
      .filter(task => {
        const updatedAt = new Date(task.updatedAt);
        const createdAt = new Date(task.createdAt);
        // Tâche mise à jour dans la dernière heure et pas juste créée
        return updatedAt > oneHourAgo && updatedAt.getTime() !== createdAt.getTime();
      })
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  }, [allTasks]);

  const upcomingTasks = useMemo(() => {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    return allTasks
      .filter(task => {
        if (!task.dueDate || task.status === 'done') return false;
        const dueDate = new Date(task.dueDate);
        return dueDate >= today && dueDate <= nextWeek;
      })
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .slice(0, 5);
  }, [allTasks]);

  const highPriorityTasks = useMemo(() => {
    return allTasks
      .filter(task => task.priority === 'high' && task.status !== 'done')
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      .slice(0, 5);
  }, [allTasks]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'todo': return 'text-gray-600';
      case 'in_progress': return 'text-warning-600';
      case 'done': return 'text-success-600';
      default: return 'text-gray-600';
    }
  };


  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
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
      {/* En-tête Admin */}
      <div className="glass-effect bg-gradient-to-r from-purple-500 to-indigo-600 dark:from-purple-600 dark:to-indigo-700 rounded-2xl shadow-2xl p-8 text-white animate-bounce-in floating-animation">
        <h1 className="text-4xl font-bold mb-3 animate-fade-in">👑 Dashboard Admin</h1>
        <p className="text-purple-100 dark:text-purple-200 text-lg animate-slide-in">
          Bienvenue {user?.name}, gérez toutes les tâches et les membres de votre équipe
        </p>
      </div>

      {/* Statistiques complètes */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card text-center">
          <div className="text-3xl font-bold text-gray-600 mb-2">{taskStats.total}</div>
          <div className="text-gray-500">Tâches totales</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-gray-500 mb-2">{taskStats.todo}</div>
          <div className="text-gray-500">À faire</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-warning-600 mb-2">{taskStats.inProgress}</div>
          <div className="text-gray-500">En cours</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-success-600 mb-2">{taskStats.done}</div>
          <div className="text-gray-500">Terminées</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tâches récemment mises à jour */}
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Tâches récemment mises à jour
              {recentlyUpdatedTasks.length > 0 && (
                <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {recentlyUpdatedTasks.length} nouvelle(s)
                </span>
              )}
            </h2>
            <Link to="/tasks">
              <Button variant="outline" size="sm">
                Gérer toutes
              </Button>
            </Link>
          </div>
          
          {recentlyUpdatedTasks.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Aucune mise à jour récente</p>
          ) : (
            <div className="space-y-3">
              {recentlyUpdatedTasks.map((task) => {
                const isRecentlyUpdated = new Date(task.updatedAt).getTime() !== new Date(task.createdAt).getTime();
                return (
                  <div key={task._id} className={`flex items-center justify-between p-3 rounded-lg ${
                    isRecentlyUpdated ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'
                  }`}>
                    <div className="flex-1">
                      <h3 className={`font-medium truncate ${task.status === 'done' ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                        {task.title}
                        {task.status === 'done' && <span className="ml-2 text-green-600">✅</span>}
                        {isRecentlyUpdated && <span className="ml-2 text-blue-600">🔄</span>}
                      </h3>
                      <div className="flex items-center space-x-2 text-sm">
                        <span className={getStatusColor(task.status)}>
                          {task.status === 'todo' ? 'À faire' : task.status === 'in_progress' ? 'En cours' : 'Terminé'}
                        </span>
                        <span className="text-gray-400">•</span>
                        <span className={`${task.status === 'done' ? 'line-through text-gray-400' : 'text-gray-500'}`}>
                          {task.assignedTo?.name || 'Non assigné'}
                        </span>
                        {isRecentlyUpdated && (
                          <span className="text-blue-600 text-xs font-medium">• Mis à jour</span>
                        )}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatDate(task.updatedAt)}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Tâches prioritaires */}
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Tâches prioritaires</h2>
            <span className="text-danger-600 text-sm font-medium">🔥 Haute priorité</span>
          </div>
          
          {highPriorityTasks.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Aucune tâche prioritaire</p>
          ) : (
            <div className="space-y-3">
              {highPriorityTasks.map((task) => (
                <div key={task._id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex-1">
                    <h3 className={`font-medium truncate ${task.status === 'done' ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                      {task.title}
                      {task.status === 'done' && <span className="ml-2 text-green-600">✅</span>}
                    </h3>
                    <div className="flex items-center space-x-2 text-sm">
                      <span className={getStatusColor(task.status)}>
                        {task.status === 'todo' ? 'À faire' : task.status === 'in_progress' ? 'En cours' : 'Terminé'}
                      </span>
                      <span className="text-gray-400">•</span>
                      <span className={`${task.status === 'done' ? 'line-through text-gray-400' : 'text-gray-500'}`}>
                        {task.assignedTo?.name || 'Non assigné'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Échéances à venir */}
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Échéances à venir</h2>
            <span className="text-warning-600 text-sm font-medium">📅 7 jours</span>
          </div>
          
          {upcomingTasks.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Aucune échéance prochaine</p>
          ) : (
            <div className="space-y-3">
              {upcomingTasks.map((task) => (
                <div key={task._id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex-1">
                    <h3 className={`font-medium truncate ${task.status === 'done' ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                      {task.title}
                      {task.status === 'done' && <span className="ml-2 text-green-600">✅</span>}
                    </h3>
                    <div className="flex items-center space-x-2 text-sm">
                      <span className={getStatusColor(task.status)}>
                        {task.status === 'todo' ? 'À faire' : task.status === 'in_progress' ? 'En cours' : 'Terminé'}
                      </span>
                      <span className="text-gray-400">•</span>
                      <span className={`${task.status === 'done' ? 'line-through text-gray-400' : 'text-gray-500'}`}>
                        {task.assignedTo?.name || 'Non assigné'}
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

      {/* Informations sur les mises à jour */}
      {recentlyUpdatedTasks.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-blue-600">🔔</span>
            <h3 className="text-lg font-semibold text-blue-900">Mises à jour récentes</h3>
          </div>
          <p className="text-blue-700 text-sm">
            <strong>{recentlyUpdatedTasks.length}</strong> tâche(s) ont été mises à jour par les membres dans la dernière heure.
            Les tâches terminées sont marquées d'une coche ✅ et barrées.
          </p>
        </div>
      )}

      {/* Actions Admin */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Actions administrateur</h2>
        <div className="flex flex-wrap gap-4">
          <Link to="/tasks">
            <Button>
              📋 Gérer toutes les tâches
            </Button>
          </Link>
          <Link to="/tasks">
            <Button variant="outline">
              ➕ Créer une tâche
            </Button>
          </Link>
          <Button variant="outline">
            👥 Gérer les membres
          </Button>
          <Button variant="outline">
            📊 Rapports et statistiques
          </Button>
        </div>
        
              </div>
    </div>
  );
});

AdminDashboard.displayName = 'AdminDashboard';

export default AdminDashboard;
