import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ReactFlowProvider } from 'reactflow';
import Sidebar from './components/Sidebar';
import Canvas from './components/Canvas';


function App() {
  const [selectedColor, setSelectedColor] = useState('#FF6B6B');

  const handleSelectColor = (color) => {
    setSelectedColor(color);
  };

  return (
    <DndProvider backend={HTML5Backend}>
    
      <ReactFlowProvider>
        <div className="flex h-screen w-screen bg-gray-900 text-white">
          <Sidebar onSelectColor={handleSelectColor} />
          <Canvas selectedColor={selectedColor} />
        </div>
      </ReactFlowProvider>
    </DndProvider>
  );
}

export default App;
