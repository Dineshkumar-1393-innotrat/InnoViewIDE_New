import { configureStore } from '@reduxjs/toolkit';
import undoable from 'redux-undo';
import flowReducer from './features/flow/flowSlice';
import debugReducer from './features/debug/debugSlice';

// Create undoable reducer with proper configuration
const undoableFlowReducer = undoable(flowReducer, {
  limit: 50, // Limit history to 50 states
  filter: (action) => {
    // Only track actions that should be undoable
    const undoableActions = [
      'flow/setNodes',
      'flow/setEdges', 
      'flow/addNode',
      'flow/addEdge',
      'flow/updateNode',
      'flow/updateNodeColor',
      'flow/updateEdgeColor',
      'flow/updateEdgeLabel',
      'flow/updateEdgeArrowHead',
      'flow/updateNodeTextColor',
      'flow/updateNodeLabel',
      'flow/rotateNode',
      'flow/deleteNode',
      'flow/deleteEdge',
      'flow/updateNodePosition',
      'flow/updateNodeSize',
    ];
    return undoableActions.includes(action.type);
  },
  groupBy: (action) => {
    // Group related actions together for better undo/redo experience
    if (action.type.startsWith('flow/setNodes') || action.type.startsWith('flow/setEdges')) {
      return 'flow-update';
    }
    if (action.type.startsWith('flow/updateNode')) {
      return 'node-update';
    }
    if (action.type.startsWith('flow/updateEdge')) {
      return 'edge-update';
    }
    return null;
  }
});

export const store = configureStore({
  reducer: {
    flow: undoableFlowReducer,
    debug: debugReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for serialization checks
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
}); 

export default store;