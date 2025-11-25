// import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import {
//   Blocks,
//   Braces,
//   ChevronDown,
//   BookOpen,
//   Download,
//   Presentation,
//   Save,
//   Settings,
//   Upload,
//   UserCircle,
//   Video,
//   ImageDown,
//   RotateCcw,
//   RotateCw,
//   BugPlay,
//   Zap,
//   Terminal,
//   Plus,
//   Cog,
//   Hammer,
//   Loader2,
//   Trash,
//   Radio,
//   Library,
//   Workflow,
//   Cpu,
//   Boxes,
//   Calculator,
// } from 'lucide-react';
// import './EditorNavbar.css';
// import hexLogo from '../assets/hex_bg.png';
// import DyteMeetingLauncher from './DyteMeetingLauncher';

// const IDENTITY_FIELDS = [
//   'name',
//   'fullName',
//   'username',
//   'userName',
//   'email',
//   'userEmail',
//   'mail',
//   'phone',
//   'mobileNumber',
//   'phoneNumber',
// ];

// const parseMaybeJSON = (raw) => {
//   if (!raw || typeof raw !== 'string') return null;
//   try {
//     return JSON.parse(raw);
//   } catch (error) {
//     console.warn('Failed to parse stored identity', error);
//     return null;
//   }
// };

// const hasIdentityInfo = (candidate) => {
//   if (!candidate || typeof candidate !== 'object') return false;
//   return IDENTITY_FIELDS.some((key) => {
//     const value = candidate[key];
//     return typeof value === 'string' && value.trim().length > 0;
//   });
// };

// const buildIdentity = (candidate) => {
//   if (!hasIdentityInfo(candidate)) return null;

//   const name =
//     candidate.name ||
//     candidate.fullName ||
//     candidate.username ||
//     candidate.userName ||
//     '';
//   const email = candidate.email || candidate.userEmail || candidate.mail || '';
//   const phone = candidate.phone || candidate.mobileNumber || candidate.phoneNumber || '';

//   const trimmedName = typeof name === 'string' ? name.trim() : '';
//   const trimmedEmail = typeof email === 'string' ? email.trim() : '';
//   const trimmedPhone = typeof phone === 'string' ? phone.trim() : '';

//   const primary = trimmedName || trimmedEmail || trimmedPhone;
//   if (!primary) return null;

//   return {
//     ...candidate,
//     name: trimmedName || primary,
//     email: trimmedEmail,
//     phone: trimmedPhone,
//   };
// };

// const loadIdentityFromStorage = () => {
//   if (typeof window === 'undefined') return null;

//   const sources = [
//     () => window.sessionStorage.getItem('currentUserIdentity'),
//     () => window.localStorage.getItem('currentUserIdentity'),
//     () => window.sessionStorage.getItem('userData'),
//     () => window.localStorage.getItem('userData'),
//   ];

//   for (const read of sources) {
//     const parsed = buildIdentity(parseMaybeJSON(read()));
//     if (parsed) {
//       return parsed;
//     }
//   }

//   return null;
// };
// const DEFAULT_TABS = ['Block Diagram', 'Flowchart', 'Simulation', 'Code Editor', 'Block Programming','MathCodeEditor'];

// const TAB_ICON_MAP = {
//   'Block Diagram': Blocks,
//   Flowchart: Workflow,
//   Simulation: Cpu,
//   'Code Editor': Braces,
//   'Block Programming': Boxes,
//   'MathCodeEditor': Calculator,
// };

// const EditorNavbar = ({
//   tabs = DEFAULT_TABS,
//   activeTab,
//   onTabChange,
//   onSaveJSON,
//   onLoadJSON,
//   onExportPNG,
//   onUndo,
//   onRedo,
//   onCreateNewProject,
//   onLibrariesClick,
//   user,
//   onLogout,
//   loginPath = '/',
//   isDeviceConnected = true,
// }) => {
//   const navigate = useNavigate();
//   const [accountOpen, setAccountOpen] = useState(false);
//   const accountRef = useRef(null);
//   const downloadRef = useRef(null);
//   const [activeMenu, setActiveMenu] = useState(null);
//   const menuRefs = {
//     file: useRef(null),
//     tools: useRef(null),
//     help: useRef(null),
//   };
//   const [isHelpReferenceOpen, setHelpReferenceOpen] = useState(false);
//   const [isCompiling, setIsCompiling] = useState(false);
//   const [isBuilding, setIsBuilding] = useState(false);
//   const [isDebugging, setIsDebugging] = useState(false);
//   const [isFlashing, setIsFlashing] = useState(false);
//   const [isErasing, setIsErasing] = useState(false);
//   const [isSerialActive, setIsSerialActive] = useState(false);
//   const [isTerminalOpen, setIsTerminalOpen] = useState(false);
//   const [isDownloadMenuOpen, setDownloadMenuOpen] = useState(false);

//   useEffect(() => {
//     if (!accountOpen && !activeMenu && !isDownloadMenuOpen) return;
//     const handlePointer = (event) => {
//       const clickedAccount = accountRef.current?.contains(event.target);
//       const clickedMenu = Object.values(menuRefs).some((ref) => ref.current?.contains(event.target));
//       const clickedDownload = downloadRef.current?.contains(event.target);
//       if (!clickedAccount) {
//         setAccountOpen(false);
//       }
//       if (!clickedMenu) {
//         setActiveMenu(null);
//       }
//       if (!clickedDownload) {
//         setDownloadMenuOpen(false);
//       }
//     };
//     document.addEventListener('pointerdown', handlePointer);
//     return () => document.removeEventListener('pointerdown', handlePointer);
//   }, [accountOpen, activeMenu, isDownloadMenuOpen]);

//   useEffect(() => {
//     if (!accountOpen && !activeMenu && !isHelpReferenceOpen && !isDownloadMenuOpen) return;
//     const onKeyDown = (event) => {
//       if (event.key === 'Escape') {
//         setAccountOpen(false);
//         setActiveMenu(null);
//         setHelpReferenceOpen(false);
//         setDownloadMenuOpen(false);
//       }
//     };
//     document.addEventListener('keydown', onKeyDown);
//     return () => document.removeEventListener('keydown', onKeyDown);
//   }, [accountOpen, activeMenu, isHelpReferenceOpen, isDownloadMenuOpen]);

//   const handleLogout = () => {
//     Promise.resolve(onLogout?.()).finally(() => {
//       setAccountOpen(false);
//       window.location.assign(loginPath);
//     });
//   };

//   const resolvedUser = useMemo(() => {
//     if (hasIdentityInfo(user)) {
//       return buildIdentity(user);
//     }
//     return loadIdentityFromStorage();
//   }, [user]);

//   const displayEmail = (resolvedUser?.email || resolvedUser?.mail || '').trim();
//   const displayPhone = (
//     resolvedUser?.phone || resolvedUser?.mobileNumber || resolvedUser?.phoneNumber || ''
//   ).trim();
//   const displayName =
//     (resolvedUser?.name || resolvedUser?.username || resolvedUser?.fullName || '').trim() ||
//     'Guest';

//   const handleCompile = useCallback(async () => {
//     if (isCompiling) return;
//     setIsCompiling(true);
//     try {
//       await Promise.resolve(onSaveJSON?.());
//       window.dispatchEvent(new CustomEvent('innoide:compile-start'));
//     } finally {
//       setIsCompiling(false);
//     }
//   }, [isCompiling, onSaveJSON]);

//   const handleBuild = useCallback(async () => {
//     if (isBuilding) return;
//     setIsBuilding(true);
//     try {
//       window.dispatchEvent(new CustomEvent('innoide:build-start'));
//       await new Promise((resolve) => setTimeout(resolve, 800));
//       window.dispatchEvent(new CustomEvent('innoide:build-complete'));
//     } finally {
//       setIsBuilding(false);
//     }
//   }, [isBuilding]);

//   const handleDebugger = useCallback(() => {
//     const next = !isDebugging;
//     setIsDebugging(next);
//     window.dispatchEvent(new CustomEvent(next ? 'innoide:debugger-start' : 'innoide:debugger-stop'));
//   }, [isDebugging]);

//   const handleFlash = useCallback(async () => {
//     if (isFlashing) return;
//     setIsFlashing(true);
//     try {
//       window.dispatchEvent(new CustomEvent('innoide:flash-start'));
//       await new Promise((resolve) => setTimeout(resolve, 1000));
//       window.dispatchEvent(new CustomEvent('innoide:flash-complete'));
//     } finally {
//       setIsFlashing(false);
//     }
//   }, [isFlashing]);

