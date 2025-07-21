import React, { useState, useRef } from 'react';
import { Handle, Position, NodeResizer, useNodeId, useReactFlow } from 'reactflow';
import { useDispatch, useSelector } from 'react-redux';
import { setNodes } from '../features/flow/flowSlice';
import { selectNodes } from '../features/flow/flowSelectors';

export default function ResizableNode(props) {
  const nodeId = useNodeId();
  const { getNode } = useReactFlow();
  const node = getNode(nodeId);
  const { id, data, selected } = props;
  const dispatch = useDispatch();
  const allNodes = useSelector(selectNodes);

  const [editing, setEditing] = useState(false);
  const [label, setLabel] = useState(data?.label || data?.shape?.name || '');
  const [isHovered, setIsHovered] = useState(false);
  const inputRef = useRef(null);

  // Defensive: check for required shape/icon properties before rendering SVG
  const isValidShape = !!(data && data.shape && data.shape.icon && data.shape.icon.path && data.shape.icon.viewBox);
  const style = node?.style || {};
  const currentWidth = style.width || node?.width || 100;
  const currentHeight = style.height || node?.height || 60;

  // Save label to Redux
  const saveLabel = () => {
    setEditing(false);
    const updatedNodes = allNodes.map((n) =>
      n.id === id ? { ...n, data: { ...n.data, label } } : n
    );
    dispatch(setNodes(updatedNodes));
  };

  // Handle label edit
  const handleLabelChange = (e) => setLabel(e.target.value);
  const handleBlur = saveLabel;
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      inputRef.current?.blur();
    } else if (e.key === 'Escape') {
      setLabel(data?.label || data?.shape?.name || '');
      setEditing(false);
    }
  };

  // Resize handler: update node size in Redux
  const handleResizeEnd = (e, { width, height }) => {
    const updatedNodes = allNodes.map((n) =>
      n.id === id ? { ...n, style: { ...n.style, width, height }, width, height } : n
    );
    dispatch(setNodes(updatedNodes));
  };

  // Show handles only on hover or selection
  const showHandles = selected || isHovered;

  // Calculate SVG and label positioning
  let svgWidth = currentWidth;
  let svgHeight = currentHeight;
  let svgStyle = { width: '100%', height: '100%', display: 'block', margin: 0, position: 'absolute', top: 0, left: 0, zIndex: 1 };
  let labelStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    fontSize: 14,
    fontWeight: 500,
    color: style.color || data.textColor || '#222',
    cursor: 'pointer',
    userSelect: 'none',
    pointerEvents: 'auto',
    width: Math.max(0, currentWidth - 24), // 12px padding on each side
    maxWidth: Math.max(0, currentWidth - 24),
    maxHeight: Math.max(0, currentHeight - 24),
    textAlign: 'center',
    whiteSpace: 'pre-line',
    zIndex: 2,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    wordBreak: 'break-word',
    padding: 0,
  };

  // Helper to render a single handle per side, centered
  const handleSize = 6;
  const handleStyle = {
    width: 10,
    height: 10,
    background: '#2563eb',
    border: 'none',
    borderRadius: '50%',
    zIndex: 10,
    boxShadow: '0 1px 3px #2563eb22',
    transition: 'background 0.15s, box-shadow 0.15s',
    cursor: 'pointer',
  };
  // Helper to render handles dynamically based on shape definition
  let handles = [];
  if (data && data.shape && Array.isArray(data.shape.anchors) && data.shape.icon?.viewBox) {
    // Map anchors from SVG viewBox to node's width/height
    const [vbX, vbY, vbW, vbH] = data.shape.icon.viewBox.split(/\s+|,/).map(Number);
    handles = data.shape.anchors.map((pt, idx) => {
      // Map anchor from SVG coordinates to percent of node size
      const left = ((pt.x - vbX) / vbW) * 100;
      const top = ((pt.y - vbY) / vbH) * 100;
      return {
        id: `anchor-${idx}`,
        position: Position.Top,
        style: {
          position: 'absolute',
          left: `${left}%`,
          top: `${top}%`,
          transform: 'translate(-50%, -50%)',
        },
        anchorIndex: idx,
      };
    });
  } else if (data && data.shape && typeof data.shape.getHandles === 'function') {
    handles = data.shape.getHandles();
  } else {
    // Default: centered on bounding box
    handles = [
      { id: 'top', position: Position.Top, style: { top: '0%', left: '50%' } },
      { id: 'bottom', position: Position.Bottom, style: { top: '100%', left: '50%' } },
      { id: 'left', position: Position.Left, style: { top: '50%', left: '0%' } },
      { id: 'right', position: Position.Right, style: { top: '50%', left: '100%' } },
    ];
  }

  return (
    <div
      className="absolute group bg-transparent"
      style={{
        width: currentWidth,
        height: currentHeight,
        border: (selected || isHovered)
          ? '1.5px dashed #2563eb'
          : 'none',
        boxShadow: (selected || isHovered)
          ? '0 0 0 1px #93c5fd55'
          : 'none',
        zIndex: 2,
        boxSizing: 'border-box',
        background: 'none',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onDoubleClick={() => setEditing(true)}
    >
      <NodeResizer
        minWidth={40}
        minHeight={30}
        isVisible={selected || isHovered}
        lineClassName="border-blue-400 border border-dashed"
        handleClassName="bg-blue-500 !w-2.5 !h-2.5 rounded-full shadow hover:bg-blue-600 focus:bg-blue-700 transition-all duration-150"
        keepAspectRatio={false}
        onResizeEnd={handleResizeEnd}
        handleStyle={{
          margin: '-6px', // Move handles 6px outside the node to avoid overlap
          zIndex: 20,
        }}
      />
      {/* SVG shape rendering (if valid) */}
      {isValidShape && (
        <svg
          viewBox={data.shape.icon.viewBox}
          width={svgWidth}
          height={svgHeight}
          style={{ ...svgStyle, background: 'none' }}
          preserveAspectRatio="xMidYMid meet"
        >
          <path
            d={data.shape.icon.path}
            fill="none"
            stroke={style.stroke || data.color || '#6b7280'}
            strokeWidth="2"
          />
        </svg>
      )}
      {/* Editable label */}
            {editing ? (
              <input
          ref={inputRef}
                value={label}
          onChange={handleLabelChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          autoFocus
          style={{
            ...labelStyle,
            background: 'white',
            border: '1px solid #2563eb',
            borderRadius: 4,
            padding: 2,
            width: '80%',
            height: '1.8em',
            maxWidth: currentWidth - 16,
            maxHeight: currentHeight - 16,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            boxSizing: 'border-box',
            outline: 'none',
          }}
              />
            ) : (
        <span
          style={{
            ...labelStyle,
            maxWidth: currentWidth - 16,
            maxHeight: currentHeight - 16,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            wordBreak: 'break-word',
          }}
          onDoubleClick={() => setEditing(true)}
        >
          {label}
        </span>
            )}
      {/* Render dynamic handles */}
      {handles.map((h, i) => (
        <Handle
          key={h.id}
          id={h.id}
          type={h.position === Position.Top || h.position === Position.Left ? 'source' : 'target'}
          position={h.position}
          isConnectable={true}
          style={{
            ...handleStyle,
            ...h.style,
            display: showHandles ? 'block' : 'none',
          }}
        />
      ))}
    </div>
  );
}
