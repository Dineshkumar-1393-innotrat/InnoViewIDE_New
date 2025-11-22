// import React, { useState, useEffect, useCallback } from 'react';
// import { FiFolder, FiFile, FiChevronDown, FiChevronRight, FiPlus, FiTrash2, FiEdit, FiFolderPlus } from 'react-icons/fi';
// import axios from 'axios';
// import { motion, AnimatePresence } from 'framer-motion';
// import CreateNewProject from './MenuSidebar/CreateNewProjectModal';
// import { useProject } from '../ProjectContext';

// const DEFAULT_USER_ID = '67add4f3d16ff7c76ba10bcf';


// const FileExplorer = ({ onFileSystemUpdate, refreshFileSystem, variant = 'default' }) => {
//   const [nodes, setNodes] = useState(null);
//   const [showCreateProject, setShowCreateProject] = useState(false);
//   const isDiagramVariant = variant === 'diagram';
//   const { user } = useProject?.() ?? {};
//   const activeUserId = user?.userId || DEFAULT_USER_ID;
//   const updateTree = useCallback((tree) => {
//     setNodes(tree);
//     if (onFileSystemUpdate) {
//       onFileSystemUpdate(tree);
//     }
//   }, [onFileSystemUpdate]);

//   const fetchFileSystem = useCallback(async () => {
//     if (!activeUserId) return;
//     try {
//       const { data } = await axios.get(`https://eureka.innotrat.in/api/v1/rootStatus/${activeUserId}`);
//       if (!data.isRootCreated) {
//         await axios.post(`https://eureka.innotrat.in/api/v1/filesystem/createRoot`, { userId: activeUserId, name: "root", type: "folder" });
//       }
//       const fileResponse = await axios.get(`https://eureka.innotrat.in/api/v1/files/${activeUserId}`);
//       if (fileResponse.data.success) {
//         const buildTree = (flatArray) => {
//           const idMap = {};
//           let root = null;
//           flatArray.forEach((item) => {
//             idMap[item._id] = { ...item, children: [], isOpen: item.type === 'folder' ? false : undefined };
//           });
//           flatArray.forEach((item) => {
//             if (item.parentId && idMap[item.parentId]) {
//               idMap[item.parentId].children.push(idMap[item._id]);
//             } else if (!item.parentId) {
//               root = idMap[item._id];
//             }
//           });
//           if(root) root.isOpen = true;
//           return root;
//         };
//         const structuredData = buildTree(fileResponse.data.files);
//         updateTree(structuredData);
//       }
//     } catch (error) {
//       console.error("Error fetching file system:", error);
//     }
//   }, [activeUserId, updateTree]);

//   useEffect(() => {
//     fetchFileSystem();
//     if (refreshFileSystem) {
//       refreshFileSystem.current = fetchFileSystem;
//     }
//   }, [fetchFileSystem, refreshFileSystem]);

//   useEffect(() => {
//     const handleExternalRefresh = () => fetchFileSystem();
//     window.addEventListener('file-system-refresh', handleExternalRefresh);
//     const handleNewProjectRequest = () => setShowCreateProject(true);
//     window.addEventListener('innoide:create-new-project', handleNewProjectRequest);
//     return () => {
//       window.removeEventListener('file-system-refresh', handleExternalRefresh);
//       window.removeEventListener('innoide:create-new-project', handleNewProjectRequest);
//     };
//   }, [fetchFileSystem]);

//   const FileTree = ({ node, onAddNode, onDeleteNode, onEditNode, depth = 0, variant }) => {
//     const [isAdding, setIsAdding] = useState(null);
//     const [isEditing, setIsEditing] = useState(false);
//     const [editedName, setEditedName] = useState(node.name);
//     const [newItemName, setNewItemName] = useState('');
//     const isDiagram = variant === 'diagram';