//   const handleErase = useCallback(async () => {
//     if (isErasing) return;
//     setIsErasing(true);
//     try {
//       window.dispatchEvent(new CustomEvent('innoide:erase-start'));
//       await new Promise((resolve) => setTimeout(resolve, 600));
//       window.dispatchEvent(new CustomEvent('innoide:erase-complete'));
//     } finally {
//       setIsErasing(false);
//     }
//   }, [isErasing]);

//   const handleSerialMonitor = useCallback(() => {
//     const next = !isSerialActive;
//     setIsSerialActive(next);
//     window.dispatchEvent(new CustomEvent(next ? 'innoide:serial-open' : 'innoide:serial-close'));
//   }, [isSerialActive]);

//   const handleTerminal = useCallback(() => {
//     const next = !isTerminalOpen;
//     setIsTerminalOpen(next);
//     window.dispatchEvent(new CustomEvent(next ? 'innoide:terminal-open' : 'innoide:terminal-close'));
//   }, [isTerminalOpen]);

//   const handleLibraries = useCallback(() => {
//     if (typeof onLibrariesClick === 'function') {
//       onLibrariesClick();
//     } else {
//       window.dispatchEvent(new CustomEvent('innoide:libraries-open'));
//     }
//     setActiveMenu(null);
//   }, [onLibrariesClick]);

//   const toolItems = useMemo(() => {
//     return [
//       {
//         key: 'compile',
//         label: 'Compile',
//         icon: isCompiling ? <Loader2 size={14} className="spin" /> : <Cog size={14} />,
//         handler: handleCompile,
//       },
//       {
//         key: 'build',
//         label: 'Build',
//         icon: isBuilding ? <Loader2 size={14} className="spin" /> : <Hammer size={14} />,
//         handler: handleBuild,
//       },
//       {
//         key: 'debugger',
//         label: isDebugging ? 'Stop Debugger' : 'Debugger',
//         icon: <BugPlay size={14} />,
//         handler: handleDebugger,
//       },
//       {
//         key: 'flash',
//         label: 'Flash',
//         icon: isFlashing ? <Loader2 size={14} className="spin" /> : <Zap size={14} />,
//         handler: handleFlash,
//         disabled: !isDeviceConnected,
//       },
//       {
//         key: 'erase',
//         label: 'Erase Chip',
//         icon: isErasing ? <Loader2 size={14} className="spin" /> : <Trash size={14} />,
//         handler: handleErase,
//         disabled: !isDeviceConnected,
//       },
//       {
//         key: 'serialMonitor',
//         label: isSerialActive ? 'Close Serial Monitor' : 'Serial Monitor',
//         icon: <Radio size={14} />,
//         handler: handleSerialMonitor,
//         disabled: !isDeviceConnected,
//       },
//       {
//         key: 'terminal',
//         label: isTerminalOpen ? 'Close Terminal' : 'Terminal',
//         icon: <Terminal size={14} />,
//         handler: handleTerminal,
//       },
//       {
//         key: 'libraries',
//         label: 'Library Manager',
//         icon: <Library size={14} />,
//         handler: handleLibraries,
//       },
//     ];
//   }, [handleCompile, handleBuild, handleDebugger, handleFlash, handleErase, handleSerialMonitor, handleTerminal, handleLibraries, isCompiling, isBuilding, isDebugging, isFlashing, isErasing, isSerialActive, isTerminalOpen, isDeviceConnected]);

//   const toggleMenu = (menuKey) => {
//     setActiveMenu((current) => (current === menuKey ? null : menuKey));
//     setAccountOpen(false);
//     setDownloadMenuOpen(false);
//   };

//   const handleNewProject = () => {
//     if (typeof onCreateNewProject === 'function') {
//       onCreateNewProject();
//     } else {
//       window.dispatchEvent(new CustomEvent('innoide:create-new-project'));
//     }
//     setActiveMenu(null);
//   };

//   const handleToolClick = (handler) => {
//     if (typeof handler === 'function') {
//       handler();
//     }
//     setActiveMenu(null);
//     setDownloadMenuOpen(false);
//   };

//   return (
//     <header className="editor-navbar">
//       <div className="editor-navbar__left">
//         {/* ✅ Brand with logo */}
//         <div className="editor-navbar__brand">
//           <img
//             src={hexLogo}
//             alt="InnoIDE Logo"
//             className="editor-navbar__logo"
//           />
//           <span className="editor-navbar__brand-name">InnoIDE</span>
//         </div>

//         {/* ✅ Menu Items */}
//         <nav className="editor-navbar__menu">
//                     <div className="editor-navbar__menu-group" ref={menuRefs.tools}>
//             <button
//               type="button"
//               className={`editor-navbar__menu-item ${activeMenu === 'tools' ? 'is-open' : ''}`}
//               onClick={() => toggleMenu('tools')}
//             >
//               <Settings size={16} />
//               <span>Tools</span>
//               <ChevronDown size={16} />
//             </button>
//             {activeMenu === 'tools' && (
//               <div className="editor-navbar__menu-dropdown">
//                 {toolItems.length > 0 ? (
//                   toolItems.map(({ key, label, icon, handler, disabled }) => (
//                     <button
//                       key={key}
//                       type="button"
//                       className={`editor-navbar__menu-action ${disabled ? 'is-disabled' : ''}`}
//                       onClick={() => !disabled && handleToolClick(handler)}
//                       disabled={disabled}
//                       title={disabled ? 'Connect a device to use this feature' : label}
//                     >
//                       {icon}
//                       <span>{label}</span>
//                     </button>
//                   ))
//                 ) : (
//                   <div className="editor-navbar__menu-empty">No tools available</div>
//                 )}
//               </div>
//             )}
//           </div>
//           <div className="editor-navbar__menu-group" ref={menuRefs.help}>
//             <button
//               type="button"
//               className={`editor-navbar__menu-item ${activeMenu === 'help' ? 'is-open' : ''}`}
//               onClick={() => toggleMenu('help')}
//             >
//               <Presentation size={16} />
//               <span>Help</span>
//               <ChevronDown size={16} />
//             </button>
//             {activeMenu === 'help' && (
//               <div className="editor-navbar__menu-dropdown">
//                 <button
//                   type="button"
//                   className="editor-navbar__menu-action"
//                   onClick={() => {
//                     setHelpReferenceOpen(true);
//          setActiveMenu(null);
//                   }}
//                 >
//                   <BookOpen size={14} />
//                   <span>IDE Reference</span>
//                 </button>
//               </div>
//             )}
//           </div>
//         </nav>
//       </div>

//       {/* ✅ Tabs */}
//       <div className="editor-navbar__tabs" role="tablist">
//         {tabs.map((tab) => {
//           const tabId = tab;
//           const TabIcon = TAB_ICON_MAP[tabId];
//           const isActive = tabId === activeTab;
//           return (
//             <button
//               key={tabId}
//               type="button"
//               role="tab"
//               aria-selected={isActive}
//               className={`editor-navbar__tab ${isActive ? 'is-active' : ''}`}
//               onClick={() => {
//                 if (tabId === 'MathCodeEditor') {
//                   navigate('/mathcodeeditor');
//                 } else {
//                   onTabChange?.(tabId);
//                 }
//               }}
//             >
//               {TabIcon && <TabIcon size={16} className="editor-navbar__tab-icon" aria-hidden="true" />}
//               {tabId}
//             </button>
//           );
//         })}
//       </div>

