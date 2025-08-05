import { configureStore } from '@reduxjs/toolkit';
import undoable from 'redux-undo';
import flowReducer from './features/flow/flowSlice';

// Custom persistence middleware
const persistenceMiddleware = (store) => (next) => (action) => {
  const result = next(action);
  
  // Handle clear persisted state action
  if (action.type === 'flow/clearPersistedState') {
    try {
      localStorage.removeItem('innoide-flow-state');
      console.log('🗑️ Cleared persisted state from localStorage');
    } catch (error) {
      console.warn('Failed to clear state from localStorage:', error);
    }
    return result;
  }
  
  // Save state to localStorage after each action
  const stateToSave = {
    flow: {
      past: store.getState().flow.past,
      present: store.getState().flow.present,
      future: store.getState().flow.future
    }
  };
  
  try {
    localStorage.setItem('innoide-flow-state', JSON.stringify(stateToSave));
    console.log('💾 Saved state to localStorage');
  } catch (error) {
    console.warn('Failed to save state to localStorage:', error);
  }
  
  return result;
};

// Load state from localStorage with proper shape data restoration
const loadPersistedState = () => {
  try {
    const savedState = localStorage.getItem('innoide-flow-state');
    if (savedState) {
      const parsedState = JSON.parse(savedState);
      console.log('📥 Loaded persisted state:', parsedState);
      
      // Sanitize and restore the loaded state with proper shape data
      const sanitizedState = {
        flow: {
          past: parsedState.flow?.past || [],
          present: {
            nodes: (parsedState.flow?.present?.nodes || []).map(node => ({
              ...node,
              data: {
                ...node.data,
                // Ensure shapeId is properly set
                shapeId: node.data?.shapeId || 'flow-rectangle',
                // Ensure proper dimensions
                shapeWidth: node.data?.shapeWidth || 120,
                shapeHeight: node.data?.shapeHeight || 80,
                // Ensure label exists
                label: node.data?.label || 'Node'
              },
              // Ensure proper styling
              style: {
                width: node.style?.width || 120,
                height: node.style?.height || 80,
                background: node.style?.background || 'transparent',
                stroke: node.style?.stroke || '#3b82f6',
                strokeWidth: node.style?.strokeWidth || 2,
                ...node.style
              }
            })),
            edges: (parsedState.flow?.present?.edges || []).map(edge => ({
              ...edge,
              // Ensure edge data is properly structured
              data: {
                ...edge.data,
                label: edge.data?.label || '',
                labelColor: edge.data?.labelColor || '#000000',
                sourceHandle: edge.data?.sourceHandle || null,
                targetHandle: edge.data?.targetHandle || null,
                connectionType: edge.data?.connectionType || 'shape-to-shape'
              },
              // Ensure proper styling
              style: {
                stroke: edge.style?.stroke || '#1970fc',
                strokeWidth: edge.style?.strokeWidth || 2,
                strokeLinecap: edge.style?.strokeLinecap || 'round',
                strokeLinejoin: edge.style?.strokeLinejoin || 'round',
                ...edge.style
              }
            })),
            editingEdgeId: parsedState.flow?.present?.editingEdgeId || null,
            viewport: parsedState.flow?.present?.viewport || { zoom: 1 },
          },
          future: parsedState.flow?.future || []
        }
      };
      
      console.log('🧹 Sanitized persisted state:', sanitizedState);
      return sanitizedState;
    }
  } catch (error) {
    console.warn('Failed to load state from localStorage:', error);
  }
  return undefined;
};

// Create undoable reducer with proper configuration
const undoableFlowReducer = undoable(flowReducer, {
  limit: 50, // Limit history to 50 states
  initTypes: ['@@redux-undo/INIT'], // Initialize undo/redo state
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
    const shouldTrack = undoableActions.includes(action.type);
    if (shouldTrack) {
      console.log('📝 Tracking action for undo/redo:', action.type, action.payload);
    }
    return shouldTrack;
  }
  // Removed groupBy to ensure each action is tracked individually
});

export const store = configureStore({
  reducer: {
    flow: undoableFlowReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for serialization checks
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(persistenceMiddleware),
  preloadedState: loadPersistedState() || {
    flow: {
      past: [],
      present: {
        nodes: [],
        edges: [],
        editingEdgeId: null,
        viewport: { zoom: 1 },
      },
      future: []
    }
  }
});

// Initialize the undo/redo state
store.dispatch({ type: '@@redux-undo/INIT' });

// Clear state on page refresh to prevent persistence issues
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    try {
      localStorage.removeItem('innoide-flow-state');
      console.log('🔄 Cleared state on page refresh');
    } catch (error) {
      console.warn('Failed to clear state on refresh:', error);
    }
  });
} 