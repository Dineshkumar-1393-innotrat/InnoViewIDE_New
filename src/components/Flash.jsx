// import React, { useState, useEffect, useCallback, useRef } from "react";
import { API } from '@/config';
// import {
//   VStack,
//   HStack,
//   Text,
//   IconButton,
//   Accordion,
//   AccordionItem,
//   AccordionButton,
//   AccordionPanel,
//   AccordionIcon,
//   Box,
//   useColorModeValue,
//   Tooltip,
//   Button,
//   Modal,
//   ModalOverlay,
//   ModalContent,
//   ModalHeader,
//   ModalCloseButton,
//   ModalBody,
//   ModalFooter,
//   Input,
//   FormControl,
//   FormLabel,
//   Select,
//   Slider,
//   SliderTrack,
//   SliderFilledTrack,
//   SliderThumb,
//   Badge,
//   Progress,
//   Divider,
// } from "@chakra-ui/react";
// import { FaTimes, FaStepForward, FaRedo, FaLightbulb, FaStop, FaPlay } from "react-icons/fa";
// import { buildProject, flashFirmware, buildAndFlash, eraseFlash, ESP_IDF_CONFIG } from "../utils/espIdfUtils";

// const Flash = ({ onFlashComplete, onFlashStart }) => {
//   // Dynamic colors based on light or dark mode
//   const bgColor = useColorModeValue("gray.100", "gray.700");
//   const panelBgColor = useColorModeValue("gray.200", "gray.600");
//   const textColor = useColorModeValue("gray.600", "gray.200");
//   const buttonBgColor = useColorModeValue("blue.500", "blue.300");
//   const buttonTextColor = useColorModeValue("white", "black");

//   // State for modal visibility
//   const [isEraseModalOpen, setEraseModalOpen] = useState(false);
//   const [isConfirmOpen, setConfirmOpen] = useState(false);
//   const [isPortSelectionOpen, setPortSelectionOpen] = useState(false);
//   const [detectedDevices, setDetectedDevices] = useState([]);

//   // LED Blink states
//   const [isBlinking, setIsBlinking] = useState(false);
//   const [ledPin, setLedPin] = useState(2);
//   const [blinkDelay, setBlinkDelay] = useState(1000);
//   const [ledState, setLedState] = useState(false);
//   const [blinkCount, setBlinkCount] = useState(0);
//   const [isDetecting, setIsDetecting] = useState(false);
//   const [deviceInfo, setDeviceInfo] = useState({
//     target: "--",
//     port: "--",
//     memory: "--",
//     status: "disconnected",
//   });
//   const [availablePorts, setAvailablePorts] = useState([]);
//   const [selectedPort, setSelectedPort] = useState(null);
//   const [flashProgress, setFlashProgress] = useState(0);
//   const [flashStatus, setFlashStatus] = useState("idle");
//   const [flashElapsed, setFlashElapsed] = useState(0);
//   const [flashEstimate, setFlashEstimate] = useState(3);
//   const [flashLogs, setFlashLogs] = useState([]);
//   const [baudRate, setBaudRate] = useState(ESP_IDF_CONFIG.BAUD_RATES.DEFAULT);
//   const [flashMode, setFlashMode] = useState(ESP_IDF_CONFIG.DEFAULT_FLASH_MODE);
//   const flashProgressRef = useRef(null);
//   const flashElapsedRef = useRef(null);
//   const detectTimeoutRef = useRef(null);

//   // Listen for device connection events from other components
//   useEffect(() => {
//     // Helper function to format port info for display
//     const formatPortInfo = (portData) => {
//       if (!portData) return "USB";
//       if (typeof portData === 'string') return portData;
//       if (typeof portData === 'object') {
//         // If it's a port object with USB IDs
//         if (portData.usbVendorId && portData.usbProductId) {
//           return `USB (VID: ${portData.usbVendorId.toString(16).toUpperCase()})`;
//         }
//         return "USB";
//       }
//       return "USB";
//     };

//     const handleDeviceConnect = (event) => {
//       console.log('🔌 Flash: Device connect event received', event.detail);
//       if (event.detail) {
//         setDeviceInfo({
//           target: event.detail.deviceType || "ESP32",
//           port: formatPortInfo(event.detail.port),
//           memory: event.detail.memory || "4MB",
//           status: "connected",
//         });
//         console.log('✅ Flash: Device info updated to connected');
//       }
//     };

