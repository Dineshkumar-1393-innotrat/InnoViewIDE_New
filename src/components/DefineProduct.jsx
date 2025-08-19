import React, { useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Grid,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Text,
  useColorMode,
  useDisclosure,
} from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import Footer from "./Footer";
import { useNavigate } from 'react-router-dom';

const DefineProduct = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();
  const [selectedRequirements, setSelectedRequirements] = useState([]);
  const [currentScreen, setCurrentScreen] = useState("requirements"); // Manages screens

  const requirements = [
    "Sensors",
    "Actuators",
    "Microcontroller",
    "Communication Module",
    "Power Consumption",
    "GPS Tracker",
    "Amplifier",
    "Medication Pods",
    "Medication Lids",
    "Speaker",
    "Objects",
    "Display",
    "Light",
    "Switch",
  ];

  const handleNext = () => {
    setCurrentScreen("details"); // Navigate to details screen
    onClose(); // Close the modal
  };

  const handleCheckboxChange = (requirement) => {
    if (selectedRequirements.includes(requirement)) {
      setSelectedRequirements(
        selectedRequirements.filter((item) => item !== requirement)
      );
    } else {
      setSelectedRequirements([...selectedRequirements, requirement]);
    }
  };

  const navigate = useNavigate();

  const handleFileUpload = () => {
    // Navigate to the FileExplorer component
    navigate('/fileupload');
  };

  // Component for rendering configuration based on the selected requirement
  const renderConfiguration = (requirement) => {
    switch (requirement) {
      case "Sensors":
        return (
          <Box mb={6}>
            <Text fontWeight="bold">Sensors:</Text>
            <Box mt={4} p={4} borderWidth={1} borderRadius="md">
              <Text>ID:</Text>
              <Input placeholder="Enter ID" mb={4} />

              <Text>Type:</Text>
              <Select placeholder="Select Type" mb={4}>
                <option value="temperature">Temperature</option>
                <option value="pressure">Pressure</option>
                <option value="motion">Motion</option>
              </Select>

              <Text>Range:</Text>
              <Input placeholder="Enter Range (min, max, unit)" mb={4} />

              <Text>Resolution:</Text>
              <Input placeholder="Enter Resolution" mb={4} />

              <Text>Accuracy:</Text>
              <Input placeholder="Enter Accuracy" mb={4} />

              <Text>Update Rate:</Text>
              <Input placeholder="Enter Update Rate" mb={4} />

              <Button 
      colorScheme="blue" 
      size="sm" 
      onClick={handleFileUpload}
    >
      Upload Image/Video of the Device
    </Button>
            </Box>
          </Box>
        );

      case "Actuators":
        return (
          <Box mb={6}>
            <Text fontWeight="bold">Actuators:</Text>
            <Box mt={4} p={4} borderWidth={1} borderRadius="md">
              <Text>ID:</Text>
              <Input placeholder="Enter ID" mb={4} />

              <Text>Type:</Text>
              <Select placeholder="Select Type" mb={4}>
                <option value="linear">Linear</option>
                <option value="rotary">Rotary</option>
                <option value="hydraulic">Hydraulic</option>
              </Select>

              <Text>Force:</Text>
              <Input placeholder="Enter Force (N)" mb={4} />

              <Text>Speed:</Text>
              <Input placeholder="Enter Speed (m/s)" mb={4} />

              <Text>Voltage:</Text>
              <Input placeholder="Enter Voltage (V)" mb={4} />

              <Button 
      colorScheme="blue" 
      size="sm" 
      onClick={handleFileUpload}
    >
      Upload Image/Video of the Device
    </Button>
            </Box>
          </Box>
        );

        case "Microcontroller":
    return (
      <Box mb={6}>
        <Text fontWeight="bold">Microcontroller:</Text>
        <Box mt={4} p={4} borderWidth={1} borderRadius="md">
          <Text>Name:</Text>
          <Input placeholder="Enter Name" mb={4} />

          <Text>Clock Speed:</Text>
          <Input placeholder="Enter Clock Speed (MHz)" mb={4} />

          <Text>Number of Pins:</Text>
          <Input placeholder="Enter Number of Pins" mb={4} />

          <Text>Supported Protocols:</Text>
          <Select placeholder="Select Protocols" mb={4}>
            <option value="uart">UART</option>
            <option value="spi">SPI</option>
            <option value="i2c">I2C</option>
          </Select>

          <Button 
      colorScheme="blue" 
      size="sm" 
      onClick={handleFileUpload}
    >
      Upload Image/Video of the Device
    </Button>
        </Box>
      </Box>
    );



    case "Communication Module":
        return (
          <Box mb={6}>
            <Text fontWeight="bold">Communication Module:</Text>
            <Box mt={4} p={4} borderWidth={1} borderRadius="md">
              <Text>Name:</Text>
              <Input placeholder="Enter Name" mb={4} />

              <Text>Clock Speed:</Text>
              <Input placeholder="Enter Clock Speed (MHz)" mb={4} />

              <Text>Number of Pins:</Text>
              <Input placeholder="Enter Number of Pins" mb={4} />

              <Text>Supported Protocols:</Text>
              <Select placeholder="Select Protocols" mb={4}>
                <option value="uart">UART</option>
                <option value="spi">SPI</option>
                <option value="i2c">I2C</option>
              </Select>

              <Button 
      colorScheme="blue" 
      size="sm" 
      onClick={handleFileUpload}
    >
      Upload Image/Video of the Device
    </Button>
            </Box>
          </Box>
        );


        case "Power Consumption":
            return (
              <Box mb={6}>
                <Text fontWeight="bold">Power Consumption:</Text>
                <Box mt={4} p={4} borderWidth={1} borderRadius="md">
                  <Text>Name:</Text>
                  <Input placeholder="Enter Name" mb={4} />
    
                  <Text>Clock Speed:</Text>
                  <Input placeholder="Enter Clock Speed (MHz)" mb={4} />
    
                  <Text>Number of Pins:</Text>
                  <Input placeholder="Enter Number of Pins" mb={4} />
    
                  <Text>Supported Protocols:</Text>
                  <Select placeholder="Select Protocols" mb={4}>
                    <option value="uart">UART</option>
                    <option value="spi">SPI</option>
                    <option value="i2c">I2C</option>
                  </Select>
    
                  <Button 
      colorScheme="blue" 
      size="sm" 
      onClick={handleFileUpload}
    >
      Upload Image/Video of the Device
    </Button>
                </Box>
              </Box>
            );





            case "GPS Tracker":
                return (
                  <Box mb={6}>
                    <Text fontWeight="bold">GPS Tracker:</Text>
                    <Box mt={4} p={4} borderWidth={1} borderRadius="md">
                      <Text>Name:</Text>
                      <Input placeholder="Enter Name" mb={4} />
        
                      <Text>Clock Speed:</Text>
                      <Input placeholder="Enter Clock Speed (MHz)" mb={4} />
        
                      <Text>Number of Pins:</Text>
                      <Input placeholder="Enter Number of Pins" mb={4} />
        
                      <Text>Supported Protocols:</Text>
                      <Select placeholder="Select Protocols" mb={4}>
                        <option value="uart">UART</option>
                        <option value="spi">SPI</option>
                        <option value="i2c">I2C</option>
                      </Select>
        
                      <Button 
      colorScheme="blue" 
      size="sm" 
      onClick={handleFileUpload}
    >
      Upload Image/Video of the Device
    </Button>
                    </Box>
                  </Box>
                );






                case "Amplifier":
                    return (
                      <Box mb={6}>
                        <Text fontWeight="bold">Amplifier:</Text>
                        <Box mt={4} p={4} borderWidth={1} borderRadius="md">
                          <Text>Name:</Text>
                          <Input placeholder="Enter Name" mb={4} />
            
                          <Text>Clock Speed:</Text>
                          <Input placeholder="Enter Clock Speed (MHz)" mb={4} />
            
                          <Text>Number of Pins:</Text>
                          <Input placeholder="Enter Number of Pins" mb={4} />
            
                          <Text>Supported Protocols:</Text>
                          <Select placeholder="Select Protocols" mb={4}>
                            <option value="uart">UART</option>
                            <option value="spi">SPI</option>
                            <option value="i2c">I2C</option>
                          </Select>
            
                          <Button 
      colorScheme="blue" 
      size="sm" 
      onClick={handleFileUpload}
    >
      Upload Image/Video of the Device
    </Button>
                        </Box>
                      </Box>
                    );


                    case "Medication Pods":
                        return (
                          <Box mb={6}>
                            <Text fontWeight="bold">Medication Pods:</Text>
                            <Box mt={4} p={4} borderWidth={1} borderRadius="md">
                              <Text>Name:</Text>
                              <Input placeholder="Enter Name" mb={4} />
                
                              <Text>Clock Speed:</Text>
                              <Input placeholder="Enter Clock Speed (MHz)" mb={4} />
                
                              <Text>Number of Pins:</Text>
                              <Input placeholder="Enter Number of Pins" mb={4} />
                
                              <Text>Supported Protocols:</Text>
                              <Select placeholder="Select Protocols" mb={4}>
                                <option value="uart">UART</option>
                                <option value="spi">SPI</option>
                                <option value="i2c">I2C</option>
                              </Select>
                
                              <Button 
      colorScheme="blue" 
      size="sm" 
      onClick={handleFileUpload}
    >
      Upload Image/Video of the Device
    </Button>
                            </Box>
                          </Box>
                        );


                        case "Objects":
                            return (
                              <Box mb={6}>
                                <Text fontWeight="bold">Objects:</Text>
                                <Box mt={4} p={4} borderWidth={1} borderRadius="md">
                                  <Text>Name:</Text>
                                  <Input placeholder="Enter Name" mb={4} />
                    
                                  <Text>Clock Speed:</Text>
                                  <Input placeholder="Enter Clock Speed (MHz)" mb={4} />
                    
                                  <Text>Number of Pins:</Text>
                                  <Input placeholder="Enter Number of Pins" mb={4} />
                    
                                  <Text>Supported Protocols:</Text>
                                  <Select placeholder="Select Protocols" mb={4}>
                                    <option value="uart">UART</option>
                                    <option value="spi">SPI</option>
                                    <option value="i2c">I2C</option>
                                  </Select>
                    
                                  <Button 
      colorScheme="blue" 
      size="sm" 
      onClick={handleFileUpload}
    >
      Upload Image/Video of the Device
    </Button>
                                </Box>
                              </Box>
                            );


                            case "Medication Lids":
                                return (
                                  <Box mb={6}>
                                    <Text fontWeight="bold">Medication Lids:</Text>
                                    <Box mt={4} p={4} borderWidth={1} borderRadius="md">
                                      <Text>Name:</Text>
                                      <Input placeholder="Enter Name" mb={4} />
                        
                                      <Text>Clock Speed:</Text>
                                      <Input placeholder="Enter Clock Speed (MHz)" mb={4} />
                        
                                      <Text>Number of Pins:</Text>
                                      <Input placeholder="Enter Number of Pins" mb={4} />
                        
                                      <Text>Supported Protocols:</Text>
                                      <Select placeholder="Select Protocols" mb={4}>
                                        <option value="uart">UART</option>
                                        <option value="spi">SPI</option>
                                        <option value="i2c">I2C</option>
                                      </Select>
                        
                                      <Button 
      colorScheme="blue" 
      size="sm" 
      onClick={handleFileUpload}
    >
      Upload Image/Video of the Device
    </Button>
                                    </Box>
                                  </Box>
                                );


                                case "Speaker":
                                    return (
                                      <Box mb={6}>
                                        <Text fontWeight="bold">Speaker:</Text>
                                        <Box mt={4} p={4} borderWidth={1} borderRadius="md">
                                          <Text>Name:</Text>
                                          <Input placeholder="Enter Name" mb={4} />
                            
                                          <Text>Clock Speed:</Text>
                                          <Input placeholder="Enter Clock Speed (MHz)" mb={4} />
                            
                                          <Text>Number of Pins:</Text>
                                          <Input placeholder="Enter Number of Pins" mb={4} />
                            
                                          <Text>Supported Protocols:</Text>
                                          <Select placeholder="Select Protocols" mb={4}>
                                            <option value="uart">UART</option>
                                            <option value="spi">SPI</option>
                                            <option value="i2c">I2C</option>
                                          </Select>
                                          <Button 
      colorScheme="blue" 
      size="sm" 
      onClick={handleFileUpload}
    >
      Upload Image/Video of the Device
    </Button>
                                        </Box>
                                      </Box>
                                    );



                                    case "Display":
                                        return (
                                          <Box mb={6}>
                                            <Text fontWeight="bold">Display:</Text>
                                            <Box mt={4} p={4} borderWidth={1} borderRadius="md">
                                              <Text>Name:</Text>
                                              <Input placeholder="Enter Name" mb={4} />
                                
                                              <Text>Clock Speed:</Text>
                                              <Input placeholder="Enter Clock Speed (MHz)" mb={4} />
                                
                                              <Text>Number of Pins:</Text>
                                              <Input placeholder="Enter Number of Pins" mb={4} />
                                
                                              <Text>Supported Protocols:</Text>
                                              <Select placeholder="Select Protocols" mb={4}>
                                                <option value="uart">UART</option>
                                                <option value="spi">SPI</option>
                                                <option value="i2c">I2C</option>
                                              </Select>
                                
                                              <Button 
      colorScheme="blue" 
      size="sm" 
      onClick={handleFileUpload}
    >
      Upload Image/Video of the Device
    </Button>
                                            </Box>
                                          </Box>
                                        );


                                        case "Light":
                                            return (
                                              <Box mb={6}>
                                                <Text fontWeight="bold">Light:</Text>
                                                <Box mt={4} p={4} borderWidth={1} borderRadius="md">
                                                  <Text>Name:</Text>
                                                  <Input placeholder="Enter Name" mb={4} />
                                    
                                                  <Text>Clock Speed:</Text>
                                                  <Input placeholder="Enter Clock Speed (MHz)" mb={4} />
                                    
                                                  <Text>Number of Pins:</Text>
                                                  <Input placeholder="Enter Number of Pins" mb={4} />
                                    
                                                  <Text>Supported Protocols:</Text>
                                                  <Select placeholder="Select Protocols" mb={4}>
                                                    <option value="uart">UART</option>
                                                    <option value="spi">SPI</option>
                                                    <option value="i2c">I2C</option>
                                                  </Select>
                                    
                                                  <Button 
      colorScheme="blue" 
      size="sm" 
      onClick={handleFileUpload}
    >
      Upload Image/Video of the Device
    </Button>
                                                </Box>
                                              </Box>
                                            );



                                            
                                        case "Switch":
                                            return (
                                              <Box mb={6}>
                                                <Text fontWeight="bold">Switch:</Text>
                                                <Box mt={4} p={4} borderWidth={1} borderRadius="md">
                                                  <Text>Name:</Text>
                                                  <Input placeholder="Enter Name" mb={4} />
                                    
                                                  <Text>Clock Speed:</Text>
                                                  <Input placeholder="Enter Clock Speed (MHz)" mb={4} />
                                    
                                                  <Text>Number of Pins:</Text>
                                                  <Input placeholder="Enter Number of Pins" mb={4} />
                                    
                                                  <Text>Supported Protocols:</Text>
                                                  <Select placeholder="Select Protocols" mb={4}>
                                                    <option value="uart">UART</option>
                                                    <option value="spi">SPI</option>
                                                    <option value="i2c">I2C</option>
                                                  </Select>
                                    
                                                  <Button 
      colorScheme="blue" 
      size="sm" 
      onClick={handleFileUpload}
    >
      Upload Image/Video of the Device
    </Button>
                                                </Box>
                                              </Box>
                                            );

      // Add more cases for other requirements
      default:
        return null;
    }
  };

  return (
    <Box display="flex" flexDirection="column" minH="100vh">
      <Box flex="1" p={4}>
        {/* Theme Toggle Button */}
        <IconButton
          aria-label="Toggle Theme"
          icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
          onClick={toggleColorMode}
          position="absolute"
          top="1rem"
          right="1rem"
        />

        {/* Conditional Rendering */}
        {currentScreen === "requirements" ? (
          <>
            {/* Define Product Requirements Button */}
            <Box textAlign="center" mt={12}>
              <Button onClick={onOpen} colorScheme="blue">
                Define Product Requirements
              </Button>
            </Box>

            {/* Modal */}
            <Modal isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Choose Your Product Requirements</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                    {requirements.map((requirement, index) => (
                      <Checkbox
                        key={index}
                        isChecked={selectedRequirements.includes(requirement)}
                        onChange={() => handleCheckboxChange(requirement)}
                      >
                        {requirement}
                      </Checkbox>
                    ))}
                  </Grid>
                </ModalBody>
                <ModalFooter>
                  <Button variant="ghost" mr={3} onClick={onClose}>
                    Cancel
                  </Button>
                  <Button
                    colorScheme="blue"
                    onClick={handleNext}
                    isDisabled={selectedRequirements.length === 0}
                  >
                    Next
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </>
        ) : (
          // Details Screen
          <Box>
            <Text fontSize="2xl" mb={4}>
              Configure Details for: {selectedRequirements.join(", ")}
            </Text>
            {selectedRequirements.map((requirement) =>
              renderConfiguration(requirement)
            )}
            <Button
              colorScheme="gray"
              onClick={() => setCurrentScreen("requirements")}
              mr={3}
            >
              Back
            </Button>
            <Button colorScheme="blue">Submit</Button>
          </Box>
        )}
      </Box>

      <Footer />
    </Box>
  );
};

export default DefineProduct;




