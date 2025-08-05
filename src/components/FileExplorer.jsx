
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
