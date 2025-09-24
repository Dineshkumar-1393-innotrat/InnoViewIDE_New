import React, { useState, useEffect } from 'react';
import { EdgeLabelRenderer, getBezierPath } from 'reactflow';
import { useDispatch, useSelector } from 'react-redux';
import { setEdges, setEditingEdgeId as setEditingEdgeIdAction } from '../features/flow/flowSlice';
import { selectEdges, selectNodes, selectEditingEdgeId } from '../features/flow/flowSelectors';

export default function CustomEdge({ id, source, target, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, style, data, selected, markerEnd, markerStart }) {
  const [labelText, setLabelText] = useState(data?.label || '');
  const [labelColor, setLabelColor] = useState(data?.labelColor || '#000000');
  const [isEditing, setIsEditing] = useState(false);
  const [editingEdgeId, setEditingEdgeId] = useState(null);

  const dispatch = useDispatch();
  const allEdges = useSelector(selectEdges);
  const allNodes = useSelector(selectNodes);
  const globalEditingEdgeId = useSelector(selectEditingEdgeId);

  useEffect(() => {
    setIsEditing(globalEditingEdgeId === id);
  }, [globalEditingEdgeId, id]);

  useEffect(() => {
    setLabelText(data?.label || '');
    setLabelColor(data?.labelColor || '#000000');
  }, [data?.label, data?.labelColor]);

  // Validate edge data
  if (!source || !target) {
    console.warn('CustomEdge: Missing source or target', { id, source, target });
    return null;
  }
  
  // Find source and target node data
  const sourceNode = allNodes.find(n => n.id === source);
  const targetNode = allNodes.find(n => n.id === target);

  // Validate nodes exist - return null if either node is missing
  if (!sourceNode || !targetNode) {
    console.warn('CustomEdge: Source or target node not found', { source, target, sourceNode, targetNode });
    return null;
  }

  const sourcePoint = { x: sourceX, y: sourceY };
  const targetPoint = { x: targetX, y: targetY };

  // Mirror-parallelize multiple edges between same pair (both directions)
  const pairEdges = allEdges.filter(
    (e) => (e.source === source && e.target === target) || (e.source === target && e.target === source)
  );
  const forward = pairEdges.filter((e) => e.source === source && e.target === target);
  const reverse = pairEdges.filter((e) => e.source === target && e.target === source);

  let p1 = { ...sourcePoint };
  let p2 = { ...targetPoint };

  if (pairEdges.length > 1) {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const len = Math.hypot(dx, dy) || 1;
    const nx = -dy / len; // unit perpendicular
    const ny = dx / len;
    const spacing = 12; // px

    let k = 0; // signed index: +1,+2,... for forward; -1,-2,... for reverse
    const fIdx = forward.findIndex((e) => e.id === id);
    if (fIdx !== -1) {
      k = fIdx + 1;
    } else {
      const rIdx = reverse.findIndex((e) => e.id === id);
      if (rIdx !== -1) k = -(rIdx + 1);
    }

    const offset = k * spacing;
    p1 = { x: p1.x + nx * offset, y: p1.y + ny * offset };
    p2 = { x: p2.x + nx * offset, y: p2.y + ny * offset };
  }

  // Use a straight (possibly offset) line for the edge path
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX: p1.x,
    sourceY: p1.y,
    sourcePosition,
    targetX: p2.x,
    targetY: p2.y,
    targetPosition,
    curvature: 0.2, // Add some curvature for a smoother look
  });

  const handleLabelChange = (e) => {
    setLabelText(e.target.value);
  };

  const handleLabelSave = () => {
    const updatedEdges = allEdges.map(edge => {
      if (edge.id === id) {
        return { ...edge, data: { ...edge.data, label: labelText, labelColor: labelColor } };
      }
      return edge;
    });
    dispatch(setEdges(updatedEdges));
    setIsEditing(false);
    setEditingEdgeId(null);
    dispatch(setEditingEdgeIdAction(null));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      // Allow Ctrl/Cmd+Enter to save
      e.preventDefault();
      handleLabelSave();
    } else if (e.key === 'Enter') {
      handleLabelSave();
    } else if (e.key === 'Escape') {
      setLabelText(data?.label || '');
      setIsEditing(false);
      setEditingEdgeId(null);
    } else if (e.key === 'Delete' || e.key === 'Backspace') {
      // Prevent deletion of the edge when editing text
      e.stopPropagation();
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    e.preventDefault();
    console.log('Deleting edge:', id);
    const updatedEdges = allEdges.filter(edge => edge.id !== id);
    dispatch(setEdges(updatedEdges));
  };

  const handleLabelClick = (e) => {
    e.stopPropagation();
    if (!isEditing) {
      setIsEditing(true);
      setEditingEdgeId(id);
      dispatch(setEditingEdgeIdAction(id));
    }
  };

  const handleInputClick = (e) => {
    e.stopPropagation();
  };

  // Right-click to edit label (context menu)
  const handleEdgeContextMenu = (e) => {
    e.preventDefault();
    e.stopPropagation(); // prevent Diagram-level onEdgeContextMenu (color palette)
    if (!isEditing) {
      setIsEditing(true);
      setEditingEdgeId(id);
      dispatch(setEditingEdgeIdAction(id));
    }
  };

  const edgeStyle = { 
    stroke: '#1970fc', 
    strokeWidth: selected ? 2.5 : 1.5, 
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    filter: 'none',
    fill: 'none',
    ...style 
  };

  // Arrowhead marker definition
  return (
    <>
      <path
        id={id}
        style={edgeStyle}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
        markerStart={markerStart}
        onContextMenu={handleEdgeContextMenu}
      />
      
      {(labelText || selected) && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              zIndex: 10,
              pointerEvents: 'all',
              minWidth: 40,
              maxWidth: 220,
              textAlign: 'center',
              background: 'none',
            }}
            className="nodrag nopan"
            onContextMenu={handleEdgeContextMenu}
          >
            {isEditing ? (
              <input
                type="text"
                value={labelText}
                onChange={handleLabelChange}
                onBlur={handleLabelSave}
                onKeyDown={handleKeyDown}
                onClick={handleInputClick}
                autoFocus
                style={{
                  padding: '7px 18px',
                  borderRadius: 18,
                  border: '2px solid #1970fc',
                  background: '#fff',
                  fontSize: 15,
                  outline: 'none',
                  minWidth: 60,
                  maxWidth: 200,
                  fontWeight: 500,
                }}
                placeholder="Type label…"
              />
            ) : (
              <div
                className="edge-label-display"
                onClick={handleLabelClick}
                onDoubleClick={handleLabelClick}
                style={{
                  display: 'inline-block',
                  padding: '6px 14px',
                  borderRadius: 16,
                  background: labelText ? '#fff' : 'rgba(255,255,255,0.8)',
                  border: labelText ? '2px solid #1970fc' : '1px dashed #9ca3af',
                  boxShadow: 'none',
                  fontSize: 14,
                  color: labelColor,
                  cursor: 'text',
                  minWidth: 40,
                  maxWidth: 200,
                  whiteSpace: 'pre-line',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  userSelect: 'none',
                  fontWeight: 500,
                  transition: 'border 0.15s, box-shadow 0.15s, background 0.15s',
                  position: 'relative',
                }}
                title="Double-click to edit"
                onContextMenu={handleEdgeContextMenu}
              >
                {labelText || (
                  <span style={{ color: '#9ca3af', fontWeight: 500 }}>Double-click to add label</span>
                )}
                {selected && (
                  <button
                    onClick={handleDelete}
                    className="delete-button"
                    title="Delete edge"
                  >
                    ×
                  </button>
                )}
              </div>
            )}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}