//     const handleDeviceDisconnect = () => {
//       console.log('🔌 Flash: Device disconnect event received');
//       setDeviceInfo({
//         target: "--",
//         port: "--",
//         memory: "--",
//         status: "disconnected",
//       });
//     };

//     // Check localStorage on mount for persisted connection
//     const savedState = localStorage.getItem('innoide:device-connected');
//     const savedDeviceInfo = localStorage.getItem('innoide:device-info');

//     if (savedState === 'true' && savedDeviceInfo) {
//       try {
//         const deviceData = JSON.parse(savedDeviceInfo);
//         console.log('🔌 Flash: Restoring device connection from localStorage', deviceData);
//         setDeviceInfo({
//           target: deviceData.deviceType || "ESP32",
//           port: formatPortInfo(deviceData.port),
//           memory: deviceData.memory || "4MB",
//           status: "connected",
//         });
//       } catch (e) {
//         console.warn('Failed to parse saved device info in Flash component');
//       }
//     }

//     window.addEventListener('innoide:device-detect-complete', handleDeviceConnect);
//     window.addEventListener('innoide:device-disconnect', handleDeviceDisconnect);

//     return () => {
//       window.removeEventListener('innoide:device-detect-complete', handleDeviceConnect);
//       window.removeEventListener('innoide:device-disconnect', handleDeviceDisconnect);
//     };
//   }, []);

//   const handleErase = () => {
//     setConfirmOpen(true); // Open confirmation modal
//   };

//   const handleFinalErase = () => {
//     alert("Existing data erased successfully!");
//     setConfirmOpen(false); // Close confirmation modal
//     setEraseModalOpen(false); // Close the main modal as well after erase
//   };

//   const handleCloseEraseModal = () => {
//     setEraseModalOpen(false);
//   };

//   const handleCloseConfirmModal = () => {
//     setConfirmOpen(false);
//   };

//   const clearFlashTimers = useCallback(() => {
//     if (flashProgressRef.current) {
//       clearInterval(flashProgressRef.current);
//       flashProgressRef.current = null;
//     }
//     if (flashElapsedRef.current) {
//       clearInterval(flashElapsedRef.current);
//       flashElapsedRef.current = null;
//     }
//   }, []);

//   const completeFlash = useCallback(() => {
//     clearFlashTimers();
//     setFlashProgress(100);
//     setFlashStatus("completed");
//     onFlashComplete?.();
//     window.dispatchEvent(new CustomEvent('innoide:flash-complete'));
//   }, [clearFlashTimers, onFlashComplete]);

//   const stopFlash = useCallback(() => {
//     clearFlashTimers();
//     setFlashStatus("stopped");
//     window.dispatchEvent(new CustomEvent('innoide:flash-stop'));
//   }, [clearFlashTimers]);

//   const addFlashLog = useCallback((message) => {
//     const timestamp = new Date().toLocaleTimeString();
//     setFlashLogs(prev => [...prev.slice(-50), `[${timestamp}] ${message}`]);
//   }, []);

//   const startFlash = useCallback(async () => {
//     if (deviceInfo.status !== "connected" || flashStatus === "running") {
//       return;
//     }
//     onFlashStart?.();
//     clearFlashTimers();
//     setFlashEstimate(3);
//     setFlashElapsed(0);
//     setFlashProgress(0);
//     setFlashLogs([]);
//     setFlashStatus("running");
//     window.dispatchEvent(new CustomEvent('innoide:flash-start'));

//     const startTime = Date.now();
//     flashElapsedRef.current = setInterval(() => {
//       setFlashElapsed(((Date.now() - startTime) / 1000));
//     }, 100);

//     try {
//       // Call submit-code API before flashing
//       addFlashLog("Submitting code to server...");
//       try {
//         const response = await fetch(`${API.ADMIN}/submit-code`, {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({
//             deviceInfo: {
//               target: deviceInfo.target,
//               port: deviceInfo.port,
//               memory: deviceInfo.memory,
//               status: deviceInfo.status,
//             },
//             flashConfig: {
//               baudRate: baudRate,
//               flashMode: flashMode,
//             },
//             timestamp: new Date().toISOString(),
//           }),
//         });

//         if (response.ok) {
//           const result = await response.json();
//           addFlashLog(`Code submitted successfully: ${JSON.stringify(result)}`);
//         } else {
//           addFlashLog(`Warning: Code submission failed with status ${response.status}`);
//         }
//       } catch (apiError) {
//         addFlashLog(`Warning: Failed to submit code - ${apiError.message}`);
//         // Continue with flashing even if API call fails
//       }

