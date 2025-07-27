
// header.jsx files 
// import React from 'react';
// import {
//   FaUndo,
//   FaRedo,
//   FaSave,
//   FaDownload,
//   FaFileUpload,
//   FaSignOutAlt,
//   FaSearchPlus,
//   FaSearchMinus,
//   FaBars,
//   FaShare,
//   FaUserCircle,
// } from 'react-icons/fa';
// import { StoreContext } from '../context/StoreContext';
// import { useDispatch } from 'react-redux';
// import { useState, useEffect } from 'react';
// import { undo, redo } from '../features/flow/flowSlice';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';


// const handleLogout = () => {
//   localStorage.removeItem("token");
//   setToken("");
//   toast.info("You have been logged out.");
//   navigate("/login");
// };
// // Tooltip Component
// const Tooltip = ({ text, children }) => (
//   <div className="relative group">
//     {children}
//     <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-max px-2 py-1 bg-white text-blue-700 text-xs rounded-md border border-gray-200 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-50 whitespace-nowrap">
//       {text}
//     </div>
//   </div>
// );

// // Reusable Icon Button
// const IconButton = ({ icon, onClick, tooltip, className = '' }) => (
//   <Tooltip text={tooltip}>
//     <button
//       onClick={onClick}
//       className={`p-2 rounded-md text-gray-500 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 ${className}`}
//     >
//       {icon}
//     </button>
//   </Tooltip>
// );

// export default function Header({ toggleSidebar, onZoomIn, onZoomOut, zoom = 1 }) {
//   const dispatch = useDispatch();
//   const [showMenu, setShowMenu] = useState(false);

//   // Close dropdown on outside click
//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (!e.target.closest('.relative.profile-dropdown')) {
//         setShowMenu(false);
//       }
//     };
//     document.addEventListener('click', handleClickOutside);
//     return () => document.removeEventListener('click', handleClickOutside);
//   }, []);
//   const navigate = useNavigate();
//   // Handler for loading JSON
//   const handleFileChange = (event) => {
//     const file = event.target.files[0];
//     if (!file) return;
//     const loadEvent = new CustomEvent('load-json-file', { detail: file });
//     window.dispatchEvent(loadEvent);
//   };

//   // Handler for PNG export
//   const handleExportPng = () => {
//     window.dispatchEvent(new Event('export-image'));
//   };

//   return (
//     <header className="h-14 flex items-center justify-between px-4 bg-white text-gray-900 border-b border-gray-200 shadow-md z-20">
//       {/* Left - Sidebar Toggle + Logo */}
//       <div className="flex items-center gap-4">
//         <IconButton
//           icon={<FaBars />}
//           onClick={toggleSidebar}
//           tooltip="Toggle Sidebar"
//           className="md:hidden text-gray-700 hover:bg-blue-100 hover:text-blue-700"
//         />
//         <h1 className="text-lg font-bold text-blue-800 whitespace-nowrap">Innotrat-IDE</h1>
//       </div>

//       {/* Center - Toolbar */}
//       <div className="hidden md:flex items-center gap-2 p-1 border border-gray-200 rounded-lg bg-white">
//         <IconButton icon={<FaUndo />} onClick={() => dispatch(undo())} tooltip="Undo" />
//         <IconButton icon={<FaRedo />} onClick={() => dispatch(redo())} tooltip="Redo" />
//         <div className="w-px h-6 bg-gray-300 mx-1" />
//         <IconButton icon={<FaSearchMinus />} onClick={onZoomOut} tooltip="Zoom Out" />
//         <span className="px-2 text-sm text-gray-500 w-16 text-center">{`${Math.round((zoom || 1) * 100)}%`}</span>
//         <IconButton icon={<FaSearchPlus />} onClick={onZoomIn} tooltip="Zoom In" />
//         {/*
//         <div className="w-px h-6 bg-gray-600 mx-1" />
//         <IconButton
//           icon={<span className="text-lg">🔀</span>}
//           onClick={() => triggerEvent('auto-layout')}
//           tooltip="Auto Layout"
//         />
//         */}
//         <button
//             onClick={() => navigate('/el')}
//             className="flex items-center gap-2 px-3 py-2 md:px-4 bg-blue-100 hover:bg-blue-200 rounded-md text-sm font-semibold text-blue-700 hover:text-blue-900 transition-colors"
//           >
      
//             <span>Block-Diagram</span>
//           </button>
//       </div>

//       {/* Right - Actions + Profile */}
//       <div className="flex items-center gap-2">
//         {/* Save JSON */}
//         {/* <IconButton icon={<FaSave />} onClick={() => triggerEvent('save-json')} tooltip="Save as JSON" /> */}

//         {/* Load JSON */}
//         <Tooltip text="Load from JSON">
//           <label className="p-2 rounded-md text-gray-500  hover:text-blue-700 transition-all duration-200 cursor-pointer">
//             <FaFileUpload />
//             <input
//               type="file"
//               accept=".json"
//               className="hidden"
//               onChange={handleFileChange}
//             />
//           </label>
//         </Tooltip>

//         {/* Export PNG */}
//         <Tooltip text="Export as PNG">
        
//           <button
//             onClick={handleExportPng}
//             className="flex items-center gap-2 px-3 py-2 md:px-4 bg-blue-100 hover:bg-blue-200 rounded-md text-sm font-semibold text-blue-700 hover:text-blue-900 transition-colors"
//           >
//             <FaShare className="hidden md:inline" />
//             <span>Export</span>
//           </button>
//         </Tooltip>

//         {/* Avatar Dropdown */}
//         <div className="relative profile-dropdown">
//           <button
//             onClick={() => setShowMenu((prev) => !prev)}
//             className="flex items-center gap-2 px-2 py-1.5 rounded-md text-blue-700 hover:bg-blue-100 hover:text-blue-900 transition-all duration-200 focus:outline-none"
//           >
//             <FaUserCircle className="text-2xl" />
//           </button>

//           {showMenu && (
//             <div className="absolute right-0 mt-2 w-40  border border-gray-200 rounded-md shadow-lg z-50 bg-white">
//               <button
//                 className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-100 transition"
//                 onClick={() => {
//                   setShowMenu(false);
//                   // alert('Go to profile'); // replace with router logic
//                 }}
//               >
//                 Profile
//               </button>
//               <button
//                 className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-blue-100 transition"
//                 onClick={() => { alert('Sign out') }}
//               >
//                 Sign Out
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </header>
//   );
// }



