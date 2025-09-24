// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { FiMoon, FiSun } from 'react-icons/fi';
// import Footer from './Footer';

// const DefineProduct = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [isDarkMode, setIsDarkMode] = useState(false);
//   const [selectedRequirements, setSelectedRequirements] = useState([]);
//   const [currentScreen, setCurrentScreen] = useState('requirements'); // Manages screens

//   const toggleTheme = () => {
//     setIsDarkMode(!isDarkMode);
//   };

//   const requirements = [
//     "Sensors",
//     "Actuators",
//     "Microcontroller",
//     "Communication Module",
//     "Power Consumption",
//     "GPS Tracker",
//     "Amplifier",
//     "Medication Pods",
//     "Medication Lids",
//     "Speaker",
//     "Objects",
//     "Display",
//     "Light",
//     "Switch",
//   ];

//   const handleNext = () => {
//     setCurrentScreen('details'); // Navigate to details screen
//     setIsOpen(false); // Close the modal
//   };

//   const handleCheckboxChange = (requirement) => {
//     if (selectedRequirements.includes(requirement)) {
//       setSelectedRequirements(
//         selectedRequirements.filter((item) => item !== requirement)
//       );
//     } else {
//       setSelectedRequirements([...selectedRequirements, requirement]);
//     }
//   };

//   const navigate = useNavigate();

//   const handleFileUpload = () => {
//     // Navigate to the FileExplorer component
//     navigate('/fileupload');
//   };

//   // Component for rendering configuration based on the selected requirement
//   const renderConfiguration = (requirement) => {
//     switch (requirement) {
//       case 'Sensors':
//         return (
//           <div className="mb-6">
//             <h3 className="font-bold text-lg">Sensors:</h3>
//             <div className="mt-4 p-4 border rounded-md">
//               <label className="block mb-2">ID:</label>
//               <input type="text" placeholder="Enter ID" className="w-full p-2 border rounded mb-4" />

//               <label className="block mb-2">Type:</label>
//               <select className="w-full p-2 border rounded mb-4">
//                 <option value="">Select Type</option>
//                 <option value="temperature">Temperature</option>
//                 <option value="pressure">Pressure</option>
//                 <option value="motion">Motion</option>
//               </select>

//               <label className="block mb-2">Range:</label>
//               <input type="text" placeholder="Enter Range (min, max, unit)" className="w-full p-2 border rounded mb-4" />

//               <label className="block mb-2">Resolution:</label>
//               <input type="text" placeholder="Enter Resolution" className="w-full p-2 border rounded mb-4" />

//               <label className="block mb-2">Accuracy:</label>
//               <input type="text" placeholder="Enter Accuracy" className="w-full p-2 border rounded mb-4" />

//               <label className="block mb-2">Update Rate:</label>
//               <input type="text" placeholder="Enter Update Rate" className="w-full p-2 border rounded mb-4" />

//               <button 
//                 className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm"
//                 onClick={handleFileUpload}
//               >
//                 Upload Image/Video of the Device
//               </button>
//             </div>
//           </div>
//         );

//       case 'Actuators':
//         return (
//           <div className="mb-6">
//             <h3 className="font-bold text-lg">Actuators:</h3>
//             <div className="mt-4 p-4 border rounded-md">
//               <label className="block mb-2">ID:</label>
//               <input type="text" placeholder="Enter ID" className="w-full p-2 border rounded mb-4" />

//               <label className="block mb-2">Type:</label>
//               <select className="w-full p-2 border rounded mb-4">
//                 <option value="">Select Type</option>
//                 <option value="linear">Linear</option>
//                 <option value="rotary">Rotary</option>
//                 <option value="hydraulic">Hydraulic</option>
//               </select>

//               <label className="block mb-2">Force:</label>
//               <input type="text" placeholder="Enter Force (N)" className="w-full p-2 border rounded mb-4" />

//               <label className="block mb-2">Speed:</label>
//               <input type="text" placeholder="Enter Speed (m/s)" className="w-full p-2 border rounded mb-4" />

//               <label className="block mb-2">Voltage:</label>
//               <input type="text" placeholder="Enter Voltage (V)" className="w-full p-2 border rounded mb-4" />

//               <button 
//                 className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm"
//                 onClick={handleFileUpload}
//               >
//                 Upload Image/Video of the Device
//               </button>
//             </div>
//           </div>
//         );

//       case 'Microcontroller':
//         return (
//           <div className="mb-6">
//             <h3 className="font-bold text-lg">Microcontroller:</h3>
//             <div className="mt-4 p-4 border rounded-md">
//               <label className="block mb-2">Name:</label>
//               <input type="text" placeholder="Enter Name" className="w-full p-2 border rounded mb-4" />

//               <label className="block mb-2">Clock Speed:</label>
//               <input type="text" placeholder="Enter Clock Speed (MHz)" className="w-full p-2 border rounded mb-4" />

//               <label className="block mb-2">Number of Pins:</label>
//               <input type="text" placeholder="Enter Number of Pins" className="w-full p-2 border rounded mb-4" />

//               <label className="block mb-2">Supported Protocols:</label>
//               <select className="w-full p-2 border rounded mb-4">
//                 <option value="">Select Protocols</option>
//                 <option value="uart">UART</option>
//                 <option value="spi">SPI</option>
//                 <option value="i2c">I2C</option>
//               </select>

//               <button 
//                 className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm"
//                 onClick={handleFileUpload}
//               >
//                 Upload Image/Video of the Device
//               </button>
//             </div>
//           </div>
//         );



//     case 'Communication Module':
//         return (
//           <div className="mb-6">
//             <h3 className="font-bold text-lg">Communication Module:</h3>
//             <div className="mt-4 p-4 border rounded-md">
//               <label className="block mb-2">Name:</label>
//               <input type="text" placeholder="Enter Name" className="w-full p-2 border rounded mb-4" />