//       // Use ESP-IDF build and flash workflow
//       await buildAndFlash({
//         port: deviceInfo.port,
//         baudRate: baudRate,
//         flashMode: flashMode,
//         onProgress: (progress) => {
//           setFlashProgress(progress);
//         },
//         onLog: (message) => {
//           addFlashLog(message);
//         },
//       });

//       completeFlash();
//     } catch (error) {
//       addFlashLog(`Error: ${error.message}`);
//       stopFlash();
//     }
//   }, [deviceInfo.status, deviceInfo.port, deviceInfo.target, deviceInfo.memory, flashStatus, baudRate, flashMode, clearFlashTimers, completeFlash, stopFlash, addFlashLog, onFlashStart]);

//   const resetFlash = useCallback(() => {
//     stopFlash();
//     setFlashProgress(0);
//     setFlashStatus("idle");
//     setFlashElapsed(0);
//   }, [stopFlash]);

//   // Get device info from port
//   const getDeviceInfo = useCallback((portInfo) => {
//     let deviceType = "Unknown Device";
//     let estimatedMemory = "--";

//     switch (portInfo.usbVendorId) {
//       case 0x2341: // Arduino
//         deviceType = "Arduino";
//         estimatedMemory = "32KB";
//         break;
//       case 0x10C4: // Silicon Labs (ESP32)
//         deviceType = "ESP32";
//         estimatedMemory = "4MB";
//         break;
//       case 0x1A86: // QinHeng Electronics (CH340)
//         deviceType = "ESP32/Arduino Compatible";
//         estimatedMemory = "4MB";
//         break;
//       case 0x0403: // FTDI
//         deviceType = "FTDI Device";
//         estimatedMemory = "--";
//         break;
//       case 0x303A: // Espressif
//         deviceType = "ESP32-S/C Series";
//         estimatedMemory = "4MB";
//         break;
//       default:
//         deviceType = "Serial Device";
//     }

//     return { deviceType, estimatedMemory };
//   }, []);

//   // Scan for all available devices
//   const scanForDevices = useCallback(async () => {
//     setIsDetecting(true);
//     setDetectedDevices([]);

//     try {
//       if ('serial' in navigator) {
//         // Get already authorized ports
//         const existingPorts = await navigator.serial.getPorts();
//         const devices = [];

//         for (const port of existingPorts) {
//           const portInfo = port.getInfo();
//           const { deviceType, estimatedMemory } = getDeviceInfo(portInfo);

//           devices.push({
//             port,
//             portInfo,
//             deviceType,
//             memory: estimatedMemory,
//             portName: `USB (VID: ${portInfo.usbVendorId?.toString(16).toUpperCase()}, PID: ${portInfo.usbProductId?.toString(16).toUpperCase()})`,
//           });
//         }

//         setDetectedDevices(devices);

//         // If devices found, open selection modal
//         if (devices.length > 0) {
//           setPortSelectionOpen(true);
//         } else {
//           // No existing ports, request new one
//           await requestNewPort();
//         }
//       } else {
//         // Fallback for browsers without Web Serial API
//         setDetectedDevices([{
//           port: null,
//           deviceType: "Simulated Device",
//           memory: "Unknown",
//           portName: "Virtual Port",
//           isSimulated: true,
//         }]);
//         setPortSelectionOpen(true);
//       }
//     } catch (error) {
//       console.warn('Device scan failed:', error);
//     } finally {
//       setIsDetecting(false);
//     }
//   }, [getDeviceInfo]);

//   // Request a new port from user
//   const requestNewPort = useCallback(async () => {
//     try {
//       if ('serial' in navigator) {
//         const port = await navigator.serial.requestPort({
//           filters: [
//             { usbVendorId: 0x2341 }, // Arduino
//             { usbVendorId: 0x10C4 }, // Silicon Labs (ESP32)
//             { usbVendorId: 0x1A86 }, // QinHeng Electronics (CH340)
//             { usbVendorId: 0x0403 }, // FTDI
//             { usbVendorId: 0x303A }, // Espressif
//           ]
//         });

//         if (port) {
//           const portInfo = port.getInfo();
//           const { deviceType, estimatedMemory } = getDeviceInfo(portInfo);

//           const newDevice = {
//             port,
//             portInfo,
//             deviceType,
//             memory: estimatedMemory,
//             portName: `USB (VID: ${portInfo.usbVendorId?.toString(16).toUpperCase()}, PID: ${portInfo.usbProductId?.toString(16).toUpperCase()})`,
//           };