// // import {
// //   FaUndo,
// //   FaRedo,
// //   FaSave,
// //   FaDownload,
// //   FaFileUpload,
// //   FaSignOutAlt,
// //   FaSearchPlus,
// //   FaSearchMinus,
// //   FaBars,
// //   FaShare,
// // } from 'react-icons/fa';
// // import { useDispatch } from 'react-redux';
// // import { toPng } from 'html-to-image';
// // import { useState, useEffect } from 'react';
// // import { useStore, useReactFlow } from 'reactflow';

// // // Reusable Tooltip Component
// // const Tooltip = ({ text, children }) => (
// //   <div className="relative group">
// //     {children}
// //     <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-max px-2 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-50 whitespace-nowrap">
// //       {text}
// //     </div>
// //   </div>
// // );

// // // Reusable Icon Button
// // const IconButton = ({ icon, onClick, tooltip, className = '' }) => (
// //   <Tooltip text={tooltip}>
// //     <button
// //       onClick={onClick}
// //       className={`p-2 rounded-md text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-200 ${className}`}
// //     >
// //       {icon}
// //     </button>
// //   </Tooltip>
// // );

// // export default function Header({ onToggleSidebar, handleFileChange, handleSignOut, exportToPng }) {
// //   const dispatch = useDispatch();
// //   const [zoom, setZoom] = useState(1);
// //   const { zoomIn, zoomOut } = useReactFlow();

// //   // Listen to viewport changes to update zoom level
// //   const viewport = useStore((s) => s.viewport);
// //   useEffect(() => {
// //     if (viewport) {
// //       setZoom(viewport.zoom);
// //     }
// //   }, [viewport]);

// //   const triggerEvent = (eventName) => {
// //     window.dispatchEvent(new Event(eventName));
// //   };

// //   return (
// //     <header className="h-14 flex items-center justify-between px-4 bg-gray-800 text-white border-b border-gray-700 shadow-md z-20">
// //       {/* Left Section */}
// //       <div className="flex items-center gap-4">
// //         <IconButton
// //           icon={<FaBars />}
// //           onClick={onToggleSidebar}
// //           tooltip="Toggle Sidebar"
// //           className="lg:hidden"
// //         />
// //         <h1 className="text-lg font-bold text-white whitespace-nowrap">Innotrat-ide</h1>
// //       </div>

// //       {/* Center Section - Toolbar */}
// //       <div className="hidden md:flex items-center gap-2 p-1 bg-gray-900/50 border border-gray-700 rounded-lg">
// //         <IconButton icon={<FaUndo />} onClick={() => triggerEvent('undo-action')} tooltip="Undo" />
// //         <IconButton icon={<FaRedo />} onClick={() => triggerEvent('redo-action')} tooltip="Redo" />
// //         <div className="w-px h-6 bg-gray-600 mx-1" />
// //         <IconButton icon={<FaSearchMinus />} onClick={() => zoomOut()} tooltip="Zoom Out" />
// //         <span className="px-2 text-sm text-gray-300 w-16 text-center">{`${Math.round(zoom * 100)}%`}</span>
// //         <IconButton icon={<FaSearchPlus />} onClick={() => zoomIn()} tooltip="Zoom In" />
// //         <div className="w-px h-6 bg-gray-600 mx-1" />
// //         <IconButton icon={<span className="text-lg">🔀</span>} onClick={() => triggerEvent('auto-layout')} tooltip="Auto Layout" />
// //       </div>

// //       {/* Right Section */}
// //       {/* Right Section */}
// // <div className="flex items-center gap-2">
// //   {/* Save Diagram */}
// //   <IconButton icon={<FaSave />} onClick={() => triggerEvent('save-json')} tooltip="Save as JSON" />

// //   {/* Load Diagram */}
// //   <Tooltip text="Load from JSON">
// //     <label className="p-2 rounded-md text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-200 cursor-pointer">
// //       <FaFileUpload />
// //       <input
// //         type="file"
// //         accept=".json"
// //         className="hidden"
// //         onChange={handleFileChange}
// //       />
// //     </label>
// //   </Tooltip>

// //   {/* Export to PNG */}
// //   <Tooltip text="Export as PNG">
// //     <button
// //       onClick={exportToPng}
// //       className="flex items-center gap-2 px-3 py-2 md:px-4 bg-blue-600 hover:bg-blue-700 rounded-md text-sm font-semibold transition-colors"
// //     >
// //       <FaShare className="hidden md:inline" />
// //       <span>Export</span>
// //     </button>
// //   </Tooltip>

// //   {/* Sign Out */}
// //   <IconButton
// //     icon={<FaSignOutAlt />}
// //     onClick={handleSignOut}
// //     tooltip="Sign Out"
// //     className="hidden md:inline-flex hover:bg-red-600/50"
// //   />
// // </div>

// //       {/* <div className="flex items-center gap-2">
// //         <IconButton icon={<FaSave />} onClick={() => triggerEvent('save-json')} tooltip="Save Diagram" />
// //         <Tooltip text="Load Diagram">
// //           <label className="p-2 rounded-md text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-200 cursor-pointer">
// //             <FaFileUpload />
// //             <input
// //               type="file"
// //               accept=".json"
// //               className="hidden"
// //               onChange={handleFileChange}
// //             />
// //           </label>
// //         </Tooltip>
// //         <button
// //           onClick={exportToPng}
// //           className="flex items-center gap-2 px-3 py-2 md:px-4 bg-blue-600 hover:bg-blue-700 rounded-md text-sm font-semibold transition-colors"
// //         >
// //           <FaShare className="hidden md:inline" />
// //           <span>Export</span>
// //         </button>
// //         <IconButton icon={<FaSignOutAlt />} onClick={handleSignOut} tooltip="Sign Out" className="hidden md:inline-flex hover:bg-red-600/50" />
// //       </div> */}
// //     </header>
// //   );
// // }



