import React, { useState } from "react";
import {
  VStack,
  HStack,
  Text,
  IconButton,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  useColorModeValue,
  Tooltip,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";
import { FaTimes, FaStepForward, FaRedo } from "react-icons/fa";

const Flash = () => {
  // Dynamic colors based on light or dark mode
  const bgColor = useColorModeValue("gray.100", "gray.700");
  const panelBgColor = useColorModeValue("gray.200", "gray.600");
  const textColor = useColorModeValue("gray.600", "gray.200");
  const buttonBgColor = useColorModeValue("blue.500", "blue.300");
  const buttonTextColor = useColorModeValue("white", "black");

  // State for modal visibility
  const [isEraseModalOpen, setEraseModalOpen] = useState(false);
  const [isConfirmOpen, setConfirmOpen] = useState(false);

  const handleErase = () => {
    setConfirmOpen(true); // Open confirmation modal
  };

  const handleFinalErase = () => {
    alert("Existing data erased successfully!");
    setConfirmOpen(false); // Close confirmation modal
    setEraseModalOpen(false); // Close the main modal as well after erase
  };

  const handleCloseEraseModal = () => {
    setEraseModalOpen(false);
  };

  const handleCloseConfirmModal = () => {
    setConfirmOpen(false);
  };

  return (
    <VStack
      align="start"
      spacing={5}
      p={5}
      w="300px"
      h="auto"
      bg={bgColor}
      borderRadius="md"
      boxShadow="md"
      mt={20}
    >
      <Text fontSize="lg" fontWeight="bold" color={textColor}>
        Flash Actions
      </Text>
      <HStack spacing={2}>
        {/* Stop Flash IconButton with Tooltip */}
        <Tooltip label="Abort Flashing" fontSize="sm">
          <IconButton icon={<FaTimes />} aria-label="Stop Flash" size="sm" />
        </Tooltip>

        {/* Step Right IconButton with Tooltip */}
        <Tooltip label="Start Flashing" fontSize="sm">
          <IconButton icon={<FaStepForward />} aria-label="Step Right" size="sm" />
        </Tooltip>

        {/* Restart Flash IconButton with Tooltip */}
        <Tooltip label="Retry Flashing" fontSize="sm">
          <IconButton icon={<FaRedo />} aria-label="Restart Flash" size="sm" />
        </Tooltip>
      </HStack>

      {/* Accordion for Device Info */}
      <Accordion allowToggle w="100%">
        {/* Device Connection Section */}
        <AccordionItem>
          <h2>
            <AccordionButton>
              <Text flex="1" textAlign="left" fontSize="md" fontWeight="bold">
                Device Connection
              </Text>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={2}>
            <Box bg={panelBgColor} borderRadius="md" p={2}>
              <VStack align="start" spacing={1}>
                <Text color={textColor} fontSize="sm">Target Device: Microcontroller</Text>
                <Text color={textColor} fontSize="sm">Port: USB</Text>
                <Text color={textColor} fontSize="sm">Memory Capacity: 22,000</Text>
                <Text color={textColor} fontSize="sm">Protocol: UART</Text>
                <Text color={textColor} fontSize="sm">Connection: Connected</Text>
              </VStack>
            </Box>
          </AccordionPanel>
        </AccordionItem>

        {/* Flashing Time Section */}
        <AccordionItem>
          <h2>
            <AccordionButton>
              <Text flex="1" textAlign="left" fontSize="md" fontWeight="bold">
                Flashing Time
              </Text>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={2}>
            <Box bg={panelBgColor} borderRadius="md" p={2}>
              <VStack align="start" spacing={1}>
                <Text color={textColor} fontSize="sm">Elapsed Time: 2 hrs passed</Text>
                <Text color={textColor} fontSize="sm">Estimated Remaining: 30 mins</Text>
                <Text color={textColor} fontSize="sm">Status: Ongoing</Text>
              </VStack>
            </Box>
          </AccordionPanel>
        </AccordionItem>

        {/* Erase & Flash Section */}
        <AccordionItem>
          <h2>
            <AccordionButton>
              <Text flex="1" textAlign="left" fontSize="md" fontWeight="bold">
                Erase & Flash
              </Text>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={2}>
            <HStack spacing={2}>
              <Button
                size="sm"
                colorScheme="blue"
                bg={buttonBgColor}
                color={buttonTextColor}
                onClick={() => setEraseModalOpen(true)}
              >
                Erase & Flash
              </Button>
              <Button
                size="sm"
                colorScheme="blue"
                bg={buttonBgColor}
                color={buttonTextColor}
                onClick={() => setEraseModalOpen(true)}
              >
                Erase Data 
              </Button>
            </HStack>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>

      {/* Modal for Erase */}
      <Modal isOpen={isEraseModalOpen} onClose={handleCloseEraseModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Erase Device Data</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>This will erase all data on the device. Are you sure?</Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" onClick={handleErase}>
              Erase Data
            </Button>
            <Button variant="outline" onClick={handleCloseEraseModal}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Confirmation Modal */}
      <Modal isOpen={isConfirmOpen} onClose={handleCloseConfirmModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Erase</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Are you sure you want to erase this? This action cannot be undone.</Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" onClick={handleFinalErase}>
              Confirm Erase
            </Button>
            <Button variant="outline" onClick={handleCloseConfirmModal}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  );
};

export default Flash;