// src/components/Canvas.jsx

import React, { useCallback, useRef, useEffect, useState } from 'react';
import {
  ReactFlow,
  addEdge,
  useReactFlow,
  Background,
  Controls,
  MarkerType,
  applyEdgeChanges,
  applyNodeChanges,
  MiniMap,
  ReactFlowProvider,
  useStore,
} from 'reactflow';
import { useDispatch, useSelector } from 'react-redux';
import { useDrop } from 'react-dnd';
import { toPng } from 'html-to-image';
import { v4 as uuidv4 } from 'uuid';
import { ActionCreators as UndoActionCreators } from 'redux-undo';

import {
  setNodes,
  setEdges,
  addNode,
} from '../features/flow/flowSlice';
import {
  selectNodes,
  selectEdges,
} from '../features/flow/flowSelectors';

import ResizableNode from './ResizableNode';
import CustomEdge from './CustomEdge';
import LabelNode from './LabelNode';
import { ZoomProvider } from '../contexts/ZoomContext';
import 'reactflow/dist/style.css';

const nodeTypes = {
  resizableNode: ResizableNode,
  labelNode: LabelNode, // Register label node type
};

const edgeTypes = {
  custom: CustomEdge,
};

// ZoomDisplay component for inside ReactFlowProvider
function ZoomDisplay() {
  const zoom = useStore((state) => state.transform[2]); // transform = [x, y, zoom]
  return (
    <span className="px-2 text-sm text-gray-500 w-16 text-center">{`${Math.round((zoom || 1) * 100)}%`}</span>
  );
}

const COLOR_SWATCHES = [
  '#1970fc', '#ef4444', '#22c55e', '#f59e42', '#a21caf', '#fbbf24', '#0ea5e9', '#64748b', '#000000', '#ffffff'
];