// import React, { useContext, useEffect, useState } from 'react';
// import {
//   FaUndo, FaRedo, FaSave, FaDownload, FaFileUpload, FaSignOutAlt,
//   FaSearchPlus, FaSearchMinus, FaBars, FaShare, FaUserCircle,
// } from 'react-icons/fa';
// import { useDispatch } from 'react-redux';
// import { undo, redo } from '../features/flow/flowSlice';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import { StoreContext } from '../context/StoreContext';

// const Tooltip = ({ text, children }) => (
//   <div className="relative group">
//     {children}
//     <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-max px-2 py-1 bg-white text-blue-700 text-xs rounded-md border border-gray-200 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-50 whitespace-nowrap">
//       {text}
//     </div>
//   </div>
// );

// const IconButton = ({ icon, onClick, tooltip, className = '' }) => (
//   <Tooltip text={tooltip}>
//     <button
//       onClick={onClick}
//       className={`p-2 rounded-md text-gray-500 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 ${className}`}
//     >
//       {icon}
//     </button>
//   </Tooltip>
// );

// export default function Header({ toggleSidebar, onZoomIn, onZoomOut, zoom = 1 }) {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { setToken } = useContext(StoreContext);
//   const [showMenu, setShowMenu] = useState(false);

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     setToken("");
//     toast.info("You have been logged out.");
//     navigate("/login");
//   };

//   const handleFileChange = (event) => {
//     const file = event.target.files[0];
//     if (!file) return;
//     const loadEvent = new CustomEvent('load-json-file', { detail: file });
//     window.dispatchEvent(loadEvent);
//   };

//   const handleExportPng = () => {
//     window.dispatchEvent(new Event('export-image'));
//   };

//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (!e.target.closest('.relative.profile-dropdown')) {
//         setShowMenu(false);
//       }
//     };
//     document.addEventListener('click', handleClickOutside);
//     return () => document.removeEventListener('click', handleClickOutside);
//   }, []);

//   return (
//     <header className="h-14 flex items-center justify-between px-4 bg-white text-gray-900 border-b border-gray-200 shadow-md z-20">
//       {/* Left Section */}
//       <div className="flex items-center gap-4">
//         <IconButton
//           icon={<FaBars />}
//           onClick={toggleSidebar}
//           tooltip="Toggle Sidebar"
//           className="md:hidden text-gray-700 hover:bg-blue-100 hover:text-blue-700"
//         />
//         <h1 className="text-lg font-bold text-blue-800 whitespace-nowrap">Innotrat-IDE</h1>
//       </div>

//       {/* Center Toolbar */}
//       <div className="hidden md:flex items-center gap-2 p-1 border border-gray-200 rounded-lg bg-white">
//         <IconButton icon={<FaUndo />} onClick={() => dispatch(undo())} tooltip="Undo" />
//         <IconButton icon={<FaRedo />} onClick={() => dispatch(redo())} tooltip="Redo" />
//         <div className="w-px h-6 bg-gray-300 mx-1" />
//         <IconButton icon={<FaSearchMinus />} onClick={onZoomOut} tooltip="Zoom Out" />
//         <span className="px-2 text-sm text-gray-500 w-16 text-center">{`${Math.round((zoom || 1) * 100)}%`}</span>
//         <IconButton icon={<FaSearchPlus />} onClick={onZoomIn} tooltip="Zoom In" />
//         <button
//           onClick={() => navigate('/el')}
//           className="flex items-center gap-2 px-3 py-2 md:px-4 bg-blue-100 hover:bg-blue-200 rounded-md text-sm font-semibold text-blue-700 hover:text-blue-900 transition-colors"
//         >
//           <span>Block-Diagram</span>
//         </button>
//       </div>

//       {/* Right Section */}
//       <div className="flex items-center gap-2">
//         <Tooltip text="Load from JSON">
//           <label className="p-2 rounded-md text-gray-500 hover:text-blue-700 transition-all duration-200 cursor-pointer">
//             <FaFileUpload />
//             <input type="file" accept=".json" className="hidden" onChange={handleFileChange} />
//           </label>
//         </Tooltip>

//         <Tooltip text="Export as PNG">
//           <button
//             onClick={handleExportPng}
//             className="flex items-center gap-2 px-3 py-2 md:px-4 bg-blue-100 hover:bg-blue-200 rounded-md text-sm font-semibold text-blue-700 hover:text-blue-900 transition-colors"
//           >
//             <FaShare className="hidden md:inline" />
//             <span>Export</span>
//           </button>
//         </Tooltip>

//         {/* Profile Dropdown */}
//         <div className="relative profile-dropdown">
//           <button
//             onClick={() => setShowMenu((prev) => !prev)}
//             className="flex items-center gap-2 px-2 py-1.5 rounded-md text-blue-700 hover:bg-blue-100 hover:text-blue-900 transition-all duration-200"
//           >
//             <FaUserCircle className="text-2xl" />
//           </button>

//           {showMenu && (
//             <div className="absolute right-0 mt-2 w-40 border border-gray-200 rounded-md shadow-lg z-50 bg-white">
//               <button
//                 className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-100 transition"
//                 onClick={() => {
//                   setShowMenu(false);
//                   toast.info("Go to profile (to be implemented)");
//                 }}
//               >
//                 Profile
//               </button>
//               <button
//                 className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-blue-100 transition"
//                 onClick={() => {
//                   setShowMenu(false);
//                   navigate('/logout');
//                 }}
//               >
//                 Sign Out
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </header>
//   );
// }


// import React, { useContext, useEffect, useState } from 'react';
// import {
//   FaUndo, FaRedo, FaSave, FaDownload, FaFileUpload, FaSignOutAlt,
//   FaSearchPlus, FaSearchMinus, FaBars, FaShare, FaUserCircle,
// } from 'react-icons/fa';
// import { useDispatch } from 'react-redux';
// import { undo, redo } from '../features/flow/flowSlice';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import { StoreContext } from '../context/StoreContext';

// const Tooltip = ({ text, children }) => (
//   <div className="relative group">
//     {children}
//     <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-max px-2 py-1 bg-white text-blue-700 text-xs rounded-md border border-gray-200 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-50 whitespace-nowrap">
//       {text}
//     </div>
//   </div>
// );

