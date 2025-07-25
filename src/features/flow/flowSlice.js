// features/flow/flowSlice.js

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  nodes: [], // Ensure no default nodes
  edges: [], // Ensure no default edges
  editingEdgeId: null, // Track which edge is being edited
  viewport: { zoom: 1 },
  history: [], // For undo
  future: [],  // For redo
};

// console.log('Flow slice initial state:', initialState);

const HISTORY_LIMIT = 10;

const flowSlice = createSlice({
  name: 'flow',
  initialState,
  reducers: {
    setNodes(state, action) {
      // Save current state to history for undo
      state.history.push({ nodes: state.nodes, edges: state.edges });
      if (state.history.length > HISTORY_LIMIT) state.history.shift();
      state.nodes = action.payload;
      state.future = []; // Clear redo stack
    },
    setEdges: (state, action) => {
      // Save current state to history for undo
      state.history.push({ nodes: state.nodes, edges: state.edges });
      if (state.history.length > HISTORY_LIMIT) state.history.shift();
      state.edges = action.payload;
      state.future = []; // Clear redo stack
    },
    addNode(state, action) {
      state.history.push({ nodes: state.nodes, edges: state.edges });
      if (state.history.length > HISTORY_LIMIT) state.history.shift();
      state.nodes.push(action.payload);
      state.future = [];
    },
    addEdge(state, action) {
      state.history.push({ nodes: state.nodes, edges: state.edges });
      if (state.history.length > HISTORY_LIMIT) state.history.shift();
      state.edges.push(action.payload);
      state.future = [];
    },
    updateNode(state, action) {
      state.history.push({ nodes: state.nodes, edges: state.edges });
      if (state.history.length > HISTORY_LIMIT) state.history.shift();
      const { id, updates } = action.payload;
      const node = state.nodes.find(n => n.id === id);
      if (node) {
        Object.assign(node, updates);
      }
      state.future = [];
    },
    updateNodeColor(state, action) {
      state.history.push({ nodes: state.nodes, edges: state.edges });
      if (state.history.length > HISTORY_LIMIT) state.history.shift();
      const { id, color } = action.payload;
      const node = state.nodes.find(n => n.id === id);
      if (node) {
        if (!node.style) node.style = {};
        node.style.backgroundColor = color;
      }
      state.future = [];
    },
    updateEdgeColor(state, action) {
      state.history.push({ nodes: state.nodes, edges: state.edges });
      if (state.history.length > HISTORY_LIMIT) state.history.shift();
      const { id, color } = action.payload;
      const edge = state.edges.find(e => e.id === id);
      if (edge) {
        edge.style = { ...edge.style, stroke: color };
      }
      state.future = [];
    },
    updateEdgeArrowHead(state, action) {
      state.history.push({ nodes: state.nodes, edges: state.edges });
      if (state.history.length > HISTORY_LIMIT) state.history.shift();
      const { id, arrowHead } = action.payload;
      const edge = state.edges.find(e => e.id === id);
      if (edge) {
        edge.data = { ...edge.data, arrowHead };
      }
      state.future = [];
    },
    updateNodeTextColor(state, action) {
      state.history.push({ nodes: state.nodes, edges: state.edges });
      if (state.history.length > HISTORY_LIMIT) state.history.shift();
      const { id, color } = action.payload;
      const node = state.nodes.find(n => n.id === id);
      if (node) {
        if (!node.style) node.style = {};
        node.style.color = color; // Add or update text color
      }
      state.future = [];
    },
    rotateNode(state, action) {
      state.history.push({ nodes: state.nodes, edges: state.edges });
      if (state.history.length > HISTORY_LIMIT) state.history.shift();
      const { id, rotation } = action.payload;
      const node = state.nodes.find(n => n.id === id);
      if (node) {
        node.data = { ...node.data, rotation };
      }
      state.future = [];
    },
    setZoom(state, action) {
      state.viewport.zoom = action.payload;
    },
    zoomIn(state) {
      state.viewport.zoom += 0.2;
    },
    zoomOut(state) {
      state.viewport.zoom = Math.max(0.2, state.viewport.zoom - 0.2);
    },
    restore(state, action) {
      return action.payload;
    },
    reset(state) {
      return initialState;
    },
    undo(state) {
      if (state.history.length > 0) {
        const prev = state.history.pop();
        state.future.push({ nodes: state.nodes, edges: state.edges });
        state.nodes = prev.nodes;
        state.edges = prev.edges;
      }
    },
    redo(state) {
      if (state.future.length > 0) {
        const next = state.future.pop();
        state.history.push({ nodes: state.nodes, edges: state.edges });
        state.nodes = next.nodes;
        state.edges = next.edges;
      }
    },
    setEditingEdgeId(state, action) {
      state.editingEdgeId = action.payload;
    },
  }
});

export const {
  setNodes,
  setEdges,
  addNode,
  addEdge,
  updateNode,
  updateNodeColor,
  updateEdgeColor,
  updateEdgeArrowHead,
  updateNodeTextColor,
  rotateNode,
  setZoom,
  zoomIn,
  zoomOut,
  restore,
  reset,
  undo,
  redo,
  setEditingEdgeId
} = flowSlice.actions;

export default flowSlice.reducer;