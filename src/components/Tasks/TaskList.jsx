import React, { memo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import AdminTaskList from './AdminTaskList';
import MemberTaskList from './MemberTaskList';

const TaskList = memo(() => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  // Afficher la liste de tâches appropriée selon le rôle
  if (user?.role === 'admin') {
    return <AdminTaskList />;
  } else {
    return <MemberTaskList />;
  }
});

TaskList.displayName = 'TaskList';

export default TaskList;