//       {/* ✅ Right-side Icons */}
//       <div className="editor-navbar__right">
//         {(onExportPNG || onSaveJSON || onLoadJSON) && (
//           <div
//             className={`editor-navbar__download ${isDownloadMenuOpen ? 'is-open' : ''}`}
//             ref={downloadRef}
//           >
//             <button
//               type="button"
//               className="editor-navbar__icon-btn"
//               title="Download options"
//               onClick={() => {
//                 setDownloadMenuOpen((open) => !open);
//                 setAccountOpen(false);
//                 setActiveMenu(null);
//               }}
//               aria-haspopup="menu"
//               aria-expanded={isDownloadMenuOpen}
//             >
//               <div className="editor-navbar__icon-btn-inner">
//                 <Download size={18} />
//                 <ChevronDown size={14} className="editor-navbar__icon-caret" />
//               </div>
//             </button>
//             {isDownloadMenuOpen && (
//               <div
//                 className="editor-navbar__menu-dropdown editor-navbar__menu-dropdown--right"
//                 role="menu"
//               >
//                 {onLoadJSON && (
//                   <button
//                     type="button"
//                     className="editor-navbar__menu-action"
//                     onClick={() => {
//                       onLoadJSON?.();
//                       setDownloadMenuOpen(false);
//                     }}
//                     role="menuitem"
//                   >
//                     <Upload size={14} />
//                     <span>Load JSON</span>
//                   </button>
//                 )}
//                 {onSaveJSON && (
//                   <button
//                     type="button"
//                     className="editor-navbar__menu-action"
//                     onClick={() => {
//                       onSaveJSON?.();
//                       setDownloadMenuOpen(false);
//                     }}
//                     role="menuitem"
//                   >
//                     <Save size={14} />
//                     <span>Save JSON</span>
//                   </button>
//                 )}
//                 {onExportPNG && (
//                   <button
//                     type="button"
//                     className="editor-navbar__menu-action"
//                     onClick={() => {
//                       onExportPNG?.();
//                       setDownloadMenuOpen(false);
//                     }}
//                     role="menuitem"
//                   >
//                     <ImageDown size={14} />
//                     <span>Export PNG</span>
//                   </button>
//                 )}
//               </div>
//             )}
//           </div>
//         )}
//         <button
//           type="button"
//           className="editor-navbar__icon-btn"
//           title="Video meeting"
//           onClick={() => navigate('/meet')}
//         >
//           <Video size={18} />
//         </button>
//         <div className="editor-navbar__account" ref={accountRef}>
//           <button
//             type="button"
//             className={`editor-navbar__account-btn ${accountOpen ? 'is-open' : ''}`}
//             title="Account"
//             onClick={() => {
//               setAccountOpen((open) => !open);
//               setActiveMenu(null);
//               setDownloadMenuOpen(false);
//             }}
//             aria-haspopup="menu"
//             aria-expanded={accountOpen}
//           >
//             <UserCircle size={20} />
//             <ChevronDown size={14} className="editor-navbar__account-caret" />
//           </button>
//           {accountOpen && (
//             <div className="editor-navbar__account-menu" role="menu">
//               <div className="editor-navbar__account-summary">
//                 <UserCircle size={36} />
//                 <div className="editor-navbar__account-name">{displayName}</div>
//                 {displayEmail && <div className="editor-navbar__account-email">{displayEmail}</div>}
//               </div>
//               <button
//                 type="button"
//                 className="editor-navbar__account-menu-item"
//                 onClick={handleLogout}
//                 role="menuitem"
//               >
//                 Logout
//               </button>
//             </div>
//           )}
//         </div>
//       </div>

//       {isHelpReferenceOpen && (
//         <div className="editor-navbar__reference-overlay" role="dialog" aria-modal="true">
//           <div className="editor-navbar__reference-modal">
//             <header className="editor-navbar__reference-header">
//               <BookOpen size={18} />
//               <div>
//                 <h2>InnoIDE Reference Guide</h2>
//                 <p>Quick overview of the integrated development environment.</p>
//               </div>
//               <button
//                 type="button"
//                 className="editor-navbar__reference-close"
//                 onClick={() => setHelpReferenceOpen(false)}
//                 aria-label="Close reference"
//               >
//                 &times;
//               </button>
//             </header>
//             <div className="editor-navbar__reference-body">
//               <section>
//                 <h3>Project Workspace</h3>
//                 <p>
//                   Use the File Explorer to organise projects, right-click folders for quick actions,
//                   and access the <strong>File → New Project</strong> menu to create a scaffolded
//                   project with default source files and board configuration.
//                 </p>
//               </section>
//               <section>
//                 <h3>Build & Debug</h3>
//                 <p>
//                   The Tools menu mirrors the sidebar controls, allowing you to build, flash, and debug
//                   without leaving the editor. Keyboard shortcuts include{' '}
//                   <strong>Ctrl+Shift+B</strong> for build and <strong>Ctrl+Shift+D</strong> for run
//                   &amp; debug.
//                 </p>
//               </section>
//               <section>
//                 <h3>Diagram Editors</h3>
//                 <p>
//                   Switch between Simulation, Flowchart, Block Diagram, and Code Editor tabs to access
//                   specialised editors. Diagram surfaces support drag-and-drop blocks, labelled
//                   connectors, and a right-side properties inspector.
//                 </p>
//               </section>
//               <section>
//                 <h3>Video Collaboration</h3>
//                 <p>
//                   Click the <Video size={14} style={{ display: 'inline', verticalAlign: 'middle' }} />{' '}
//                   video icon to start a meeting. Share the invite link with team members for real-time
//                   collaboration while working on your projects.
//                 </p>
//               </section>
//               <section>
//                 <h3>Need More Help?</h3>
//                 <p>
//                   Visit the InnoIDE knowledge base or contact support at{' '}
//                   <a href="mailto:satya@innotrat.com">satya@innotrat.com</a>.
//                 </p>
//               </section>
//             </div>
//           </div>
//         </div>
//       )}
//     </header>
//   );
// };

// export default EditorNavbar;

// // import React from 'react';
// // import {
// //   Blocks,
// //   Braces,
// //   ChevronDown,
// //   Download,
// //   Menu,
// //   Presentation,
// //   Save,
// //   Settings,
// //   Upload,
// //   UserCircle,
// //   Video,
// //   ImageDown,
// //   RotateCcw,
// //   RotateCw,
// // } from 'lucide-react';
// // import './EditorNavbar.css';

// // const DEFAULT_TABS = ['Simulation', 'Flowchart', 'Block Diagram', 'Code Editor'];

// // const EditorNavbar = ({
// //   tabs = DEFAULT_TABS,
// //   activeTab,
// //   onTabChange,
// //   onSaveJSON,
// //   onLoadJSON,
// //   onExportPNG,
// //   onUndo,
// //   onRedo,
// // }) => {
// //   return (
// //     <header className="editor-navbar">
// //       <div className="editor-navbar__left">
// //         <div className="editor-navbar__brand">
// //           <Menu size={18} />
// //           <span className="editor-navbar__brand-name">InnoIDE</span>
// //         </div>
// //         <nav className="editor-navbar__menu">
// //           <button type="button" className="editor-navbar__menu-item">
// //             <Blocks size={16} />
// //             <span>File</span>
// //             <ChevronDown size={16} />
// //           </button>
// //           <button type="button" className="editor-navbar__menu-item">
// //             <Settings size={16} />
// //             <span>Tools</span>
// //             <ChevronDown size={16} />
// //           </button>
// //           <button type="button" className="editor-navbar__menu-item">
// //             <Presentation size={16} />
// //             <span>Help</span>
// //             <ChevronDown size={16} />
// //           </button>
// //         </nav>
// //       </div>

// //       <div className="editor-navbar__tabs" role="tablist">
// //         {tabs.map((tab) => {
// //           const isActive = tab === activeTab;
// //           return (
// //             <button
// //               key={tab}
// //               type="button"
// //               role="tab"
// //               aria-selected={isActive}
// //               className={`editor-navbar__tab ${isActive ? 'is-active' : ''}`}
// //               onClick={() => onTabChange?.(tab)}
// //             >
// //               {tab}
// //             </button>
// //           );
// //         })}
// //       </div>

// //       <div className="editor-navbar__right">
// //         {onSaveJSON && (
// //           <button type="button" className="editor-navbar__icon-btn" title="Save JSON" onClick={onSaveJSON}>
// //             <Save size={18} />
// //           </button>
// //         )}
// //         {onLoadJSON && (
// //           <button type="button" className="editor-navbar__icon-btn" title="Load JSON" onClick={onLoadJSON}>
// //             <Upload size={18} />
// //           </button>
// //         )}
// //         {onExportPNG && (
// //           <button type="button" className="editor-navbar__icon-btn" title="Export PNG" onClick={onExportPNG}>
// //             <ImageDown size={18} />
// //           </button>
// //         )}
// //         {onUndo && (
// //           <button type="button" className="editor-navbar__icon-btn" title="Undo (Ctrl+Z)" onClick={onUndo}>
// //             <RotateCcw size={18} />
// //           </button>
// //         )}
// //         {onRedo && (
// //           <button type="button" className="editor-navbar__icon-btn" title="Redo (Ctrl+Y)" onClick={onRedo}>
// //             <RotateCw size={18} />
// //           </button>
// //         )}
// //         <button type="button" className="editor-navbar__icon-btn" title="Download">
// //           <Download size={18} />
// //         </button>
// //         <button type="button" className="editor-navbar__icon-btn" title="Video">
// //           <Video size={18} />
// //         </button>
// //         <button type="button" className="editor-navbar__icon-btn" title="Templates">
// //           <Braces size={18} />
// //         </button>
// //         <button type="button" className="editor-navbar__icon-btn" title="Account">
// //           <UserCircle size={18} />
// //         </button>
// //       </div>
// //     </header>
// //   );
// // };

