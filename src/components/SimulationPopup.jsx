import React, { useState } from 'react';
import { 
  Button, 
  Modal, 
  ModalOverlay, 
  ModalContent, 
  ModalHeader, 
  ModalFooter, 
  ModalBody, 
  ModalCloseButton,
  Textarea,
  useDisclosure,
  Box
} from '@chakra-ui/react'
import { FaExpand, FaCompress } from 'react-icons/fa';

const SimulationPopup = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [code, setCode] = useState('');

  const toggleFullScreen = () => setIsFullScreen(!isFullScreen);

  return (
    <>
      <Box onClick={onOpen} display="inline-block">
        {children}
      </Box>

      <Modal 
        isOpen={isOpen} 
        onClose={onClose} 
        size={isFullScreen ? 'full' : 'xl'}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader 
            display="flex" 
            justifyContent="space-between" 
            alignItems="center"
          >
            Code Editor
            <Button 
              variant="ghost" 
              onClick={toggleFullScreen}
              leftIcon={isFullScreen ? <FaCompress /> : <FaExpand />}
            >
              {isFullScreen ? 'Minimize' : 'Fullscreen'}
            </Button>
          </ModalHeader>
          <ModalCloseButton />
          
          <ModalBody>
            <Textarea 
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Select your hexagon and write your code here..."
              height="400px"
              resize="none"
            />
          </ModalBody>

          <ModalFooter>
            <Button 
              colorScheme="green" 
              mr={3} 
              onClick={() => {
                console.log('Saving code:', code);
                onClose();
              }}
            >
              Save
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default SimulationPopup;