//           setDetectedDevices(prev => [...prev, newDevice]);
//           setPortSelectionOpen(true);
//         }
//       }
//     } catch (error) {
//       console.warn('Port request cancelled or failed:', error);
//     }
//   }, [getDeviceInfo]);

//   // Select a device from the list
//   const selectDevice = useCallback((device) => {
//     setSelectedPort(device.port);
//     setDeviceInfo({
//       target: device.deviceType,
//       port: device.portName,
//       memory: device.memory,
//       status: "connected",
//     });

//     setPortSelectionOpen(false);

//     // Dispatch event with device details
//     const eventDetail = {
//       port: device.portInfo || device.portName,
//       deviceType: device.deviceType,
//       memory: device.memory,
//       isSimulated: device.isSimulated || false
//     };

//     console.log('Device selected, dispatching event:', eventDetail);

//     window.dispatchEvent(new CustomEvent('innoide:device-detect-complete', {
//       detail: eventDetail
//     }));
//   }, []);

//   // Legacy detectDevice function - now opens port selection
//   const detectDevice = useCallback(async () => {
//     if (detectTimeoutRef.current) {
//       clearTimeout(detectTimeoutRef.current);
//     }

//     setDeviceInfo((previous) => ({
//       ...previous,
//       status: "detecting",
//     }));
//     window.dispatchEvent(new CustomEvent('innoide:device-detect-start'));

//     await scanForDevices();
//   }, [scanForDevices]);

//   const disconnectDevice = useCallback(async () => {
//     if (selectedPort) {
//       try {
//         if (selectedPort.readable || selectedPort.writable) {
//           await selectedPort.close();
//         }
//         setSelectedPort(null);
//         setDeviceInfo({
//           target: "--",
//           port: "--",
//           memory: "--",
//           status: "disconnected",
//         });
//         window.dispatchEvent(new CustomEvent('innoide:device-disconnect'));
//       } catch (error) {
//         console.warn('Failed to disconnect device:', error);
//       }
//     }
//   }, [selectedPort]);

//   const listAvailablePorts = useCallback(async () => {
//     if ('serial' in navigator) {
//       try {
//         const ports = await navigator.serial.getPorts();
//         setAvailablePorts(ports);
//         return ports;
//       } catch (error) {
//         console.warn('Failed to list ports:', error);
//         return [];
//       }
//     }
//     return [];
//   }, []);

//   useEffect(() => {
//     // Only list available ports on initialization, don't auto-detect to avoid permission prompt
//     listAvailablePorts();
//     return () => {
//       clearFlashTimers();
//       if (detectTimeoutRef.current) {
//         clearTimeout(detectTimeoutRef.current);
//       }
//     };
//   }, [listAvailablePorts, clearFlashTimers]);

//   // LED Blink functionality
//   useEffect(() => {
//     let blinkInterval;
//     if (isBlinking) {
//       blinkInterval = setInterval(() => {
//         setLedState((prev) => !prev);
//         setBlinkCount((prev) => prev + 1);

//         // Dispatch custom event for external libraries
//         window.dispatchEvent(
//           new CustomEvent('innoide:led-blink', {
//             detail: {
//               pin: ledPin,
//               state: !ledState,
//               delay: blinkDelay,
//               count: blinkCount,
//             },
//           })
//         );
//       }, blinkDelay);
//     }
//     return () => {
//       if (blinkInterval) clearInterval(blinkInterval);
//     };
//   }, [isBlinking, blinkDelay, ledPin, ledState, blinkCount]);

//   const handleStartBlink = useCallback(() => {
//     setIsBlinking(true);
//     setBlinkCount(0);
//     window.dispatchEvent(
//       new CustomEvent('innoide:led-blink-start', {
//         detail: { pin: ledPin, delay: blinkDelay },
//       })
//     );
//   }, [ledPin, blinkDelay]);

//   const handleStopBlink = useCallback(() => {
//     setIsBlinking(false);
//     setLedState(false);
//     window.dispatchEvent(
//       new CustomEvent('innoide:led-blink-stop', {
//         detail: { pin: ledPin, totalBlinks: blinkCount },
//       })
//     );
//   }, [ledPin, blinkCount]);

//   const flashingLabel = (() => {
//     if (flashStatus === "running") {
//       return `Flashing... ${flashProgress}% complete`;
//     }
//     if (flashStatus === "completed") {
//       return "Flash completed";
//     }
//     if (flashStatus === "stopped") {
//       return "Flash aborted";
//     }
//     return "Ready to flash";
//   })();

