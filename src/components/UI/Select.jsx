import React, { memo, forwardRef } from 'react';

const Select = memo(forwardRef(({ 
  label,
  error,
  options = [],
  className = '',
  placeholder = 'Sélectionner...',
  ...props 
}, ref) => {
  const selectClasses = `input-field ${error ? 'border-danger-500 focus:ring-danger-500' : ''} ${className}`;

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <select
        ref={ref}
        className={selectClasses}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-danger-600">{error}</p>
      )}
    </div>
  );
}));

Select.displayName = 'Select';

export default Select;
