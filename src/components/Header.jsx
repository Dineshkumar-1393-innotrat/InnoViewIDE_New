

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
//   FaUndo, FaRedo, FaFileUpload, FaSave,
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
//         <h1 className="text-lg font-bold text-blue-800 whitespace-nowrap" onClick={() => navigate('/e')} style={{cursor: 'pointer'}}>INNO-IDE</h1>
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



// import React, { useContext, useEffect, useState } from 'react';
// import {
//   FaUndo, FaRedo, FaFileUpload, FaSave,
//   FaSearchPlus, FaSearchMinus, FaBars, FaShare, FaTimes, FaAlignLeft,
// } from 'react-icons/fa';
// import { useDispatch } from 'react-redux';
// import { undo, redo } from '../features/flow/flowSlice';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { StoreContext } from '../context/StoreContext';
// import { motion } from 'framer-motion';

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

// export default function Header({ toggleSidebar, onZoomIn, onZoomOut }) {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const currentPath = location.pathname;

//   const { setToken } = useContext(StoreContext);
//   const [showMobileMenu, setShowMobileMenu] = useState(false);

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
//       if (!e.target.closest('.mobile-menu')) {
//         setShowMobileMenu(false);
//       }
//     };
//     document.addEventListener('click', handleClickOutside);
//     return () => document.removeEventListener('click', handleClickOutside);
//   }, []);

//   return (
//     <header className="h-14 flex items-center justify-between px-4 bg-white text-gray-900 border-b border-gray-200 shadow-md z-20">
//       {/* Left: Logo & Sidebar Toggle */}
//       <div className="flex items-center gap-4">
//         <IconButton
//           icon={<FaAlignLeft />}
//           onClick={toggleSidebar}
//           tooltip="Toggle Sidebar"
//           className="lg:hidden text-gray-700"
//         />
//     {/* <IconButton
//           icon={<FaBars />}
//           onClick={() => setShowMobileMenu(!showMobileMenu)}
//           tooltip="Menu"
//           className="lg:hidden text-gray-700"
//         /> */}
//         <h1
//           className="text-lg font-bold text-blue-800 whitespace-nowrap cursor-pointer"
//           onClick={() => navigate('/e')}
//         >
//           INNOIDE
//         </h1>
//       </div>

//       {/* Center: Toolbar */}
//       <motion.div
//         initial={{ opacity: 0, y: -5 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="hidden md:flex items-center gap-2 p-1 border border-gray-200 rounded-lg bg-white"
//       >
//         <IconButton icon={<FaUndo />} onClick={() => dispatch(undo())} tooltip="Undo" />
//         <IconButton icon={<FaRedo />} onClick={() => dispatch(redo())} tooltip="Redo" />
//         <div className="w-px h-6 bg-gray-300 mx-1" />
//         <IconButton icon={<FaSearchMinus />} onClick={onZoomOut} tooltip="Zoom Out" />
//         <IconButton icon={<FaSearchPlus />} onClick={onZoomIn} tooltip="Zoom In" />

//         {/* Flowchart / Block Diagram toggle buttons */}
//         {(currentPath === '/e' || currentPath === '/el') && (
//           <>
//             {currentPath === '/e' && (
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={() => navigate('/el')}
//                 className="flex items-center gap-2 px-3 py-2 md:px-4 bg-blue-100 hover:bg-blue-200 rounded-md text-sm font-semibold text-blue-700 hover:text-blue-900 transition-colors"
//               >
//                 Block Diagram
//               </motion.button>
//             )}
//             {currentPath === '/el' && (
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={() => navigate('/e')}
//                 className="flex items-center gap-2 px-3 py-2 md:px-4 bg-blue-100 hover:bg-blue-200 rounded-md text-sm font-semibold text-blue-700 hover:text-blue-900 transition-colors"
//               >
//                 Flowchart
//               </motion.button>
//             )}
//           </>
//         )}
//       </motion.div>

//       {/* Right: Export, Save, Load */}
//       <div className="flex items-center gap-2">
//         <Tooltip text="Load from JSON">
//           <label className="p-2 rounded-md text-gray-500 hover:text-blue-700 cursor-pointer">
//             <FaFileUpload />
//             <input type="file" accept=".json" className="hidden" onChange={handleFileChange} />
//           </label>
//         </Tooltip>
//         <IconButton
//           icon={<FaSave />}
//           onClick={() => window.dispatchEvent(new Event('save-json'))}
//           tooltip="Save JSON"
//         />
//         <Tooltip text="Export as PNG">
//           <button
//             onClick={handleExportPng}
//             className="flex items-center gap-2 px-3 py-2 bg-blue-100 hover:bg-blue-200 rounded-md text-sm font-semibold text-blue-700 hover:text-blue-900"
//           >
//             <FaShare className="hidden md:inline" />
//             <span>Export</span>
//           </button>
//         </Tooltip>
//       </div>

