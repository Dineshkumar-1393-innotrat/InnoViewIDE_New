import React, { useState, useEffect } from 'react';
import { EdgeLabelRenderer } from 'reactflow';
import { useDispatch, useSelector } from 'react-redux';
import { setEdges, setEditingEdgeId } from '../features/flow/flowSlice';
import { selectEdges, selectNodes, selectEditingEdgeId } from '../features/flow/flowSelectors';
import { shapes } from '../shapes/shapeData';

// Utility: intersection between two lines (p1-p2 and p3-p4)
function getLineIntersection(p1, p2, p3, p4) {
  const s1_x = p2.x - p1.x;
  const s1_y = p2.y - p1.y;
  const s2_x = p4.x - p3.x;
  const s2_y = p4.y - p3.y;
  const s = (-s1_y * (p1.x - p3.x) + s1_x * (p1.y - p3.y)) / (-s2_x * s1_y + s1_x * s2_y);
  const t = ( s2_x * (p1.y - p3.y) - s2_y * (p1.x - p3.x)) / (-s2_x * s1_y + s1_x * s2_y);
  if (s >= 0 && s <= 1 && t >= 0 && t <= 1) {
    return {
      x: p1.x + (t * s1_x),
      y: p1.y + (t * s1_y)
    };
  }
  return null;
}

// Given: polygonPoints = [{x, y}, ...], lineStart = {x, y}, lineEnd = {x, y}
function getLinePolygonIntersection(polygonPoints, lineStart, lineEnd) {
  let closest = null;
  let minDist = Infinity;
  for (let i = 0; i < polygonPoints.length; i++) {
    const a = polygonPoints[i];
    const b = polygonPoints[(i + 1) % polygonPoints.length];
    const intersection = getLineIntersection(lineStart, lineEnd, a, b);
    if (intersection) {
      // Find the closest intersection to the lineStart
      const dist = Math.hypot(intersection.x - lineStart.x, intersection.y - lineStart.y);
      if (dist < minDist) {
        minDist = dist;
        closest = intersection;
      }
    }
  }
  return closest;
}

// Offset a point along the direction from 'from' to 'to' by 'distance' pixels
function offsetPoint(from, to, distance) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.hypot(dx, dy);
  if (len === 0) return { ...to };
  return {
    x: to.x + (dx / len) * distance,
    y: to.y + (dy / len) * distance,
  };
}



// Helper to get anchors in absolute coordinates
function getAnchors(node) {
  if (!node || !node.data?.shapeId) return null;
  const shape = shapes.find(s => s.id === node.data.shapeId);
  if (!shape || !shape.anchors) return null;
  
  const { x: nodeX, y: nodeY } = node.position || { x: 0, y: 0 };
  const width = node.style?.width || 100;
  const height = node.style?.height || 60;
  
  // Get the viewBox dimensions to properly scale anchors
  const viewBox = shape.icon?.viewBox;
  if (!viewBox) return null;
  
  const [, , vbWidth, vbHeight] = viewBox.split(/\s+|,/).map(Number);
  
  return shape.anchors.map(pt => ({
    x: nodeX + (pt.x / vbWidth) * width,
    y: nodeY + (pt.y / vbHeight) * height
  }));
}

