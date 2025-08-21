import React, { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  IconButton,
  Collapse,
  Input,
  Button,
  useDisclosure,
  Icon,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaFolder, FaFolderOpen, FaFile, FaPlus, FaFolderPlus, FaTrash, FaPencilAlt } from 'react-icons/fa';

// Initial file structure
// Initial file structure
const initialFiles = {
  id: 'root',
  name: 'Project',
  isFolder: true,
  isOpen: true,
  children: [],
};

// Component to render a single file
const File = ({ name, onDelete, onEdit }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <HStack 
      spacing={2} 
      pl={6} 
      py={1} 
      w="full" 
      justifyContent="space-between" 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      _hover={{ bg: useColorModeValue('gray.100', 'gray.700') }}
      borderRadius="md"
    >
      <HStack spacing={2}>
        <Icon as={FaFile} color="gray.500" />
        <Text>{name}</Text>
      </HStack>
      {isHovered && (
        <><IconButton icon={<FaPencilAlt />} size="xs" onClick={onEdit} aria-label="Edit file" variant="ghost" /><IconButton icon={<FaTrash />} size="xs" onClick={onDelete} aria-label="Delete file" variant="ghost" /></>
      )}
    </HStack>
  );
};

// Component to render a folder and its contents
const Folder = ({ name, isOpen, children, onToggle, onAddFile, onAddFolder, onEdit, onDelete }) => (
  <Box w="100%">
    <HStack justifyContent="space-between" _hover={{ bg: useColorModeValue('gray.100', 'gray.700') }} py={1} pr={2} borderRadius="md">
      <HStack as="button" onClick={onToggle} w="full" spacing={2} >
        <Icon as={isOpen ? FaFolderOpen : FaFolder} color="blue.500" />
        <Text fontWeight="bold">{name}</Text>
      </HStack>
      <HStack spacing={1}>
        <IconButton icon={<FaPlus />} size="xs" onClick={onAddFile} aria-label="Add file" variant="ghost" />
        <IconButton icon={<FaFolderPlus />} size="xs" onClick={onAddFolder} aria-label="Add folder" variant="ghost" /><IconButton icon={<FaPencilAlt />} size="xs" onClick={onEdit} aria-label="Edit folder" variant="ghost" /><IconButton icon={<FaTrash />} size="xs" onClick={onDelete} aria-label="Delete folder" variant="ghost" />
      </HStack>
    </HStack>
    <Collapse in={isOpen}>
      <Box pt={1}>
        {children}
      </Box>
    </Collapse>
  </Box>
);

