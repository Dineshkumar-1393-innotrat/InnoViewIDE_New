import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ReactFlow, {
  Background,
  Controls,
  ControlButton,
  MiniMap,
  Handle,
  Position,
  useNodesState,
  useEdgesState,
  addEdge,
  ConnectionLineType,
  MarkerType,
  ReactFlowProvider,
  useReactFlow,
  BaseEdge,
  EdgeLabelRenderer,
  getSmoothStepPath,
  ConnectionMode,
} from 'reactflow';
import { NodeResizer } from '@reactflow/node-resizer';
import { toPng } from 'html-to-image';
import 'reactflow/dist/style.css';
import '@reactflow/node-resizer/dist/style.css';
import './BlockDiagramTest.css';
import FileExplorer from './FileExplorer';
import EnhancedFileExplorer from './EnhancedFileExplorer';
import ProjectFileExplorer from './ProjectFileExplorer';
import CreateProjectIntegration from './CreateProjectIntegration';
import './FileExplorer.css';
import EditorNavbar from './EditorNavbar';
import DiagramTabs from './DiagramTabs';
import { saveAssetToScreenFolder } from '../utils/screenFileManager';
import { useAutoSaveTabs } from '../hooks/useAutoSaveTabs';
import { canvasIntegration, ReactFlowCanvasHandler } from '../utils/canvasIntegration';
import { Settings, ArrowLeftRight, RotateCcw, RotateCw } from 'lucide-react';
import hexBg from '../assets/hex_bg.png';
import { useProject } from '../ProjectContext';
import PropertiesPanel from './PropertiesPanel';
import { saveProjectFile, sanitizeSegment, ensureProjectFolder } from '../utils/workspaceStorage';
import { projectManager } from '../utils/projectManager';
import projectFileManager from '../utils/projectFileManager';
import { useCanvasFileIntegration } from '../hooks/useCanvasFileIntegration';
import { WorkspaceTabsProvider, useWorkspaceTabs } from '../hooks/useWorkspaceTabs';
import DefineProductButton from './shared/DefineProductButton';
import { useNavigate } from 'react-router-dom';

// Simple id helpers
let nodeId = 1;
const getId = () => `n_${nodeId++}`;

const createBlockDiagramState = () => ({
  nodes: [],
  edges: [],
  viewport: null,
});

// Shared node base styles
const baseNodeStyles = (data) => ({
  width: '100%',
  height: '100%',
  color: data?.text || '#000000',
  transform: `rotate(${data?.rotation || 0}deg)`,
  transformOrigin: 'center center',
});

// Process (rectangle)
function ProcessNode({ id, data, selected }) {
  const rf = useReactFlow();
  const [val, setVal] = useState(data?.label ?? 'Text');
  const commit = (next) => {
    rf.setNodes((nds) => nds.map((n) => (n.id === id ? { ...n, data: { ...n.data, label: next, editing: false } } : n)));
    window.dispatchEvent(new Event('rf-change'));
  };

  return (
    <div
      style={{
        ...baseNodeStyles(data),
        background: data?.fill || '#ffffff',
        border: `${data?.strokeWidth ?? 2}px solid ${data?.stroke || '#000000'}`,
        borderRadius: 6,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 6,
        boxSizing: 'border-box',
      }}
      onDoubleClick={() => rf.setNodes((nds) => nds.map((n) => (n.id === id ? { ...n, data: { ...n.data, editing: true } } : n)))}
    >
      <NodeResizer isVisible={selected} minWidth={80} minHeight={40} color={data?.stroke || '#000'} />
      <Handle id="top-in" type="target" position={Position.Top} />
      <Handle id="right-in" type="target" position={Position.Right} />
      <Handle id="bottom-in" type="target" position={Position.Bottom} />
      <Handle id="left-in" type="target" position={Position.Left} />
      <Handle id="top-out" type="source" position={Position.Top} />
      <Handle id="right-out" type="source" position={Position.Right} />
      <Handle id="bottom-out" type="source" position={Position.Bottom} />
      <Handle id="left-out" type="source" position={Position.Left} />
      {data?.editing ? (
        <input
          className="nodrag nopan nowheel"
          autoFocus
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onBlur={() => commit(val)}
          onKeyDown={(e) => e.key === 'Enter' && commit(val)}
          onMouseDown={(e) => e.stopPropagation()}
          onDoubleClick={(e) => e.stopPropagation()}
          style={{
            width: '100%',
            border: '1px solid #ccc',
            borderRadius: 4,
            padding: '4px 6px',
            fontSize: 12,
            position: 'relative',
            zIndex: 5,
            background: '#fff',
            pointerEvents: 'all',
          }}
        />
      ) : (
        <span style={{ color: data?.text || '#000', fontSize: data?.fontSize || 12, textAlign: 'center' }}>{data?.label ?? 'Text'}</span>
      )}
    </div>
  );
}