// // export default EditorNavbar;



// 10-11-25

// import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import {
// Blocks,
// Braces,
// ChevronDown,
// BookOpen,
// Download,
// Presentation,
// Save,
// Settings,
// Upload,
// UserCircle,
// Video,
// ImageDown,
// RotateCcw,
// RotateCw,
// BugPlay,
// Zap,
// Terminal,
// Plus,
// Cog,
// Hammer,
// Loader2,
// Trash,
// Radio,
// Library,
// Workflow,
// Cpu,
// Boxes,
// Calculator,
// } from 'lucide-react';
// import './EditorNavbar.css';
// import hexLogo from '../assets/hex_bg.png';
// 
// const IDENTITY_FIELDS = [
// 'name',
// 'fullName',
// 'username',
// 'userName',
// 'email',
// 'userEmail',
// 'mail',
// 'phone',
// 'mobileNumber',
// 'phoneNumber',
// ];
// 
// const parseMaybeJSON = (raw) => {
// if (!raw || typeof raw !== 'string') return null;
// try {
// return JSON.parse(raw);
// } catch (error) {
// console.warn('Failed to parse stored identity', error);
// return null;
// }
// };
// 
// const hasIdentityInfo = (candidate) => {
// if (!candidate || typeof candidate !== 'object') return false;
// return IDENTITY_FIELDS.some((key) => {
// const value = candidate[key];
// return typeof value === 'string' && value.trim().length > 0;
// });
// };
// 
// const buildIdentity = (candidate) => {
// if (!hasIdentityInfo(candidate)) return null;
// 
// const name =
// candidate.name ||
// candidate.fullName ||
// candidate.username ||
// candidate.userName ||
// '';
// const email = candidate.email || candidate.userEmail || candidate.mail || '';
// const phone = candidate.phone || candidate.mobileNumber || candidate.phoneNumber || '';
// 
// const trimmedName = typeof name === 'string' ? name.trim() : '';
// const trimmedEmail = typeof email === 'string' ? email.trim() : '';
// const trimmedPhone = typeof phone === 'string' ? phone.trim() : '';
// 
// const primary = trimmedName || trimmedEmail || trimmedPhone;
// if (!primary) return null;
// 
// return {
// ...candidate,
// name: trimmedName || primary,
// email: trimmedEmail,
// phone: trimmedPhone,
// };
// };
// 
// const loadIdentityFromStorage = () => {
// if (typeof window === 'undefined') return null;
// 
// const sources = [
// () => window.sessionStorage.getItem('currentUserIdentity'),
// () => window.localStorage.getItem('currentUserIdentity'),
// () => window.sessionStorage.getItem('userData'),
// () => window.localStorage.getItem('userData'),
// ];
// 
// for (const read of sources) {
// const parsed = buildIdentity(parseMaybeJSON(read()));
// if (parsed) {
// return parsed;
// }
// }
// 
// return null;
// };
// 
// const DEFAULT_TABS = ['Block Diagram', 'Flowchart', 'Simulation', 'Code Editor', 'Block Programming', 'MathCodeEditor'];
// 
// const TAB_ICON_MAP = {
// 'BlockDiagram': Blocks,
// Flowchart: Workflow,
// Simulation: Cpu,
// 'CodeEditor': Braces,
// 'BlockProgramming': Boxes,
// 'MathCodeEditor': Calculator,
// };
// 
// const EditorNavbar = ({
// tabs = DEFAULT_TABS,
// activeTab,
// onTabChange,
// onSaveJSON,
// onLoadJSON,
// onExportPNG,
// onUndo,
// onRedo,
// onCreateNewProject,
// onLibrariesClick,
// user,
// onLogout,
// loginPath = '/',
// isDeviceConnected = true,
// }) => {
// const navigate = useNavigate();
// const [accountOpen, setAccountOpen] = useState(false);
// const accountRef = useRef(null);
// const downloadRef = useRef(null);
// const [activeMenu, setActiveMenu] = useState(null);
// const menuRefs = {
// file: useRef(null),
// tools: useRef(null),
// help: useRef(null),
// };
// const [isHelpReferenceOpen, setHelpReferenceOpen] = useState(false);
// const [isCompiling, setIsCompiling] = useState(false);
// const [isBuilding, setIsBuilding] = useState(false);
// const [isDebugging, setIsDebugging] = useState(false);
// const [isFlashing, setIsFlashing] = useState(false);
// const [isErasing, setIsErasing] = useState(false);
// const [isSerialActive, setIsSerialActive] = useState(false);
// const [isTerminalOpen, setIsTerminalOpen] = useState(false);
// const [isDownloadMenuOpen, setDownloadMenuOpen] = useState(false);
// 
// useEffect(() => {
// if (!accountOpen && !activeMenu && !isDownloadMenuOpen) return;
// const handlePointer = (event) => {
// const clickedAccount = accountRef.current?.contains(event.target);
// const clickedMenu = Object.values(menuRefs).some((ref) => ref.current?.contains(event.target));
// const clickedDownload = downloadRef.current?.contains(event.target);
// if (!clickedAccount) {
// setAccountOpen(false);
// }
// if (!clickedMenu) {
// setActiveMenu(null);
// }
// if (!clickedDownload) {
// setDownloadMenuOpen(false);
// }
// };
// document.addEventListener('pointerdown', handlePointer);
// return () => document.removeEventListener('pointerdown', handlePointer);
// }, [accountOpen, activeMenu, isDownloadMenuOpen]);
// 
// useEffect(() => {
// if (!accountOpen && !activeMenu && !isHelpReferenceOpen && !isDownloadMenuOpen) return;
// const onKeyDown = (event) => {
// if (event.key === 'Escape') {
// setAccountOpen(false);
// setActiveMenu(null);
// setHelpReferenceOpen(false);
// setDownloadMenuOpen(false);
// }
// };
// document.addEventListener('keydown', onKeyDown);
// return () => document.removeEventListener('keydown', onKeyDown);
// }, [accountOpen, activeMenu, isHelpReferenceOpen, isDownloadMenuOpen]);
// 
// const handleLogout = () => {
// Promise.resolve(onLogout?.()).finally(() => {
// setAccountOpen(false);
// window.location.assign(loginPath);
// });
// };
// 
// const resolvedUser = useMemo(() => {
// if (hasIdentityInfo(user)) {
// return buildIdentity(user);
// }
// return loadIdentityFromStorage();
// }, [user]);
// 
// const displayEmail = (resolvedUser?.email || resolvedUser?.mail || '').trim();
// const displayPhone = (
// resolvedUser?.phone || resolvedUser?.mobileNumber || resolvedUser?.phoneNumber || ''
// ).trim();
// const displayName =
// (resolvedUser?.name || resolvedUser?.username || resolvedUser?.fullName || '').trim() ||
// 'Guest';
// 
// const handleCompile = useCallback(async () => {
// if (isCompiling) return;
// setIsCompiling(true);
// try {
// await Promise.resolve(onSaveJSON?.());
// window.dispatchEvent(new CustomEvent('innoide:compile-start'));
// } finally {
// setIsCompiling(false);
// }
// }, [isCompiling, onSaveJSON]);
// 
// const handleBuild = useCallback(async () => {
// if (isBuilding) return;
// setIsBuilding(true);
// try {
// window.dispatchEvent(new CustomEvent('innoide:build-start'));
// await new Promise((resolve) => setTimeout(resolve, 800));
// window.dispatchEvent(new CustomEvent('innoide:build-complete'));
// } finally {
// setIsBuilding(false);
// }
// }, [isBuilding]);
// 
// const handleDebugger = useCallback(() => {
// const next = !isDebugging;
// setIsDebugging(next);
// window.dispatchEvent(new CustomEvent(next ? 'innoide:debugger-start' : 'innoide:debugger-stop'));
// }, [isDebugging]);
// 
// const handleFlash = useCallback(async () => {
// if (isFlashing) return;
// setIsFlashing(true);
// try {
// window.dispatchEvent(new CustomEvent('innoide:flash-start'));
// await new Promise((resolve) => setTimeout(resolve, 1000));
// window.dispatchEvent(new CustomEvent('innoide:flash-complete'));
// } finally {
// setIsFlashing(false);
// }
// }, [isFlashing]);
// 
// const handleErase = useCallback(async () => {
// if (isErasing) return;
// setIsErasing(true);
// try {
// window.dispatchEvent(new CustomEvent('innoide:erase-start'));
// await new Promise((resolve) => setTimeout(resolve, 600));
// window.dispatchEvent(new CustomEvent('innoide:erase-complete'));
// } finally {
// setIsErasing(false);
// }
// }, [isErasing]);
// 
// const handleSerialMonitor = useCallback(() => {
// const next = !isSerialActive;
// setIsSerialActive(next);
// window.dispatchEvent(new CustomEvent(next ? 'innoide:serial-open' : 'innoide:serial-close'));
// }, [isSerialActive]);
// 
// const handleTerminal = useCallback(() => {
// const next = !isTerminalOpen;
// setIsTerminalOpen(next);
// window.dispatchEvent(new CustomEvent(next ? 'innoide:terminal-open' : 'innoide:terminal-close'));
// }, [isTerminalOpen]);
// 
// const handleLibraries = useCallback(() => {
// if (typeof onLibrariesClick === 'function') {
// onLibrariesClick();
// } else {
// window.dispatchEvent(new CustomEvent('innoide:libraries-open'));
// }
// setActiveMenu(null);
// }, [onLibrariesClick]);
// 
// const toolItems = useMemo(() => {
// return [
// {
// key: 'compile',
// label: 'Compile',
// icon: isCompiling ? <Loader2 size={14} className="spin" /> : <Cog size={14} />,
// handler: handleCompile,
// },
// {
// key: 'build',
// label: 'Build',
// icon: isBuilding ? <Loader2 size={14} className="spin" /> : <Hammer size={14} />,
// handler: handleBuild,
// },
// {
// key: 'debugger',
// label: isDebugging ? 'Stop Debugger' : 'Debugger',
// icon: <BugPlay size={14} />,
// handler: handleDebugger,
// },
// {
// key: 'flash',
// label: 'Flash',
// icon: isFlashing ? <Loader2 size={14} className="spin" /> : <Zap size={14} />,
// handler: handleFlash,
// disabled: !isDeviceConnected,
// },
// {
// key: 'erase',
// label: 'Erase Chip',
// icon: isErasing ? <Loader2 size={14} className="spin" /> : <Trash size={14} />,
// handler: handleErase,
// disabled: !isDeviceConnected,
// },
// {
// key: 'serialMonitor',
// label: isSerialActive ? 'Close Serial Monitor' : 'Serial Monitor',
// icon: <Radio size={14} />,
// handler: handleSerialMonitor,
// disabled: !isDeviceConnected,
// },
// {
// key: 'terminal',
// label: isTerminalOpen ? 'Close Terminal' : 'Terminal',
// icon: <Terminal size={14} />,
// handler: handleTerminal,
// },
// {
// key: 'libraries',
// label: 'Library Manager',
// icon: <Library size={14} />,
// handler: handleLibraries,
// },
// ];
// }, [
// handleCompile,
// handleBuild,
// handleDebugger,
// handleFlash,
// handleErase,
// handleSerialMonitor,
// handleTerminal,
// handleLibraries,
// isCompiling,
// isBuilding,
// isDebugging,
// isFlashing,
// isErasing,
// isSerialActive,
// isTerminalOpen,
// isDeviceConnected,
// ]);
// 
// const toggleMenu = (menuKey) => {
// setActiveMenu((current) => (current === menuKey ? null : menuKey));
// setAccountOpen(false);
// setDownloadMenuOpen(false);
// };
// 
// const handleNewProject = () => {
// if (typeof onCreateNewProject === 'function') {
// onCreateNewProject();
// } else {
// window.dispatchEvent(new CustomEvent('innoide:create-new-project'));
// }
// setActiveMenu(null);
// };
// 
// const handleToolClick = (handler) => {
// if (typeof handler === 'function') {
// handler();
// }
// setActiveMenu(null);
// setDownloadMenuOpen(false);
// };
// 
// return (
// <header className="editor-navbar">
{/* <div className="editor-navbar__left"> */ }
// ✅ Brand with logo
{/* <div className="editor-navbar__brand"> */ }
{/* <img src={hexLogo} alt="InnoIDE Logo" className="editor-navbar__logo" /> */ }
{/* <span className="editor-navbar__brand-name">InnoIDE</span> */ }
{/* </div> */ }
{/*  */ }
// ✅ Menu Items
{/* <nav className="editor-navbar__menu"> */ }
{/* <div className="editor-navbar__menu-group" ref={menuRefs.tools}> */ }
{/* <button */ }
// type="button"
// className={`editor-navbar__menu-item ${activeMenu === 'tools' ? 'is-open' : ''}`}
// onClick={() => toggleMenu('tools')}
// >
{/* <Settings size={16} /> */ }
{/* <span>Tools</span> */ }
{/* <ChevronDown size={16} /> */ }
{/* </button> */ }
{/* {activeMenu === 'tools' && ( */ }
// <div className="editor-navbar__menu-dropdown">
{/* {toolItems.length > 0 ? ( */ }
// toolItems.map(({ key, label, icon, handler, disabled }) => (
// <button
// key={key}
// type="button"
// className={`editor-navbar__menu-action ${disabled ? 'is-disabled' : ''}`}
// onClick={() => !disabled && handleToolClick(handler)}
// disabled={disabled}
// title={disabled ? 'Connect a device to use this feature' : label}
// >
{/* {icon} */ }
{/* <span>{label}</span> */ }
{/* </button> */ }
// ))
// ) : (
// <div className="editor-navbar__menu-empty">No tools available</div>
// )}
{/* </div> */ }
// )}
{/* </div> */ }
{/* <div className="editor-navbar__menu-group" ref={menuRefs.help}> */ }
{/* <button */ }
// type="button"
// className={`editor-navbar__menu-item ${activeMenu === 'help' ? 'is-open' : ''}`}
// onClick={() => toggleMenu('help')}
// >
{/* <Presentation size={16} /> */ }
{/* <span>Help</span> */ }
{/* <ChevronDown size={16} /> */ }
{/* </button> */ }
{/* {activeMenu === 'help' && ( */ }
// <div className="editor-navbar__menu-dropdown">
{/* <button */ }
// type="button"
// className="editor-navbar__menu-action"
// onClick={() => {
// setHelpReferenceOpen(true);
// setActiveMenu(null);
// }}
// >
{/* <BookOpen size={14} /> */ }
{/* <span>IDE Reference</span> */ }
{/* </button> */ }
{/* </div> */ }
// )}
{/* </div> */ }
{/* </nav> */ }
{/* </div> */ }
{/*  */ }
// ✅ Tabs
{/* <div className="editor-navbar__tabs" role="tablist"> */ }
{/*  */ }
{/*  */ }
{/* {tabs.map((tab) => { */ }
// const tabId = tab;
// console.log(tab, "tab--");
// const TabIcon = TAB_ICON_MAP[tabId];
// const isActive = tabId === activeTab;
// return (
// <button
// key={tabId}
// type="button"
// role="tab"
// aria-selected={isActive}
// className={`editor-navbar__tab ${isActive ? 'is-active' : ''}`}
// onClick={() => {
//  

