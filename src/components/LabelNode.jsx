import React, { useState } from 'react';

const COLOR_SWATCHES = [
  '#1970fc', '#ef4444', '#22c55e', '#f59e42', '#a21caf', '#fbbf24', '#0ea5e9', '#64748b', '#000000', '#ffffff'
];

export default function LabelNode({ data, id, selected, isConnectable, xPos, yPos }) {
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(data.label || 'Label');
  const [labelColor, setLabelColor] = useState(data.labelColor || '#222');
  const [borderColor, setBorderColor] = useState(data.borderColor || '#1970fc');

  const handleBlur = () => {
    setIsEditing(false);
    if (data.onLabelChange) data.onLabelChange(label, id, labelColor, borderColor);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      setIsEditing(false);
      if (data.onLabelChange) data.onLabelChange(label, id, labelColor, borderColor);
    }
  };

  return (
    <div
      style={{
        display: 'inline-block',
        padding: '7px 18px',
        borderRadius: 18,
        background: '#fff',
        border: selected ? `2px solid ${borderColor}` : `2px solid #bbb`,
        boxShadow: '0 2px 8px #0002',
        fontSize: 15,
        color: labelColor,
        minWidth: 40,
        maxWidth: 200,
        textAlign: 'center',
        fontWeight: 500,
        userSelect: 'none',
        cursor: 'pointer',
      }}
      onClick={() => setIsEditing(true)}
      title="Click to edit label"
    >
      {isEditing ? (
        <>
          <input
            type="text"
            value={label}
            onChange={e => setLabel(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            autoFocus
            style={{
              padding: '7px 10px',
              borderRadius: 14,
              border: `2px solid ${borderColor}`,
              background: '#fff',
              fontSize: 15,
              outline: 'none',
              minWidth: 40,
              maxWidth: 180,
              fontWeight: 500,
              color: labelColor,
            }}
          />
          {/* Color palette for text color */}
          <div style={{ display: 'flex', gap: 8, marginTop: 8, justifyContent: 'center' }}>
            {COLOR_SWATCHES.map(color => (
              <button
                key={color}
                style={{
                  width: 22,
                  height: 22,
                  background: color,
                  border: labelColor === color ? '2px solid #1970fc' : '1px solid #ccc',
                  borderRadius: '50%',
                  cursor: 'pointer',
                }}
                title={`Text color: ${color}`}
                onClick={e => { e.stopPropagation(); setLabelColor(color); }}
              />
            ))}
          </div>
          {/* Color palette for border color */}
          <div style={{ display: 'flex', gap: 8, marginTop: 4, justifyContent: 'center' }}>
            {COLOR_SWATCHES.map(color => (
              <button
                key={color}
                style={{
                  width: 22,
                  height: 22,
                  background: color,
                  border: borderColor === color ? '2px solid #1970fc' : '1px solid #ccc',
                  borderRadius: '50%',
                  cursor: 'pointer',
                }}
                title={`Border color: ${color}`}
                onClick={e => { e.stopPropagation(); setBorderColor(color); }}
              />
            ))}
          </div>
        </>
      ) : (
        label || <span style={{ color: '#bbb' }}>Click to add label</span>
      )}
    </div>
  );
} 