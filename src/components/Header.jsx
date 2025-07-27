


import React, { useContext, useEffect, useState } from 'react';
import {
  FaUndo, FaRedo, FaFileUpload, FaSave,
  FaSearchPlus, FaSearchMinus, FaBars, FaShare, FaUserCircle,
} from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { undo, redo } from '../features/flow/flowSlice';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { StoreContext } from '../context/StoreContext';
import { motion } from 'framer-motion';

// Tooltip wrapper
const Tooltip = ({ text, children }) => (
  <div className="relative group">
    {children}
    <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-max px-2 py-1 bg-white text-blue-700 text-xs rounded-md border border-gray-200 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-50 whitespace-nowrap">
      {text}
    </div>
  </div>
);

// Icon Button with tooltip
const IconButton = ({ icon, onClick, tooltip, className = '' }) => (
  <Tooltip text={tooltip}>
    <button
      onClick={onClick}
      className={`p-2 rounded-md text-gray-500 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 ${className}`}
    >
      {icon}
    </button>
  </Tooltip>
);

export default function Header({ toggleSidebar, onZoomIn, onZoomOut, zoom = 1 }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [showMenu, setShowMenu] = useState(false);
  const { setToken } = useContext(StoreContext);

  const currentPath = location.pathname;

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const loadEvent = new CustomEvent('load-json-file', { detail: file });
    window.dispatchEvent(loadEvent);
  };

  const handleExportPng = () => {
    window.dispatchEvent(new Event('export-image'));
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.profile-dropdown')) {
        setShowMenu(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <header className="h-14 flex items-center justify-between px-4 bg-white text-gray-900 border-b border-gray-200 shadow-md z-20">
      {/* Left: Logo & Sidebar Toggle */}
      <div className="flex items-center gap-4">
        <IconButton
          icon={<FaBars />}
          onClick={toggleSidebar}
          tooltip="Toggle Sidebar"
          className="md:hidden text-gray-700 hover:bg-blue-100 hover:text-blue-700"
        />
        <h1
          className="text-lg font-bold text-blue-800 whitespace-nowrap cursor-pointer"
          onClick={() => navigate('/e')}
        >
          Innotrat-IDE
        </h1>
      </div>

      {/* Center: Toolbar Buttons */}
      <motion.div
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        className="hidden md:flex items-center gap-2 p-1 border border-gray-200 rounded-lg bg-white"
      >
        <IconButton icon={<FaUndo />} onClick={() => dispatch(undo())} tooltip="Undo" />
        <IconButton icon={<FaRedo />} onClick={() => dispatch(redo())} tooltip="Redo" />
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <IconButton icon={<FaSearchMinus />} onClick={onZoomOut} tooltip="Zoom Out" />
        <IconButton icon={<FaSearchPlus />} onClick={onZoomIn} tooltip="Zoom In" />

        {/* Flowchart / Block-Diagram Toggle Buttons */}
        {currentPath === '/e' && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/el')}
            className="flex items-center gap-2 px-3 py-2 md:px-4 bg-blue-100 hover:bg-blue-200 rounded-md text-sm font-semibold text-blue-700 hover:text-blue-900 transition-colors"
          >
            Block-Diagram
          </motion.button>
        )}
        {currentPath === '/el' && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/e')}
            className="flex items-center gap-2 px-3 py-2 md:px-4 bg-blue-100 hover:bg-blue-200 rounded-md text-sm font-semibold text-blue-700 hover:text-blue-900 transition-colors"
          >
            Flowchart
          </motion.button>
        )}
      </motion.div>

      {/* Right: Actions + Profile */}
      <div className="flex items-center gap-2">
        <Tooltip text="Load from JSON">
          <label className="p-2 rounded-md text-gray-500 hover:text-blue-700 transition-all duration-200 cursor-pointer">
            <FaFileUpload />
            <input type="file" accept=".json" className="hidden" onChange={handleFileChange} />
          </label>
        </Tooltip>
        <IconButton
          icon={<FaSave />}
          onClick={() => window.dispatchEvent(new Event('save-json'))}
          tooltip="Save JSON"
        />
        <Tooltip text="Export as PNG">
          <button
            onClick={handleExportPng}
            className="flex items-center gap-2 px-3 py-2 md:px-4 bg-blue-100 hover:bg-blue-200 rounded-md text-sm font-semibold text-blue-700 hover:text-blue-900 transition-colors"
          >
            <FaShare className="hidden md:inline" />
            <span>Export</span>
          </button>
        </Tooltip>

        {/* Profile Dropdown */}
        <div className="relative profile-dropdown">
          <button
            onClick={() => setShowMenu((prev) => !prev)}
            className="flex items-center gap-2 px-2 py-1.5 rounded-md text-blue-700 hover:bg-blue-100 hover:text-blue-900 transition-all duration-200"
          >
            <FaUserCircle className="text-2xl" />
          </button>

          {showMenu && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute right-0 mt-2 w-40 border border-gray-200 rounded-md shadow-lg z-50 bg-white"
            >
              <button
                className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-blue-100 transition"
                onClick={() => {
                  localStorage.removeItem('user');
                  localStorage.removeItem('token');
                  setToken('');
                  setShowMenu(false);
                  navigate('/login');
                }}
              >
                Sign Out
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </header>
  );
}
