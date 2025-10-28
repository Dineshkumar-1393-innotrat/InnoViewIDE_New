import React from "react";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useColorMode,
  Button,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { FaFile, FaEdit, FaEye, FaTools, FaQuestionCircle } from "react-icons/fa";

const MenuOptions = ({ onOpen }) => {
  const { colorMode } = useColorMode();

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
      {/* File Menu code */}
      <Menu>
        <MenuButton as={Button} variant="link" rightIcon={<ChevronDownIcon />}>
          File
        </MenuButton>
        <MenuList>
          <MenuItem icon={<FaFile />} onClick={onOpen}>
            New
          </MenuItem>
          <MenuItem icon={<FaFile />}>Open</MenuItem>
          <MenuItem icon={<FaFile />}>Save</MenuItem>
          <MenuItem icon={<FaFile />}>Save As</MenuItem>
          <MenuItem icon={<FaFile />}>Export</MenuItem>
          <MenuItem icon={<FaFile />}>Close Project</MenuItem>
          <MenuItem icon={<FaFile />}>Exit</MenuItem>
        </MenuList>
      </Menu>

      {/* Edit Menu code */}
      <Menu>
        <MenuButton as={Button} variant="link" rightIcon={<ChevronDownIcon />}>
          Edit
        </MenuButton>
        <MenuList>
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
        </MenuList>
      </Menu>

      {/* View Menu code */}
      <Menu>
        <MenuButton as={Button} variant="link" rightIcon={<ChevronDownIcon />}>
          View
        </MenuButton>
        <MenuList>
          <MenuItem icon={<FaEye />}>Zoom In</MenuItem>
          <MenuItem icon={<FaEye />}>Zoom Out</MenuItem>
          <MenuItem icon={<FaEye />}>Full Screen</MenuItem>
          <MenuItem icon={<FaEye />}>Toggle Side Bar</MenuItem>
          <MenuItem icon={<FaEye />}>Toggle Serial Console</MenuItem>
          <MenuItem icon={<FaEye />}>Toggle Debug Panel</MenuItem>
          <MenuItem icon={<FaEye />}>Toggle Line Numbers</MenuItem>
        </MenuList>
      </Menu>

      {/* Tools Menu code */}
      <Menu>
        <MenuButton as={Button} variant="link" rightIcon={<ChevronDownIcon />}>
          Tools
        </MenuButton>
        <MenuList>
          <MenuItem icon={<FaTools />}>Options</MenuItem>
          <MenuItem icon={<FaTools />}>Compile</MenuItem>
          <MenuItem icon={<FaTools />}>Build</MenuItem>
          <MenuItem icon={<FaTools />}>Debug</MenuItem>
          <MenuItem icon={<FaTools />}>Flash</MenuItem>
          <MenuItem icon={<FaTools />}>Erase</MenuItem>
          <MenuItem icon={<FaTools />}>Serial Monitor</MenuItem>
          <MenuItem icon={<FaTools />}>Terminal</MenuItem>
        </MenuList>
      </Menu>

      {/* Help Menu code */}
      <Menu>
        <MenuButton as={Button} variant="link" rightIcon={<ChevronDownIcon />}>
          Help
        </MenuButton>
        <MenuList>
          <MenuItem icon={<FaQuestionCircle />}>Documentation</MenuItem>
          <MenuItem icon={<FaQuestionCircle />}>About</MenuItem>
        </MenuList>
      </Menu>

      {/* Terminal Menu code */}
      <Menu>
        <MenuButton as={Button} variant="link" rightIcon={<ChevronDownIcon />}>
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
      </Menu>
    </>
  );
};

export default MenuOptions;
