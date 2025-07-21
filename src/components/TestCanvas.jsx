// src/components/TestCanvas.jsx

import React from 'react';
import { ReactFlow, ReactFlowProvider } from 'reactflow';
import 'reactflow/dist/style.css';

const TestCanvas = () => {
  console.log('TestCanvas component is rendering');
  
  const testNodes = [
    {
      id: 'test-1',
      type: 'default',
      position: { x: 100, y: 100 },
      data: { label: 'Test Node 1' },
    }
  ];

  console.log('TestCanvas rendering with nodes:', testNodes);

  return (
    <div className="w-full h-full  border-4 border-green-500">
      <div style={{ width: '100%', height: '100%', backgroundColor: 'yellow' }}>
        <ReactFlow
          nodes={testNodes}
          edges={[]}
          fitView
        />
      </div>
    </div>
  );
};

const TestCanvasWrapper = () => {
  console.log('TestCanvasWrapper component is rendering');
  return (
    <ReactFlowProvider>
      <TestCanvas />
    </ReactFlowProvider>
  );
};

export default TestCanvasWrapper; 