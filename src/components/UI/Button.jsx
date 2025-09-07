import React, { memo } from 'react';

const Button = memo(({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  disabled = false, 
  loading = false,
  className = '',
  onClick,
  type = 'button',
  ...props 
}) => {
  const baseClasses = 'font-medium rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95';
  
  const variants = {
    primary: 'btn-primary dark:bg-blue-600 dark:hover:bg-blue-700',
    secondary: 'btn-secondary dark:bg-gray-600 dark:hover:bg-gray-700 dark:text-white',
    danger: 'btn-danger dark:bg-red-600 dark:hover:bg-red-700',
    success: 'btn-success dark:bg-green-600 dark:hover:bg-green-700',
    outline: 'border-2 border-sky-300 bg-white/80 hover:bg-sky-50 text-sky-700 focus:ring-sky-200 backdrop-blur-sm dark:border-gray-600 dark:bg-gray-800/80 dark:hover:bg-gray-700 dark:text-gray-300'
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base'
  };

  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <div className="flex items-center">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current mr-2"></div>
          <span className="animate-pulse">Chargement...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
