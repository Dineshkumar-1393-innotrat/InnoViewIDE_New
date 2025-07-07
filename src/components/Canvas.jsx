// import React, { useState, useCallback, useRef } from 'react';
// import ReactFlow, {
//   addEdge,
//   useNodesState,
//   useEdgesState,
//   useReactFlow,
//   Background,
//   MiniMap,
//   Controls,
//   MarkerType
// } from 'reactflow';
// import { useDrop } from 'react-dnd';
// import { toPng } from 'html-to-image';
// import { v4 as uuidv4 } from 'uuid';

// import ResizableNode from './ResizableNode';
// import Header from './Header';
// import CustomEdge from './CustomEdge';

// import 'reactflow/dist/style.css';
// import '@reactflow/node-resizer/dist/style.css';

// const nodeTypes = { resizableNode: ResizableNode };
// const edgeTypes = { custom: CustomEdge };

// const Canvas = () => {
//   const reactFlowWrapper = useRef(null);
//   const { project, setViewport, getViewport } = useReactFlow();
//   const [nodes, setNodes, onNodesChange] = useNodesState([]);
//   const [edges, setEdges, onEdgesChange] = useEdgesState([]);

//   const [undoStack, setUndoStack] = useState([]);
//   const [redoStack, setRedoStack] = useState([]);

//   const pushToUndoStack = useCallback(() => {
//     setUndoStack((prev) => [...prev, { nodes, edges }]);
//     setRedoStack([]);
//   }, [nodes, edges]);

//   const undo = () => {
//     if (undoStack.length === 0) return;
//     const previous = undoStack[undoStack.length - 1];
//     setUndoStack((prev) => prev.slice(0, -1));
//     setRedoStack((prev) => [...prev, { nodes, edges }]);
//     setNodes(previous.nodes);
//     setEdges(previous.edges);
//   };

//   const redo = () => {
//     if (redoStack.length === 0) return;
//     const next = redoStack[redoStack.length - 1];
//     setRedoStack((prev) => prev.slice(0, -1));
//     setUndoStack((prev) => [...prev, { nodes, edges }]);
//     setNodes(next.nodes);
//     setEdges(next.edges);
//   };

//   const deleteEdge = useCallback((edgeId) => {
//     pushToUndoStack();
//     setEdges((eds) => eds.filter((edge) => edge.id !== edgeId));
//   }, [pushToUndoStack, setEdges]);

//   const onConnect = useCallback((params) => {
//     console.log('Connecting from', params.sourceHandle, 'to', params.targetHandle);
//     pushToUndoStack();
//     setEdges((eds) =>
//       addEdge(
//         {
//           ...params,
//           id: uuidv4(),
//           type: 'custom',
//           markerEnd: { type: MarkerType.ArrowClosed },
//           data: {
//             onDelete: deleteEdge,
//           },
//         },
//         eds
//       )
//     );
//   }, [setEdges, pushToUndoStack, deleteEdge]);

//   const onNameChange = useCallback(
//     (id, name) => {
//       pushToUndoStack();
//       setNodes((nds) =>
//         nds.map((node) =>
//           node.id === id
//             ? { ...node, data: { ...node.data, shape: { ...node.data.shape, name } } }
//             : node
//         )
//       );
//     },
//     [setNodes, pushToUndoStack]
//   );

//   const [{ isOver }, drop] = useDrop({
//     accept: 'shape',
//     drop: (item, monitor) => {
//       const offset = monitor.getClientOffset();
//       if (!reactFlowWrapper.current) return;
//       const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
//       const position = project({
//         x: offset.x - reactFlowBounds.left,
//         y: offset.y - reactFlowBounds.top,
//       });

//       const viewBox = item.icon.viewBox.split(' ').map(Number);
//       const aspectRatio = viewBox[2] > 0 ? viewBox[3] / viewBox[2] : 1;
//       const nodeWidth = 150;
//       const nodeHeight = nodeWidth * aspectRatio;

//       const newNode = {
//         id: uuidv4(),
//         type: 'resizableNode',
//         position,
//         data: {
//           shape: item,
//           onNameChange: onNameChange,
//         },
//         style: { width: nodeWidth, height: nodeHeight },
//       };

//       pushToUndoStack();
//       setNodes((nds) => nds.concat(newNode));
//     },
//     collect: (monitor) => ({
//       isOver: monitor.isOver(),
//     }),
//   });

//   const handleZoomIn = () => {
//     const { x, y, zoom } = getViewport();
//     setViewport({ x, y, zoom: zoom * 1.2 }, { duration: 200 });
//   };

