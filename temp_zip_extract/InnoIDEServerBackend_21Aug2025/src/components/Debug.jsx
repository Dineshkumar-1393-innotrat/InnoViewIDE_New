import React, { useState } from "react";
import {
  Box,
  Button,
  Text,
  VStack,
  Divider,
  Flex,
  Collapse,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Checkbox,
  Input,
  useDisclosure,
} from "@chakra-ui/react";
import { MdPlayArrow, MdArrowDownward, MdArrowUpward, MdRefresh, MdStop } from "react-icons/md"; // Updated imports
import { RiRestartLine } from "react-icons/ri"; // Importing the RiRestartLine icon

const Debug = () => {
  // collapse of sections section
  const [isThreadsOpen, setIsThreadsOpen] = useState(false);
  const [isVariablesOpen, setIsVariablesOpen] = useState(false);
  const [isBreakpointsOpen, setIsBreakpointsOpen] = useState(false);
  const [isVariableBreakdownOpen, setIsVariableBreakdownOpen] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isBreakpointEnabled, setBreakpointEnabled] = useState(false);
  const [isHitCountEnabled, setHitCountEnabled] = useState(false);
  const [hitCount, setHitCount] = useState(0);

  const bgColor = useColorModeValue("gray.100", "gray.700");
  const panelBgColor = useColorModeValue("gray.200", "gray.600");
  const textColor = useColorModeValue("gray.600", "gray.200");
  const buttonBgColor = useColorModeValue("blue.500", "blue.300");
  const buttonTextColor = useColorModeValue("white", "black");

  const handleSetBreakpoint = () => {
    console.log("Breakpoint set:", isBreakpointEnabled, "Hit Count:", hitCount);
    onClose();
  };

  const toggleDropdown = (dropdown) => {
    if (dropdown === "threads") {
      setIsThreadsOpen((prev) => !prev);
      setIsVariablesOpen(false);
      setIsBreakpointsOpen(false);
      setIsVariableBreakdownOpen(false);
    } else if (dropdown === "variables") {
      setIsVariablesOpen((prev) => !prev);
      setIsThreadsOpen(false);
      setIsBreakpointsOpen(false);
      setIsVariableBreakdownOpen(false);
    } else if (dropdown === "breakpoints") {
      setIsBreakpointsOpen((prev) => !prev);
      setIsThreadsOpen(false);
      setIsVariablesOpen(false);
      setIsVariableBreakdownOpen(false);
    } else if (dropdown === "variableBreakdown") {
      setIsVariableBreakdownOpen((prev) => !prev);
      setIsThreadsOpen(false);
      setIsVariablesOpen(false);
      setIsBreakpointsOpen(false);
    }
  };

  return (
    <VStack
      spacing={3} 
      align="stretch"
      p={3} 
      mt={85} 
      bg={bgColor}
      height="80%"
      borderRadius="md"
      boxShadow="md"
    >
      {/* Section 1: Launch.json Information */}
      <Box>
        <Text fontSize="xs" fontWeight="bold" color={textColor}>
          Run and Debug
        </Text>
        <Text fontSize="sm">To customize Run and Debug, create a launch.json file.</Text>
      </Box>

      {/* Section 2: Run and Debug Buttons */}
      <Box>
        <Button
          leftIcon={<MdPlayArrow />}
          colorScheme="blue"
          bg={buttonBgColor}
          color={buttonTextColor}
          width="100%"
          mb={2}
          size="sm"
        >
          Run & Debug
        </Button>
      </Box>

      <Divider borderColor={useColorModeValue("gray.300", "gray.500")} />

      {/* Section 3: Debug Panel */}
      <Box>
        <Text fontSize="sm" fontWeight="bold" color={textColor}>
          Debug Panel
        </Text>
      </Box>

      {/* Section 4: Step Control Icons */}
      <Flex justify="space-between" pt={2}>
        <Button variant="outline" leftIcon={<MdPlayArrow />} size="xs" /> {/* Play icon */}
        <Button variant="outline" leftIcon={<RiRestartLine />} size="xs" /> {/* Restart icon */}
        <Button variant="outline" leftIcon={<MdArrowDownward />} size="xs" /> {/* Step into */}
        <Button variant="outline" leftIcon={<MdArrowUpward />} size="xs" /> {/* Step out */}
        <Button variant="outline" leftIcon={<MdRefresh />} size="xs" /> {/* Restart */}
        <Button variant="outline" leftIcon={<MdStop />} size="xs" /> {/* Stop */}
      </Flex>

      {/* Section 5: Threads */}
      <Box>
        <Text
          fontSize="xs"
          fontWeight="bold"
          color={textColor}
          onClick={() => toggleDropdown("threads")}
          cursor="pointer"
        >
          Threads
        </Text>
        <Collapse in={isThreadsOpen}>
          <Box bg={panelBgColor} borderRadius="md" p={2} mt={1}>
            <Text color={textColor} fontSize="sm">remote target ......................running</Text>
            <Text color={textColor} fontSize="sm">remote target ......................running</Text>
            <Text color={textColor} fontSize="sm">remote target ......................running</Text>
          </Box>
        </Collapse>
      </Box>

      <Divider borderColor={useColorModeValue("gray.300", "gray.500")} />

      {/* Section 6: Breakpoints */}
      <Box>
        <Text
          fontSize="xs"
          fontWeight="bold"
          color={textColor}
          onClick={() => toggleDropdown("breakpoints")}
          cursor="pointer"
        >
          Breakpoints
        </Text>
        <Collapse in={isBreakpointsOpen}>
          <Box bg={panelBgColor} borderRadius="md" p={2} mt={1}>
            <Text color={textColor} fontSize="sm">blink.ino\variables..........18</Text>
            <Text color={textColor} fontSize="sm">blink.ino\variables..........20</Text>
            <Button size="xs" onClick={onOpen} mt={2} colorScheme="blue">
              Configure Breakpoint
            </Button>
          </Box>
        </Collapse>
      </Box>

      <Divider borderColor={useColorModeValue("gray.300", "gray.500")} />

      {/* Section 7: Variable Breakdown */}
      <Box>
        <Text
          fontSize="xs"
          fontWeight="bold"
          color={textColor}
          onClick={() => toggleDropdown("variableBreakdown")}
          cursor="pointer"
        >
          Variable Breakdown
        </Text>
        <Collapse in={isVariableBreakdownOpen}>
          <Box bg={panelBgColor} borderRadius="md" p={2} mt={1}>
            <Text color={textColor} fontSize="sm">variable1 = 42</Text>
            <Text color={textColor} fontSize="sm">variable2 = "hello"</Text>
            <Text color={textColor} fontSize="sm">variable3 = true</Text>
          </Box>
        </Collapse>
      </Box>

      <Divider borderColor={useColorModeValue("gray.300", "gray.500")} />

      {/* Modal for setting breakpoints */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="sm">Set Breakpoint</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex alignItems="center" mb={2}>
              <Checkbox
                isChecked={isBreakpointEnabled}
                onChange={(e) => setBreakpointEnabled(e.target.checked)}
              >
                Enable Breakpoint
              </Checkbox>
            </Flex>
            <Flex alignItems="center">
              <Checkbox
                isChecked={isHitCountEnabled}
                onChange={(e) => setHitCountEnabled(e.target.checked)}
              >
                Enable Hit Count
              </Checkbox>
              {isHitCountEnabled && (
                <Input
                  size="xs"
                  value={hitCount}
                  onChange={(e) => setHitCount(e.target.value)}
                  ml={2}
                  placeholder="Hit Count"
                />
              )}
            </Flex>
          </ModalBody>
          <ModalFooter>
            <Button size="sm" colorScheme="blue" onClick={handleSetBreakpoint}>
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  );
};

export default Debug;
