import React, { useCallback, useRef, useEffect, useState, useMemo } from 'react';
import { createSelector } from '@reduxjs/toolkit';
import {
  ReactFlow,
  useReactFlow,
  Controls,
  ControlButton, // Import ControlButton
  MarkerType,
  ConnectionMode,
  applyEdgeChanges,
  applyNodeChanges,
  MiniMap,
  ReactFlowProvider,
} from 'reactflow';
import { useDispatch, useSelector } from 'react-redux';
import { useDrop } from 'react-dnd';
import { toPng } from 'html-to-image';
import { toast } from 'react-toastify';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import { ActionCreators } from 'redux-undo';
import ResizableNode from './ResizableNode';
import CustomEdge from './CustomEdge';
import CustomConnectionLine from './CustomConnectionLine';
import {
  selectNodes,
  selectEdges,
  selectCanUndo,
  selectCanRedo,
  selectConnectorType,
  selectEditingEdgeId,
  setNodes,
  setEdges,
  addNode,
  addEdge,
  deleteNode,
  deleteEdge,
  setEditingEdgeId,
} from '../features/flow/flowSlice';
import LabelNode from './LabelNode';
import DyteMeetingComponent from './DyteMeeting';
import { ZoomProvider } from '../contexts/ZoomContext.jsx';
import watermarkLogo from '../assets/hex_bg.png';
import 'reactflow/dist/style.css';
import './DiagramEditor.css';
import HistoryPanel from './HistoryPanel';
import DiagramSidebar from './DiagramSidebar';
import { useOutletContext } from 'react-router-dom';

const COLOR_SWATCHES = [
  '#1970fc', '#ef4444', '#22c55e', '#f59e42', '#a21caf', '#fbbf24', '#0ea5e9', '#64748b',
  '#ec4899', '#8b5cf6', '#14b8a6', '#6366f1', '#78350f', '#84cc16', '#06b6d4', '#9ca3af',
  '#000000', '#ffffff'
];

// Define nodeTypes and edgeTypes outside the component to prevent recreation
const nodeTypes = {
  resizableNode: ResizableNode,
  labelNode: LabelNode,
};

const edgeTypes = {
  custom: CustomEdge,
};

