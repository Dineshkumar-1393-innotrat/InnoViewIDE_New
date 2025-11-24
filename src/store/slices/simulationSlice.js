import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    droppedItems: [],
    connections: [],
    tabs: [
        { id: 1, name: "simulation.c", content: "// Simulation code\n", dirty: false }
    ],
    activeTab: 1,
};

const simulationSlice = createSlice({
    name: 'simulation',
    initialState,
    reducers: {
        setDroppedItems: (state, action) => {
            state.droppedItems = action.payload;
        },
        addDroppedItem: (state, action) => {
            state.droppedItems.push(action.payload);
        },
        updateDroppedItem: (state, action) => {
            const index = state.droppedItems.findIndex(item => item.id === action.payload.id);
            if (index !== -1) {
                state.droppedItems[index] = { ...state.droppedItems[index], ...action.payload };
            }
        },
        removeDroppedItem: (state, action) => {
            state.droppedItems = state.droppedItems.filter(item => item.id !== action.payload);
        },
        setConnections: (state, action) => {
            state.connections = action.payload;
        },
        addConnection: (state, action) => {
            state.connections.push(action.payload);
        },
        setTabs: (state, action) => {
            state.tabs = action.payload;
        },
        setActiveTab: (state, action) => {
            state.activeTab = action.payload;
        },
        updateTabContent: (state, action) => {
            const { id, content } = action.payload;
            const tab = state.tabs.find(t => t.id === id);
            if (tab) {
                tab.content = content;
                tab.dirty = true;
            }
        }
    },
});

export const {
    setDroppedItems,
    addDroppedItem,
    updateDroppedItem,
    removeDroppedItem,
    setConnections,
    addConnection,
    setTabs,
    setActiveTab,
    updateTabContent
} = simulationSlice.actions;

export default simulationSlice.reducer;
