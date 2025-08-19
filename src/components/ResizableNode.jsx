import React, { useState, useRef, useMemo, useEffect } from 'react';
import { Handle, Position, NodeResizer, useNodeId, useReactFlow } from 'reactflow';
import { useDispatch, useSelector } from 'react-redux';
import { setNodes, rotateNode } from '../features/flow/flowSlice';
import { selectNodes } from '../features/flow/flowSelectors';


export default function ResizableNode(props) {
  const {
    id,
    data,
    selected,
    isHovering, // New prop from DiagramEditor
    dragHandle,
    ...rest
  } = props;

  const nodeId = useNodeId();
  const { getNode, getZoom } = useReactFlow();
  const node = getNode(nodeId);
  const zoom = getZoom();

  const allNodes = useSelector(selectNodes);
  const dispatch = useDispatch();

  const [editing, setEditing] = useState(false);
  const [label, setLabel] = useState(data?.label || data?.shape?.name || '');
  const [isSelected, setIsSelected] = useState(selected);
  const [isResizing, setIsResizing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);
  const nodeRef = useRef(null);
  const [isRotating, setIsRotating] = useState(false);

  const isInteracting = isResizing || isDragging || isRotating;

  // Update selected state when props change
  useEffect(() => {
    setIsSelected(selected);
  }, [selected]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      // clearTimeout(hoverTimeoutRef.current);
    };
  }, []);

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
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      saveLabel();
    } else if (e.key === 'Escape') {
      setLabel(data.label || '');
      setEditing(false);
    } else if (e.key === 'Delete' || e.key === 'Backspace') {
      // Prevent deletion of the node when editing text
      e.stopPropagation();
    }
  };

  const handleBlur = () => {
    saveLabel();
  };

  const handleDoubleClick = (e) => {
    e.stopPropagation();
    setEditing(true);
  };

  const handleInputClick = (e) => {
    e.stopPropagation();
  };

  // Resize handler: update node size in Redux
  const handleResizeStart = () => {
    setIsResizing(true);
    console.log('Resize start for node:', id);
  };

  const handleResize = (e, { width, height }) => {
    if (isResizing) {
      requestAnimationFrame(() => {
        const updatedNodes = allNodes.map((n) =>
          n.id === id ? { ...n, style: { ...n.style, width, height }, width, height } : n
        );
        dispatch(setNodes(updatedNodes));
      });
    }
  };

  const handleResizeEnd = (e, { width, height }) => {
    console.log('Resize end:', { id, width, height });
    const updatedNodes = allNodes.map((n) => {
      if (n.id === id) {
        // Create a new node object for Redux, omitting non-serializable parts
        const { data, ...restOfNode } = n;
        const { shape, ...restOfData } = data;
        return {
          ...restOfNode,
          data: restOfData, // Data without the shape object
          style: { ...n.style, width, height },
          width,
          height,
        };
      }
      return n;
    });
    dispatch(setNodes(updatedNodes));
    setIsResizing(false);
  };

  // Handle drag start to prevent conflicts
  const handleDragStart = (e) => {
    // Only allow dragging if not clicking on handles, controls, or connection points
    if (e.target.closest('.react-flow__handle') || 
        e.target.closest('.react-flow__resize-control') || 
        e.target.closest('[title="Rotate"]') ||
        e.target.closest('.connection-handle')) {
      e.preventDefault();
      return false;
    }
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  // Show handles only on hover or selection - connection handles only when connecting
  const showHandles = selected || isHovering || isInteracting;
  const showConnectionHandles = selected || isHovering || isInteracting; // Only show when interacting

  // Calculate SVG and label positioning
  let svgWidth = currentWidth;
  let svgHeight = currentHeight;
  let svgStyle = { 
    width: '100%', 
    height: '100%', 
    display: 'block', 
    margin: 0, 
    position: 'absolute', 
    top: 0, 
    left: 0, 
    zIndex: 1,
    pointerEvents: 'none' // Prevent SVG from interfering with drag
  };
  
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

  // Connection handle style - distinct from drag handles
  const connectionHandleStyle = {
    width: Math.max(8, Math.min(12, 10 / zoom)),
    height: Math.max(8, Math.min(12, 10 / zoom)),
    background: '#10b981', // Green color to distinguish from drag handles
    border: '2px solid #ffffff',
    borderRadius: '50%',
    zIndex: 10,
    boxShadow: '0 2px 6px rgba(16, 185, 129, 0.5)',
    transition: 'all 0.15s ease',
    cursor: 'crosshair',
    position: 'absolute',
    opacity: showConnectionHandles ? 0.9 : 0, // Hide when not interacting
    // Ensure handles are truly fixed
    transform: 'translate(-50%, -50%)',
    pointerEvents: 'auto',
  };

  // Generate connection handles based on shape type and anchors
  const getConnectionHandles = () => {
    // Default connection handles - positioned exactly on shape boundaries
    // Use fewer, more precise connection points to avoid clutter
    return [
      { id: 'top', position: Position.Top, style: { top: '0%', left: '50%', transform: 'translate(-50%, -50%)' } },
      { id: 'bottom', position: Position.Bottom, style: { top: '100%', left: '50%', transform: 'translate(-50%, -50%)' } },
      { id: 'left', position: Position.Left, style: { top: '50%', left: '0%', transform: 'translate(-50%, -50%)' } },
      { id: 'right', position: Position.Right, style: { top: '50%', left: '100%', transform: 'translate(-50%, -50%)' } },
    ];
  };

  const connectionHandles = getConnectionHandles();

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
      className="resizable-node-container"
      style={{
        width: currentWidth,
        height: currentHeight,
        boxShadow: 'none',
        zIndex: 2,
        boxSizing: 'border-box',
        background: 'none',
        transform: `rotate(${rotation}deg)`,
        transition: isRotating ? 'none' : 'transform 0.15s ease-out',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'visible',
        pointerEvents: isResizing ? 'none' : 'auto',
        position: 'relative',
      }}
      onDoubleClick={handleDoubleClick}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      {/* NodeResizer - only for drag/resize handles in corners */}
      <NodeResizer
        minWidth={Math.max(40, 60 / zoom)}
        minHeight={Math.max(30, 45 / zoom)}
        isVisible={showHandles}
        lineClassName="border-blue-400 border border-dashed"
        handleClassName="resize-handle"
        keepAspectRatio={false}
        onResizeStart={handleResizeStart}
        onResize={handleResize}
        onResizeEnd={handleResizeEnd}
        handleStyle={{
          width: Math.max(8, Math.min(16, 12 / zoom)) + 'px',
          height: Math.max(8, Math.min(16, 12 / zoom)) + 'px',
          margin: `-${Math.max(3, 6 / zoom)}px`,
          zIndex: 20,
        }}
        lineStyle={{
          border: '1.5px dashed #2563eb',
          borderRadius: 0,
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
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      )}

      {/* Delete button - only show when selected */}
      {selected && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            console.log('Deleting node:', id);
            dispatch(deleteNode(id));
          }}
          className="delete-button nodrag"
          title="Delete node"
        >
          ×
        </button>
      )}

      {/* Editable label */}
      {editing ? (
        <input
          ref={inputRef}
          value={label}
          onChange={handleLabelChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          onClick={handleInputClick}
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
          onDoubleClick={handleDoubleClick}
        >
          {label}
        </span>
      )}

      {/* Connection handles - only visible when interacting */}
      {connectionHandles.map((h, i) => (
        <Handle
          key={h.id}
          id={h.id}
          type="source"
          position={h.position}
          isConnectable={true}
          style={{
            ...connectionHandleStyle,
            ...h.style,
            display: showConnectionHandles ? 'block' : 'none', // Only show when interacting
            // Ensure handles are truly fixed and don't move
            position: 'absolute',
            pointerEvents: 'auto',
            // Use the handle's own transform if it has one, otherwise use default
            transform: h.style?.transform || 'translate(-50%, -50%)',
          }}
          onMouseDown={(e) => {
            console.log('Connection handle clicked:', h.id, h.position, h.style);
            e.stopPropagation();
          }}
          onMouseEnter={(e) => {
            console.log('Connection handle hover:', h.id, h.position);
          }}
          className="connection-handle nodrag"
          title={`Connect from ${h.id}`} // Tooltip for better UX
        />
      ))}

      {/* Rotation handle: only show on hover or selected */}
      {showHandles && (
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
            pointerEvents: 'auto',
            zIndex: 30,
            border: `${Math.max(1, 1.5 / zoom)}px solid #2563eb`,
            transition: 'all 0.15s ease-out',
            transform: 'scale(1)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.background = '#f8fafc';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.background = 'white';
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
            style={{ pointerEvents: 'none' }} // Prevent SVG from interfering
          >
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
        </div>
      )}

    </div>
  );
} 