//   const handleZoomOut = () => {
//     const { x, y, zoom } = getViewport();
//     setViewport({ x, y, zoom: zoom / 1.2 }, { duration: 200 });
//   };

//   const handleDownloadImage = () => {
//     const reactFlowPane = document.querySelector('.react-flow__pane');
//     if (!reactFlowPane) return;

//     toPng(reactFlowPane, {
//       backgroundColor: '#1a202c',
//       width: reactFlowPane.scrollWidth,
//       height: reactFlowPane.scrollHeight,
//       style: {
//         transform: 'translate(0, 0) scale(1)',
//       },
//     }).then((dataUrl) => {
//       const a = document.createElement('a');
//       a.setAttribute('download', 'diagram.png');
//       a.setAttribute('href', dataUrl);
//       a.click();
//     });
//   };

//   const handleSave = () => {
//     const flow = { nodes, edges };
//     const dataStr = JSON.stringify(flow, null, 2);
//     const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
//     const exportFileDefaultName = 'diagram.json';
//     const linkElement = document.createElement('a');
//     linkElement.setAttribute('href', dataUri);
//     linkElement.setAttribute('download', exportFileDefaultName);
//     linkElement.click();
//   };

//   const handleLoad = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         const flow = JSON.parse(e.target.result);
//         if (flow && flow.nodes && flow.edges) {
//           const restoredNodes = flow.nodes.map((node) => ({
//             ...node,
//             data: {
//               ...node.data,
//               onNameChange: onNameChange,
//             },
//           }));
//           pushToUndoStack();
//           setNodes(restoredNodes);
//           setEdges(flow.edges);
//           setViewport({ x: 0, y: 0, zoom: 1 });
//         }
//       };
//       reader.readAsText(file);
//     }
//   };

//   return (
//     <main className="flex-1 h-full relative" ref={reactFlowWrapper}>
//       <Header
//         onZoomIn={handleZoomIn}
//         onZoomOut={handleZoomOut}
//         onSave={handleSave}
//         onLoad={handleLoad}
//         onDownloadImage={handleDownloadImage}
//         onUndo={undo}
//         onRedo={redo}
//         canUndo={undoStack.length > 0}
//         canRedo={redoStack.length > 0}
//       />
//       <div className="w-full h-full" ref={drop}>
//         <ReactFlow
//           nodes={nodes}
//           edges={edges}
//           onNodesChange={onNodesChange}
//           onEdgesChange={onEdgesChange}
//           onConnect={onConnect}
//           nodeTypes={nodeTypes}
//           edgeTypes={edgeTypes}
//           fitView
//           deleteKeyCode={46}
//           className="bg-gray-900"
//           style={{
//             backgroundColor: isOver ? '#2d3748' : '#1a202c',
//           }}
//         >
//           <Background color="#4a5568" gap={16} />
//           <MiniMap nodeStrokeWidth={3} zoomable pannable />
//           <Controls position="bottom-right" />
//         </ReactFlow>
//       </div>
//     </main>
//   );
// };

// export default Canvas;
import React, { useState, useCallback, useRef } from 'react';
import ReactFlow, {
  addEdge,
  useNodesState,
  useEdgesState,
  useReactFlow,
  Background,
  MiniMap,
  Controls,
  MarkerType
} from 'reactflow';
import { useDrop } from 'react-dnd';
import { toPng } from 'html-to-image';
import { v4 as uuidv4 } from 'uuid';

import ResizableNode from './ResizableNode';
import Header from './Header';
import CustomEdge from './CustomEdge';

import 'reactflow/dist/style.css';
import '@reactflow/node-resizer/dist/style.css';

const nodeTypes = { resizableNode: ResizableNode };
const edgeTypes = { custom: CustomEdge };

