import React, { useState, useEffect, useRef } from 'react';

const ArrowHeadSelector = ({ 
  isOpen, 
  position, 
  onArrowHeadSelect, 
  onClose, 
  currentArrowHead = arrow 
}) => {
  const selectorRef = useRef(null);

  const arrowHeadTypes =
    [
      { id: 'none', name: 'None', icon: '—' },
      { id: 'arrow', name: 'Arrow', icon: '→' },
      { id: 'arrowclosed', name: 'Closed Arrow', icon: '▶' },
      { id: 'arrowclosed', name: 'Triangle', icon: '▲' },
      { id: 'diamond', name: 'Diamond', icon: '◆' },
      { id: 'circle', name: 'Circle', icon: '●' },
      { id: 'cross', name: 'Cross', icon: '✕' },
      { id: 'line', name: 'Line', icon: '|' }
    ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectorRef.current && !selectorRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleArrowHeadClick = (arrowHead) => {
    onArrowHeadSelect(arrowHead);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      ref={selectorRef}
      className="absolute z-50 white border border-gray-300 rounded-lg shadow-lg p-3  style={{
        left: position.x,
        top: position.y,
        minWidth: 200px'
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">        Arrow Head Type
        </span>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 text-lg"
        >
          ×
        </button>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        {arrowHeadTypes.map((arrowHead) => (
          <button
            key={arrowHead.id}
            className={`p-2 border-2 transition-all hover:scale-105 rounded ${
              currentArrowHead === arrowHead.id 
                ? 'border-blue-500'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onClick={() => handleArrowHeadClick(arrowHead.id)}
            title={arrowHead.name}
          >
            <div className="flex items-center gap-2">             <span className="text-lg">{arrowHead.icon}</span>
              <span className="text-sm">{arrowHead.name}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ArrowHeadSelector; 