// const IconButton = ({ icon, onClick, tooltip, className = '' }) => (
//   <Tooltip text={tooltip}>
//     <button
//       onClick={onClick}
//       className={`p-2 rounded-md text-gray-500 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 ${className}`}
//     >
//       {icon}
//     </button>
//   </Tooltip>
// );

// export default function Header({ toggleSidebar, onZoomIn, onZoomOut, zoom = 1 }) {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { setToken } = useContext(StoreContext);
//   const [showMenu, setShowMenu] = useState(false);

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     setToken("");
//     toast.info("You have been logged out.");
//     navigate("/login");
//   };

//   const handleFileChange = (event) => {
//     const file = event.target.files[0];
//     if (!file) return;
//     const loadEvent = new CustomEvent('load-json-file', { detail: file });
//     window.dispatchEvent(loadEvent);
//   };

//   const handleExportPng = () => {
//     window.dispatchEvent(new Event('export-image'));
//   };

//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (!e.target.closest('.relative.profile-dropdown')) {
//         setShowMenu(false);
//       }
//     };
//     document.addEventListener('click', handleClickOutside);
//     return () => document.removeEventListener('click', handleClickOutside);
//   }, []);

//   return (
//     <header className="h-14 flex items-center justify-between px-4 bg-white text-gray-900 border-b border-gray-200 shadow-md z-20">
//       {/* Left Section */}
//       <div className="flex items-center gap-4">
//         <IconButton
//           icon={<FaBars />}
//           onClick={toggleSidebar}
//           tooltip="Toggle Sidebar"
//           className="md:hidden text-gray-700 hover:bg-blue-100 hover:text-blue-700"
//         />
//         <h1 className="text-lg font-bold text-blue-800 whitespace-nowrap">Innotrat-IDE</h1>
//       </div>

//       {/* Center Toolbar */}
//       <div className="hidden md:flex items-center gap-2 p-1 border border-gray-200 rounded-lg bg-white">
//         <IconButton icon={<FaUndo />} onClick={() => dispatch(undo())} tooltip="Undo" />
//         <IconButton icon={<FaRedo />} onClick={() => dispatch(redo())} tooltip="Redo" />
//         <div className="w-px h-6 bg-gray-300 mx-1" />
//         <IconButton icon={<FaSearchMinus />} onClick={onZoomOut} tooltip="Zoom Out" />
//         <span className="px-2 text-sm text-gray-500 w-16 text-center">{`${Math.round((zoom || 1) * 100)}%`}</span>
//         <IconButton icon={<FaSearchPlus />} onClick={onZoomIn} tooltip="Zoom In" />
//         <button
//           onClick={() => navigate('/el')}
//           className="flex items-center gap-2 px-3 py-2 md:px-4 bg-blue-100 hover:bg-blue-200 rounded-md text-sm font-semibold text-blue-700 hover:text-blue-900 transition-colors"
//         >
//           <span>Block-Diagram</span>
//         </button>
//       </div>

//       {/* Right Section */}
//       <div className="flex items-center gap-2">
//         <Tooltip text="Load from JSON">
//           <label className="p-2 rounded-md text-gray-500 hover:text-blue-700 transition-all duration-200 cursor-pointer">
//             <FaFileUpload />
//             <input type="file" accept=".json" className="hidden" onChange={handleFileChange} />
//           </label>
//         </Tooltip>

//         <Tooltip text="Export as PNG">
//           <button
//             onClick={handleExportPng}
//             className="flex items-center gap-2 px-3 py-2 md:px-4 bg-blue-100 hover:bg-blue-200 rounded-md text-sm font-semibold text-blue-700 hover:text-blue-900 transition-colors"
//           >
//             <FaShare className="hidden md:inline" />
//             <span>Export</span>
//           </button>
//         </Tooltip>

//         {/* Profile Dropdown */}
//         <div className="relative profile-dropdown">
//           <button
//             onClick={() => setShowMenu((prev) => !prev)}
//             className="flex items-center gap-2 px-2 py-1.5 rounded-md text-blue-700 hover:bg-blue-100 hover:text-blue-900 transition-all duration-200"
//           >
//             <FaUserCircle className="text-2xl" />
//           </button>

//           {showMenu && (
//             <div className="absolute right-0 mt-2 w-40 border border-gray-200 rounded-md shadow-lg z-50 bg-white">
//               <button
//                 className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-100 transition"
//                 onClick={() => {
//                   setShowMenu(false);
//                   toast.info("Go to profile (to be implemented)");
//                 }}
//               >
//                 Profile
//               </button>
//               <button
//                 className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-blue-100 transition"
//                 onClick={() => {
//                   setShowMenu(false);
//                   navigate('/logout');
//                 }}
//               >
//                 Sign Out
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </header>
//   );
// }


// import React, { useContext, useEffect, useState } from 'react';
// import {
//   FaUndo, FaRedo, FaFileUpload,FaSave,
//   FaSearchPlus, FaSearchMinus, FaBars, FaShare, FaUserCircle,
// } from 'react-icons/fa';
// import { useDispatch } from 'react-redux';
// import { undo, redo } from '../features/flow/flowSlice';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import { StoreContext } from '../context/StoreContext';

// const Tooltip = ({ text, children }) => (
//   <div className="relative group">
//     {children}
//     <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-max px-2 py-1 bg-white text-blue-700 text-xs rounded-md border border-gray-200 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-50 whitespace-nowrap">
//       {text}
//     </div>
//   </div>
// );

// const IconButton = ({ icon, onClick, tooltip, className = '' }) => (
//   <Tooltip text={tooltip}>
//     <button
//       onClick={onClick}
//       className={`p-2 rounded-md text-gray-500 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 ${className}`}
//     >
//       {icon}
//     </button>
//   </Tooltip>
// );

// export default function Header({ toggleSidebar, onZoomIn, onZoomOut, zoom = 1 }) {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const [showMenu, setShowMenu] = useState(false);
//   const { setToken } = useContext(StoreContext);

//   const handleFileChange = (event) => {
//     const file = event.target.files[0];
//     if (!file) return;
//     const loadEvent = new CustomEvent('load-json-file', { detail: file });
//     window.dispatchEvent(loadEvent);
//   };

//   const handleExportPng = () => {
//     window.dispatchEvent(new Event('export-image'));
//   };