//   const deviceStatusColor = deviceInfo.status === "connected" ? "green.400" : deviceInfo.status === "detecting" ? "yellow.400" : "red.400";

//   return (
//     <VStack
//       align="start"
//       spacing={5}
//       p={5}
//       w="300px"
//       h="auto"
//       bg={bgColor}
//       borderRadius="md"
//       boxShadow="md"
//     >
//       <Box w="100%" bg={panelBgColor} borderRadius="md" p={4} border="1px solid" borderColor="rgba(148,163,184,0.35)">
//         <Text fontSize="md" fontWeight="bold" color={textColor} mb={2}>
//           Flash Control Panel
//         </Text>
//         <Progress value={flashStatus === "idle" ? 0 : flashProgress} size="sm" colorScheme="green" borderRadius="md" isIndeterminate={flashStatus === "running" && flashProgress === 0} mb={2}>
//           Flash Progress
//         </Progress>
//         <Text fontSize="sm" color={textColor} mb={3}>
//           {flashingLabel}
//         </Text>
//         <HStack spacing={3}>
//           <Tooltip label="Abort Flash" fontSize="sm">
//             <IconButton
//               icon={<FaStop />}
//               aria-label="Stop Flash"
//               size="sm"
//               colorScheme="red"
//               onClick={stopFlash}
//               isDisabled={flashStatus !== "running"}
//             />
//           </Tooltip>
//           <Tooltip label={deviceInfo.status === "connected" ? "Start Flash" : "Device not connected"} fontSize="sm">
//             <IconButton
//               icon={<FaPlay />}
//               aria-label="Start Flash"
//               size="sm"
//               colorScheme="green"
//               onClick={startFlash}
//               isDisabled={deviceInfo.status !== "connected" || flashStatus === "running"}
//             />
//           </Tooltip>
//           <Tooltip label="Retry Flash" fontSize="sm">
//             <IconButton
//               icon={<FaRedo />}
//               aria-label="Retry Flash"
//               size="sm"
//               colorScheme="yellow"
//               onClick={resetFlash}
//             />
//           </Tooltip>
//         </HStack>
//       </Box>

//       <Box w="100%" bg={panelBgColor} borderRadius="md" p={4} border="1px solid" borderColor="rgba(148,163,184,0.35)">
//         <HStack justify="space-between" mb={2}>
//           <Text fontSize="md" fontWeight="bold" color={textColor}>
//             Device Connection
//           </Text>
//           <HStack spacing={1}>
//             {deviceInfo.status === "connected" && (
//               <Button size="xs" variant="outline" colorScheme="red" onClick={disconnectDevice}>
//                 Disconnect
//               </Button>
//             )}
//             <Button size="xs" variant="outline" colorScheme="blue" onClick={() => setPortSelectionOpen(true)} isLoading={isDetecting}>
//               Select Port
//             </Button>
//             <Button size="xs" variant="outline" onClick={detectDevice} isLoading={isDetecting}>
//               {deviceInfo.status === "connected" ? "Refresh" : "Detect"}
//             </Button>
//           </HStack>
//         </HStack>
//         <VStack align="stretch" spacing={2}>
//           <HStack justify="space-between">
//             <Text fontSize="sm" color={textColor}>Flash Target</Text>
//             <Text fontSize="sm" color={textColor}>{deviceInfo.target}</Text>
//           </HStack>
//           <HStack justify="space-between">
//             <Text fontSize="sm" color={textColor}>Port</Text>
//             <Text fontSize="sm" color={textColor}>{deviceInfo.port}</Text>
//           </HStack>
//           <HStack justify="space-between">
//             <Text fontSize="sm" color={textColor}>Memory Capacity</Text>
//             <Text fontSize="sm" color={textColor}>{deviceInfo.memory}</Text>
//           </HStack>
//           <HStack justify="space-between">
//             <Text fontSize="sm" color={textColor}>Device Status</Text>
//             <Text fontSize="sm" color={deviceStatusColor}>
//               {deviceInfo.status === "detecting" ? "Detecting..." : deviceInfo.status === "connected" ? "Connected" : "Disconnected"}
//             </Text>
//           </HStack>
//         </VStack>
//         {'serial' in navigator ? (
//           <Text fontSize="xs" color="green.500" mt={2}>
//             ✓ Web Serial API supported - Real device detection enabled
//           </Text>
//         ) : (
//           <Text fontSize="xs" color="orange.500" mt={2}>
//             ⚠ Web Serial API not supported - Using simulation mode
//           </Text>
//         )}
//       </Box>
//       *
//       <Box w="100%" bg={panelBgColor} borderRadius="md" p={4} border="1px solid" borderColor="rgba(148,163,184,0.35)">
//         <Text fontSize="md" fontWeight="bold" color={textColor} mb={2}>
//           Flashing Time
//         </Text>
//         <VStack align="stretch" spacing={2}>
//           <HStack justify="space-between">
//             <Text fontSize="sm" color={textColor}>Elapsed Time</Text>
//             <Text fontSize="sm" color={textColor}>{flashElapsed.toFixed(1)}s</Text>
//           </HStack>
//           <HStack justify="space-between">
//             <Text fontSize="sm" color={textColor}>Estimated Time</Text>
//             <Text fontSize="sm" color={textColor}>{flashEstimate.toFixed(1)}s</Text>
//           </HStack>
//         </VStack>
//       </Box> */}

