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
} from "@chakra-ui/react";
import { FaFile, FaFolder, FaFolderOpen, FaPlus, FaChevronRight, FaChevronDown } from "react-icons/fa";
import { FaFolderPlus } from "react-icons/fa6";
import { AiFillFileAdd } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import axios from "axios";
import { getUserInfo } from "../utilities";
import { useProject } from "../ProjectContext";
import CreateNewProjectModal from "./MenuSidebar/CreateNewProjectModal";
import {
  fetchFileSystem,
  buildTree,
  checkProductDefinition,
} from "./EmbeddedFileManagement/EmbeddedFileManagement";

const FileExplorer = ({ variant }) => {
  const [fileSystem, setFileSystem] = useState({});
  const [user, setUser] = useState({});
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    activeProjectId,
    setActiveProjectId,
    setActiveProjectName,
    setActiveProductId,
    setActiveProductName,
  } = useProject();

  const textColor = useColorModeValue("gray.700", "gray.200");
  const iconColor = useColorModeValue("gray.600", "gray.400");

  // Fetch user info and file system on mount
  useEffect(() => {
    const userInfo = getUserInfo();
    if (userInfo) {
      setUser(userInfo);
      fetchFileSystem(userInfo?.userId, setFileSystem, buildTree);
    }
  }, []);

  const addItem = async (parentFolder, type, userId) => {
    try {
      const newItemName = prompt(`Enter ${type} name:`);
      if (!newItemName) return;

      if (type === "file") {
        const fileNameArray = newItemName.split(".");
        const fileExtensionType = fileNameArray[fileNameArray.length - 1];

        if (!fileExtensionType || fileNameArray.length < 2) {
          throw new Error("File extension required");
        }

        if (fileExtensionType !== "c") {
          throw new Error("Only file extension type .c allowed");
        }

        if (newItemName.toLowerCase() === "main.c") {
          throw new Error('File name "main.c" is not allowed.');
        }
      }

      const { data } = await axios.post(
        "https://eureka.innotrat.in/api/v1/createFileAndFolder",
        {
          parentId: parentFolder._id,
          name: newItemName,
          type,
          userId,
        }
      );

      if (data.success) {
        fetchFileSystem(user.userId, setFileSystem, buildTree);
      }
    } catch (error) {
      console.error(`Error creating ${type}:`, error);
      alert(error.message || "An error occurred.");
    }
  };

  const handleFolderDelete = async (id) => {
    try {
      await axios.delete(
        "https://eureka.innotrat.in/api/v1/deleteFileAndFolder",
        { data: { fileId: id } }
      );
      alert("Folder deleted successfully!");
      fetchFileSystem(user.userId, setFileSystem, buildTree);
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

  const renderFileSystem = (node) => (
    <VStack align="start" spacing={1} key={node._id || node.name} width="100%">
      {node.type === "folder" ? (
        <>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            width="100%"
            px={3}
            py={2}
            borderRadius="lg"
            bg={
              node.isOpen || node._id === activeProjectId
                ? "rgba(56, 189, 248, 0.15)"
                : "transparent"
            }
            borderWidth="1px"
            borderColor={
              node.isOpen || node._id === activeProjectId
                ? "rgba(56, 189, 248, 0.3)"
                : "transparent"
            }
            _hover={{
              bg: "rgba(99, 102, 241, 0.1)",
              borderColor: "rgba(99, 102, 241, 0.3)",
              transform: "translateX(4px)",
              boxShadow: "0 4px 12px rgba(99, 102, 241, 0.2)"
            }}
            cursor="pointer"
            onClick={() => toggleFolder(node)}
            transition="all 0.2s"
            className="group"
          >
            <Box display="flex" alignItems="center" gap={2} flex="1">
              {node.isOpen ? (
                <FaChevronDown color={iconColor} size="10px" />
              ) : (
                <FaChevronRight color={iconColor} size="10px" />
              )
              }
              {node.isOpen ? (
                <FaFolderOpen color="#f59e0b" />
              ) : (
                <FaFolder color="#f59e0b" />
              )}
              <Text color={textColor} margin={0} flex="1" fontSize="sm" fontWeight="500" noOfLines={1}>
                {node.name}
              </Text>
            </Box>

            <Box display="none" ml="2" alignItems="center" sx={{ ".group:hover &": { display: "flex" } }}>
              <Tooltip label={node.name === "root" ? "Create Project" : "Create Folder"} hasArrow>
                <IconButton
                  aria-label="Create Folder"
                  icon={<FaFolderPlus />}
                  size="xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    addItem(node, "folder", user?.userId);
                  }}
                  variant="ghost"
                  color="gray.400"
                  bg="rgba(255, 255, 255, 0.05)"
                  _hover={{ bg: "blue.500", color: "white", transform: "scale(1.1)" }}
                  transition="all 0.2s"
                />
              </Tooltip>
              <Tooltip label="Create File" hasArrow>
                <IconButton
                  aria-label="Create File"
                  icon={<AiFillFileAdd />}
                  size="xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    addItem(node, "file", user?.userId);
                  }}
                  variant="ghost"
                  color="gray.400"
                  bg="rgba(255, 255, 255, 0.05)"
                  _hover={{ bg: "blue.500", color: "white", transform: "scale(1.1)" }}
                  transition="all 0.2s"
                />
              </Tooltip>
              <Tooltip label="Delete Folder" hasArrow>
                <IconButton
                  aria-label="Delete Folder"
                  icon={<MdDelete />}
                  size="xs"
                  variant="ghost"
                  color="gray.400"
                  bg="rgba(255, 255, 255, 0.05)"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFolderDelete(node._id);
                  }}
                  _hover={{ bg: "red.500", color: "white", transform: "scale(1.1)" }}
                  transition="all 0.2s"
                />
              </Tooltip>
            </Box>
          </Box>

          <Collapse in={node.isOpen}>
            <Box pl={4}>
              {node.children.map((child) => renderFileSystem(child))}
            </Box>
          </Collapse>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          px={3}
          py={2}
          borderRadius="lg"
          cursor="pointer"
          borderWidth="1px"
          borderColor="transparent"
          _hover={{
            bg: "rgba(99, 102, 241, 0.1)",
            borderColor: "rgba(99, 102, 241, 0.3)",
            transform: "translateX(4px)",
            boxShadow: "0 4px 12px rgba(99, 102, 241, 0.2)"
          }}
          width="100%"
          transition="all 0.2s"
          className="group"
        >
          <FaFile color={iconColor} />
          <Text color={textColor} margin={0} ml={2} fontSize="sm" fontWeight="500" flex="1" noOfLines={1}>
            {node.name}
          </Text>
          <Tooltip label="Delete File" hasArrow>
            <IconButton
              aria-label="Delete File"
              icon={<MdDelete />}
              ml="auto"
              size="xs"
              variant="ghost"
              color="gray.400"
              bg="rgba(255, 255, 255, 0.05)"
              onClick={(e) => {
                e.stopPropagation();
                handleFolderDelete(node._id);
              }}
              display="none"
              sx={{ ".group:hover &": { display: "flex" } }}
              _hover={{ bg: "red.500", color: "white", transform: "scale(1.1)" }}
              transition="all 0.2s"
            />
          </Tooltip>
        </Box>
      )}
    </VStack>
  );

  return (
    <Box width="100%" height="100%" display="flex" flexDirection="column">
      <Box mb={3}>
        <Button
          leftIcon={<FaPlus />}
          size="md"
          width="100%"
          onClick={onOpen}
          bgGradient="linear(to-r, blue.500, cyan.400)"
          color="white"
          fontWeight="600"
          fontSize="sm"
          borderRadius="lg"
          py={3}
          _hover={{
            bgGradient: "linear(to-r, blue.600, cyan.500)",
            transform: "translateY(-2px)",
            boxShadow: "0 8px 16px rgba(59, 130, 246, 0.4)"
          }}
          _active={{
            transform: "translateY(0)",
            boxShadow: "0 4px 8px rgba(59, 130, 246, 0.3)"
          }}
          transition="all 0.2s"
          boxShadow="0 4px 12px rgba(59, 130, 246, 0.3)"
        >
          Create New Project
        </Button>
      </Box>

      <Box flex="1" overflowY="auto">
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
    </Box>
  );
};

export default FileExplorer;