export default function CustomEdge({ id, source, target, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, style, data, selected, markerEnd }) {
  const [labelText, setLabelText] = useState(data?.label || '');
  const [labelColor, setLabelColor] = useState(data?.labelColor || '#000000');

  useEffect(() => {
    setLabelText(data?.label || '');
    setLabelColor(data?.labelColor || '#000000');
  }, [data?.label, data?.labelColor]);

  // Validate edge data
  if (!source || !target) {
    console.warn('CustomEdge: Missing source or target', { id, source, target });
    return null;
  }
  
  const dispatch = useDispatch();
  const allEdges = useSelector(selectEdges);
  const allNodes = useSelector(selectNodes);
  const editingEdgeId = useSelector(selectEditingEdgeId);
  
  // Check if this edge is being edited
  const isEditing = editingEdgeId === id;

  // Find source and target node data
  const sourceNode = allNodes.find(n => n.id === source);
  const targetNode = allNodes.find(n => n.id === target);

  // Validate nodes exist - return null if either node is missing
  if (!sourceNode || !targetNode) {
    console.warn('CustomEdge: Source or target node not found', { source, target, sourceNode, targetNode });
    return null;
  }

  let src = { x: sourceX, y: sourceY };
  let tgt = { x: targetX, y: targetY };

  // Use handle id to snap to anchor if available
  if (sourceNode && sourceNode.data?.shapeId && data?.sourceHandle) {
    const anchors = getAnchors(sourceNode);
    const idx = parseInt((data.sourceHandle || '').replace('anchor-', ''), 10);
    if (!isNaN(idx) && anchors && anchors[idx]) {
      src = anchors[idx];
      console.log('🔗 Using source anchor:', { sourceHandle: data.sourceHandle, anchorIndex: idx, anchor: anchors[idx] });
    } else {
      console.warn('⚠️ Source anchor not found:', { sourceHandle: data.sourceHandle, anchors: anchors?.length, sourceNode: sourceNode.id });
    }
  }
  if (targetNode && targetNode.data?.shapeId && data?.targetHandle) {
    const anchors = getAnchors(targetNode);
    const idx = parseInt((data.targetHandle || '').replace('anchor-', ''), 10);
    if (!isNaN(idx) && anchors && anchors[idx]) {
      tgt = anchors[idx];
      console.log('🔗 Using target anchor:', { targetHandle: data.targetHandle, anchorIndex: idx, anchor: anchors[idx] });
    } else {
      console.warn('⚠️ Target anchor not found:', { targetHandle: data.targetHandle, anchors: anchors?.length, targetNode: targetNode.id });
    }
  }

  // If not using handle, fall back to intersection logic
  const sourceAnchors = getAnchors(sourceNode);
  const targetAnchors = getAnchors(targetNode);
  if (sourceAnchors && !(data?.sourceHandle)) {
    const intersection = getLinePolygonIntersection(sourceAnchors, tgt, src);
    if (intersection) src = offsetPoint(sourceNode.position || { x: 0, y: 0 }, intersection, 4);
  }
  if (targetAnchors && !(data?.targetHandle)) {
    const intersection = getLinePolygonIntersection(targetAnchors, src, tgt);
    if (intersection) tgt = offsetPoint(targetNode.position || { x: 0, y: 0 }, intersection, 4);
  }

  const sourcePoint = src;
  const targetPoint = tgt;

  // Debug connection points (commented out to reduce console noise)
  // console.log('Connection points:', {
  //   source: sourceNode?.id,
  //   target: targetNode?.id,
  //   sourcePoint,
  //   targetPoint,
  //   sourceX,
  //   sourceY,
  //   targetX,
  //   targetY
  // });

  // Validate coordinates
  if (isNaN(sourcePoint.x) || isNaN(sourcePoint.y) || isNaN(targetPoint.x) || isNaN(targetPoint.y)) {
    console.warn('CustomEdge: Invalid coordinates', { sourcePoint, targetPoint, sourceNode, targetNode });
    return null;
  }

  // Use a straight line for the edge path
  const edgePath = `M${sourcePoint.x},${sourcePoint.y} L${targetPoint.x},${targetPoint.y}`;
  // For label, use the midpoint
  const labelX = (sourcePoint.x + targetPoint.x) / 2;
  const labelY = (sourcePoint.y + targetPoint.y) / 2;

  // Add visual feedback for connection points
  const connectionPointRadius = 1.5; // Even smaller radius for more subtle indicators
  const sourcePointPath = `M${sourcePoint.x - connectionPointRadius},${sourcePoint.y} A${connectionPointRadius},${connectionPointRadius} 0 1,1 ${sourcePoint.x + connectionPointRadius},${sourcePoint.y} A${connectionPointRadius},${connectionPointRadius} 0 1,1 ${sourcePoint.x - connectionPointRadius},${sourcePoint.y}`;
  const targetPointPath = `M${targetPoint.x - connectionPointRadius},${targetPoint.y} A${connectionPointRadius},${connectionPointRadius} 0 1,1 ${targetPoint.x + connectionPointRadius},${targetPoint.y} A${connectionPointRadius},${connectionPointRadius} 0 1,1 ${targetPoint.x - connectionPointRadius},${targetPoint.y}`;

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
    dispatch(setEditingEdgeId(null));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleLabelSave();
    } else if (e.key === 'Escape') {
      setLabelText(data?.label || '');
      dispatch(setEditingEdgeId(null));
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
      dispatch(setEditingEdgeId(id));
    }
  };

  const handleInputClick = (e) => {
    e.stopPropagation();
  };

  const edgeStyle = { 
    stroke: '#1970fc', 
    strokeWidth: selected ? 3 : 2, 
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    filter: 'none',
    ...style 
  };

  // Arrowhead marker definition
  const markerColor = edgeStyle.stroke || data?.color || '#1970fc';
  const markerId = `arrowhead-${id}`;

  return (
    <>
      <defs>
        <marker
          id={markerId}
          markerWidth="6"
          markerHeight="6"
          refX="5"
          refY="3"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <polygon points="0,0 6,3 0,6" fill={markerColor} stroke="none" />
        </marker>
      </defs>
      <path
        id={id}
        style={{ ...edgeStyle, strokeLinecap: 'round' }}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={`url(#${markerId})`}
      />
      
      {/* Visual connection point indicators - only show when selected */}
      {selected && (
        <>
          <circle
            cx={sourcePoint.x}
            cy={sourcePoint.y}
            r="2"
            fill={markerColor}
            opacity="0.6"
          />
          <circle
            cx={targetPoint.x}
            cy={targetPoint.y}
            r="2"
            fill={markerColor}
            opacity="0.6"
          />
        </>
      )}

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
                  boxShadow: '0 2px 8px #0002',
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
                onClick={handleLabelClick}
                style={{
                  display: 'inline-block',
                  padding: '7px 18px',
                  borderRadius: 18,
                  background: '#fff',
                  border: '2px solid #1970fc',
                  boxShadow: '0 2px 8px #0002',
                  fontSize: 15,
                  color: labelColor,
                  cursor: 'pointer',
                  minWidth: 40,
                  maxWidth: 200,
                  whiteSpace: 'pre-line',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  userSelect: 'none',
                  fontWeight: 500,
                  transition: 'border 0.2s, box-shadow 0.2s',
                  position: 'relative',
                }}
                title="Click to edit"
              >
                {labelText || <span style={{ color: '#bbb' }}>Click to add label</span>}
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