//               <label className="block mb-2">Clock Speed:</label>
//               <input type="text" placeholder="Enter Clock Speed (MHz)" className="w-full p-2 border rounded mb-4" />

//               <label className="block mb-2">Number of Pins:</label>
//               <input type="text" placeholder="Enter Number of Pins" className="w-full p-2 border rounded mb-4" />

//               <label className="block mb-2">Supported Protocols:</label>
//               <select className="w-full p-2 border rounded mb-4">
//                 <option value="">Select Protocols</option>
//                 <option value="uart">UART</option>
//                 <option value="spi">SPI</option>
//                 <option value="i2c">I2C</option>
//               </select>

//               <button 
//                 className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm"
//                 onClick={handleFileUpload}
//               >
//                 Upload Image/Video of the Device
//               </button>
//             </div>
//           </div>
//         );


//         case 'Power Consumption':
//             return (
//               <div className="mb-6">
//                 <h3 className="font-bold text-lg">Power Consumption:</h3>
//                 <div className="mt-4 p-4 border rounded-md">
//                   <label className="block mb-2">Name:</label>
//                   <input type="text" placeholder="Enter Name" className="w-full p-2 border rounded mb-4" />
    
//                   <label className="block mb-2">Clock Speed:</label>
//                   <input type="text" placeholder="Enter Clock Speed (MHz)" className="w-full p-2 border rounded mb-4" />
    
//                   <label className="block mb-2">Number of Pins:</label>
//                   <input type="text" placeholder="Enter Number of Pins" className="w-full p-2 border rounded mb-4" />
    
//                   <label className="block mb-2">Supported Protocols:</label>
//                   <select className="w-full p-2 border rounded mb-4">
//                     <option value="">Select Protocols</option>
//                     <option value="uart">UART</option>
//                     <option value="spi">SPI</option>
//                     <option value="i2c">I2C</option>
//                   </select>
    
//                   <button 
//                     className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm"
//                     onClick={handleFileUpload}
//                   >
//                     Upload Image/Video of the Device
//                   </button>
//                 </div>
//               </div>
//             );





//             case 'GPS Tracker':
//                 return (
//                   <div className="mb-6">
//                     <h3 className="font-bold text-lg">GPS Tracker:</h3>
//                     <div className="mt-4 p-4 border rounded-md">
//                       <label className="block mb-2">Name:</label>
//                       <input type="text" placeholder="Enter Name" className="w-full p-2 border rounded mb-4" />
        
//                       <label className="block mb-2">Clock Speed:</label>
//                       <input type="text" placeholder="Enter Clock Speed (MHz)" className="w-full p-2 border rounded mb-4" />
        
//                       <label className="block mb-2">Number of Pins:</label>
//                       <input type="text" placeholder="Enter Number of Pins" className="w-full p-2 border rounded mb-4" />
        
//                       <label className="block mb-2">Supported Protocols:</label>
//                       <select className="w-full p-2 border rounded mb-4">
//                         <option value="">Select Protocols</option>
//                         <option value="uart">UART</option>
//                         <option value="spi">SPI</option>
//                         <option value="i2c">I2C</option>
//                       </select>
        
//                       <button 
//                         className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm"
//                         onClick={handleFileUpload}
//                       >
//                         Upload Image/Video of the Device
//                       </button>
//                     </div>
//                   </div>
//                 );






//                 case 'Amplifier':
//                     return (
//                       <div className="mb-6">
//                         <h3 className="font-bold text-lg">Amplifier:</h3>
//                         <div className="mt-4 p-4 border rounded-md">
//                           <label className="block mb-2">Name:</label>
//                           <input type="text" placeholder="Enter Name" className="w-full p-2 border rounded mb-4" />
            
//                           <label className="block mb-2">Clock Speed:</label>
//                           <input type="text" placeholder="Enter Clock Speed (MHz)" className="w-full p-2 border rounded mb-4" />
            
//                           <label className="block mb-2">Number of Pins:</label>
//                           <input type="text" placeholder="Enter Number of Pins" className="w-full p-2 border rounded mb-4" />
            
//                           <label className="block mb-2">Supported Protocols:</label>
//                           <select className="w-full p-2 border rounded mb-4">
//                             <option value="">Select Protocols</option>
//                             <option value="uart">UART</option>
//                             <option value="spi">SPI</option>
//                             <option value="i2c">I2C</option>
//                           </select>
            
//                           <button 
//                             className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm"
//                             onClick={handleFileUpload}
//                           >
//                             Upload Image/Video of the Device
//                           </button>
//                         </div>
//                       </div>
//                     );


//                     case 'Medication Pods':
//                         return (
//                           <div className="mb-6">
//                             <h3 className="font-bold text-lg">Medication Pods:</h3>
//                             <div className="mt-4 p-4 border rounded-md">
//                               <label className="block mb-2">Name:</label>
//                               <input type="text" placeholder="Enter Name" className="w-full p-2 border rounded mb-4" />
                
//                               <label className="block mb-2">Clock Speed:</label>
//                               <input type="text" placeholder="Enter Clock Speed (MHz)" className="w-full p-2 border rounded mb-4" />
                
//                               <label className="block mb-2">Number of Pins:</label>
//                               <input type="text" placeholder="Enter Number of Pins" className="w-full p-2 border rounded mb-4" />
                
//                               <label className="block mb-2">Supported Protocols:</label>
//                               <select className="w-full p-2 border rounded mb-4">
//                                 <option value="">Select Protocols</option>
//                                 <option value="uart">UART</option>
//                                 <option value="spi">SPI</option>
//                                 <option value="i2c">I2C</option>
//                               </select>
                
//                               <button 
//                                 className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm"
//                                 onClick={handleFileUpload}
//                               >
//                                 Upload Image/Video of the Device
//                               </button>
//                             </div>
//                           </div>
//                         );


