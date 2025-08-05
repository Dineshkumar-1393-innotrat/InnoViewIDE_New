import React, { useCallback, useRef, useEffect, useState, useMemo } from 'react';
import {
  ReactFlow,
  addEdge,
  useReactFlow,
  Controls,
  MarkerType,
  Position,
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
import { ActionCreators } from 'redux-undo';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { store } from '../store';

import {
  setNodes,
  setEdges,
  addNode,
  deleteNode,
  deleteEdge,
  setEditingEdgeId,
  clearPersistedState,
} from '../features/flow/flowSlice';
import {
  selectNodes,
  selectEdges,
  selectCanUndo,
  selectCanRedo,
  selectEditingEdgeId,
} from '../features/flow/flowSelectors';

import ResizableNode from './ResizableNode';
import CustomEdge from './CustomEdge';
import LabelNode from './LabelNode';
import DiagramSidebar from './DiagramSidebar';
import DiagramHeader from './DiagramHeader';

import { ZoomProvider } from '../contexts/ZoomContext.jsx';
import { applyAutoLayout } from '../utils/autoLayout';
import { shapes } from '../shapes/shapeData';
import hexBgImage from '../assets/hex_bg.png';
import 'reactflow/dist/style.css';

const COLOR_SWATCHES = [
  '#1970fc', '#ef4444', '#22c55e', '#f59e42', '#a21caf', '#fbbf24', '#0ea5e9', '#64748b', '#000000', '#ffffff'
];

// Define edgeTypes outside the component to prevent recreation
const edgeTypes = {
  custom: CustomEdge,
};

// Define nodeTypes outside the component to prevent recreation
const nodeTypes = {
  resizableNode: ResizableNode,
  labelNode: LabelNode,
};

const DiagramEditorContent = () => {
  const dispatch = useDispatch();
  const nodesFromStore = useSelector(selectNodes);
  const edges = useSelector(selectEdges);
  const canUndo = useSelector(selectCanUndo);
  const canRedo = useSelector(selectCanRedo);

  // Debug: Monitor edges state changes
  useEffect(() => {
    console.log('🔍 Edges state updated:', edges.length, 'edges');
    edges.forEach(edge => {
      if (edge.data?.sourceHandle || edge.data?.targetHandle) {
        console.log('🔗 Edge with handles:', {
          id: edge.id,
          source: edge.source,
          target: edge.target,
          sourceHandle: edge.data?.sourceHandle,
          targetHandle: edge.data?.targetHandle
        });
      }
    });
  }, [edges]);
  const reactFlowInstance = useReactFlow();
  const [colorPalette, setColorPalette] = useState({ open: false, x: 0, y: 0, target: null });
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionSource, setConnectionSource] = useState(null);
  const [colorTarget, setColorTarget] = useState('stroke'); // 'stroke' or 'text'
  const editingEdgeId = useSelector(selectEditingEdgeId);

  const closeColorPalette = () => setColorPalette({ open: false, x: 0, y: 0, target: null });

  // Helper: open color palette for node or edge
  const openColorPalette = (event, target) => {
    // Only open color palette on right-click (context menu)
    if (event.type !== 'contextmenu') {
      return;
    }
    
    // Don't open color palette if clicking on handles, controls, or other UI elements
    if (event.target.closest('.react-flow__handle') || 
        event.target.closest('.react-flow__resize-control') || 
        event.target.closest('.react-flow__controls') ||
        event.target.closest('.delete-button') ||
        event.target.closest('[title="Rotate"]')) {
      return;
    }
    
    event.preventDefault();
    event.stopPropagation();
    
    console.log('🎨 Opening color palette for:', target.id, 'type:', target.type);
    
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
    
    // Reset color target to 'stroke' when opening palette for a new target
    setColorTarget('stroke');
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

  const nodes = nodesFromStore;

  const [, drop] = useDrop(() => ({
    accept: 'shape',
    drop: (item, monitor) => {
      const { shape } = item;
      const offset = monitor.getClientOffset();
      const position = reactFlowInstance.screenToFlowPosition({
        x: offset.x,
        y: offset.y,
      });

      // Calculate proper dimensions based on shape's viewBox
      let nodeWidth = shape.width || 120;
      let nodeHeight = shape.height || 80;
      
      // If shape has a viewBox, use it to calculate proper dimensions
      if (shape.icon && shape.icon.viewBox) {
        const [x, y, width, height] = shape.icon.viewBox.split(/\s+|,/).map(Number);
        if (width && height) {
          // Maintain aspect ratio but ensure minimum size
          const aspectRatio = width / height;
          if (aspectRatio > 1) {
            nodeWidth = Math.max(120, width);
            nodeHeight = nodeWidth / aspectRatio;
          } else {
            nodeHeight = Math.max(80, height);
            nodeWidth = nodeHeight * aspectRatio;
          }
        }
      }
      
      const newNode = {
        id: uuidv4(),
        type: 'resizableNode',
        position,
        data: { 
          shapeId: shape.id, 
          shapeWidth: nodeWidth, 
          shapeHeight: nodeHeight,
          label: shape.name || 'Shape' // Set the shape name as the default label
        },
        style: {
          width: nodeWidth,
          height: nodeHeight,
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
      // console.log('=== CONNECTION ATTEMPT ===');
      // console.log('Connection params:', connection);
      // console.log('Current edges count:', edges.length);
      // console.log('Current nodes count:', nodesFromStore.length);
      
      // Validate connection
      if (!connection.source || !connection.target) {
        console.warn('❌ Invalid connection: missing source or target');
        return;
      }
      
      // Prevent self-connections
      if (connection.source === connection.target) {
        console.warn('❌ Self-connections are not allowed');
        return;
      }
      
      // Check if connection already exists (bidirectional check)
      const existingEdge = edges.find(edge => 
        (edge.source === connection.source && edge.target === connection.target) ||
        (edge.source === connection.target && edge.target === connection.source)
      );
      
      if (existingEdge) {
        console.warn('❌ Connection already exists:', existingEdge);
        return;
      }
      
      // Enhanced validation: check if connection points are valid for the shapes
      const sourceNode = nodesFromStore.find(n => n.id === connection.source);
      const targetNode = nodesFromStore.find(n => n.id === connection.target);
      
      if (!sourceNode || !targetNode) {
        console.warn('❌ Source or target node not found');
        console.log('Source node:', sourceNode);
        console.log('Target node:', targetNode);
        return;
      }
      
      console.log('✅ Source node found:', sourceNode.id);
      console.log('✅ Target node found:', targetNode.id);
      
      // Clean both source and target handle IDs by removing '-target' suffix
      const cleanSourceHandleId = connection.sourceHandle?.endsWith('-target') 
                                 ? connection.sourceHandle.replace('-target', '') 
                                 : connection.sourceHandle;
      const cleanTargetHandleId = connection.targetHandle?.endsWith('-target') 
                                 ? connection.targetHandle.replace('-target', '') 
                                 : connection.targetHandle;
      
      // Validate connection handle IDs if provided
      if (connection.sourceHandle && connection.targetHandle) {
        // Use the same logic as ResizableNode to get handles
        const getNodeHandles = (nodeData) => {
            // Get the full shape data using shapeId
  const shape = nodeData?.shapeId ? shapes.find(s => s.id === nodeData.shapeId) : null;
          
          if (shape && typeof shape.getHandles === 'function') {
            return shape.getHandles();
          } else if (shape && Array.isArray(shape.anchors) && shape.icon?.viewBox) {
            // Fallback to anchors if getHandles is not available
            const [vbX, vbY, vbW, vbH] = shape.icon.viewBox.split(/\s+|,/).map(Number);
            return shape.anchors.map((pt, idx) => {
              const left = ((pt.x - vbX) / vbW) * 100;
              const top = ((pt.y - vbY) / vbH) * 100;
              
              let position = Position.Top;
              if (top > 80) position = Position.Bottom;
              else if (top < 20) position = Position.Top;
              else if (left > 80) position = Position.Right;
              else if (left < 20) position = Position.Left;
              
              return {
                id: `anchor-${idx}`,
                position: position,
                style: {
                  position: 'absolute',
                  left: `${left}%`,
                  top: `${top}%`,
                  transform: 'translate(-50%, -50%)',
                },
                anchorIndex: idx,
                direction: position,
              };
            });
          } else {
            // Default connection handles for any shape
            return [
              { id: 'top', position: Position.Top, style: { top: '0%', left: '50%', transform: 'translate(-50%, 0%)' }, direction: 'top' },
              { id: 'bottom', position: Position.Bottom, style: { top: '100%', left: '50%', transform: 'translate(-50%, -100%)' }, direction: 'bottom' },
              { id: 'left', position: Position.Left, style: { top: '50%', left: '0%', transform: 'translate(0%, -50%)' }, direction: 'left' },
              { id: 'right', position: Position.Right, style: { top: '50%', left: '100%', transform: 'translate(-100%, -50%)' }, direction: 'right' },
            ];
          }
        };
        
        const sourceHandles = getNodeHandles(sourceNode.data);
        const targetHandles = getNodeHandles(targetNode.data);
        
        // Check for handle IDs - handles are created as both source and target types
        const sourceHandleExists = sourceHandles.some(h => 
          h.id === cleanSourceHandleId
        );
        const targetHandleExists = targetHandles.some(h => 
          h.id === cleanTargetHandleId
        );
        
        if (!sourceHandleExists || !targetHandleExists) {
          console.warn('❌ Invalid connection handles:', { 
            sourceHandle: connection.sourceHandle, 
            targetHandle: connection.targetHandle,
            cleanSourceHandleId,
            cleanTargetHandleId,
            sourceHandles: sourceHandles.map(h => h.id),
            targetHandles: targetHandles.map(h => h.id),
            sourceNode: sourceNode.id,
            targetNode: targetNode.id,
            sourceNodeShape: sourceNode.data?.shapeId,
            targetNodeShape: targetNode.data?.shapeId
          });
          
          // Try to create connection with default handles if specific handles don't exist
          if (!sourceHandleExists) {
            console.log('🔄 Attempting to use default source handle');
            cleanSourceHandleId = 'top'; // Default to top handle
          }
          if (!targetHandleExists) {
            console.log('🔄 Attempting to use default target handle');
            cleanTargetHandleId = 'bottom'; // Default to bottom handle
          }
          
          // Check again with default handles
          const sourceHandleExistsDefault = sourceHandles.some(h => h.id === cleanSourceHandleId);
          const targetHandleExistsDefault = targetHandles.some(h => h.id === cleanTargetHandleId);
          
          if (!sourceHandleExistsDefault || !targetHandleExistsDefault) {
            console.error('❌ Connection failed even with default handles');
            return;
          }
        }
        
        console.log('✅ Connection handles validated');
      }
      
                          // Create the new edge with enhanced data
                    const newEdge = {
                      id: `edge-${connection.source}-${connection.target}-${Date.now()}`, // Ensure unique ID
                      source: connection.source,
                      target: connection.target,
                      type: 'custom',
                      // Use cleaned handle IDs
                      sourceHandle: cleanSourceHandleId,
                      targetHandle: cleanTargetHandleId,
                      markerEnd: { 
                        type: MarkerType.ArrowClosed,
                        width: 20,
                        height: 20,
                        color: '#1970fc',
                      },
                      data: { 
                        label: '', 
                        labelColor: '#000000',
                        sourceHandle: cleanSourceHandleId,
                        targetHandle: cleanTargetHandleId,
                        connectionType: 'shape-to-shape'
                      },
                      style: {
                        stroke: '#1970fc',
                        strokeWidth: 2,
                        strokeLinecap: 'round',
                        strokeLinejoin: 'round',
                      }
                    };
      
      console.log('🔗 Creating edge with handles:', { 
        sourceHandle: cleanSourceHandleId, 
        targetHandle: cleanTargetHandleId,
        edgeData: newEdge.data 
      });
      
      console.log('✅ Creating new edge:', newEdge);
      // Use addEdge utility to ensure proper edge structure, then dispatch to Redux
      const newEdges = addEdge(newEdge, edges);
      console.log('✅ New edges array length:', newEdges.length);
      dispatch(setEdges(newEdges));
      
      // Provide user feedback
      console.log('✅ Connection created successfully!');
      console.log('=== END CONNECTION ATTEMPT ===');
    },
    [dispatch, edges, nodesFromStore]
  );

  const onKeyDown = useCallback(
    (event) => {
      // Prevent actions if focus is on an input or textarea (e.g., editing label)
      const tag = event.target.tagName.toLowerCase();
      if ((tag === 'input' || tag === 'textarea')) {
        return;
      }
      
      // Undo/Redo shortcuts
      if (event.ctrlKey || event.metaKey) {
        if (event.key === 'z' && !event.shiftKey) {
          event.preventDefault();
          console.log('⌨️ Ctrl+Z pressed - canUndo:', canUndo);
          if (canUndo) {
            dispatch(ActionCreators.undo());
          }
          return;
        }
        if ((event.key === 'z' && event.shiftKey) || event.key === 'y') {
          event.preventDefault();
          console.log('⌨️ Ctrl+Shift+Z or Ctrl+Y pressed - canRedo:', canRedo);
          if (canRedo) {
            dispatch(ActionCreators.redo());
          }
          return;
        }
      }
      
      // Delete selected nodes/edges
      if (event.key === 'Delete' || event.key === 'Backspace') {
        event.preventDefault();
        event.stopPropagation();
        
        const selectedNodes = nodes.filter((node) => node.selected).map((node) => node.id);
        const selectedEdges = edges.filter((edge) => edge.selected).map((edge) => edge.id);

        // console.log('Deleting:', { selectedNodes, selectedEdges });

        // Clear any editing states first
        if (editingEdgeId) {
          dispatch(setEditingEdgeId(null));
        }

        // Delete nodes first (this will also remove connected edges)
        selectedNodes.forEach(nodeId => {
          // console.log('Deleting node:', nodeId);
          dispatch(deleteNode(nodeId));
        });
        
        // Delete remaining selected edges
        selectedEdges.forEach(edgeId => {
          // console.log('Deleting edge:', edgeId);
          dispatch(deleteEdge(edgeId));
        });
        
        return;
      }

      // Select all nodes (Ctrl+A)
      if ((event.ctrlKey || event.metaKey) && event.key === 'a') {
        event.preventDefault();
        const updatedNodes = nodes.map(node => ({ ...node, selected: true }));
        const updatedEdges = edges.map(edge => ({ ...edge, selected: true }));
        dispatch(setNodes(updatedNodes));
        dispatch(setEdges(updatedEdges));
        return;
      }

      // Deselect all (Escape)
      if (event.key === 'Escape') {
        event.preventDefault();
        // Clear editing states
        if (editingEdgeId) {
          dispatch(setEditingEdgeId(null));
        }
        // Deselect all nodes and edges
        const updatedNodes = nodes.map(node => ({ ...node, selected: false }));
        const updatedEdges = edges.map(edge => ({ ...edge, selected: false }));
        dispatch(setNodes(updatedNodes));
        dispatch(setEdges(updatedEdges));
        return;
      }
    },
    [dispatch, nodes, edges, canUndo, canRedo, editingEdgeId]
  );

  const exportRef = useRef(null);
  const watermarkRef = useRef(null);

  const exportImage = useCallback(() => {
    if (!exportRef.current) {
      console.error('Export ref not available');
      return;
    }
    
    console.log('🚀 Starting export process...');
    
    // Show watermark before export
    if (watermarkRef.current) {
      console.log('📝 Making watermark visible...');
      watermarkRef.current.style.display = 'flex';
      watermarkRef.current.style.opacity = '1';
    } else {
      console.error('❌ Watermark ref not available');
    }
    
    // Longer delay to ensure watermark is fully visible and rendered
    setTimeout(() => {
      console.log('📸 Capturing PNG...');
      // Use the exportRef for PNG export
      toPng(exportRef.current, {
        quality: 1.0,
        backgroundColor: '#374151', // Match the canvas background color
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left',
        },
        filter: (node) => {
          // Include all nodes in the export
          return true;
        }
      }).then((dataUrl) => {
        console.log('✅ PNG captured successfully');
        const link = document.createElement('a');
        link.download = 'diagram.png';
        link.href = dataUrl;
        link.click();
        
        // Hide watermark after export
        if (watermarkRef.current) {
          console.log('🙈 Hiding watermark...');
          watermarkRef.current.style.display = 'none';
          watermarkRef.current.style.opacity = '0';
        }
      }).catch((error) => {
        console.error('❌ Error exporting image:', error);
        // Hide watermark on error
        if (watermarkRef.current) {
          watermarkRef.current.style.display = 'none';
          watermarkRef.current.style.opacity = '0';
        }
      });
    }, 200); // Increased delay to 200ms for better reliability
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
          
          // Handle legacy shape format and convert to shapeId
          if (node.shape && !nodeData.shapeId) {
            // If we have a legacy shape object, try to find a matching shape by name
            const shapeName = node.shape.name || 'rectangle';
            const matchingShape = shapes.find(s => s.name === shapeName);
            if (matchingShape) {
              nodeData.shapeId = matchingShape.id;
              nodeData.shapeWidth = node.shape.width || matchingShape.width;
              nodeData.shapeHeight = node.shape.height || matchingShape.height;
            }
          }
          
          // Ensure shapeId exists (default to rectangle)
          if (!nodeData.shapeId) {
            const defaultShape = shapes.find(s => s.name === 'rectangle') || shapes[0];
            nodeData.shapeId = defaultShape?.id || 'rectangle';
            nodeData.shapeWidth = nodeData.shapeWidth || 120;
            nodeData.shapeHeight = nodeData.shapeHeight || 80;
          }
          
          // Get the shape name for the label if it's missing
          const shape = shapes.find(s => s.id === nodeData.shapeId);
          const shapeName = shape?.name || 'Shape';
          
          const processedNode = {
            ...node,
            id: node.id || `node-${Math.random().toString(36).substr(2, 9)}`,
            position: position,
            data: {
              label: nodeData.label || shapeName, // Use shape name as fallback label
              shapeId: nodeData.shapeId,
              shapeWidth: nodeData.shapeWidth,
              shapeHeight: nodeData.shapeHeight,
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



  // Connection state management - using proper ReactFlow events
  const handleConnectStart = useCallback((event, params) => {
    setIsConnecting(true);
    setConnectionSource(params.nodeId);
    
    // Highlight valid connection targets
    const sourceNode = nodesFromStore.find(n => n.id === params.nodeId);
    if (sourceNode) {
      const validTargets = nodesFromStore.filter(node => {
        if (node.id === params.nodeId) return false; // Can't connect to self
        
        // Check if connection already exists
        const existingEdge = edges.find(edge => 
          (edge.source === params.nodeId && edge.target === node.id) ||
          (edge.source === node.id && edge.target === params.nodeId)
        );
        
        return !existingEdge;
      });
      
      // Store valid targets for potential use
      const validTargetIds = validTargets.map(n => n.id);
      
      // Add visual class to valid targets
      validTargets.forEach(node => {
        const nodeElement = document.querySelector(`[data-id="${node.id}"]`);
        if (nodeElement) {
          nodeElement.classList.add('valid-connection-target');
        }
      });
    }
  }, [nodesFromStore, edges]);

  const handleConnectEnd = useCallback(() => {
    setIsConnecting(false);
    setConnectionSource(null);
    
    // Remove visual classes
    document.querySelectorAll('.valid-connection-target').forEach(element => {
      element.classList.remove('valid-connection-target');
    });
  }, []);

  return (
    <div 
      ref={drop} 
      className="w-full h-full" 
      style={{ pointerEvents: 'auto', position: 'relative' }} 
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
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)', 
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
        {/* Watermark for export - placed INSIDE export area */}
        <div
          ref={watermarkRef}
          style={{
            position: 'absolute',
            left: 24,
            bottom: 24,
            display: 'none', // Start with display none instead of visibility hidden
            alignItems: 'center',
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)',
            borderRadius: 16,
            padding: '12px 16px',
            fontSize: 16,
            zIndex: 9999, // Very high z-index to ensure it's on top
            pointerEvents: 'none',
            userSelect: 'none',
            gap: 12,
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15), 0 8px 16px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            backdropFilter: 'blur(20px) saturate(180%)',
            minWidth: '200px',
            transform: 'translateZ(0)', // Force hardware acceleration
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          {/* Logo icon with modern styling */}
          <div style={{
            position: 'relative',
            width: 32,
            height: 32,
            borderRadius: 8,
            background: 'linear-gradient(135deg, #1970fc 0%, #3b82f6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(25, 112, 252, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
          }}>
            <img 
              src={hexBgImage} 
              alt="InnoTrat Labs" 
              style={{ 
                width: 20, 
                height: 20, 
                objectFit: 'contain',
                filter: 'brightness(0) invert(1)', // Make logo white
              }} 
            />
          </div>
          
          {/* Modern text layout */}
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 1,
            flex: 1,
          }}>
            <span style={{ 
              color: '#64748b', 
              fontWeight: 500, 
              fontSize: '11px',
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
              opacity: 0.8,
            }}>
              Made with
            </span>
            <span style={{ 
              color: '#1e293b', 
              fontWeight: 700, 
              fontSize: '16px', 
              lineHeight: 1.2,
              letterSpacing: '-0.025em',
            }}>
              InnoTrait Labs
            </span>
          </div>
          
          {/* Subtle accent line */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 2,
            background: 'linear-gradient(90deg, #1970fc 0%, #3b82f6 50%, #60a5fa 100%)',
            borderRadius: '16px 16px 0 0',
          }} />
        </div>
        

        
        <ReactFlow
          nodes={nodesFromStore}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onNodeContextMenu={openColorPalette}
          onEdgeContextMenu={openColorPalette}
          fitView
          attributionPosition="bottom-left"
          style={{ background: 'transparent' }}
          proOptions={{ hideAttribution: true }}
          connectionMode="loose"
          connectionLineType="bezier"
          snapToGrid={false}
          snapGrid={[15, 15]}
          isValidConnection={(connection) => {
            // Prevent self-connections
            if (connection.source === connection.target) {
              return false;
            }
            
            // Check if connection already exists (bidirectional check)
            const existingEdge = edges.find(edge => 
              (edge.source === connection.source && edge.target === connection.target) ||
              (edge.source === connection.target && edge.target === connection.source)
            );
            
            if (existingEdge) {
              return false;
            }
            
            // Only allow connections between valid nodes
            const sourceNode = nodesFromStore.find(n => n.id === connection.source);
            const targetNode = nodesFromStore.find(n => n.id === connection.target);
            
            if (!sourceNode || !targetNode) {
              return false;
            }
            
            return true;
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
            // Handle edge selection
            const updatedEdges = edges.map(e => ({
              ...e,
              selected: e.id === edge.id ? !e.selected : e.selected
            }));
            dispatch(setEdges(updatedEdges));
          }}
          onConnectStart={handleConnectStart}
          onConnectEnd={handleConnectEnd}
        />
      </div>
      
      {/* Controls and MiniMap (not exported) */}
      <Controls position="bottom-right" className="react-flow-controls" style={{ zIndex: 10 }} />
      <MiniMap position="bottom-left" pannable zoomable style={{ zIndex: 10 }} />
    </div>
  );
};

const DiagramEditor = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const dispatch = useDispatch();
  const canUndo = useSelector(selectCanUndo);
  const canRedo = useSelector(selectCanRedo);

  // Debug: Monitor undo/redo state
  useEffect(() => {
    console.log('🔄 Undo/Redo state changed:', { canUndo, canRedo });
    
    // Debug: Log current Redux state structure
    const currentState = store.getState();
    console.log('📊 Current Redux state:', {
      pastLength: currentState.flow.past?.length || 0,
      futureLength: currentState.flow.future?.length || 0,
      presentNodes: currentState.flow.present?.nodes?.length || 0,
      presentEdges: currentState.flow.present?.edges?.length || 0
    });
  }, [canUndo, canRedo]);

  // Debug: Monitor initial state loading
  useEffect(() => {
    console.log('🚀 DiagramEditor mounted - checking for persisted state...');
    const currentState = store.getState();
    const hasPersistedState = !!localStorage.getItem('innoide-flow-state');
    
    console.log('📊 Initial state on mount:', {
      pastLength: currentState.flow.past?.length || 0,
      futureLength: currentState.flow.future?.length || 0,
      presentNodes: currentState.flow.present?.nodes?.length || 0,
      presentEdges: currentState.flow.present?.edges?.length || 0,
      hasPersistedState
    });

    // Clear state on mount to ensure fresh start
    console.log('🗑️ Clearing state on mount for fresh start...');
    dispatch(clearPersistedState());
    dispatch(setNodes([]));
    dispatch(setEdges([]));
  }, [dispatch]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleUndo = () => {
    if (canUndo) {
      console.log('🔄 Undoing...', { canUndo, canRedo });
      try {
        dispatch(ActionCreators.undo());
        console.log('✅ Undo action dispatched successfully');
      } catch (error) {
        console.error('❌ Error dispatching undo action:', error);
      }
    } else {
      console.log('❌ Cannot undo - no history available');
    }
  };

  const handleRedo = () => {
    if (canRedo) {
      console.log('🔄 Redoing...', { canUndo, canRedo });
      try {
        dispatch(ActionCreators.redo());
        console.log('✅ Redo action dispatched successfully');
      } catch (error) {
        console.error('❌ Error dispatching redo action:', error);
      }
    } else {
      console.log('❌ Cannot redo - no future available');
    }
  };

  // Debug function to test undo/redo
  const testUndoRedo = () => {
    console.log('🧪 Testing undo/redo functionality...');
    // Add a test node
    dispatch(addNode({
      id: 'test-node',
      type: 'resizableNode',
      position: { x: 100, y: 100 },
      data: { 
        shapeId: 'flow-rectangle',
        label: 'Test Rectangle' // Add a proper label
      }
    }));
  };

  // Function to clear persisted state
  const handleClearPersistedState = () => {
    console.log('🗑️ Clearing persisted state...');
    dispatch(clearPersistedState());
    // Reload the page to reset to initial state
    window.location.reload();
  };

  // Function to manually save current state
  const handleSaveCurrentState = () => {
    console.log('💾 Manually saving current state...');
    const currentState = store.getState();
    const stateToSave = {
      flow: {
        past: currentState.flow.past,
        present: currentState.flow.present,
        future: currentState.flow.future
      }
    };
    
    try {
      localStorage.setItem('innoide-flow-state', JSON.stringify(stateToSave));
      console.log('✅ State saved successfully');
    } catch (error) {
      console.error('❌ Failed to save state:', error);
    }
  };

  // Function to clear canvas
  const handleClearCanvas = () => {
    console.log('🗑️ Clearing canvas...');
    // Clear all nodes and edges
    dispatch(setNodes([]));
    dispatch(setEdges([]));
    // Clear persisted state
    dispatch(clearPersistedState());
    console.log('✅ Canvas cleared successfully');
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="diagram-editor-route flex flex-col bg-gray-900">
        <DiagramHeader
          onZoomIn={() => window.dispatchEvent(new Event('zoom-in'))}
          onZoomOut={() => window.dispatchEvent(new Event('zoom-out'))}
          handleSave={() => window.dispatchEvent(new Event('save-json'))}
          handleExport={() => window.dispatchEvent(new Event('export-image'))}
          toggleSidebar={toggleSidebar}
          exportImage={() => window.dispatchEvent(new Event('export-image'))}
          handleUndo={handleUndo}
          handleRedo={handleRedo}
          canUndo={canUndo}
          canRedo={canRedo}
          testUndoRedo={testUndoRedo}
          handleClearPersistedState={handleClearPersistedState}
          handleSaveCurrentState={handleSaveCurrentState}
          handleClearCanvas={handleClearCanvas}
        />
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          {sidebarOpen && (
            <div className="w-64 flex-shrink-0 bg-gray-800 border-r border-gray-700">
              <DiagramSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
            </div>
          )}

          {/* Main Canvas Area */}
          <main className="flex-1 h-full relative bg-gray-900 min-w-0">
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