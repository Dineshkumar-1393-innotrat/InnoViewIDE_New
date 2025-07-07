import React from 'react';

const Shape = ({ icon, name, onCanvas = false }) => {
  if (onCanvas) {
    return (
      <svg
        width="100%"
        height="100%"
        viewBox={icon?.viewBox || '0 0 100 100'}
        preserveAspectRatio="xMidYMid meet"
        style={{
          fill: '#F7FAFF', // A dark color to match the canvas background
          stroke: '#6b7280', // A neutral stroke color
          strokeWidth: 2,
        }}
      >
        <path d={icon?.path} />
      </svg>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-2 p-2 rounded-lg cursor-pointer group hover:bg-gray-700 transition-colors">
      <div className="w-12 h-12 text-gray-400 group-hover:text-white transition-colors">
        <svg
          viewBox={icon?.viewBox || '0 0 100 100'}
          preserveAspectRatio="xMidYMid meet"
          fill="none"
          stroke="currentColor"
          strokeWidth="5"
        >
          <path d={icon?.path} />
        </svg>
      </div>
      <span className="text-xs text-center text-gray-400 group-hover:text-white">{name}</span>
    </div>
  );
};

export default Shape;