//       <Box w="100%" bg={panelBgColor} borderRadius="md" p={4} border="1px solid" borderColor="rgba(148,163,184,0.35)">
//         <Text fontSize="md" fontWeight="bold" color={textColor} mb={3}>
//           ESP-IDF Configuration
//         </Text>
//         <VStack align="stretch" spacing={3}>
//           <FormControl>
//             <FormLabel fontSize="sm" color={textColor}>Baud Rate</FormLabel>
//             <Select
//               size="sm"
//               value={baudRate}
//               onChange={(e) => setBaudRate(Number(e.target.value))}
//               bg={useColorModeValue("white", "gray.700")}
//             >
//               <option value={115200}>115200 (Safe)</option>
//               <option value={460800}>460800 (Default)</option>
//               <option value={921600}>921600 (Fast)</option>
//             </Select>
//           </FormControl>
//           <FormControl>
//             <FormLabel fontSize="sm" color={textColor}>Flash Mode</FormLabel>
//             <Select
//               size="sm"
//               value={flashMode}
//               onChange={(e) => setFlashMode(e.target.value)}
//               bg={useColorModeValue("white", "gray.700")}
//             >
//               <option value="dio">DIO (Default)</option>
//               <option value="qio">QIO</option>
//               <option value="dout">DOUT</option>
//               <option value="qout">QOUT</option>
//             </Select>
//           </FormControl>
//         </VStack>
//       </Box>

//       {flashLogs.length > 0 && (
//         <Box w="100%" bg={panelBgColor} borderRadius="md" p={4} border="1px solid" borderColor="rgba(148,163,184,0.35)">
//           <Text fontSize="md" fontWeight="bold" color={textColor} mb={2}>
//             Flash Logs
//           </Text>
//           <Box
//             maxH="150px"
//             overflowY="auto"
//             bg={useColorModeValue("gray.50", "gray.800")}
//             p={2}
//             borderRadius="md"
//             fontSize="xs"
//             fontFamily="monospace"
//           >
//             {flashLogs.map((log, index) => (
//               <Text key={index} color={textColor} mb={1}>
//                 {log}
//               </Text>
//             ))}
//           </Box>
//         </Box>
//       )}

//       {/* Accordion for Device Info */}
//       <Accordion allowToggle w="100%">

//         {/* Flashing Time Section */}
//         {/* <AccordionItem>
//           <h2>
//             <AccordionButton>
//               <Text flex="1" textAlign="left" fontSize="md" fontWeight="bold">
//                 Flashing Time
//               </Text>
//               <AccordionIcon />
//             </AccordionButton>
//           </h2>
//           <AccordionPanel pb={2}>
//             <Box bg={panelBgColor} borderRadius="md" p={2}>
//               <VStack align="start" spacing={1}>
//                 <Text color={textColor} fontSize="sm">Elapsed Time: 2 hrs passed</Text>
//                 <Text color={textColor} fontSize="sm">Estimated Remaining: 30 mins</Text>
//                 <Text color={textColor} fontSize="sm">Status: Ongoing</Text>
//               </VStack>
//             </Box>
//           </AccordionPanel>
//         </AccordionItem> */}

