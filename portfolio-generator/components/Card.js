// Card component with composable parts: Header, Body, Footer
export default function Card({ children, className = '', ...props }) {
  return (
    <div 
      className={`bg-white rounded-[var(--radius-md)] shadow-card p-6 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

Card.Header = function CardHeader({ children, className = '' }) {
  return (
    <div className={`mb-4 ${className}`}>
      {children}
    </div>
  );
};

Card.Title = function CardTitle({ children, className = '' }) {
  return (
    <h3 className={`text-xl font-semibold text-gray-900 ${className}`}>
      {children}
    </h3>
  );
};

Card.Body = function CardBody({ children, className = '' }) {
  return (
    <div className={`text-gray-600 ${className}`}>
      {children}
    </div>
  );
};

Card.Footer = function CardFooter({ children, className = '' }) {
  return (
    <div className={`mt-4 pt-4 border-t border-gray-100 ${className}`}>
      {children}
    </div>
  );
};