//       {/* Mobile Menu */}
//       {showMobileMenu && (
//         <motion.div
//           initial={{ opacity: 0, y: -10 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="absolute top-14 left-0 w-full bg-white border-t border-gray-200 shadow-lg z-50 md:hidden mobile-menu"
//         >
//           <div className="flex flex-col p-3 space-y-2">
//             <button onClick={() => dispatch(undo())} className="mobile-btn"><FaUndo /> Undo</button>
//             <button onClick={() => dispatch(redo())} className="mobile-btn"><FaRedo /> Redo</button>
//             <button onClick={onZoomOut} className="mobile-btn"><FaSearchMinus /> Zoom Out</button>
//             <button onClick={onZoomIn} className="mobile-btn"><FaSearchPlus /> Zoom In</button>
//             <button onClick={() => window.dispatchEvent(new Event('save-json'))} className="mobile-btn"><FaSave /> Save</button>
//             <button onClick={handleExportPng} className="mobile-btn"><FaShare /> Export</button>
//             {currentPath === '/e' && (
//               <button onClick={() => navigate('/el')} className="mobile-btn">Block Diagram</button>
//             )}
//             {currentPath === '/el' && (
//               <button onClick={() => navigate('/e')} className="mobile-btn">Flowchart</button>
//             )}
//             <button
//               onClick={() => setShowMobileMenu(false)}
//               className="mt-2 text-sm text-red-600 self-end px-3 py-1 rounded hover:bg-red-50"
//             >
//               <FaTimes className="inline mr-1" /> Close
//             </button>
//           </div>
//         </motion.div>
//       )}
//     </header>
//   );
// }

