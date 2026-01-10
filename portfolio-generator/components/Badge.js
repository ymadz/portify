// Badge/Chip component for skills and tags
export default function Badge({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  ...props
}) {
  const variants = {
    default: 'bg-rose-500/10 text-rose-400 border border-rose-500/20',
    success: 'bg-green-500/10 text-green-400 border border-green-500/20',
    warning: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
    danger: 'bg-red-500/10 text-red-400 border border-red-500/20',
    neutral: 'bg-white/5 text-gray-400 border border-white/10',
    primary: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
    secondary: 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base'
  };

  return (
    <span
      className={`
        inline-flex items-center font-medium rounded-full
        ${variants[variant] || variants.default} ${sizes[size]} ${className}
      `}
      {...props}
    >
      {children}
    </span>
  );
}
