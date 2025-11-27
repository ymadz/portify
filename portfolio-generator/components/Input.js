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
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <div className="w-full">
      {label && (
        <label 
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
      )}
      
      <input
        id={inputId}
        type={type}
        className={`
          w-full px-3 py-2 rounded-md border 
          ${error 
            ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
            : 'border-gray-300 focus:ring-[var(--accent)] focus:border-[var(--accent)]'
          }
          focus:outline-none focus:ring-2 focus:ring-offset-0
          disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
          transition-colors
          ${className}
        `}
        {...props}
      />
      
      {error && (
        <p className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
      
      {helperText && !error && (
        <p className="mt-1 text-sm text-[var(--muted)]">
          {helperText}
        </p>
      )}
    </div>
  );
}