// Decision (diamond)
function DecisionNode({ id, data, selected }) {
  const rf = useReactFlow();
  const [val, setVal] = useState(data?.label ?? 'Text');
  const commit = (next) => {
    rf.setNodes((nds) => nds.map((n) => (n.id === id ? { ...n, data: { ...n.data, label: next, editing: false } } : n)));
    window.dispatchEvent(new Event('rf-change'));
  };
  const fill = data?.fill || '#ffffff';
  const stroke = data?.stroke || '#000000';
  const sw = data?.strokeWidth ?? 2;

  return (
    <div
      style={{ ...baseNodeStyles(data), position: 'relative' }}
      onDoubleClick={() => rf.setNodes((nds) => nds.map((n) => (n.id === id ? { ...n, data: { ...n.data, editing: true } } : n)))}
    >
      <NodeResizer isVisible={selected} minWidth={80} minHeight={80} color={data?.stroke || '#000'} />
      {/* Diamond shape filling the bounds so handles align to side midpoints */}
      <svg viewBox="0 0 160 80" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0 }}>
        <polygon points="80,0 160,40 80,80 0,40" fill={fill} stroke={stroke} strokeWidth={sw} />
      </svg>
      {/* Label overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 6,
          textAlign: 'center',
          pointerEvents: 'none',
        }}
      >
        {data?.editing ? (
          <input
            className="nodrag nopan nowheel"
            autoFocus
            value={val}
            onChange={(e) => setVal(e.target.value)}
            onBlur={() => commit(val)}
            onKeyDown={(e) => e.key === 'Enter' && commit(val)}
            onMouseDown={(e) => e.stopPropagation()}
            onDoubleClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              border: '1px solid #ccc',
              borderRadius: 4,
              padding: '4px 6px',
              fontSize: 12,
              position: 'relative',
              zIndex: 5,
              background: '#fff',
              pointerEvents: 'all',
            }}
          />
        ) : (
          <span style={{ color: data?.text || '#000', fontSize: data?.fontSize || 12 }}>{data?.label ?? 'Text'}</span>
        )}
      </div>
      <Handle id="top-in" type="target" position={Position.Top} />
      <Handle id="right-in" type="target" position={Position.Right} />
      <Handle id="bottom-in" type="target" position={Position.Bottom} />
      <Handle id="left-in" type="target" position={Position.Left} />
      <Handle id="top-out" type="source" position={Position.Top} />
      <Handle id="right-out" type="source" position={Position.Right} />
      <Handle id="bottom-out" type="source" position={Position.Bottom} />
      <Handle id="left-out" type="source" position={Position.Left} />
    </div>
  );
}

// Terminator (rounded rectangle)
function TerminatorNode({ id, data, selected }) {
  const rf = useReactFlow();
  const [val, setVal] = useState(data?.label ?? 'Text');
  const commit = (next) => {
    rf.setNodes((nds) => nds.map((n) => (n.id === id ? { ...n, data: { ...n.data, label: next, editing: false } } : n)));
    window.dispatchEvent(new Event('rf-change'));
  };

  return (
    <div
      style={{
        ...baseNodeStyles(data),
        background: data?.fill || '#ffffff',
        border: `${data?.strokeWidth ?? 2}px solid ${data?.stroke || '#000000'}`,
        borderRadius: 24,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 6,
        boxSizing: 'border-box',
      }}
      onDoubleClick={() => rf.setNodes((nds) => nds.map((n) => (n.id === id ? { ...n, data: { ...n.data, editing: true } } : n)))}
    >
      <NodeResizer isVisible={selected} minWidth={80} minHeight={40} color={data?.stroke || '#000'} />
      <Handle id="top-in" type="target" position={Position.Top} />
      <Handle id="right-in" type="target" position={Position.Right} />
      <Handle id="bottom-in" type="target" position={Position.Bottom} />
      <Handle id="left-in" type="target" position={Position.Left} />
      <Handle id="top-out" type="source" position={Position.Top} />
      <Handle id="right-out" type="source" position={Position.Right} />
      <Handle id="bottom-out" type="source" position={Position.Bottom} />
      <Handle id="left-out" type="source" position={Position.Left} />
      {data?.editing ? (
        <input
          className="nodrag nopan nowheel"
          autoFocus
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onBlur={() => commit(val)}
          onKeyDown={(e) => e.key === 'Enter' && commit(val)}
          onMouseDown={(e) => e.stopPropagation()}
          onDoubleClick={(e) => e.stopPropagation()}
          style={{
            width: '100%',
            border: '1px solid #ccc',
            borderRadius: 4,
            padding: '4px 6px',
            fontSize: 12,
            position: 'relative',
            zIndex: 5,
            background: '#fff',
            pointerEvents: 'all',
          }}
        />
      ) : (
        <span style={{ color: data?.text || '#000', fontSize: data?.fontSize || 12, textAlign: 'center' }}>{data?.label ?? 'Text'}</span>
      )}
    </div>
  );
}

// Text Node
function TextNode({ id, data, selected }) {
  const rf = useReactFlow();
  const [val, setVal] = useState(data?.label ?? 'Text');
  const commit = (next) => {
    rf.setNodes((nds) => nds.map((n) => (n.id === id ? { ...n, data: { ...n.data, label: next, editing: false } } : n)));
    window.dispatchEvent(new Event('rf-change'));
  };

  return (
    <div
      style={{
        ...baseNodeStyles(data),
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 6,
        boxSizing: 'border-box',
        background: 'transparent',
        border: 'none',
        minWidth: 50,
        minHeight: 20,
      }}
      onDoubleClick={() => rf.setNodes((nds) => nds.map((n) => (n.id === id ? { ...n, data: { ...n.data, editing: true } } : n)))}
    >
      <NodeResizer isVisible={selected} minWidth={50} minHeight={20} color="#999" />
      {data?.editing ? (
        <input
          className="nodrag nopan nowheel"
          autoFocus
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onBlur={() => commit(val)}
          onKeyDown={(e) => e.key === 'Enter' && commit(val)}
          onMouseDown={(e) => e.stopPropagation()}
          onDoubleClick={(e) => e.stopPropagation()}
          style={{
            width: '100%',
            border: '1px solid #ccc',
            borderRadius: 4,
            padding: '4px 6px',
            fontSize: data?.fontSize || 14,
            position: 'relative',
            zIndex: 5,
            background: '#fff',
            pointerEvents: 'all',
            color: data?.text || '#000',
          }}
        />
      ) : (
        <span style={{ 
          color: data?.text || '#000', 
          fontSize: data?.fontSize || 14, 
          fontWeight: data?.fontWeight || 'normal',
          textAlign: 'center',
          lineHeight: 1.2
        }}>
          {data?.label ?? 'Text'}
        </span>
      )}
    </div>
  );
}

// Ellipse Node
function EllipseNode({ id, data, selected }) {
  const rf = useReactFlow();
  const [val, setVal] = useState(data?.label ?? 'Text');
  const commit = (next) => {
    rf.setNodes((nds) => nds.map((n) => (n.id === id ? { ...n, data: { ...n.data, label: next, editing: false } } : n)));
    window.dispatchEvent(new Event('rf-change'));
  };

  return (
    <div
      style={{ ...baseNodeStyles(data), position: 'relative' }}
      onDoubleClick={() => rf.setNodes((nds) => nds.map((n) => (n.id === id ? { ...n, data: { ...n.data, editing: true } } : n)))}
    >
      <NodeResizer isVisible={selected} minWidth={80} minHeight={60} color={data?.stroke || '#000'} />
      <svg viewBox="0 0 160 80" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0 }}>
        <ellipse 
          cx="80" 
          cy="40" 
          rx="75" 
          ry="35" 
          fill={data?.fill || '#ffffff'} 
          stroke={data?.stroke || '#000000'} 
          strokeWidth={data?.strokeWidth ?? 2} 
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 6,
          textAlign: 'center',
          pointerEvents: 'none',
        }}
      >
        {data?.editing ? (
          <input
            className="nodrag nopan nowheel"
            autoFocus
            value={val}
            onChange={(e) => setVal(e.target.value)}
            onBlur={() => commit(val)}
            onKeyDown={(e) => e.key === 'Enter' && commit(val)}
            onMouseDown={(e) => e.stopPropagation()}
            onDoubleClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              border: '1px solid #ccc',
              borderRadius: 4,
              padding: '4px 6px',
              fontSize: 12,
              position: 'relative',
              zIndex: 5,
              background: '#fff',
              pointerEvents: 'all',
            }}
          />
        ) : (
          <span style={{ color: data?.text || '#000', fontSize: data?.fontSize || 12 }}>{data?.label ?? 'Text'}</span>
        )}
      </div>
      <Handle id="top-in" type="target" position={Position.Top} />
      <Handle id="right-in" type="target" position={Position.Right} />
      <Handle id="bottom-in" type="target" position={Position.Bottom} />
      <Handle id="left-in" type="target" position={Position.Left} />
      <Handle id="top-out" type="source" position={Position.Top} />
      <Handle id="right-out" type="source" position={Position.Right} />
      <Handle id="bottom-out" type="source" position={Position.Bottom} />
      <Handle id="left-out" type="source" position={Position.Left} />
    </div>
  );
}

// Database Node
function DatabaseNode({ id, data, selected }) {
  const rf = useReactFlow();
  const [val, setVal] = useState(data?.label ?? 'Database');
  const commit = (next) => {
    rf.setNodes((nds) => nds.map((n) => (n.id === id ? { ...n, data: { ...n.data, label: next, editing: false } } : n)));
    window.dispatchEvent(new Event('rf-change'));
  };

  return (
    <div
      style={{ ...baseNodeStyles(data), position: 'relative' }}
      onDoubleClick={() => rf.setNodes((nds) => nds.map((n) => (n.id === id ? { ...n, data: { ...n.data, editing: true } } : n)))}
    >
      <NodeResizer isVisible={selected} minWidth={80} minHeight={80} color={data?.stroke || '#000'} />
      <svg viewBox="0 0 160 80" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0 }}>
        <ellipse cx="80" cy="15" rx="70" ry="12" fill={data?.fill || '#ffffff'} stroke={data?.stroke || '#000000'} strokeWidth={data?.strokeWidth ?? 2} />
        <rect x="10" y="15" width="140" height="50" fill={data?.fill || '#ffffff'} stroke="none" />
        <line x1="10" y1="15" x2="10" y2="65" stroke={data?.stroke || '#000000'} strokeWidth={data?.strokeWidth ?? 2} />
        <line x1="150" y1="15" x2="150" y2="65" stroke={data?.stroke || '#000000'} strokeWidth={data?.strokeWidth ?? 2} />
        <ellipse cx="80" cy="65" rx="70" ry="12" fill="none" stroke={data?.stroke || '#000000'} strokeWidth={data?.strokeWidth ?? 2} />
      </svg>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 6,
          textAlign: 'center',
          pointerEvents: 'none',
        }}
      >
        {data?.editing ? (
          <input
            className="nodrag nopan nowheel"
            autoFocus
            value={val}
            onChange={(e) => setVal(e.target.value)}
            onBlur={() => commit(val)}
            onKeyDown={(e) => e.key === 'Enter' && commit(val)}
            onMouseDown={(e) => e.stopPropagation()}
            onDoubleClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              border: '1px solid #ccc',
              borderRadius: 4,
              padding: '4px 6px',
              fontSize: 12,
              position: 'relative',
              zIndex: 5,
              background: '#fff',
              pointerEvents: 'all',
            }}
          />
        ) : (
          <span style={{ color: data?.text || '#000', fontSize: data?.fontSize || 12 }}>{data?.label ?? 'Database'}</span>
        )}
      </div>
      <Handle id="top-in" type="target" position={Position.Top} />
      <Handle id="right-in" type="target" position={Position.Right} />
      <Handle id="bottom-in" type="target" position={Position.Bottom} />
      <Handle id="left-in" type="target" position={Position.Left} />
      <Handle id="top-out" type="source" position={Position.Top} />
      <Handle id="right-out" type="source" position={Position.Right} />
      <Handle id="bottom-out" type="source" position={Position.Bottom} />
      <Handle id="left-out" type="source" position={Position.Left} />
    </div>
  );
}

function DataNode({ id, data, selected }) {
  const rf = useReactFlow();
  const [val, setVal] = useState(data?.label ?? 'Data');
  const commit = (next) => {
    rf.setNodes((nds) => nds.map((n) => (n.id === id ? { ...n, data: { ...n.data, label: next, editing: false } } : n)));
    window.dispatchEvent(new Event('rf-change'));
  };

  const fill = data?.fill || '#ffffff';
  const stripe = data?.stripeColor || '#dbeafe';

  return (
    <div
      style={{
        ...baseNodeStyles(data),
        background: `repeating-linear-gradient(180deg, ${fill}, ${fill} 16px, ${stripe} 16px, ${stripe} 20px)`,
        border: `${data?.strokeWidth ?? 2}px solid ${data?.stroke || '#000000'}`,
        borderRadius: 6,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 6,
        boxSizing: 'border-box',
      }}
      onDoubleClick={() => rf.setNodes((nds) => nds.map((n) => (n.id === id ? { ...n, data: { ...n.data, editing: true } } : n)))}
    >
      <NodeResizer isVisible={selected} minWidth={100} minHeight={60} color={data?.stroke || '#000'} />
      <Handle id="top-in" type="target" position={Position.Top} />
      <Handle id="right-in" type="target" position={Position.Right} />
      <Handle id="bottom-in" type="target" position={Position.Bottom} />
      <Handle id="left-in" type="target" position={Position.Left} />
      <Handle id="top-out" type="source" position={Position.Top} />
      <Handle id="right-out" type="source" position={Position.Right} />
      <Handle id="bottom-out" type="source" position={Position.Bottom} />
      <Handle id="left-out" type="source" position={Position.Left} />
      {data?.editing ? (
        <input
          className="nodrag nopan nowheel"
          autoFocus
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onBlur={() => commit(val)}
          onKeyDown={(e) => e.key === 'Enter' && commit(val)}
          onMouseDown={(e) => e.stopPropagation()}
          onDoubleClick={(e) => e.stopPropagation()}
          style={{
            width: '100%',
            border: '1px solid #ccc',
            borderRadius: 4,
            padding: '4px 6px',
            fontSize: data?.fontSize || 12,
            position: 'relative',
            zIndex: 5,
            background: '#fff',
            pointerEvents: 'all',
          }}
        />
      ) : (
        <span style={{ color: data?.text || '#000', fontSize: data?.fontSize || 12, textAlign: 'center' }}>{data?.label ?? 'Data'}</span>
      )}
    </div>
  );
}

function DelayNode({ id, data, selected }) {
  const rf = useReactFlow();
  const [val, setVal] = useState(data?.label ?? 'Delay');
  const commit = (next) => {
    rf.setNodes((nds) => nds.map((n) => (n.id === id ? { ...n, data: { ...n.data, label: next, editing: false } } : n)));
    window.dispatchEvent(new Event('rf-change'));
  };

  return (
    <div
      style={{
        ...baseNodeStyles(data),
        background: data?.fill || '#ffffff',
        border: `${data?.strokeWidth ?? 2}px solid ${data?.stroke || '#000000'}`,
        borderRadius: '12px 40px 40px 12px',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 6,
        boxSizing: 'border-box',
      }}
      onDoubleClick={() => rf.setNodes((nds) => nds.map((n) => (n.id === id ? { ...n, data: { ...n.data, editing: true } } : n)))}
    >
      <NodeResizer isVisible={selected} minWidth={120} minHeight={60} color={data?.stroke || '#000'} />
      <Handle id="top-in" type="target" position={Position.Top} />
      <Handle id="right-in" type="target" position={Position.Right} />
      <Handle id="bottom-in" type="target" position={Position.Bottom} />
      <Handle id="left-in" type="target" position={Position.Left} />
      <Handle id="top-out" type="source" position={Position.Top} />
      <Handle id="right-out" type="source" position={Position.Right} />
      <Handle id="bottom-out" type="source" position={Position.Bottom} />
      <Handle id="left-out" type="source" position={Position.Left} />
      {data?.editing ? (
        <input
          className="nodrag nopan nowheel"
          autoFocus
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onBlur={() => commit(val)}
          onKeyDown={(e) => e.key === 'Enter' && commit(val)}
          onMouseDown={(e) => e.stopPropagation()}
          onDoubleClick={(e) => e.stopPropagation()}
          style={{
            width: '100%',
            border: '1px solid #ccc',
            borderRadius: 4,
            padding: '4px 6px',
            fontSize: data?.fontSize || 12,
            position: 'relative',
            zIndex: 5,
            background: '#fff',
            pointerEvents: 'all',
          }}
        />
      ) : (
        <span style={{ color: data?.text || '#000', fontSize: data?.fontSize || 12, textAlign: 'center' }}>{data?.label ?? 'Delay'}</span>
      )}
    </div>
  );
}

function ConnectorNode({ id, data, selected }) {
  const rf = useReactFlow();
  const [val, setVal] = useState(data?.label ?? 'Connector');
  const commit = (next) => {
    rf.setNodes((nds) => nds.map((n) => (n.id === id ? { ...n, data: { ...n.data, label: next, editing: false } } : n)));
    window.dispatchEvent(new Event('rf-change'));
  };

  return (
    <div
      style={{
        ...baseNodeStyles(data),
        background: data?.fill || '#ffffff',
        border: `${data?.strokeWidth ?? 2}px solid ${data?.stroke || '#000000'}`,
        borderRadius: '50%',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 6,
        boxSizing: 'border-box',
      }}
      onDoubleClick={() => rf.setNodes((nds) => nds.map((n) => (n.id === id ? { ...n, data: { ...n.data, editing: true } } : n)))}
    >
      <NodeResizer isVisible={selected} minWidth={70} minHeight={70} color={data?.stroke || '#000'} />
      <Handle id="top-in" type="target" position={Position.Top} />
      <Handle id="right-in" type="target" position={Position.Right} />
      <Handle id="bottom-in" type="target" position={Position.Bottom} />
      <Handle id="left-in" type="target" position={Position.Left} />
      <Handle id="top-out" type="source" position={Position.Top} />
      <Handle id="right-out" type="source" position={Position.Right} />
      <Handle id="bottom-out" type="source" position={Position.Bottom} />
      <Handle id="left-out" type="source" position={Position.Left} />
      {data?.editing ? (
        <input
          className="nodrag nopan nowheel"
          autoFocus
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onBlur={() => commit(val)}
          onKeyDown={(e) => e.key === 'Enter' && commit(val)}
          onMouseDown={(e) => e.stopPropagation()}
          onDoubleClick={(e) => e.stopPropagation()}
          style={{
            width: '80%',
            border: '1px solid #ccc',
            borderRadius: 4,
            padding: '4px 6px',
            fontSize: data?.fontSize || 12,
            position: 'relative',
            zIndex: 5,
            background: '#fff',
            pointerEvents: 'all',
            textAlign: 'center',
          }}
        />
      ) : (
        <span style={{ color: data?.text || '#000', fontSize: data?.fontSize || 12, textAlign: 'center' }}>{data?.label ?? 'Connector'}</span>
      )}
    </div>
  );
}

function SummingNode({ id, data, selected }) {
  const rf = useReactFlow();
  const [val, setVal] = useState(data?.label ?? 'Summing');
  const commit = (next) => {
    rf.setNodes((nds) => nds.map((n) => (n.id === id ? { ...n, data: { ...n.data, label: next, editing: false } } : n)));
    window.dispatchEvent(new Event('rf-change'));
  };

  return (
    <div
      style={{
        ...baseNodeStyles(data),
        background: data?.fill || '#ffffff',
        border: `${data?.strokeWidth ?? 2}px solid ${data?.stroke || '#000000'}`,
        borderRadius: '50%',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 6,
        boxSizing: 'border-box',
      }}
      onDoubleClick={() => rf.setNodes((nds) => nds.map((n) => (n.id === id ? { ...n, data: { ...n.data, editing: true } } : n)))}
    >
      <NodeResizer isVisible={selected} minWidth={90} minHeight={90} color={data?.stroke || '#000'} />
      <Handle id="top-in" type="target" position={Position.Top} />
      <Handle id="right-in" type="target" position={Position.Right} />
      <Handle id="bottom-in" type="target" position={Position.Bottom} />
      <Handle id="left-in" type="target" position={Position.Left} />
      <Handle id="top-out" type="source" position={Position.Top} />
      <Handle id="right-out" type="source" position={Position.Right} />
      <Handle id="bottom-out" type="source" position={Position.Bottom} />
      <Handle id="left-out" type="source" position={Position.Left} />
      {data?.editing ? (
        <input
          className="nodrag nopan nowheel"
          autoFocus
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onBlur={() => commit(val)}
          onKeyDown={(e) => e.key === 'Enter' && commit(val)}
          onMouseDown={(e) => e.stopPropagation()}
          onDoubleClick={(e) => e.stopPropagation()}
          style={{
            width: '80%',
            border: '1px solid #ccc',
            borderRadius: 4,
            padding: '4px 6px',
            fontSize: data?.fontSize || 12,
            position: 'relative',
            zIndex: 5,
            background: '#fff',
            pointerEvents: 'all',
            textAlign: 'center',
          }}
        />
      ) : (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
            color: data?.text || '#000',
            fontSize: data?.fontSize || 12,
          }}
        >
          <span style={{ fontSize: (data?.fontSize || 12) + 6, lineHeight: 1 }}>+</span>
          <span>{data?.label ?? 'Summing'}</span>
        </div>
      )}
    </div>
  );
}

function MicNode({ id, data, selected }) {
  const rf = useReactFlow();
  const [val, setVal] = useState(data?.label ?? 'Mic');
  const commit = (next) => {
    rf.setNodes((nds) => nds.map((n) => (n.id === id ? { ...n, data: { ...n.data, label: next, editing: false } } : n)));
    window.dispatchEvent(new Event('rf-change'));
  };

  const stroke = data?.stroke || '#0f172a';
  const fill = data?.fill || '#ffffff';

  return (
    <div
      style={{
        ...baseNodeStyles(data),
        background: fill,
        border: `${data?.strokeWidth ?? 2}px solid ${stroke}`,
        borderRadius: 16,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        position: 'relative',
        boxSizing: 'border-box',
        gap: 8,
      }}
      onDoubleClick={() => rf.setNodes((nds) => nds.map((n) => (n.id === id ? { ...n, data: { ...n.data, editing: true } } : n)))}
    >
      <NodeResizer isVisible={selected} minWidth={100} minHeight={120} color={stroke} />
      <Handle id="top-in" type="target" position={Position.Top} />
      <Handle id="right-in" type="target" position={Position.Right} />
      <Handle id="bottom-in" type="target" position={Position.Bottom} />
      <Handle id="left-in" type="target" position={Position.Left} />
      <Handle id="top-out" type="source" position={Position.Top} />
      <Handle id="right-out" type="source" position={Position.Right} />
      <Handle id="bottom-out" type="source" position={Position.Bottom} />
      <Handle id="left-out" type="source" position={Position.Left} />
      <svg viewBox="0 0 80 120" style={{ width: '60%', height: '60%' }}>
        <rect x="28" y="20" width="24" height="46" rx="12" fill="#fff" stroke={stroke} strokeWidth="3" />
        <line x1="40" y1="66" x2="40" y2="92" stroke={stroke} strokeWidth="4" />
        <path d="M26 70 C26 86 54 86 54 70" fill="none" stroke={stroke} strokeWidth="3" />
        <line x1="26" y1="92" x2="54" y2="92" stroke={stroke} strokeWidth="4" />
        <line x1="40" y1="92" x2="40" y2="104" stroke={stroke} strokeWidth="4" />
        <line x1="30" y1="104" x2="50" y2="104" stroke={stroke} strokeWidth="4" />
      </svg>
      {data?.editing ? (
        <input
          className="nodrag nopan nowheel"
          autoFocus
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onBlur={() => commit(val)}
          onKeyDown={(e) => e.key === 'Enter' && commit(val)}
          onMouseDown={(e) => e.stopPropagation()}
          onDoubleClick={(e) => e.stopPropagation()}
          style={{
            width: '90%',
            border: '1px solid #ccc',
            borderRadius: 4,
            padding: '4px 6px',
            fontSize: data?.fontSize || 12,
            textAlign: 'center',
            background: '#fff',
            pointerEvents: 'all',
          }}
        />
      ) : (
        <span style={{ color: data?.text || '#000', fontSize: data?.fontSize || 12 }}>{data?.label ?? 'Mic'}</span>
      )}
    </div>
  );
}

function BluetoothNode({ id, data, selected }) {
  const rf = useReactFlow();
  const [val, setVal] = useState(data?.label ?? 'Bluetooth');
  const commit = (next) => {
    rf.setNodes((nds) => nds.map((n) => (n.id === id ? { ...n, data: { ...n.data, label: next, editing: false } } : n)));
    window.dispatchEvent(new Event('rf-change'));
  };

  const stroke = data?.stroke || '#0f172a';
  const fill = data?.fill || '#ffffff';

  return (
    <div
      style={{
        ...baseNodeStyles(data),
        background: fill,
        border: `${data?.strokeWidth ?? 2}px solid ${stroke}`,
        borderRadius: 16,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        position: 'relative',
        boxSizing: 'border-box',
        gap: 8,
      }}
      onDoubleClick={() => rf.setNodes((nds) => nds.map((n) => (n.id === id ? { ...n, data: { ...n.data, editing: true } } : n)))}
    >
      <NodeResizer isVisible={selected} minWidth={100} minHeight={120} color={stroke} />
      <Handle id="bluetooth-top-in" type="target" position={Position.Top} />
      <Handle id="bluetooth-right-in" type="target" position={Position.Right} />
      <Handle id="bluetooth-bottom-in" type="target" position={Position.Bottom} />
      <Handle id="bluetooth-left-in" type="target" position={Position.Left} />
      <Handle id="bluetooth-top-out" type="source" position={Position.Top} />
      <Handle id="bluetooth-right-out" type="source" position={Position.Right} />
      <Handle id="bluetooth-bottom-out" type="source" position={Position.Bottom} />
      <Handle id="bluetooth-left-out" type="source" position={Position.Left} />
      <svg viewBox="0 0 80 120" style={{ width: '60%', height: '60%' }}>
        <path d="M40 16 L58 32 L45 45 L58 60 L40 76 L40 16" fill="none" stroke={stroke} strokeWidth="4" />
        <line x1="30" y1="34" x2="52" y2="56" stroke={stroke} strokeWidth="3" />
        <line x1="52" y1="34" x2="30" y2="56" stroke={stroke} strokeWidth="3" />
      </svg>
      {data?.editing ? (
        <input
          className="nodrag nopan nowheel"
          autoFocus
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onBlur={() => commit(val)}
          onKeyDown={(e) => e.key === 'Enter' && commit(val)}
          onMouseDown={(e) => e.stopPropagation()}
          onDoubleClick={(e) => e.stopPropagation()}
          style={{
            width: '90%',
            border: '1px solid #ccc',
            borderRadius: 4,
            padding: '4px 6px',
            fontSize: data?.fontSize || 12,
            textAlign: 'center',
            background: '#fff',
            pointerEvents: 'all',
          }}
        />
      ) : (
        <span style={{ color: data?.text || '#000', fontSize: data?.fontSize || 12 }}>{data?.label ?? 'Bluetooth'}</span>
      )}
    </div>
  );
}

function AntennaNode({ id, data, selected }) {
  const rf = useReactFlow();
  const [val, setVal] = useState(data?.label ?? 'Antenna');
  const commit = (next) => {
    rf.setNodes((nds) => nds.map((n) => (n.id === id ? { ...n, data: { ...n.data, label: next, editing: false } } : n)));
    window.dispatchEvent(new Event('rf-change'));
  };

  const stroke = data?.stroke || '#0f172a';
  const fill = data?.fill || '#ffffff';

  return (
    <div
      style={{
        ...baseNodeStyles(data),
        background: fill,
        border: `${data?.strokeWidth ?? 2}px solid ${stroke}`,
        borderRadius: 16,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        position: 'relative',
        boxSizing: 'border-box',
        gap: 8,
      }}
      onDoubleClick={() => rf.setNodes((nds) => nds.map((n) => (n.id === id ? { ...n, data: { ...n.data, editing: true } } : n)))}
    >
      <NodeResizer isVisible={selected} minWidth={100} minHeight={120} color={stroke} />
      <Handle id="top-in" type="target" position={Position.Top} />
      <Handle id="right-in" type="target" position={Position.Right} />
      <Handle id="bottom-in" type="target" position={Position.Bottom} />
      <Handle id="left-in" type="target" position={Position.Left} />
      <Handle id="top-out" type="source" position={Position.Top} />
      <Handle id="right-out" type="source" position={Position.Right} />
      <Handle id="bottom-out" type="source" position={Position.Bottom} />
      <Handle id="left-out" type="source" position={Position.Left} />
      <svg viewBox="0 0 100 100" style={{ width: '70%', height: '60%' }}>
        <path d="M20 70 Q50 20 80 70" fill="none" stroke={stroke} strokeWidth="4" />
        <path d="M28 70 Q50 32 72 70" fill="none" stroke={stroke} strokeWidth="3" />
        <path d="M36 70 Q50 44 64 70" fill="none" stroke={stroke} strokeWidth="2.5" />
        <line x1="50" y1="70" x2="50" y2="88" stroke={stroke} strokeWidth="4" />
        <circle cx="50" cy="92" r="4" fill={stroke} />
      </svg>
      {data?.editing ? (
        <input
          className="nodrag nopan nowheel"
          autoFocus
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onBlur={() => commit(val)}
          onKeyDown={(e) => e.key === 'Enter' && commit(val)}
          onMouseDown={(e) => e.stopPropagation()}
          onDoubleClick={(e) => e.stopPropagation()}
          style={{
            width: '90%',
            border: '1px solid #ccc',
            borderRadius: 4,
            padding: '4px 6px',
            fontSize: data?.fontSize || 12,
            textAlign: 'center',
            background: '#fff',
            pointerEvents: 'all',
          }}
        />
      ) : (
        <span style={{ color: data?.text || '#000', fontSize: data?.fontSize || 12 }}>{data?.label ?? 'Antenna'}</span>
      )}
    </div>
  );
}

function ActorNode({ id, data, selected }) {
  const rf = useReactFlow();
  const [val, setVal] = useState(data?.label ?? 'Actor');
  const commit = (next) => {
    rf.setNodes((nds) => nds.map((n) => (n.id === id ? { ...n, data: { ...n.data, label: next, editing: false } } : n)));
    window.dispatchEvent(new Event('rf-change'));
  };

  const stroke = data?.stroke || '#0f172a';
  const fill = data?.fill || '#ffffff';

  return (
    <div
      style={{
        ...baseNodeStyles(data),
        background: fill,
        border: `${data?.strokeWidth ?? 2}px solid ${stroke}`,
        borderRadius: 16,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        position: 'relative',
        boxSizing: 'border-box',
        gap: 8,
      }}
      onDoubleClick={() => rf.setNodes((nds) => nds.map((n) => (n.id === id ? { ...n, data: { ...n.data, editing: true } } : n)))}
    >
      <NodeResizer isVisible={selected} minWidth={120} minHeight={140} color={stroke} />
      <Handle id="top-in" type="target" position={Position.Top} />
      <Handle id="right-in" type="target" position={Position.Right} />
      <Handle id="bottom-in" type="target" position={Position.Bottom} />
      <Handle id="left-in" type="target" position={Position.Left} />
      <Handle id="top-out" type="source" position={Position.Top} />
      <Handle id="right-out" type="source" position={Position.Right} />
      <Handle id="bottom-out" type="source" position={Position.Bottom} />
      <Handle id="left-out" type="source" position={Position.Left} />
      <svg viewBox="0 0 80 120" style={{ width: '60%', height: '60%' }}>
        <circle cx="40" cy="26" r="14" fill="#fff" stroke={stroke} strokeWidth="3" />
        <line x1="40" y1="40" x2="40" y2="78" stroke={stroke} strokeWidth="4" />
        <line x1="18" y1="56" x2="62" y2="56" stroke={stroke} strokeWidth="4" />
        <line x1="40" y1="78" x2="20" y2="104" stroke={stroke} strokeWidth="4" />
        <line x1="40" y1="78" x2="60" y2="104" stroke={stroke} strokeWidth="4" />
      </svg>
      {data?.editing ? (
        <input
          className="nodrag nopan nowheel"
          autoFocus
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onBlur={() => commit(val)}
          onKeyDown={(e) => e.key === 'Enter' && commit(val)}
          onMouseDown={(e) => e.stopPropagation()}
          onDoubleClick={(e) => e.stopPropagation()}
          style={{
            width: '90%',
            border: '1px solid #ccc',
            borderRadius: 4,
            padding: '4px 6px',
            fontSize: data?.fontSize || 12,
            textAlign: 'center',
            background: '#fff',
            pointerEvents: 'all',
          }}
        />
      ) : (
        <span style={{ color: data?.text || '#000', fontSize: data?.fontSize || 12 }}>{data?.label ?? 'Actor'}</span>
      )}
    </div>
  );
}

const nodeTypes = {
  process: ProcessNode,
  decision: DecisionNode,
  terminator: TerminatorNode,
  text: TextNode,
  ellipse: EllipseNode,
  database: DatabaseNode,
  data: DataNode,
  delay: DelayNode,
  connector: ConnectorNode,
  summing: SummingNode,
  mic: MicNode,
  bluetooth: BluetoothNode,
  antenna: AntennaNode,
  actor: ActorNode,
};

// Enhanced palette with more shapes
const PALETTE_GROUPS = [
  {
    id: 'blocks',
    title: 'Block Diagram',
    items: [
      { 
        type: 'text', 
        label: 'Text', 
        icon: <div style={{ fontSize: 24, fontWeight: 'bold' }}>T</div>
      },
      {
        type: 'process',
        label: 'Process',
        icon: (
          <svg viewBox="0 0 80 50" preserveAspectRatio="xMidYMid meet">
            <rect x="6" y="8" width="68" height="34" rx="8" ry="8" fill="#fff" stroke="#111" strokeWidth="2" />
          </svg>
        ),
      },
      {
        type: 'decision',
        label: 'Decision',
        icon: (
          <svg viewBox="0 0 80 50" preserveAspectRatio="xMidYMid meet">
            <polygon points="40,5 75,25 40,45 5,25" fill="#fff" stroke="#111" strokeWidth="2" />
          </svg>
        ),
      },
      {
        type: 'terminator',
        label: 'Terminator',
        icon: (
          <svg viewBox="0 0 80 50" preserveAspectRatio="xMidYMid meet">
            <rect x="6" y="8" width="68" height="34" rx="18" ry="18" fill="#fff" stroke="#111" strokeWidth="2" />
          </svg>
        ),
      },
      {
        type: 'ellipse',
        label: 'Ellipse',
        icon: (
          <svg viewBox="0 0 80 50" preserveAspectRatio="xMidYMid meet">
            <ellipse cx="40" cy="25" rx="30" ry="16" fill="#fff" stroke="#111" strokeWidth="2" />
          </svg>
        ),
      },
      {
        type: 'database',
        label: 'Database',
        icon: (
          <svg viewBox="0 0 80 50" preserveAspectRatio="xMidYMid meet">
            <ellipse cx="40" cy="12" rx="28" ry="6" fill="#fff" stroke="#111" strokeWidth="2" />
            <rect x="12" y="12" width="56" height="26" fill="#fff" stroke="#111" strokeWidth="2" />
            <ellipse cx="40" cy="38" rx="28" ry="6" fill="none" stroke="#111" strokeWidth="2" />
          </svg>
        ),
      },
      {
        type: 'data',
        label: 'Data',
        icon: (
          <svg viewBox="0 0 80 50" preserveAspectRatio="xMidYMid meet">
            <rect x="5" y="8" width="70" height="34" rx="8" ry="8" fill="#fff" stroke="#111" strokeWidth="2" />
            <line x1="10" y1="16" x2="70" y2="16" stroke="#111" strokeWidth="1.5" />
            <line x1="10" y1="24" x2="70" y2="24" stroke="#111" strokeWidth="1.5" />
            <line x1="10" y1="32" x2="70" y2="32" stroke="#111" strokeWidth="1.5" />
          </svg>
        ),
      },
      {
        type: 'delay',
        label: 'Delay',
        icon: (
          <svg viewBox="0 0 80 50" preserveAspectRatio="xMidYMid meet">
            <path d="M8,10 H52 Q68,25 52,40 H8 Z" fill="#fff" stroke="#111" strokeWidth="2" />
          </svg>
        ),
      },
      {
        type: 'connector',
        label: 'Connector',
        icon: (
          <svg viewBox="0 0 80 50" preserveAspectRatio="xMidYMid meet">
            <circle cx="40" cy="25" r="18" fill="#fff" stroke="#111" strokeWidth="2" />
          </svg>
        ),
      },
      {
        type: 'summing',
        label: 'Summing',
        icon: (
          <svg viewBox="0 0 80 50" preserveAspectRatio="xMidYMid meet">
            <circle cx="40" cy="25" r="18" fill="#fff" stroke="#111" strokeWidth="2" />
            <line x1="40" y1="15" x2="40" y2="35" stroke="#111" strokeWidth="2" />
            <line x1="30" y1="25" x2="50" y2="25" stroke="#111" strokeWidth="2" />
          </svg>
        ),
      },
      {
        type: 'mic',
        label: 'Mic',
        icon: (
          <svg viewBox="0 0 80 80" preserveAspectRatio="xMidYMid meet">
            <rect x="30" y="18" width="20" height="28" rx="10" ry="10" fill="#fff" stroke="#111" strokeWidth="2" />
            <path d="M28 40 C28 50 52 50 52 40" fill="none" stroke="#111" strokeWidth="2" />
            <line x1="28" y1="54" x2="52" y2="54" stroke="#111" strokeWidth="2" />
            <line x1="40" y1="54" x2="40" y2="64" stroke="#111" strokeWidth="2" />
          </svg>
        ),
      },
      {
        type: 'bluetooth',
        label: 'Bluetooth',
        icon: (
          <svg viewBox="0 0 80 80" preserveAspectRatio="xMidYMid meet">
            <path d="M36 14 L54 28 L42 38 L54 48 L36 62 L36 14" fill="none" stroke="#111" strokeWidth="2.5" />
            <line x1="30" y1="24" x2="50" y2="44" stroke="#111" strokeWidth="2" />
            <line x1="50" y1="24" x2="30" y2="44" stroke="#111" strokeWidth="2" />
          </svg>
        ),
      },
      {
        type: 'antenna',
        label: 'Antenna',
        icon: (
          <svg viewBox="0 0 80 80" preserveAspectRatio="xMidYMid meet">
            <path d="M16 54 Q40 18 64 54" fill="none" stroke="#111" strokeWidth="2.5" />
            <path d="M24 54 Q40 28 56 54" fill="none" stroke="#111" strokeWidth="2" />
            <line x1="40" y1="54" x2="40" y2="68" stroke="#111" strokeWidth="2" />
            <circle cx="40" cy="72" r="3" fill="#111" />
          </svg>
        ),
      },
      {
        type: 'actor',
        label: 'Actor',
        icon: (
          <svg viewBox="0 0 80 80" preserveAspectRatio="xMidYMid meet">
            <circle cx="40" cy="20" r="10" fill="#fff" stroke="#111" strokeWidth="2" />
            <line x1="40" y1="30" x2="40" y2="52" stroke="#111" strokeWidth="2.5" />
            <line x1="24" y1="40" x2="56" y2="40" stroke="#111" strokeWidth="2.5" />
            <line x1="40" y1="52" x2="26" y2="70" stroke="#111" strokeWidth="2.5" />
            <line x1="40" y1="52" x2="54" y2="70" stroke="#111" strokeWidth="2.5" />
          </svg>
        ),
      },
    ],
  },
];

function DiagramEditor() {
  const [isExplorerVisible, setIsExplorerVisible] = useState('explorer');
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selected, setSelected] = useState(null);
  const [hasProjects, setHasProjects] = useState(false);
  const rf = useReactFlow();
  const canvasIntegration = useCanvasFileIntegration('Block Diagram');
  const historyRef = useRef({ entries: [], index: -1 });
  const nodesRef = useRef([]);
  const edgesRef = useRef([]);
  const debounceRef = useRef(null);
  const hydratingRef = useRef(false);
  const lastSnapshotRef = useRef('');
  
  // Add auto-save tabs functionality
  const {
    tabs: autoSaveTabs,
    activeTab: activeAutoSaveTab, 
    addNewTab: addNewAutoSaveTab,
    closeTab: closeAutoSaveTab,
    updateTabContent: updateAutoSaveTabContent,
    openFileAsTab,
    tabManager
  } = useAutoSaveTabs([
    { id: 1, name: "diagram.json", content: "{}", dirty: false }
  ], {
    maxTabs: 5,
    defaultTabName: "diagram",
    defaultContent: "{}"
  });

  // Enhanced file click handler for project management
  const handleFileClick = useCallback(async (filePath, fileName, parsedContent, fileData) => {
    try {
      console.log('File clicked in Block Diagram:', fileName, filePath);
      
      // Load file using canvas integration
      const result = await canvasIntegration.loadFileToCanvas(filePath, fileName, parsedContent, fileData);
      
      if (result.success) {
        // Apply content to canvas if it's JSON diagram data
        if (fileName.endsWith('.json') && parsedContent && typeof parsedContent === 'object') {
          if (parsedContent.nodes && parsedContent.edges) {
            setNodes(parsedContent.nodes || []);
            setEdges(parsedContent.edges || []);
            
            // Apply viewport if available
            if (parsedContent.viewport && rf) {
              setTimeout(() => {
                rf.setViewport(parsedContent.viewport);
              }, 100);
            }
          }
        }
        
        // Also open as tab for editing
        await openFileAsTab(filePath, fileName, result.content);
        console.log(`Loaded ${fileName} into Block Diagram canvas and opened as tab`);
      } else {
        console.error('Failed to load file:', result.error);
      }
    } catch (error) {
      console.error('Failed to handle file click:', error);
    }
  }, [canvasIntegration, setNodes, setEdges, rf, openFileAsTab]);

  // Get currently open file IDs for highlighting in explorer
  const currentScreenFiles = autoSaveTabs
    .filter(tab => tab.fileId)
    .map(tab => tab.fileId);

  const [openGroups, setOpenGroups] = useState({ blocks: true });
  const [paletteSearch, setPaletteSearch] = useState('');
  const { activeTab, tabs, loading: tabsLoading, createTab, updateActiveTabState } = useWorkspaceTabs();

  const navigate = useNavigate();
  const { user, activeProjectId, activeProjectName, setActiveProjectId } = useProject?.() ?? {};
  const userId = user?.userId || user?._id || user?.id;

  // Canvas file integration
  // Check for existing projects and manage project state
  useEffect(() => {
    const checkProjects = async () => {
      const allProjects = projectFileManager.getAllProjects();
      const projects = Object.values(allProjects);
      setHasProjects(projects.length > 0);
      
      // Set active project if available
      if (projects.length > 0 && !activeProjectId && setActiveProjectId) {
        const activeProject = projectFileManager.getActiveProject();
        if (activeProject) {
          setActiveProjectId(activeProject.id);
        } else {
          setActiveProjectId(projects[0].id);
          projectFileManager.setActiveProject(projects[0].id);
        }
      }
    };

    checkProjects();

    // Listen for project changes
    const handleProjectChange = () => {
      const allProjects = projectFileManager.getAllProjects();
      const projects = Object.values(allProjects);
      setHasProjects(projects.length > 0);
    };

    const handleProjectCreated = () => {
      checkProjects();
    };

    window.addEventListener('project:change', handleProjectChange);
    window.addEventListener('project-created', handleProjectCreated);
    window.addEventListener('file-system-refresh', checkProjects);
    
    return () => {
      window.removeEventListener('project:change', handleProjectChange);
      window.removeEventListener('project-created', handleProjectCreated);
      window.removeEventListener('file-system-refresh', checkProjects);
    };
  }, [activeProjectId, setActiveProjectId, userId]);

  // Setup auto-save functionality
  useEffect(() => {
    const activeProject = projectFileManager.getActiveProject();
    if (!activeProject) return;

    const filePath = 'BlockDiagram/system_diagram.json';
    
    // Function to get current canvas content
    const getCanvasContent = () => ({
      nodes,
      edges,
      viewport: rf.getViewport()
    });

    // Setup auto-save on changes (debounced)
    const autoSave = canvasIntegration.setupAutoSaveOnChange(
      getCanvasContent,
      activeProject.id,
      filePath,
      2000 // 2 second debounce
    );

    return autoSave?.cleanup;
  }, [nodes, edges, rf, canvasIntegration]);

  // Trigger auto-save when nodes or edges change
  useEffect(() => {
    const activeProject = projectFileManager.getActiveProject();
    if (!activeProject) return;

    // Debounced save trigger
    const timer = setTimeout(() => {
      const content = {
        nodes,
        edges,
        viewport: rf.getViewport()
      };
      canvasIntegration.saveCanvasToFile(content, 'BlockDiagram/system_diagram.json', activeProject.id);
    }, 1000);

    return () => clearTimeout(timer);
  }, [nodes, edges, rf, canvasIntegration]);

  const handleTabChange = useCallback((tab) => {
    const routes = {
      Simulation: '/simulation',
      Flowchart: '/FlowchartTest',
      'Block Diagram': '/BlockDiagram',
      'Block Programming': '/blockprogramming',
      'Code Editor': '/editor',
    };
    const next = routes[tab];
    if (next) {
      navigate(next);
    }
  }, [navigate]);

  const onConnect = useCallback(
    (params) =>
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            type: 'smoothstep',
            markerEnd: { type: MarkerType.ArrowClosed },
            style: { strokeWidth: 2, stroke: '#000000' },
          },
          eds
        )
      ),
    [setEdges]
  );

  const onSelectionChange = useCallback(({ nodes: nds, edges: eds }) => {
    if (nds && nds.length) {
      setSelected({ kind: 'node', id: nds[0].id });
    } else if (eds && eds.length) {
      setSelected({ kind: 'edge', id: eds[0].id });
    } else {
      setSelected(null);
    }
  }, []);

  const exitEditing = useCallback(() => {
    setNodes((nds) => nds.map((n) => (n.data?.editing ? { ...n, data: { ...n.data, editing: false } } : n)));
  }, [setNodes]);

  // Property panel handlers
  const updateSelectedNode = (mapper) => {
    if (!selected || selected.kind !== 'node') return;
    setNodes((nds) => nds.map((n) => (n.id === selected.id ? mapper(n) : n)));
  };

  const updateSelectedEdge = (mapper) => {
    if (!selected || selected.kind !== 'edge') return;
    setEdges((eds) => eds.map((e) => (e.id === selected.id ? mapper(e) : e)));
  };

  const getSelectedEntity = () => {
    if (!selected) return null;
    if (selected.kind === 'node') return nodes.find((n) => n.id === selected.id) || null;
    return edges.find((e) => e.id === selected.id) || null;
  };

  const selectedEntity = getSelectedEntity();
  const isEdge = selected?.kind === 'edge';

  const onDragStart = (event, shape) => {
    event.dataTransfer.setData('application/reactflow', shape.type);
    event.dataTransfer.effectAllowed = 'move';
  };

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const type = event.dataTransfer.getData('application/reactflow');
      if (!type) return;

      const position = rf.screenToFlowPosition({ x: event.clientX, y: event.clientY });
      const id = getId();
      const defaultLabels = {
        text: 'Text',
        process: 'Process',
        decision: 'Decision',
        terminator: 'Terminator',
        ellipse: 'Ellipse',
        database: 'Database',
        data: 'Data',
        delay: 'Delay',
        connector: 'Connector',
        summing: 'Summing',
        mic: 'Mic',
        bluetooth: 'Bluetooth',
        antenna: 'Antenna',
        actor: 'Actor',
      };
      const baseData = { 
        label: defaultLabels[type] || 'Block', 
        fill: '#ffffff', 
        stroke: '#000000', 
        text: '#000000', 
        strokeWidth: 2, 
        rotation: 0, 
        fontSize: 12 
      };

      const nodeStyle = type === 'text'
        ? { width: 100, height: 40 }
        : type === 'database'
        ? { width: 120, height: 80 }
        : type === 'connector'
        ? { width: 100, height: 100 }
        : type === 'summing'
        ? { width: 120, height: 120 }
        : type === 'mic'
        ? { width: 140, height: 160 }
        : type === 'bluetooth'
        ? { width: 140, height: 160 }
        : type === 'antenna'
        ? { width: 150, height: 150 }
        : type === 'actor'
        ? { width: 160, height: 180 }
        : { width: 160, height: 80 };

      setNodes((nds) => nds.concat({ id, type, position, data: baseData, style: nodeStyle }));
      window.dispatchEvent(new Event('rf-change'));
    },
    [rf, setNodes]
  );

  const pushSnapshot = useCallback(() => {
    if (hydratingRef.current) return;
    const snapshot = {
      nodes: nodesRef.current,
      edges: edgesRef.current,
      viewport: rf.getViewport(),
    };
    const serialized = JSON.stringify(snapshot);
    if (serialized === lastSnapshotRef.current) return;
    lastSnapshotRef.current = serialized;
    const entry = JSON.parse(serialized);
    const history = historyRef.current;
    const capped = 100;
    const base = history.entries.slice(0, history.index + 1);
    base.push(entry);
    const trimmed = base.length > capped ? base.slice(base.length - capped) : base;
    historyRef.current = { entries: trimmed, index: trimmed.length - 1 };
  }, [rf]);

  const scheduleSnapshot = useCallback(() => {
    if (hydratingRef.current) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      pushSnapshot();
    }, 400);
  }, [pushSnapshot]);

  useEffect(() => {
    pushSnapshot();
  }, [pushSnapshot]);

  useEffect(() => {
    nodesRef.current = nodes;
    edgesRef.current = edges;
    scheduleSnapshot();
  }, [nodes, edges, scheduleSnapshot]);

  useEffect(() => () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
  }, []);

  const undo = useCallback(() => {
    const history = historyRef.current;
    if (history.index <= 0) return;
    const nextIndex = history.index - 1;
    const snapshot = history.entries[nextIndex];
    hydratingRef.current = true;
    historyRef.current.index = nextIndex;
    setNodes(snapshot.nodes || []);
    setEdges(snapshot.edges || []);
    const serialized = JSON.stringify(snapshot);
    requestAnimationFrame(() => {
      if (snapshot.viewport) rf.setViewport(snapshot.viewport);
      lastSnapshotRef.current = serialized;
      hydratingRef.current = false;
    });
  }, [setNodes, setEdges, rf]);

  const redo = useCallback(() => {
    const history = historyRef.current;
    if (history.index >= history.entries.length - 1) return;
    const nextIndex = history.index + 1;
    const snapshot = history.entries[nextIndex];
    hydratingRef.current = true;
    historyRef.current.index = nextIndex;
    setNodes(snapshot.nodes || []);
    setEdges(snapshot.edges || []);
    const serialized = JSON.stringify(snapshot);
    requestAnimationFrame(() => {
      if (snapshot.viewport) rf.setViewport(snapshot.viewport);
      lastSnapshotRef.current = serialized;
      hydratingRef.current = false;
    });
  }, [setNodes, setEdges, rf]);

  useEffect(() => {
    const onKey = (e) => {
      const target = e.target;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }

      const mod = e.ctrlKey || e.metaKey;
      const key = e.key.toLowerCase();

      if (mod && key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
        return;
      }

      if ((mod && key === 'y') || (mod && e.shiftKey && key === 'z')) {
        e.preventDefault();
        redo();
        return;
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [undo, redo]);

  const filteredGroups = useMemo(() => {
    const query = paletteSearch.trim().toLowerCase();
    if (!query) {
      return PALETTE_GROUPS;
    }
    return PALETTE_GROUPS
      .map((group) => ({
        ...group,
        items: group.items.filter((item) => item.label.toLowerCase().includes(query)),
      }))
      .filter((group) => group.items.length > 0);
  }, [paletteSearch]);

  const hasSearch = Boolean(paletteSearch.trim());

  // Save / Load functions
  const saveDiagram = () => {
    const payload = {
      nodes,
      edges,
      viewport: rf.getViewport(),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'diagram.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const loadDiagram = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,application/json';
    input.onchange = (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const parsed = JSON.parse(reader.result);
          setNodes(parsed.nodes || []);
          setEdges(parsed.edges || []);
          if (parsed.viewport) rf.setViewport(parsed.viewport);
        } catch (err) {
          console.error('Invalid diagram JSON', err);
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const showExportPreview = useCallback((dataUrl, fileName) => {
    const host = reactFlowWrapper.current;
    if (!host) return;
    if (getComputedStyle(host).position === 'static') {
      host.style.position = 'relative';
    }

    const existing = host.querySelector('.diagram-export-preview');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.className = 'diagram-export-preview';
    Object.assign(overlay.style, {
      position: 'absolute',
      top: '16px',
      right: '16px',
      width: '260px',
      maxHeight: '80%',
      background: 'rgba(15,23,42,0.94)',
      border: '1px solid rgba(148,163,184,0.25)',
      borderRadius: '12px',
      boxShadow: '0 18px 48px rgba(15,23,42,0.45)',
      padding: '14px 14px 12px',
      zIndex: '1300',
      color: '#e2e8f0',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      backdropFilter: 'blur(8px)',
    });

    const title = document.createElement('div');
    title.textContent = 'PNG exported';
    title.style.fontSize = '14px';
    title.style.fontWeight = '600';
    overlay.appendChild(title);

    const img = new Image();
    img.src = dataUrl;
    img.alt = fileName;
    Object.assign(img.style, {
      width: '100%',
      maxHeight: '160px',
      objectFit: 'contain',
      borderRadius: '8px',
      border: '1px solid rgba(148,163,184,0.3)',
      background: '#0f172a',
    });
    overlay.appendChild(img);

    const meta = document.createElement('div');
    meta.textContent = fileName;
    meta.style.fontSize = '11px';
    meta.style.opacity = '0.75';
    overlay.appendChild(meta);

    const actions = document.createElement('div');
    Object.assign(actions.style, {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '8px',
    });

    const openBtn = document.createElement('button');
    openBtn.type = 'button';
    openBtn.textContent = 'Download';
    Object.assign(openBtn.style, {
      padding: '6px 10px',
      borderRadius: '6px',
      border: '1px solid rgba(59,130,246,0.4)',
      background: '#1d4ed8',
      color: '#f8fafc',
      fontSize: '12px',
      cursor: 'pointer',
    });
    openBtn.onclick = () => {
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = fileName;
      a.click();
    };

    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.textContent = 'Close';
    Object.assign(closeBtn.style, {
      padding: '6px 10px',
      borderRadius: '6px',
      border: '1px solid rgba(148,163,184,0.35)',
      background: 'transparent',
      color: '#cbd5f5',
      fontSize: '12px',
      cursor: 'pointer',
    });
    closeBtn.onclick = () => overlay.remove();

    actions.appendChild(closeBtn);
    actions.appendChild(openBtn);
    overlay.appendChild(actions);

    host.appendChild(overlay);
  }, []);

  const handleExportPNG = useCallback(async () => {
    const rfContainer = reactFlowWrapper.current?.querySelector('.react-flow');
    if (!rfContainer) return;

    let watermark;
    
    try {
      // Create watermark
      watermark = document.createElement('div');
      watermark.className = 'export-watermark';
      Object.assign(watermark.style, {
        position: 'absolute',
        right: '16px',
        bottom: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        background: 'rgba(255,255,255,0.95)',
        border: '1px solid #e5e5e5',
        borderRadius: '8px',
        padding: '8px 12px',
        fontSize: '13px',
        fontWeight: '500',
        color: '#111',
        pointerEvents: 'none',
        zIndex: '9999',
      });
      
      const img = new Image();
      img.src = hexBg;
      img.alt = 'InnoIDE';
      img.style.width = '24px';
      img.style.height = '24px';
      img.style.display = 'block';
      
      // Wait for image to load
      await new Promise((resolve) => {
        if (img.complete) {
          resolve();
        } else {
          img.onload = resolve;
          img.onerror = resolve;
          setTimeout(resolve, 500);
        }
      });
      
      watermark.appendChild(img);
      const span = document.createElement('span');
      span.textContent = 'made with innotrat labs';
      span.style.whiteSpace = 'nowrap';
      watermark.appendChild(span);
      rfContainer.appendChild(watermark);

      // Wait for render
      await new Promise(resolve => setTimeout(resolve, 300));

      // Capture the entire react-flow container
      const dataUrl = await toPng(rfContainer, {
        cacheBust: true,
        backgroundColor: '#ffffff',
        pixelRatio: 2,
        filter: (node) => {
          if (!(node instanceof Element)) return true;
          const classes = node.classList;
          if (!classes) return true;
          // Exclude controls, minimap, and background
          if (
            classes.contains('react-flow__controls') ||
            classes.contains('react-flow__minimap') ||
            classes.contains('react-flow__background') ||
            classes.contains('react-flow__attribution')
          ) {
            return false;
          }
          return true;
        },
      });

      const activeProject = projectFileManager.getActiveProject();
      const projectSegment = sanitizeSegment(activeProject?.name || activeProjectName || 'project');
      const timeSegment = sanitizeSegment(new Date().toISOString());
      const fileName = `${projectSegment}_blockdiagram_${timeSegment}.png`;

      // Save to project using new project file manager
      if (activeProject) {
        try {
          const pngPath = await canvasIntegration.exportCanvasAsPNG(dataUrl, fileName, activeProject.id);
          if (pngPath) {
            console.log('PNG exported to project:', pngPath);
          }
        } catch (error) {
          console.error('Failed to save PNG to project:', error);
        }
      }

      window.dispatchEvent(
        new CustomEvent('diagram:export-preview', {
          detail: {
            kind: 'BlockDiagram',
            fileName,
            dataUrl,
            timestamp: Date.now(),
          },
        })
      );

      showExportPreview(dataUrl, fileName);
    } catch (error) {
      console.error('Failed to export PNG', error);
    } finally {
      // Clean up watermark
      if (watermark && watermark.parentNode) {
        watermark.parentNode.removeChild(watermark);
      }
    }
  }, [canvasIntegration, activeProjectName, reactFlowWrapper, showExportPreview]);

  // UI
  return (
    <div className="diagram-builder">
      <CreateProjectIntegration />
      <EditorNavbar 
        activeTab="Block Diagram" 
        onTabChange={handleTabChange}
        onSaveJSON={saveDiagram}
        onLoadJSON={loadDiagram}
        onExportPNG={handleExportPNG}
      />
      <div className="content">
        {/* Left palette */}
        <div className="sidebarr">
          <div className="sidebar-toggle-bar">
            <button
              type="button"
              className={`sidebar-tab ${isExplorerVisible === 'explorer' ? 'active' : ''}`}
              onClick={() => setIsExplorerVisible('explorer')}
            >
              Explorer
            </button>
            <button
              type="button"
              className={`sidebar-tab ${isExplorerVisible === 'shapes' ? 'active' : ''}`}
              onClick={() => setIsExplorerVisible('shapes')}
            >
              Shapes
            </button>
          </div>

          <div className="sidebar-body">
            {isExplorerVisible === 'explorer' ? (
              hasProjects ? (
                <ProjectFileExplorer 
                  variant="diagram" 
                  onFileClick={handleFileClick}
                  currentScreenFiles={currentScreenFiles}
                  activeProjectId={activeProjectId}
                />
              ) : (
                <EnhancedFileExplorer 
                  variant="diagram" 
                  onFileClick={handleFileClick}
                  currentScreenFiles={currentScreenFiles}
                />
              )
            ) : (
              <div className="palette-frame">
                <div className="palette-header">
                  <div className="palette-title">Shapes</div>
                </div>
                <div className="palette-search">
                  <input
                    type="text"
                    placeholder="Search shapes..."
                    value={paletteSearch}
                    onChange={(e) => setPaletteSearch(e.target.value)}
                  />
                </div>
                <div className="palette-wrapper">
                  {filteredGroups.length ? (
                    filteredGroups.map((g) => {
                      const isExpanded = hasSearch ? true : openGroups[g.id] ?? true;
                      const toggleGroup = () => {
                        if (hasSearch) return;
                        setOpenGroups((st) => ({ ...st, [g.id]: !st[g.id] }));
                      };
                      return (
                        <div key={g.id} className="palette-group">
                          <div
                            className="palette-header"
                            onClick={toggleGroup}
                            style={{
                              cursor: hasSearch ? 'default' : 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                            }}
                          >
                            <div className="palette-title">{g.title}</div>
                            <span className="palette-chevron">{isExpanded ? '▾' : '▸'}</span>
                          </div>
                          {isExpanded && (
                            <div className="palette-grid">
                              {g.items.map((s) => (
                                <div
                                  key={`${s.type}-${s.label}`}
                                  className="shape-card"
                                  draggable
                                  onDragStart={(e) => onDragStart(e, s)}
                                  title={s.label}
                                >
                                  <div className="shape-svg">{s.icon}</div>
                                  <div className="shape-label">{s.label}</div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div className="palette-empty">No shapes match your search.</div>
                  )}
                </div>
                <div className="palette-hint">Drag shapes to canvas.</div>
              </div>
            )}
          </div>
        </div>

        {/* Canvas */}
        <div className="diagram-container">
          <div style={{ 
            padding: '8px 12px', 
            background: '#ffffff', 
            borderBottom: '1px solid #e5e7eb',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <DiagramTabs title="Block Diagram Workspace" />
            <DefineProductButton position="inline" />
          </div>
          <div className="canvas-frame">
            <div
              className="rf-wrapper"
              ref={reactFlowWrapper}
              onDrop={onDrop}
              onDragOver={onDragOver}
              style={{ width: '100%', height: '100%' }}
            >
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onSelectionChange={onSelectionChange}
                onPaneClick={exitEditing}
                nodeTypes={nodeTypes}
                connectionLineType={ConnectionLineType.SmoothStep}
                defaultEdgeOptions={{ 
                  type: 'smoothstep',
                  markerEnd: { type: MarkerType.ArrowClosed },
                  style: { strokeWidth: 2, stroke: '#000000' }
                }}
                connectOnClick={false}
                connectionMode={ConnectionMode.Strict}
                snapToGrid
                snapGrid={[16, 16]}
              >
                <MiniMap className="export-ignore" />
                <Controls className="export-ignore">
                  <ControlButton onClick={undo} title="Undo (Ctrl+Z)">
                    <RotateCcw size={16} />
                  </ControlButton>
                  <ControlButton onClick={redo} title="Redo (Ctrl+Y)">
                    <RotateCw size={16} />
                  </ControlButton>
                </Controls>
                <Background className="export-ignore" gap={16} size={1} />
              </ReactFlow>
            </div>
          </div>
        </div>

        {/* Right properties panel */}
        <PropertiesPanel 
          selectedNode={selected?.kind === 'node' ? selectedEntity : null}
          onNodeUpdate={(nodeId, property, value) => {
            updateSelectedNode((n) => ({ 
              ...n, 
              data: { ...n.data, [property]: value } 
            }));
          }}
        />
      </div>
    </div>
  );
}

function BlockDiagramWorkspace() {
  return (
    <WorkspaceTabsProvider kind="blockdiagram" createInitialState={createBlockDiagramState}>
      <DiagramEditor />
    </WorkspaceTabsProvider>
  );
}

function App() {
  return (
    <ReactFlowProvider>
      <BlockDiagramWorkspace />
    </ReactFlowProvider>
  );
}

export default App;
