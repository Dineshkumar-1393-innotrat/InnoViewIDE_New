
import React, { useState } from "react";
import { Flex, IconButton } from "@chakra-ui/react";
import { FaBug, FaCogs, FaTrashAlt } from "react-icons/fa";
import { MdFlashOn } from "react-icons/md";
import Erase from "./Erase"; 
import Popup from "./Popup";

const IconBar = ({ onDebugClick, onFlashClick }) => {
  const [isEraseOpen, setEraseOpen] = useState(false);

  return (
    <Flex
      direction="column"
      position="absolute"
      top="50%"
      right="0"
      transform="translateY(-50%)"
      spacing={2}
    >
      <IconButton
        icon={<FaCogs />}
        aria-label="Build"
        size="md"
        colorScheme="blue"
        mb={2}
        variant="outline"
      />
      <IconButton
        icon={<FaBug />}
        aria-label="Debug"
        size="md"
        colorScheme="green"
        mb={2}
        variant="outline"
        onClick={onDebugClick}
      />
      <IconButton
        icon={<MdFlashOn />}
        aria-label="Flash"
        size="md"
        colorScheme="yellow"
        mb={2}
        variant="outline"
        onClick={onFlashClick}
        
      />
      <IconButton
        icon={<FaTrashAlt />}
        aria-label="Erase"
        size="md"
        colorScheme="red"
        mb={2}
        variant="outline"
        onClick={() => setEraseOpen(true)} // Open the Erase modal on click
      />
      
      {/* Render the Erase modal so this code i have introduced  */}
      <Erase isOpen={isEraseOpen} onClose={() => setEraseOpen(false)} />
    </Flex>
  );
};

export default IconBar;

