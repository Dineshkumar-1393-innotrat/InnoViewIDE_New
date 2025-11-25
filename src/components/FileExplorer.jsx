import React, { useState, useEffect } from "react";
import {
  Box,
  VStack,
  Text,
  IconButton,
  Collapse,
  Tooltip,
  Button,
  useDisclosure,
  useColorModeValue,
  HStack,
  Spacer,
} from "@chakra-ui/react";
import {
  File,
  Folder,
  FolderOpen,
  Plus,
  ChevronRight,
  ChevronDown,
  Trash2,
  FolderPlus,
  FilePlus,
  MoreVertical,
  Pencil,
  RefreshCw
} from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getUserInfo } from "../utilities";
import { useProject } from "../ProjectContext";
import CreateNewProjectModal from "./MenuSidebar/CreateNewProjectModal";
import CreateItemModal from "./MenuSidebar/CreateItemModal";
import RenameItemModal from "./MenuSidebar/RenameItemModal";
import {
  fetchFileSystem,
  buildTree,
} from "./EmbeddedFileManagement/EmbeddedFileManagement";

const FileExplorer = ({ variant }) => {
  const [fileSystem, setFileSystem] = useState({});
  const [user, setUser] = useState({});
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();

  // State for new modals
  const [createItemType, setCreateItemType] = useState(null); // "file" or "folder"
  const [createItemParent, setCreateItemParent] = useState(null);
  const [renameItem, setRenameItem] = useState(null);
  const {
    isOpen: isCreateItemOpen,
    onOpen: onCreateItemOpen,
    onClose: onCreateItemClose
  } = useDisclosure();
  const {
    isOpen: isRenameItemOpen,
    onOpen: onRenameItemOpen,
    onClose: onRenameItemClose
  } = useDisclosure();

  const {
    activeProjectId,
    setActiveProjectId,
    setActiveProjectName,
    setActiveProductId,
    setActiveProductName,
  } = useProject();

  const textColor = useColorModeValue("gray.700", "gray.200");
  const iconColor = useColorModeValue("gray.500", "gray.400");
  const hoverBg = useColorModeValue("gray.100", "whiteAlpha.100");
  const activeBg = useColorModeValue("blue.50", "whiteAlpha.200");
  const activeBorder = useColorModeValue("blue.200", "blue.500");
  const borderColor = useColorModeValue("gray.100", "gray.700");

  // Fetch user info and file system on mount
  useEffect(() => {
    const userInfo = getUserInfo();
    if (userInfo) {
      setUser(userInfo);
      loadFileSystem(userInfo.userId);
    } else {
      setError("User not logged in");
    }
  }, []);

  const loadFileSystem = async (userId) => {
    setIsLoading(true);
    setError(null);
    const result = await fetchFileSystem(userId, setFileSystem, buildTree);
    if (result && !result.success) {
      setError(result.error);
    }
    setIsLoading(false);
  };

  const openCreateModal = (parent, type) => {
    setCreateItemParent(parent);
    setCreateItemType(type);
    onCreateItemOpen();
  };

  const openRenameModal = (item) => {
    setRenameItem(item);
    onRenameItemOpen();
  };

  const handleRefresh = () => {
    if (user?.userId) {
      loadFileSystem(user.userId);
    }
  };

  const isActiveProjectInFolder = (node, activeId, activeName) => {
    if (!node) return false;
    // Check current node
    if (String(node._id) === String(activeId) || node.name === activeName) {
      return true;
    }
    // Check children recursively
    if (node.children && node.children.length > 0) {
      return node.children.some(child => isActiveProjectInFolder(child, activeId, activeName));
    }
    return false;
  };

  const handleFolderDelete = async (node) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    const id = node._id;
    try {
      await axios.delete(
        "https://eureka.innotrat.in/api/v1/deleteFileAndFolder",
        { data: { fileId: id } }
      );

      console.log("Deleting item:", node.name, id, "Active:", activeProjectName, activeProjectId);

      // Check if the deleted item or any of its children is the active project
      if (isActiveProjectInFolder(node, activeProjectId, activeProjectName)) {
        console.log("Clearing active project state (recursive match found)");
        setActiveProjectId(null);
        setActiveProjectName(null);
        setActiveProductId(null);
        setActiveProductName(null);
      }

      handleRefresh();
    } catch (error) {
      console.error("Error deleting folder:", error);
    }
  };

  const toggleFolder = (folder) => {
    const updateFolderState = (node) => {
      if (node._id === folder._id) {
        return { ...node, isOpen: !node.isOpen };
      }
      if (node.children) {
        return { ...node, children: node.children.map(updateFolderState) };
      }
      return node;
    };

    let updatedFileSystem = { ...fileSystem };
    updatedFileSystem.children = fileSystem.children.map(updateFolderState);

    const isTopLevelFolder = fileSystem.children.some(
      (child) => child._id === folder._id
    );

    if (isTopLevelFolder && activeProjectId !== folder._id) {
      setActiveProjectId(folder._id);
      setActiveProjectName(folder.name);
      setActiveProductId(folder.productId);
      setActiveProductName(folder.name);
    }

    setFileSystem(updatedFileSystem);
  };

  const handleFileClick = (file) => {
    const lowerName = file.name.toLowerCase();
    if (lowerName === "simulation.c" || lowerName.includes("simulation")) {
      navigate("/simulation");
    } else if (lowerName.includes("flowchart") || lowerName.includes("flow chart")) {
      navigate("/FlowchartTest");
    } else if (lowerName.includes("block diagram")) {
      navigate("/BlockDiagram");
    } else if (lowerName.includes("block programming")) {
      navigate("/blockprogramming");
    } else {
      navigate("/editor");
    }
  };

  const renderFileSystem = (node) => (
    <VStack align="start" spacing={0} key={node._id || node.name} width="100%">
      {node.type === "folder" ? (
        <>
          <Box
            display="flex"
            alignItems="center"
            width="100%"
            px={2}
            py={1.5}
            borderRadius="md"
            bg={
              node._id === activeProjectId
                ? activeBg
                : "transparent"
            }
            borderLeftWidth="3px"
            borderLeftColor={
              node._id === activeProjectId
                ? activeBorder
                : "transparent"
            }
            _hover={{
              bg: hoverBg,
              "& .action-buttons": { opacity: 1, visibility: "visible" }
            }}
            cursor="pointer"
            onClick={() => toggleFolder(node)}
            transition="all 0.2s"
            role="group"
          >
            <Box mr={2} display="flex" alignItems="center">
              {node.isOpen ? (
                <ChevronDown size={14} color={iconColor} />
              ) : (
                <ChevronRight size={14} color={iconColor} />
              )}
            </Box>

            <Box mr={2} color="#f59e0b">
              {node.isOpen ? <FolderOpen size={16} /> : <Folder size={16} />}
            </Box>

            <Text
              color={textColor}
              fontSize="sm"
              fontWeight={node._id === activeProjectId ? "600" : "500"}
              noOfLines={1}
              flex="1"
            >
              {node.name}
            </Text>

            <HStack
              className="action-buttons"
              spacing={0}
              opacity={0}
              visibility="hidden"
              transition="all 0.2s"
            >
              <Tooltip label="New Folder" hasArrow>
                <IconButton
                  aria-label="New Folder"
                  icon={<FolderPlus size={14} />}
                  size="xs"
                  variant="ghost"
                  color={iconColor}
                  onClick={(e) => {
                    e.stopPropagation();
                    openCreateModal(node, "folder");
                  }}
                  _hover={{ color: "blue.500", bg: "blue.50" }}
                />
              </Tooltip>
              <Tooltip label="New File" hasArrow>
                <IconButton
                  aria-label="New File"
                  icon={<FilePlus size={14} />}
                  size="xs"
                  variant="ghost"
                  color={iconColor}
                  onClick={(e) => {
                    e.stopPropagation();
                    openCreateModal(node, "file");
                  }}
                  _hover={{ color: "green.500", bg: "green.50" }}
                />
              </Tooltip>
              <Tooltip label="Rename" hasArrow>
                <IconButton
                  aria-label="Rename"
                  icon={<Pencil size={14} />}
                  size="xs"
                  variant="ghost"
                  color={iconColor}
                  onClick={(e) => {
                    e.stopPropagation();
                    openRenameModal(node);
                  }}
                  _hover={{ color: "orange.500", bg: "orange.50" }}
                />
              </Tooltip>
              <Tooltip label="Delete" hasArrow>
                <IconButton
                  aria-label="Delete"
                  icon={<Trash2 size={14} />}
                  size="xs"
                  variant="ghost"
                  color={iconColor}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFolderDelete(node);
                  }}
                  _hover={{ color: "red.500", bg: "red.50" }}
                />
              </Tooltip>
            </HStack>
          </Box>

          <Collapse in={node.isOpen} animateOpacity style={{ width: "100%" }}>
            <Box pl={4} borderLeft="1px solid" borderColor={borderColor} ml={3.5}>
              {node.children.map((child) => renderFileSystem(child))}
            </Box>
          </Collapse>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          px={2}
          py={1.5}
          borderRadius="md"
          cursor="pointer"
          width="100%"
          _hover={{
            bg: hoverBg,
            "& .file-actions": { opacity: 1, visibility: "visible" }
          }}
          transition="all 0.2s"
          role="group"
          onClick={() => handleFileClick(node)}
        >
          <Box mr={2} ml={5} color={iconColor}>
            <File size={15} />
          </Box>

          <Text color={textColor} fontSize="sm" flex="1" noOfLines={1}>
            {node.name}
          </Text>

          <HStack
            className="file-actions"
            spacing={0}
            opacity={0}
            visibility="hidden"
            transition="all 0.2s"
          >
            <Tooltip label="Rename" hasArrow>
              <IconButton
                aria-label="Rename"
                icon={<Pencil size={14} />}
                size="xs"
                variant="ghost"
                color={iconColor}
                onClick={(e) => {
                  e.stopPropagation();
                  openRenameModal(node);
                }}
                _hover={{ color: "orange.500", bg: "orange.50" }}
              />
            </Tooltip>
            <Tooltip label="Delete File" hasArrow>
              <IconButton
                aria-label="Delete File"
                icon={<Trash2 size={14} />}
                size="xs"
                variant="ghost"
                color={iconColor}
                onClick={(e) => {
                  e.stopPropagation();
                  handleFolderDelete(node);
                }}
                _hover={{ color: "red.500", bg: "red.50" }}
              />
            </Tooltip>
          </HStack>
        </Box>
      )}
    </VStack>
  );

  return (
    <Box width="100%" height="100%" display="flex" flexDirection="column" bg={useColorModeValue("white", "gray.900")}>
      <Box mb={4} px={1}>
        <Button
          leftIcon={<Plus size={16} />}
          size="sm"
          width="100%"
          onClick={onOpen}
          colorScheme="blue"
          variant="solid"
          fontSize="xs"
          fontWeight="600"
          borderRadius="md"
          boxShadow="sm"
          _hover={{
            transform: "translateY(-1px)",
            boxShadow: "md"
          }}
        >
          Create New Project
        </Button>
      </Box>

      {error && (
        <Box px={2} py={2} mb={2} bg="red.50" color="red.500" borderRadius="md" fontSize="xs">
          <Text fontWeight="bold">Error loading files:</Text>
          <Text>{error}</Text>
          <Button size="xs" mt={2} colorScheme="red" variant="outline" onClick={handleRefresh} isLoading={isLoading}>
            Retry
          </Button>
        </Box>
      )}

      <Box px={1} mb={2} display="flex" justifyContent="flex-end">
        <IconButton
          icon={<RefreshCw size={14} />}
          size="xs"
          aria-label="Refresh"
          onClick={handleRefresh}
          isLoading={isLoading}
          variant="ghost"
        />
      </Box>

      <Box flex="1" overflowY="auto" className="custom-scrollbar" px={1}>
        {fileSystem.children &&
          fileSystem.children.map((child) => renderFileSystem(child))}
      </Box>

      <CreateNewProjectModal
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        fileSystem={fileSystem}
        folder={"folder"}
        userId={user?.userId}
        setFileSystem={setFileSystem}
      />

      <CreateItemModal
        isOpen={isCreateItemOpen}
        onClose={onCreateItemClose}
        type={createItemType}
        parentFolder={createItemParent}
        userId={user?.userId}
        onSuccess={handleRefresh}
      />

      <RenameItemModal
        isOpen={isRenameItemOpen}
        onClose={onRenameItemClose}
        item={renameItem}
        onSuccess={handleRefresh}
      />
    </Box>
  );
};

export default FileExplorer;
