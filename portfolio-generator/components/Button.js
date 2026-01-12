// Button component with variants: primary, ghost, outline, destructive
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  disabled = false,
  onClick,
  className = '',
  isLoading = false,
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0a0a0a] disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-gradient-to-r from-[var(--color-accent)] to-[#e11d48] text-white hover:shadow-[0_0_20px_rgba(244,63,94,0.4)] hover:scale-[1.02] focus:ring-[var(--color-accent)] border border-transparent',
    secondary: 'glass text-white hover:bg-white/10 focus:ring-gray-500',
    ghost: 'bg-transparent text-gray-300 hover:text-white hover:bg-white/5 focus:ring-gray-500',
    outline: 'border border-[var(--color-border-glass)] bg-transparent text-white hover:bg-white/5 focus:ring-gray-500',
    destructive: 'bg-red-900/50 border border-red-500/50 text-red-200 hover:bg-red-900/80 focus:ring-red-500'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm rounded-lg',
    md: 'px-6 py-2.5 text-base rounded-[var(--radius-full)]',
    lg: 'px-8 py-3.5 text-lg rounded-[var(--radius-full)]'
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className} relative`}
      {...props}
    >
      <span className={`${isLoading ? 'invisible' : ''}`}>{children}</span>
      {isLoading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </span>
      )}
    </button>
  );
}
