import React from 'react';

const HeaderButton = React.forwardRef(({ icon: Icon, tooltip, onClick, isActive = false, children }, ref) => {
  return (
    <button
      ref={ref}
      onClick={onClick}
      className={`p-2 rounded-md ${isActive ? 'bg-blue-600 text-white' : 'hover:bg-gray-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white transition-colors duration-200`}
      aria-label={tooltip}
    >
      {Icon && <Icon size={16} />}
      {children}
    </button>
  );
});

export default HeaderButton;
