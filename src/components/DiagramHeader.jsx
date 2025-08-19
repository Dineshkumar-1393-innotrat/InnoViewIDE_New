import React, { useEffect, useState } from 'react';
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
  FiPlay
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import hex_bg1 from '../assets/hex_bg1.png';


const DiagramHeader = ({
  onZoomIn,
  onZoomOut,
  handleSave,
  handleExport,
  toggleSidebar,
  exportImage
}) => {
  const [fileInputRef] = useState(React.createRef());
  const [showProfileMenu, setShowProfileMenu] = useState(false);
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
      blue: "bg-blue-600 text-white hover:bg-blue-700 px-3 py-1.5 rounded-md font-medium text-sm"
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

  //save josn start
  const [diagram, setDiagram] = useState("")
  console.log(diagram, "diagram---")
  
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
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <img src={hex_bg1} alt="InnoIDE Logo" className="w-8 h-8 rounded-full" />
            <span className="hidden sm:inline font-semibold text-lg">InnoIDE</span>
          </div>
          <HeaderButton
            onClick={toggleSidebar}
            icon={FiMenu}
            title="Toggle Sidebar"
            variant="default"
          />
        </div>

        {/* Center - Navigation Buttons */}
        <div className="flex-1 flex justify-center space-x-2">
          <HeaderButton
            onClick={() => navigate('/embedded')}
            title="Go to Embedded Page"
            variant="default"
          >
            <FiCpu size={16} className="md:hidden" />
            <span className="hidden md:inline">Embedded</span>
          </HeaderButton>
          <HeaderButton
            onClick={() => navigate('/simulation')}
            title="Go to Simulation Page"
            variant="default"
          >
            <FiPlay size={16} className="md:hidden" />
            <span className="hidden md:inline">Simulation</span>
          </HeaderButton>
        </div>

        {/* Right side - Tools */}
        <div className="flex items-center space-x-1">
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
    </header>
  );
};

export default DiagramHeader; 