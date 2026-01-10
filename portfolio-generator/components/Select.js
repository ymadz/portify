'use client';

import { useId } from 'react';

// Select/Dropdown component with label and error support
export default function Select({
  label,
  error,
  helperText,
  id,
  options = [],
  placeholder = 'Select an option',
  className = '',
  children,
  ...props
}) {
  const generatedId = useId();
  const selectId = id || generatedId;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={selectId}
          className="block text-sm font-medium text-gray-300 mb-2"
        >
          {label}
        </label>
      )}

      <div className="relative">
        <select
          id={selectId}
          className={`
          w-full px-4 py-3 rounded-2xl border bg-white/5 text-gray-100 placeholder:text-gray-500 font-medium shadow-sm appearance-none
          ${error
              ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
              : 'border-white/10 focus:ring-2 focus:ring-rose-500 focus:border-transparent hover:border-white/20'
            }
          focus:outline-none 
          disabled:bg-white/5 disabled:text-gray-600 disabled:cursor-not-allowed
          transition-all
          dark:[color-scheme:dark]
          ${className}
        `}
          {...props}
        >
          {children ? children : (
            <>
              {placeholder && (
                <option value="" disabled className="bg-[#111] text-gray-500">
                  {placeholder}
                </option>
              )}
              {options.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                  className="bg-[#111] text-gray-200"
                >
                  {option.label}
                </option>
              ))}
            </>
          )}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-500">
          {error}
        </p>
      )}

      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-400">
          {helperText}
        </p>
      )}
    </div>
  );
}