//     const onToggle = () => {
//       const toggleNode = (n) => {
//         if (n._id === node._id) {
//           return { ...n, isOpen: !n.isOpen };
//         }
//         if (n.children) {
//           return { ...n, children: n.children.map(toggleNode) };
//         }
//         return n;
//       };
//       setNodes(toggleNode(nodes));
//     };

//     const handleAdd = (type) => {
//       if (!newItemName.trim()) {
//         setIsAdding(null);
//         return;
//       }
//       onAddNode(node._id, newItemName, type === 'folder');
//       setNewItemName('');
//       setIsAdding(null);
//     };

//     const handleCancel = () => {
//       setIsAdding(null);
//       setNewItemName('');
//     }

//     const handleEdit = () => {
//       if (editedName.trim() && editedName !== node.name) {
//         onEditNode(node._id, editedName);
//       }
//       setIsEditing(false);
//     };

//     const isFolder = node.type === 'folder';

//     if (isEditing) {
//       return (
//         <div
//           style={isDiagram ? { paddingLeft: `${depth * 14 + 16}px` } : { paddingLeft: `${depth * 20}px` }}
//           className={isDiagram ? 'diagram-edit-row' : 'flex items-center w-full py-1.5'}
//         >
//           {isFolder ? (
//             <FiFolder className={isDiagram ? 'diagram-node-icon edit' : 'w-4 h-4 text-sky-400'} />
//           ) : (
//             <FiFile className={isDiagram ? 'diagram-node-icon file' : 'w-4 h-4 text-gray-500'} />
//           )}
//           <input
//             type="text"
//             className={
//               isDiagram
//                 ? 'diagram-input'
//                 : 'ml-2 px-2 py-1 text-sm bg-gray-900 border border-gray-700 rounded w-full focus:ring-1 focus:ring-sky-500 focus:outline-none'
//             }
//             value={editedName}
//             onChange={(e) => setEditedName(e.target.value)}
//             onBlur={handleEdit}
//             onKeyPress={(e) => e.key === 'Enter' && handleEdit()}
//             autoFocus
//           />
//         </div>
//       );
//     }

