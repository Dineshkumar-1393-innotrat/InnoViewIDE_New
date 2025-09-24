import React from 'react';
import { FaShapes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import HeaderButton from './HeaderButton';

const IconBar = ({ isSidebarCollapsed, setIsSidebarCollapsed, activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'flowchart', icon: FaShapes, tooltip: 'Shapes' },
  ];

  return (
    <div className="flex items-center space-x-1 bg-gray-800 p-1 rounded-lg">
      <HeaderButton
        icon={isSidebarCollapsed ? FaChevronRight : FaChevronLeft}
        tooltip={isSidebarCollapsed ? 'Show Sidebar' : 'Hide Sidebar'}
        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      {!isSidebarCollapsed && tabs.map(tab => (
        <HeaderButton
          key={tab.id}
          icon={tab.icon}
          tooltip={tab.tooltip}
          isActive={activeTab === tab.id}
          onClick={() => setActiveTab(tab.id)}
        />
      ))}
    </div>
  );
};

export default IconBar;