import React, { useContext, useEffect, useState } from 'react';
import {
  FaUndo, FaRedo, FaFileUpload, FaSave,FaUserCircle,
  FaSearchPlus, FaSearchMinus, FaBars, FaShare, FaTimes,
  FaSignInAlt, FaSignOutAlt, FaCode, FaPlay, FaProjectDiagram, FaSitemap,
} from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { undo, redo } from '../features/flow/flowSlice';
import { useNavigate, useLocation } from 'react-router-dom';
import { StoreContext } from '../context/StoreContext';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const { setToken } = useContext(StoreContext);

  const currentPath = location.pathname;

  // Check if user is logged in
  const isLoggedIn = () => {
    return localStorage.getItem('token') !== null;
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setToken('');
    setShowMobileMenu(false);
    navigate('/login');
  };

  // Handle login
  const handleLogin = () => {
    setShowMobileMenu(false);
    navigate('/login');
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const loadEvent = new CustomEvent('load-json-file', { detail: file });
    window.dispatchEvent(loadEvent);
  };

  const handleExportPng = () => {
    window.dispatchEvent(new Event('export-image'));
  };

  // Close mobile menu on outside click
  useEffect(() => {
    if (!showMobileMenu) return;
    const handleClickOutside = (e) => {
      if (!e.target.closest('.mobile-menu') && !e.target.closest('.mobile-menu-btn')) {
        setShowMobileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMobileMenu]);

  // Close profile dropdown on outside click
  useEffect(() => {
    if (!showMenu) return;
    const handleClickOutside = (e) => {
      if (!e.target.closest('.profile-dropdown')) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMenu]);

  // Mobile menu actions
  const mobileMenuActions = [
    {
      icon: <FaUndo />, label: 'Undo', onClick: () => { dispatch(undo()); setShowMobileMenu(false); }
    },
    {
      icon: <FaRedo />, label: 'Redo', onClick: () => { dispatch(redo()); setShowMobileMenu(false); }
    },
    {
      icon: <FaSearchMinus />, label: 'Zoom Out', onClick: () => { onZoomOut && onZoomOut(); setShowMobileMenu(false); }
    },
    {
      icon: <FaSearchPlus />, label: 'Zoom In', onClick: () => { onZoomIn && onZoomIn(); setShowMobileMenu(false); }
    },
    {
      icon: <FaSave />, label: 'Save JSON', onClick: () => { window.dispatchEvent(new Event('save-json')); setShowMobileMenu(false); }
    },
    {
      icon: <FaShare />, label: 'Export as PNG', onClick: () => { handleExportPng(); setShowMobileMenu(false); }
    },
    {
      icon: <FaCode />, label: 'Embedded', onClick: () => { window.open('https://ide.innotrat.in/embedded', '_blank'); setShowMobileMenu(false); }
    },
    {
      icon: <FaPlay />, label: 'Simulation', onClick: () => { window.open('https://ide.innotrat.in/simulation', '_blank'); setShowMobileMenu(false); }
    },
    {
      icon: <FaProjectDiagram />, label: 'Flowchart', onClick: () => { navigate('/e'); setShowMobileMenu(false); }
    },
    {
      icon: <FaSitemap />, label: 'Block Diagram', onClick: () => { navigate('/el'); setShowMobileMenu(false); }
    },
  ];

  return (
    <header className="h-16 flex items-center justify-between px-4 bg-gradient-to-r from-blue-50 via-white to-blue-100 text-gray-900 border-b border-gray-200 shadow-md z-30 relative">
      {/* Left: Logo & Sidebar Toggle */}
      <div className="flex items-center gap-4">
        <button
          className="md:hidden mobile-menu-btn p-2 rounded-md text-gray-700 hover:bg-blue-100 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
          onClick={() => setShowMobileMenu((v) => !v)}
          aria-label="Open menu"
        >
          <FaBars size={22} />
        </button>
        <h1
          className="text-xl font-extrabold text-blue-800 whitespace-nowrap cursor-pointer tracking-tight drop-shadow-sm"
          onClick={() => navigate('/e')}
        >
          Inno-IDE
        </h1>
      </div>

      {/* Center: Toolbar Buttons (Desktop) */}
      <motion.div
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        className="hidden md:flex items-center gap-3 p-1 border border-gray-200 rounded-xl bg-white/80 shadow-sm backdrop-blur-sm"
      >
        <IconButton icon={<FaUndo />} onClick={() => dispatch(undo())} tooltip="Undo" />
        <IconButton icon={<FaRedo />} onClick={() => dispatch(redo())} tooltip="Redo" />
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <IconButton icon={<FaSearchMinus />} onClick={onZoomOut} tooltip="Zoom Out" />
        {/* <span className="px-2 text-sm text-gray-500 w-16 text-center select-none">
          {Number.isFinite(zoom) ? `${Math.round(zoom * 100)}%` : '100%'}
        </span> */}
        <IconButton icon={<FaSearchPlus />} onClick={onZoomIn} tooltip="Zoom In" />
        {currentPath === '/e' && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/el')}
            className="flex items-center gap-2 px-3 py-2 md:px-4 bg-blue-100 hover:bg-blue-200 rounded-md text-sm font-semibold text-blue-700 hover:text-blue-900 transition-colors shadow-sm"
          >
            <FaSitemap />
            Block-Diagram
          </motion.button>
        )}
        {currentPath === '/el' && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/e')}
            className="flex items-center gap-2 px-3 py-2 md:px-4 bg-blue-100 hover:bg-blue-200 rounded-md text-sm font-semibold text-blue-700 hover:text-blue-900 transition-colors shadow-sm"
          >
            <FaProjectDiagram />
            Flowchart
          </motion.button>
        )}
      </motion.div>

      {/* Right: Actions (Desktop) */}
      <div className="hidden md:flex items-center gap-2">
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
            className="flex items-center gap-2 px-3 py-2 md:px-4 bg-blue-100 hover:bg-blue-200 rounded-md text-sm font-semibold text-blue-700 hover:text-blue-900 transition-colors shadow-sm"
          >
            <FaShare className="hidden md:inline" />
            <span>Export</span>
          </button>
        </Tooltip>
        <Tooltip text="Go to Embedded View">
          <a
            href="https://ide.innotrat.in/embedded"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 md:px-4 bg-blue-100 hover:bg-blue-200 rounded-md text-sm font-semibold text-blue-700 hover:text-blue-900 transition-colors shadow-sm"
          >
            <FaCode />
            <span>Embedded</span>
          </a>
        </Tooltip>
        <Tooltip text="Go to Simulation View">
          <a
            href="https://ide.innotrat.in/simulation"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 md:px-4 bg-blue-100 hover:bg-blue-200 rounded-md text-sm font-semibold text-blue-700 hover:text-blue-900 transition-colors shadow-sm"
          >
            <FaPlay />
            <span>Simulation</span>
          </a>
        </Tooltip>
        
        {/* Profile Dropdown */}
        <Tooltip text="Account Menu">
          <div className="relative profile-dropdown">
            <button
              onClick={() => setShowMenu((prev) => !prev)}
              className="flex items-center gap-2 px-2 py-1.5 rounded-md text-blue-700 hover:bg-blue-100 hover:text-blue-900 transition-all duration-200"
            >
              <FaUserCircle className="text-2xl" />
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-2 w-40 border border-gray-200 rounded-md shadow-lg z-50 bg-white">
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
        </Tooltip>
      </div>

      {/* Modern Mobile Menu Overlay & Drawer */}
      <AnimatePresence>
        {showMobileMenu && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileMenu(false)}
            />
            
            {/* Modern Drawer */}
            <motion.div
              className="fixed top-0 left-0 w-full mobile-menu z-50 bg-white/95 backdrop-blur-md rounded-b-3xl shadow-2xl border border-white/20"
              initial={{ y: -300, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -300, opacity: 0, scale: 0.95 }}
              transition={{ 
                type: 'spring', 
                stiffness: 400, 
                damping: 40,
                mass: 0.8
              }}
            >
              {/* Header with gradient */}
              <div className="relative px-6 py-4 bg-gradient-to-r from-blue-50 via-white to-blue-50 border-b border-blue-100/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                      Inno-IDE Menu
                    </span>
                  </div>
                  <button
                    className="p-2 rounded-full bg-white/80 hover:bg-white shadow-sm border border-gray-200/50 text-gray-600 hover:text-gray-800 transition-all duration-200"
                    onClick={() => setShowMobileMenu(false)}
                    aria-label="Close menu"
                  >
                    <FaTimes size={18} />
                  </button>
                </div>
              </div>
              
              {/* Menu Content */}
              <div className="px-4 py-6 space-y-2">
                {/* Main Actions */}
                <div className="space-y-1">
                  {mobileMenuActions.map((action, idx) => (
                    <motion.button
                      key={action.label}
                      onClick={action.onClick}
                      className="flex items-center gap-4 w-full px-4 py-4 rounded-2xl text-base font-medium text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100/50 focus:outline-none focus:ring-2 focus:ring-blue-200/50 transition-all duration-200 group"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <span className="text-xl text-blue-600 group-hover:text-blue-700 transition-colors">
                        {action.icon}
                      </span>
                      <span className="flex-1 text-left">{action.label}</span>
                    </motion.button>
                  ))}
                </div>
                
                {/* File Upload */}
                <motion.label 
                  className="flex items-center gap-4 w-full px-4 py-4 rounded-2xl text-base font-medium text-gray-700 hover:bg-gradient-to-r hover:from-green-50 hover:to-green-100/50 cursor-pointer group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: mobileMenuActions.length * 0.05 }}
                >
                  <span className="text-xl text-green-600 group-hover:text-green-700 transition-colors">
                    <FaFileUpload />
                  </span>
                  <span className="flex-1 text-left">Load from JSON</span>
                  <input type="file" accept=".json" className="hidden" onChange={handleFileChange} />
                </motion.label>
                
                {/* Divider with gradient */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500 font-medium">Account</span>
                  </div>
                </div>
                
                {/* Auth Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (mobileMenuActions.length + 1) * 0.05 }}
                >
                  {isLoggedIn() ? (
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-4 w-full px-4 py-4 rounded-2xl text-base font-medium text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100/50 focus:outline-none focus:ring-2 focus:ring-red-200/50 transition-all duration-200 group"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="text-xl text-red-500 group-hover:text-red-600 transition-colors">
                        <FaSignOutAlt />
                      </span>
                      <span className="flex-1 text-left">Sign Out</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleLogin}
                      className="flex items-center gap-4 w-full px-4 py-4 rounded-2xl text-base font-medium text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100/50 focus:outline-none focus:ring-2 focus:ring-blue-200/50 transition-all duration-200 group"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="text-xl text-blue-500 group-hover:text-blue-600 transition-colors">
                        <FaSignInAlt />
                      </span>
                      <span className="flex-1 text-left">Login</span>
                    </button>
                  )}
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}