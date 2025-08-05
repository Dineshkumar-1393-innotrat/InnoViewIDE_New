import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  nodes: [],
  edges: [],
  editingEdgeId: null,
  viewport: { zoom: 1 },
};

const flowSlice = createSlice({
  name: 'flow',
  initialState,
  reducers: {
    setNodes(state, action) {
      state.nodes = action.payload;
    },
    setEdges(state, action) {
      state.edges = action.payload;
    },
    addNode(state, action) {
      const { data, ...restOfNode } = action.payload;
      if (data && data.shape && typeof data.shape.getHandles === 'function') {
        const { getHandles, ...serializableShape } = data.shape;
        state.nodes.push({ ...restOfNode, data: { ...data, shape: serializableShape } });
      } else {
        state.nodes.push(action.payload);
      }
    },
    addEdge(state, action) {
      state.edges.push(action.payload);
    },
    updateNode(state, action) {
      const { id, updates } = action.payload;
      const nodeToUpdate = state.nodes.find(n => n.id === id);
      if (nodeToUpdate) {
        let sanitizedUpdates = { ...updates };
        if (updates.data && updates.data.shape && typeof updates.data.shape.getHandles === 'function') {
          const { getHandles, ...serializableShape } = updates.data.shape;
          sanitizedUpdates = {
            ...updates,
            data: { ...updates.data, shape: serializableShape },
          };
        }
        Object.assign(nodeToUpdate, sanitizedUpdates);
      }
    },
    updateNodeColor(state, action) {
      const { id, color } = action.payload;
      const node = state.nodes.find(n => n.id === id);
      if (node) {
        if (!node.style) node.style = {};
        node.style.stroke = color;
        if (!node.data) node.data = {};
        node.data.color = color;
      }
    },
    updateEdgeColor(state, action) {
      const { id, color } = action.payload;
      const edge = state.edges.find(e => e.id === id);
      if (edge) {
        if (!edge.style) edge.style = {};
        edge.style.stroke = color;
        if (!edge.data) edge.data = {};
        edge.data.color = color;
      }
    },
    updateEdgeLabel(state, action) {
      const { id, label, labelColor } = action.payload;
      const edge = state.edges.find(e => e.id === id);
      if (edge) {
        if (!edge.data) edge.data = {};
        edge.data.label = label;
        edge.data.labelColor = labelColor;
      }
    },
    updateEdgeArrowHead(state, action) {
      const { id, arrowHead } = action.payload;
      const edge = state.edges.find(e => e.id === id);
      if (edge) {
        edge.data = { ...edge.data, arrowHead };
      }
    },
    updateNodeTextColor(state, action) {
      const { id, color } = action.payload;
      const node = state.nodes.find(n => n.id === id);
      if (node) {
        if (!node.style) node.style = {};
        node.style.color = color;
        if (!node.data) node.data = {};
        node.data.textColor = color;
      }
    },
    updateNodeLabel(state, action) {
      const { id, label } = action.payload;
      const node = state.nodes.find(n => n.id === id);
      if (node) {
        if (!node.data) node.data = {};
        node.data.label = label;
      }
    },
    rotateNode(state, action) {
      const { id, rotation } = action.payload;
      const node = state.nodes.find(n => n.id === id);
      if (node) {
        if (!node.data) node.data = {};
        node.data.rotation = rotation;
      }
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
    deleteNode(state, action) {
      const nodeId = action.payload;
      state.nodes = state.nodes.filter(node => node.id !== nodeId);
      // Also remove any edges connected to this node
      state.edges = state.edges.filter(edge => 
        edge.source !== nodeId && edge.target !== nodeId
      );
    },
    deleteEdge(state, action) {
      const edgeId = action.payload;
      state.edges = state.edges.filter(edge => edge.id !== edgeId);
    },
    reset(state) {
      return initialState;
    },
    setEditingEdgeId(state, action) {
      state.editingEdgeId = action.payload;
    },
    clearFlow(state) {
      state.nodes = [];
      state.edges = [];
      state.editingEdgeId = null;
    },
    updateNodePosition(state, action) {
      const { id, position } = action.payload;
      const node = state.nodes.find(n => n.id === id);
      if (node) {
        node.position = position;
      }
    },
    updateNodeSize(state, action) {
      const { id, width, height } = action.payload;
      const node = state.nodes.find(n => n.id === id);
      if (node) {
        if (!node.style) node.style = {};
        node.style.width = width;
        node.style.height = height;
        node.width = width;
        node.height = height;
      }
    },
    clearPersistedState(state) {
      // This action will trigger the middleware to clear localStorage
      return state;
    },
  },
});

export const {
  setNodes,
  setEdges,
  addNode,
  addEdge,
  updateNode,
  updateNodeColor,
  updateEdgeColor,
  updateEdgeLabel,
  updateEdgeArrowHead,
  updateNodeTextColor,
  updateNodeLabel,
  rotateNode,
  setZoom,
  zoomIn,
  zoomOut,
  deleteNode,
  deleteEdge,
  reset,
  setEditingEdgeId,
  clearFlow,
  updateNodePosition,
  updateNodeSize,
  clearPersistedState,
} = flowSlice.actions;

export default flowSlice.reducer; 