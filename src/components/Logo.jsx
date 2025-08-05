import React from 'react';

const Logo = ({ size = 24, color = '#1970fc', className = '' }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Main hexagon shape */}
      <path d="M12 2L22 8.5V15.5L12 22L2 15.5V8.5L12 2Z" stroke={color} strokeWidth="2" fill="none"/>
      
      {/* Inner hexagon */}
      <path d="M12 6L18 9.5V13.5L12 17L6 13.5V9.5L12 6Z" stroke={color} strokeWidth="1.5" fill="none"/>
      
      {/* Center dot */}
      <circle cx="12" cy="12" r="2" fill={color}/>
      
      {/* Connection lines */}
      <path d="M12 4L12 8" stroke={color} strokeWidth="1.5"/>
      <path d="M12 16L12 20" stroke={color} strokeWidth="1.5"/>
      <path d="M4 12L8 12" stroke={color} strokeWidth="1.5"/>
      <path d="M16 12L20 12" stroke={color} strokeWidth="1.5"/>
    </svg>
  );
};

export default Logo; 