const Canvas = () => {
  const reactFlowWrapper = useRef(null);
  const { project, setViewport, getViewport } = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  const pushToUndoStack = useCallback(() => {
    setUndoStack((prev) => [...prev, { nodes, edges }]);
    setRedoStack([]);
  }, [nodes, edges]);

  const undo = () => {
    if (undoStack.length === 0) return;
    const previous = undoStack[undoStack.length - 1];
    setUndoStack((prev) => prev.slice(0, -1));
    setRedoStack((prev) => [...prev, { nodes, edges }]);
    setNodes(previous.nodes);
    setEdges(previous.edges);
  };

  const redo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setRedoStack((prev) => prev.slice(0, -1));
    setUndoStack((prev) => [...prev, { nodes, edges }]);
    setNodes(next.nodes);
    setEdges(next.edges);
  };

  const deleteEdge = useCallback((edgeId) => {
    pushToUndoStack();
    setEdges((eds) => eds.filter((edge) => edge.id !== edgeId));
  }, [pushToUndoStack, setEdges]);

  const onConnect = useCallback((params) => {
    pushToUndoStack();
    setEdges((eds) =>
      addEdge(
        {
          ...params,
          id: uuidv4(),
          type: 'custom',
          markerEnd: { type: MarkerType.ArrowClosed },
          data: {
            onDelete: deleteEdge,
          },
        },
        eds
      )
    );
  }, [setEdges, pushToUndoStack, deleteEdge]);

  const onNameChange = useCallback(
    (id, name) => {
      pushToUndoStack();
      setNodes((nds) =>
        nds.map((node) =>
          node.id === id
            ? { ...node, data: { ...node.data, shape: { ...node.data.shape, name } } }
            : node
        )
      );
    },
    [setNodes, pushToUndoStack]
  );

  const [{ isOver }, drop] = useDrop({
    accept: 'shape',
    drop: (item, monitor) => {
      const offset = monitor.getClientOffset();
      if (!reactFlowWrapper.current) return;
      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = project({
        x: offset.x - reactFlowBounds.left,
        y: offset.y - reactFlowBounds.top,
      });

      const viewBox = item.icon.viewBox.split(' ').map(Number);
      const aspectRatio = viewBox[2] > 0 ? viewBox[3] / viewBox[2] : 1;
      const nodeWidth = 150;
      const nodeHeight = nodeWidth * aspectRatio;

      const newNode = {
        id: uuidv4(),
        type: 'resizableNode',
        position,
        data: {
          shape: item,
          onNameChange: onNameChange,
        },
        style: { width: nodeWidth, height: nodeHeight },
      };

      pushToUndoStack();
      setNodes((nds) => nds.concat(newNode));
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const handleZoomIn = () => {
    const { x, y, zoom } = getViewport();
    setViewport({ x, y, zoom: zoom * 1.2 }, { duration: 200 });
  };

  const handleZoomOut = () => {
    const { x, y, zoom } = getViewport();
    setViewport({ x, y, zoom: zoom / 1.2 }, { duration: 200 });
  };

  const handleDownloadImage = () => {
    const reactFlowPane = document.querySelector('.react-flow__pane');
    if (!reactFlowPane) return;

    toPng(reactFlowPane, {
      backgroundColor: '#1a202c',
      width: reactFlowPane.scrollWidth,
      height: reactFlowPane.scrollHeight,
      style: {
        transform: 'translate(0, 0) scale(1)',
      },
    }).then((dataUrl) => {
      const a = document.createElement('a');
      a.setAttribute('download', 'diagram.png');
      a.setAttribute('href', dataUrl);
      a.click();
    });
  };

  const handleSave = () => {
    const flow = { nodes, edges };
    const dataStr = JSON.stringify(flow, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = 'diagram.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleLoad = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const flow = JSON.parse(e.target.result);
        if (flow && flow.nodes && flow.edges) {
          const restoredNodes = flow.nodes.map((node) => ({
            ...node,
            data: {
              ...node.data,
              onNameChange: onNameChange,
            },
          }));
          pushToUndoStack();
          setNodes(restoredNodes);
          setEdges(flow.edges);
          setViewport({ x: 0, y: 0, zoom: 1 });
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <main
      className="flex-1 h-[calc(100vh-3.5rem)] md:h-full relative flex flex-col"
      ref={reactFlowWrapper}
    >
      {/* Header with buttons */}
      <Header
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onSave={handleSave}
        onLoad={handleLoad}
        onDownloadImage={handleDownloadImage}
        onUndo={undo}
        onRedo={redo}
        canUndo={undoStack.length > 0}
        canRedo={redoStack.length > 0}
      />

      {/* Flow canvas */}
      <div className="flex-1 w-full" ref={drop}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          deleteKeyCode={46}
          className="bg-gray-900"
          style={{
            backgroundColor: isOver ? '#2d3748' : '#1a202c',
          }}
        >
          <Background color="#4a5568" gap={16} />
          <MiniMap nodeStrokeWidth={3} zoomable pannable />
          <Controls position="bottom-right" />
        </ReactFlow>
      </div>
    </main>
  );
};

export default Canvas;
