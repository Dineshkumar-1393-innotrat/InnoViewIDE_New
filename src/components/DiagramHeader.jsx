import React, { useEffect, useState } from 'react';
import DefineProduct from './DefineProduct';
import {
  FiZoomIn,
  FiZoomOut,
  FiSave,
  FiDownload,
  FiUpload,
  FiMenu,
  FiRotateCcw,
  FiRotateCw,
  FiGrid,
  FiHome,
  FiX,
  FiSearch,
  FiUser,
  FiLogOut,
  FiChevronDown,
  FiCpu,
  FiPlay,
  FiVideo
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import hex_bg1 from '../assets/hex_bg1.png';
import IconBar from './IconBar';


import { FiClock } from 'react-icons/fi';

const DiagramHeader = ({ onStartCall, onToggleHistory, fileSystem, onFileSystemUpdate, refreshFileSystem, isSidebarCollapsed, setIsSidebarCollapsed, activeTab, setActiveTab, onZoomIn, onZoomOut, handleSave, handleExport, toggleSidebar, exportImage }) => {
  const [fileInputRef] = useState(React.createRef());
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showDefineProduct, setShowDefineProduct] = useState(false);
  const navigate = useNavigate();

  const handleLoadJSON = (event) => {
    const loadEvent = new CustomEvent('load-json-file', {
      detail: event.target.files[0],
    });
    window.dispatchEvent(loadEvent);
  };

  const handleAutoLayout = () => {
    window.dispatchEvent(new Event('auto-layout'));
  };

  const handleUndo = () => {
    window.dispatchEvent(new Event('undo'));
  };

  const handleRedo = () => {
    window.dispatchEvent(new Event('redo'));
  };

  const handleLogout = () => {
    // Clear any stored authentication data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.clear();

    // Navigate to root page
    navigate('/');
  };

  const HeaderButton = ({ onClick, icon: Icon, title, disabled = false, variant = 'default', children }) => {
    const baseClasses = "p-2 rounded transition-all duration-200 flex items-center justify-center";
    const variantClasses = {
      default: "text-gray-300 hover:text-white hover:bg-gray-700",
      primary: "text-gray-300 hover:text-white hover:bg-blue-600",
      danger: "text-gray-300 hover:text-white hover:bg-red-600",
      blue: "bg-blue-600 text-white hover:bg-blue-700 px-3 py-1.5 rounded-md font-medium text-sm",
      teal: "bg-teal-500 text-white hover:bg-teal-600 px-3 py-1.5 rounded-md font-medium text-sm"
    };

    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={`${baseClasses} ${variantClasses[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        title={title}
      >
        {Icon && <Icon size={16} />}
        {children}
      </button>
    );
  };

  //save json start
  const [diagram, setDiagram] = useState("")
  
  const saveDiagram = async () => {
    const payload = {
      nodes: [/* your nodes array here */],
      edges: [/* your edges array here */],
      fileORFolderId: "6867c3c158c6ae8e6b9b7fe3",
      productId: "6867c3bf58c6ae8e6b9b7fe0",
      userId: "67add4f3d16ff7c76ba10bcf"
    };

    try {
      const res = await fetch("https://eureka.innotrat.in/api/v1/addFlowDiagram", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error("Failed to save diagram");
      const data = await res.json();
      setDiagram(data);
      console.log("Diagram saved:", data);
    } catch (err) {
      console.error("Error saving diagram:", err);
    }
  };

  //save json end

  return (
    <header className="bg-gray-800 text-white shadow-lg border-b border-gray-700">
      <div className="flex items-center justify-between px-2 py-2 sm:px-4">
        {/* Left side - Logo and Menu */}
        <div className="flex items-center space-x-4">
        </div>


        {/* Right side - Tools */}
        <div className="flex items-center space-x-2">
        <IconBar 
          isSidebarCollapsed={isSidebarCollapsed} 
          setIsSidebarCollapsed={setIsSidebarCollapsed} 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
        />
          {/* Load */}
          <HeaderButton
            onClick={() => fileInputRef.current?.click()}
            icon={FiUpload}
            title="Load JSON"
            variant="default"
          />

          {/* Save */}
          <HeaderButton
            onClick={handleSave}
            icon={FiSave}
            title="Save as JSON"
            variant="default"
          />

          {/* Export */}
          <HeaderButton
            onClick={handleExport}
            icon={FiDownload}
            title="Export as PNG"
            variant="default"
          />
          <HeaderButton
            onClick={onStartCall}
            icon={FiVideo}
            title="Start Video Call"
            variant="default"
          />
          {/* <HeaderButton
            onClick={onToggleHistory}
            icon={FiClock}
            title="Toggle History"
            variant="default"
          /> */}

          {/* Profile Dropdown - Hidden as per request */}
          {/*
          <div className="relative">
            <HeaderButton
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              icon={FiUser}
              title="User Profile"
              variant="default"
            />
            
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-700 rounded-md shadow-lg py-1 z-50 border border-gray-600 profile-dropdown">
                <div className="px-4 py-2 text-sm text-gray-300 border-b border-gray-600">
                  <div className="font-medium">User Profile</div>
                  <div className="text-gray-400 text-xs">user@example.com</div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 hover:text-white transition-colors duration-200 profile-menu-item"
                >
                  <FiLogOut className="mr-3" size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
          */}
          <HeaderButton
            onClick={() => setShowDefineProduct(true)}
            title="Define Product"
            variant="teal"
          >
            <span className="hidden md:inline">Define Product</span>
          </HeaderButton>
        </div>
      </div>

      {/* Hidden file input for loading JSON */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleLoadJSON}
        style={{ display: 'none' }}
      />

      {/* Click outside to close profile menu */}
      {showProfileMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowProfileMenu(false)}
        />
      )}
      {showDefineProduct && (
        <div className="fixed inset-0 z-50 bg-white">
          <DefineProduct />
          <button 
            onClick={() => setShowDefineProduct(false)} 
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            <FiX size={24} />
          </button>
        </div>
      )}
    </header>
  );
};

export default DiagramHeader;