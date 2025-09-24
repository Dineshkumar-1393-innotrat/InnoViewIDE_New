import React, { useState, useRef, useMemo, useEffect } from 'react';
import { Handle, Position, NodeResizer, useNodeId, useReactFlow } from 'reactflow';
import { useDispatch, useSelector } from 'react-redux';
import { setNodes, rotateNode, deleteNode, updateNodeSize } from '../features/flow/flowSlice';
import { selectNodes } from '../features/flow/flowSelectors';


export default function ResizableNode(props) {
  const {
    id,
    data,
    selected,
    dragHandle,
    ...rest
  } = props;

  const { isHovering, isConnecting } = data;

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
  // New: editing state for per-slot labels
  const [editingSlotId, setEditingSlotId] = useState(null);
  const [slotDraftText, setSlotDraftText] = useState('');

  const isInteracting = isResizing || isDragging || isRotating;

  // Update selected state when props change
  useEffect(() => {
    setIsSelected(selected);
  }, [selected]);

  // Focus input when editing starts
  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      // Move cursor to the end of the text
      inputRef.current.select();
    }
  }, [editing]);

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
    // Only enable central label editing when shape has no slots
    const hasSlots = getTextSlots().length > 0;
    if (!hasSlots) {
      setEditing(true);
    }
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
    // Throttled update during resize for performance
    requestAnimationFrame(() => {
      dispatch(updateNodeSize({ id, width, height }));
    });
  };

  const handleResizeEnd = () => {
    // Final update on resize end
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
  // Show connection handles when hovered/selected or while actively connecting
  const showConnectionHandles = selected || isHovering || !!isConnecting;

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

  // --- Slot-based editable labels support ---
  // A shape can provide either:
  // - textSlots: [{ id, left, top, width, height }] in percentages (0-100)
  // - slotGrid: { rows, cols, margin? (percent), inset?: { top, right, bottom, left } }
  const getTextSlots = () => {
    const shape = data?.shape || {};
    if (!shape) return [];
    if (Array.isArray(shape.textSlots) && shape.textSlots.length > 0) {
      return shape.textSlots;
    }
    const grid = shape.slotGrid;
    if (grid && grid.rows > 0 && grid.cols > 0) {
      const margin = typeof grid.margin === 'number' ? grid.margin : 2;
      const inset = grid.inset || { top: 0, right: 0, bottom: 0, left: 0 };
      const slots = [];
      const usableWidth = 100 - (inset.left || 0) - (inset.right || 0);
      const usableHeight = 100 - (inset.top || 0) - (inset.bottom || 0);
      const cellW = usableWidth / grid.cols;
      const cellH = usableHeight / grid.rows;
      for (let r = 0; r < grid.rows; r++) {
        for (let c = 0; c < grid.cols; c++) {
          const left = (inset.left || 0) + c * cellW + margin;
          const top = (inset.top || 0) + r * cellH + margin;
          const width = Math.max(0, cellW - 2 * margin);
          const height = Math.max(0, cellH - 2 * margin);
          slots.push({ id: `r${r}c${c}`, left, top, width, height });
        }
      }
      return slots;
    }
    return [];
  };

  const slots = getTextSlots();

  const startEditSlot = (slotId) => {
    setEditing(false); // hide central editor if any
    setEditingSlotId(slotId);
    const current = (data?.slotTexts && data.slotTexts[slotId]) || '';
    setSlotDraftText(current);
    // Focus will be handled by autoFocus on input
  };

  const saveSlotText = () => {
    if (editingSlotId == null) return;
    const updatedNodes = allNodes.map((n) => {
      if (n.id !== id) return n;
      const prevTexts = n.data?.slotTexts || {};
      return {
        ...n,
        data: {
          ...n.data,
          slotTexts: { ...prevTexts, [editingSlotId]: slotDraftText },
        },
      };
    });
    dispatch(setNodes(updatedNodes));
    setEditingSlotId(null);
    setSlotDraftText('');
  };

  // Connection handle style - distinct from drag handles
  const connectionHandleStyle = {
    width: isConnecting ? Math.max(14, Math.min(20, 16 / zoom)) : Math.max(10, Math.min(14, 12 / zoom)),
    height: isConnecting ? Math.max(14, Math.min(20, 16 / zoom)) : Math.max(10, Math.min(14, 12 / zoom)),
    background: '#3b82f6', // Blue color for better visibility
    border: '1px solid rgba(255,255,255,0.6)',
    borderRadius: '50%',
    zIndex: isConnecting ? 15 : 2,
    boxShadow: '0 2px 6px rgba(59, 130, 246, 0.4)',
    transition: 'all 0.15s ease',
    cursor: 'crosshair',
    position: 'absolute',
    opacity: showConnectionHandles ? 1 : 0, // Full opacity when visible
    transform: 'translate(-50%, -50%)',
    pointerEvents: 'auto',
  };

  // Generate connection handles based on shape type and anchors
  const getConnectionHandles = () => {
    if (data?.shape?.getHandles) {
      return data.shape.getHandles();
    }
    // Default connection handles if none are provided by the shape
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

  // No inset: keep handles on border; avoids visual cuts in shape stroke

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
      
      // Calculate angle from center to mouse position
      let angle = Math.atan2(dy, dx) * (180 / Math.PI);
      
      // Add 90 degrees to make 0 degrees point upward
      angle += 90;
      
      // Snap to 15-degree increments when Shift is held
      if (moveEvent.shiftKey) {
        angle = Math.round(angle / 15) * 15;
      }
      
      // Normalize angle to 0-360 range
      angle = ((angle % 360) + 360) % 360;
      
      // Update the node rotation in Redux
      const updatedNodes = allNodes.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, rotation: angle } } : n
      );
      dispatch(setNodes(updatedNodes));
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
        lineClassName=""
        handleClassName="resize-handle"
        keepAspectRatio={false}
        onResizeStart={handleResizeStart}
        onResize={handleResize}
        onResizeEnd={handleResizeEnd}
        handleStyle={{
          width: Math.max(8, Math.min(16, 12 / zoom)) + 'px',
          height: Math.max(8, Math.min(16, 12 / zoom)) + 'px',
          background: '#3b82f6',
          border: '2px solid #ffffff',
          borderRadius: '50%',
          zIndex: 20,
        }}
        lineStyle={{
          display: 'none',
        }}
      />

      {/* SVG shape rendering (if valid) */}
      {isValidShape && (
        <svg
          viewBox={data.shape.icon.viewBox}
          preserveAspectRatio="none"
          style={svgStyle}
        >
          <path
            d={data.shape.icon.path}
            fill={selected ? 'rgba(59, 130, 246, 0.1)' : 'none'}
            stroke={style.stroke || data.color || '#41597a'}
            strokeWidth="2.5"
            vectorEffect="non-scaling-stroke"
            strokeLinecap="round"
            strokeLinejoin="round"
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
      {/* Central single label editor - only when shape has no slots */}
      {editing && slots.length === 0 ? (
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
          {slots.length === 0 ? label : ''}
        </span>
      )}

      {/* Slot-based labels */}
      {slots.length > 0 && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 3, pointerEvents: 'none' }}>
          {slots.map((s) => {
            const value = (data?.slotTexts && data.slotTexts[s.id]) || '';
            const isEditingThis = editingSlotId === s.id;
            const baseStyle = {
              position: 'absolute',
              left: `${s.left}%`,
              top: `${s.top}%`,
              width: `${s.width}%`,
              height: `${s.height}%`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: Math.max(8, Math.min(14, 12 / zoom)),
              color: style.color || data.textColor || '#222',
              textAlign: 'center',
              padding: 0,
              userSelect: 'none',
              pointerEvents: 'auto',
            };
            return (
              <div
                key={s.id}
                style={baseStyle}
                onDoubleClick={(e) => { e.stopPropagation(); startEditSlot(s.id); }}
                title="Double-click to edit"
              >
                {isEditingThis ? (
                  <input
                    className="nodrag"
                    autoFocus
                    value={slotDraftText}
                    onChange={(e) => setSlotDraftText(e.target.value)}
                    onBlur={saveSlotText}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveSlotText();
                      if (e.key === 'Escape') { setEditingSlotId(null); setSlotDraftText(''); }
                      if (e.key === 'Backspace' || e.key === 'Delete') e.stopPropagation();
                    }}
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      width: '100%',
                      height: Math.max(16, 20 / zoom) + 'px',
                      maxWidth: '100%',
                      background: 'white',
                      border: '1px solid #2563eb',
                      borderRadius: 4,
                      padding: Math.max(2, 4 / zoom),
                      fontSize: Math.max(8, Math.min(14, 12 / zoom)) + 'px',
                      outline: 'none',
                    }}
                  />
                ) : (
                  <span style={{ pointerEvents: 'none', width: '100%', padding: 0 }}>{value}</span>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Connection handles - only visible when interacting */}
      {connectionHandles.map((h) => (
        <React.Fragment key={h.id}>
          {(h.position === Position.Right || h.position === Position.Bottom) && (
            <Handle
              id={`${h.id}-source`}
              type="source"
              position={h.position}
              isConnectable={true}
              style={{
                ...connectionHandleStyle,
                ...h.style,
                display: showConnectionHandles ? 'block' : 'none',
                transform: `translate(-50%, -50%) rotate(${-rotation}deg)`,
              }}
              className="connection-handle nodrag"
            />
          )}
          {(h.position === Position.Left || h.position === Position.Top) && (
            <Handle
              id={`${h.id}-target`}
              type="target"
              position={h.position}
              isConnectable={true}
              style={{
                ...connectionHandleStyle,
                ...h.style,
                display: showConnectionHandles ? 'block' : 'none',
                transform: `translate(-50%, -50%) rotate(${-rotation}deg)`,
              }}
              className="connection-handle nodrag"
            />
          )}
        </React.Fragment>
      ))}

      {isResizing && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '12px',
          zIndex: 100,
        }}>
          {Math.round(currentWidth)} x {Math.round(currentHeight)}
        </div>
      )}

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