//     return (
//       <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
//         <div
//           className={
//             isDiagram
//               ? 'diagram-explorer-row'
//               : 'flex items-center justify-between w-full pl-2 pr-1 py-1.5 rounded-md hover:bg-gray-700/70 group transition-colors duration-150'
//           }
//           style={isDiagram ? { paddingLeft: `${depth * 14 + 16}px` } : { paddingLeft: `${depth * 16 + 8}px` }}
//         >
//           <div
//             onClick={isFolder ? onToggle : () => {}}
//             className={isDiagram ? 'diagram-row-main' : 'flex items-center gap-2 cursor-pointer flex-grow truncate'}
//           >
//             <span className={isDiagram ? 'diagram-chevron' : 'flex items-center w-4'}>
//               {isFolder &&
//                 (node.isOpen ? (
//                   <FiChevronDown size={14} className={isDiagram ? 'diagram-icon-muted' : 'text-gray-500'} />
//                 ) : (
//                   <FiChevronRight size={14} className={isDiagram ? 'diagram-icon-muted' : 'text-gray-500'} />
//                 ))}
//             </span>
//             {isFolder ? (
//               <FiFolder className={isDiagram ? `diagram-node-icon ${node.isOpen ? 'open' : ''}` : `w-4 h-4 text-sky-400 ${node.isOpen ? 'text-sky-300' : ''}`} />
//             ) : (
//               <FiFile className={isDiagram ? 'diagram-node-icon file' : 'w-4 h-4 text-gray-500'} />
//             )}
//             <span className={isDiagram ? 'diagram-node-label' : 'font-medium text-sm text-gray-300 group-hover:text-gray-100 truncate'}>{node.name}</span>
//           </div>
//           <div className={isDiagram ? 'diagram-row-actions' : 'hidden group-hover:flex items-center space-x-1'}>
//             {isFolder && (
//               <button onClick={() => { setIsAdding('folder'); if (!node.isOpen) onToggle(); }} className={isDiagram ? 'diagram-row-btn' : 'p-1.5 hover:bg-gray-600 rounded'}>
//                 <FiFolderPlus size={14} className={isDiagram ? 'diagram-action-icon' : 'text-gray-400'} />
//               </button>
//             )}
//             {isFolder && (
//               <button onClick={() => { setIsAdding('file'); if (!node.isOpen) onToggle(); }} className={isDiagram ? 'diagram-row-btn' : 'p-1.5 hover:bg-gray-600 rounded'}>
//                 <FiFile size={14} className={isDiagram ? 'diagram-action-icon' : 'text-gray-400'} />
//               </button>
//             )}
//             <button onClick={() => setIsEditing(true)} className={isDiagram ? 'diagram-row-btn' : 'p-1.5 hover:bg-gray-600 rounded'}>
//               <FiEdit size={14} className={isDiagram ? 'diagram-action-icon' : 'text-gray-400'} />
//             </button>
//             <button onClick={() => onDeleteNode(node._id)} className={isDiagram ? 'diagram-row-btn danger' : 'p-1.5 hover:bg-red-500/20 rounded'}>
//               <FiTrash2 size={14} className={isDiagram ? 'diagram-action-icon' : 'text-gray-400 hover:text-red-400'} />
//             </button>
//           </div>
//         </div>
//         <AnimatePresence>
//           {isFolder && node.isOpen && (
//             <motion.div
//               initial={{ height: 0, opacity: 0 }}
//               animate={{ height: 'auto', opacity: 1 }}
//               exit={{ height: 0, opacity: 0 }}
//               transition={{ duration: 0.2 }}
//               className={isDiagram ? 'diagram-children' : 'overflow-hidden'}
//             >
//               {node.children.map((child) => (
//                 <FileTree
//                   key={child._id}
//                   node={child}
//                   onAddNode={onAddNode}
//                   onDeleteNode={onDeleteNode}
//                   onEditNode={onEditNode}
//                   depth={depth + 1}
//                   variant={variant}
//                 />
//               ))}
//               {isAdding && (
//                 <div
//                   style={isDiagram ? { marginLeft: `${(depth + 1) * 14 + 12}px` } : { paddingLeft: `${(depth + 1) * 16 + 8}px` }}
//                   className={isDiagram ? 'diagram-add-row' : 'flex items-center py-2 w-full gap-2'}
//                 >
//                   {isAdding === 'file' ? (
//                     <FiFile className={isDiagram ? 'diagram-node-icon file' : 'w-4 h-4 text-gray-500'} />
//                   ) : (
//                     <FiFolder className={isDiagram ? 'diagram-node-icon' : 'w-4 h-4 text-sky-400'} />
//                   )}
//                   <input
//                     type="text"
//                     className={
//                       isDiagram
//                         ? 'diagram-input'
//                         : 'px-2 py-1 text-sm bg-gray-900 border border-gray-700 rounded w-full focus:ring-1 focus:ring-sky-500 focus:outline-none'
//                     }
//                     value={newItemName}
//                     onChange={(e) => setNewItemName(e.target.value)}
//                     placeholder={`New ${isAdding} name`}
//                     onKeyPress={(e) => e.key === 'Enter' && handleAdd(isAdding)}
//                     onKeyDown={(e) => e.key === 'Escape' && handleCancel()}
//                     autoFocus
//                   />
//                   <button
//                     className={isDiagram ? 'diagram-primary-btn' : 'px-3 py-1 text-sm bg-sky-600 hover:bg-sky-700 rounded text-white'}
//                     onClick={() => handleAdd(isAdding)}
//                   >
//                     Add
//                   </button>
//                   <button
//                     className={isDiagram ? 'diagram-secondary-btn' : 'px-3 py-1 text-sm bg-gray-600 hover:bg-gray-700 rounded text-white'}
//                     onClick={handleCancel}
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               )}
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </motion.div>
//     );
//   };

