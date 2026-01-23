import React, { useMemo } from 'react';
import { Plus, ExternalLink, Loader2, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setActiveTab as setFlowchartActiveTab,
  addTab as addFlowchartTab,
  closeTab as closeFlowchartTab,
  renameTab as renameFlowchartTab
} from '../store/slices/flowchartSlice';
import {
  setActiveTab as setBlockDiagramActiveTab,
  addTab as addBlockDiagramTab,
  closeTab as closeBlockDiagramTab,
  renameTab as renameBlockDiagramTab
} from '../store/slices/blockDiagramSlice';
import {
  setActiveTab as setBlockProgrammingActiveTab,
  addTab as addBlockProgrammingTab,
  closeTab as closeBlockProgrammingTab,
  renameTab as renameBlockProgrammingTab
} from '../store/slices/blockProgrammingSlice';
import { WorkspaceTabsContext } from '../hooks/useWorkspaceTabs';
import { useContext } from 'react';
import './DiagramTabs.css';

const DiagramTabs = ({ title = 'Tabs', kind }) => {
  const dispatch = useDispatch();

  // Try to get state from Redux based on 'kind'
  const flowchartState = useSelector(state => state.flowchart);
  const blockDiagramState = useSelector(state => state.blockDiagram);
  const blockProgrammingState = useSelector(state => state.blockProgramming);

  let reduxTabs, reduxActiveTabId;

  if (kind === 'flowchart') {
    reduxTabs = flowchartState.tabs;
    reduxActiveTabId = flowchartState.activeTabId;
  } else if (kind === 'blockDiagram') {
    reduxTabs = blockDiagramState.tabs;
    reduxActiveTabId = blockDiagramState.activeTabId;
  } else if (kind === 'blockProgramming') {
    reduxTabs = blockProgrammingState.tabs;
    reduxActiveTabId = blockProgrammingState.activeTabId;
  }

  // Use context safely if available
  const context = useContext(WorkspaceTabsContext) || {};

  const tabs = reduxTabs || context.tabs || [];
  const activeTabId = reduxActiveTabId || context.activeTabId;

  const selectTab = (id) => {
    if (id === activeTabId) return; // Prevent redundant updates if already active

    if (reduxTabs) {
      if (kind === 'flowchart') dispatch(setFlowchartActiveTab(id));
      else if (kind === 'blockDiagram') dispatch(setBlockDiagramActiveTab(id));
      else if (kind === 'blockProgramming') dispatch(setBlockProgrammingActiveTab(id));
    } else {
      context.selectTab?.(id);
    }
  };

  const createTab = () => {
    if (reduxTabs) {
      const newId = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
      const newTab = { id: newId, name: `Tab ${tabs.length + 1}`, state: { nodes: [], edges: [] }, dirty: true };
      if (kind === 'flowchart') dispatch(addFlowchartTab(newTab));
      else if (kind === 'blockDiagram') dispatch(addBlockDiagramTab(newTab));
      else if (kind === 'blockProgramming') dispatch(addBlockProgrammingTab(newTab));
    } else {
      context.createTab?.();
    }
  };

  const closeTab = (id) => {
    if (reduxTabs) {
      if (kind === 'flowchart') dispatch(closeFlowchartTab(id));
      else if (kind === 'blockDiagram') dispatch(closeBlockDiagramTab(id));
      else if (kind === 'blockProgramming') dispatch(closeBlockProgrammingTab(id));
    } else {
      context.closeTab?.(id);
    }
  };

  const renameTab = (id, nextName) => {
    if (reduxTabs) {
      if (kind === 'flowchart') dispatch(renameFlowchartTab({ id, name: nextName }));
      else if (kind === 'blockDiagram') dispatch(renameBlockDiagramTab({ id, name: nextName }));
      else if (kind === 'blockProgramming') dispatch(renameBlockProgrammingTab({ id, name: nextName }));
    } else {
      context.renameTab?.(id, nextName);
    }
  };

  const {
    savingTabIds = [],
    saveActiveTabNow = () => Promise.resolve(),
  } = context || {};

  const savingIds = useMemo(() => new Set(savingTabIds), [savingTabIds]);

  const handleRename = (tabId, currentName) => {
    const nextName = window.prompt('Rename tab', currentName || 'Tab');
    if (nextName && nextName.trim().length) {
      renameTab(tabId, nextName.trim());
    }
  };

  return (
    <div className="diagram-tabs">
      <div className="diagram-tabs__list" role="tablist" aria-label={title}>
        {tabs.map((tab) => {
          if (!tab) return null;
          const isActive = tab.id === activeTabId;
          const isSaving = savingIds.has(tab.id);
          return (
            <div
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              tabIndex={0}
              className={`diagram-tabs__tab ${isActive ? 'is-active' : ''}`}
              onClick={() => selectTab(tab.id)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  selectTab(tab.id);
                }
              }}
            >
              <span
                className="diagram-tabs__label"
                onDoubleClick={(event) => {
                  event.stopPropagation();
                  handleRename(tab.id, tab.name);
                }}
              >
                {tab.name}
              </span>
              <button
                type="button"
                className="diagram-tabs__close"
                onClick={(event) => {
                  event.stopPropagation();
                  closeTab(tab.id);
                }}
                aria-label={`Close ${tab.name}`}
              >
                {isSaving ? <Loader2 className="diagram-tabs__spinner" size={14} /> : <X size={14} />}
              </button>
            </div>
          );
        })}
      </div>
      <div className="diagram-tabs__actions">
        <button type="button" className="diagram-tabs__action" onClick={createTab} title="Add tab">
          <Plus size={16} />
        </button>
        <button
          type="button"
          className="diagram-tabs__action"
          onClick={saveActiveTabNow}
          title="Save tab now"
          disabled={!activeTabId}
        >
          <ExternalLink size={16} />
        </button>
      </div>
    </div>
  );
};

export default DiagramTabs;
