// Avatar component with initials fallback
export default function Avatar({ 
  src, 
  alt,
  name,
  size = 'md',
  className = ''
}) {
  const sizes = {
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10 text-base',
    lg: 'h-12 w-12 text-lg',
    xl: 'h-16 w-16 text-xl'
  };
  
  // Generate initials from name
  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };
  
  const initials = getInitials(name || alt);
  
  return (
    <div 
      className={`
        ${sizes[size]} rounded-full overflow-hidden 
        flex items-center justify-center font-medium
        bg-[var(--accent-weak)] text-[var(--accent)]
        ${className}
      `}
    >
      {src ? (
        <img 
          src={src} 
          alt={alt || name || 'Avatar'} 
          className="h-full w-full object-cover"
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
}
