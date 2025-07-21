// src/components/Canvas.jsx

import React, { useCallback, useRef, useEffect, useState, createContext, useContext } from 'react';
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
import 'reactflow/dist/style.css';

const nodeTypes = {
  resizableNode: ResizableNode,
};

const edgeTypes = {
  custom: CustomEdge,
};

// Zoom context - now properly connected to ReactFlow
export const ZoomContext = createContext(1);

// ZoomProvider that gets zoom from ReactFlow context
export function ZoomProvider({ children }) {
  return (
    <ReactFlowProvider>
      <ZoomProviderWithReactFlow>
        {children}
      </ZoomProviderWithReactFlow>
    </ReactFlowProvider>
  );
}

function ZoomProviderWithReactFlow({ children }) {
  const zoom = useStore((state) => state.transform[2]);
  return (
    <ZoomContext.Provider value={zoom || 1}>{children}</ZoomContext.Provider>
  );
}

// Hook to use zoom context
export const useZoom = () => {
  const zoom = useContext(ZoomContext);
  return zoom || 1;
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
      const newEdges = addEdge({
        ...connection,
        type: 'custom',
        markerEnd: { 
          type: MarkerType.ArrowClosed,
          width: 20,
          height: 20,
          color: '#1970fc',
        },
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
  const openColorPalette = (event, targetType, targetId) => {
    event.stopPropagation();
    setColorPalette({ open: true, x: event.clientX, y: event.clientY, target: { type: targetType, id: targetId } });
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
          let { nodes: loadedNodes, edges: loadedEdges } = JSON.parse(reader.result);
          // Autofix nodes
          loadedNodes = loadedNodes.map(node => ({
            ...node,
            position: node.position || { x: 0, y: 0 },
            data: {
              label: node.data?.label || node.data?.shape?.name || 'Node',
              ...node.data
            },
            style: {
              width: node.style?.width || 100,
              height: node.style?.height || 60,
              background: node.style?.background || '#f7f8fa',
              ...node.style
            }
          }));
          // Autofix edges
          loadedEdges = loadedEdges.map(edge => ({
            ...edge,
            color: edge.color || '#4F46E5',
            type: edge.type || 'custom',
          }));
          dispatch(setNodes(loadedNodes));
          dispatch(setEdges(loadedEdges));
        } catch (err) {
          alert('Invalid JSON file');
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
        <div style={{ position: 'fixed', left: colorPalette.x, top: colorPalette.y, zIndex: 1000, background: '#fff', border: '1px solid #ddd', borderRadius: 8, padding: 8, boxShadow: '0 2px 8px #0002', display: 'flex', flexDirection: 'column', gap: 8 }}>
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
      {/* Export-only area: shapes, edges, background */}
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
          isValidConnection={() => true}
          onNodeClick={(event, node) => openColorPalette(event, 'node', node.id)}
          onEdgeClick={(event, edge) => openColorPalette(event, 'edge', edge.id)}
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
    <ZoomProvider>
      <div className="w-full h-full bg-blue-500">
        <CanvasContent />
      </div>
    </ZoomProvider>
  );
};

export default Canvas;
