import React, { memo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import ThemeToggle from '../UI/ThemeToggle';

const Header = memo(() => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="glass-effect border-b border-white/20 dark:border-gray-700 animate-slide-in dark:bg-gray-800/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold gradient-text floating-animation dark:text-white">
              ✨ Gestionnaire de Tâches
            </Link>
          </div>

          <nav className="hidden md:flex space-x-2">
            <Link
              to="/"
              className={`px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                isActive('/') 
                  ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg' 
                  : 'text-sky-700 hover:bg-white/50 hover:text-sky-800 dark:text-sky-300 dark:hover:bg-gray-700/50 dark:hover:text-sky-200'
              }`}
            >
              🏠 Tableau de bord
            </Link>
            <Link
              to="/tasks"
              className={`px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                isActive('/tasks') 
                  ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg' 
                  : 'text-sky-700 hover:bg-white/50 hover:text-sky-800 dark:text-sky-300 dark:hover:bg-gray-700/50 dark:hover:text-sky-200'
              }`}
            >
              📋 Mes Tâches
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <ThemeToggle className="hidden md:flex" />
            <div className="relative">
              <div className="pulse-ring"></div>
              <div className="bg-gradient-to-r from-sky-400 to-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                👋 {user?.name || user?.email}
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="text-sm text-sky-700 hover:text-red-600 transition-all duration-300 px-4 py-2 rounded-lg hover:bg-white/50 transform hover:scale-105 dark:text-sky-300 dark:hover:bg-gray-700/50 dark:hover:text-red-400"
            >
              🚪 Déconnexion
            </button>
          </div>
        </div>
      </div>
    </header>
  );
});

Header.displayName = 'Header';

export default Header;