//                         case 'Objects':
//                             return (
//                               <div className="mb-6">
//                                 <h3 className="font-bold text-lg">Objects:</h3>
//                                 <div className="mt-4 p-4 border rounded-md">
//                                   <label className="block mb-2">Name:</label>
//                                   <input type="text" placeholder="Enter Name" className="w-full p-2 border rounded mb-4" />
                    
//                                   <label className="block mb-2">Clock Speed:</label>
//                                   <input type="text" placeholder="Enter Clock Speed (MHz)" className="w-full p-2 border rounded mb-4" />
                    
//                                   <label className="block mb-2">Number of Pins:</label>
//                                   <input type="text" placeholder="Enter Number of Pins" className="w-full p-2 border rounded mb-4" />
                    
//                                   <label className="block mb-2">Supported Protocols:</label>
//                                   <select className="w-full p-2 border rounded mb-4">
//                                     <option value="">Select Protocols</option>
//                                     <option value="uart">UART</option>
//                                     <option value="spi">SPI</option>
//                                     <option value="i2c">I2C</option>
//                                   </select>
                    
//                                   <button 
//                                     className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm"
//                                     onClick={handleFileUpload}
//                                   >
//                                     Upload Image/Video of the Device
//                                   </button>
//                                 </div>
//                               </div>
//                             );


//                             case 'Medication Lids':
//                                 return (
//                                   <div className="mb-6">
//                                     <h3 className="font-bold text-lg">Medication Lids:</h3>
//                                     <div className="mt-4 p-4 border rounded-md">
//                                       <label className="block mb-2">Name:</label>
//                                       <input type="text" placeholder="Enter Name" className="w-full p-2 border rounded mb-4" />
                        
//                                       <label className="block mb-2">Clock Speed:</label>
//                                       <input type="text" placeholder="Enter Clock Speed (MHz)" className="w-full p-2 border rounded mb-4" />
                        
//                                       <label className="block mb-2">Number of Pins:</label>
//                                       <input type="text" placeholder="Enter Number of Pins" className="w-full p-2 border rounded mb-4" />
                        
//                                       <label className="block mb-2">Supported Protocols:</label>
//                                       <select className="w-full p-2 border rounded mb-4">
//                                         <option value="">Select Protocols</option>
//                                         <option value="uart">UART</option>
//                                         <option value="spi">SPI</option>
//                                         <option value="i2c">I2C</option>
//                                       </select>
                        
//                                       <button 
//                                         className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm"
//                                         onClick={handleFileUpload}
//                                       >
//                                         Upload Image/Video of the Device
//                                       </button>
//                                     </div>
//                                   </div>
//                                 );


//                                 case 'Speaker':
//                                     return (
//                                       <div className="mb-6">
//                                         <h3 className="font-bold text-lg">Speaker:</h3>
//                                         <div className="mt-4 p-4 border rounded-md">
//                                           <label className="block mb-2">Name:</label>
//                                           <input type="text" placeholder="Enter Name" className="w-full p-2 border rounded mb-4" />
                            
//                                           <label className="block mb-2">Clock Speed:</label>
//                                           <input type="text" placeholder="Enter Clock Speed (MHz)" className="w-full p-2 border rounded mb-4" />
                            
//                                           <label className="block mb-2">Number of Pins:</label>
//                                           <input type="text" placeholder="Enter Number of Pins" className="w-full p-2 border rounded mb-4" />
                            
//                                           <label className="block mb-2">Supported Protocols:</label>
//                                           <select className="w-full p-2 border rounded mb-4">
//                                             <option value="">Select Protocols</option>
//                                             <option value="uart">UART</option>
//                                             <option value="spi">SPI</option>
//                                             <option value="i2c">I2C</option>
//                                           </select>
//                                           <button 
//                                             className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm"
//                                             onClick={handleFileUpload}
//                                           >
//                                             Upload Image/Video of the Device
//                                           </button>
//                                         </div>
//                                       </div>
//                                     );



//                                     case 'Display':
//                                         return (
//                                           <div className="mb-6">
//                                             <h3 className="font-bold text-lg">Display:</h3>
//                                             <div className="mt-4 p-4 border rounded-md">
//                                               <label className="block mb-2">Name:</label>
//                                               <input type="text" placeholder="Enter Name" className="w-full p-2 border rounded mb-4" />
                                
//                                               <label className="block mb-2">Clock Speed:</label>
//                                               <input type="text" placeholder="Enter Clock Speed (MHz)" className="w-full p-2 border rounded mb-4" />
                                
//                                               <label className="block mb-2">Number of Pins:</label>
//                                               <input type="text" placeholder="Enter Number of Pins" className="w-full p-2 border rounded mb-4" />
                                
//                                               <label className="block mb-2">Supported Protocols:</label>
//                                               <select className="w-full p-2 border rounded mb-4">
//                                                 <option value="">Select Protocols</option>
//                                                 <option value="uart">UART</option>
//                                                 <option value="spi">SPI</option>
//                                                 <option value="i2c">I2C</option>
//                                               </select>
                                
//                                               <button 
//                                                 className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm"
//                                                 onClick={handleFileUpload}
//                                               >
//                                                 Upload Image/Video of the Device
//                                               </button>
//                                             </div>
//                                           </div>
//                                         );


//                                         case 'Light':
//                                             return (
//                                               <div className="mb-6">
//                                                 <h3 className="font-bold text-lg">Light:</h3>
//                                                 <div className="mt-4 p-4 border rounded-md">
//                                                   <label className="block mb-2">Name:</label>
//                                                   <input type="text" placeholder="Enter Name" className="w-full p-2 border rounded mb-4" />
                                    
//                                                   <label className="block mb-2">Clock Speed:</label>
//                                                   <input type="text" placeholder="Enter Clock Speed (MHz)" className="w-full p-2 border rounded mb-4" />
                                    
//                                                   <label className="block mb-2">Number of Pins:</label>
//                                                   <input type="text" placeholder="Enter Number of Pins" className="w-full p-2 border rounded mb-4" />
                                    
