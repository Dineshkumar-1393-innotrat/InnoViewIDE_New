import React, { useCallback, useRef, useEffect, useState, useMemo } from 'react';
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
  useStore,
} from 'reactflow';
import { useDispatch, useSelector } from 'react-redux';
import { useDrop } from 'react-dnd';
import { toPng } from 'html-to-image';
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
import DiagramSidebar from './DiagramSidebar';
import DiagramHeader from './DiagramHeader';
import { ZoomProvider } from '../contexts/ZoomContext.jsx';
import { applyAutoLayout } from '../utils/autoLayout';
import watermarkLogo from '../assets/hex_bg.png';
import 'reactflow/dist/style.css';
import './DiagramEditor.css';

const COLOR_SWATCHES = [
  '#1970fc', '#ef4444', '#22c55e', '#f59e42', '#a21caf', '#fbbf24', '#0ea5e9', '#64748b', '#000000', '#ffffff'
];

// Define nodeTypes and edgeTypes outside the component to prevent recreation
const nodeTypes = {
  resizableNode: ResizableNode,
  labelNode: LabelNode,
};

const edgeTypes = {
  custom: CustomEdge,
};

const DiagramEditorContent = () => {
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

  // Use a ref to hold the latest connectorType to avoid stale closures in callbacks
  const connectorTypeRef = useRef(connectorType);
  useEffect(() => {
    connectorTypeRef.current = connectorType;
  }, [connectorType]);

  const closeColorPalette = () => setColorPalette({ open: false, x: 0, y: 0, target: null });

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
      },
    }));
  }, [nodesFromStore, hoveredNodeId]);


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

      const newNode = {
        id: uuidv4(),
        type: 'resizableNode',
        position,
        data: { shape: serializableShape },
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
      const currentNodes = reactFlowInstance.getNodes();
      dispatch(setNodes(applyNodeChanges(changes, currentNodes)));
    },
    [dispatch, reactFlowInstance]
  );

  const onEdgesChange = useCallback(
    (changes) => {
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
    },
    [dispatch]
  );

  const onUndo = useCallback(() => {
    if (canUndo) {
      dispatch(ActionCreators.undo());
    }
  }, [canUndo, dispatch]);

  const onRedo = useCallback(() => {
    if (canRedo) {
      dispatch(ActionCreators.redo());
    }
  }, [canRedo, dispatch]);

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
  const watermarkRef = useRef(null);

  const exportImage = useCallback(() => {
    if (!exportRef.current) {
      console.error('Export ref not available');
      return;
    }
    
    // Show watermark before export
    if (watermarkRef.current) {
      watermarkRef.current.style.visibility = 'visible';
    }
    
    // Use the exportRef for PNG export
    toPng(exportRef.current, {
      quality: 1.0,
      backgroundColor: '#374151', // Match the canvas background color
    }).then((dataUrl) => {
      const link = document.createElement('a');
      link.download = 'diagram.png';
      link.href = dataUrl;
      link.click();
      
      // Hide watermark after export
      if (watermarkRef.current) {
        watermarkRef.current.style.visibility = 'hidden';
      }
    }).catch((error) => {
      console.error('Error exporting image:', error);
      // Hide watermark on error
      if (watermarkRef.current) {
        watermarkRef.current.style.visibility = 'hidden';
      }
    });
  }, []);

  const saveToJSON = useCallback(() => {
    const data = { nodes: nodesFromStore, edges };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const link = document.createElement('a');
    link.download = 'diagram.json';
    link.href = URL.createObjectURL(blob);
    link.click();
  }, [nodesFromStore, edges]);

  const loadFromJSON = useCallback((e) => {
    const file = e.target.files[0];
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

        // Ensure unique IDs and update edge connections
        const nodeIdMap = {};
        const uniqueNodeIds = new Set();
        
        loadedNodes = loadedNodes.map(node => {
          let newId = node.id;
          let counter = 1;
          while (uniqueNodeIds.has(newId)) {
            newId = `${node.id}-${counter}`;
            counter++;
          }
          if (newId !== node.id) {
            nodeIdMap[node.id] = newId;
          }
          uniqueNodeIds.add(newId);
          return { ...node, id: newId };
        });

        loadedEdges = loadedEdges.map(edge => ({
          ...edge,
          source: nodeIdMap[edge.source] || edge.source,
          target: nodeIdMap[edge.target] || edge.target
        }));

        // Ensure unique edge IDs (less critical but good practice)
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
            background: '#374151', 
            border: '1px solid #4b5563', 
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
                  background: colorTarget === 'stroke' ? '#1e3a8a' : '#374151', 
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
                  background: colorTarget === 'text' ? '#1e3a8a' : '#374151', 
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
                background: '#374151', 
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
      
      {/* Export-only area: shapes, edges, light blue background */}
      <div
        ref={exportRef}
        className="w-full h-full"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          backgroundColor: '#374151', // Light blue-gray background to match sidebar
        }}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
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
          style={{ background: 'transparent' }}
          proOptions={{ hideAttribution: true }}
          connectionMode={ConnectionMode.Handles}
          connectionLineComponent={CustomConnectionLine}
          connectionLineStyle={{ stroke: '#3b82f6', strokeWidth: 2 }}
          isValidConnection={(connection) => {
            // Prevent self-connections
            if (connection.source === connection.target) return false;

            // Ensure connection is from a source handle to a target handle
            const sourceHandleIsSource = connection.sourceHandle?.endsWith('-source');
            const targetHandleIsTarget = connection.targetHandle?.endsWith('-target');

            return sourceHandleIsSource && targetHandleIsTarget;
          }}
          onNodeClick={(event, node) => {
            // Handle node selection
            const updatedNodes = nodesFromStore.map(n => ({
              ...n,
              selected: n.id === node.id ? !n.selected : n.selected
            }));
            dispatch(setNodes(updatedNodes));
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
        {/* Watermark for export - placed inside the export area */}
        <div
          ref={watermarkRef}
          style={{
            position: 'absolute',
            left: 20,
            bottom: 20,
            visibility: 'hidden', // default hidden
            pointerEvents: 'none',
            userSelect: 'none',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255, 255, 255, 0.8)',
            padding: '4px 8px',
            borderRadius: '6px',
          }}
        >
          <img src={watermarkLogo} alt="Watermark" style={{color:'#0413e0', width:'24px', height:'auto' }} />
          <span style={{ color: '#333', fontSize: '12px', fontWeight: '500' }}>Made with InnoTrat Labs</span>
          
        </div>
      </div>
      
      {/* Controls and MiniMap (not exported) */}
      <Controls position="bottom-right" className="react-flow-controls" style={{ zIndex: 10 }}>
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
          <ControlButton onClick={onRedo} disabled={!canRedo} className="custom-control-button">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12a9 9 0 1 0 6.219-8.56"></path>
              <path d="M21 12h-6v6"></path>
            </svg>
          </ControlButton>
        </div>
      </Controls>
      <MiniMap position="bottom-left" pannable zoomable style={{ zIndex: 10 }} />
    </div>
  );
};

const DiagramEditor = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="diagram-editor-route flex flex-col h-screen bg-gray-900">
        <DiagramHeader
          onZoomIn={() => window.dispatchEvent(new Event('zoom-in'))}
          onZoomOut={() => window.dispatchEvent(new Event('zoom-out'))}
          handleSave={() => window.dispatchEvent(new Event('save-json'))}
          handleExport={() => window.dispatchEvent(new Event('export-image'))}
          toggleSidebar={toggleSidebar}
          exportImage={() => window.dispatchEvent(new Event('export-image'))}
        />
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          {sidebarOpen && (
            <div className="w-full md:w-56 lg:w-64 flex-shrink-0 bg-gray-800 border-r border-gray-700">
              <DiagramSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
            </div>
          )}

          {/* Main Canvas Area */}
          <main className="flex-1 flex flex-col h-full relative bg-gray-900 min-w-0">
            <ReactFlowProvider>
              <ZoomProvider>
                <DiagramEditorContent />
              </ZoomProvider>
            </ReactFlowProvider>
          </main>
        </div>
      </div>
    </DndProvider>
  );
};

export default DiagramEditor; 