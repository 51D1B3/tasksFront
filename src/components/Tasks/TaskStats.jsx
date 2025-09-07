import React, { memo, useMemo } from 'react';

const TaskStats = memo(({ tasks }) => {
  const stats = useMemo(() => {
    const total = tasks.length;
    const todo = tasks.filter(t => t.status === 'todo').length;
    const inProgress = tasks.filter(t => t.status === 'in_progress').length;
    const done = tasks.filter(t => t.status === 'done').length;
    const completionRate = total > 0 ? Math.round((done / total) * 100) : 0;

    return { total, todo, inProgress, done, completionRate };
  }, [tasks]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      <div className="text-center">
        <div className="text-2xl font-bold text-gray-600">{stats.total}</div>
        <div className="text-sm text-gray-500">Total</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-gray-500">{stats.todo}</div>
        <div className="text-sm text-gray-500">À faire</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-warning-600">{stats.inProgress}</div>
        <div className="text-sm text-gray-500">En cours</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-success-600">{stats.done}</div>
        <div className="text-sm text-gray-500">Terminées</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-primary-600">{stats.completionRate}%</div>
        <div className="text-sm text-gray-500">Complété</div>
      </div>
    </div>
  );
});

TaskStats.displayName = 'TaskStats';

export default TaskStats;
