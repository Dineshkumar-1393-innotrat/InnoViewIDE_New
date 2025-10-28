import React, { useMemo } from 'react';
import { Plus, ExternalLink, Loader2, X } from 'lucide-react';
import { useWorkspaceTabs } from '../hooks/useWorkspaceTabs';
import './DiagramTabs.css';

const DiagramTabs = ({ title = 'Tabs' }) => {
  const {
    tabs,
    activeTabId,
    selectTab,
    createTab,
    closeTab,
    renameTab,
    savingTabIds,
    saveActiveTabNow,
    loading,
  } = useWorkspaceTabs();

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
              onDoubleClick={() => handleRename(tab.id, tab.name)}
            >
              <span className="diagram-tabs__label">{tab.name}</span>
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
        {loading && (
          <div className="diagram-tabs__loading">
            <Loader2 className="diagram-tabs__spinner" size={16} />
            <span>Loading…</span>
          </div>
        )}
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
