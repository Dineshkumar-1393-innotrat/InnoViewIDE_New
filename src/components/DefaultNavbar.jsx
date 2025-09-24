import React, { useState } from 'react';
import { FiFile, FiTool, FiHelpCircle, FiChevronDown, FiLogOut, FiUser, FiDownload, FiUpload, FiVideo } from 'react-icons/fi';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setActiveCategory } from '../features/flow/flowSlice';
import { useAuth } from '../contexts/AuthContext';

const NavItem = ({ icon, text, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative" onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
      <button className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 transition-colors">
        {icon}
        <span>{text}</span>
        {children && <FiChevronDown size={14} />}
      </button>
      {children && isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-20">
          {children}
        </div>
      )}
    </div>
  );
};

const ToolsMenu = ({ onCompile, onBuild, onDebugger, onFlash, onEraseChip, onSerialMonitor, onTerminal }) => (
  <div className="w-48 py-1">
    <button onClick={onCompile} className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">Compile</button>
    <button onClick={onBuild} className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">Build</button>
    <button onClick={onDebugger} className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">Debugger</button>
    <button onClick={onFlash} className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">Flash</button>
    <button onClick={onEraseChip} className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">Erase Chip</button>
    <button onClick={onSerialMonitor} className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">Serial Monitor</button>
    <button onClick={onTerminal} className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">Terminal</button>
  </div>
);

const ViewSwitcher = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const views = [
    { name: 'Simulation', path: '/simulation', category: 'simulation' },
    { name: 'Flowchart', path: '/diagram-editor', category: 'flowchart' },
    { name: 'Block Diagram', path: '/blockdiagram', category: 'blockdiagram' },
    { name: 'Code Editor', path: '/embedded', category: 'code-editor' },
  ];

  const handleViewChange = (path, category) => {
    navigate(path);
    if (category === 'flowchart' || category === 'blockdiagram') {
      dispatch(setActiveCategory(category));
    }
  };

  return (
    <div className="flex items-center gap-2 p-1 bg-gray-900 rounded-md">
      {views.map((view) => (
        <button
          key={view.name}
          onClick={() => handleViewChange(view.path, view.category)}
          className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
            location.pathname === view.path
              ? 'bg-gray-700 text-white'
              : 'text-gray-300 hover:bg-gray-700'
          }`}
        >
          {view.name}
        </button>
      ))}
    </div>
  );
};

const DefaultNavbar = ({ 
  onLoad, onStartCall, onExportPng, onExportJson,
  onCompile, onBuild, onDebugger, onFlash, onEraseChip, onSerialMonitor, onTerminal
}) => {
  const fileInputRef = React.useRef(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = () => {
    // Use centralized AuthContext logout so tokens/state are cleared properly
    logout();
  };

  const handleLoadClick = () => {
    fileInputRef.current.click();
  };

  return (
    <>
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={onLoad} 
        style={{ display: 'none' }} 
        accept=".json"
      />
      <header className="bg-gray-800 text-white shadow-md border-b border-gray-700 flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/diagram-editor')}>
            {/* <img src='/logo.svg' alt='InnoIDE Logo' className='w-6 h-6' /> */}
            <span className="font-bold text-lg">InnoIDE</span>
          </div>
          <nav className="flex items-center gap-2">
            <NavItem icon={<FiFile size={16} />} text="File">
              <div className="w-48 py-1">
                <button className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">New File</button>
                <button className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">Open File</button>
              </div>
            </NavItem>
            <NavItem icon={<FiTool size={16} />} text="Tools">
            <ToolsMenu 
              onCompile={onCompile}
              onBuild={onBuild}
              onDebugger={onDebugger}
              onFlash={onFlash}
              onEraseChip={onEraseChip}
              onSerialMonitor={onSerialMonitor}
              onTerminal={onTerminal}
            />
          </NavItem>
            <NavItem icon={<FiHelpCircle size={16} />} text="Help" />
          </nav>
        </div>

        <div className="flex-grow flex items-center justify-center">
          <ViewSwitcher />
        </div>

        <div className="flex items-center gap-3">
          <button onClick={handleLoadClick} title="Load JSON" className="p-2 rounded-full hover:bg-gray-700"><FiUpload size={18} /></button>
          <button onClick={onExportJson} title="Export as JSON" className="p-2 rounded-full hover:bg-gray-700"><FiDownload size={18} /></button>
          <button onClick={onExportPng} title="Export as PNG" className="p-2 rounded-full hover:bg-gray-700"><FiDownload size={18} /></button>
          <button onClick={onStartCall} title="Start Video Call" className="p-2 rounded-full hover:bg-gray-700"><FiVideo size={18} /></button>
          
          <div className="relative">
            <button onClick={() => setShowProfileMenu(!showProfileMenu)} className="p-1.5 rounded-full hover:bg-gray-700">
              <FiUser size={20} />
            </button>
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-20 py-1">
                {isAuthenticated ? (
                  <div className="px-4 py-2 border-b border-gray-600">
                    <p className="text-sm font-medium">{user?.name || 'User Name'}</p>
                    <p className="text-xs text-gray-400">{user?.email || 'user@example.com'}</p>
                  </div>
                ) : (
                  <div className="px-4 py-2 border-b border-gray-600">
                    <p className="text-sm font-medium">User Name</p>
                    <p className="text-xs text-gray-400">user@example.com</p>
                  </div>
                )}
                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-red-500/20">
                  <FiLogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
};

export default DefaultNavbar;