//         {/* Erase & Flash Section */}
//         <AccordionItem>
//           <h2>
//             <AccordionButton>
//               <Text flex="1" textAlign="left" fontSize="md" fontWeight="bold">
//                 Erase & Flash
//               </Text>
//               <AccordionIcon />
//             </AccordionButton>
//           </h2>
//           <AccordionPanel pb={2}>
//             <HStack spacing={2}>
//               <Button
//                 size="sm"
//                 colorScheme="blue"
//                 bg={buttonBgColor}
//                 color={buttonTextColor}
//                 onClick={() => setEraseModalOpen(true)}
//               >
//                 Erase & Flash
//               </Button>
//               <Button
//                 size="sm"
//                 colorScheme="blue"
//                 bg={buttonBgColor}
//                 color={buttonTextColor}
//                 onClick={() => setEraseModalOpen(true)}
//               >
//                 Erase Data
//               </Button>
//             </HStack>
//           </AccordionPanel>
//         </AccordionItem>
//       </Accordion>

//       {/* Modal for Erase */}
//       <Modal isOpen={isEraseModalOpen} onClose={handleCloseEraseModal}>
//         <ModalOverlay />
//         <ModalContent>
//           <ModalHeader>Erase Device Data</ModalHeader>
//           <ModalCloseButton />
//           <ModalBody>
//             <Text>This will erase all data on the device. Are you sure?</Text>
//           </ModalBody>
//           <ModalFooter>
//             <Button colorScheme="red" onClick={handleErase}>
//               Erase Data
//             </Button>
//             <Button variant="outline" onClick={handleCloseEraseModal}>
//               Cancel
//             </Button>
//           </ModalFooter>
//         </ModalContent>
//       </Modal>

//       {/* Confirmation Modal */}
//       <Modal isOpen={isConfirmOpen} onClose={handleCloseConfirmModal}>
//         <ModalOverlay />
//         <ModalContent>
//           <ModalHeader>Confirm Erase</ModalHeader>
//           <ModalCloseButton />
//           <ModalBody>
//             <Text>Are you sure you want to erase this? This action cannot be undone.</Text>
//           </ModalBody>
//           <ModalFooter>
//             <Button colorScheme="red" onClick={handleFinalErase}>
//               Confirm Erase
//             </Button>
//             <Button variant="outline" onClick={handleCloseConfirmModal}>
//               Cancel
//             </Button>
//           </ModalFooter>
//         </ModalContent>
//       </Modal>

//       {/* Port Selection Modal */}
//       <Modal isOpen={isPortSelectionOpen} onClose={() => setPortSelectionOpen(false)} size="lg">
//         <ModalOverlay />
//         <ModalContent>
//           <ModalHeader>Select Device Port</ModalHeader>
//           <ModalCloseButton />
//           <ModalBody>
//             <VStack align="stretch" spacing={3}>
//               <Text fontSize="sm" color={textColor}>
//                 {detectedDevices.length > 0
//                   ? "Select a device from the list below:"
//                   : "No devices detected. Click 'Add New Device' to connect."}
//               </Text>

//               {detectedDevices.map((device, index) => (
//                 <Box
//                   key={index}
//                   p={3}
//                   borderWidth="1px"
//                   borderRadius="md"
//                   borderColor={useColorModeValue("gray.300", "gray.600")}
//                   bg={useColorModeValue("white", "gray.700")}
//                   cursor="pointer"
//                   _hover={{ bg: useColorModeValue("blue.50", "blue.900"), borderColor: "blue.400" }}
//                   onClick={() => selectDevice(device)}
//                 >
//                   <HStack justify="space-between">
//                     <VStack align="start" spacing={1}>
//                       <Text fontWeight="bold" fontSize="md">
//                         {device.deviceType}
//                       </Text>
//                       <Text fontSize="sm" color={textColor}>
//                         {device.portName}
//                       </Text>
//                       <Badge colorScheme="green" fontSize="xs">
//                         Memory: {device.memory}
//                       </Badge>
//                     </VStack>
//                     <Button size="sm" colorScheme="blue">
//                       Select
//                     </Button>
//                   </HStack>
//                 </Box>
//               ))}

//               <Divider />

//               <Button
//                 leftIcon={<FaStepForward />}
//                 colorScheme="blue"
//                 variant="outline"
//                 onClick={requestNewPort}
//                 isLoading={isDetecting}
//               >
//                 Add New Device
//               </Button>
//             </VStack>
//           </ModalBody>
//           <ModalFooter>
//             <Button variant="ghost" onClick={() => setPortSelectionOpen(false)}>
//               Cancel
//             </Button>
//           </ModalFooter>
//         </ModalContent>
//       </Modal>
//     </VStack>
//   );
// };

