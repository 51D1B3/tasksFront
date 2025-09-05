import React, { memo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import AdminDashboard from '../components/Dashboard/AdminDashboard';
import MemberDashboard from '../components/Dashboard/MemberDashboard';

const Dashboard = memo(() => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  // Afficher le dashboard approprié selon le rôle
  if (user?.role === 'admin') {
    return <AdminDashboard />;
  } else {
    return <MemberDashboard />;
  }
});

Dashboard.displayName = 'Dashboard';

export default Dashboard;
