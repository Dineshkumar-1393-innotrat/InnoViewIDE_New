import React from 'react';

const HeaderButton = React.forwardRef(({ onClick, icon: Icon, title, children, isActive, ...props }, ref) => {
  const baseClasses = "p-2 rounded transition-all duration-150 ease-in-out flex items-center justify-center text-sm font-medium";
  
  const variantClasses = isActive 
    ? 'bg-blue-600 text-white'
    : 'text-gray-300 hover:text-white hover:bg-[161717] hover:-translate-y-px hover:shadow-[0_4px_12px_rgba(59,130,246,0.3)]';

  return (
    <button
      ref={ref}
      onClick={onClick}
      title={title}
      className={`${baseClasses} ${variantClasses}`}
      {...props}
    >
      {Icon && <Icon size={16} className="mr-2" />}
      {children}
    </button>
  );
});

export default HeaderButton;
