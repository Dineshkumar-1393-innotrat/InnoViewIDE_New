// import React, { useRef, useEffect, useCallback } from 'react';
// import ReactFlow, {
//   Background,
//   Controls,
//   addEdge,
//   useReactFlow,
//   ReactFlowProvider,
//   applyNodeChanges,
//   applyEdgeChanges,
// } from 'reactflow';
// import { useDrop } from 'react-dnd';
// import { useDispatch, useSelector } from 'react-redux';
// import { ActionCreators as UndoActionCreators } from 'redux-undo';
// import { setNodes, setEdges } from '../features/flow/flowSlice';
// import { selectNodes, selectEdges } from '../features/flow/flowSelectors';
// import { v4 as uuidv4 } from 'uuid';
// import { toPng } from 'html-to-image';
// import ResizableNode from './ResizableNode';
// import { applyAutoLayout } from '../utils/autoLayout';
// import 'reactflow/dist/style.css';
// import CustomEdge from './CustomEdge';

// const nodeTypes = {
//   resizable: ResizableNode,
// };
// const edgeTypes = {
//   custom: CustomEdge,
// };
// const getCurrentUserColor = () => {
//   // Replace with actual user color logic if available
//   return '#4F46E5'; // Default indigo
// };
// const edgePresetColors = ['#4F46E5', '#f59e42', '#22c55e', '#ef4444', '#a21caf', '#fbbf24', '#0ea5e9', '#64748b'];

// function CanvasContent() {
//   const dispatch = useDispatch();
//   const nodes = useSelector(selectNodes);
//   const edges = useSelector(selectEdges);
//   const { screenToFlowPosition } = useReactFlow();
//   const flowRef = useRef(null);
//   const [selectedEdgeId, setSelectedEdgeId] = React.useState(null);
//   const [colorPickerValue, setColorPickerValue] = React.useState('#4F46E5');

//   const [, drop] = useDrop(() => ({
//     accept: 'shape',
//     drop: (item, monitor) => {
//       const offset = monitor.getClientOffset();
//       if (!offset) return;

//       const position = screenToFlowPosition(offset);

//       const newNode = {
//         id: uuidv4(),
//         type: 'resizable',
//         position,
//         data: {
//           label: item.shape.name,
//           shapeId: item.shape.id,
//           style: { width: 100, height: 60 },
//         },
//         style: { width: 100, height: 60 },
//       };

//       dispatch(setNodes([...nodes, newNode]));
//     },
//   }), [nodes]);

//   const saveToJSON = () => {
//     const json = JSON.stringify({ nodes, edges });
//     const blob = new Blob([json], { type: 'application/json' });
//     const link = document.createElement('a');
//     link.href = URL.createObjectURL(blob);
//     link.download = 'flow.json';
//     link.click();
//   };

//   const onConnect = useCallback(
//     (connection) => {
//       // Ensure sourceHandle and targetHandle are set for all sides
//       const newEdge = {
//         ...connection,
//         id: uuidv4(),
//         type: 'custom',
//         color: getCurrentUserColor(),
//         data: { color: getCurrentUserColor() },
//         sourceHandle: connection.sourceHandle,
//         targetHandle: connection.targetHandle,
//       };
//       dispatch(setEdges([...edges, newEdge]));
//     },
//     [dispatch, edges]
//   );
//   const onEdgeClick = useCallback((event, edge) => {
//     event.stopPropagation();
//     setSelectedEdgeId(edge.id);
//     setColorPickerValue(edge.color || '#4F46E5');
//   }, []);
//   const handleColorChange = (e) => {
//     const newColor = e.target.value;
//     setColorPickerValue(newColor);
//     const updatedEdges = edges.map((edge) =>
//       edge.id === selectedEdgeId ? { ...edge, color: newColor, data: { ...edge.data, color: newColor } } : edge
//     );
//     dispatch(setEdges(updatedEdges));
//   };

//   const loadFromJSON = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     const reader = new FileReader();
//     reader.onload = () => {
//       try {
//         let { nodes: loadedNodes, edges: loadedEdges } = JSON.parse(reader.result);
//         // Autofix nodes
//         loadedNodes = loadedNodes.map(node => ({
//           ...node,
//           position: node.position || { x: 0, y: 0 },
//           data: {
//             label: node.data?.label || node.data?.shape?.name || 'Node',
//             ...node.data
//           },
//           style: {
//             width: node.style?.width || 100,
//             height: node.style?.height || 60,
//             background: node.style?.background || '#2563eb',
//             ...node.style
//           }
//         }));
//         // Autofix edges
//         loadedEdges = loadedEdges.map(edge => ({
//           ...edge,
//           color: edge.color || '#4F46E5',
//           type: edge.type || 'custom',
//         }));
//         dispatch(setNodes(loadedNodes));
//         dispatch(setEdges(loadedEdges));
//       } catch (err) {
//         alert('Invalid JSON file');
//       }
//     };
//     reader.readAsText(file);
//   };