//   const deleteNodeFromTree = (tree, nodeId) => {
//     if (!tree) return null;
//     if (tree.children) {
//       const filteredChildren = tree.children.filter(child => child._id !== nodeId);
//       if (filteredChildren.length !== tree.children.length) {
//         return { ...tree, children: filteredChildren };
//       }
//       return { ...tree, children: tree.children.map(node => deleteNodeFromTree(node, nodeId)).filter(n => n) };
//     }
//     return tree;
//   };

//   const handleDeleteNode = async (nodeId) => {
//     if (nodeId === nodes._id) return; // Cannot delete root

//     // Optimistic UI update
//     const originalNodes = nodes;
//     setNodes(prevNodes => deleteNodeFromTree(prevNodes, nodeId));

//     try {
//       await axios.delete(
//         "https://eureka.innotrat.in/api/v1/deleteFileAndFolder",
//         {
//           data: { fileId: nodeId }, // Correct way to send data in DELETE request
//         }
//       );
//       // The UI is already updated, so we don't need to refetch unless we want to sync with server.
//     } catch (error) {
//       console.error("Error deleting node:", error);
//       // If the API call fails, revert the UI to its original state
//       setNodes(originalNodes);
//       alert('Failed to delete the item. Please try again.');
//     }
//   };

//   const handleEditNode = async (nodeId, newName) => {
//     if (nodeId === nodes._id) return; // Cannot edit root
//     try {
//       await axios.put(`https://eureka.innotrat.in/api/v1/filesystem/${nodeId}`, { name: newName });
//       fetchFileSystem(); // Refetch to update the tree
//     } catch (error) {
//       console.error("Error editing node:", error);
//     }
//   };

//   const handleAddNode = async (parentId, name, typeOrFlag) => {
//     const isFolder = typeOrFlag === true || typeOrFlag === 'folder';
//     const newNodePayload = {
//       userId: activeUserId,
//       name,
//       type: isFolder ? 'folder' : 'file',
//       parentId,
//     };

//     try {
//       await axios.post(`https://eureka.innotrat.in/api/v1/filesystem/create`, newNodePayload);
//       fetchFileSystem(); // Refetch to update the tree
//     } catch (error) {
//       console.error("Error adding node:", error);
//     }
//   };

//   const treeVariant = isDiagramVariant ? 'diagram' : 'default';

//   return (
//     <div className={isDiagramVariant ? 'diagram-explorer' : 'flex flex-col h-full w-full text-gray-300'}>
//       {isDiagramVariant ? (
//         <div className="diagram-explorer-header">
//           <span className="diagram-explorer-title">Explorer</span>
//           <button
//             type="button"
//             onClick={() => setShowCreateProject(true)}
//             className="diagram-header-btn"
//             title="Create a new project"
//           >
//             <FiPlus size={16} />
//           </button>
//         </div>
//       ) : (
//         <div className="flex items-center justify-between px-1 pb-2">
//           <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Explorer</h2>
//           <button
//             onClick={() => setShowCreateProject(true)}
//             className="p-1.5 rounded-md text-sm font-medium transition-all duration-200 text-gray-400 hover:bg-gray-700 hover:text-white"
//             title="Create a new project"
//           >
//             <FiPlus size={16} />
//           </button>
//         </div>
//       )}

//       <div className={isDiagramVariant ? 'diagram-tree' : 'flex-grow pt-2 border-t border-gray-700/50 overflow-y-auto'}>
//         {nodes ? (
//           <FileTree
//             node={nodes}
//             onAddNode={handleAddNode}
//             onDeleteNode={handleDeleteNode}
//             onEditNode={handleEditNode}
//             depth={0}
//             variant={treeVariant}
//           />
//         ) : (
//           <div className="p-3 text-sm text-gray-400">
//             {isDiagramVariant ? 'Loading files...' : 'Loading project files...'}
//           </div>
//         )}
//       </div>

//       {showCreateProject && (
//         <CreateNewProject
//           isOpen={showCreateProject}
//           onClose={() => setShowCreateProject(false)}
//           fileSystem={nodes}
//           folder="folder"
//           userId={activeUserId}
//           setFileSystem={updateTree}
//         />
//       )}
//     </div>
//   );
// };

