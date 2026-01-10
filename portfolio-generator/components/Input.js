'use client';

import { useId } from 'react';

// Input component with label, helper text, and error support
export default function Input({
  label,
  error,
  helperText,
  id,
  type = 'text',
  className = '',
  ...props
}) {
  const generatedId = useId();
  const inputId = id || generatedId;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-300 mb-2"
        >
          {label}
        </label>
      )}

      <input
        id={inputId}
        type={type}
        className={`
          w-full px-4 py-3 rounded-2xl border bg-white/5 text-white placeholder:text-gray-500 font-medium
          ${error
            ? 'border-red-500/50 focus:ring-red-500 focus:border-red-500'
            : 'border-white/10 focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent'
          }
          focus:outline-none focus:bg-white/10
          disabled:bg-white/5 disabled:text-gray-600 disabled:cursor-not-allowed
          transition-all
          ${className}
        `}
        {...props}
      />

      {error && (
        <p className="mt-1 text-sm text-red-400">
          {error}
        </p>
      )}

      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">
          {helperText}
        </p>
      )}
    </div>
  );
}
