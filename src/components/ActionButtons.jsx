import React from 'react';
import { VStack, IconButton, Tooltip, useColorModeValue } from '@chakra-ui/react';
import { FaBug, FaBolt, FaTrash, FaPlay } from 'react-icons/fa';

import { GrUndo, GrRedo } from 'react-icons/gr';

const ActionButtons = ({ onRunClick, onDebugClick, onFlashClick, onDeleteClick, onUndoClick, onRedoClick }) => {
        
  const bg = useColorModeValue('gray.200', 'gray.700');

  return (
    <VStack 
      spacing={2} 
      bg={bg}
      p={2} 
      borderRadius="md"
      boxShadow="md"
    >
      <Tooltip label="Run" placement="left">
        <IconButton
          aria-label="Run"
          icon={<FaPlay />}
          onClick={onRunClick}
          colorScheme="green"
          variant="ghost"
        />
      </Tooltip>
      <Tooltip label="Debug" placement="left">
        <IconButton
          aria-label="Debug"
          icon={<FaBug />}
          onClick={onDebugClick}
          colorScheme="blue"
          variant="ghost"
        />
      </Tooltip>
      <Tooltip label="Flash" placement="left">
        <IconButton
          aria-label="Flash"
          icon={<FaBolt />}
          onClick={onFlashClick}
          colorScheme="yellow"
          variant="ghost"
        />
      </Tooltip>
      <Tooltip label="Undo" placement="left">
        <IconButton
          icon={<GrUndo />}
          onClick={onUndoClick}
          aria-label="Undo"
          variant="ghost"
        />
      </Tooltip>
      <Tooltip label="Redo" placement="left">
        <IconButton
          icon={<GrRedo />}
          onClick={onRedoClick}
          aria-label="Redo"
          variant="ghost"
        />
      </Tooltip>
      <Tooltip label="Delete" placement="left">
        <IconButton
          icon={<FaTrash />}
          onClick={onDeleteClick}
          aria-label="Delete Active Tab"
          colorScheme="red"
          variant="ghost"
        />
      </Tooltip>
    </VStack>
  );
};

export default ActionButtons;
