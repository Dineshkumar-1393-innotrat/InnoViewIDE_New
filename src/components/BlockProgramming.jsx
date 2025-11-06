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
  MarkerType,
  ReactFlowProvider,
  useReactFlow,
  ConnectionMode,
  ConnectionLineType,
  Panel,
  useKeyPress,
} from 'reactflow';
import { NodeResizer } from '@reactflow/node-resizer';
import 'reactflow/dist/style.css';
import '@reactflow/node-resizer/dist/style.css';
import { RotateCcw, RotateCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import EditorNavbar from './EditorNavbar';
import FileExplorer from './FileExplorer';
import './FileExplorer.css';
import './BlockDiagramTest.css';
import hexBg from '../assets/hex_bg.png';
import { saveProjectFile, sanitizeSegment, ensureProjectFolder } from '../utils/workspaceStorage';
import { saveAssetToScreenFolder } from '../utils/screenFileManager';
import { useProject } from '../ProjectContext';
import DiagramTabs from './DiagramTabs';
import { WorkspaceTabsProvider, useWorkspaceTabs } from '../hooks/useWorkspaceTabs';
import projectFileManager from '../utils/projectFileManager';
import { useCanvasFileIntegration } from '../hooks/useCanvasFileIntegration';
import ProjectFileExplorer from './ProjectFileExplorer';

const DEFAULT_NODE_DATA = {
  label: 'BLOCK',
  variant: 'rectangle',
  fill: '#ffffff',
  stroke: '#111827',
  text: '#111827',
  strokeWidth: 3,
  fontSize: 16,
  rotation: 0,
};

// Update grid config for full screen
const GRID_CONFIG = {
  ROWS: 12,
  COLUMNS: 9,
  SPACING_X: 100,  // Reduced spacing
  SPACING_Y: 60,   // Reduced spacing
  START_X: 20,     // Adjusted start position
  START_Y: 20
};

// Update default node dimensions
const DEFAULT_NODE_DIMENSIONS = {
  width: 120,  // Reduced from 180
  height: 50   // Reduced from 80
};

const LOGIC_GROUPS = [
  {
    id: 'logic',
    title: 'Logic Blocks',
    items: [
      { type: 'logic', label: 'IF', variant: 'rectangle' },
      { type: 'logic', label: 'ELSE IF', variant: 'rectangle' },
      { type: 'logic', label: 'ELIF', variant: 'rectangle' },
      { type: 'logic', label: 'SWITCH', variant: 'rectangle' },
      { type: 'logic', label: 'CASE', variant: 'rectangle' },
      { type: 'logic', label: 'ELSE', variant: 'rectangle' },
    ],
  },
  {
    id: 'io',
    title: 'Input / Output',
    items: [
      { type: 'logic', label: 'READ INPUT', variant: 'rectangle' },
      { type: 'logic', label: 'READ GPIO', variant: 'rectangle' },
      { type: 'logic', label: 'READ SWITCH', variant: 'rectangle' },
      { type: 'logic', label: 'LED ON', variant: 'rectangle' },
      { type: 'logic', label: 'LED OFF', variant: 'rectangle' },
    ],
  },
  {
    id: 'flow',
    title: 'Flow Helpers',
    items: [
      { type: 'logic', label: 'START', variant: 'rectangle' },
      { type: 'logic', label: 'STOP', variant: 'rectangle' },
      { type: 'logic', label: 'LOOP', variant: 'rectangle' },
    ],
  },
];

let logicId = 1;
const getId = () => `logic_${logicId++}`;
const createBlockProgrammingState = () => ({ nodes: [], edges: [], viewport: null, idSeed: 1 });

const handleStyle = {
  width: 8,
  height: 8,
  background: '#0f172a',
  borderRadius: '50%',
};

// Generate initial grid nodes
const generateGridNodes = () => {
  const nodes = [];
  for (let row = 0; row < GRID_CONFIG.ROWS; row++) {
    for (let col = 0; col < GRID_CONFIG.COLUMNS; col++) {
      const id = `grid_${row}_${col}`;
      nodes.push({
        id,
        type: 'logic',
        position: {
          x: GRID_CONFIG.START_X + (col * GRID_CONFIG.SPACING_X),
          y: GRID_CONFIG.START_Y + (row * GRID_CONFIG.SPACING_Y)
        },
        data: {
          ...DEFAULT_NODE_DATA,
          label: `Block ${row}-${col}`,
        },
        style: { 
          width: DEFAULT_NODE_DIMENSIONS.width, 
          height: DEFAULT_NODE_DIMENSIONS.height 
        }
      });
    }
  }
  return nodes;
};

function LogicBlockNode({ id, data, selected }) {
  const rf = useReactFlow();
  const {
    label = 'BLOCK',
    fill = '#ffffff',
    stroke = '#111827',
    text = '#111827',
    strokeWidth = 3,
    fontSize = 16,
    rotation = 0,
  } = data || {};

  const editLabel = useCallback(() => {
    const next = window.prompt('Edit block label', label);
    if (next != null) {
      rf.setNodes((nodes) =>
        nodes.map((node) =>
          node.id === id ? { ...node, data: { ...node.data, label: next } } : node,
        ),
      );
    }
  }, [rf, id, label]);

  // Rectangle handles on all sides
  const handles = (
    <>
      <Handle id="top" type="target" position={Position.Top} style={handleStyle} />
      <Handle id="right" type="source" position={Position.Right} style={handleStyle} />
      <Handle id="bottom" type="source" position={Position.Bottom} style={handleStyle} />
      <Handle id="left" type="target" position={Position.Left} style={handleStyle} />
    </>
  );

  // Always render a rectangle SVG
  return (
    <div className="logic-node" onDoubleClick={editLabel}>
      <NodeResizer isVisible={selected} minWidth={80} minHeight={40} color={stroke} />
      <div className="logic-node__content" style={{ transform: `rotate(${rotation}deg)` }}>
        <svg viewBox="0 0 120 50" width="100%" height="100%">
          <rect
            x="0"
            y="0"
            width="120"
            height="50"
            fill={fill}
            stroke={stroke}
            strokeWidth={strokeWidth}
            rx="8"
            ry="8"
          />
        </svg>
        <div className="logic-node__label" style={{ 
          color: text, 
          fontSize: `${fontSize * 0.8}px`,
          padding: '4px'
        }}>
          {label}
        </div>
      </div>
      {handles}
    </div>
  );
}


const nodeTypes = { logic: LogicBlockNode };

function BlockProgrammingCanvas() {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [openGroups, setOpenGroups] = useState({ logic: true, io: true, flow: true });
  const [paletteSearch, setPaletteSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [isExplorerVisible, setIsExplorerVisible] = useState('blocks');
  const deletePressed = useKeyPress('Delete');
  const backspacePressed = useKeyPress('Backspace');
  const rf = useReactFlow();
  const { activeTab, tabs, loading: tabsLoading, createTab, updateActiveTabState, activeTabId, selectTab } = useWorkspaceTabs();
  const hydratingRef = useRef(false);
  const navigate = useNavigate();
  const { user, activeProjectId, activeProjectName, setActiveProjectId } = useProject?.() ?? {};
  const userId = user?.userId || user?._id || user?.id;

  // Canvas file integration for Block Programming
  const canvasIntegration = useCanvasFileIntegration('Block Programming');
  
  // Project management state
  const [hasProjects, setHasProjects] = useState(false);

  const nodesRef = useRef(nodes);
  const edgesRef = useRef(edges);
  const snapshotTimeoutRef = useRef(null);

  useEffect(() => {
    nodesRef.current = nodes;
  }, [nodes]);

  useEffect(() => {
    edgesRef.current = edges;
  }, [edges]);

  const historyRef = useRef({ entries: [], index: -1 });

  const pushSnapshot = useCallback(() => {
    const snapshot = {
      nodes: nodesRef.current,
      edges: edgesRef.current,
      viewport: rf.getViewport(),
    };
    const entries = historyRef.current.entries.slice(0, historyRef.current.index + 1);
    entries.push(JSON.parse(JSON.stringify(snapshot)));
    historyRef.current.entries = entries;
    historyRef.current.index = entries.length - 1;
  }, [rf]);

  // Project management integration
  useEffect(() => {
    const checkProjects = async () => {
      // Fix: Get all projects using projectFileManager
      const allProjects = projectFileManager.getAllProjects() || {};
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

  // File click handler for project integration
  const handleFileClick = useCallback(async (filePath, fileName, parsedContent, fileData) => {
    try {
      console.log('File clicked in Block Programming:', fileName, filePath);
      
      // Load file using canvas integration
      const result = await canvasIntegration.loadFileToCanvas(filePath, fileName, parsedContent, fileData);
      
      if (result.success) {
        // Apply content to canvas if it's JSON block programming data
        if (fileName.endsWith('.json') && parsedContent && typeof parsedContent === 'object') {
          if (parsedContent.blocks && parsedContent.connections) {
            // Convert blocks to nodes and connections to edges
            const nodes = parsedContent.blocks || [];
            const edges = parsedContent.connections || [];
            
            setNodes(nodes);
            setEdges(edges);
            
            // Apply canvas settings if available
            if (parsedContent.canvas?.position && parsedContent.canvas?.zoom && rf) {
              setTimeout(() => {
                rf.setViewport({
                  x: parsedContent.canvas.position.x || 0,
                  y: parsedContent.canvas.position.y || 0,
                  zoom: parsedContent.canvas.zoom || 1
                });
              }, 100);
            }
          } else if (parsedContent.nodes && parsedContent.edges) {
            // Fallback to standard ReactFlow format
            setNodes(parsedContent.nodes || []);
            setEdges(parsedContent.edges || []);
            
            if (parsedContent.viewport && rf) {
              setTimeout(() => {
                rf.setViewport(parsedContent.viewport);
              }, 100);
            }
          }
        }
        
        console.log(`Loaded ${fileName} into Block Programming canvas`);
      } else {
        console.error('Failed to load file:', result.error);
      }
    } catch (error) {
      console.error('Failed to handle file click:', error);
    }
  }, [canvasIntegration, setNodes, setEdges, rf]);

  // Setup auto-save functionality for Block Programming
  useEffect(() => {
    const activeProject = projectFileManager.getActiveProject();
    if (!activeProject) return;

    // Debounced save trigger
    const timer = setTimeout(() => {
      const content = {
        blocks: nodes,
        connections: edges,
        canvas: {
          zoom: rf.getViewport().zoom,
          position: {
            x: rf.getViewport().x,
            y: rf.getViewport().y
          }
        }
      };
      canvasIntegration.saveCanvasToFile(content, 'BlockProgramming/logic_blocks.json', activeProject.id);
    }, 1000);

    return () => clearTimeout(timer);
  }, [nodes, edges, rf, canvasIntegration]);

  useEffect(() => {
    pushSnapshot();
  }, [pushSnapshot]);

  useEffect(() => {
    if (!tabsLoading && tabs.length === 0) {
      createTab();
    }
  }, [tabsLoading, tabs, createTab]);

  useEffect(() => {
    if (!activeTab) return;
    hydratingRef.current = true;
    const state = activeTab.state || createBlockProgrammingState();
    logicId = state.idSeed || 1;
    const nextNodes = state.nodes || [];
    const nextEdges = state.edges || [];
    const nextViewport = state.viewport || null;

    setNodes(nextNodes);
    setEdges(nextEdges);
    nodesRef.current = nextNodes;
    edgesRef.current = nextEdges;

    historyRef.current = {
      entries: [JSON.parse(JSON.stringify({ nodes: nextNodes, edges: nextEdges, viewport: nextViewport }))],
      index: 0,
    };

    if (nextViewport) {
      requestAnimationFrame(() => rf.setViewport(nextViewport));
    }

    if (!activeTab.state) {
      updateActiveTabState(
        () => ({
          nodes: nextNodes,
          edges: nextEdges,
          viewport: nextViewport || rf.getViewport(),
          idSeed: logicId,
        }),
        { markDirty: false, scheduleSave: false }
      );
    }

    const frame = requestAnimationFrame(() => {
      hydratingRef.current = false;
    });
    return () => cancelAnimationFrame(frame);
  }, [activeTab, rf, setEdges, setNodes, updateActiveTabState]);

  const persistCurrentState = useCallback(() => {
    if (hydratingRef.current) return;
    updateActiveTabState((prev = createBlockProgrammingState()) => ({
      ...prev,
      nodes: nodesRef.current,
      edges: edgesRef.current,
      viewport: rf.getViewport(),
      idSeed: logicId,
    }));
  }, [rf, updateActiveTabState]);

  useEffect(() => () => {
    if (snapshotTimeoutRef.current) {
      clearTimeout(snapshotTimeoutRef.current);
    }
  }, []);

  const scheduleSnapshot = useCallback(() => {
    if (snapshotTimeoutRef.current) {
      clearTimeout(snapshotTimeoutRef.current);
    }
    snapshotTimeoutRef.current = setTimeout(() => {
      pushSnapshot();
      persistCurrentState();
      snapshotTimeoutRef.current = null;
    }, 300);
  }, [persistCurrentState, pushSnapshot]);

  const undo = useCallback(() => {
    const { entries, index } = historyRef.current;
    if (index > 0) {
      const snapshot = entries[index - 1];
      historyRef.current.index = index - 1;
      setNodes(snapshot.nodes || []);
      setEdges(snapshot.edges || []);
      if (snapshot.viewport) rf.setViewport(snapshot.viewport);
    }
  }, [rf, setEdges, setNodes]);

  const redo = useCallback(() => {
    const { entries, index } = historyRef.current;
    if (index < entries.length - 1) {
      const snapshot = entries[index + 1];
      historyRef.current.index = index + 1;
      setNodes(snapshot.nodes || []);
      setEdges(snapshot.edges || []);
      if (snapshot.viewport) rf.setViewport(snapshot.viewport);
    }
  }, [rf, setEdges, setNodes]);

  const onConnect = useCallback(
    (params) => {
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            type: 'step',
            markerEnd: { type: MarkerType.ArrowClosed },
            style: { stroke: '#111827', strokeWidth: 2 },
            labelBgPadding: [6, 4],
          },
          eds,
        ),
      );
      scheduleSnapshot();
    },
    [scheduleSnapshot],
  );

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const payload = event.dataTransfer.getData('application/reactflow');
      if (!payload) return;

      let item;
      try {
        item = JSON.parse(payload);
      } catch (err) {
        item = null;
      }

      if (!item) return;

      const position = rf.screenToFlowPosition({ x: event.clientX, y: event.clientY });
      const id = getId();
      logicId += 1;

      const baseWidth = item.variant === 'rectangle' ? 180 : 160;
      const baseHeight = item.variant === 'rectangle' ? 160 : 80;

      setNodes((nds) =>
        nds.concat({
          id,
          type: 'logic',
          position,
          data: {
            ...DEFAULT_NODE_DATA,
            label: item.label,
            variant: item.variant,
          },
          style: { 
            width: DEFAULT_NODE_DIMENSIONS.width, 
            height: DEFAULT_NODE_DIMENSIONS.height 
          },
        }),
      );
      setSelected({ kind: 'node', id });
      scheduleSnapshot();
    },
    [rf, scheduleSnapshot, setNodes],
  );

  const onDragStart = (event, entry) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify(entry));
    event.dataTransfer.effectAllowed = 'move';
  };

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const handleNodesChange = useCallback(
    (changes) => {
      onNodesChange(changes);
      scheduleSnapshot();
    },
    [onNodesChange, scheduleSnapshot],
  );

  const handleEdgesChange = useCallback(
    (changes) => {
      onEdgesChange(changes);
      scheduleSnapshot();
    },
    [onEdgesChange, scheduleSnapshot],
  );

  const onSelectionChange = useCallback(({ nodes: selectedNodes, edges: selectedEdges }) => {
    if (selectedNodes?.length) {
      setSelected({ kind: 'node', id: selectedNodes[0].id, data: selectedNodes[0].data });
    } else if (selectedEdges?.length) {
      setSelected({ kind: 'edge', id: selectedEdges[0].id });
    } else {
      setSelected(null);
    }
  }, []);

  const selectedEntity = useMemo(() => {
    if (!selected || selected.kind !== 'node') return null;
    return nodes.find((node) => node.id === selected.id) || null;
  }, [nodes, selected]);

  const isNodeSelected = selected?.kind === 'node' && Boolean(selectedEntity);

  const updateSelectedNode = useCallback(
    (mapper) => {
      if (!isNodeSelected) return;
      setNodes((nds) => nds.map((node) => (node.id === selected.id ? mapper(node) : node)));
      scheduleSnapshot();
    },
    [isNodeSelected, scheduleSnapshot, selected, setNodes],
  );

  const handleEditText = useCallback(() => {
    if (!isNodeSelected || !selectedEntity) return;
    const current = selectedEntity.data?.label ?? '';
    const next = window.prompt('Block label', current);
    if (next != null) {
      updateSelectedNode((node) => ({ ...node, data: { ...node.data, label: next } }));
    }
  }, [isNodeSelected, selectedEntity, updateSelectedNode]);

  const filteredGroups = useMemo(() => {
    const query = paletteSearch.trim().toLowerCase();
    if (!query) return LOGIC_GROUPS;
    return LOGIC_GROUPS.map((group) => ({
      ...group,
      items: group.items.filter((item) => item.label.toLowerCase().includes(query)),
    })).filter((group) => group.items.length > 0);
  }, [paletteSearch]);

  const hasSearch = paletteSearch.trim().length > 0;

  const handleTabChange = useCallback(
    (tab) => {
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
    },
    [navigate],
  );

  const saveDiagram = useCallback(() => {
    const snapshot = {
      nodes: nodesRef.current,
      edges: edgesRef.current,
      viewport: rf.getViewport(),
    };
    const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'block-programming.json';
    link.click();
    URL.revokeObjectURL(url);
  }, [rf]);

  const loadDiagram = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,application/json';
    input.onchange = (event) => {
      const file = event.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const parsed = JSON.parse(reader.result);
          setNodes(parsed.nodes || []);
          setEdges(parsed.edges || []);
          if (parsed.viewport) {
            rf.setViewport(parsed.viewport);
          }
          scheduleSnapshot();
        } catch (error) {
          console.error('Invalid block programming JSON', error);
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }, [rf, scheduleSnapshot, setEdges, setNodes]);

  const showExportPreview = useCallback((dataUrl, fileName) => {
    const host = reactFlowWrapper.current;
    if (!host) return;
    if (getComputedStyle(host).position === 'static') {
      host.style.position = 'relative';
    }

    const existing = host.querySelector('.diagram-export-preview');
    if (existing) {
      existing.remove();
    }

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
    openBtn.textContent = 'Open';
    Object.assign(openBtn.style, {
      padding: '6px 10px',
      borderRadius: '6px',
      border: '1px solid rgba(59,130,246,0.4)',
      background: '#1d4ed8',
      color: '#f8fafc',
      fontSize: '12px',
      cursor: 'pointer',
    });
    openBtn.onclick = () => window.open(dataUrl, '_blank', 'noopener');

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
    const container = reactFlowWrapper.current?.querySelector('.react-flow');
    if (!container) return;

    let watermark;
    try {
      watermark = document.createElement('div');
      watermark.className = 'export-watermark';
      Object.assign(watermark.style, {
        position: 'absolute',
        right: '16px',
        bottom: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        background: 'rgba(255,255,255,0.9)',
        border: '1px solid #e5e5e5',
        borderRadius: '8px',
        padding: '6px 10px',
        fontSize: '12px',
        color: '#111',
        pointerEvents: 'none',
        zIndex: '1000',
      });
      const img = new Image();
      img.src = hexBg;
      img.alt = 'InnoIDE';
      img.style.width = '32px';
      img.style.height = '32px';
      img.style.opacity = '0.9';
      watermark.appendChild(img);
      const span = document.createElement('span');
      span.textContent = 'made with innotrat labs';
      watermark.appendChild(span);
      container.appendChild(watermark);

      const dataUrl = await toPng(container, {
        cacheBust: true,
        backgroundColor: '#ffffff',
        pixelRatio: 2,
        filter: (node) => {
          if (!(node instanceof Element)) return true;
          const classes = node.classList;
          if (!classes) return true;
          if (
            classes.contains('export-ignore') ||
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
      const fileName = `${projectSegment}_blockprogramming_${timeSegment}.png`;

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

      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.dispatchEvent(
        new CustomEvent('diagram:export-preview', {
          detail: {
            kind: 'BlockProgramming',
            fileName,
            dataUrl,
            timestamp: Date.now(),
          },
        })
      );

      showExportPreview(dataUrl, fileName);
    } catch (error) {
      console.error('Failed to export block programming PNG', error);
    } finally {
      if (watermark && watermark.parentNode) {
        watermark.parentNode.removeChild(watermark);
      }
    }
  }, [canvasIntegration, activeProjectName, reactFlowWrapper, showExportPreview]);

  // Add keyboard deletion handler
  useEffect(() => {
    if ((deletePressed || backspacePressed) && selected) {
      if (selected.kind === 'node') {
        setNodes(nodes => nodes.filter(n => n.id !== selected.id));
      } else if (selected.kind === 'edge') {
        setEdges(edges => edges.filter(e => e.id !== selected.id));
      }
      setSelected(null);
    }
  }, [deletePressed, backspacePressed, selected, setNodes, setEdges]);

  // Update ReactFlow render with new controls
  return (
    <div className="diagram-builder">
      <EditorNavbar
        activeTab="Block Programming"
        onTabChange={handleTabChange}
        onSaveJSON={saveDiagram}
        onLoadJSON={loadDiagram}
        onExportPNG={handleExportPNG}
        onUndo={undo}
        onRedo={redo}
      />
      <div className="content">
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
              className={`sidebar-tab ${isExplorerVisible === 'blocks' ? 'active' : ''}`}
              onClick={() => setIsExplorerVisible('blocks')}
            >
              Blocks
            </button>
          </div>
          <div className="sidebar-body">
            {isExplorerVisible === 'explorer' ? (
              hasProjects ? (
                <ProjectFileExplorer 
                  variant="diagram" 
                  onFileClick={handleFileClick}
                  currentScreenFiles={[]}
                  activeProjectId={activeProjectId}
                />
              ) : (
                <FileExplorer variant="diagram" />
              )
            ) : (
              <div className="palette-frame">
                <div className="palette-header">
                  <div className="palette-title">Logic Blocks</div>
                </div>
                <div className="palette-search">
                  <input
                    type="text"
                    placeholder="Search blocks..."
                    value={paletteSearch}
                    onChange={(e) => setPaletteSearch(e.target.value)}
                  />
                </div>
                <div className="palette-wrapper">
                  {filteredGroups.length ? (
                    filteredGroups.map((group) => {
                      const isExpanded = hasSearch ? true : openGroups[group.id] ?? true;
                      const toggleGroup = () => {
                        if (hasSearch) return;
                        setOpenGroups((prev) => ({
                          ...prev,
                          [group.id]: !(prev[group.id] ?? true),
                        }));
                      };
                      return (
                        <div className="palette-group" key={group.id}>
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
                            <div className="palette-title">{group.title}</div>
                            <span className="palette-chevron">{isExpanded ? '▾' : '▸'}</span>
                          </div>
                          {isExpanded && (
                            <div className="palette-grid">
                              {group.items.map((item) => {
                                const [primary, ...rest] = item.label.split(' ');
                                const secondary = rest.join(' ');
                                return (
                                  <div
                                    key={`${group.id}-${item.label}`}
                                    className="shape-card"
                                    draggable
                                    onDragStart={(e) => onDragStart(e, item)}
                                  >
                                    <div className="shape-svg logic-shape-preview">
                                      <span className="logic-shape-preview__primary">{primary}</span>
                                      {secondary ? (
                                        <span className="logic-shape-preview__secondary">{secondary}</span>
                                      ) : null}
                                    </div>
                                    <div className="shape-label">{item.label}</div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div className="palette-empty">No blocks found.</div>
                  )}
                </div>
                <div className="palette-hint">Drag blocks into the workspace and connect them.</div>
              </div>
            )}
          </div>
        </div>

        <div className="diagram-container">
          <div style={{ padding: '8px 12px', background: '#ffffff', borderBottom: '1px solid #e5e7eb' }}>
            <DiagramTabs title="Block Programming Workspace" />
          </div>
          <div className="canvas-frame">
            <div
              className="rf-wrapper"
              ref={reactFlowWrapper}
              onDrop={onDrop}
              onDragOver={onDragOver}
            >
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={handleNodesChange}
                onEdgesChange={handleEdgesChange}
                onConnect={onConnect}
                onSelectionChange={onSelectionChange}
                nodeTypes={nodeTypes}
                fitView
                connectionLineType={ConnectionLineType.Step}
                connectionMode={ConnectionMode.Strict}
                snapToGrid
                snapGrid={[16, 16]}
              >
                <MiniMap className="export-ignore" />
                <Controls className="export-ignore">
                  <ControlButton onClick={undo} title="Undo">
                    <RotateCcw size={20} />
                  </ControlButton>
                  <ControlButton onClick={redo} title="Redo">
                    <RotateCw size={20} />
                  </ControlButton>
                </Controls>
                <Background className="export-ignore" gap={16} size={1} />
              </ReactFlow>
            </div>
          </div>
        </div>

        <div className="properties-panel" style={{ display: 'none' }}>
          <h3>Properties</h3>
          <div style={{ fontSize: 12, marginBottom: 8 }}>
            Selected: {isNodeSelected ? 'Block' : 'None'}
          </div>

          <div className="prop-row">
            <label>Fill</label>
            <input
              type="color"
              disabled={!isNodeSelected}
              value={selectedEntity?.data?.fill ?? '#ffffff'}
              onChange={(event) => {
                const value = event.target.value;
                updateSelectedNode((node) => ({ ...node, data: { ...node.data, fill: value } }));
              }}
            />
          </div>

          <div className="prop-row">
            <label>Border</label>
            <input
              type="color"
              disabled={!isNodeSelected}
              value={selectedEntity?.data?.stroke ?? '#111827'}
              onChange={(event) => {
                const value = event.target.value;
                updateSelectedNode((node) => ({ ...node, data: { ...node.data, stroke: value } }));
              }}
            />
          </div>

          <div className="prop-row">
            <label>Text</label>
            <input
              type="color"
              disabled={!isNodeSelected}
              value={selectedEntity?.data?.text ?? '#111827'}
              onChange={(event) => {
                const value = event.target.value;
                updateSelectedNode((node) => ({ ...node, data: { ...node.data, text: value } }));
              }}
            />
          </div>

          <div className="prop-row">
            <label>Border W</label>
            <input
              type="range"
              min={1}
              max={12}
              step={1}
              disabled={!isNodeSelected}
              value={Number(selectedEntity?.data?.strokeWidth ?? 3)}
              onChange={(event) => {
                const value = Number(event.target.value);
                updateSelectedNode((node) => ({ ...node, data: { ...node.data, strokeWidth: value } }));
              }}
            />
          </div>

          <div className="prop-row">
            <label>Text Size</label>
            <input
              type="range"
              min={10}
              max={48}
              step={1}
              disabled={!isNodeSelected}
              value={Number(selectedEntity?.data?.fontSize ?? 16)}
              onChange={(event) => {
                const value = Number(event.target.value);
                updateSelectedNode((node) => ({ ...node, data: { ...node.data, fontSize: value } }));
              }}
            />
          </div>

          <div className="prop-row">
            <label>Rotate</label>
            <input
              type="range"
              min={0}
              max={359}
              step={1}
              disabled={!isNodeSelected}
              value={Number(selectedEntity?.data?.rotation ?? 0)}
              onChange={(event) => {
                const value = Number(event.target.value);
                updateSelectedNode((node) => ({ ...node, data: { ...node.data, rotation: value } }));
              }}
            />
          </div>

          <button className="edit-text-btn" disabled={!isNodeSelected} onClick={handleEditText}>
            Edit Text
          </button>
        </div>
      </div>
    </div>
  );
}

function BlockProgrammingWorkspace() {
  return (
    <WorkspaceTabsProvider kind="blockprogramming" createInitialState={createBlockProgrammingState}>
      <BlockProgrammingCanvas />
    </WorkspaceTabsProvider>
  );
}

const BlockProgramming = () => (
  <ReactFlowProvider>
    <BlockProgrammingWorkspace />
  </ReactFlowProvider>
);

export default BlockProgramming;