// Recursive component to render the file tree
const FileTree = ({ node, onAddNode, onDeleteNode, onEditNode }) => {
  const { isOpen, onToggle } = useDisclosure({ defaultIsOpen: node.isOpen });
  const [isAdding, setIsAdding] = useState(null); // 'file' or 'folder'
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(node.name);
  const [newItemName, setNewItemName] = useState('');

  const handleAdd = (type) => {
    if (!newItemName.trim()) {
      setIsAdding(null);
      return;
    }
    onAddNode(node.id, newItemName, type === 'folder');
    setNewItemName('');
    setIsAdding(null);
  };

    const handleCancel = () => {
    setIsAdding(null);
    setNewItemName('');
  }

  const handleEdit = () => {
    if (editedName.trim() && editedName !== node.name) {
      onEditNode(node.id, editedName);
    }
    setIsEditing(false);
  };

      if (isEditing) {
    return (
      <HStack pl={node.isFolder ? 0 : 6} py={1} w="full">
        <Icon as={node.isFolder ? FaFolder : FaFile} color={node.isFolder ? 'blue.500' : 'gray.500'} />
        <Input 
          size="sm" 
          value={editedName} 
          onChange={(e) => setEditedName(e.target.value)} 
          onBlur={handleEdit}
          onKeyPress={(e) => e.key === 'Enter' && handleEdit()}
          autoFocus
        />
      </HStack>
    )
  }

  if (!node.isFolder) {
    return <File name={node.name} onDelete={() => onDeleteNode(node.id)} onEdit={() => setIsEditing(true)} />;
  }

  return (
    <VStack align="start" w="100%">
      <Folder
        name={node.name}
        isOpen={isOpen}
        onToggle={onToggle}
        onAddFile={() => setIsAdding('file')}
                onAddFolder={() => setIsAdding('folder')}
        onEdit={() => setIsEditing(true)}
        onDelete={() => onDeleteNode(node.id)}
      >
        <VStack align="start" pl={6} w="100%">
          {node.children.map((child) => (
                        <FileTree key={child.id} node={child} onAddNode={onAddNode} onDeleteNode={onDeleteNode} onEditNode={onEditNode} />
          ))}
          {isAdding && (
            <HStack pt={2} w="full">
              <Icon as={isAdding === 'file' ? FaFile : FaFolder} color={isAdding === 'file' ? 'gray.500' : 'blue.500'}/>
              <Input 
                size="sm" 
                value={newItemName} 
                onChange={(e) => setNewItemName(e.target.value)} 
                placeholder={`New ${isAdding} name`}
                onKeyPress={(e) => e.key === 'Enter' && handleAdd(isAdding)}
                autoFocus
              />
              <Button size="sm" colorScheme="blue" onClick={() => handleAdd(isAdding)}>Add</Button>
              <Button size="sm" variant="ghost" onClick={handleCancel}>Cancel</Button>
            </HStack>
          )}
        </VStack>
      </Folder>
    </VStack>
  );
};

// Main FileExplorer component
const FileExplorer = () => {
    const [files, setFiles] = useState(initialFiles);

  const deleteNodeFromTree = (tree, nodeId) => {
    if (tree.children) {
      const filteredChildren = tree.children.filter(child => child.id !== nodeId);
      if (filteredChildren.length !== tree.children.length) {
        return { ...tree, children: filteredChildren };
      }
      return { ...tree, children: tree.children.map(node => deleteNodeFromTree(node, nodeId)) };
    }
    return tree;
  };

    const handleDeleteNode = (nodeId) => {
    if (nodeId === 'root') return; // Cannot delete root
    const updatedFiles = deleteNodeFromTree(files, nodeId);
    setFiles(updatedFiles);
  };

  const editNodeInTree = (tree, nodeId, newName) => {
    if (tree.id === nodeId) {
      return { ...tree, name: newName };
    }
    if (tree.children) {
      return { ...tree, children: tree.children.map(node => editNodeInTree(node, nodeId, newName)) };
    }
    return tree;
  };

  const handleEditNode = (nodeId, newName) => {
    if (nodeId === 'root') return; // Cannot edit root
    const updatedFiles = editNodeInTree(files, nodeId, newName);
    setFiles(updatedFiles);
  };

  const addNodeToTree = (tree, parentId, newNode) => {
    if (tree.id === parentId) {
      return { ...tree, children: [...tree.children, newNode] };
    }
    if (tree.children) {
      return { ...tree, children: tree.children.map(node => addNodeToTree(node, parentId, newNode)) };
    }
    return tree;
  };

  const handleAddNode = (parentId, name, isFolder) => {
    const newNode = {
      id: new Date().getTime().toString(),
      name,
      isFolder,
      ...(isFolder && { children: [], isOpen: false }),
    };
    const updatedFiles = addNodeToTree(files, parentId, newNode);
    setFiles(updatedFiles);
  };


  return (
    <VStack align="start" p={2} spacing={3} w="100%">
      <Text fontSize="lg" fontWeight="bold" px={2}>File Explorer</Text>
      <FileTree node={files} onAddNode={handleAddNode} onDeleteNode={handleDeleteNode} onEditNode={handleEditNode} />
    </VStack>
  );
};

export default FileExplorer;