//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (!e.target.closest('.profile-dropdown')) {
//         setShowMenu(false);
//       }
//     };
//     document.addEventListener('click', handleClickOutside);
//     return () => document.removeEventListener('click', handleClickOutside);
//   }, []);

//   return (
//     <header className="h-14 flex items-center justify-between px-4 bg-white text-gray-900 border-b border-gray-200 shadow-md z-20">
//       {/* Left Section */}
//       <div className="flex items-center gap-4">
//         <IconButton
//           icon={<FaBars />}
//           onClick={toggleSidebar}
//           tooltip="Toggle Sidebar"
//           className="md:hidden text-gray-700 hover:bg-blue-100 hover:text-blue-700"
//         />
//         <h1 className="text-lg font-bold text-blue-800 whitespace-nowrap" onClick={() => navigate('/e')} style={{cursor: 'pointer'}}>Innotrat-IDE</h1>
//       </div>

//       {/* Center Toolbar */}
//       <div className="hidden md:flex items-center gap-2 p-1 border border-gray-200 rounded-lg bg-white">
//         <IconButton icon={<FaUndo />} onClick={() => dispatch(undo())} tooltip="Undo" />
//         <IconButton icon={<FaRedo />} onClick={() => dispatch(redo())} tooltip="Redo" />
//         <div className="w-px h-6 bg-gray-300 mx-1" />
//         <IconButton icon={<FaSearchMinus />} onClick={onZoomOut} tooltip="Zoom Out" />
//         {/*<span className="px-2 text-sm text-gray-500 w-16 text-center">{`${Math.round((zoom || 1) * 100)}%`}</span>*/}
//         <IconButton icon={<FaSearchPlus />} onClick={onZoomIn} tooltip="Zoom In" />
//         <button
//           onClick={() => navigate('/el')}
//           className="flex items-center gap-2 px-3 py-2 md:px-4 bg-blue-100 hover:bg-blue-200 rounded-md text-sm font-semibold text-blue-700 hover:text-blue-900 transition-colors"
//         >
//           <span>Block-Diagram</span>
//         </button>
//       </div>

//       {/* Right Section */}
//       <div className="flex items-center gap-2">
//         <Tooltip text="Load from JSON">
//           <label className="p-2 rounded-md text-gray-500 hover:text-blue-700 transition-all duration-200 cursor-pointer">
//             <FaFileUpload />
//             <input type="file" accept=".json" className="hidden" onChange={handleFileChange} />
//           </label>
//         </Tooltip>
//         <IconButton icon={<FaSave />} onClick={() => window.dispatchEvent(new Event('save-json'))} tooltip="Save json" />
//         <Tooltip text="Export as PNG">
//           <button
//             onClick={handleExportPng}
//             className="flex items-center gap-2 px-3 py-2 md:px-4 bg-blue-100 hover:bg-blue-200 rounded-md text-sm font-semibold text-blue-700 hover:text-blue-900 transition-colors"
//           >
//             <FaShare className="hidden md:inline" />
//             <span>Export</span>
//           </button>
//         </Tooltip>

//         {/* Profile Dropdown */}
//         <div className="relative profile-dropdown">
//           <button
//             onClick={() => setShowMenu((prev) => !prev)}
//             className="flex items-center gap-2 px-2 py-1.5 rounded-md text-blue-700 hover:bg-blue-100 hover:text-blue-900 transition-all duration-200"
//           >
//             <FaUserCircle className="text-2xl" />
//           </button>

//           {showMenu && (
//             <div className="absolute right-0 mt-2 w-40 border border-gray-200 rounded-md shadow-lg z-50 bg-white">
//               {/* <button
//                 className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-100 transition"
//                 onClick={() => {
//                   setShowMenu(false);
//                   toast.info("Go to profile (to be implemented)");
//                 }}
//               >
//                 Profile
//               </button> */}
//               <button
//                 className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-blue-100 transition"
//                 onClick={() => {
//                   localStorage.removeItem('user');
//                   localStorage.removeItem('token');
//                   setToken('');
//                   setShowMenu(false);
//                   navigate('/login');
//                 }}
//               >
//                 Sign Out
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </header>
//   );
// }
// header.jsx ends here

//App router file 

// import { Routes, Route, Navigate } from 'react-router-dom';
// import Login from './src/components/Login';
// import ProtectedRoute from './src/components/ProtectedRoute';
// import Layout from './src/components/Layout';
// import Layoutone from './src/components/Layoutone';
// import Register from './src/components/Register';

// export default function AppRouter() {
//   return (
//     <Routes>
//       <Route path="/login" element={<Login />} />
//       <Route path="/signup" element={<Register />} />
//       <Route path="/" element={<Navigate to="/e" replace />} />
//       <Route
//         path="/e"
//         element={
//           <ProtectedRoute>
//             <Layout />
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/el"
//         element={
//           <ProtectedRoute>
//             <Layoutone />
//           </ProtectedRoute>
//         }
//       />
//       <Route path="*" element={<Navigate to="/e" replace />} />
//     </Routes>
//   );
// } 
// AppRouter.jsx ends here

//login page file
// import { useNavigate } from 'react-router-dom';
// export default function Login() {
//   const navigate = useNavigate();
//   const handleLogin = () => {
//     localStorage.setItem('user', 'demo');
//     navigate('/e');
//   };
//   return (
//     <div className="h-screen flex items-center justify-center bg-gray-900 text-white">
//       <button onClick={handleLogin} className="bg-blue-600 px-6 py-2 rounded">Login</button>
//     </div>
//   );
// // }
// import { useContext, useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { StoreContext } from '../context/StoreContext';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { assets } from '../assets/assets'; // your icons
// import './LoginPopup.css';

// export default function Login() {
//   const { url, token, setToken } = useContext(StoreContext);
//   const navigate = useNavigate();

//   const [currState, setCurrState] = useState("Sign Up");
//   const [data, setData] = useState({ name: '', mobileNumber
//     : '', password: '' ,countryCode:''});

//   useEffect(() => {
//     if (token) navigate('/e');
//   }, [token]);

//   const onChangeHandler = (e) => {
//     const { name, value } = e.target;
//     setData((prev) => ({ ...prev, [name]: value }));
//   };

