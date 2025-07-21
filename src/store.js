import { configureStore } from '@reduxjs/toolkit';
import flowReducer from './features/flow/flowSlice';

const store = configureStore({
  reducer: {
    flow: flowReducer, // Remove redux-undo temporarily
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Add debugging to see the initial state
// console.log('Store initial state:', store.getState());

// Test: Add a node with style property for debugging
// const testNode = {
//   id: 'test-store',
//   type: 'resizable',
//   position: { x: 100, y: 100 },
//   data: { label: 'Store Test' },
//   style: { width: 100, height: 60 },
//   width: 100,
//   height: 60,
// };
// console.debug('Dispatching test node:', testNode);
// store.dispatch({ type: 'flow/addNode', payload: testNode });
// console.log('Store state after test dispatch:', store.getState());

export default store;