//   const exportAsImage = () => {
//     if (!flowRef.current) return;
//     toPng(flowRef.current).then((dataUrl) => {
//       const link = document.createElement('a');
//       link.download = 'flowchart.png';
//       link.href = dataUrl;
//       link.click();
//     });
//   };

//   const handleKeyDown = useCallback((e) => {
//     if (e.ctrlKey && e.key === 's') {
//       e.preventDefault();
//       saveToJSON();
//     } else if (e.ctrlKey && e.key === 'z') {
//       e.preventDefault();
//       dispatch(UndoActionCreators.undo());
//     } else if (e.ctrlKey && e.key === 'y') {
//       e.preventDefault();
//       dispatch(UndoActionCreators.redo());
//     } else if (e.key === 'Delete') {
//       const selectedNodes = nodes.filter(n => n.selected);
//       if (selectedNodes.length > 0) {
//         dispatch(setNodes(nodes.filter(n => !n.selected)));
//       }
//     }
//   }, [dispatch, nodes]);

//   useEffect(() => {
//     document.addEventListener('keydown', handleKeyDown);
//     return () => document.removeEventListener('keydown', handleKeyDown);
//   }, [handleKeyDown]);
// useEffect(() => {
//   const handleAutoLayout = async () => {
//     const newNodes = await applyAutoLayout(nodes, edges, 'RIGHT');
//     dispatch(setNodes(newNodes));
//   };

//   window.addEventListener('auto-layout', handleAutoLayout);
//   return () => window.removeEventListener('auto-layout', handleAutoLayout);
// }, [nodes, edges, dispatch]);
//   return (
//     <div
//       ref={(el) => {
//         drop(el);
//         flowRef.current = el;
//       }}
//       tabIndex={0}
//       onKeyDown={handleKeyDown}
//       className="w-full h-full bg-gray-800 border-4 border-green-500"
//     >
//       {selectedEdgeId && (
//         <div className="absolute z-50 top-4 right-4 bg-white p-2 rounded shadow border flex flex-col items-center">
//           <div className="flex items-center mb-2">
//             <label className="mr-2 text-gray-700">Edge Color:</label>
//             {edgePresetColors.map((color) => (
//               <button
//                 key={color}
//                 className="w-6 h-6 rounded-full border-2 border-gray-300 hover:border-black mx-0.5"
//                 style={{ background: color }}
//                 onClick={() => handleColorChange({ target: { value: color } })}
//               />
//             ))}
//           </div>
//           <input
//             type="color"
//             value={colorPickerValue}
//             onChange={handleColorChange}
//           />
//           <button
//             className="ml-2 px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 mt-2"
//             onClick={() => setSelectedEdgeId(null)}
//           >
//             Close
//           </button>
//         </div>
//       )}
//       <ReactFlow
//         nodes={nodes}
//         edges={edges}
//         onNodesChange={(changes) => dispatch(setNodes(applyNodeChanges(changes, nodes)))}
//         onEdgesChange={(changes) => dispatch(setEdges(applyEdgeChanges(changes, edges)))}
//         onConnect={onConnect}
//         onEdgeClick={onEdgeClick}
//         fitView
//         selectionOnDrag
//         multiSelectionKeyCode={['Meta', 'Control']}
//         nodeTypes={nodeTypes}
//         edgeTypes={edgeTypes}
//         className="bg-gray-800"
//         connectionMode="loose"
//         isValidConnection={() => true}
//       >
//         <Background color="#444" gap={16} />
//         <Controls />
//       </ReactFlow>
//     </div>
//   );
// }

// // ✅ Wrapper with ReactFlowProvider
// // export default function CanvasInner() {
// //   return (
// //      <div className="w-full h-[calc(100vh-64px)]"> {/* Adjust this if your header is 64px */}
     
// //         <CanvasContent />
     
// //     </div>
// //   );
// // }
// export default function CanvasInner() {
//   return (
//     <ReactFlowProvider>
//       <div className="w-full h-[calc(100vh-64px)]">
//         <CanvasContent />
//       </div>
//     </ReactFlowProvider>
//   );
// }
