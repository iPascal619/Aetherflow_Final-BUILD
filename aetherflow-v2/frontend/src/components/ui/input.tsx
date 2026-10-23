import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', ...props }, ref) => {
    const inputClasses = `
      block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm 
      ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 
      focus:ring-2 focus:ring-inset focus:ring-primary-600 
      disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 
      sm:text-sm sm:leading-6
      ${error ? 'ring-red-300 focus:ring-red-500' : ''}
      ${className}
    `;

    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-medium leading-6 text-gray-900">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={inputClasses}
          {...props}
        />
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
        {helperText && !error && (
          <p className="text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';