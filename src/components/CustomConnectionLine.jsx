import React from 'react';
import { useSelector } from 'react-redux';
import { getSmoothStepPath } from 'reactflow';

const CustomConnectionLine = ({ 
  fromX, 
  fromY, 
  fromPosition, 
  toX, 
  toY, 
  toPosition, 
  connectionLineStyle 
}) => {
  const connectorType = useSelector((state) => state.flow.present.connectorType);

  const [edgePath] = getSmoothStepPath({
    sourceX: fromX,
    sourceY: fromY,
    sourcePosition: fromPosition,
    targetX: toX,
    targetY: toY,
    targetPosition: toPosition,
  });

  const markerEndId = 'connection-arrow-end';
  const markerStartId = 'connection-arrow-start';

  return (
    <g>
      <defs>
        <marker
          id={markerEndId}
          markerWidth="6"
          markerHeight="6"
          refX="5"
          refY="3"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <polygon points="0,0 6,3 0,6" fill="#3b82f6" stroke="none" />
        </marker>
        {connectorType === 'double' && (
          <marker
            id={markerStartId}
            markerWidth="6"
            markerHeight="6"
            refX="1"
            refY="3"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <polygon points="6,0 0,3 6,6" fill="#3b82f6" stroke="none" />
          </marker>
        )}
      </defs>
      <path
        fill="none"
        stroke="#3b82f6"
        strokeWidth={2}
        d={edgePath}
        style={connectionLineStyle}
        markerEnd={`url(#${markerEndId})`}
        markerStart={connectorType === 'double' ? `url(#${markerStartId})` : undefined}
      />
    </g>
  );
};

export default CustomConnectionLine;
