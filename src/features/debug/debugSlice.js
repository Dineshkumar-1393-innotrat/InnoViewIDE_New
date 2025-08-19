import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  status: 'idle', // 'idle', 'running', 'paused'
  output: '',
};

const debugSlice = createSlice({
  name: 'debug',
  initialState,
  reducers: {
    runCode: (state) => {
      state.status = 'running';
      console.log('Running code...');
    },
    stepInto: (state) => {
      if (state.status === 'paused') {
        console.log('Stepping into...');
      }
    },
    stepOver: (state) => {
      if (state.status === 'paused') {
        console.log('Stepping over...');
      }
    },
    restart: (state) => {
      state.status = 'running';
      console.log('Restarting...');
    },
    stop: (state) => {
      state.status = 'idle';
      console.log('Stopping...');
    },
    pause: (state) => {
        state.status = 'paused';
        console.log('Paused');
    }
  },
});

export const { runCode, stepInto, stepOver, restart, stop, pause } = debugSlice.actions;

export default debugSlice.reducer;