// export default Flash;

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
      {/* <Text fontSize="lg" fontWeight="bold" color={textColor}> */}
        {/* Flash Actions */}
      {/* </Text> */}
      {/* <HStack spacing={2}> */}
        {/* Stop Flash IconButton with Tooltip */}
        {/* <Tooltip label="Abort Flashing" fontSize="sm"> */}
          {/* <IconButton icon={<FaTimes />} aria-label="Stop Flash" size="sm" /> */}
        {/* </Tooltip> */}

        {/* Step Right IconButton with Tooltip */}
        {/* <Tooltip label="Start Flashing" fontSize="sm"> */}
          {/* <IconButton icon={<FaStepForward />} aria-label="Step Right" size="sm" /> */}
        {/* </Tooltip> */}

        {/* Restart Flash IconButton with Tooltip */}
        {/* <Tooltip label="Retry Flashing" fontSize="sm"> */}
          {/* <IconButton icon={<FaRedo />} aria-label="Restart Flash" size="sm" /> */}
        {/* </Tooltip> */}
      {/* </HStack> */}

      {/* Accordion for Device Info */}
      {/* <Accordion allowToggle w="100%"> */}
        {/* Device Connection Section */}
        {/* <AccordionItem> */}
          {/* <h2> */}
            {/* <AccordionButton> */}
              {/* <Text flex="1" textAlign="left" fontSize="md" fontWeight="bold"> */}
                {/* Device Connection */}
              {/* </Text> */}
              {/* <AccordionIcon /> */}
            {/* </AccordionButton> */}
          {/* </h2> */}
          {/* <AccordionPanel pb={2}> */}
            {/* <Box bg={panelBgColor} borderRadius="md" p={2}> */}
              {/* <VStack align="start" spacing={1}> */}
                {/* <Text color={textColor} fontSize="sm">Target Device: Microcontroller</Text> */}
                {/* <Text color={textColor} fontSize="sm">Port: USB</Text> */}
                {/* <Text color={textColor} fontSize="sm">Memory Capacity: 22,000</Text> */}
                {/* <Text color={textColor} fontSize="sm">Protocol: UART</Text> */}
                {/* <Text color={textColor} fontSize="sm">Connection: Connected</Text> */}
              {/* </VStack> */}
            {/* </Box> */}
          {/* </AccordionPanel> */}
        {/* </AccordionItem> */}

        {/* Flashing Time Section */}
        {/* <AccordionItem> */}
          {/* <h2> */}
            {/* <AccordionButton> */}
              {/* <Text flex="1" textAlign="left" fontSize="md" fontWeight="bold"> */}
                {/* Flashing Time */}
              {/* </Text> */}
              {/* <AccordionIcon /> */}
            {/* </AccordionButton> */}
          {/* </h2> */}
          {/* <AccordionPanel pb={2}> */}
            {/* <Box bg={panelBgColor} borderRadius="md" p={2}> */}
              {/* <VStack align="start" spacing={1}> */}
                {/* <Text color={textColor} fontSize="sm">Elapsed Time: 2 hrs passed</Text> */}
                {/* <Text color={textColor} fontSize="sm">Estimated Remaining: 30 mins</Text> */}
                {/* <Text color={textColor} fontSize="sm">Status: Ongoing</Text> */}
              {/* </VStack> */}
            {/* </Box> */}
          {/* </AccordionPanel> */}
        {/* </AccordionItem> */}

        {/* Erase & Flash Section */}
        {/* <AccordionItem> */}
          {/* <h2> */}
            {/* <AccordionButton> */}
              {/* <Text flex="1" textAlign="left" fontSize="md" fontWeight="bold"> */}
                {/* Erase & Flash */}
              {/* </Text> */}
              {/* <AccordionIcon /> */}
            {/* </AccordionButton> */}
          {/* </h2> */}
          {/* <AccordionPanel pb={2}> */}
            {/* <HStack spacing={2}> */}
              {/* <Button */}
                {/* // size="sm" */}
                {/* // colorScheme="blue" */}
                {/* // bg={buttonBgColor} */}
                {/* // color={buttonTextColor} */}
                {/* // onClick={() => setEraseModalOpen(true)} */}
              {/* // > */}
                {/* Erase & Flash */}
              {/* </Button> */}
              {/* <Button */}
                {/* // size="sm" */}
                {/* // colorScheme="blue" */}
                {/* // bg={buttonBgColor} */}
                {/* // color={buttonTextColor} */}
                {/* // onClick={() => setEraseModalOpen(true)} */}
              {/* // > */}
                {/* Erase Data  */}
              {/* </Button> */}
            {/* </HStack> */}
          {/* </AccordionPanel> */}
        {/* </AccordionItem> */}
      {/* </Accordion> */}

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