// const FileItem = ({ file, onFileClick }) => {
//   return (
//     <div 
//       className="file-explorer__item"
//       onClick={() => onFileClick?.(file)}
//       title={file.name}
//     >
//       <Box 
//         as="span" 
//         className="file-explorer__item-name"
//         flex="1"
//         minW="0"
//         whiteSpace="nowrap"
//         overflow="hidden"
//         textOverflow="ellipsis"
//       >
//         {file.name}
//       </Box>
//     </div>
//   );
// };

// export default FileExplorer;


import React, { useState, useEffect, useCallback } from 'react';
import { FiFolder, FiFile, FiChevronDown, FiChevronRight, FiPlus, FiTrash2, FiEdit, FiFolderPlus, FiCode, FiImage } from 'react-icons/fi';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import CreateNewProject from './CreateProjectIntegration';
import './FileExplorer.css'

// Helper function to get file icon based on extension
const getFileIcon = (fileName) => {
  if (!fileName) return FiFile;
  const ext = fileName.split('.').pop()?.toLowerCase();

  const iconMap = {
    // Code files
    'js': FiCode,
    'jsx': FiCode,
    'ts': FiCode,
    'tsx': FiCode,
    'py': FiCode,
    'java': FiCode,
    'c': FiCode,
    'cpp': FiCode,
    'h': FiCode,
    'css': FiCode,
    'scss': FiCode,
    'html': FiCode,
    'json': FiCode,
    // Images
    'png': FiImage,
    'jpg': FiImage,
    'jpeg': FiImage,
    'gif': FiImage,
    'svg': FiImage,
    'webp': FiImage,
  };

  return iconMap[ext] || FiFile;
};

