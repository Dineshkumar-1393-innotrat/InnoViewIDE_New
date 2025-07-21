// src/features/flow/flowSelectors.js
import { createSelector } from 'reselect';
import { shapeData } from '../../shapes/shapeData';

// Create a flat map of all shapes for easy lookup by ID
const allShapes = Object.values(shapeData)
  .flat()
  .reduce((acc, shape) => {
    acc[shape.id] = shape;
    return acc;
  }, {});

const selectFlowState = (state) => {
  // Direct flow state (without redux-undo)
  if (state.flow) {
    return state.flow;
  } else {
    return {};
  }
};

export const selectNodes = createSelector(
  [selectFlowState],
  (present) => {
    const nodes = present.nodes || [];
    // Rehydrate nodes with full shape data to ensure functions like getHandles are present
    return nodes.map(node => {
      const shapeId = node.data?.shape?.id;
      if (shapeId && allShapes[shapeId]) {
        return {
          ...node,
          data: {
            ...node.data,
            shape: allShapes[shapeId],
          },
        };
      }
      return node;
    });
  }
);

export const selectEdges = createSelector(
  [selectFlowState],
  (present) => {
    const edges = present.edges || [];
    return edges;
  }
);
