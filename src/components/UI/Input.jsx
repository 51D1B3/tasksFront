import React, { memo, forwardRef } from 'react';

const Input = memo(forwardRef(({ 
  label,
  error,
  className = '',
  type = 'text',
  ...props 
}, ref) => {
  const inputClasses = `input-field dark:bg-gray-900 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 ${error ? 'border-red-500 focus:ring-red-500 dark:border-red-400' : ''} ${className}`;

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        className={inputClasses}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}));

Input.displayName = 'Input';

export default Input;