const FileExplorer = ({ onFileSystemUpdate, refreshFileSystem }) => {
  const [nodes, setNodes] = useState(null);
  const [showCreateProject, setShowCreateProject] = useState(false);

  const fetchFileSystem = useCallback(async () => {
    const userId = '67add4f3d16ff7c76ba10bcf'; // Hardcoded for now
    try {
      const { data } = await axios.get(`https://eureka.innotrat.in/api/v1/rootStatus/${userId}`);
      if (!data.isRootCreated) {
        await axios.post(`https://eureka.innotrat.in/api/v1/filesystem/createRoot`, { userId, name: "root", type: "folder" });
      }
      const fileResponse = await axios.get(`https://eureka.innotrat.in/api/v1/files/${userId}`);
      if (fileResponse.data.success) {
        const buildTree = (flatArray) => {
          const idMap = {};
          let root = null;
          flatArray.forEach((item) => {
            idMap[item._id] = { ...item, children: [], isOpen: item.type === 'folder' ? false : undefined };
          });
          flatArray.forEach((item) => {
            if (item.parentId && idMap[item.parentId]) {
              idMap[item.parentId].children.push(idMap[item._id]);
            } else if (!item.parentId) {
              root = idMap[item._id];
            }
          });
          if (root) root.isOpen = true;
          return root;
        };
        const structuredData = buildTree(fileResponse.data.files);
        setNodes(structuredData);
        if (onFileSystemUpdate) {
          onFileSystemUpdate(structuredData);
        }
      }
    } catch (error) {
      console.error("Error fetching file system:", error);
    }
  }, [onFileSystemUpdate]);

  useEffect(() => {
    fetchFileSystem();
    if (refreshFileSystem) {
      refreshFileSystem.current = fetchFileSystem;
    }
  }, [onFileSystemUpdate]);

  useEffect(() => {
    fetchFileSystem();
    if (refreshFileSystem) {
      refreshFileSystem.current = fetchFileSystem;
    }
  }, [fetchFileSystem, refreshFileSystem]);

  const FileTree = ({ node, onAddNode, onDeleteNode, onEditNode, depth = 0 }) => {
    const [isAdding, setIsAdding] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState(node.name);
    const [newItemName, setNewItemName] = useState('');

    const onToggle = () => {
      const toggleNode = (n) => {
        if (n._id === node._id) {
          return { ...n, isOpen: !n.isOpen };
        }
        if (n.children) {
          return { ...n, children: n.children.map(toggleNode) };
        }
        return n;
      };
      setNodes(toggleNode(nodes));
    };

    const handleAdd = (type) => {
      if (!newItemName.trim()) {
        setIsAdding(null);
        return;
      }
      onAddNode(node._id, newItemName, type === 'folder');
      setNewItemName('');
      setIsAdding(null);
    };

    const handleCancel = () => {
      setIsAdding(null);
      setNewItemName('');
    }

    const handleEdit = () => {
      if (editedName.trim() && editedName !== node.name) {
        onEditNode(node._id, editedName);
      }
      setIsEditing(false);
    };

    const isFolder = node.type === 'folder';

    if (isEditing) {
      return (
        <div style={{ paddingLeft: `${depth * 20}px` }} className={`flex items-center w-full py-1.5`}>
          {isFolder ? <FiFolder className="w-4 h-4 text-sky-400" /> : React.createElement(getFileIcon(node.name), { className: "w-4 h-4 text-gray-500" })}
          <input
            type="text"
            className="ml-2 px-2 py-1 text-sm bg-gray-900 border border-gray-700 rounded w-full focus:ring-1 focus:ring-sky-500 focus:outline-none"
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
            onBlur={handleEdit}
            onKeyPress={(e) => e.key === 'Enter' && handleEdit()}
            autoFocus
          />
        </div>
      )
    }

    return (
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
        <div
          className="flex items-center justify-between w-full pl-2 pr-1 py-1.5 rounded-md hover:bg-gray-700/70 group transition-colors duration-150"
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
        >
          <div onClick={isFolder ? onToggle : () => { }} className="flex items-center gap-2 cursor-pointer flex-grow truncate">
            <span className='flex items-center w-4'>
              {isFolder && (node.isOpen ? <FiChevronDown size={14} className='text-gray-500' /> : <FiChevronRight size={14} className='text-gray-500' />)}
            </span>
            {isFolder ? <FiFolder className={`w-4 h-4 text-sky-400 ${node.isOpen ? 'text-sky-300' : ''}`} /> : React.createElement(getFileIcon(node.name), { className: "w-4 h-4 text-gray-500" })}
            <span className="font-medium text-sm text-gray-300 group-hover:text-gray-100 truncate" title={node.name}>{node.name}</span>
          </div>
          <div className="hidden group-hover:flex items-center space-x-1">
            {isFolder && <button onClick={() => { setIsAdding('folder'); if (!node.isOpen) onToggle(); }} className="p-1.5 hover:bg-gray-600 rounded"><FiFolderPlus size={14} className='text-gray-400' /></button>}
            {isFolder && <button onClick={() => { setIsAdding('file'); if (!node.isOpen) onToggle(); }} className="p-1.5 hover:bg-gray-600 rounded"><FiFile size={14} className='text-gray-400' /></button>}
            <button onClick={() => setIsEditing(true)} className="p-1.5 hover:bg-gray-600 rounded"><FiEdit size={14} className='text-gray-400' /></button>
            <button onClick={() => onDeleteNode(node._id)} className="p-1.5 hover:bg-red-500/20 rounded"><FiTrash2 size={14} className='text-gray-400 hover:text-red-400' /></button>
          </div>
        </div>
        <AnimatePresence>
          {isFolder && node.isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              {node.children.map((child) => (
                <FileTree key={child._id} node={child} onAddNode={onAddNode} onDeleteNode={onDeleteNode} onEditNode={onEditNode} depth={depth + 1} />
              ))}
              {isAdding && (
                <div style={{ paddingLeft: `${(depth + 1) * 16 + 8}px` }} className="flex items-center py-2 w-full gap-2">
                  {isAdding === 'file' ? <FiFile className="w-4 h-4 text-indigo-400" /> : <FiFolder className="w-4 h-4 text-yellow-400" />}
                  <input
                    type="text"
                    className="px-2 py-1 text-sm bg-gray-900 border border-gray-700 rounded w-full focus:ring-1 focus:ring-sky-500 focus:outline-none"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    placeholder={`New ${isAdding} name`}
                    onKeyPress={(e) => e.key === 'Enter' && handleAdd(isAdding)}
                    onKeyDown={(e) => e.key === 'Escape' && handleCancel()}
                    autoFocus
                  />
                  <button className="px-3 py-1 text-sm bg-sky-600 hover:bg-sky-700 rounded text-white" onClick={() => handleAdd(isAdding)}>Add</button>
                  <button className="px-3 py-1 text-sm bg-gray-600 hover:bg-gray-700 rounded text-white" onClick={handleCancel}>Cancel</button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  const deleteNodeFromTree = (tree, nodeId) => {
    if (!tree) return null;
    if (tree.children) {
      const filteredChildren = tree.children.filter(child => child._id !== nodeId);
      if (filteredChildren.length !== tree.children.length) {
        return { ...tree, children: filteredChildren };
      }
      return { ...tree, children: tree.children.map(node => deleteNodeFromTree(node, nodeId)).filter(n => n) };
    }
    return tree;
  };

  const handleDeleteNode = async (nodeId) => {
    if (nodeId === nodes._id) return; // Cannot delete root

    // Optimistic UI update
    const originalNodes = nodes;
    setNodes(prevNodes => deleteNodeFromTree(prevNodes, nodeId));

    try {
      await axios.delete(
        "https://eureka.innotrat.in/api/v1/deleteFileAndFolder",
        {
          data: { fileId: nodeId }, // Correct way to send data in DELETE request
        }
      );
      // The UI is already updated, so we don't need to refetch unless we want to sync with server.
    } catch (error) {
      console.error("Error deleting node:", error);
      // If the API call fails, revert the UI to its original state
      setNodes(originalNodes);
      alert('Failed to delete the item. Please try again.');
    }
  };

  const handleEditNode = async (nodeId, newName) => {
    if (nodeId === nodes._id) return; // Cannot edit root
    try {
      await axios.put(`https://eureka.innotrat.in/api/v1/filesystem/${nodeId}`, { name: newName });
      fetchFileSystem(); // Refetch to update the tree
    } catch (error) {
      console.error("Error editing node:", error);
    }
  };

  const handleAddNode = async (parentId, name, isFolder) => {
    const userId = '67add4f3d16ff7c76ba10bcf'; // Hardcoded for now
    const newNodePayload = {
      userId,
      name,
      type: isFolder ? 'folder' : 'file',
      parentId,
    };

    try {
      await axios.post(`https://eureka.innotrat.in/api/v1/filesystem/create`, newNodePayload);
      fetchFileSystem(); // Refetch to update the tree
    } catch (error) {
      console.error("Error adding node:", error);
    }
  };

  return (
    <div className="flex flex-col h-full w-full text-gray-300">
      <div className="flex items-center justify-between px-1 pb-2">
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Explorer</h2>
        <button
          onClick={() => setShowCreateProject(true)}
          className="p-1.5 rounded-md text-sm font-medium transition-all duration-200 text-gray-400 hover:bg-gray-700 hover:text-white"
          title="Create a new project"
        >
          <FiPlus size={16} />
        </button>
      </div>
      <div className='flex-grow pt-2 border-t border-gray-700/50 overflow-y-auto'>
        {nodes && <FileTree node={nodes} onAddNode={handleAddNode} onDeleteNode={handleDeleteNode} onEditNode={handleEditNode} />}
      </div>
      {showCreateProject && <CreateNewProject onClose={() => setShowCreateProject(false)} fileSystem={nodes} refreshFileSystem={fetchFileSystem} />}
    </div>
  );
};

export default FileExplorer;