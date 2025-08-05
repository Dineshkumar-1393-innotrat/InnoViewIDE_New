import React, { useState } from 'react';
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
  FiChevronDown
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const DiagramHeader = ({ 
  onZoomIn, 
  onZoomOut, 
  handleSave, 
  handleExport, 
  toggleSidebar,
  exportImage,
  handleUndo,
  handleRedo,
  canUndo = false,
  canRedo = false,
  testUndoRedo,
  handleClearPersistedState,
  handleSaveCurrentState,
  handleClearCanvas
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
        className={`${baseClasses} ${variantClasses[variant]} ${disabled ? 'opacity-30 cursor-not-allowed' : ''}`}
        title={disabled ? `${title} (not available)` : title}
      >
        {Icon && <Icon size={16} />}
        {children}
      </button>
    );
  };

  return (
    <header className="bg-gray-800 text-white shadow-lg border-b border-gray-700">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left side - Menu only */}
        <div className="flex items-center space-x-3">
          <HeaderButton
            onClick={toggleSidebar}
            icon={FiMenu}
            title="Toggle Sidebar"
            variant="default"
          />
        </div>

        {/* Center - Empty space for balance */}
        <div className="flex-1 flex justify-center">
          {/* Removed Block-Diagram button - category switching is now in sidebar */}
        </div>

        {/* Right side - Tools */}
        <div className="flex items-center space-x-2">
          {/* Undo */}
          <HeaderButton
            onClick={handleUndo}
            icon={FiRotateCcw}
            title="Undo (Ctrl+Z)"
            variant="default"
            disabled={!canUndo}
          />

          {/* Redo */}
          <HeaderButton
            onClick={handleRedo}
            icon={FiRotateCw}
            title="Redo (Ctrl+Y)"
            variant="default"
            disabled={!canRedo}
          />

          {/* Test Undo/Redo */}
          {/* {testUndoRedo && (
            <HeaderButton
              onClick={testUndoRedo}
              icon={FiGrid}
              title="Test Undo/Redo"
              variant="primary"
            />
          )} */}

          {/* Clear Persisted State */}
          {/* {handleClearPersistedState && (
            <HeaderButton
              onClick={handleClearPersistedState}
              icon={FiX}
              title="Clear Saved State"
              variant="danger"
            />
          )} */}

          {/* Save Current State */}
          {/* {handleSaveCurrentState && (
            <HeaderButton
              onClick={handleSaveCurrentState}
              icon={FiSave}
              title="Save Current State"
              variant="primary"
            />
          )} */}

          {/* Load */}
          <HeaderButton
            onClick={() => fileInputRef.current?.click()}
            icon={FiDownload}
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
            icon={FiUpload}
            title="Export as PNG"
            variant="default"
          />

          {/* Clear Canvas */}
          {handleClearCanvas && (
            <HeaderButton
              onClick={handleClearCanvas}
              icon={FiX}
              title="Clear Canvas"
              variant="danger"
            />
          )}

          {/* User Profile with Dropdown */}
          <div className="relative">
            <HeaderButton
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              icon={FiUser}
              title="User Profile"
              variant="default"
            />
            
            {/* Profile Dropdown Menu */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-700 rounded-md shadow-lg py-1 z-50 border border-gray-600 profile-dropdown">
                {/* <div className="px-4 py-2 text-sm text-gray-300 border-b border-gray-600">
                  <div className="font-medium">User Profile</div>
                  <div className="text-gray-400 text-xs">user@example.com</div>
                </div> */}
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