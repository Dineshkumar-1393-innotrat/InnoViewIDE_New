import React, { useRef, useState } from "react";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useColorMode,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { FiTool, FiHelpCircle, FiFile } from 'react-icons/fi';
import HeaderButton from './HeaderButton';

const MenuOptions = ({ onOpen }) => {
  const { colorMode } = useColorMode();
  const toast = useToast();
  const { isOpen: isAlertOpen, onOpen: onAlertOpen, onClose: onAlertClose } = useDisclosure();
  const cancelRef = useRef();
  const fileInputRef = useRef();
  const [currentProject, setCurrentProject] = useState(null);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // File Operations
  const handleOpen = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCurrentProject({
          name: file.name,
          content: e.target.result,
          type: file.type
        });
        toast({
          title: "File Opened",
          description: `Successfully opened ${file.name}`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      };
      reader.readAsText(file);
    }
  };

  const handleSave = () => {
    if (!currentProject) {
      toast({
        title: "No File to Save",
        description: "Please open or create a file first",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const blob = new Blob([currentProject.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = currentProject.name || 'untitled.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "File Saved",
      description: `Successfully saved ${currentProject.name}`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleExport = () => {
    if (!currentProject) {
      toast({
        title: "No Project to Export",
        description: "Please open a project first",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const exportData = {
      project: currentProject,
      exportDate: new Date().toISOString(),
      version: "1.0"
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentProject.name || 'project'}_export.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Project Exported",
      description: "Project exported successfully",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,.txt,.js,.jsx,.py,.cpp,.c,.h';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        // If the file is a diagram, dispatch an event for the DiagramEditor
        if (file.name.endsWith('diagram.json') || file.type === 'application/json') {
          const loadEvent = new CustomEvent('load-json-file', { detail: file });
          window.dispatchEvent(loadEvent);
          toast({
            title: "Diagram Imported",
            description: `Successfully imported ${file.name}`,
            status: "success",
            duration: 3000,
            isClosable: true,
          });
          return; // Stop further processing for diagrams
        }

        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            let importedData;
            if (file.name.endsWith('.json')) {
              importedData = JSON.parse(event.target.result);
              setCurrentProject(importedData.project || { name: file.name, content: event.target.result });
            } else {
              setCurrentProject({ name: file.name, content: event.target.result });
            }
            toast({
              title: "File Imported",
              description: `Successfully imported ${file.name}`,
              status: "success",
              duration: 3000,
              isClosable: true,
            });
          } catch (error) {
            toast({
              title: "Import Failed",
              description: "Failed to import file. Please check the file format.",
              status: "error",
              duration: 3000,
              isClosable: true,
            });
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleExit = () => {
    onAlertOpen();
  };

  const confirmExit = () => {
    onAlertClose();
    window.close();
  };

  // Tools Operations
  const handleOptions = () => {
    toast({
      title: "Options",
      description: "Opening IDE settings and preferences",
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleCompile = () => {
    if (!currentProject) {
      toast({
        title: "No Project to Compile",
        description: "Please open a project first",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    toast({
      title: "Compiling...",
      description: `Compiling ${currentProject.name}`,
      status: "loading",
      duration: 2000,
      isClosable: true,
    });

    setTimeout(() => {
      toast({
        title: "Compilation Complete",
        description: "Project compiled successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }, 2000);
  };

  const handleBuild = () => {
    if (!currentProject) {
      toast({
        title: "No Project to Build",
        description: "Please open a project first",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    toast({
      title: "Building...",
      description: `Building ${currentProject.name}`,
      status: "loading",
      duration: 3000,
      isClosable: true,
    });

    setTimeout(() => {
      toast({
        title: "Build Complete",
        description: "Project built successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }, 3000);
  };

  const handleDebug = () => {
    toast({
      title: "Debug Mode",
      description: "Starting debug session",
      status: "info",
      duration: 3000,
      isClosable: true,
    });
    scrollToSection("debug-panel");
  };

  const handleFlash = () => {
    if (!currentProject) {
      toast({
        title: "No Project to Flash",
        description: "Please build a project first",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    toast({
      title: "Flashing Device...",
      description: "Uploading firmware to device",
      status: "loading",
      duration: 4000,
      isClosable: true,
    });

    setTimeout(() => {
      toast({
        title: "Flash Complete",
        description: "Firmware uploaded successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }, 4000);
  };

  const handleErase = () => {
    toast({
      title: "Erasing Device...",
      description: "Clearing device memory",
      status: "loading",
      duration: 2000,
      isClosable: true,
    });

    setTimeout(() => {
      toast({
        title: "Erase Complete",
        description: "Device memory cleared successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }, 2000);
  };

  const handleSerialMonitor = () => {
    toast({
      title: "Serial Monitor",
      description: "Opening serial communication monitor",
      status: "info",
      duration: 3000,
      isClosable: true,
    });
    scrollToSection("serial-monitor");
  };

  const handleTerminal = () => {
    toast({
      title: "Terminal",
      description: "Opening integrated terminal",
      status: "info",
      duration: 3000,
      isClosable: true,
    });
    scrollToSection("terminal");
  };

  // Help Operations
  const handleDocumentation = () => {
    window.open("https://docs.example.com", "_blank");
    toast({
      title: "Documentation",
      description: "Opening documentation in new tab",
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleAbout = () => {
    toast({
      title: "About InnoIDE",
      description: "Version 2.0 - Advanced Development Environment",
      status: "info",
      duration: 5000,
      isClosable: true,
    });
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileSelect}
        accept=".txt,.js,.jsx,.py,.cpp,.c,.h,.json"
      />

      {/* File Menu code */}
      <Menu>
        {({ isOpen }) => (
          <>
            <MenuButton as={HeaderButton} icon={FiFile} isActive={isOpen}>
              File
            </MenuButton>
            <MenuList>
              <MenuItem onClick={onOpen}>New</MenuItem>
              <MenuItem onClick={handleOpen}>Open</MenuItem>
              <MenuItem onClick={handleSave}>Save</MenuItem>
              <MenuItem onClick={handleExport}>Export</MenuItem>
              <MenuItem onClick={handleImport}>Import</MenuItem>
              <MenuItem onClick={handleExit}>Exit</MenuItem>
            </MenuList>
          </>
        )}
      </Menu>

      {/* Edit Menu code */}
      <Menu>
        {/* <MenuButton variant="link" rightIcon={<ChevronDownIcon />}>
          Edit
        </MenuButton> */}
        {/* <MenuList>
          <MenuItem icon={<FaEdit />}>Undo</MenuItem>
          <MenuItem icon={<FaEdit />}>Redo</MenuItem>
          <MenuItem icon={<FaEdit />}>Cut</MenuItem>
          <MenuItem icon={<FaEdit />}>Copy</MenuItem>
          <MenuItem icon={<FaEdit />}>Paste</MenuItem>
          <MenuItem icon={<FaEdit />}>Select All</MenuItem>
          <MenuItem icon={<FaEdit />}>Replicate</MenuItem>
          <MenuItem icon={<FaEdit />}>Duplicate Line</MenuItem>
          <MenuItem icon={<FaEdit />}>Move Line Up</MenuItem>
          <MenuItem icon={<FaEdit />}>Move Line Down</MenuItem>
        </MenuList> */}
      </Menu>

      {/* View Menu code */}
      <Menu>
        {/* <MenuButton variant="link" rightIcon={<ChevronDownIcon />}>
          View
        </MenuButton> */}
        {/* <MenuList>
          <MenuItem icon={<FaEye />}>Zoom In</MenuItem>
          <MenuItem icon={<FaEye />}>Zoom Out</MenuItem>
          <MenuItem icon={<FaEye />}>Full Screen</MenuItem>
          <MenuItem icon={<FaEye />}>Toggle Side Bar</MenuItem>
          <MenuItem icon={<FaEye />}>Toggle Serial Console</MenuItem>
          <MenuItem icon={<FaEye />}>Toggle Debug Panel</MenuItem>
          <MenuItem icon={<FaEye />}>Toggle Line Numbers</MenuItem>
        </MenuList> */}
      </Menu>

      {/* Tools Menu code */}
      <Menu>
        {({ isOpen }) => (
          <>
            <MenuButton as={HeaderButton} icon={FiTool} isActive={isOpen}>
              Tools
            </MenuButton>
            <MenuList>
              <MenuItem onClick={handleOptions}>Options</MenuItem>
              <MenuItem onClick={handleCompile}>Compile</MenuItem>
              <MenuItem onClick={handleBuild}>Build</MenuItem>
              <MenuItem onClick={handleDebug}>Debug</MenuItem>
              <MenuItem onClick={handleFlash}>Flash</MenuItem>
              <MenuItem onClick={handleErase}>Erase</MenuItem>
              <MenuItem onClick={handleSerialMonitor}>Serial Monitor</MenuItem>
              <MenuItem onClick={handleTerminal}>Terminal</MenuItem>
            </MenuList>
          </>
        )}
      </Menu>

      {/* Help Menu code */}
      <Menu>
        {({ isOpen }) => (
          <>
            <MenuButton as={HeaderButton} icon={FiHelpCircle} isActive={isOpen}>
              Help
            </MenuButton>
            <MenuList>
              <MenuItem onClick={handleDocumentation}>Documentation</MenuItem>
              <MenuItem onClick={handleAbout}>About</MenuItem>
            </MenuList>
          </>
        )}
      </Menu>

      {/* Terminal Menu code */}
      {/* <Menu>
        <MenuButton variant="link" rightIcon={<ChevronDownIcon />}>
          Terminal
        </MenuButton>
        <MenuList>
          <MenuItem icon={<FaEdit />} onClick={() => scrollToSection("terminal")}>
            Terminal
          </MenuItem>
          <MenuItem icon={<FaEdit />} onClick={() => scrollToSection("output-box")}>
            Output Box
          </MenuItem>
        </MenuList>
      </Menu> */}

      {/* Exit Confirmation Dialog */}
      <AlertDialog
        isOpen={isAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={onAlertClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Exit Application
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to exit? Any unsaved changes will be lost.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onAlertClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={confirmExit} ml={3}>
                Exit
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default MenuOptions;
