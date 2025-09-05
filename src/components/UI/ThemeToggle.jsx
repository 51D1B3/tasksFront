import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const ThemeToggle = ({ className = '' }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 ${
        isDark 
          ? 'bg-gray-800 border-gray-600 text-white hover:bg-gray-700' 
          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
      } ${className}`}
      title={`Passer au mode ${isDark ? 'clair' : 'sombre'}`}
    >
      <span className="text-lg">
        {isDark ? '☀️' : '🌙'}
      </span>
      <span className="text-sm font-medium">
        {isDark ? 'Clair' : 'Sombre'}
      </span>
    </button>
  );
};

export default ThemeToggle;