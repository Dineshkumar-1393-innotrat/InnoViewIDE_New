import React, { useCallback } from 'react';
import { ReactFlow, Background, Controls, applyNodeChanges, applyEdgeChanges } from 'reactflow';
import 'reactflow/dist/style.css';
import ResizableNode from './ResizableNode';
import CustomEdge from './CustomEdge';
import { useDispatch, useSelector } from 'react-redux';
import { addNode, setNodes, setEdges, addEdge } from '../features/flow/flowSlice';
import { selectNodes, selectEdges } from '../features/flow/flowSelectors';
import { shapeData } from '../shapes/shapeData';
import { v4 as uuidv4 } from 'uuid';
import { MarkerType } from 'reactflow';

const nodeTypes = {
  resizableNode: ResizableNode,
};

const edgeTypes = {
  custom: CustomEdge,
};

export default function ConnectionDemo() {
  const dispatch = useDispatch();
  const nodes = useSelector(selectNodes);
  const edges = useSelector(selectEdges);

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
      console.log('Connection Demo - Connection params:', connection);
      console.log('Connection Demo - Current edges:', edges);
      console.log('Connection Demo - Current nodes:', nodes);
      
      // Validate connection
      if (!connection.source || !connection.target) {
        console.warn('Invalid connection: missing source or target');
        return;
      }
      
      // Prevent self-connections
      if (connection.source === connection.target) {
        console.warn('Self-connections are not allowed');
        return;
      }
      
      // Check if connection already exists
      const existingEdge = edges.find(edge => 
        (edge.source === connection.source && edge.target === connection.target) ||
        (edge.source === connection.target && edge.target === connection.source)
      );
      
      if (existingEdge) {
        console.warn('Connection already exists:', existingEdge);
        return;
      }
      
      const newEdge = {
        ...connection,
        id: `edge-${connection.source}-${connection.target}-${Date.now()}`,
        type: 'custom',
        markerEnd: { 
          type: MarkerType.ArrowClosed,
          width: 20,
          height: 20,
          color: '#1970fc',
        },
        data: { 
          label: '', 
          labelColor: '#000000',
          sourceHandle: connection.sourceHandle,
          targetHandle: connection.targetHandle,
          connectionType: 'shape-to-shape'
        },
        style: {
          stroke: '#1970fc',
          strokeWidth: 2,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
        }
      };
      
      console.log('Connection Demo - Creating new edge:', newEdge);
      const newEdges = addEdge(newEdge, edges);
      console.log('Connection Demo - New edges array:', newEdges);
      dispatch(setEdges(newEdges));
      console.log('Connection Demo - Edge created successfully');
    },
    [dispatch, edges]
  );

  const addDemoNode = (shapeType, position) => {
    const shape = shapeData.Flowchart.find(s => s.id === shapeType);
    if (!shape) return;

    const newNode = {
      id: uuidv4(),
      type: 'resizableNode',
      position,
      data: { 
        shape,
        shapeId: shape.id,
        label: shape.name || 'Shape' // Set the shape name as the default label
      },
      style: {
        width: shape.icon.viewBox.split(' ')[2] || 120,
        height: shape.icon.viewBox.split(' ')[3] || 80,
        background: 'transparent',
      },
    };

    dispatch(addNode(newNode));
  };

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 10 }}>
        <h3>Connection Demo</h3>
        <p>Click and drag from connection handles (green dots) to create connections</p>
        <button onClick={() => addDemoNode('flow-rectangle', { x: 100, y: 100 })}>
          Add Rectangle
        </button>
        <button onClick={() => addDemoNode('flow-diamond', { x: 300, y: 100 })}>
          Add Diamond
        </button>
        <button onClick={() => addDemoNode('flow-circle', { x: 500, y: 100 })}>
          Add Circle
        </button>
      </div>
      
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        connectionMode="loose"
        connectionLineType="bezier"
        isValidConnection={(connection) => {
          if (connection.source === connection.target) return false;
          
          const existingEdge = edges.find(edge => 
            (edge.source === connection.source && edge.target === connection.target) ||
            (edge.source === connection.target && edge.target === connection.source)
          );
          
          return !existingEdge;
        }}
      >
        <Background variant="dots" gap={12} size={1.5} color="#a5d8ff" />
        <Controls />
      </ReactFlow>
    </div>
  );
} 