//                                                   <label className="block mb-2">Supported Protocols:</label>
//                                                   <select className="w-full p-2 border rounded mb-4">
//                                                     <option value="">Select Protocols</option>
//                                                     <option value="uart">UART</option>
//                                                     <option value="spi">SPI</option>
//                                                     <option value="i2c">I2C</option>
//                                                   </select>
                                    
//                                                   <button 
//                                                     className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm"
//                                                     onClick={handleFileUpload}
//                                                   >
//                                                     Upload Image/Video of the Device
//                                                   </button>
//                                                 </div>
//                                               </div>
//                                             );



                                            
//                                         case 'Switch':
//                                             return (
//                                               <div className="mb-6">
//                                                 <h3 className="font-bold text-lg">Switch:</h3>
//                                                 <div className="mt-4 p-4 border rounded-md">
//                                                   <label className="block mb-2">Name:</label>
//                                                   <input type="text" placeholder="Enter Name" className="w-full p-2 border rounded mb-4" />
                                    
//                                                   <label className="block mb-2">Clock Speed:</label>
//                                                   <input type="text" placeholder="Enter Clock Speed (MHz)" className="w-full p-2 border rounded mb-4" />
                                    
//                                                   <label className="block mb-2">Number of Pins:</label>
//                                                   <input type="text" placeholder="Enter Number of Pins" className="w-full p-2 border rounded mb-4" />
                                    
//                                                   <label className="block mb-2">Supported Protocols:</label>
//                                                   <select className="w-full p-2 border rounded mb-4">
//                                                     <option value="">Select Protocols</option>
//                                                     <option value="uart">UART</option>
//                                                     <option value="spi">SPI</option>
//                                                     <option value="i2c">I2C</option>
//                                                   </select>
                                    
//                                                   <button 
//                                                     className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm"
//                                                     onClick={handleFileUpload}
//                                                   >
//                                                     Upload Image/Video of the Device
//                                                   </button>
//                                                 </div>
//                                               </div>
//                                             );

//       // Add more cases for other requirements
//       default:
//         return null;
//     }
//   };

//   return (
//     <div className={`flex flex-col min-h-screen ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
//       <div className="flex-1 p-4">
//         {/* Theme Toggle Button */}
//         <button
//           aria-label="Toggle Theme"
//           onClick={toggleTheme}
//           className="absolute top-4 right-4 p-2 rounded-full bg-gray-200 dark:bg-gray-700"
//         >
//           {isDarkMode ? <FiSun /> : <FiMoon />}
//         </button>

//         {/* Conditional Rendering */}
//         {currentScreen === 'requirements' ? (
//           <>
//             {/* Define Product Requirements Button */}
//             <div className="text-center mt-12">
//               <button onClick={() => setIsOpen(true)} className="bg-blue-500 text-white px-4 py-2 rounded-md">
//                 Define Product Requirements
//               </button>
//             </div>

//             {/* Modal */}
//             {isOpen && (
//               <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//                 <div className={`p-6 rounded-lg shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
//                   <h2 className="text-xl font-bold mb-4">Choose Your Product Requirements</h2>
//                   <div className="grid grid-cols-2 gap-4">
//                     {requirements.map((requirement, index) => (
//                       <label key={index} className="flex items-center space-x-2">
//                         <input
//                           type="checkbox"
//                           checked={selectedRequirements.includes(requirement)}
//                           onChange={() => handleCheckboxChange(requirement)}
//                           className="form-checkbox"
//                         />
//                         <span>{requirement}</span>
//                       </label>
//                     ))}
//                   </div>
//                   <div className="flex justify-end mt-6">
//                     <button onClick={() => setIsOpen(false)} className="px-4 py-2 mr-3 rounded-md bg-gray-200 dark:bg-gray-600">
//                       Cancel
//                     </button>
//                     <button
//                       onClick={handleNext}
//                       disabled={selectedRequirements.length === 0}
//                       className="px-4 py-2 rounded-md bg-blue-500 text-white disabled:bg-gray-400"
//                     >
//                       Next
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </>
//         ) : (
//           // Details Screen
//           <div>
//             <h2 className="text-2xl mb-4">
//               Configure Details for: {selectedRequirements.join(', ')}
//             </h2>
//             {selectedRequirements.map((requirement) =>
//               renderConfiguration(requirement)
//             )}
//             <button
//               onClick={() => setCurrentScreen('requirements')}
//               className="px-4 py-2 mr-3 rounded-md bg-gray-200 dark:bg-gray-600"
//             >
//               Back
//             </button>
//             <button className="px-4 py-2 rounded-md bg-blue-500 text-white">Submit</button>
//           </div>
//         )}
//       </div>

//       <Footer />
//     </div>
//   );
// };

// export default DefineProduct;



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
  Text,
  useColorMode,
  useDisclosure,
  VStack,
  HStack
} from "@chakra-ui/react";
import { MoonIcon, SunIcon, AddIcon } from "@chakra-ui/icons";
import { useNavigate } from 'react-router-dom';
// import Footer from "./Footer";
import DefineProductTwo from './DefineProductTwo';

