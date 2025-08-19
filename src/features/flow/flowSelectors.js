import { createSelector } from '@reduxjs/toolkit';

// With redux-undo, the state is wrapped with present, past, and future
export const selectFlowState = (state) => state.flow;

// Select the current state (present)
export const selectNodes = (state) => state.flow.present?.nodes || [];
export const selectEdges = (state) => state.flow.present?.edges || [];

// Selectors for undo/redo functionality
export const selectCanUndo = (state) => state.flow.past && state.flow.past.length > 0;
export const selectCanRedo = (state) => state.flow.future && state.flow.future.length > 0;

// Selector for editing edge ID
export const selectEditingEdgeId = (state) => state.flow.present?.editingEdgeId || null;

// Selector for selected nodes
export const selectSelectedNodes = createSelector(
  [selectNodes],
  (nodes) => nodes.filter(node => node.selected)
);

// Selector for selected edges
export const selectSelectedEdges = createSelector(
  [selectEdges],
  (edges) => edges.filter(edge => edge.selected)
);

// Selector for history length
export const selectHistoryLength = (state) => state.flow.past?.length || 0;

// Selector for future length
export const selectFutureLength = (state) => state.flow.future?.length || 0; 