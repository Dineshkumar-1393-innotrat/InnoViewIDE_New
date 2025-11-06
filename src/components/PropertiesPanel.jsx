import React from 'react';
import './PropertiesPanel.css';

const PropertiesPanel = ({ selectedNode, onNodeUpdate }) => {
  const isNodeSelected = Boolean(selectedNode);
  
  const handlePropertyChange = (property, value) => {
    if (onNodeUpdate && selectedNode) {
      onNodeUpdate(selectedNode.id, property, value);
    }
  };

  const handleEditText = () => {
    if (onNodeUpdate && selectedNode) {
      onNodeUpdate(selectedNode.id, 'editing', true);
    }
  };

  return (
    <div className="properties-panel">
      <h3>Properties</h3>
      <div style={{ fontSize: 12, marginBottom: 8 }}>
        Selected: {selectedNode ? selectedNode.type || 'Node' : 'None'}
      </div>

      {/* Fill Color */}
      <div className="prop-row">
        <label>Fill</label>
        <input
          type="color"
          disabled={!isNodeSelected}
          value={selectedNode?.data?.fill || '#ffffff'}
          onChange={(e) => handlePropertyChange('fill', e.target.value)}
        />
      </div>

      {/* Border Color */}
      <div className="prop-row">
        <label>Border</label>
        <input
          type="color"
          disabled={!isNodeSelected}
          value={selectedNode?.data?.stroke || '#000000'}
          onChange={(e) => handlePropertyChange('stroke', e.target.value)}
        />
      </div>

      {/* Text Color */}
      <div className="prop-row">
        <label>Text</label>
        <input
          type="color"
          disabled={!isNodeSelected}
          value={selectedNode?.data?.text || '#000000'}
          onChange={(e) => handlePropertyChange('text', e.target.value)}
        />
      </div>

      {/* Border Width */}
      <div className="prop-row">
        <label>Border W</label>
        <input
          type="range"
          min="1"
          max="10"
          step="1"
          disabled={!isNodeSelected}
          value={selectedNode?.data?.strokeWidth ?? 2}
          onChange={(e) => handlePropertyChange('strokeWidth', parseFloat(e.target.value))}
          className="prop-slider"
        />
      </div>

      {/* Text Size */}
      <div className="prop-row">
        <label>Text Size</label>
        <input
          type="range"
          min="8"
          max="48"
          step="1"
          disabled={!isNodeSelected}
          value={selectedNode?.data?.fontSize || 12}
          onChange={(e) => handlePropertyChange('fontSize', parseInt(e.target.value))}
          className="prop-slider"
        />
      </div>

      {/* Rotate */}
      <div className="prop-row">
        <label>Rotate</label>
        <input
          type="range"
          min="0"
          max="359"
          step="1"
          disabled={!isNodeSelected}
          value={selectedNode?.data?.rotation || 0}
          onChange={(e) => handlePropertyChange('rotation', parseInt(e.target.value))}
          className="prop-slider"
        />
      </div>

      {/* Edit Text Button */}
      <button 
        className="edit-text-btn"
        disabled={!isNodeSelected}
        onClick={handleEditText}
      >
        Edit Text
      </button>
    </div>
  );
};

export default PropertiesPanel;
