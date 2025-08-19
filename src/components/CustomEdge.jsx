import React, { useState, useEffect } from 'react';
import { EdgeLabelRenderer } from 'reactflow';
import { useDispatch, useSelector } from 'react-redux';
import { setEdges, setEditingEdgeId as setEditingEdgeIdAction } from '../features/flow/flowSlice';
import { selectEdges } from '../features/flow/flowSelectors';
import { selectNodes } from '../features/flow/flowSelectors';
import { selectEditingEdgeId } from '../features/flow/flowSelectors';

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

// Get the best connection point based on shape and direction
function getBestConnectionPoint(node, sourcePoint, targetPoint, isSource) {
  if (!node || !node.data?.shape) return null;
  
  const { x: nodeX, y: nodeY } = node.position || { x: 0, y: 0 };
  const width = node.width || node.style?.width || 100;
  const height = node.height || node.style?.height || 60;
  const rotation = node.data?.rotation || 0;
  
  // Get shape anchors if available
  if (node.data.shape.anchors && Array.isArray(node.data.shape.anchors)) {
    const anchors = node.data.shape.anchors.map(pt => ({
      x: nodeX + (pt.x / 100) * width,
      y: nodeY + (pt.y / 100) * height
    }));
    
    // Find the anchor closest to the direction we're connecting from/to
    const otherPoint = isSource ? targetPoint : sourcePoint;
    const nodeCenter = { x: nodeX + width / 2, y: nodeY + height / 2 };
    
    // Calculate the direction from node center to the other point
    const direction = {
      x: otherPoint.x - nodeCenter.x,
      y: otherPoint.y - nodeCenter.y
    };
    
    // Normalize the direction vector
    const directionLength = Math.hypot(direction.x, direction.y);
    if (directionLength === 0) return anchors[0]; // Fallback to first anchor
    
    const normalizedDirection = {
      x: direction.x / directionLength,
      y: direction.y / directionLength
    };
    
    let bestAnchor = anchors[0];
    let bestScore = -Infinity;
    
    anchors.forEach(anchor => {
      // Calculate vector from node center to anchor
      const anchorVector = {
        x: anchor.x - nodeCenter.x,
        y: anchor.y - nodeCenter.y
      };
      
      // Normalize anchor vector
      const anchorLength = Math.hypot(anchorVector.x, anchorVector.y);
      if (anchorLength === 0) return;
      
      const normalizedAnchor = {
        x: anchorVector.x / anchorLength,
        y: anchorVector.y / anchorLength
      };
      
      // Calculate dot product to find alignment with direction
      const dotProduct = normalizedDirection.x * normalizedAnchor.x + normalizedDirection.y * normalizedAnchor.y;
      
      // Also consider distance to the other point
      const distanceToOther = Math.hypot(anchor.x - otherPoint.x, anchor.y - otherPoint.y);
      const distanceScore = 1 / (1 + distanceToOther / 100); // Closer is better
      
      // Combined score: alignment + distance (give more weight to alignment)
      const score = dotProduct * 0.85 + distanceScore * 0.15;
      
      if (score > bestScore) {
        bestScore = score;
        bestAnchor = anchor;
      }
    });
    
    return bestAnchor;
  }
  
  // Fallback to default connection points based on shape type
  const centerX = nodeX + width / 2;
  const centerY = nodeY + height / 2;
  
  // Determine which side to connect to based on relative position
  const otherPoint = isSource ? targetPoint : sourcePoint;
  const dx = otherPoint.x - centerX;
  const dy = otherPoint.y - centerY;
  
  // Use a more generous threshold for determining connection side
  const threshold = 0.15; // 15% threshold for more precise selection
  
  if (Math.abs(dx) > Math.abs(dy) * (1 + threshold)) {
    // Connect to left or right side
    return {
      x: dx > 0 ? nodeX + width : nodeX,
      y: centerY
    };
  } else if (Math.abs(dy) > Math.abs(dx) * (1 + threshold)) {
    // Connect to top or bottom side
    return {
      x: centerX,
      y: dy > 0 ? nodeY + height : nodeY
    };
  } else {
    // For diagonal connections, prefer the side that's more aligned
    if (Math.abs(dx) > Math.abs(dy)) {
      return {
        x: dx > 0 ? nodeX + width : nodeX,
        y: centerY
      };
    } else {
      return {
        x: centerX,
        y: dy > 0 ? nodeY + height : nodeY
      };
    }
  }
}

export default function CustomEdge({ id, source, target, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, style, data, selected, markerEnd }) {
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

  // Get optimal connection points
  const sourcePoint = getBestConnectionPoint(sourceNode, { x: sourceX, y: sourceY }, { x: targetX, y: targetY }, true) || { x: sourceX, y: sourceY };
  const targetPoint = getBestConnectionPoint(targetNode, { x: sourceX, y: sourceY }, { x: targetX, y: targetY }, false) || { x: targetX, y: targetY };

  // Validate coordinates
  if (isNaN(sourcePoint.x) || isNaN(sourcePoint.y) || isNaN(targetPoint.x) || isNaN(targetPoint.y)) {
    console.warn('CustomEdge: Invalid coordinates', { sourcePoint, targetPoint, sourceNode, targetNode });
    return null;
  }

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
  const edgePath = `M${p1.x},${p1.y} L${p2.x},${p2.y}`;
  // For label, use the midpoint of the offset line
  const labelX = (p1.x + p2.x) / 2;
  const labelY = (p1.y + p2.y) / 2;

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
        style={{ ...edgeStyle, strokeLinecap: 'round', strokeWidth: 1.5 }}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={`url(#${markerId})`}
        onContextMenu={handleEdgeContextMenu}
      />
      
      {/* Visual connection point indicators - only show when selected or during connection */}
      {selected && (
        <>
          <path
            d={`M${sourcePoint.x - 1.5},${sourcePoint.y} A1.5,1.5 0 1,1 ${sourcePoint.x + 1.5},${sourcePoint.y} A1.5,1.5 0 1,1 ${sourcePoint.x - 1.5},${sourcePoint.y}`}
            fill={markerColor}
            stroke="none"
            style={{ filter: 'none', opacity: 0.4 }}
          />
          <path
            d={`M${targetPoint.x - 1.5},${targetPoint.y} A1.5,1.5 0 1,1 ${targetPoint.x + 1.5},${targetPoint.y} A1.5,1.5 0 1,1 ${targetPoint.x - 1.5},${targetPoint.y}`}
            fill={markerColor}
            stroke="none"
            style={{ filter: 'none', opacity: 0.4 }}
          />
        </>
      )}

      {(labelText || selected) && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`, // center on the line
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
                  padding: '6px 14px',
                  borderRadius: 16,
                  background: labelText ? '#fff' : 'rgba(255,255,255,0.8)',
                  border: labelText ? '2px solid #1970fc' : '1px dashed #9ca3af',
                  boxShadow: labelText ? '0 2px 8px #0002' : 'none',
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
                title="Right-click to edit"
                onContextMenu={handleEdgeContextMenu}
              >
                {labelText || (
                  <span style={{ color: '#9ca3af', fontWeight: 500 }}>Right-click to add label</span>
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