const DiagramEditorContent = ({ fileSystem, onFileSystemUpdate, setFlowchartRef }) => {
  const dispatch = useDispatch();
  const nodesFromStore = useSelector(selectNodes);
  const edges = useSelector(selectEdges);
  const canUndo = useSelector(selectCanUndo);
  const canRedo = useSelector(selectCanRedo);
  const connectorType = useSelector(selectConnectorType);
  const reactFlowInstance = useReactFlow();
  const [hoveredNodeId, setHoveredNodeId] = useState(null);
  const [colorPalette, setColorPalette] = useState({ open: false, x: 0, y: 0, target: null });
  const [colorTarget, setColorTarget] = useState('stroke'); // 'stroke' or 'text'
  const editingEdgeId = useSelector(selectEditingEdgeId);
  const [sourceNodeForConnection, setSourceNodeForConnection] = useState(null);
  const [showMeeting, setShowMeeting] = useState(false);
  const [meetingInfo, setMeetingInfo] = useState({ authToken: null, roomName: null });
  const [isConnecting, setIsConnecting] = useState(false);

  // Use a ref to hold the latest connectorType to avoid stale closures in callbacks
  const connectorTypeRef = useRef(connectorType);
  useEffect(() => {
    connectorTypeRef.current = connectorType;
  }, [connectorType]);

  // Guard to prevent onNodesChange/onEdgesChange from firing immediately after undo/redo
  const isUndoRedoRef = useRef(false);
  const undoRedoTimerRef = useRef(null);
  const startUndoRedoGuard = useCallback(() => {
    isUndoRedoRef.current = true;
    if (undoRedoTimerRef.current) clearTimeout(undoRedoTimerRef.current);
    undoRedoTimerRef.current = setTimeout(() => {
      isUndoRedoRef.current = false;
      undoRedoTimerRef.current = null;
    }, 150);
  }, []);

  const closeColorPalette = () => setColorPalette({ open: false, x: 0, y: 0, target: null });

  // Helper: open color palette for node or edge
  const openColorPalette = (event, target) => {
    event.preventDefault(); // Prevent default context menu
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

  // Color change handler
  const handleColorPick = (color) => {
    if (!colorPalette.target) return;
    if (colorPalette.target.type === 'node') {
      if (colorTarget === 'stroke') {
        const updated = nodesFromStore.map(n => n.id === colorPalette.target.id ? { ...n, style: { ...n.style, stroke: color }, data: { ...n.data, color } } : n);
        dispatch(setNodes(updated));
      } else if (colorTarget === 'text') {
        const updated = nodesFromStore.map(n => n.id === colorPalette.target.id ? { ...n, style: { ...n.style, color }, data: { ...n.data, textColor: color } } : n);
        dispatch(setNodes(updated));
      }
    } else if (colorPalette.target.type === 'edge') {
      const updated = edges.map(e => e.id === colorPalette.target.id ? { ...e, style: { ...e.style, stroke: color }, data: { ...e.data, color } } : e);
      dispatch(setEdges(updated));
    }
    closeColorPalette();
  };

  const nodes = useMemo(() => {
    return nodesFromStore.map(node => ({
      ...node,
      data: {
        ...node.data,
        isHovering: node.id === hoveredNodeId,
        isConnecting,
      },
    }));
  }, [nodesFromStore, hoveredNodeId, isConnecting]);


  const onNodeMouseEnter = (event, node) => setHoveredNodeId(node.id);
  const onNodeMouseLeave = () => setHoveredNodeId(null);

  const [, drop] = useDrop(() => ({
    accept: 'shape',
    drop: (item, monitor) => {
      const { shape } = item;
      const offset = monitor.getClientOffset();
      const position = reactFlowInstance.screenToFlowPosition({
        x: offset.x,
        y: offset.y,
      });

      const { getHandles, ...serializableShape } = shape;

      // Compute text slots based on shape metadata so we can initialize defaults
      const computeSlots = (s) => {
        if (!s) return [];
        if (Array.isArray(s.textSlots) && s.textSlots.length > 0) return s.textSlots;
        const g = s.slotGrid;
        if (g && g.rows > 0 && g.cols > 0) {
          const margin = typeof g.margin === 'number' ? g.margin : 2;
          const inset = g.inset || { top: 0, right: 0, bottom: 0, left: 0 };
          const slots = [];
          const usableWidth = 100 - (inset.left || 0) - (inset.right || 0);
          const usableHeight = 100 - (inset.top || 0) - (inset.bottom || 0);
          const cellW = usableWidth / g.cols;
          const cellH = usableHeight / g.rows;
          for (let r = 0; r < g.rows; r++) {
            for (let c = 0; c < g.cols; c++) {
              const left = (inset.left || 0) + c * cellW + margin;
              const top = (inset.top || 0) + r * cellH + margin;
              const width = Math.max(0, cellW - 2 * margin);
              const height = Math.max(0, cellH - 2 * margin);
              slots.push({ id: `r${r}c${c}`, left, top, width, height, r, c, i: r * g.cols + c });
            }
          }
          return slots;
        }
        return [];
      };

      const slots = computeSlots(serializableShape);

      // Build default slot texts from shape.slotDefaults.format if available
      let slotTexts = undefined;
      if (slots.length > 0) {
        const fmt = serializableShape.slotDefaults?.format;
        if (fmt) {
          const rows = serializableShape.slotGrid?.rows || 1;
          const cols = serializableShape.slotGrid?.cols || slots.length;
          const format = (template, ctx) =>
            template
              .replace(/\{i\}/g, String(ctx.i))
              .replace(/\{n\}/g, String(ctx.i + 1))
              .replace(/\{r\}/g, String(ctx.r))
              .replace(/\{c\}/g, String(ctx.c));
          slotTexts = {};
          slots.forEach((s, index) => {
            const r = typeof s.r === 'number' ? s.r : Math.floor(index / cols);
            const c = typeof s.c === 'number' ? s.c : index % cols;
            slotTexts[s.id] = format(fmt, { i: index, r, c });
          });
        }
      }

      const newNode = {
        id: uuidv4(),
        type: 'resizableNode',
        position,
        data: { shape: serializableShape, ...(slotTexts ? { slotTexts } : {}) },
        style: {
          width: serializableShape.width || 120,
          height: serializableShape.height || 80,
          background: 'transparent',
        },
      };

      dispatch(addNode(newNode));
    },
  }));

  const onNodesChange = useCallback(
    (changes) => {
      if (isUndoRedoRef.current) return; // ignore synthetic changes from undo/redo
      const currentNodes = reactFlowInstance.getNodes();
      dispatch(setNodes(applyNodeChanges(changes, currentNodes)));
    },
    [dispatch, reactFlowInstance]
  );

  const onEdgesChange = useCallback(
    (changes) => {
      if (isUndoRedoRef.current) return; // ignore synthetic changes from undo/redo
      const currentEdges = reactFlowInstance.getEdges();
      dispatch(setEdges(applyEdgeChanges(changes, currentEdges)));
    },
    [dispatch, reactFlowInstance]
  );

  const isValidConnection = (connection) => {
    // Simple validation: prevent connecting a source to a source
    const { sourceHandle, targetHandle } = connection;
    if (sourceHandle && targetHandle) {
      return sourceHandle.split('-')[0] !== targetHandle.split('-')[0];
    }
    // Allow connections if handles are not specified (e.g. node-to-node)
    return true;
  };

  const onConnect = useCallback(
    (params) => {
      const newEdge = {
        ...params,
        id: `edge-${params.source}-${params.target}-${Date.now()}`,
        type: 'custom',
        data: { label: '' },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#3b82f6' },
        style: { stroke: '#3b82f6', strokeWidth: 2 },
      };

      // Access the latest connectorType from the store directly inside the callback
      if (connectorTypeRef.current === 'double') {
        newEdge.markerStart = { type: MarkerType.ArrowClosed, color: '#3b82f6' };
      }

      dispatch(addEdge(newEdge));
      // stop connecting UI state
      setIsConnecting(false);
    },
    [dispatch]
  );

  // When connection starts, make handles larger and always visible to ease joining
  const onConnectStart = useCallback(() => {
    setIsConnecting(true);
  }, []);

  const onConnectEnd = useCallback(() => {
    setIsConnecting(false);
  }, []);

  const onConnectStop = onConnectEnd;

  // Memoized selector to prevent unnecessary re-renders for undo/redo panel state
  const selectReduxFlowState = useMemo(() => createSelector(
    [(state) => state.flow.past?.length || 0, (state) => state.flow.future?.length || 0],
    (pastLength, futureLength) => ({ pastLength, futureLength })
  ), []);

  const reduxFlowState = useSelector(selectReduxFlowState);

  const onUndo = useCallback(() => {
    console.log('↩️ Undo button clicked');
    console.log('canUndo state:', canUndo);
    console.log('Current nodes before undo:', nodesFromStore.length);
    if (canUndo) {
      startUndoRedoGuard();
      dispatch(ActionCreators.undo());
      setTimeout(() => {
        console.log('📊 State after undo dispatch - nodes:', nodesFromStore.length);
      }, 100);
    } else {
      console.log('❌ Undo not available - no past history');
    }
  }, [canUndo, dispatch, nodesFromStore, startUndoRedoGuard]);

  const onRedo = useCallback(() => {
    console.log('🔄 Redo button clicked');
    console.log('canRedo state:', canRedo);
    console.log('Redux flow state:', reduxFlowState);
    console.log('Current nodes:', nodesFromStore.length);
    console.log('Current edges:', edges.length);
    if (canRedo) {
      startUndoRedoGuard();
      dispatch(ActionCreators.redo());
      setTimeout(() => {
        console.log('📊 State after redo dispatch - nodes:', nodesFromStore.length, 'edges:', edges.length);
      }, 100);
    } else {
      console.log('❌ Redo not available - no future history');
    }
  }, [canRedo, dispatch, reduxFlowState, nodesFromStore, edges, startUndoRedoGuard]);

  const onKeyDown = useCallback(
    (event) => {
      const tag = event.target.tagName.toLowerCase();
      if (tag === 'input' || tag === 'textarea') {
        return;
      }

      if (event.ctrlKey || event.metaKey) {
        if (event.key === 'z' && !event.shiftKey) {
          event.preventDefault();
          onUndo();
        } else if ((event.key === 'z' && event.shiftKey) || event.key === 'y') {
          event.preventDefault();
          onRedo();
        }
      }
    },
    [onUndo, onRedo]
  );

  const exportRef = useRef(null);
  // Expose the export surface to parent for PNG export
  const attachExportSurfaceRef = useCallback((el) => {
    exportRef.current = el;
    if (typeof setFlowchartRef === 'function') {
      setFlowchartRef(el);
    }
  }, [setFlowchartRef]);
  const watermarkRef = useRef(null);

  const exportImage = useCallback(() => {
    if (!exportRef.current) {
      console.error('Export ref not available');
      return;
    }

    if (watermarkRef.current) {
      watermarkRef.current.style.visibility = 'visible';
    }

    const style = document.createElement('style');
    style.innerHTML = `
      .react-flow__edge-path { fill: none !important; }
      .edge-label-display { background: transparent !important; }
    `;
    document.head.appendChild(style);

    const cleanup = () => {
      if (watermarkRef.current) {
        watermarkRef.current.style.visibility = 'hidden';
      }
      document.head.removeChild(style);
    };

    toPng(exportRef.current, {
      quality: 1.0,
      backgroundColor: '#070808',
      cacheBust: true,
      filter: (node) => {
        if (
          node.classList?.contains('react-flow__controls') ||
          node.classList?.contains('react-flow__minimap')
        ) {
          return false;
        }
        return true;
      },
    }).then((dataUrl) => {
      const link = document.createElement('a');
      link.download = 'diagram.png';
      link.href = dataUrl;
      link.click();
      cleanup();
    }).catch((error) => {
      console.error('Error exporting image:', error);
      cleanup();
    });
  }, []);

  const saveToJSON = useCallback(async () => {
    const payload = {
      nodes: nodesFromStore,
      edges: edges,
      fileORFolderId: "6867c3c158c6ae8e6b9b7fe3",
      productId: "6867c3bf58c6ae8e6b9b7fe0",
      userId: "67add4f3d16ff7c76ba10bcf"
    };

    try {
      const response = await axios.post('https://eureka.innotrat.in/api/v1/addFlowDiagram', payload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('Diagram saved successfully:', response.data);
      toast.success('Diagram saved successfully!');
    } catch (error) {
      console.error('Error saving diagram:', error);
      toast.error('Failed to save diagram. See console for details.');
    }
  }, [nodesFromStore, edges]);

  const loadFromJSON = useCallback((event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        let jsonData = JSON.parse(reader.result);
        console.log('Loading JSON data:', jsonData);
        
        if (!jsonData || typeof jsonData !== 'object') {
          throw new Error('Invalid JSON structure');
        }
        
        let { nodes: loadedNodes, edges: loadedEdges } = jsonData;
        
        if (!Array.isArray(loadedNodes)) loadedNodes = [];
        if (!Array.isArray(loadedEdges)) loadedEdges = [];
        
        dispatch(setNodes([]));
        dispatch(setEdges([]));
        
        loadedNodes = loadedNodes.map((node, index) => {
          let position = node.position;
          if (!position || typeof position.x !== 'number' || typeof position.y !== 'number') {
            position = { x: index * 150, y: index * 100 };
          }
          
          let nodeData = node.data || {};
          if (node.label) nodeData.label = node.label;
          if (node.shape) nodeData.shape = node.shape;
          
          if (!nodeData.shape) {
            nodeData.shape = { 
              name: 'rectangle', 
              icon: { 
                viewBox: '0 0 100 100', 
                path: 'M0,0 L100,0 L100,100 L0,100 Z' 
              } 
            };
          }
          
          return {
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
        });

        loadedEdges = loadedEdges.map(edge => {
          let source = typeof edge.source === 'object' && edge.source?.id ? edge.source.id : edge.source;
          let target = typeof edge.target === 'object' && edge.target?.id ? edge.target.id : edge.target;
          
          let edgeData = edge.data || {};
          if (edge.label) edgeData.label = edge.label;
          if (edge.labelColor) edgeData.labelColor = edge.labelColor;
          
          return {
            ...edge,
            id: edge.id || `edge-${Math.random().toString(36).substr(2, 9)}`,
            source: source,
            target: target,
            sourceHandle: edge.sourceHandle || null,
            targetHandle: edge.targetHandle || null,
            type: edge.type || 'custom',
            data: {
              label: edgeData.label || '',
              labelColor: edgeData.labelColor || '#e5e7eb',
              ...edgeData
            },
            style: {
              stroke: edge.style?.stroke || edge.color || '#3b82f6',
              strokeWidth: edge.style?.strokeWidth || 2,
              ...edge.style
            },
            markerEnd: edge.markerEnd || {
              type: MarkerType.ArrowClosed,
              width: 20,
              height: 20,
              color: edge.style?.stroke || edge.color || '#3b82f6',
            }
          };
        });

        const validNodeIds = new Set(loadedNodes.map(node => node.id));
        loadedEdges = loadedEdges.filter(edge => validNodeIds.has(edge.source) && validNodeIds.has(edge.target));

        const nodeIdMap = {};
        const uniqueNodeIds = new Set();
        loadedNodes = loadedNodes.map(node => {
          let newId = node.id;
          let counter = 1;
          while (uniqueNodeIds.has(newId)) {
            newId = `${node.id}-${counter}`;
            counter++;
          }
          if (newId !== node.id) nodeIdMap[node.id] = newId;
          uniqueNodeIds.add(newId);
          return { ...node, id: newId };
        });

        loadedEdges = loadedEdges.map(edge => ({
          ...edge,
          source: nodeIdMap[edge.source] || edge.source,
          target: nodeIdMap[edge.target] || edge.target
        }));

        const uniqueEdgeIds = new Set();
        loadedEdges = loadedEdges.map(edge => {
          let newId = edge.id;
          let counter = 1;
          while (uniqueEdgeIds.has(newId)) {
            newId = `${edge.id}-${counter}`;
            counter++;
          }
          uniqueEdgeIds.add(newId);
          return { ...edge, id: newId };
        });

        dispatch(setNodes(loadedNodes));
        dispatch(setEdges(loadedEdges));
        
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
  }, [dispatch, reactFlowInstance]);

  // Add event listeners for header actions
  useEffect(() => {
    const handleSaveJson = () => {
      saveToJSON();
    };
    
    const handleLoadJsonFile = (e) => {
      // Handle custom event from header
      if (e.detail && e.detail instanceof File) {
        const fileEvent = { target: { files: [e.detail] } };
        loadFromJSON(fileEvent);
      } else {
        // Handle direct file input event
        loadFromJSON(e);
      }
    };
    
    const handleExportImage = () => {
      exportImage();
    };

    window.addEventListener('save-json', handleSaveJson);
    window.addEventListener('load-json-file', handleLoadJsonFile);
    window.addEventListener('export-image', handleExportImage);

    return () => {
      window.removeEventListener('save-json', handleSaveJson);
      window.removeEventListener('load-json-file', handleLoadJsonFile);
      window.removeEventListener('export-image', handleExportImage);
    };
  }, [saveToJSON, loadFromJSON, exportImage]);

  const onNodesDelete = useCallback(
    (deletedNodes) => {
      for (const node of deletedNodes) {
        dispatch(deleteNode(node.id));
      }
    },
    [dispatch]
  );

  const onEdgesDelete = useCallback(
    (deletedEdges) => {
      for (const edge of deletedEdges) {
        dispatch(deleteEdge(edge.id));
      }
    },
    [dispatch]
  );


  return (
    <div 
      ref={drop} 
      className="flex-grow w-full h-full relative" 
      style={{ pointerEvents: 'auto' }} 
      tabIndex={0} 
      onKeyDown={onKeyDown}
      onContextMenu={(e) => e.preventDefault()}
      onClick={() => closeColorPalette()}
    >
      {/* Floating Color Palette */}
      {colorPalette.open && (
        <div 
          onClick={(e) => e.stopPropagation()}
          style={{ 
            position: 'fixed', 
            left: colorPalette.x, 
            top: colorPalette.y, 
            zIndex: 1000, 
            transform: 'translateX(-50%)', 
            background: '#87C3FF',
            border: '1px solid #BFDBF6', 
            borderRadius: 12, 
            padding: 12, 
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 8 
          }}
        >
          {colorPalette.target?.type === 'node' && (
            <div style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
              <button 
                onClick={() => setColorTarget('stroke')} 
                style={{ 
                  padding: '4px 12px', 
                  borderRadius: 8, 
                  border: colorTarget === 'stroke' ? '2px solid #3b82f6' : '1px solid #4b5563', 
                  background: colorTarget === 'stroke' ? '#1e3a8a' : '#e0f2fe', 
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '500',
                  color: '#e5e7eb'
                }}
              >
                Border
              </button>
              <button 
                onClick={() => setColorTarget('text')} 
                style={{ 
                  padding: '4px 12px', 
                  borderRadius: 8, 
                  border: colorTarget === 'text' ? '2px solid #3b82f6' : '1px solid #4b5563', 
                  background: colorTarget === 'text' ? '#1e3a8a' : '#e0f2fe', 
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '500',
                  color: '#e5e7eb'
                }}
              >
                Text
              </button>
            </div>
          )}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', maxWidth: '200px' }}>
            {COLOR_SWATCHES.map(color => (
              <button 
                key={color} 
                style={{ 
                  width: 28, 
                  height: 28, 
                  background: color, 
                  border: '2px solid #4b5563', 
                  borderRadius: '50%', 
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }} 
                onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
                onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                onClick={() => handleColorPick(color)} 
              />
            ))}
            <button 
              onClick={closeColorPalette} 
              style={{ 
                marginLeft: 8, 
                padding: '4px 8px', 
                borderRadius: 8, 
                border: '1px solid #4b5563', 
                background: '#e0f2fe', 
                cursor: 'pointer',
                fontSize: '12px',
                color: '#e5e7eb'
              }}
            >
              ✕
            </button>
          </div>
        </div>
      )}
      
      {/* Export-only area: shapes, edges, light blue background in UI.
          This element is the export surface; MainLayout overrides its background to white during export. */}
      <div
        ref={attachExportSurfaceRef}
        className="diagram-export-surface w-full h-full"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          backgroundColor: '#e0f2fe', // UI background; will be forced to white in export onclone
          minHeight: '400px',
          minWidth: '400px'
        }}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onConnectStart={onConnectStart}
          onConnectEnd={onConnectEnd}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onNodeContextMenu={openColorPalette}
          onEdgeContextMenu={(event, edge) => {
            event.preventDefault();
            // This functionality is now handled by the sidebar, so we can disable the context menu.
          }}
          onNodeMouseEnter={onNodeMouseEnter}
          onNodeMouseLeave={onNodeMouseLeave}
          deleteKeyCode={['Backspace', 'Delete']}
          onNodesDelete={onNodesDelete}
          onEdgesDelete={onEdgesDelete}
          fitView
          attributionPosition="bottom-left"
          style={{ background: 'transparent', width: '100%', height: '100%' }}
          proOptions={{ hideAttribution: true }}
          connectionMode={ConnectionMode.Handles}
          connectionLineComponent={CustomConnectionLine}
          connectionLineStyle={{ stroke: '#3b82f6', strokeWidth: 2 }}
          connectionRadius={30}
          isValidConnection={(connection) => {
            // Prevent self-connections
            if (connection.source === connection.target) return false;

            // Ensure connection is from a source handle to a target handle
            const sourceHandleIsSource = connection.sourceHandle?.endsWith('-source');
            const targetHandleIsTarget = connection.targetHandle?.endsWith('-target');

            return sourceHandleIsSource && targetHandleIsTarget;
          }}
          onNodeClick={(event, node) => {
            // Handle one-click connection
            if (sourceNodeForConnection) {
              const newEdge = {
                id: `e${sourceNodeForConnection.id}-${node.id}`,
                source: sourceNodeForConnection.id,
                target: node.id,
                type: 'custom',
                animated: true,
              };
              dispatch(addEdge(newEdge));
              setSourceNodeForConnection(null);
            } else {
              // Handle node selection
              const updatedNodes = nodesFromStore.map(n => ({
                ...n,
                selected: n.id === node.id ? !n.selected : n.selected
              }));
              dispatch(setNodes(updatedNodes));
            }
          }}
          onEdgeClick={(event, edge) => {
            event.stopPropagation();
            // Handle edge selection only
            const updatedEdges = edges.map(e => ({
              ...e,
              selected: e.id === edge.id ? !e.selected : false
            }));
            dispatch(setEdges(updatedEdges));
          }}
          onEdgeDoubleClick={(event, edge) => {
            event.stopPropagation();
            // Start editing edge label
            dispatch(setEditingEdgeId(edge.id));
          }}
        />
        {/* Watermark for export - placed inside the export area (hidden in UI, shown during export) */}
        <div
          ref={watermarkRef}
          className="export-watermark"
          style={{
            position: 'absolute',
            right: 20,
            bottom: 20,
            visibility: 'hidden', // default hidden; will be enabled in MainLayout on export
            pointerEvents: 'none',
            userSelect: 'none',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255, 255, 255, 0.95)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            padding: '6px 10px',
            borderRadius: '10px',
          }}
        >
          <img src={watermarkLogo} alt="Innotrat" style={{ width:'20px', height:'20px' }} />
          <span style={{ color: '#000000', fontSize: '12px', fontWeight: 600 }}>made with innotrat labs</span>
        </div>
      </div>
      
      {/* Controls and MiniMap (not exported) */}
      <Controls position="bottom-right" className="react-flow-controls" style={{ zIndex: 10, right: 15, bottom: 15 }}>
        {/* Undo Button */}
        <div title="Undo">
          <ControlButton onClick={onUndo} disabled={!canUndo} className="custom-control-button">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
              <path d="M3 12h6v6"></path>
            </svg>
          </ControlButton>
        </div>
        {/* Redo Button */}
        <div title="Redo">
          <ControlButton 
            onClick={(e) => {
              console.log('🖱️ Redo button DOM click event triggered');
              e.preventDefault();
              e.stopPropagation();
              onRedo();
            }} 
            disabled={!canRedo} 
            className="custom-control-button"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12a9 9 0 1 0 6.219-8.56"></path>
              <path d="M21 12h-6v6"></path>
            </svg>
          </ControlButton>
        </div>
      </Controls>
      <MiniMap position="bottom-left" pannable zoomable style={{ zIndex: 10, left: 15, bottom: 15 }} />
    </div>
  );
};


