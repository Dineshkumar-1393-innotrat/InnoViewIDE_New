import React, { useState } from "react";
import {
  Box,
  Button,
  useColorMode,
  Text,
  Avatar,
  Switch,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  RadioGroup,
  Stack,
  Radio,
  Checkbox,
  VStack,
  useDisclosure,
  Menu,           
  MenuButton,
  MenuList,
  MenuItem
} from "@chakra-ui/react";
import { FiCpu, FiPlay, FiLayout, FiGrid, FiCode, FiLogOut, FiLogIn } from 'react-icons/fi';
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";  
import MenuOptions from "./MenuOptions";  
import BackToHome from "./BackToHome";
import Ellipse521 from '../images/Ellipse 521.svg';
import SimulationPopup from './SimulationPopup';
import HeaderButton from './HeaderButton';

const Navbar = () => {
  const { isAuthenticated, user, loginWithGoogle, logout } = useAuth();
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();  
  const { isOpen: isProfileOpen, onOpen: onProfileOpen, onClose: onProfileClose } = useDisclosure();  
  const navigate = useNavigate();  
  const location = useLocation();

  const bgColor = colorMode === "dark" ? "gray.800" : "gray.200";
  const textColor = colorMode === "dark" ? "white" : "gray.800";

  const [projectName, setProjectName] = useState('');
  const [boardType, setBoardType] = useState('STM32 U5');
  const [projectType, setProjectType] = useState('bare metal');
  const [features, setFeatures] = useState({
    writeCode: false,
    flowChart: false
  });

  const handleCreate = () => {
    console.log({
      projectName,
      projectType,
      boardType,
      features
    });
    onClose(); 
  };

  // Handle the click on the "Embedded" button
  const handleEmbeddedClick = () => {
    navigate("/embedded");  
  };

  const handleSimulationClick = () => {
    navigate("/simulation");  
  };

  const handleDiagramRedirect = () => {
    navigate("/diagram-editor");
  };

  return (
    <Box>
      {/* Main Navbar */}
      <Box
        position="fixed"
        top="0px"
        left={0}
        width="100%"
        height="35px"
        bg={bgColor}
        color={textColor}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        padding="0 10px"
        borderBottom="1px solid gray"
        zIndex={999}
        className="bg-gray-800"
      >
        {/* Left Side: Logo, Back to Home and Menu Options */}
        <Box display="flex" alignItems="center" gap="15px">
          {/* Logo */}
          <Box 
            display="flex" 
            alignItems="center"
            onClick={() => navigate('/diagram-editor')}
            cursor="pointer"
          >
            <img 
              src={Ellipse521} 
              alt="InnoIDE Logo" 
              style={{ 
                width: '24px', 
                height: '24px',
                borderRadius: '50%'
              }} 
            />
            <Text 
              fontWeight="bold" 
              fontSize="sm" 
              ml={2}
              color={textColor}
            >
              InnoIDE
            </Text>
          </Box>
          
          {/* <BackToHome /> */}
          <MenuOptions onOpen={onOpen} />
        </Box>

        {/* Right Side: Settings, Dark Mode Toggle, Profile, and Log In/Out */}
        <Box display="flex" alignItems="center" gap={4}>
          {/* <Box display="flex" alignItems="center">
            <Text mr={2}>Theme</Text>
            <Switch
              isChecked={colorMode === "dark"}
              onChange={toggleColorMode}
              colorScheme="purple"
            />
          </Box> */}

          {/* Navigation Buttons */}
          {location.pathname !== '/embedded' && (
            <HeaderButton 
              onClick={handleEmbeddedClick} 
              title="Go to Embedded Page"
              icon={FiCpu}
            >
              Embedded
            </HeaderButton>
          )}
          {location.pathname !== '/simulation' && (
            <HeaderButton 
              onClick={handleSimulationClick} 
              title="Go to Simulation Page"
              icon={FiPlay}
            >
              Simulation
            </HeaderButton>
          )}
          <HeaderButton 
            onClick={handleDiagramRedirect} 
            title="Go to Flowchart"
            icon={FiLayout}
          >
            Flowchart
          </HeaderButton>

          <HeaderButton 
            onClick={handleDiagramRedirect} 
            title="Go to Block Diagram"
            icon={FiGrid}
          >
            Block Diagram
          </HeaderButton>

          {/* Conditional Code Button */}
          {location.pathname === '/simulation' && (
            <SimulationPopup>
              <HeaderButton 
                icon={FiCode}
              >
                Code
              </HeaderButton>
            </SimulationPopup>
          )}

          {/* Profile Section */}
          <Menu>
            <MenuButton
              as={Avatar}
              name={isAuthenticated ? (user?.name || "User") : "Guest User"}
              src={isAuthenticated ? user?.picture : undefined}
              boxSize="28px"
              border="2px solid"
              borderColor={isAuthenticated ? "green.400" : "gray.400"}
              cursor="pointer"
              _hover={{
                transform: "scale(1.1)",
                boxShadow: "lg",
              }}
              transition="all 0.2s"
            />
            <MenuList>
              {isAuthenticated ? (
                <>
                  <MenuItem>
                    <Box display="flex" alignItems="center" w="100%">
                      <Avatar
                        name={user?.name || "User"}
                        src={user?.picture}
                        boxSize="32px"
                        mr={3}
                        border="2px solid"
                        borderColor="green.400"
                      />
                      <Box>
                        <Text fontWeight="bold" fontSize="sm">{user?.name}</Text>
                        <Text fontSize="xs" color="gray.500">{user?.email}</Text>
                      </Box>
                    </Box>
                  </MenuItem>
                  <MenuItem 
                    onClick={logout}
                    icon={<FiLogOut />}
                    _hover={{ bg: 'red.50', color: 'red.600' }}
                    color="red.500"
                  >
                    Log Out
                  </MenuItem>
                </>
              ) : (
                <MenuItem 
                  onClick={loginWithGoogle}
                  icon={<FiLogIn />}
                  _hover={{ bg: 'blue.50', color: 'blue.600' }}
                  color="blue.500"
                  fontWeight="medium"
                >
                  Log In
                </MenuItem>
              )}
            </MenuList>
          </Menu>

          {/* Debug info - remove after testing */}
          {console.log('Auth Debug:', { isAuthenticated, user })}
        </Box>
      </Box>

      {/* Modal for creating a new project */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create New Project</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Project Name</FormLabel>
              <Input
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Enter project name"
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Project Type</FormLabel>
              <RadioGroup value={projectType} onChange={setProjectType}>
                <Stack direction="row">
                  <Radio value="bare metal">Bare Metal</Radio>
                </Stack>
              </RadioGroup>
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Board</FormLabel>
              <RadioGroup value={boardType} onChange={setBoardType}>
                <Stack direction="row">
                  <Radio value="STM32 U5">STM32 U5</Radio>
                  <Radio value="NRF52840">NRF52840</Radio>
                </Stack>
              </RadioGroup>
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Additional Options</FormLabel>
              <VStack align="start">
                <Checkbox
                  isChecked={features.writeCode}
                  onChange={(e) => setFeatures({ ...features, writeCode: e.target.checked })}
                >
                  Write Code
                </Checkbox>
                <Checkbox
                  isChecked={features.flowChart}
                  onChange={(e) => setFeatures({ ...features, flowChart: e.target.checked })}
                >
                  Flow Chart
                </Checkbox>
              </VStack>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleCreate}>
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Profile Modal */}
      {/*
      <Modal isOpen={isProfileOpen} onClose={onProfileClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Profile</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {isAuthenticated ? (
              <>
                <Box display="flex" alignItems="center" w="100%">
                  <Avatar
                    name={user?.name || "User"}
                    src={user?.picture}
                    boxSize="32px"
                    mr={3}
                    border="2px solid"
                    borderColor="green.400"
                  />
                  <Box>
                    <Text fontWeight="bold" fontSize="sm">{user?.name}</Text>
                    <Text fontSize="xs" color="gray.500">{user?.email}</Text>
                  </Box>
                </Box>
                <Button 
                  bg="transparent" 
                  _hover={{ bg: "red.50", color: "red.600" }}
                  onClick={logout}
                >
                  <Text fontSize="sm" color="red.500">Log Out</Text>
                </Button>
              </>
            ) : (
              <>
                <Box display="flex" alignItems="center" w="100%">
                  <Avatar
                    name="Guest User"
                    boxSize="32px"
                    mr={3}
                    bg="gray.400"
                  />
                  <Box>
                    <Text fontWeight="bold" fontSize="sm">Guest User</Text>
                    <Text fontSize="xs" color="gray.500">Not logged in</Text>
                  </Box>
                </Box>
                <Button 
                  bg="transparent" 
                  _hover={{ bg: "blue.50", color: "blue.600" }}
                  onClick={loginWithGoogle}
                >
                  <Text fontSize="sm" color="blue.500" fontWeight="medium">Log In</Text>
                </Button>
              </>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
      */}
    </Box>
  );
};

export default Navbar;
