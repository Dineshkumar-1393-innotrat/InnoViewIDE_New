

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


import React, { useContext, useEffect, useState } from 'react';
import {
  FaUndo, FaRedo, FaFileUpload,FaSave,
  FaSearchPlus, FaSearchMinus, FaBars, FaShare, FaUserCircle,
} from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { undo, redo } from '../features/flow/flowSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { StoreContext } from '../context/StoreContext';

const Tooltip = ({ text, children }) => (
  <div className="relative group">
    {children}
    <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-max px-2 py-1 bg-white text-blue-700 text-xs rounded-md border border-gray-200 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-50 whitespace-nowrap">
      {text}
    </div>
  </div>
);

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
  const [showMenu, setShowMenu] = useState(false);
  const { setToken } = useContext(StoreContext);

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
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <IconButton
          icon={<FaBars />}
          onClick={toggleSidebar}
          tooltip="Toggle Sidebar"
          className="md:hidden text-gray-700 hover:bg-blue-100 hover:text-blue-700"
        />
        <h1 className="text-lg font-bold text-blue-800 whitespace-nowrap" onClick={() => navigate('/e')} style={{cursor: 'pointer'}}>Innotrat-IDE</h1>
      </div>

      {/* Center Toolbar */}
      <div className="hidden md:flex items-center gap-2 p-1 border border-gray-200 rounded-lg bg-white">
        <IconButton icon={<FaUndo />} onClick={() => dispatch(undo())} tooltip="Undo" />
        <IconButton icon={<FaRedo />} onClick={() => dispatch(redo())} tooltip="Redo" />
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <IconButton icon={<FaSearchMinus />} onClick={onZoomOut} tooltip="Zoom Out" />
        <span className="px-2 text-sm text-gray-500 w-16 text-center">{`${Math.round((zoom || 1) * 100)}%`}</span>
        <IconButton icon={<FaSearchPlus />} onClick={onZoomIn} tooltip="Zoom In" />
        <button
          onClick={() => navigate('/el')}
          className="flex items-center gap-2 px-3 py-2 md:px-4 bg-blue-100 hover:bg-blue-200 rounded-md text-sm font-semibold text-blue-700 hover:text-blue-900 transition-colors"
        >
          <span>Block-Diagram</span>
        </button>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        <Tooltip text="Load from JSON">
          <label className="p-2 rounded-md text-gray-500 hover:text-blue-700 transition-all duration-200 cursor-pointer">
            <FaFileUpload />
            <input type="file" accept=".json" className="hidden" onChange={handleFileChange} />
          </label>
        </Tooltip>
        <IconButton icon={<FaSave />} onClick={() => window.dispatchEvent(new Event('save-json'))} tooltip="Save json" />
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
            <div className="absolute right-0 mt-2 w-40 border border-gray-200 rounded-md shadow-lg z-50 bg-white">
              {/* <button
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-100 transition"
                onClick={() => {
                  setShowMenu(false);
                  toast.info("Go to profile (to be implemented)");
                }}
              >
                Profile
              </button> */}
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
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