// if (tabId === 'MathCodeEditor') {
// navigate('/mathcodeeditor');
// } else {
// onTabChange?.(tabId);
// }
// if (tabId === 'MathCodeEditor') {
// navigate('/mathcodeeditor');
// } else if (tabId === 'Flowchart') {
// navigate('/FlowchartTest');
// } else {
// onTabChange?.(tabId);
// }
// }}
// >
{/* {TabIcon && <TabIcon size={16} className="editor-navbar__tab-icon" aria-hidden="true" />} */ }
{/* {tabId} */ }
{/* </button> */ }
// );
// })}
{/* </div> */ }
{/*  */ }
// ✅ Right-side Icons
{/* <div className="editor-navbar__right"> */ }
{/* {(onExportPNG || onSaveJSON || onLoadJSON) && ( */ }
// <div
// className={`editor-navbar__download ${isDownloadMenuOpen ? 'is-open' : ''}`}
// ref={downloadRef}
// >
{/* <button */ }
// type="button"
// className="editor-navbar__icon-btn"
// title="Download options"
// onClick={() => {
// setDownloadMenuOpen((open) => !open);
// setAccountOpen(false);
// setActiveMenu(null);
// }}
// aria-haspopup="menu"
// aria-expanded={isDownloadMenuOpen}
// >
{/* <div className="editor-navbar__icon-btn-inner"> */ }
{/* <Download size={18} /> */ }
{/* <ChevronDown size={14} className="editor-navbar__icon-caret" /> */ }
{/* </div> */ }
{/* </button> */ }
{/* {isDownloadMenuOpen && ( */ }
// <div
// className="editor-navbar__menu-dropdown editor-navbar__menu-dropdown--right"
// role="menu"
// >
{/* {onLoadJSON && ( */ }
// <button
// type="button"
// className="editor-navbar__menu-action"
// onClick={() => {
// onLoadJSON?.();
// setDownloadMenuOpen(false);
// }}
// role="menuitem"
// >
{/* <Upload size={14} /> */ }
{/* <span>Load JSON</span> */ }
{/* </button> */ }
// )}
{/* {onSaveJSON && ( */ }
// <button
// type="button"
// className="editor-navbar__menu-action"
// onClick={() => {
// onSaveJSON?.();
// setDownloadMenuOpen(false);
// }}
// role="menuitem"
// >
{/* <Save size={14} /> */ }
{/* <span>Save JSON</span> */ }
{/* </button> */ }
// )}
{/* {onExportPNG && ( */ }
// <button
// type="button"
// className="editor-navbar__menu-action"
// onClick={() => {
// onExportPNG?.();
// setDownloadMenuOpen(false);
// }}
// role="menuitem"
// >
{/* <ImageDown size={14} /> */ }
{/* <span>Export PNG</span> */ }
{/* </button> */ }
// )}
{/* </div> */ }
// )}
{/* </div> */ }
// )}
{/* <button */ }
// type="button"
// className="editor-navbar__icon-btn"
// title="Video meeting"
// onClick={() => navigate('/meet')}
// >
{/* <Video size={18} /> */ }
{/* </button> */ }
{/* <div className="editor-navbar__account" ref={accountRef}> */ }
{/* <button */ }
// type="button"
// className={`editor-navbar__account-btn ${accountOpen ? 'is-open' : ''}`}
// title="Account"
// onClick={() => {
// setAccountOpen((open) => !open);
// setActiveMenu(null);
// setDownloadMenuOpen(false);
// }}
// aria-haspopup="menu"
// aria-expanded={accountOpen}
// >
{/* <UserCircle size={20} /> */ }
{/* <ChevronDown size={14} className="editor-navbar__account-caret" /> */ }
{/* </button> */ }
{/* {accountOpen && ( */ }
// <div className="editor-navbar__account-menu" role="menu">
{/* <div className="editor-navbar__account-summary"> */ }
{/* <UserCircle size={36} /> */ }
{/* <div className="editor-navbar__account-name">{displayName}</div> */ }
{/* {displayEmail && <div className="editor-navbar__account-email">{displayEmail}</div>} */ }
{/* </div> */ }
{/* <button */ }
// type="button"
// className="editor-navbar__account-menu-item"
// onClick={handleLogout}
// role="menuitem"
// >
{/* Logout */ }
{/* </button> */ }
{/* </div> */ }
// )}
{/* </div> */ }
{/* </div> */ }
{/*  */ }
{/* {isHelpReferenceOpen && ( */ }
// <div className="editor-navbar__reference-overlay" role="dialog" aria-modal="true">
{/* <div className="editor-navbar__reference-modal"> */ }
{/* <header className="editor-navbar__reference-header"> */ }
{/* <BookOpen size={18} /> */ }
{/* <div> */ }
{/* <h2>InnoIDE Reference Guide</h2> */ }
{/* <p>Quick overview of the integrated development environment.</p> */ }
{/* </div> */ }
{/* <button */ }
// type="button"
// className="editor-navbar__reference-close"
// onClick={() => setHelpReferenceOpen(false)}
// aria-label="Close reference"
// >
{/* &times; */ }
{/* </button> */ }
{/* </header> */ }
{/* <div className="editor-navbar__reference-body"> */ }
{/* <section> */ }
{/* <h3>Project Workspace</h3> */ }
{/* <p> */ }
{/* Use the File Explorer to organise projects, right-click folders for quick actions, */ }
{/* and access the <strong>File → New Project</strong> menu to create a scaffolded */ }
{/* project with default source files and board configuration. */ }
{/* </p> */ }
{/* </section> */ }
{/* <section> */ }
{/* <h3>Build & Debug</h3> */ }
{/* <p> */ }
{/* The Tools menu mirrors the sidebar controls, allowing you to build, flash, and debug */ }
{/* without leaving the editor. Keyboard shortcuts include{' '} */ }
{/* <strong>Ctrl+Shift+B</strong> for build and <strong>Ctrl+Shift+D</strong> for run */ }
{/* &amp; debug. */ }
{/* </p> */ }
{/* </section> */ }
{/* <section> */ }
{/* <h3>Diagram Editors</h3> */ }
{/* <p> */ }
{/* Switch between Simulation, Flowchart, Block Diagram, and Code Editor tabs to access */ }
{/* specialised editors. Diagram surfaces support drag-and-drop blocks, labelled */ }
{/* connectors, and a right-side properties inspector. */ }
{/* </p> */ }
{/* </section> */ }
{/* <section> */ }
{/* <h3>Video Collaboration</h3> */ }
{/* <p> */ }
{/* Click the <Video size={14} style={{ display: 'inline', verticalAlign: 'middle' }} />{' '} */ }
{/* video icon to start a meeting. Share the invite link with team members for real-time */ }
{/* collaboration while working on your projects. */ }
{/* </p> */ }
{/* </section> */ }
{/* <section> */ }
{/* <h3>Need More Help?</h3> */ }
{/* <p> */ }
{/* Visit the InnoIDE knowledge base or contact support at{' '} */ }
{/* <a href="mailto:satya@innotrat.com">satya@innotrat.com</a>. */ }
{/* </p> */ }
{/* </section> */ }
{/* </div> */ }
{/* </div> */ }
{/* </div> */ }
// )}
{/* </header> */ }
// );
// };
// 
// export default EditorNavbar;
// 


