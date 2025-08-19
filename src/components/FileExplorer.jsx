
import React, { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Divider,
  useColorMode,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  List,
  ListItem,
  Text,
  CloseButton,
} from "@chakra-ui/react";
import { ChevronDownIcon } from '@chakra-ui/icons';

const FileExplorer = () => {
  const { colorMode } = useColorMode();
  const [selectedPanel, setSelectedPanel] = useState('');
  const [isPopupOpen, setPopupOpen] = useState(true);

  const peripheralsList = [
    { id: '01', name: 'ADC' },
    { id: '02', name: 'COMP1' },
    { id: '03', name: 'COMP2' },
    { id: '04', name: 'CRC' },
    { id: '05', name: 'I2C1' },
    { id: '06', name: 'I2C2' },
    { id: '07', name: '1252' },
    { id: '08', name: 'IWDG' },
    { id: '09', name: 'LPTIM1' },
    { id: '10', name: 'LPUA' },
    { id: '11', name: 'RT1' },
    { id: '12', name: 'RCC' },
    { id: '13', name: 'RTC' },
    { id: '14', name: 'SPI1' },
    { id: '15', name: 'SPI2' },
    { id: '16', name: 'SYS' },
    { id: '17', name: 'TIM2' },
    { id: '18', name: 'TIM6' },
    { id: '19', name: 'TIM21' },
    { id: '20', name: 'TIM22' },
    { id: '21', name: 'USART1' },
    { id: '22', name: 'USART2' },
    { id: '23', name: 'WWDG' },
    { id: '24', name: 'LPTIM' } // New item
  ];

  const handlePanelSelect = (panel) => {
    setSelectedPanel(panel);
  };

  const closePopup = () => {
    setPopupOpen(false);
  };

  // Function to format the peripheral name with dots between ID and content
  const formatPeripheralName = (id, name) => {
    const maxLength = 20; // Adjust the total length of each item
    const baseString = `${id}${name}`;
    const dotsCount = maxLength - baseString.length;
    const dots = '.'.repeat(dotsCount > 0 ? dotsCount : 0);
    return `${id}${dots}${name}`;
  };

  return (
    <Box
      bg={colorMode === "light" ? "white" : "gray.800"}
      w="100%"
      h="full"
      p={4}
      borderRightWidth={1}
      borderColor={colorMode === "light" ? "gray.300" : "gray.600"}
      boxShadow={colorMode === "light" ? "sm" : "none"}
      position="relative"
    >
      {/* Dropdown for File Explorer */}
      <Menu>
        <MenuButton as={Button} rightIcon={<ChevronDownIcon />} fontWeight="bold" mb={2}>
          File Explorer
        </MenuButton>
        <MenuList>
          <MenuItem onClick={() => handlePanelSelect('Device Status Panel')}>
            Device Status Panel
          </MenuItem>
          <MenuItem onClick={() => handlePanelSelect('Peripheral Configurations')}>
            Peripheral Configurations
          </MenuItem>
        </MenuList>
      </Menu>

      <Divider />

      {/* Path Display */}
      <VStack spacing={2} align="start" mt={4}>
        <Text fontWeight="bold">📁 C:\users\dc1mu\desktop\56142810</Text>
        <VStack spacing={1} align="start" pl={4}>
          <Text>📄 text1.txt</Text>
          <Text>📄 text2.txt</Text>
          <Text>📄 text3.txt</Text>
          <Text>📄 text4.txt</Text>
          <Text>📄 text5.txt</Text>
        </VStack>
        <Divider />
      </VStack>

      {/* Conditional Rendering for Device Status Panel */}
      {selectedPanel === 'Device Status Panel' && (
        <Box mt={4}>
          <Text fontWeight="bold">Device Status Panel</Text>
          <List spacing={2} mt={2}>
            <ListItem>
              <HStack>
                <Text fontWeight="bold">Device name:</Text>
                <Text>Actuator</Text>
              </HStack>
            </ListItem>
            <ListItem>
              <HStack>
                <Text fontWeight="bold">Power status:</Text>
                <Text>35 watts</Text>
              </HStack>
            </ListItem>
            <ListItem>
              <HStack>
                <Text fontWeight="bold">Program execution state:</Text>
                <Text>Running</Text>
              </HStack>
            </ListItem>
            <ListItem>
              <HStack>
                <Text fontWeight="bold">Temperature:</Text>
                <Text>35°C</Text>
              </HStack>
            </ListItem>
            <ListItem>
              <HStack>
                <Text fontWeight="bold">Device status:</Text>
                <Text>Connected</Text>
              </HStack>
            </ListItem>
          </List>
        </Box>
      )}

      {/* Conditional Rendering for Peripheral Configurations */}
      {selectedPanel === 'Peripheral Configurations' && (
        <>
          <Box mt={4}>
            <Text fontWeight="bold">Peripheral Configurations</Text>
            <List spacing={2} mt={2}>
              <ListItem>
                <HStack>
                  <Text fontWeight="bold">Peripheral in usage:</Text>
                  <Text>558</Text>
                </HStack>
              </ListItem>
              <ListItem>
                <HStack>
                  <Text fontWeight="bold">Temperature:</Text>
                  <Text>35°C</Text>
                </HStack>
              </ListItem>
              <ListItem>
                <HStack>
                  <Text fontWeight="bold">Device status:</Text>
                  <Text>Connected</Text>
                </HStack>
              </ListItem>
            </List>
          </Box>

          {/* Peripherals Popup */}
          {isPopupOpen && (
            <Box
              position="absolute"
              top={0}
              right={0}
              w="56"
              bg={colorMode === "light" ? "white" : "gray.700"}
              border="1px solid"
              borderColor={colorMode === "light" ? "gray.300" : "gray.600"}
              rounded="lg"
              shadow="lg"
              mt={16}
              mr={4}
              maxH="96"
              overflowY="auto"
              zIndex={10}
            >
              {/* Close button */}
              <Box display="flex" justifyContent="flex-end" p={2}>
                <CloseButton onClick={closePopup} />
              </Box>

              <Box p={2} spaceY={1}>
                {peripheralsList.map((peripheral) => (
                  <Box key={peripheral.id} p={2} borderBottom="1px solid" borderColor="gray.200">
                    <HStack>
                      <Text>{peripheral.name}</Text>
                      {/* ChevronDownIcon added beside each peripheral name */}
                      <ChevronDownIcon />
                    </HStack>
                  </Box>
                ))}
              </Box>
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default FileExplorer;


// import React, { useState } from "react";
// import {
//   Box,
//   Text,
//   VStack,
//   HStack,
//   Collapse,
//   useDisclosure,
// } from "@chakra-ui/react";
// import {
//   ChevronRightIcon,
//   ChevronDownIcon,
// } from "@chakra-ui/icons";
// import {
//   FaFolder,
//   FaFolderOpen,
//   FaFile,
//   FaCogs,
// } from "react-icons/fa";

// // Recursive Folder Component
// const Folder = ({ name, children }) => {
//   const { isOpen, onToggle } = useDisclosure({ defaultIsOpen: false });

//   return (
//     <Box w="full">
//       <HStack
//         spacing={2}
//         cursor="pointer"
//         _hover={{ bg: "#2a2d2e" }}
//         px={2}
//         py={1}
//         onClick={onToggle}
//       >
//         {isOpen ? <ChevronDownIcon /> : <ChevronRightIcon />}
//         {isOpen ? <FaFolderOpen size={14} /> : <FaFolder size={14} />}
//         <Text>{name}</Text>
//       </HStack>
//       <Collapse in={isOpen} animateOpacity>
//         <VStack align="start" spacing={0} pl={6}>
//           {children}
//         </VStack>
//       </Collapse>
//     </Box>
//   );
// };

// // File Component
// const File = ({ name }) => (
//   <HStack
//     spacing={2}
//     cursor="pointer"
//     _hover={{ bg: "#2a2d2e" }}
//     px={2}
//     py={1}
//     w="full"
//   >
//     <FaFile size={14} />
//     <Text>{name}</Text>
//   </HStack>
// );

// const FileExplorer = () => {
//   const { isOpen: isDevicesOpen, onToggle: toggleDevices } = useDisclosure({ defaultIsOpen: true });
//   const { isOpen: isPeripheralsOpen, onToggle: togglePeripherals } = useDisclosure({ defaultIsOpen: true });

//   return (
//     <Box
//       w="280px"
//       bg="#1e1e1e"
//       color="white"
//       borderRight="1px solid #333"
//       h="100vh"
//       fontSize="sm"
//       overflowY="auto"
//     >
//       {/* Device Status Section */}
//       <Box>
//         <HStack
//           px={3}
//           py={2}
//           _hover={{ bg: "#2a2d2e" }}
//           cursor="pointer"
//           onClick={toggleDevices}
//         >
//           {isDevicesOpen ? <ChevronDownIcon /> : <ChevronRightIcon />}
//           <Text fontWeight="bold">Device Status</Text>
//         </HStack>
//         <Collapse in={isDevicesOpen} animateOpacity>
//           <VStack align="start" spacing={0} pl={4} py={1}>
//             <Folder name="src">
//               <File name="main.c" />
//               <File name="utils.c" />
//               <Folder name="drivers">
//                 <File name="uart.c" />
//                 <File name="spi.c" />
//               </Folder>
//             </Folder>
//             <File name="config.h" />
//           </VStack>
//         </Collapse>
//       </Box>

//       {/* Peripheral Configurations Section */}
//       <Box>
//         <HStack
//           px={3}
//           py={2}
//           _hover={{ bg: "#2a2d2e" }}
//           cursor="pointer"
//           onClick={togglePeripherals}
//         >
//           {isPeripheralsOpen ? <ChevronDownIcon /> : <ChevronRightIcon />}
//           <Text fontWeight="bold">Peripheral Configurations</Text>
//         </HStack>
//         <Collapse in={isPeripheralsOpen} animateOpacity>
//           <VStack align="start" spacing={0} pl={4} py={1}>
//             <HStack spacing={2} cursor="pointer" _hover={{ bg: "#2a2d2e" }} px={2} py={1}>
//               <FaCogs size={14} />
//               <Text>UART</Text>
//             </HStack>
//             <HStack spacing={2} cursor="pointer" _hover={{ bg: "#2a2d2e" }} px={2} py={1}>
//               <FaCogs size={14} />
//               <Text>SPI</Text>
//             </HStack>
//             <HStack spacing={2} cursor="pointer" _hover={{ bg: "#2a2d2e" }} px={2} py={1}>
//               <FaCogs size={14} />
//               <Text>I2C</Text>
//             </HStack>
//           </VStack>
//         </Collapse>
//       </Box>
//     </Box>
//   );
// };

// export default FileExplorer;

