import React, { useState, useRef, useMemo, useEffect } from 'react';
import { Handle, Position, NodeResizer, useNodeId, useReactFlow } from 'reactflow';
import { useDispatch, useSelector } from 'react-redux';
import { setNodes, rotateNode } from '../features/flow/flowSlice';
import { selectNodes } from '../features/flow/flowSelectors';
import { shapes } from '../shapes/shapeData';

export default function ResizableNode(props) {
  const {
    id,
    data,
    selected,
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
  const [label, setLabel] = useState(data?.label || '');
  const [isSelected, setIsSelected] = useState(selected);
  const [isResizing, setIsResizing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);
  const nodeRef = useRef(null);
  const [isRotating, setIsRotating] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const isInteracting = isResizing || isDragging || isRotating;

  // Update selected state when props change
  useEffect(() => {
    setIsSelected(selected);
  }, [selected]);

  // Update label when data changes
  useEffect(() => {
    setLabel(data?.label || '');
  }, [data?.label]);

  // Force handle refresh when node data changes (e.g., after resize)
  useEffect(() => {
    if (data?.lastResized) {
      // Force a re-render of handles
      const timeoutId = setTimeout(() => {
        // This will trigger a re-render
        setIsHovering(false);
        setTimeout(() => setIsHovering(true), 50);
      }, 50);
      
      return () => clearTimeout(timeoutId);
    }
  }, [data?.lastResized]);

  // Focus input when editing starts
  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      // clearTimeout(hoverTimeoutRef.current);
    };
  }, []);

  // Get the full shape data using shapeId
  const shape = data?.shapeId ? shapes.find(s => s.id === data.shapeId) : null;
  
  // Defensive: check for required shape/icon properties before rendering SVG
  const isValidShape = !!(shape && shape.icon && shape.icon.path && shape.icon.viewBox);
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
      setLabel(data?.label || '');
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
    e.preventDefault();
    if (!isResizing && !isDragging && !isRotating) {
      setEditing(true);
    }
  };

  const handleInputClick = (e) => {
    e.stopPropagation();
  };

  // Resize handler: update node size in Redux
  const handleResizeStart = () => {
    setIsResizing(true);
    // console.log('Resize start for node:', id);
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
    // console.log('Resize end:', { id, width, height });
    const updatedNodes = allNodes.map((n) => {
      if (n.id === id) {
        // Keep the shape data for connection handles to work
        return {
          ...n,
          style: { ...n.style, width, height },
          width,
          height,
          // Force refresh of connection handles
          data: {
            ...n.data,
            lastResized: Date.now()
          }
        };
      }
      return n;
    });
    dispatch(setNodes(updatedNodes));
    setIsResizing(false);
    
    // Force ReactFlow to re-render handles
    setTimeout(() => {
      const reactFlowInstance = window.reactFlowInstance;
      if (reactFlowInstance) {
        reactFlowInstance.fitView({ duration: 0 });
      }
    }, 100);
  };

  // Handle drag start to prevent conflicts
  const handleDragStart = (e) => {
    // Only allow dragging if not clicking on handles, controls, or connection points
    if (e.target.closest('.react-flow__handle') || 
        e.target.closest('.react-flow__resize-control') || 
        e.target.closest('[title="Rotate"]') ||
        e.target.closest('.connection-handle') ||
        e.target.closest('.delete-button')) {
      e.preventDefault();
      return false;
    }
    
    console.log('🚀 Drag start for node:', id);
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  // Show handles only on hover or selection - connection handles only when interacting
  const showHandles = selected || isHovering || isInteracting;
  
  // Connection handles should be visible when node is selected, hovered, or being resized
  const shouldShowConnectionHandles = isHovering || selected || isResizing || isDragging;

  // Handle styling
  const handleSize = Math.max(4, Math.min(8, 6 / zoom)); // Smaller responsive handle size with min/max bounds
  const handleStyle = {
    width: handleSize * 1.4,
    height: handleSize * 1.4,
    background: '#10b981',
    border: '1.5px solid #ffffff',
    borderRadius: '50%',
    zIndex: 10,
    boxShadow: '0 1px 4px rgba(16, 185, 129, 0.4)',
    transition: 'all 0.2s ease',
    cursor: 'crosshair',
  };

  // Calculate SVG and label positioning - make SVG fill the entire node area
  let svgWidth = currentWidth;
  let svgHeight = currentHeight;
  let svgStyle = { 
    width: '100%', 
    height: '100%', 
    display: 'block', 
    margin: 0, 
    padding: 0,
    position: 'absolute', 
    top: 0, 
    left: 0, 
    zIndex: 1,
    pointerEvents: 'auto', // Allow SVG to be part of drag area
    overflow: 'visible', // Allow shape to extend to edges
    cursor: 'grab' // Show grab cursor on shape
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
    width: '100%',
    maxWidth: '100%',
    maxHeight: '100%',
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
    margin: 0,
  }), [zoom, style.color, data.textColor, currentWidth, currentHeight]);

  // Connection handle style - distinct from drag handles
  // const connectionHandleStyle = {
  //   width: Math.max(8, Math.min(10, 9 / zoom)),
  //   height: Math.max(8, Math.min(10, 9 / zoom)),
  //   background: '#10b981', // Green color to distinguish from drag handles
  //   border: '1.5px solid #ffffff',
  //   borderRadius: '50%',
  //   zIndex: 10,
  //   boxShadow: '0 1px 4px rgba(16, 185, 129, 0.4)',
  //   transition: 'all 0.15s ease',
  //   cursor: 'crosshair',
  //   position: 'absolute',
  //   opacity: shouldShowConnectionHandles ? 1 : 0, // Always visible when interacting
  //   transform: 'translate(-50%, -50%)',
  //   pointerEvents: 'auto',
  // };

  // Helper to render handles dynamically based on shape definition
  let handles = [];
  if (shape && typeof shape.getHandles === 'function') {
    // Use the shape's getHandles function if available
    try {
      handles = shape.getHandles();
      console.log(`🔗 Generated ${handles.length} handles for shape ${shape.name}`);
    } catch (error) {
      console.warn('Error generating handles for shape:', shape.name, error);
      // Fallback to default handles
      handles = [
        { id: 'top', position: Position.Top, style: { top: '0%', left: '50%', transform: 'translate(-50%, 0%)' } },
        { id: 'bottom', position: Position.Bottom, style: { top: '100%', left: '50%', transform: 'translate(-50%, -100%)' } },
        { id: 'left', position: Position.Left, style: { top: '50%', left: '0%', transform: 'translate(0%, -50%)' } },
        { id: 'right', position: Position.Right, style: { top: '50%', left: '100%', transform: 'translate(-100%, -50%)' } },
      ];
    }
  } else if (shape && Array.isArray(shape.anchors) && shape.icon?.viewBox) {
    // Fallback to anchors if getHandles is not available
    try {
      const [vbX, vbY, vbW, vbH] = shape.icon.viewBox.split(/\s+|,/).map(Number);
      handles = shape.anchors.map((pt, idx) => {
        // Map anchor from SVG coordinates to percent of node size
        const left = ((pt.x - vbX) / vbW) * 100;
        const top = ((pt.y - vbY) / vbH) * 100;
        
        // Determine position type based on anchor location
        let position = Position.Top;
        if (top > 80) position = Position.Bottom;
        else if (top < 20) position = Position.Top;
        else if (left > 80) position = Position.Right;
        else if (left < 20) position = Position.Left;
        
        return {
          id: `anchor-${idx}`,
          position: position,
          style: {
            position: 'absolute',
            left: `${left}%`,
            top: `${top}%`,
            transform: 'translate(-50%, -50%)',
          },
          anchorIndex: idx,
        };
      });
      console.log(`🔗 Generated ${handles.length} handles from anchors for shape ${shape.name}`);
    } catch (error) {
      console.warn('Error generating handles from anchors for shape:', shape.name, error);
      // Fallback to default handles
      handles = [
        { id: 'top', position: Position.Top, style: { top: '0%', left: '50%', transform: 'translate(-50%, 0%)' } },
        { id: 'bottom', position: Position.Bottom, style: { top: '100%', left: '50%', transform: 'translate(-50%, -100%)' } },
        { id: 'left', position: Position.Left, style: { top: '50%', left: '0%', transform: 'translate(0%, -50%)' } },
        { id: 'right', position: Position.Right, style: { top: '50%', left: '100%', transform: 'translate(-100%, -50%)' } },
      ];
    }
  } else {
    // Default: centered on bounding box
    handles = [
      { id: 'top', position: Position.Top, style: { top: '0%', left: '50%', transform: 'translate(-50%, 0%)' } },
      { id: 'bottom', position: Position.Bottom, style: { top: '100%', left: '50%', transform: 'translate(-50%, -100%)' } },
      { id: 'left', position: Position.Left, style: { top: '50%', left: '0%', transform: 'translate(0%, -50%)' } },
      { id: 'right', position: Position.Right, style: { top: '50%', left: '100%', transform: 'translate(-100%, -50%)' } },
    ];
    console.log(`🔗 Using default handles for shape ${shape?.name || 'unknown'}`);
  }

  // Debug logging
  console.log('ResizableNode render:', {
    id,
    shapeId: data?.shapeId,
    shape: shape?.name,
    isValidShape,
    hasIcon: !!(shape?.icon),
    hasPath: !!(shape?.icon?.path),
    hasViewBox: !!(shape?.icon?.viewBox),
    handles: handles.length,
    shouldShowConnectionHandles,
    isHovering,
    selected,
    isResizing,
    isDragging
  });



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
        margin: 0,
        padding: 0,
        cursor: isDragging ? 'grabbing' : 'grab', // Show appropriate cursor
        userSelect: 'none', // Prevent text selection during drag
        touchAction: 'none', // Prevent touch actions that might interfere
      }}
      onDoubleClick={handleDoubleClick}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* NodeResizer - only for drag/resize handles in corners */}
      <NodeResizer
        minWidth={Math.max(40, 60 / zoom)}
        minHeight={Math.max(30, 45 / zoom)}
        isVisible={showHandles}
        lineClassName="border-blue-400 border border-dashed"
        handleClassName="bg-blue-500 rounded-full shadow hover:bg-blue-600 focus:bg-blue-700 transition-all duration-150"
        keepAspectRatio={false}
        onResizeStart={handleResizeStart}
        onResize={handleResize}
        onResizeEnd={handleResizeEnd}
        handleStyle={{
          width: Math.max(8, Math.min(16, 12 / zoom)) + 'px',
          height: Math.max(8, Math.min(16, 12 / zoom)) + 'px',
          margin: `-${Math.max(3, 6 / zoom)}px`,
          zIndex: 20,
          pointerEvents: 'auto', // Ensure handles are interactive
        }}
        lineStyle={{
          border: '1.5px dashed #2563eb',
          borderRadius: 0,
          margin: 0,
          padding: 0,
          pointerEvents: 'none', // Don't interfere with drag
        }}
        style={{
          width: '100%',
          height: '100%',
          margin: 0,
          padding: 0,
          pointerEvents: 'none', // Don't interfere with drag
        }}
      />

      {/* SVG shape rendering (if valid) */}
      {isValidShape && (
        <svg
          viewBox={shape.icon.viewBox}
          width="100%"
          height="100%"
          style={{ ...svgStyle, background: 'transparent' }}
          preserveAspectRatio="xMidYMid meet"
        >
          <path
            d={shape.icon.path}
            fill={style.fill || data.fill || 'transparent'}
            stroke={style.stroke || data.color || '#3b82f6'}
            strokeWidth={style.strokeWidth || 2}
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
          placeholder="Enter label..."
          style={{
            ...labelStyle,
            background: 'white',
            border: '2px solid #2563eb',
            borderRadius: 6,
            padding: Math.max(4, 6 / zoom),
            width: '100%',
            height: Math.max(20, 24 / zoom) + 'px',
            maxWidth: '100%',
            maxHeight: '100%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            boxSizing: 'border-box',
            outline: 'none',
            fontSize: Math.max(10, Math.min(16, 14 / zoom)) + 'px',
            color: '#333',
            boxShadow: '0 2px 8px rgba(37, 99, 235, 0.2)',
          }}
        />
      ) : (
        <span
          style={{
            ...labelStyle,
            maxWidth: '100%',
            maxHeight: '100%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            wordBreak: 'break-word',
            cursor: 'pointer',
            pointerEvents: 'auto', // Allow label interaction
          }}
          onDoubleClick={handleDoubleClick}
          onClick={(e) => {
            e.stopPropagation();
            if (!isResizing && !isDragging && !isRotating) {
              setEditing(true);
            }
          }}
          onMouseDown={(e) => {
            // Allow drag to start from label area
            if (!isResizing && !isRotating) {
              // Let the drag event propagate to the container
            }
          }}
        >
          {label || <span style={{ color: '#bbb' }}>Click to add label</span>}
        </span>
      )}

      {/* Render dynamic handles */}
      {handles.map((h, i) => (
        <Handle
          key={h.id}
          id={h.id}
          type="source"
          position={h.position}
          isConnectable={true}
          style={{
            width: Math.max(8, Math.min(12, 10 / zoom)),
            height: Math.max(8, Math.min(12, 10 / zoom)),
            background: shouldShowConnectionHandles ? '#10b981' : 'transparent',
            border: shouldShowConnectionHandles ? '1.5px solid #ffffff' : 'none',
            borderRadius: '50%',
            zIndex: 10,
            boxShadow: shouldShowConnectionHandles ? '0 1px 4px rgba(16, 185, 129, 0.4)' : 'none',
            transition: 'all 0.15s ease',
            cursor: 'crosshair',
            position: 'absolute',
            opacity: shouldShowConnectionHandles ? 1 : 0,
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'auto', // Always allow pointer events for connections
            ...h.style,
            display: 'block', // Always display handles for connection functionality
          }}
          onMouseDown={(e) => {
            // Prevent drag when clicking on connection handles
            e.stopPropagation();
          }}
        />
      ))}
      {handles.map((h, i) => (
        <Handle
          key={`${h.id}-target`}
          id={`${h.id}-target`}
          type="target"
          position={h.position}
          isConnectable={true}
          style={{
            width: Math.max(8, Math.min(12, 10 / zoom)),
            height: Math.max(8, Math.min(12, 10 / zoom)),
            background: shouldShowConnectionHandles ? '#10b981' : 'transparent',
            border: shouldShowConnectionHandles ? '1.5px solid #ffffff' : 'none',
            borderRadius: '50%',
            zIndex: 10,
            boxShadow: shouldShowConnectionHandles ? '0 1px 4px rgba(16, 185, 129, 0.4)' : 'none',
            transition: 'all 0.15s ease',
            cursor: 'crosshair',
            position: 'absolute',
            opacity: shouldShowConnectionHandles ? 1 : 0,
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'auto', // Always allow pointer events for connections
            ...h.style,
            display: 'block', // Always display handles for connection functionality
          }}
          onMouseDown={(e) => {
            // Prevent drag when clicking on connection handles
            e.stopPropagation();
          }}
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
            pointerEvents: 'auto', // Changed from 'none' to 'auto' to fix flickering
            zIndex: 30,
            border: `${Math.max(1, 1.5 / zoom)}px solid #2563eb`,
            transition: 'all 0.15s ease-out', // Improved transition
            transform: 'scale(1)', // Ensure consistent transform
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