//   const onSubmit = async (e) => {
//     e.preventDefault();
//     const endpoint = currState === "Login" ? "https://eureka.innotrat.in/api/v1/auth/signin" : "https://eureka.innotrat.in/api/v1/auth/signup";

//     try {
//       const response = await axios.post(`${url}${endpoint}`, data);
//       if (response.data.success) {
//         setToken(response.data.token);
//         localStorage.setItem("token", response.data.token);
//         toast.success(`${currState} successful!`);
//         navigate('/e');
//       } else {
//         toast.error(response.data.message || "Something went wrong");
//       }
//     } catch (error) {
//       toast.error("Server error. Please try again.");
//     }
//   };

//   return (
//     <div className="login-popup">
//       <form onSubmit={onSubmit} className="login-popup-container">
//         <div className="login-popup-title">
//           <h2>{currState}</h2>
//           <img src={assets.cross_icon} alt="close" onClick={() => navigate('/')} />
//         </div>
//         <div className="login-popup-inputs">
//           {currState !== "Login" && (
//             <input type="text" name="name" value={data.name} onChange={onChangeHandler} placeholder="Your Name" required />
//           )}
//           <input type="mobileNumber" name="mobileNumber" value={data.mobileNumber} onChange={onChangeHandler} placeholder="Your mobileNumber" required />
//           <input type="countryCode" name="countryCode" value={data.countryCode} onChange={onChangeHandler} placeholder="Your countryCode" required />

//           <input type="password" name="password" value={data.password} onChange={onChangeHandler} placeholder="Your Password" required />
//         </div>
//         <button type="submit">{currState === "Sign Up" ? "Create Account" : "Login"}</button>
//         <div className="login-popup-condition">
//           <input type="checkbox" required />
//           <p>By continuing, I agree to terms & privacy policy.</p>
//         </div>
//         <p>
//           {currState === "Login" ? (
//             <>Create account? <span onClick={() => setCurrState("Sign Up")}>Sign Up</span></>
//           ) : (
//             <>Already have an account? <span onClick={() => setCurrState("Login")}>Login</span></>
//           )}
//         </p>
//       </form>
//     </div>
//   );
// }



// import { useContext, useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { StoreContext } from '../context/StoreContext';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { assets } from '../assets/assets';
// import './LoginPopup.css';

// export default function Login() {
//   const { setToken } = useContext(StoreContext);
//   const navigate = useNavigate();

//   const [currState, setCurrState] = useState("Sign Up");
//   const [data, setData] = useState({
//     name: '',
//     mobileNumber: '',
//     password: '',
//     countryCode: ''
//   });

//   useEffect(() => {
//     const savedToken = localStorage.getItem("token");
//     if (savedToken) {
//       setToken(savedToken);
//       navigate('/e');
//     }
//   }, []);

//   const onChangeHandler = (e) => {
//     const { name, value } = e.target;
//     setData((prev) => ({ ...prev, [name]: value }));
//   };

//   const onSubmit = async (e) => {
//     e.preventDefault();

//     const endpoint = currState === "Login"
//       ? "https://eureka.innotrat.in/api/v1/auth/signin"
//       : "https://eureka.innotrat.in/api/v1/auth/signup";

//     try {
//       const response = await axios.post(endpoint, data);

//       if (response.data.status === 'success') {
//         toast.success(`${currState} successful!`);

//         if (response.data.token) {
//           setToken(response.data.token);
//           localStorage.setItem("token", response.data.token);
//         }

//         navigate('/e');
//       } else {
//         toast.error(response.data.message || "Something went wrong");
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Server error. Please try again.");
//     }
//   };

//   return (
//     <div className="login-popup">
//       <form onSubmit={onSubmit} className="login-popup-container">
//         <div className="login-popup-title">
//           <h2>{currState}</h2>
//           <img src={assets.cross_icon} alt="close" onClick={() => navigate('/')} />
//         </div>

//         <div className="login-popup-inputs">
//           {currState !== "Login" && (
//             <input
//               type="text"
//               name="name"
//               value={data.name}
//               onChange={onChangeHandler}
//               placeholder="Your Name"
//               required
//             />
//           )}
//           <input
//             type="text"
//             name="mobileNumber"
//             value={data.mobileNumber}
//             onChange={onChangeHandler}
//             placeholder="Your Mobile Number"
//             required
//           />
//           <input
//             type="text"
//             name="countryCode"
//             value={data.countryCode}
//             onChange={onChangeHandler}
//             placeholder="Country Code (e.g. +91)"
//             required
//           />
//           <input
//             type="password"
//             name="password"
//             value={data.password}
//             onChange={onChangeHandler}
//             placeholder="Your Password"
//             required
//           />
//         </div>

//         <button type="submit">
//           {currState === "Sign Up" ? "Create Account" : "Login"}
//         </button>

//         <div className="login-popup-condition">
//           <input type="checkbox" required />
//           <p>By continuing, I agree to terms & privacy policy.</p>
//         </div>

//         <p>
//           {currState === "Login" ? (
//             <>Create account? <span onClick={() => setCurrState("Sign Up")}>Sign Up</span></>
//           ) : (
//             <>Already have an account? <span onClick={() => setCurrState("Login")}>Login</span></>
//           )}
//         </p>
//       </form>
//     </div>
//   );
// }
//login.jsx ends here

//dragable shape file


// import { useDrag } from 'react-dnd';
// import { useEffect } from 'react';
// import { getEmptyImage } from 'react-dnd-html5-backend';

// export default function DraggableShape({ shape }) {
//   const [{ isDragging }, drag, preview] = useDrag(() => ({
//     type: 'shape',
//     item: { shape },
//     collect: (monitor) => ({
//       isDragging: !!monitor.isDragging(),
//     }),
//   }));

//   useEffect(() => {
//     preview(getEmptyImage(), { captureDraggingState: true });
//   }, [preview]);

