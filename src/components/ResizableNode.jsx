import React, { useState, useRef, useMemo } from 'react';
import { Handle, Position, NodeResizer, useNodeId, useReactFlow } from 'reactflow';
import { useDispatch, useSelector } from 'react-redux';
import { setNodes, rotateNode } from '../features/flow/flowSlice';
import { selectNodes } from '../features/flow/flowSelectors';
import { useZoom } from '../contexts/ZoomContext';

export default function ResizableNode(props) {
  const nodeId = useNodeId();
  const { getNode } = useReactFlow();
  const node = getNode(nodeId);
  const { id, data, selected, dragHandle } = props;
  const dispatch = useDispatch();
  const allNodes = useSelector(selectNodes);
  const zoom = useZoom();

  const [editing, setEditing] = useState(false);
  const [label, setLabel] = useState(data?.label || data?.shape?.name || '');
  const [isHovered, setIsHovered] = useState(false);
  const inputRef = useRef(null);
  const nodeRef = useRef(null);
  const [isRotating, setIsRotating] = useState(false);

  // Defensive: check for required shape/icon properties before rendering SVG
  const isValidShape = !!(data && data.shape && data.shape.icon && data.shape.icon.path && data.shape.icon.viewBox);
  const style = node?.style || {};
  const currentWidth = style.width || node?.width || 80;
  const currentHeight = style.height || node?.height || 50;

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
  
  const labelStyle = useMemo(() => ({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    fontSize: Math.max(8, Math.min(16, 14 / zoom)), // Responsive font size with min/max bounds
    fontWeight: 500,
    color: style.color || data.textColor || '#222',
    cursor: 'pointer',
    userSelect: 'none',
    pointerEvents: 'auto',
    width: `calc(100% - ${Math.max(8, 24 / zoom)}px)`,
    maxWidth: `calc(100% - ${Math.max(8, 24 / zoom)}px)`,
    maxHeight: `calc(100% - ${Math.max(8, 24 / zoom)}px)`,
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
  }), [zoom, style.color, data.textColor, currentWidth, currentHeight]);

  // Helper to render a single handle per side, centered
  const handleSize = Math.max(6, Math.min(12, 8 / zoom)); // Responsive handle size with min/max bounds
  const handleStyle = {
    width: handleSize * 1.6,
    height: handleSize * 1.6,
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

  // Get rotation from node data (default 0)
  const rotation = node?.data?.rotation || 0;

  // --- Rotation handle logic ---
  // Helper to get the center of the node in page coordinates
  const getNodeCenter = () => {
    const rect = nodeRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };
  };

  // Mouse and touch event handlers for rotation
  const handleRotateStart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsRotating(true);

    const getEventCoordinates = (event) => {
      if (event.touches && event.touches[0]) {
        return { x: event.touches[0].clientX, y: event.touches[0].clientY };
      }
      return { x: event.clientX, y: event.clientY };
    };

    const onMove = (moveEvent) => {
      const center = getNodeCenter();
      const coords = getEventCoordinates(moveEvent);
      const dx = coords.x - center.x;
      const dy = coords.y - center.y;
      let angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90; // 0 is vertical
      if (angle < 0) angle += 360;
      dispatch(rotateNode({ id, rotation: angle }));
    };

    const onUp = () => {
      setIsRotating(false);
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('touchend', onUp);
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    document.addEventListener('touchmove', onMove, { passive: false });
    document.addEventListener('touchend', onUp);
  };

  // --- End rotation logic ---

  return (
    <div
      ref={nodeRef}
      className="absolute group bg-transparent max-w-full"
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
        transform: `rotate(${rotation}deg)`, // Apply rotation
        transition: isRotating ? 'none' : 'transform 0.15s',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onDoubleClick={() => setEditing(true)}
    >

      <NodeResizer
        minWidth={Math.max(40, 60 / zoom)} // Responsive minimum width
        minHeight={Math.max(30, 45 / zoom)} // Responsive minimum height
        isVisible={selected || isHovered}
        lineClassName="border-blue-400 border border-dashed"
        handleClassName="bg-blue-500 rounded-full shadow hover:bg-blue-600 focus:bg-blue-700 transition-all duration-150"
        keepAspectRatio={false}
        onResizeEnd={handleResizeEnd}
        handleStyle={{
          width: Math.max(8, Math.min(16, 12 / zoom)) + 'px', // Responsive handle size
          height: Math.max(8, Math.min(16, 12 / zoom)) + 'px',
          margin: `-${Math.max(3, 6 / zoom)}px`, // Responsive margin
          zIndex: 20,
        }}
      />
      {/* SVG shape rendering (if valid) */}
      {isValidShape && (
        <svg
          viewBox={data.shape.icon.viewBox}
          width={svgWidth}
          height={svgHeight}
          style={{ ...svgStyle, background: 'transparent' }}
          preserveAspectRatio="xMidYMid meet"
        >
          <path
            d={data.shape.icon.path}
            fill="transparent"
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
            padding: Math.max(2, 4 / zoom),
            width: '100%',
            height: Math.max(16, 20 / zoom) + 'px',
            maxWidth: `calc(100% - ${Math.max(8, 16 / zoom)}px)`,
            maxHeight: currentHeight - Math.max(8, 16 / zoom),
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            boxSizing: 'border-box',
            outline: 'none',
            fontSize: Math.max(8, Math.min(16, 14 / zoom)) + 'px',
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
      {/* Rotation handle: only show on hover or selected */}
      {(isHovered || selected) && (
        <div
          className="nodrag"
          onMouseDownCapture={handleRotateStart}
          onTouchStart={handleRotateStart}
          style={{
            position: 'absolute',
            top: -Math.max(20, 24 / zoom),
            right: -Math.max(20, 24 / zoom),
            width: Math.max(24, 28 / zoom),
            height: Math.max(24, 28 / zoom),
            background: 'white',
            borderRadius: '50%',
            boxShadow: '0 2px 8px #0001',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'grab',
            zIndex: 30,
            border: `${Math.max(1, 1.5 / zoom)}px solid #2563eb`,
            transition: 'background 0.15s',
          }}
          title="Rotate"
        >
          {/* SVG circular arrow icon */}
          <svg 
            width={Math.max(14, 18 / zoom)} 
            height={Math.max(14, 18 / zoom)} 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="#2563eb" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M21 2v6h-6" />
            <path d="M3 13a9 9 0 0 1 15-7.7L21 8" />
          </svg>
        </div>
      )}
    </div>
  );
}