const CanvasContent = () => {
  const dispatch = useDispatch();
  const nodes = useSelector(selectNodes);
  const edges = useSelector(selectEdges);
  const reactFlowInstance = useReactFlow();

  const [, drop] = useDrop(() => ({
    accept: 'shape',
    drop: (item, monitor) => {
      const { shape } = item;
      const offset = monitor.getClientOffset();
      const position = reactFlowInstance.screenToFlowPosition({
        x: offset.x,
        y: offset.y,
      });

      const newNode = {
        id: uuidv4(),
        type: 'resizableNode',
        position,
        data: { shape },
        style: {
          width: shape.width || 150,
          height: shape.height || 100,
          background: 'transparent',
        },
      };

      dispatch(addNode(newNode));
    },
  }));

  const onNodesChange = useCallback(
    (changes) => dispatch(setNodes(applyNodeChanges(changes, nodes))),
    [dispatch, nodes]
  );

  const onEdgesChange = useCallback(
    (changes) => dispatch(setEdges(applyEdgeChanges(changes, edges))),
    [dispatch, edges]
  );

  const onConnect = useCallback(
    (connection) => {
      console.log('Connection params:', connection);
      
      // Validate connection
      if (!connection.source || !connection.target) {
        console.warn('Invalid connection: missing source or target');
        return;
      }
      
      // Check if connection already exists
      const existingEdge = edges.find(edge => 
        edge.source === connection.source && 
        edge.target === connection.target
      );
      
      if (existingEdge) {
        console.warn('Connection already exists:', existingEdge);
        return;
      }
      
      const newEdges = addEdge({
        ...connection,
        type: 'custom',
        markerEnd: { 
          type: MarkerType.ArrowClosed,
          width: 20,
          height: 20,
          color: '#1970fc',
        },
        data: { label: '', labelColor: '#000000' },
      }, edges);
      dispatch(setEdges(newEdges));
    },
    [dispatch, edges]
  );

  const onKeyDown = useCallback(
    (event) => {
      // Prevent node/edge deletion if focus is on an input or textarea (e.g., editing label)
      const tag = event.target.tagName.toLowerCase();
      if ((tag === 'input' || tag === 'textarea')) {
        return;
      }
      if (event.key === 'Delete' || event.key === 'Backspace') {
        const selectedNodes = nodes.filter((node) => node.selected).map((node) => node.id);
        const selectedEdges = edges.filter((edge) => edge.selected).map((edge) => edge.id);

        if (selectedNodes.length > 0) {
          dispatch(setNodes(nodes.filter((node) => !node.selected)));
        }
        if (selectedEdges.length > 0) {
          dispatch(setEdges(edges.filter((edge) => !edge.selected)));
        }
      }
    },
    [nodes, edges, dispatch]
  );

  const exportImage = () => {
    if (!reactFlowInstance) return;
    toPng(reactFlowInstance.getViewport()).then((dataUrl) => {
      const link = document.createElement('a');
      link.download = 'diagram.png';
      link.href = dataUrl;
      link.click();
    });
  };

  const saveToJSON = () => {
    const data = { nodes, edges };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const link = document.createElement('a');
    link.download = 'diagram.json';
    link.href = URL.createObjectURL(blob);
    link.click();
  };

  const loadFromJSON = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const { nodes: loadedNodes, edges: loadedEdges } = JSON.parse(reader.result);
        dispatch(setNodes(loadedNodes));
        dispatch(setEdges(loadedEdges));
        reactFlowInstance.setViewport({ x: 0, y: 0, zoom: 1 });
      } catch {
        alert('Invalid JSON file');
      }
    };
    reader.readAsText(file);
  };

  const [colorPalette, setColorPalette] = useState({ open: false, x: 0, y: 0, target: null });
  const [colorTarget, setColorTarget] = useState('stroke'); // 'stroke' or 'text'

  // Helper: open color palette for node or edge
  const openColorPalette = (event, target) => {
    event.stopPropagation();
    const targetIsNode = 'width' in target;
    const targetId = target.id;
    const targetType = targetIsNode ? 'node' : 'edge';
    
    const nodeElement = event.target.closest('.react-flow__node');
    if (nodeElement) {
        const { x, y, width, height } = nodeElement.getBoundingClientRect();
        setColorPalette({
            open: true,
            x: x + width / 2,
            y: y + height,
            target: { type: targetType, id: targetId },
        });
    } else {
        setColorPalette({
            open: true,
            x: event.clientX,
            y: event.clientY,
            target: { type: targetType, id: targetId },
        });
    }
  };
  const closeColorPalette = () => setColorPalette({ open: false, x: 0, y: 0, target: null });

  // Color change handler
  const handleColorPick = (color) => {
    if (!colorPalette.target) return;
    if (colorPalette.target.type === 'node') {
      if (colorTarget === 'stroke') {
        const updated = nodes.map(n => n.id === colorPalette.target.id ? { ...n, style: { ...n.style, stroke: color }, data: { ...n.data, color } } : n);
        dispatch(setNodes(updated));
      } else if (colorTarget === 'text') {
        const updated = nodes.map(n => n.id === colorPalette.target.id ? { ...n, style: { ...n.style, color }, data: { ...n.data, textColor: color } } : n);
        dispatch(setNodes(updated));
      }
    } else if (colorPalette.target.type === 'edge') {
      const updated = edges.map(e => e.id === colorPalette.target.id ? { ...e, style: { ...e.style, stroke: color }, data: { ...e.data, color } } : e);
      dispatch(setEdges(updated));
    }
    closeColorPalette();
  };

  useEffect(() => {
    const handleUndo = () => dispatch(UndoActionCreators.undo());
    const handleRedo = () => dispatch(UndoActionCreators.redo());
    const handleAutoLayout = () => {
      // Implement auto-layout logic here
    };
    const handleSaveJson = () => {
      const flow = reactFlowInstance.toObject();
      const json = JSON.stringify(flow, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'flow.json';
      link.click();
    };
    const handleLoadJsonFile = (e) => {
      const file = e.detail;
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          let jsonData = JSON.parse(reader.result);
          console.log('Loading JSON data:', jsonData);
          
          // Ensure we have the expected structure
          if (!jsonData || typeof jsonData !== 'object') {
            throw new Error('Invalid JSON structure');
          }
          
          let { nodes: loadedNodes, edges: loadedEdges } = jsonData;
          
          // Ensure arrays exist
          if (!Array.isArray(loadedNodes)) loadedNodes = [];
          if (!Array.isArray(loadedEdges)) loadedEdges = [];
          
          console.log('Original nodes:', loadedNodes);
          console.log('Original edges:', loadedEdges);
          
          // Clear existing data before loading new data
          dispatch(setNodes([]));
          dispatch(setEdges([]));
          
          // Validate and fix nodes
          loadedNodes = loadedNodes.map((node, index) => {
            // Generate default position if missing
            let position = node.position;
            if (!position || typeof position.x !== 'number' || typeof position.y !== 'number') {
              position = { x: index * 150, y: index * 100 };
            }
            
            // Handle different node data formats
            let nodeData = node.data || {};
            if (node.label) {
              nodeData.label = node.label;
            }
            if (node.shape) {
              nodeData.shape = node.shape;
            }
            
            // Ensure shape data exists
            if (!nodeData.shape) {
              nodeData.shape = { 
                name: 'rectangle', 
                icon: { 
                  viewBox: '0 0 100 100', 
                  path: 'M0,0 L100,0 L100,100 L0,100 Z' 
                } 
              };
            }
            
            const processedNode = {
              ...node,
              id: node.id || `node-${Math.random().toString(36).substr(2, 9)}`,
              position: position,
              data: {
                label: nodeData.label || nodeData.shape?.name || 'Node',
                shape: nodeData.shape,
                ...nodeData
              },
              style: {
                width: node.style?.width || 100,
                height: node.style?.height || 60,
                background: node.style?.background || 'transparent',
                ...node.style
              },
              type: node.type || 'resizableNode'
            };
            
            console.log('Processed node:', processedNode);
            return processedNode;
          });

          // Validate and fix edges
          loadedEdges = loadedEdges.map(edge => {
            // Handle different edge formats
            let source = edge.source;
            let target = edge.target;
            
            // Check if source/target are objects with id property
            if (typeof source === 'object' && source?.id) {
              source = source.id;
            }
            if (typeof target === 'object' && target?.id) {
              target = target.id;
            }
            
            // Handle edge data from different formats
            let edgeData = edge.data || {};
            if (edge.label) {
              edgeData.label = edge.label;
            }
            if (edge.labelColor) {
              edgeData.labelColor = edge.labelColor;
            }
            
            // Ensure edge has required properties
            const processedEdge = {
              ...edge,
              id: edge.id || `edge-${Math.random().toString(36).substr(2, 9)}`,
              source: source,
              target: target,
              sourceHandle: edge.sourceHandle || null,
              targetHandle: edge.targetHandle || null,
              type: edge.type || 'custom',
              data: {
                label: edgeData.label || '',
                labelColor: edgeData.labelColor || '#000000',
                ...edgeData
              },
              style: {
                stroke: edge.style?.stroke || edge.color || '#1970fc',
                strokeWidth: edge.style?.strokeWidth || 2,
                ...edge.style
              },
              markerEnd: edge.markerEnd || {
                type: MarkerType.ArrowClosed,
                width: 20,
                height: 20,
                color: edge.style?.stroke || edge.color || '#1970fc',
              }
            };
            
            console.log('Processed edge:', processedEdge);
            return processedEdge;
          });

          // Filter out edges with invalid source/target nodes
          const validNodeIds = new Set(loadedNodes.map(node => node.id));
          console.log('Valid node IDs:', Array.from(validNodeIds));
          
          loadedEdges = loadedEdges.filter(edge => {
            const isValid = validNodeIds.has(edge.source) && validNodeIds.has(edge.target);
            if (!isValid) {
              console.warn('Filtering out invalid edge:', edge, 'Valid nodes:', Array.from(validNodeIds));
            }
            return isValid;
          });

          // Ensure unique IDs
          const nodeIds = new Set();
          const edgeIds = new Set();
          
          loadedNodes = loadedNodes.map(node => {
            let newId = node.id;
            let counter = 1;
            while (nodeIds.has(newId)) {
              newId = `${node.id}-${counter}`;
              counter++;
            }
            nodeIds.add(newId);
            return { ...node, id: newId };
          });

          loadedEdges = loadedEdges.map(edge => {
            let newId = edge.id;
            let counter = 1;
            while (edgeIds.has(newId)) {
              newId = `${edge.id}-${counter}`;
              counter++;
            }
            edgeIds.add(newId);
            return { ...edge, id: newId };
          });

          // Update edge source/target to match new node IDs if needed
          const nodeIdMap = {};
          loadedNodes.forEach(node => {
            if (node.originalId) {
              nodeIdMap[node.originalId] = node.id;
            }
          });

          loadedEdges = loadedEdges.map(edge => ({
            ...edge,
            source: nodeIdMap[edge.source] || edge.source,
            target: nodeIdMap[edge.target] || edge.target
          }));

          console.log('Final nodes to dispatch:', loadedNodes);
          console.log('Final edges to dispatch:', loadedEdges);
          
          dispatch(setNodes(loadedNodes));
          dispatch(setEdges(loadedEdges));
          
          // Fit view after loading
          setTimeout(() => {
            if (reactFlowInstance) {
              reactFlowInstance.fitView({ padding: 0.1 });
            }
          }, 100);
          
        } catch (err) {
          console.error('Error loading JSON:', err);
          alert('Invalid JSON file or corrupted data');
        }
      };
      reader.readAsText(file);
    };
    const handleExportImage = () => {
      import('../utils/exportUtils').then(({ exportAsPng }) => {
        exportAsPng(exportRef);
      });
    };
    
    window.addEventListener('undo', handleUndo);
    window.addEventListener('redo', handleRedo);
    window.addEventListener('auto-layout', handleAutoLayout);
    window.addEventListener('save-json', handleSaveJson);
    window.addEventListener('load-json-file', handleLoadJsonFile);
    window.addEventListener('export-image', handleExportImage);

    return () => {
      window.removeEventListener('undo', handleUndo);
      window.removeEventListener('redo', handleRedo);
      window.removeEventListener('auto-layout', handleAutoLayout);
      window.removeEventListener('save-json', handleSaveJson);
      window.removeEventListener('load-json-file', handleLoadJsonFile);
      window.removeEventListener('export-image', handleExportImage);
    };
  }, [reactFlowInstance, dispatch, nodes, edges]);

  useEffect(() => {
    const handleZoomIn = () => reactFlowInstance.zoomIn();
    const handleZoomOut = () => reactFlowInstance.zoomOut();

    window.addEventListener('zoom-in', handleZoomIn);
    window.addEventListener('zoom-out', handleZoomOut);

    return () => {
      window.removeEventListener('zoom-in', handleZoomIn);
      window.removeEventListener('zoom-out', handleZoomOut);
    };
  }, [reactFlowInstance]);

  const exportRef = useRef(null);

  return (
    <div ref={drop} className="w-full h-full" style={{ pointerEvents: 'auto', position: 'relative' }} tabIndex={0} onKeyDown={onKeyDown}>
      {/* Floating Color Palette */}
      {colorPalette.open && (
        <div style={{ position: 'fixed', left: colorPalette.x, top: colorPalette.y, zIndex: 1000, transform: 'translateX(-50%)', background: '#fff', border: '1px solid #ddd', borderRadius: 8, padding: 8, boxShadow: '0 2px 8px #0002', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {colorPalette.target?.type === 'node' && (
            <div style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
              <button onClick={() => setColorTarget('stroke')} style={{ padding: '2px 8px', borderRadius: 4, border: colorTarget === 'stroke' ? '2px solid #1970fc' : '1px solid #ccc', background: colorTarget === 'stroke' ? '#e0f2fe' : '#fff', cursor: 'pointer' }}>Border</button>
              <button onClick={() => setColorTarget('text')} style={{ padding: '2px 8px', borderRadius: 4, border: colorTarget === 'text' ? '2px solid #1970fc' : '1px solid #ccc', background: colorTarget === 'text' ? '#e0f2fe' : '#fff', cursor: 'pointer' }}>Text</button>
            </div>
          )}
          <div style={{ display: 'flex', gap: 8 }}>
            {COLOR_SWATCHES.map(color => (
              <button key={color} style={{ width: 24, height: 24, background: color, border: '2px solid #eee', borderRadius: '50%', cursor: 'pointer' }} onClick={() => handleColorPick(color)} />
            ))}
            <button onClick={closeColorPalette} style={{ marginLeft: 8, color: '#888', background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
          </div>
        </div>
      )}
      {/* Export-only area: shapes, edges, light blue background */}
      <div ref={exportRef} className="w-full h-full" style={{ position: 'absolute', inset: 0, zIndex: 0, background: '#e0f2fe' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          proOptions={{ hideAttribution: true }}
          connectionMode="loose"
          connectionLineType="bezier"
          isValidConnection={(connection) => {
            // Prevent self-connections
            if (connection.source === connection.target) {
              return false;
            }
            
            // Check if connection already exists
            const existingEdge = edges.find(edge => 
              edge.source === connection.source && 
              edge.target === connection.target
            );
            
            if (existingEdge) {
              return false;
            }
            
            // Only allow connections between valid nodes
            const sourceNode = nodes.find(n => n.id === connection.source);
            const targetNode = nodes.find(n => n.id === connection.target);
            
            return !!(sourceNode && targetNode);
          }}
          onNodeClick={(event, node) => openColorPalette(event, node)}
          onEdgeClick={(event, edge) => openColorPalette(event, edge)}
        >
          <Background variant="dots" gap={12} size={1.5} color="#a5d8ff" />
        </ReactFlow>
      </div>
      {/* Controls and MiniMap (not exported) */}
      <Controls position="bottom-right" className="react-flow-controls" style={{ zIndex: 10 }} />
      <MiniMap position="bottom-left" pannable zoomable style={{ zIndex: 10 }} />
    </div>
  );
};

const Canvas = () => {
  return (
    <ReactFlowProvider>
      <ZoomProvider>
        <div className="w-full h-full bg-blue-500">
          <CanvasContent />
        </div>
      </ZoomProvider>
    </ReactFlowProvider>
  );
};

export default Canvas;