const DefineProduct = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();
  const navigate = useNavigate();
  
  const [selectedRequirements, setSelectedRequirements] = useState([]);
  const [currentScreen, setCurrentScreen] = useState("requirements");
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});

  const requirements = [
    "Sensors", "Actuators", "Microcontroller", "Communication Module",
    "Power Consumption", "GPS Tracker", "Amplifier", "Medication Pods",
    "Medication Lids", "Speaker", "Objects", "Display", "Light", "Switch"
  ];

  const handleFileUpload = () => {
    navigate('/fileupload');
  };

  const handleNext = () => {
    if (currentScreen === "requirements") {
      setCurrentScreen("details");
      onClose();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      setCurrentScreen("requirements");
    }
  };

  const handleCheckboxChange = (requirement) => {
    setSelectedRequirements(
      selectedRequirements.includes(requirement)
        ? selectedRequirements.filter(item => item !== requirement)
        : [...selectedRequirements, requirement]
    );
  };

  const handleAddMore = (requirement) => {
    const currentRequirementData = formData[requirement] || [];
    setFormData({
      ...formData,
      [requirement]: [...currentRequirementData, {}]
    });
  };

  const handleInputChange = (requirement, index, field, value) => {
    const currentRequirementData = [...(formData[requirement] || [])];
    currentRequirementData[index] = {
      ...currentRequirementData[index],
      [field]: value
    };
    setFormData({
      ...formData,
      [requirement]: currentRequirementData
    });
  };

  const renderRequirementForm = (requirement, index) => {
    const forms = {
      "Sensors": (
    <Box key={index} mt={4} p={4} borderWidth={1} borderRadius="md">
      <Text fontWeight="bold">Sensor {index + 1}:</Text>
      <Text>ID:</Text>
      <Input placeholder="Enter ID" mb={4} onChange={(e) => handleInputChange("Sensors", index, "id", e.target.value)} />
      <Text>Type:</Text>
      <Input placeholder="Enter the type of Sensor" mb={4} onChange={(e) => handleInputChange("Sensors", index, "type", e.target.value)} />
      <Text>Range:</Text>
      <Input placeholder="Enter Range (min, max, unit)" mb={4} onChange={(e) => handleInputChange("Sensors", index, "range", e.target.value)} />
      <Text>Resolution:</Text>
      <Input placeholder="Enter Resolution" mb={4} onChange={(e) => handleInputChange("Sensors", index, "resolution", e.target.value)} />
      <Text>Accuracy:</Text>
      <Input placeholder="Enter Accuracy" mb={4} onChange={(e) => handleInputChange("Sensors", index, "accuracy", e.target.value)} />
      <Text>Update Rate:</Text>
      <Input placeholder="Enter Update Rate" mb={4} onChange={(e) => handleInputChange("Sensors", index, "updateRate", e.target.value)} />
      <Button colorScheme="blue" size="sm" onClick={handleFileUpload}>Upload Image/Video of the Device</Button>
    </Box>
  ),

  "Actuators": (
    <Box key={index} mt={4} p={4} borderWidth={1} borderRadius="md">
      <Text fontWeight="bold">Actuator {index + 1}:</Text>
      <Text>ID:</Text>
      <Input placeholder="Enter ID" mb={4} onChange={(e) => handleInputChange("Actuators", index, "id", e.target.value)} />
      <Text>Type:</Text>
      <Input placeholder="Enter the type of Actuators" mb={4} onChange={(e) => handleInputChange("Actuators", index, "type", e.target.value)} />
      <Text>Range:</Text>
      <Input placeholder="Enter Range (min, max, unit)" mb={4} onChange={(e) => handleInputChange("Actuators", index, "range", e.target.value)} />
      <Text>Torque:</Text>
      <Input placeholder="Enter Torque" mb={4} onChange={(e) => handleInputChange("Actuators", index, "torque", e.target.value)} />
      <Text>Response Time:</Text>
      <Input placeholder="Enter Response Time" mb={4} onChange={(e) => handleInputChange("Actuators", index, "responseTime", e.target.value)} />
      <Text>Speed:</Text>
      <Input placeholder="Enter Speed" mb={4} onChange={(e) => handleInputChange("Actuators", index, "speed", e.target.value)} />
      <Button colorScheme="blue" size="sm" onClick={handleFileUpload}>Upload Image/Video of the Device</Button>
    </Box>
  ),

  "Microcontroller": (
    <Box key={index} mt={4} p={4} borderWidth={1} borderRadius="md">
      <Text fontWeight="bold">Microcontroller {index + 1}:</Text>
      <Text>ID:</Text>
      <Input placeholder="Enter ID" mb={4} onChange={(e) => handleInputChange("Microcontroller", index, "id", e.target.value)} />
      <Text>Type:</Text>
      <Input placeholder="Enter the type of Microcontroller" mb={4} onChange={(e) => handleInputChange("Microcontroller", index, "type", e.target.value)} />
      <Text>Processor:</Text>
      <Input placeholder="Enter Processor" mb={4} onChange={(e) => handleInputChange("Microcontroller", index, "processor", e.target.value)} />
      <Text>Memory:</Text>
      <Input placeholder="Enter Memory" mb={4} onChange={(e) => handleInputChange("Microcontroller", index, "memory", e.target.value)} />
      <Text>GPIO:</Text>
      <Input placeholder="Enter GPIO" mb={4} onChange={(e) => handleInputChange("Microcontroller", index, "gpio", e.target.value)} />
      <Text>Interfaces:</Text>
      <Input placeholder="Enter Interfaces" mb={4} onChange={(e) => handleInputChange("Microcontroller", index, "interfaces", e.target.value)} />
      <Text>Power Supply:</Text>
      <Input placeholder="Enter Power Supply" mb={4} onChange={(e) => handleInputChange("Microcontroller", index, "powerSupply", e.target.value)} />
      <Text>Dimensions:</Text>
      <Input placeholder="Enter Dimensions" mb={4} onChange={(e) => handleInputChange("Microcontroller", index, "dimensions", e.target.value)} />
      <Button colorScheme="blue" size="sm" onClick={handleFileUpload}>Upload Image/Video of the Device</Button>
    </Box>
  ),

  "Communication Module": (
    <Box key={index} mt={4} p={4} borderWidth={1} borderRadius="md">
      <Text fontWeight="bold">Communication Module {index + 1}:</Text>
      <Text>ID:</Text>
      <Input placeholder="Enter ID" mb={4} onChange={(e) => handleInputChange("Communication Module", index, "id", e.target.value)} />
      <Text>Type:</Text>
      <Input placeholder="Enter the type of Communication Module" mb={4} onChange={(e) => handleInputChange("Communication Module", index, "type", e.target.value)} />
      <Text>Range:</Text>
      <Input placeholder="Enter Range (min, max, unit)" mb={4} onChange={(e) => handleInputChange("Communication Module", index, "range", e.target.value)} />
      <Text>Power Supply:</Text>
      <Input placeholder="Enter Power Supply" mb={4} onChange={(e) => handleInputChange("Communication Module", index, "powerSupply", e.target.value)} />
      <Text>Data Rate:</Text>
      <Input placeholder="Enter Data Rate" mb={4} onChange={(e) => handleInputChange("Communication Module", index, "dataRate", e.target.value)} />
      <Text>Speed:</Text>
      <Input placeholder="Enter Speed" mb={4} onChange={(e) => handleInputChange("Communication Module", index, "speed", e.target.value)} />
      <Button colorScheme="blue" size="sm" onClick={handleFileUpload}>Upload Image/Video of the Device</Button>
    </Box>
  ),

  "Power Consumption": (
    <Box key={index} mt={4} p={4} borderWidth={1} borderRadius="md">
      <Text fontWeight="bold">Power Consumption {index + 1}:</Text>
      <Text>ID:</Text>
      <Input placeholder="Enter ID" mb={4} onChange={(e) => handleInputChange("Power Consumption", index, "id", e.target.value)} />
      <Text>Type:</Text>
      <Input placeholder="Enter the type of Power Consumption" mb={4} onChange={(e) => handleInputChange("Power Consumption", index, "type", e.target.value)} />
      <Text>Supply Voltage:</Text>
      <Input placeholder="Enter Supply Voltage" mb={2} onChange={(e) => handleInputChange("Power Consumption", index, "supplyVoltage1", e.target.value)} />
      <Input placeholder="Enter Supply Voltage" mb={2} onChange={(e) => handleInputChange("Power Consumption", index, "supplyVoltage2", e.target.value)} />
      <Text>Active Mode:</Text>
      <Input placeholder="Enter Active Mode" mb={4} onChange={(e) => handleInputChange("Power Consumption", index, "activeMode", e.target.value)} />
      <Text>Idle Mode:</Text>
      <Input placeholder="Enter Idle Mode" mb={4} onChange={(e) => handleInputChange("Power Consumption", index, "idleMode", e.target.value)} />
      <Text>Deep Sleep Mode:</Text>
      <Input placeholder="Enter Deep Sleep Mode" mb={4} onChange={(e) => handleInputChange("Power Consumption", index, "deepSleepMode", e.target.value)} />
      <Text>Peak Power Consumption:</Text>
      <Input placeholder="Enter Peak Power Consumption" mb={4} onChange={(e) => handleInputChange("Power Consumption", index, "peakPowerConsumption", e.target.value)} />
      <Text>Quiescent Current:</Text>
      <Input placeholder="Enter Quiescent Current" mb={4} onChange={(e) => handleInputChange("Power Consumption", index, "quiescentCurrent", e.target.value)} />
      <Button colorScheme="blue" size="sm" onClick={handleFileUpload}>Upload Image/Video of the Device</Button>
    </Box>
  ),

  "GPS Tracker": (
    <Box key={index} mt={4} p={4} borderWidth={1} borderRadius="md">
      <Text fontWeight="bold">GPS Tracker {index + 1}:</Text>
      <Text>ID:</Text>
      <Input placeholder="Enter ID" mb={4} onChange={(e) => handleInputChange("GPS Tracker", index, "id", e.target.value)} />
      <Text>Type:</Text>
      <Input placeholder="Enter the type of GPS Tracker" mb={4} onChange={(e) => handleInputChange("GPS Tracker", index, "type", e.target.value)} />
      <Text>Latitude:</Text>
      <Input placeholder="Enter Latitude" mb={4} onChange={(e) => handleInputChange("GPS Tracker", index, "latitude", e.target.value)} />
      <Text>Longitude:</Text>
      <Input placeholder="Enter Longitude" mb={4} onChange={(e) => handleInputChange("GPS Tracker", index, "longitude", e.target.value)} />
      <Text>Altitude:</Text>
      <Input placeholder="Enter Altitude" mb={4} onChange={(e) => handleInputChange("GPS Tracker", index, "altitude", e.target.value)} />
      <Text>Speed:</Text>
      <Input placeholder="Enter Speed" mb={4} onChange={(e) => handleInputChange("GPS Tracker", index, "speed", e.target.value)} />
      <Text>Time Stamp:</Text>
      <Input placeholder="Enter Time Stamp" mb={4} onChange={(e) => handleInputChange("GPS Tracker", index, "timeStamp", e.target.value)} />
      <Text>Satellite Count:</Text>
      <Input placeholder="Enter Satellite Count" mb={4} onChange={(e) => handleInputChange("GPS Tracker", index, "satelliteCount", e.target.value)} />
      <Button colorScheme="blue" size="sm" onClick={handleFileUpload}>Upload Image/Video of the Device</Button>
    </Box>
  ),

  "Amplifier": (
    <Box key={index} mt={4} p={4} borderWidth={1} borderRadius="md">
      <Text fontWeight="bold">Amplifier {index + 1}:</Text>
      <Text>ID:</Text>
      <Input placeholder="Enter ID" mb={4} onChange={(e) => handleInputChange("Amplifier", index, "id", e.target.value)} />
      <Text>Type:</Text>
      <Input placeholder="Enter the type of Amplifier" mb={4} onChange={(e) => handleInputChange("Amplifier", index, "type", e.target.value)} />
      <Text>Supply Voltage:</Text>
      <Input placeholder="Enter Supply Voltage" mb={4} onChange={(e) => handleInputChange("Amplifier", index, "supplyVoltage", e.target.value)} />
      <Text>Output Power:</Text>
      <Input placeholder="Enter Output Power" mb={4} onChange={(e) => handleInputChange("Amplifier", index, "outputPower", e.target.value)} />
      <Text>Gain:</Text>
      <Input placeholder="Enter Gain" mb={4} onChange={(e) => handleInputChange("Amplifier", index, "gain", e.target.value)} />
      <Text>Frequency Response:</Text>
      <Input placeholder="Enter Frequency Response" mb={4} onChange={(e) => handleInputChange("Amplifier", index, "frequencyResponse", e.target.value)} />
      <Text>Input Impedance:</Text>
      <Input placeholder="Enter Input Impedance" mb={4} onChange={(e) => handleInputChange("Amplifier", index, "inputImpedance", e.target.value)} />
      <Text>Output Impedance:</Text>
      <Input placeholder="Enter Output Impedance" mb={4} onChange={(e) => handleInputChange("Amplifier", index, "outputImpedance", e.target.value)} />
      <Button colorScheme="blue" size="sm" onClick={handleFileUpload}>Upload Image/Video of the Device</Button>
    </Box>
  ),

  "Medication Pods": (
    <Box key={index} mt={4} p={4} borderWidth={1} borderRadius="md">
      <Text fontWeight="bold">Medication Pod {index + 1}:</Text>
      <Text>ID:</Text>
      <Input placeholder="Enter ID" mb={4} onChange={(e) => handleInputChange("Medication Pods", index, "id", e.target.value)} />
      <Text>Type:</Text>
      <Input placeholder="Enter the type of Medication Pod" mb={4} onChange={(e) => handleInputChange("Medication Pods", index, "type", e.target.value)} />
      <Text>Dosage:</Text>
      <Input placeholder="Enter Dosage" mb={4} onChange={(e) => handleInputChange("Medication Pods", index, "dosage", e.target.value)} />
      <Text>Frequency:</Text>
      <Input placeholder="Enter Frequency" mb={4} onChange={(e) => handleInputChange("Medication Pods", index, "frequency", e.target.value)} />
      <Text>Time:</Text>
      <Input placeholder="Enter Time" mb={4} onChange={(e) => handleInputChange("Medication Pods", index, "time", e.target.value)} />
      <Text>Routes:</Text>
      <Input placeholder="Enter Routes" mb={4} onChange={(e) => handleInputChange("Medication Pods", index, "routes", e.target.value)} />
      <Button colorScheme="blue" size="sm" onClick={handleFileUpload}>Upload Image/Video of the Device</Button>
    </Box>
  ),
      // Add similar forms for other requirements...
      "Objects":
 (
          <Box key={index} mt={4} p={4} borderWidth={1} borderRadius="md">
            <Text fontWeight="bold">Object {index + 1}:</Text>
            <Input placeholder="Enter ID" mb={4} onChange={(e) => handleInputChange("Objects", index, "id", e.target.value)} />
            <Input placeholder="Enter the type of Object" mb={4} onChange={(e) => handleInputChange("Objects", index, "type", e.target.value)} />
            <Input placeholder="Enter Dimensions" mb={4} onChange={(e) => handleInputChange("Objects", index, "dimensions", e.target.value)} />
            <Input placeholder="Enter Shape" mb={4} onChange={(e) => handleInputChange("Objects", index, "shape", e.target.value)} />
            <Input placeholder="Enter Size" mb={4} onChange={(e) => handleInputChange("Objects", index, "size", e.target.value)} />
            <Input placeholder="Enter Weight Material" mb={4} onChange={(e) => handleInputChange("Objects", index, "weightMaterial", e.target.value)} />
            <Input placeholder="Enter Mechanical Strength" mb={4} onChange={(e) => handleInputChange("Objects", index, "mechanicalStrength", e.target.value)} />
            <Input placeholder="Enter Flexibility" mb={4} onChange={(e) => handleInputChange("Objects", index, "flexibility", e.target.value)} />
            <Input placeholder="Enter Texture" mb={4} onChange={(e) => handleInputChange("Objects", index, "texture", e.target.value)} />
            <Input placeholder="Enter Environmental Factor" mb={4} onChange={(e) => handleInputChange("Objects", index, "environmentalFactor", e.target.value)} />
            <Button colorScheme="blue" size="sm" onClick={handleFileUpload}>
              Upload Image/Video of the Device
            </Button>
          </Box>
        ),
  
      "Medication Lids":(
          <Box key={index} mt={4} p={4} borderWidth={1} borderRadius="md">
            <Text fontWeight="bold">Medication Lid {index + 1}:</Text>
            <Input placeholder="Enter ID" mb={4} onChange={(e) => handleInputChange("MedicationLids", index, "id", e.target.value)} />
            <Input placeholder="Enter the type of Medication Lid" mb={4} onChange={(e) => handleInputChange("MedicationLids", index, "type", e.target.value)} />
            <Input placeholder="Enter Dosage" mb={4} onChange={(e) => handleInputChange("MedicationLids", index, "dosage", e.target.value)} />
            <Input placeholder="Enter Frequency" mb={4} onChange={(e) => handleInputChange("MedicationLids", index, "frequency", e.target.value)} />
            <Input placeholder="Enter Time" mb={4} onChange={(e) => handleInputChange("MedicationLids", index, "time", e.target.value)} />
            <Input placeholder="Enter Routes" mb={4} onChange={(e) => handleInputChange("MedicationLids", index, "routes", e.target.value)} />
            <Button colorScheme="blue" size="sm" onClick={handleFileUpload}>
              Upload Image/Video of the Device
            </Button>
          </Box>
        ),
  
       "Speaker":
       (
          <Box key={index} mt={4} p={4} borderWidth={1} borderRadius="md">
            <Text fontWeight="bold">Speaker {index + 1}:</Text>
            <Input placeholder="Enter ID" mb={4} onChange={(e) => handleInputChange("Speaker", index, "id", e.target.value)} />
            <Input placeholder="Enter the type of Speaker" mb={4} onChange={(e) => handleInputChange("Speaker", index, "type", e.target.value)} />
            <Input placeholder="Enter Impedance" mb={4} onChange={(e) => handleInputChange("Speaker", index, "impedance", e.target.value)} />
            <Input placeholder="Enter RMS Power" mb={4} onChange={(e) => handleInputChange("Speaker", index, "rmsPower", e.target.value)} />
            <Input placeholder="Enter Peak Power" mb={4} onChange={(e) => handleInputChange("Speaker", index, "peakPower", e.target.value)} />
            <Input placeholder="Enter Sensitivity" mb={4} onChange={(e) => handleInputChange("Speaker", index, "sensitivity", e.target.value)} />
            <Input placeholder="Enter Cone Material" mb={4} onChange={(e) => handleInputChange("Speaker", index, "coneMaterial", e.target.value)} />
            <Input placeholder="Enter Environmental Rating" mb={4} onChange={(e) => handleInputChange("Speaker", index, "environmentalRating", e.target.value)} />
            <Button colorScheme="blue" size="sm" onClick={handleFileUpload}>
              Upload Image/Video of the Device
            </Button>
          </Box>
        ),
  
      "Display":
         (
          <Box key={index} mt={4} p={4} borderWidth={1} borderRadius="md">
            <Text fontWeight="bold">Display {index + 1}:</Text>
            <Input placeholder="Enter ID" mb={4} onChange={(e) => handleInputChange("Display", index, "id", e.target.value)} />
            <Input placeholder="Enter the type of Display" mb={4} onChange={(e) => handleInputChange("Display", index, "type", e.target.value)} />
            <Input placeholder="Enter Supply Voltage" mb={4} onChange={(e) => handleInputChange("Display", index, "supplyVoltage", e.target.value)} />
            <Input placeholder="Enter Active Mode" mb={4} onChange={(e) => handleInputChange("Display", index, "activeMode", e.target.value)} />
            <Input placeholder="Enter Idle Mode" mb={4} onChange={(e) => handleInputChange("Display", index, "idleMode", e.target.value)} />
            <Input placeholder="Enter Deep Sleep Mode" mb={4} onChange={(e) => handleInputChange("Display", index, "deepSleepMode", e.target.value)} />
            <Input placeholder="Enter Peak Power Consumption" mb={4} onChange={(e) => handleInputChange("Display", index, "peakPowerConsumption", e.target.value)} />
            <Input placeholder="Enter Quiescent Current" mb={4} onChange={(e) => handleInputChange("Display", index, "quiescentCurrent", e.target.value)} />
            <Button colorScheme="blue" size="sm" onClick={handleFileUpload}>
              Upload Image/Video of the Device
            </Button>
          </Box>
        ),
  
      "Light":
        (
          <Box key={index} mt={4} p={4} borderWidth={1} borderRadius="md">
            <Text fontWeight="bold">Light {index + 1}:</Text>
            <Input placeholder="Enter ID" mb={4} onChange={(e) => handleInputChange("Light", index, "id", e.target.value)} />
            <Input placeholder="Enter the type of Light" mb={4} onChange={(e) => handleInputChange("Light", index, "type", e.target.value)} />
            <Input placeholder="Enter On(1) || Off(0)" mb={4} onChange={(e) => handleInputChange("Light", index, "status", e.target.value)} />
            <Input placeholder="Enter Voltage" mb={4} onChange={(e) => handleInputChange("Light", index, "voltage", e.target.value)} />
            <Button colorScheme="blue" size="sm" onClick={handleFileUpload}>
              Upload Image/Video of the Device
            </Button>
          </Box>
        ),

        "Switch":
        (
          <Box key={index} mt={4} p={4} borderWidth={1} borderRadius="md">
            <Text fontWeight="bold">Light {index + 1}:</Text>
            <Input placeholder="Enter ID" mb={4} onChange={(e) => handleInputChange("Light", index, "id", e.target.value)} />
            <Input placeholder="Enter the type of Light" mb={4} onChange={(e) => handleInputChange("Light", index, "type", e.target.value)} />
            <Input placeholder="Enter On(1) || Off(0)" mb={4} onChange={(e) => handleInputChange("Light", index, "status", e.target.value)} />
            <Input placeholder="Enter Voltage" mb={4} onChange={(e) => handleInputChange("Light", index, "voltage", e.target.value)} />
            <Button colorScheme="blue" size="sm" onClick={handleFileUpload}>
              Upload Image/Video of the Device
            </Button>
          </Box>
        ),
      // ends..... 
    };

    return forms[requirement] || null;
  };

  const renderCurrentStep = () => {
    const currentRequirement = selectedRequirements[currentStep];
    const requirementData = formData[currentRequirement] || [{}];

    return (
      <Box>
        <Text fontSize="2xl" mb={4}>{currentRequirement}</Text>
        <VStack spacing={4} align="stretch">
          {requirementData.map((_, index) => renderRequirementForm(currentRequirement, index))}
          <Button leftIcon={<AddIcon />} onClick={() => handleAddMore(currentRequirement)}>
            Add Another {currentRequirement}
          </Button>
        </VStack>
      </Box>
    );
  };



return (
  <Box display="flex" flexDirection="column" minH="110vh">
    <Box flex="1" p={4}>
      <IconButton
        aria-label="Toggle Theme"
        icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
        onClick={toggleColorMode}
        position="absolute"
        top="1rem"
        right="1rem"
      />
      
      {currentScreen === "requirements" ? (
        <Box textAlign="center" mt={12}>
          <Modal isOpen={true} onClose={onClose}>
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
                <Button variant="ghost" mr={3} onClick={onClose}>Cancel</Button>
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
        </Box>
      ) : (
        <Box>
          {renderCurrentStep()}
          <HStack mt={4} spacing={4}>
            <Button colorScheme="gray" onClick={handleBack}>Back</Button>
            {currentStep < selectedRequirements.length - 1 ? (
              <Button colorScheme="blue" onClick={handleNext}>Next</Button>
            ) : (
              <DefineProductTwo/>
            )}
          </HStack>
        </Box>
      )}
    </Box>
    {/* <Footer /> */}
  </Box>
);
};

export default DefineProduct;