const DiagramEditor = ({ fileSystem, onFileSystemUpdate, refreshFileSystem }) => {
  const { setFlowchartRef } = useOutletContext();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('flowchart');
  const [showMeeting, setShowMeeting] = useState(false);
  const [meetingInfo, setMeetingInfo] = useState({ authToken: null, roomName: null });
  const [showHistory, setShowHistory] = useState(false);
  const dispatch = useDispatch();
  const edges = useSelector(selectEdges);

  const handleStartCall = async () => {
    const devAuthToken = 'Basic NTE1NDA1YWYtMDljNy00NzM1LTg3ZjgtMzM1OThhNjc2OGNhOjkwMTNmZTdjMzc4N2FlNWUwNmE5';
    console.log('Starting video call with developer token...');
    setMeetingInfo({
      authToken: devAuthToken,
      roomName: 'innoid-diagram-collaboration-dev',
    });
    setShowMeeting(true);
  };

  const handleCloseMeeting = () => {
    setShowMeeting(false);
    setMeetingInfo({ authToken: null, roomName: null });
  };

  const handleFlipDirection = () => {
    const selectedEdge = edges.find((edge) => edge.selected);
    if (selectedEdge) {
      const updatedEdges = edges.map((e) =>
        e.id === selectedEdge.id
          ? {
              ...e,
              source: selectedEdge.target,
              target: selectedEdge.source,
              sourceHandle: selectedEdge.targetHandle,
              targetHandle: selectedEdge.sourceHandle,
            }
          : e
      );
      dispatch(setEdges(updatedEdges));
    }
  };

  return (
    <div className="h-full w-full bg-gray-900 text-white">
      {showMeeting && meetingInfo.authToken && (
        <DyteMeetingComponent
          authToken={meetingInfo.authToken}
          roomName={meetingInfo.roomName}
          onClose={handleCloseMeeting}
        />
      )}
      <DndProvider backend={HTML5Backend}>
        <ReactFlowProvider>
          <div className="flex h-full w-full">
            <DiagramSidebar 
              isCollapsed={isSidebarCollapsed} 
              activeTab={activeTab} 
              setActiveTab={setActiveTab} 
              onFlipDirection={handleFlipDirection} 
              onFileSystemUpdate={onFileSystemUpdate} 
            />
            <div className="flex-1 flex flex-col relative">
              <main className="flex-1 relative">
                <DiagramEditorContent fileSystem={fileSystem} onFileSystemUpdate={onFileSystemUpdate} setFlowchartRef={setFlowchartRef} />
              </main>
            </div>
          </div>
        </ReactFlowProvider>
      </DndProvider>
    </div>
  );
};

export default DiagramEditor;