//   return (
//     <div
//       ref={drag}
//       className={`w-[80px] h-[80px] border p-2 m-1 rounded cursor-move bg-white shadow ${
//         isDragging ? 'opacity-50' : ''
//       }`}
//     >
//       <svg
//         viewBox={shape.icon?.viewBox || '0 0 100 100'}
//         className="w-full h-full"
//         preserveAspectRatio="xMidYMid meet"
//       >
//         <path
//           d={shape.icon?.path || ''}
//           fill={shape.icon?.fill || '#4B5563'}
//           stroke={shape.icon?.stroke || '#1F2937'}
//           strokeWidth={shape.icon?.strokeWidth || '1'}
//         />
//       </svg>
//       <div className="text-xs text-center text-gray-700 mt-1">{shape.name}</div>
//     </div>
//   );
// }





// // import { useDrag } from 'react-dnd';
// // import { useEffect } from 'react';
// // import { getEmptyImage } from 'react-dnd-html5-backend';



// // export default function DraggableShape({ shape }) {
// //   const [{ isDragging }, drag] = useDrag(() => ({
// //     type: 'shape',
// //     item: { shape },
// //     collect: (monitor) => ({
// //       isDragging: !!monitor.isDragging(),
// //     }),
// //   }));
// // useEffect(() => {
// //   dragPreview(getEmptyImage(), { captureDraggingState: true });
// // }, []);
// //   return (
// //    <div
// //   ref={drag}
// //   className={`w-[80px] h-[80px] border p-2 m-1 rounded cursor-move bg-white shadow ${
// //     isDragging ? 'opacity-50' : ''
// //   }`}
// // >

// //       {/* <svg
// //         viewBox={shape.icon?.viewBox || '0 0 100 100'}
// //         width="100%"
// //         height="100%"
// //         preserveAspectRatio="xMidYMid meet"
// //         className="w-12 h-12 mx-auto"
// //       > */}
// //       <svg
// //   viewBox={shape.icon?.viewBox || '0 0 100 100'}
// //   className="w-full h-full"
// //   preserveAspectRatio="xMidYMid meet"
// // >

// //         <path
// //           d={shape.icon?.path || ''}
// //           fill={shape.icon?.fill || '#4B5563'}
// //           stroke={shape.icon?.stroke || '#1F2937'}
// //           strokeWidth={shape.icon?.strokeWidth || '1'}
// //         />
// //       </svg>
// //       <div className="text-xs text-center text-gray-700 mt-1">{shape.name}</div>
// //     </div>
// //   );
// // }


// // import { useDrag } from 'react-dnd';

// // export default function DraggableShape({ shape }) {
// //   const [{ isDragging }, drag] = useDrag(() => ({
// //     type: 'shape',
// //     item: { shape },
// //     collect: (monitor) => ({
// //       isDragging: !!monitor.isDragging(),
// //     }),
// //   }));

// //   return (
// //     <div
// //       ref={drag}
// //       className={`border p-2 m-1 rounded cursor-move bg-white shadow ${
// //         isDragging ? 'opacity-50' : ''
// //       }`}
// //     >
// //      <svg
// //   viewBox={shape.icon?.viewBox || "0 0 100 100"}
// //   width="100%"
// //   height="100%"
// //   preserveAspectRatio="xMidYMid meet"
// //    className="w-12 h-12 mx-auto"
// // >
// //  d={shape.icon?.path || ""}
// //           fill={shape.icon?.fill || "#4B5563"}
// //           stroke={shape.icon?.stroke || "#1F2937"}
// //           strokeWidth={shape.icon?.strokeWidth || "1"}
// // </svg>

// //        <div className="text-xs text-center text-gray-700 mt-1">{shape.name}</div>
// //     </div>
// //   );
// // }
// draggableShape.jsx ends here

//canvasinner file 
// import React, { useRef, useEffect, useCallback } from 'react';
// import ReactFlow, {
//   Background,
//   Controls,
//   addEdge,
//   useReactFlow,
//   ReactFlowProvider,
//   applyNodeChanges,
//   applyEdgeChanges,
// } from 'reactflow';
// import { useDrop } from 'react-dnd';
// import { useDispatch, useSelector } from 'react-redux';
// import { ActionCreators as UndoActionCreators } from 'redux-undo';
// import { setNodes, setEdges } from '../features/flow/flowSlice';
// import { selectNodes, selectEdges } from '../features/flow/flowSelectors';
// import { v4 as uuidv4 } from 'uuid';
// import { toPng } from 'html-to-image';
// import ResizableNode from './ResizableNode';
// import { applyAutoLayout } from '../utils/autoLayout';
// import 'reactflow/dist/style.css';
// import CustomEdge from './CustomEdge';

// const nodeTypes = {
//   resizable: ResizableNode,
// };
// const edgeTypes = {
//   custom: CustomEdge,
// };
// const getCurrentUserColor = () => {
//   // Replace with actual user color logic if available
//   return '#4F46E5'; // Default indigo
// };
// const edgePresetColors = ['#4F46E5', '#f59e42', '#22c55e', '#ef4444', '#a21caf', '#fbbf24', '#0ea5e9', '#64748b'];

// function CanvasContent() {
//   const dispatch = useDispatch();
//   const nodes = useSelector(selectNodes);
//   const edges = useSelector(selectEdges);
//   const { screenToFlowPosition } = useReactFlow();
//   const flowRef = useRef(null);
//   const [selectedEdgeId, setSelectedEdgeId] = React.useState(null);
//   const [colorPickerValue, setColorPickerValue] = React.useState('#4F46E5');

//   const [, drop] = useDrop(() => ({
//     accept: 'shape',
//     drop: (item, monitor) => {
//       const offset = monitor.getClientOffset();
//       if (!offset) return;

//       const position = screenToFlowPosition(offset);

//       const newNode = {
//         id: uuidv4(),
//         type: 'resizable',
//         position,
//         data: {
//           label: item.shape.name,
//           shapeId: item.shape.id,
//           style: { width: 100, height: 60 },
//         },
//         style: { width: 100, height: 60 },
//       };

//       dispatch(setNodes([...nodes, newNode]));
//     },
//   }), [nodes]);

//   const saveToJSON = () => {
//     const json = JSON.stringify({ nodes, edges });
//     const blob = new Blob([json], { type: 'application/json' });
//     const link = document.createElement('a');
//     link.href = URL.createObjectURL(blob);
//     link.download = 'flow.json';
//     link.click();
//   };