import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Blocks,
  Braces,
  ChevronDown,
  BookOpen,
  Download,
  Presentation,
  Save,
  Settings,
  Upload,
  UserCircle,
  Video,
  ImageDown,
  RotateCcw,
  RotateCw,
  BugPlay,
  Zap,
  Terminal,
  Plus,
  Cog,
  Hammer,
  Loader2,
  Trash,
  Radio,
  Library,
  Workflow,
  Cpu,
  Boxes,
  Calculator,
} from 'lucide-react';
import './EditorNavbar.css';
import hexLogo from '../assets/hex_bg.png';
import DyteMeetingApp from './DyteMeetingApp';
import { Modal, ModalOverlay, ModalContent, ModalCloseButton, ModalBody } from '@chakra-ui/react';
// import DyteMeetingLauncher from './DyteMeetingLauncher';

const IDENTITY_FIELDS = [
  'name',
  'fullName',
  'username',
  'userName',
  'email',
  'userEmail',
  'mail',
  'phone',
  'mobileNumber',
  'phoneNumber',
];

const parseMaybeJSON = (raw) => {
  if (!raw || typeof raw !== 'string') return null;
  try {
    return JSON.parse(raw);
  } catch (error) {
    console.warn('Failed to parse stored identity', error);
    return null;
  }
};

const hasIdentityInfo = (candidate) => {
  if (!candidate || typeof candidate !== 'object') return false;
  return IDENTITY_FIELDS.some((key) => {
    const value = candidate[key];
    return typeof value === 'string' && value.trim().length > 0;
  });
};

const buildIdentity = (candidate) => {
  if (!hasIdentityInfo(candidate)) return null;

  const name =
    candidate.name ||
    candidate.fullName ||
    candidate.username ||
    candidate.userName ||
    '';
  const email = candidate.email || candidate.userEmail || candidate.mail || '';
  const phone = candidate.phone || candidate.mobileNumber || candidate.phoneNumber || '';

  const trimmedName = typeof name === 'string' ? name.trim() : '';
  const trimmedEmail = typeof email === 'string' ? email.trim() : '';
  const trimmedPhone = typeof phone === 'string' ? phone.trim() : '';

  const primary = trimmedName || trimmedEmail || trimmedPhone;
  if (!primary) return null;

  return {
    ...candidate,
    name: trimmedName || primary,
    email: trimmedEmail,
    phone: trimmedPhone,
  };
};

const loadIdentityFromStorage = () => {
  if (typeof window === 'undefined') return null;

  const sources = [
    () => window.sessionStorage.getItem('currentUserIdentity'),
    () => window.localStorage.getItem('currentUserIdentity'),
    () => window.sessionStorage.getItem('userData'),
    () => window.localStorage.getItem('userData'),
  ];

  for (const read of sources) {
    const parsed = buildIdentity(parseMaybeJSON(read()));
    if (parsed) {
      return parsed;
    }
  }

  return null;
};
const DEFAULT_TABS = ['Block Diagram', 'Flowchart', 'Simulation', 'Code Editor', 'Block Programming', 'MathCodeEditor'];

