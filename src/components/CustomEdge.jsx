import React from 'react';
import { EdgeText } from 'reactflow';
import { useDispatch, useSelector } from 'react-redux';
import { setEdges } from '../features/flow/flowSlice';
import { selectEdges } from '../features/flow/flowSelectors';
import { selectNodes } from '../features/flow/flowSelectors';

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

export default function CustomEdge({ id, source, target, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, style, data, selected, markerEnd }) {
  const dispatch = useDispatch();
  const allEdges = useSelector(selectEdges);
  const allNodes = useSelector(selectNodes);

  // Find source and target node data
  const sourceNode = allNodes.find(n => n.id === source);
  const targetNode = allNodes.find(n => n.id === target);

  // Helper to get anchors in absolute coordinates
  function getAnchors(node) {
    if (!node || !node.data?.shape?.anchors) return null;
    const { x: nodeX, y: nodeY } = node.position;
    const width = node.style?.width || 100;
    const height = node.style?.height || 60;
    return node.data.shape.anchors.map(pt => ({
      x: nodeX + (pt.x / 100) * width,
      y: nodeY + (pt.y / 100) * height
    }));
  }

  let src = { x: sourceX, y: sourceY };
  let tgt = { x: targetX, y: targetY };

  // Use handle id to snap to anchor if available
  if (sourceNode && sourceNode.data?.shape?.anchors && data?.sourceHandle) {
    const anchors = getAnchors(sourceNode);
    const idx = parseInt((data.sourceHandle || '').replace('anchor-', ''), 10);
    if (!isNaN(idx) && anchors[idx]) src = anchors[idx];
  }
  if (targetNode && targetNode.data?.shape?.anchors && data?.targetHandle) {
    const anchors = getAnchors(targetNode);
    const idx = parseInt((data.targetHandle || '').replace('anchor-', ''), 10);
    if (!isNaN(idx) && anchors[idx]) tgt = anchors[idx];
  }

  // If not using handle, fall back to intersection logic
  const sourceAnchors = getAnchors(sourceNode);
  const targetAnchors = getAnchors(targetNode);
  if (sourceAnchors && !(data?.sourceHandle)) {
    const intersection = getLinePolygonIntersection(sourceAnchors, tgt, src);
    if (intersection) src = offsetPoint(sourceNode.position, intersection, 4);
  }
  if (targetAnchors && !(data?.targetHandle)) {
    const intersection = getLinePolygonIntersection(targetAnchors, src, tgt);
    if (intersection) tgt = offsetPoint(targetNode.position, intersection, 4);
  }

  // Use a straight line for the edge path
  const edgePath = `M${src.x},${src.y} L${tgt.x},${tgt.y}`;
  // For label, use the midpoint
  const labelX = (src.x + tgt.x) / 2;
  const labelY = (src.y + tgt.y) / 2;

  const handleDelete = (e) => {
    e.stopPropagation();
    const updatedEdges = allEdges.filter(edge => edge.id !== id);
    dispatch(setEdges(updatedEdges));
  };

  const edgeStyle = { stroke: '#1970fc', strokeWidth: selected ? 3 : 2, ...style };

  // Arrowhead marker definition
  const markerColor = edgeStyle.stroke || data?.color || '#1970fc';
  const markerId = `arrowhead-${id}`;

  return (
    <>
      <defs>
        <marker
          id={markerId}
          markerWidth="8"
          markerHeight="8"
          refX="8"
          refY="4"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <polygon points="0,0 8,4 0,8" fill="none" stroke={markerColor} strokeWidth="1.5" />
        </marker>
      </defs>
      <path
        id={id}
        style={{ ...edgeStyle, filter: 'none', strokeLinecap: 'round', strokeWidth: 1.5 }}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={`url(#${markerId})`}
      />
      {selected && (
        <EdgeText
          x={labelX}
          y={labelY}
          label={
            <div style={{ pointerEvents: 'all', display: 'flex', flexDirection: 'row', color: edgeStyle.stroke }}>
              <div style={{ display: 'flex', gap: 4 }}>
                <button style={{ width: 32, height: 24, fontSize: 12, background: '#fff', border: '1px solid #ef4444', borderRadius: 4, color: '#ef4444', cursor: 'pointer' }} onClick={handleDelete}>
                  Del
                </button>
              </div>
            </div>
          }
        />
      )}
    </>
  );
}