//   const onConnect = useCallback(
//     (connection) => {
//       // Ensure sourceHandle and targetHandle are set for all sides
//       const newEdge = {
//         ...connection,
//         id: uuidv4(),
//         type: 'custom',
//         color: getCurrentUserColor(),
//         data: { color: getCurrentUserColor() },
//         sourceHandle: connection.sourceHandle,
//         targetHandle: connection.targetHandle,
//       };
//       dispatch(setEdges([...edges, newEdge]));
//     },
//     [dispatch, edges]
//   );
//   const onEdgeClick = useCallback((event, edge) => {
//     event.stopPropagation();
//     setSelectedEdgeId(edge.id);
//     setColorPickerValue(edge.color || '#4F46E5');
//   }, []);
//   const handleColorChange = (e) => {
//     const newColor = e.target.value;
//     setColorPickerValue(newColor);
//     const updatedEdges = edges.map((edge) =>
//       edge.id === selectedEdgeId ? { ...edge, color: newColor, data: { ...edge.data, color: newColor } } : edge
//     );
//     dispatch(setEdges(updatedEdges));
//   };

//   const loadFromJSON = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     const reader = new FileReader();
//     reader.onload = () => {
//       try {
//         let { nodes: loadedNodes, edges: loadedEdges } = JSON.parse(reader.result);
//         // Autofix nodes
//         loadedNodes = loadedNodes.map(node => ({
//           ...node,
//           position: node.position || { x: 0, y: 0 },
//           data: {
//             label: node.data?.label || node.data?.shape?.name || 'Node',
//             ...node.data
//           },
//           style: {
//             width: node.style?.width || 100,
//             height: node.style?.height || 60,
//             background: node.style?.background || '#2563eb',
//             ...node.style
//           }
//         }));
//         // Autofix edges
//         loadedEdges = loadedEdges.map(edge => ({
//           ...edge,
//           color: edge.color || '#4F46E5',
//           type: edge.type || 'custom',
//         }));
//         dispatch(setNodes(loadedNodes));
//         dispatch(setEdges(loadedEdges));
//       } catch (err) {
//         alert('Invalid JSON file');
//       }
//     };
//     reader.readAsText(file);
//   };

//   const exportAsImage = () => {
//     if (!flowRef.current) return;
//     toPng(flowRef.current).then((dataUrl) => {
//       const link = document.createElement('a');
//       link.download = 'flowchart.png';
//       link.href = dataUrl;
//       link.click();
//     });
//   };

//   const handleKeyDown = useCallback((e) => {
//     if (e.ctrlKey && e.key === 's') {
//       e.preventDefault();
//       saveToJSON();
//     } else if (e.ctrlKey && e.key === 'z') {
//       e.preventDefault();
//       dispatch(UndoActionCreators.undo());
//     } else if (e.ctrlKey && e.key === 'y') {
//       e.preventDefault();
//       dispatch(UndoActionCreators.redo());
//     } else if (e.key === 'Delete') {
//       const selectedNodes = nodes.filter(n => n.selected);
//       if (selectedNodes.length > 0) {
//         dispatch(setNodes(nodes.filter(n => !n.selected)));
//       }
//     }
//   }, [dispatch, nodes]);

//   useEffect(() => {
//     document.addEventListener('keydown', handleKeyDown);
//     return () => document.removeEventListener('keydown', handleKeyDown);
//   }, [handleKeyDown]);
// useEffect(() => {
//   const handleAutoLayout = async () => {
//     const newNodes = await applyAutoLayout(nodes, edges, 'RIGHT');
//     dispatch(setNodes(newNodes));
//   };

//   window.addEventListener('auto-layout', handleAutoLayout);
//   return () => window.removeEventListener('auto-layout', handleAutoLayout);
// }, [nodes, edges, dispatch]);
//   return (
//     <div
//       ref={(el) => {
//         drop(el);
//         flowRef.current = el;
//       }}
//       tabIndex={0}
//       onKeyDown={handleKeyDown}
//       className="w-full h-full bg-gray-800 border-4 border-green-500"
//     >
//       {selectedEdgeId && (
//         <div className="absolute z-50 top-4 right-4 bg-white p-2 rounded shadow border flex flex-col items-center">
//           <div className="flex items-center mb-2">
//             <label className="mr-2 text-gray-700">Edge Color:</label>
//             {edgePresetColors.map((color) => (
//               <button
//                 key={color}
//                 className="w-6 h-6 rounded-full border-2 border-gray-300 hover:border-black mx-0.5"
//                 style={{ background: color }}
//                 onClick={() => handleColorChange({ target: { value: color } })}
//               />
//             ))}
//           </div>
//           <input
//             type="color"
//             value={colorPickerValue}
//             onChange={handleColorChange}
//           />
//           <button
//             className="ml-2 px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 mt-2"
//             onClick={() => setSelectedEdgeId(null)}
//           >
//             Close
//           </button>
//         </div>
//       )}
//       <ReactFlow
//         nodes={nodes}
//         edges={edges}
//         onNodesChange={(changes) => dispatch(setNodes(applyNodeChanges(changes, nodes)))}
//         onEdgesChange={(changes) => dispatch(setEdges(applyEdgeChanges(changes, edges)))}
//         onConnect={onConnect}
//         onEdgeClick={onEdgeClick}
//         fitView
//         selectionOnDrag
//         multiSelectionKeyCode={['Meta', 'Control']}
//         nodeTypes={nodeTypes}
//         edgeTypes={edgeTypes}
//         className="bg-gray-800"
//         connectionMode="loose"
//         isValidConnection={() => true}
//       >
//         <Background color="#444" gap={16} />
//         <Controls />
//       </ReactFlow>
//     </div>
//   );
// }

// // ✅ Wrapper with ReactFlowProvider
// // export default function CanvasInner() {
// //   return (
// //      <div className="w-full h-[calc(100vh-64px)]"> {/* Adjust this if your header is 64px */}
     
// //         <CanvasContent />
     
// //     </div>
// //   );
// // }
// export default function CanvasInner() {
//   return (
//     <ReactFlowProvider>
//       <div className="w-full h-[calc(100vh-64px)]">
//         <CanvasContent />
//       </div>
//     </ReactFlowProvider>
//   );
// }
// canvasinner.jsx ends here