const TAB_ICON_MAP = {
  'Block Diagram': Blocks,
  Flowchart: Workflow,
  Simulation: Cpu,
  'Code Editor': Braces,
  'Block Programming': Boxes,
  'MathCodeEditor': Calculator,
};

const EditorNavbar = ({
  tabs = DEFAULT_TABS,
  activeTab,
  onTabChange,
  onSaveJSON,
  onLoadJSON,
  onExportPNG,
  onUndo,
  onRedo,
  onCreateNewProject,
  onLibrariesClick,
  user,
  onLogout,
  loginPath = '/',
  isDeviceConnected = true,
}) => {
  const navigate = useNavigate();
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef(null);
  const downloadRef = useRef(null);
  const [activeMenu, setActiveMenu] = useState(null);
  const menuRefs = {
    file: useRef(null),
    tools: useRef(null),
    help: useRef(null),
  };
  const [isHelpReferenceOpen, setHelpReferenceOpen] = useState(false);
  const [isCompiling, setIsCompiling] = useState(false);
  const [isBuilding, setIsBuilding] = useState(false);
  const [isDebugging, setIsDebugging] = useState(false);
  const [isFlashing, setIsFlashing] = useState(false);
  const [isErasing, setIsErasing] = useState(false);
  const [isSerialActive, setIsSerialActive] = useState(false);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [isDownloadMenuOpen, setDownloadMenuOpen] = useState(false);
  const [isVideoCallOpen, setVideoCallOpen] = useState(false);

  useEffect(() => {
    if (!accountOpen && !activeMenu && !isDownloadMenuOpen) return;
    const handlePointer = (event) => {
      const clickedAccount = accountRef.current?.contains(event.target);
      const clickedMenu = Object.values(menuRefs).some((ref) => ref.current?.contains(event.target));
      const clickedDownload = downloadRef.current?.contains(event.target);
      if (!clickedAccount) {
        setAccountOpen(false);
      }
      if (!clickedMenu) {
        setActiveMenu(null);
      }
      if (!clickedDownload) {
        setDownloadMenuOpen(false);
      }
    };
    document.addEventListener('pointerdown', handlePointer);
    return () => document.removeEventListener('pointerdown', handlePointer);
  }, [accountOpen, activeMenu, isDownloadMenuOpen]);

  useEffect(() => {
    if (!accountOpen && !activeMenu && !isHelpReferenceOpen && !isDownloadMenuOpen) return;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setAccountOpen(false);
        setActiveMenu(null);
        setHelpReferenceOpen(false);
        setDownloadMenuOpen(false);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [accountOpen, activeMenu, isHelpReferenceOpen, isDownloadMenuOpen]);

  const handleLogout = () => {
    Promise.resolve(onLogout?.()).finally(() => {
      setAccountOpen(false);
      window.location.assign(loginPath);
    });
  };

  const resolvedUser = useMemo(() => {
    if (hasIdentityInfo(user)) {
      return buildIdentity(user);
    }
    return loadIdentityFromStorage();
  }, [user]);

  const displayEmail = (resolvedUser?.email || resolvedUser?.mail || '').trim();
  const displayPhone = (
    resolvedUser?.phone || resolvedUser?.mobileNumber || resolvedUser?.phoneNumber || ''
  ).trim();
  const displayName =
    (resolvedUser?.name || resolvedUser?.username || resolvedUser?.fullName || '').trim() ||
    'Guest';

  const handleCompile = useCallback(async () => {
    if (isCompiling) return;
    setIsCompiling(true);
    try {
      await Promise.resolve(onSaveJSON?.());
      window.dispatchEvent(new CustomEvent('innoide:compile-start'));
    } finally {
      setIsCompiling(false);
    }
  }, [isCompiling, onSaveJSON]);

  const handleBuild = useCallback(async () => {
    if (isBuilding) return;
    setIsBuilding(true);
    try {
      window.dispatchEvent(new CustomEvent('innoide:build-start'));
      await new Promise((resolve) => setTimeout(resolve, 800));
      window.dispatchEvent(new CustomEvent('innoide:build-complete'));
    } finally {
      setIsBuilding(false);
    }
  }, [isBuilding]);

  const handleDebugger = useCallback(() => {
    const next = !isDebugging;
    setIsDebugging(next);
    window.dispatchEvent(new CustomEvent(next ? 'innoide:debugger-start' : 'innoide:debugger-stop'));
  }, [isDebugging]);

  const handleFlash = useCallback(async () => {
    if (isFlashing) return;
    setIsFlashing(true);
    try {
      window.dispatchEvent(new CustomEvent('innoide:flash-start'));
      await new Promise((resolve) => setTimeout(resolve, 1000));
      window.dispatchEvent(new CustomEvent('innoide:flash-complete'));
    } finally {
      setIsFlashing(false);
    }
  }, [isFlashing]);

  const handleErase = useCallback(async () => {
    if (isErasing) return;
    setIsErasing(true);
    try {
      window.dispatchEvent(new CustomEvent('innoide:erase-start'));
      await new Promise((resolve) => setTimeout(resolve, 600));
      window.dispatchEvent(new CustomEvent('innoide:erase-complete'));
    } finally {
      setIsErasing(false);
    }
  }, [isErasing]);

  const handleSerialMonitor = useCallback(() => {
    const next = !isSerialActive;
    setIsSerialActive(next);
    window.dispatchEvent(new CustomEvent(next ? 'innoide:serial-open' : 'innoide:serial-close'));
  }, [isSerialActive]);

  const handleTerminal = useCallback(() => {
    const next = !isTerminalOpen;
    setIsTerminalOpen(next);
    window.dispatchEvent(new CustomEvent(next ? 'innoide:terminal-open' : 'innoide:terminal-close'));
  }, [isTerminalOpen]);

  const handleLibraries = useCallback(() => {
    if (typeof onLibrariesClick === 'function') {
      onLibrariesClick();
    } else {
      window.dispatchEvent(new CustomEvent('innoide:libraries-open'));
    }
    setActiveMenu(null);
  }, [onLibrariesClick]);

  const toolItems = useMemo(() => {
    return [
      {
        key: 'compile',
        label: 'Compile',
        icon: isCompiling ? <Loader2 size={14} className="spin" /> : <Cog size={14} />,
        handler: handleCompile,
      },
      {
        key: 'build',
        label: 'Build',
        icon: isBuilding ? <Loader2 size={14} className="spin" /> : <Hammer size={14} />,
        handler: handleBuild,
      },
      {
        key: 'debugger',
        label: isDebugging ? 'Stop Debugger' : 'Debugger',
        icon: <BugPlay size={14} />,
        handler: handleDebugger,
      },
      {
        key: 'flash',
        label: 'Flash',
        icon: isFlashing ? <Loader2 size={14} className="spin" /> : <Zap size={14} />,
        handler: handleFlash,
      },
      {
        key: 'erase',
        label: 'Erase Chip',
        icon: isErasing ? <Loader2 size={14} className="spin" /> : <Trash size={14} />,
        handler: handleErase,
      },
      {
        key: 'serialMonitor',
        label: isSerialActive ? 'Close Serial Monitor' : 'Serial Monitor',
        icon: <Radio size={14} />,
        handler: handleSerialMonitor,
      },
      {
        key: 'terminal',
        label: isTerminalOpen ? 'Close Terminal' : 'Terminal',
        icon: <Terminal size={14} />,
        handler: handleTerminal,
      },
      {
        key: 'libraries',
        label: 'Library Manager',
        icon: <Library size={14} />,
        handler: handleLibraries,
      },
    ];
  }, [handleCompile, handleBuild, handleDebugger, handleFlash, handleErase, handleSerialMonitor, handleTerminal, handleLibraries, isCompiling, isBuilding, isDebugging, isFlashing, isErasing, isSerialActive, isTerminalOpen, isDeviceConnected]);

  const toggleMenu = (menuKey) => {
    setActiveMenu((current) => (current === menuKey ? null : menuKey));
    setAccountOpen(false);
    setDownloadMenuOpen(false);
  };

  const handleNewProject = () => {
    if (typeof onCreateNewProject === 'function') {
      onCreateNewProject();
    } else {
      window.dispatchEvent(new CustomEvent('innoide:create-new-project'));
    }
    setActiveMenu(null);
  };

  const handleToolClick = (handler) => {
    if (typeof handler === 'function') {
      handler();
    }
    setActiveMenu(null);
    setDownloadMenuOpen(false);
  };

  return (
    <header className="editor-navbar">
      <div className="editor-navbar__left">
        {/* ✅ Brand with logo */}
        <div className="editor-navbar__brand">
          <img
            src={hexLogo}
            alt="InnoIDE Logo"
            className="editor-navbar__logo"
          />
          <span className="editor-navbar__brand-name">InnoIDE</span>
        </div>

        {/* ✅ Menu Items */}
        <nav className="editor-navbar__menu">
          <div className="editor-navbar__menu-group" ref={menuRefs.tools}>
            <button
              type="button"
              className={`editor-navbar__menu-item ${activeMenu === 'tools' ? 'is-open' : ''}`}
              onClick={() => toggleMenu('tools')}
            >
              <Settings size={16} />
              <span>Tools</span>
              <ChevronDown size={16} />
            </button>
            {activeMenu === 'tools' && (
              <div className="editor-navbar__menu-dropdown">
                {toolItems.length > 0 ? (
                  toolItems.map(({ key, label, icon, handler, disabled }) => (
                    <button
                      key={key}
                      type="button"
                      className={`editor-navbar__menu-action ${disabled ? 'is-disabled' : ''}`}
                      onClick={() => !disabled && handleToolClick(handler)}
                      disabled={disabled}
                      title={disabled ? 'Connect a device to use this feature' : label}
                    >
                      {icon}
                      <span>{label}</span>
                    </button>
                  ))
                ) : (
                  <div className="editor-navbar__menu-empty">No tools available</div>
                )}
              </div>
            )}
          </div>
          <div className="editor-navbar__menu-group" ref={menuRefs.help}>
            <button
              type="button"
              className={`editor-navbar__menu-item ${activeMenu === 'help' ? 'is-open' : ''}`}
              onClick={() => toggleMenu('help')}
            >
              <Presentation size={16} />
              <span>Help</span>
              <ChevronDown size={16} />
            </button>
            {activeMenu === 'help' && (
              <div className="editor-navbar__menu-dropdown">
                <button
                  type="button"
                  className="editor-navbar__menu-action"
                  onClick={() => {
                    setHelpReferenceOpen(true);
                    setActiveMenu(null);
                  }}
                >
                  <BookOpen size={14} />
                  <span>IDE Reference</span>
                </button>
              </div>
            )}
          </div>
        </nav>
      </div>

      {/* ✅ Tabs */}
      <div className="editor-navbar__tabs" role="tablist">
        {tabs.map((tab) => {
          const tabId = tab;
          const TabIcon = TAB_ICON_MAP[tabId];
          const isActive = tabId === activeTab;
          return (
            <button
              key={tabId}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`editor-navbar__tab ${isActive ? 'is-active' : ''}`}
              onClick={() => {
                if (tabId === 'MathCodeEditor') {
                  navigate('/mathcodeeditor');
                } else if (tabId === 'Block Diagram') {
                  navigate('/BlockDiagram');
                } else if (tabId === 'Block Programming') {
                  navigate('/blockprogramming');
                } else {
                  onTabChange?.(tabId);
                }
              }}
            >
              {TabIcon && <TabIcon size={16} className="editor-navbar__tab-icon" aria-hidden="true" />}
              {tabId}
            </button>
          );
        })}
      </div>

      {/* ✅ Right-side Icons */}
      <div className="editor-navbar__right">
        {(onExportPNG || onSaveJSON || onLoadJSON) && (
          <div
            className={`editor-navbar__download ${isDownloadMenuOpen ? 'is-open' : ''}`}
            ref={downloadRef}
          >
            <button
              type="button"
              className="editor-navbar__icon-btn"
              title="Download options"
              onClick={() => {
                setDownloadMenuOpen((open) => !open);
                setAccountOpen(false);
                setActiveMenu(null);
              }}
              aria-haspopup="menu"
              aria-expanded={isDownloadMenuOpen}
            >
              <div className="editor-navbar__icon-btn-inner">
                <Download size={18} />
                <ChevronDown size={14} className="editor-navbar__icon-caret" />
              </div>
            </button>
            {isDownloadMenuOpen && (
              <div className="editor-navbar__menu-dropdown editor-navbar__menu-dropdown--right" role="menu">
                {onLoadJSON && (
                  <button
                    type="button"
                    className="editor-navbar__menu-action"
                    onClick={() => {
                      onLoadJSON?.();
                      setDownloadMenuOpen(false);
                    }}
                    role="menuitem"
                  >
                    <Upload size={14} />
                    <span>Load JSON</span>
                  </button>
                )}
                {onSaveJSON && (
                  <button
                    type="button"
                    className="editor-navbar__menu-action"
                    onClick={() => {
                      onSaveJSON?.();
                      setDownloadMenuOpen(false);
                    }}
                    role="menuitem"
                  >
                    <Save size={14} />
                    <span>Save JSON</span>
                  </button>
                )}
                {onExportPNG && (
                  <button
                    type="button"
                    className="editor-navbar__menu-action"
                    onClick={() => {
                      onExportPNG?.();
                      setDownloadMenuOpen(false);
                    }}
                    role="menuitem"
                  >
                    <ImageDown size={14} />
                    <span>Export PNG</span>
                  </button>
                )}
              </div>
            )}
          </div>
        )}
        {/* Video Call Button */}
        <button
          type="button"
          className="editor-navbar__icon-btn"
          title="Video Call"
          onClick={() => setVideoCallOpen(true)}
        >
          <Video size={18} />
        </button>
        {/* <button type="button" className="editor-navbar__icon-btn" title="Templates">
          <Braces size={18} />
        </button> */}
        <div className="editor-navbar__account" ref={accountRef}>
          <button
            type="button"
            className={`editor-navbar__account-btn ${accountOpen ? 'is-open' : ''}`}
            title="Account"
            onClick={() => setAccountOpen((open) => !open)}
            aria-haspopup="menu"
            aria-expanded={accountOpen}
          >
            <UserCircle size={20} />
            <ChevronDown size={14} className="editor-navbar__account-caret" />
          </button>
          {accountOpen && (
            <div className="editor-navbar__account-menu" role="menu">
              <div className="editor-navbar__account-summary">
                <UserCircle size={36} />
                <div className="editor-navbar__account-name">{displayName}</div>
              </div>
              <button type="button" className="editor-navbar__account-menu-item" onClick={handleLogout} role="menuitem">
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {isHelpReferenceOpen && (
        <div className="editor-navbar__reference-overlay" role="dialog" aria-modal="true">
          <div className="editor-navbar__reference-modal">
            <header className="editor-navbar__reference-header">
              <BookOpen size={18} />
              <div>
                <h2>InnoIDE Reference Guide</h2>
                <p>Quick overview of the integrated development environment.</p>
              </div>
              <button
                type="button"
                className="editor-navbar__reference-close"
                onClick={() => setHelpReferenceOpen(false)}
                aria-label="Close reference"
              >
                &times;
              </button>
            </header>
            <div className="editor-navbar__reference-body">
              <section>
                <h3>Project Workspace</h3>
                <p>
                  Use the File Explorer to organise projects, right-click folders for quick actions, and
                  access the <strong>File → New Project</strong> menu to create a scaffolded project with default
                  source files and board configuration.
                </p>
              </section>
              <section>
                <h3>Build & Debug</h3>
                <p>
                  The Tools menu mirrors the sidebar controls, allowing you to build, flash, and debug without
                  leaving the editor. Keyboard shortcuts include <strong>Ctrl+Shift+B</strong> for build and
                  <strong>Ctrl+Shift+D</strong> for run &amp; debug.
                </p>
              </section>
              <section>
                <h3>Diagram Editors</h3>
                <p>
                  Switch between Simulation, Flowchart, Block Diagram, and Code Editor tabs to access
                  specialised editors. Diagram surfaces support drag-and-drop blocks, labelled connectors,
                  and a right-side properties inspector.
                </p>
              </section>
              <section>
                <h3>Need More Help?</h3>
                <p>
                  Visit the InnoIDE knowledge base or contact support at <a href="mailto:satya@innotrat.com">satya@innotrat.com</a>.
                </p>
              </section>
            </div>
          </div>
        </div>
      )}

      {/* Video Call Modal */}
      <Modal isOpen={isVideoCallOpen} onClose={() => setVideoCallOpen(false)} size="6xl">
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody p={0}>
            <DyteMeetingApp onClose={() => setVideoCallOpen(false)} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </header>
  );
};

export default EditorNavbar;
