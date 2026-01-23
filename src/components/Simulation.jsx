// import React, { useState, useEffect, useRef } from 'react';
// import { DndProvider, useDrag, useDrop } from 'react-dnd';
// import { HTML5Backend } from 'react-dnd-html5-backend';
// import { Rnd } from 'react-rnd';
// import { Maximize, ZoomIn, ZoomOut, ArrowLeft, ArrowRight } from 'lucide-react';
// import { FiTrash } from 'react-icons/fi';
// import { InputGroup, InputLeftElement, Input } from '@chakra-ui/react';
// import { FaSearch } from 'react-icons/fa';
// import { useNavigate } from 'react-router-dom';

// // Import all your existing SVG icons
// import SoundAndVibrationsSensor from '../images/sound and vibrarions sensor.svg';
// import ServoMotors from '../images/servo motors.svg';
// import RGBLights from '../images/rgb lights.svg';
// import PowerSupply from '../images/powersupply.svg';
// import OpticalSensor from '../images/optical sensor.svg';
// import OledDisplays from '../images/oled displays.svg';
// import MotionSensor from '../images/motion sensor.svg';
// import Microcontroller from '../images/microcontroller 1.svg';
// import EnvironmentalSensor from '../images/environmental sensor.svg';
// import ElectricalAndMagneticsSensor from '../images/electrical and magnetics  sensor.svg';
// import DistanceAndRangeSensor from '../images/distance and range sensor.svg';
// import Connectors from '../images/connectors.svg';
// import ChemicalSensor from '../images/chemaical sensor.svg';
// import Buzzer from '../images/buzzer.svg';
// import Amplifier from '../images/amplifier.svg';
// import ActuatorsRelay from '../images/actuators relay.svg';
// import Wire from '../images/wire.svg';
// import VibrationsMotors from '../images/vibrations motors.svg';
// import TouchAndForceSensor from '../images/touch and force sensor.svg';
// import TemperatureSensor from '../images/temperature sensor.svg';
// import SimulationPopup from './SimulationPopup'; // Import the popup component
// import BlackWire from '../images/blackwire.svg';
// import GreenWire from '../images/greenwire.svg';
// import RedWire from '../images/redwire.svg';
// import Connectorone from "../images/connectorzoneone.svg";
// import Connectortwo from "../images/connectorzonetwo.svg";
// import Connectorthree from "../images/connectorzonethree.svg";
// import Connectorfour from "../images/connectorzonefour.svg";
// import Connectorfive from "../images/connectorzonefive.svg";
// import SimulationOne from './SimulationOne';
// import Phsensor from "../images/phsensor.svg";
// import Moisturesensor from "../images/moisturesensor.svg"
// import Lightsensor from "../images/lightsensor.svg"
// import Irsensor from "../images/irsensor.svg"
// import Heartbeatsensor from "../images/heartbeatsensor.svg"
// import Gassensor from "../images/gassensor.svg";
// import Airqualitysensor from "../images/airqualitysensor.svg";
// import Airqualitysensorone from "../images/airqualitysensorone.svg";
// import Accelerometer from "../images/accelerometer.svg";
// import Accelerometerone from "../images/accelerometerone.svg";
// import Bluelight from "../images/bluelight.svg";
// import Redlight from "../images/redlight.svg";
// import Greenlight from "../images/greenlight.svg";

// // ... (rest of your imports)

// import Navbar from './Navbar';
// import Footer from './Footer';
// import './Flowchart.css';
// import Output from './Output';
// import { Box, Text } from '@chakra-ui/react';

// // Your existing symbols array
// const symbols = [
//   {
//     category: "SENSORS ▼",
//     items: [
//       { type: "svg", src: SoundAndVibrationsSensor, name: "Sound and Vibrations Sensor" },
//       { type: "svg", src: OpticalSensor, name: "Optical Sensor" },
//       { type: "svg", src: EnvironmentalSensor, name: "Environmental Sensor" },
//       { type: "svg", src: ElectricalAndMagneticsSensor, name: "Electrical and Magnetics Sensor" },
//       { type: "svg", src: DistanceAndRangeSensor, name: "Distance and Range Sensor" },
//       { type: "svg", src: ChemicalSensor, name: "Chemical Sensor" },
//       { type: "svg", src: MotionSensor, name: "Motion Sensor" },
//       { type: "svg", src: TouchAndForceSensor, name: "Touch and Force Sensor" },
//       { type: "svg", src: TemperatureSensor, name: "Temperature Sensor" },
//       { type: "svg", src: Phsensor, name: "pH Sensor" },
//   { type: "svg", src: Moisturesensor, name: "Moisture Sensor" },
//   { type: "svg", src: Lightsensor, name: "Light Sensor" },
//   { type: "svg", src: Irsensor, name: "IR Sensor" },
//   { type: "svg", src: Heartbeatsensor, name: "Heartbeat Sensor" },
//   { type: "svg", src: Gassensor, name: "Gas Sensor" },
//   { type: "svg", src: Airqualitysensor, name: "Air Quality Sensor" },
//   { type: "svg", src: Airqualitysensorone, name: "Air Quality Sensor" },
//   { type: "svg", src: Accelerometer, name: "Accelerometer" },
//   { type: "svg", src: Accelerometerone, name: "Accelerometer" }
//     ],
//   },
//   {
//     category: "ACTUATORS ▼",
//     items: [
//       { type: "svg", src: ServoMotors, name: "Servo Motors" },
//       { type: "svg", src: VibrationsMotors, name: "Vibrations Motors" },
//       { type: "svg", src: ActuatorsRelay, name: " Relay" },
//     ],
//   },
//   {
//     category: "DISPLAY AND INDICATORS ▼",
//     items: [
//       { type: "svg", src: OledDisplays, name: "OLED Displays" },
//       // { type: "svg", src: RGBLights, name: "RGB Lights" },
//       { type: "svg", src: Buzzer, name: "Buzzer" },
//       { type: "svg", src: Redlight, name: "Redlight" },
//       { type: "svg", src: Greenlight , name: "Green Light " },
//       { type: "svg", src: Bluelight , name: "Blue Light " },
//     ],
//   },
//   {
//     category: "POWER ▼",
//     items: [
//       { type: "svg", src: PowerSupply, name: "Power Supply" },
//     ],
//   },
//   {
//     category: "CONNECTORS ▼",
//     items: [
//       { type: "svg", src: Connectors, name: "Connectors" },
//       { type: "svg", src: Wire, name: "Wire" },
//       { type: "svg", src: RedWire, name: "RedWire" },
//       { type: "svg", src: GreenWire, name: "GreenWire" },
//       { type: "svg", src: BlackWire, name: "BlackWire" },
//       { type: "svg", src: Connectorone, name: "Connector Zone1" },
//       { type: "svg", src: Connectortwo, name: "Connector Zone2" },
//       { type: "svg", src: Connectorthree, name: "Connector Zone3" },
//       { type: "svg", src: Connectorfour, name: "Connector Zone4" },
//       { type: "svg", src: Connectorfive, name: "Connector Zone5" },

//     ],
//   },
//   {
//     category: "AMPLIFIERS ▼",
//     items: [
//       { type: "svg", src: Amplifier, name: "Amplifier" },
//     ],
//   },
//   {
//     category: "MICROCONTROLLERS ▼",
//     items: [
//       { type: "svg", src: Microcontroller, name: "Microcontroller" },
//     ],
//   },
// ];

// // const BlockDiagram = () => {
// //   const [openCategories, setOpenCategories] = useState({});
// //   const [droppedItems, setDroppedItems] = useState([]);
// //   const [activeSymbol, setActiveSymbol] = useState(null);
// //   const [contextMenu, setContextMenu] = useState(null);
// //   const contextMenuRef = useRef(null);
// //   const navigate = useNavigate();

// //   // Custom hook for handling clicks outside elements
// //   const useClickOutside = (ref, handler) => {
// //     useEffect(() => {
// //       const listener = (event) => {
// //         if (!ref.current || ref.current.contains(event.target)) {
// //           return;
// //         }
// //         handler(event);
// //       };
// //       document.addEventListener('mousedown', listener);
// //       return () => {
// //         document.removeEventListener('mousedown', listener);
// //       };
// //     }, [ref, handler]);
// //   };

// //   // Use the hook for context menu
// //   useClickOutside(contextMenuRef, () => setContextMenu(null));

// //   const toggleCategory = (category) => {
// //     setOpenCategories((prev) => ({
// //       ...prev,
// //       [category]: !prev[category],
// //     }));
// //   };

// //   const handleContextMenu = (e, index) => {
// //     e.preventDefault();
// //     e.stopPropagation();
// //     setContextMenu({
// //       x: e.clientX,
// //       y: e.clientY,
// //       symbolIndex: index
// //     });
// //   };

// //   const handleDelete = () => {
// //     if (contextMenu) {
// //       setDroppedItems(items => items.filter((_, index) => index !== contextMenu.symbolIndex));
// //       setContextMenu(null);
// //       setActiveSymbol(null);
// //       alert('Symbol deleted successfully!');
// //     }
// //   };

// //   // SymbolItem component
// //   const SymbolItem = ({ symbol }) => {
// //     const [, drag] = useDrag(() => ({
// //       type: "symbol",
// //       item: { symbol },
// //     }));

// //     return (
// //       <button
// //         ref={drag}
// //         className="symbol-button"
// //         style={{
// //           cursor: "grab",
// //           height: "140px",
// //           width: "140px",
// //           display: "flex",
// //           flexDirection: "column",
// //           alignItems: "center",
// //           justifyContent: "center"
// //         }}
// //       >
// //         {symbol.type === "unicode" ? (
// //           symbol.symbol
// //         ) : (
// //           <img src={symbol.src} alt="SVG Symbol" className="svg-icon" />
// //         )}
// //         <div style={{
// //           marginTop: "4px",
// //           fontSize: "18px",
// //           color: "white"
// //         }}>
// //           {symbol.name}
// //         </div>
// //       </button>
// //     );
// //   };

// //   // Canvas component
// //   const Canvas = () => {
// //     const [, drop] = useDrop(() => ({
// //       accept: "symbol",
// //       drop: (item, monitor) => {
// //         const offset = monitor.getClientOffset();
// //         if (item && item.symbol && offset) {
// //           const newSymbol = {
// //             symbol: item.symbol,
// //             x: offset.x - 100,
// //             y: offset.y - 100,
// //             width: 120,
// //             height: 120,
// //           };
// //           setDroppedItems(prev => [...prev, newSymbol]);
// //           setActiveSymbol(droppedItems.length);
// //         }
// //       },
// //     }));

// //     return (
// //       <div
// //         ref={drop}
// //         className="canvas-placeholder"
// //         // style={{ position: "relative", height: "500px", border: "none",background: 'linear-gradient(to bottom right, #f5f5f5, #ffffff)' }}
// //         style={{ position: "relative", height: "900px", border: "none",background: "white" }}
// //         onClick={() => setActiveSymbol(null)}
// //       >
// //         {droppedItems.map((item, index) => (
// //           <Rnd
// //             key={index}
// //             default={{
// //               x: item.x,
// //               y: item.y,
// //               width: item.width,
// //               height: item.height,
// //             }}
// //             style={{
// //               border: activeSymbol === index ? '2px solid #4299e1' : 'none',
// //               borderRadius: '4px',
// //               transition: 'border 0.2s ease',
// //               boxShadow: activeSymbol === index ? '0 0 10px rgba(66, 153, 225, 0.3)' : 'none'
// //             }}
// //             onMouseDown={(e) => {
// //               e.stopPropagation();
// //               setActiveSymbol(index);
// //             }}
// //             onDragStart={() => setActiveSymbol(index)}
// //             onResizeStart={() => setActiveSymbol(index)}
// //             onContextMenu={(e) => handleContextMenu(e, index)}
// //             onDragStop={(e, d) => {
// //               setDroppedItems(prev =>
// //                 prev.map((item, i) =>
// //                   i === index ? { ...item, x: d.x, y: d.y } : item
// //                 )
// //               );
// //             }}
// //             onResizeStop={(e, direction, ref, delta, position) => {
// //               setDroppedItems(prev =>
// //                 prev.map((item, i) =>
// //                   i === index
// //                     ? {
// //                         ...item,
// //                         width: ref.offsetWidth,
// //                         height: ref.offsetHeight,
// //                         ...position,
// //                       }
// //                     : item
// //                 )
// //               );
// //             }}
// //           >
// //             <div
// //               style={{
// //                 width: '100%',
// //                 height: '100%',
// //                 cursor: 'move',
// //                 position: 'relative'
// //               }}
// //             >
// //               {item.symbol.type === "unicode" ? (
// //                 <div style={{ fontSize: "24px" }}>{item.symbol.symbol}</div>
// //               ) : (
// //                 <img
// //                   src={item.symbol.src}
// //                   alt="SVG Element"
// //                   style={{
// //                     width: "100%",
// //                     height: "100%",
// //                     pointerEvents: 'none'
// //                   }}
// //                 />
// //               )}
// //               {activeSymbol === index && (
// //                 <div
// //                   style={{
// //                     position: 'absolute',
// //                     top: -25,
// //                     left: '50%',
// //                     transform: 'translateX(-50%)',
// //                     backgroundColor: '#4299e1',
// //                     color: 'white',
// //                     padding: '2px 8px',
// //                     borderRadius: '3px',
// //                     fontSize: '12px',
// //                     whiteSpace: 'nowrap',
// //                     zIndex: 1000
// //                   }}
// //                 >
// //                   {item.symbol.name}
// //                 </div>
// //               )}
// //             </div>
// //           </Rnd>
// //         ))}

// //         {contextMenu && (
// //           <div
// //             ref={contextMenuRef}
// //             style={{
// //               position: 'fixed',
// //               top: contextMenu.y,
// //               left: contextMenu.x,
// //               backgroundColor: 'white',
// //               border: '1px solid #ccc',
// //               borderRadius: '4px',
// //               padding: '8px',
// //               boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
// //               zIndex: 1000
// //             }}
// //           >
// //             <button
// //               onClick={handleDelete}
// //               style={{
// //                 display: 'flex',
// //                 alignItems: 'center',
// //                 gap: '4px',
// //                 backgroundColor: '#f44336',
// //                 color: 'white',
// //                 border: 'none',
// //                 padding: '8px 16px',
// //                 borderRadius: '4px',
// //                 cursor: 'pointer',
// //                 transition: 'background-color 0.2s ease'
// //               }}
// //             >
// //               <FiTrash size={16} />
// //               Delete
// //             </button>
// //           </div>
// //         )}
// //       </div>
// //     );
// //   };

// //   return (
// //     <DndProvider backend={HTML5Backend}>
// //       <div className="flowchart-container">
// //         <Navbar />
// //         <div className="top-controls">
// //           <button className="control-button">
// //             <FiTrash size={25} />
// //           </button>
// //           <button className="control-button">
// //             <Maximize size={25} />
// //           </button>
// //           <button className="control-button">
// //             <ZoomIn size={25} />
// //           </button>
// //           <button className="control-button">
// //             <ZoomOut size={25} />
// //           </button>
// //           <button className="control-button">
// //             <ArrowLeft size={25} />
// //           </button>
// //           <button className="control-button">
// //             <ArrowRight size={25} />
// //           </button>
// //           <SimulationPopup>
// //             <button className="control-button">Code</button>
// //           </SimulationPopup>
// //         </div>

// //         <div className="main-content">
// //           <div className="sidebar">
// //             <div className="symbol-grid">
// //               <div
// //                 className="top-buttons"
// //                 style={{
// //                   display: 'flex',
// //                   flexDirection: 'row',
// //                   gap: '10px',
// //                   alignItems: 'center',
// //                   marginBottom: '20px',
// //                 }}
// //               >
// //               <InputGroup size="sm">
// //                 <InputLeftElement pointerEvents="none">
// //                   <FaSearch color="gray.400" />
// //                 </InputLeftElement>
// //                 <Input
// //                   type="text"
// //                   placeholder="Search..."
// //                   borderRadius="md"
// //                   borderColor="gray.300"
// //                 />
// //               </InputGroup>
// //             </div>
// //             </div>
// //             <div className="symbol-grid">
// //               {symbols.map((section, sectionIndex) => (
// //                 <div key={sectionIndex} className="symbol-section">
// //                   <h3
// //                     onClick={() => toggleCategory(section.category)}
// //                     style={{ cursor: "pointer" }}
// //                   >
// //                     {section.category}
// //                   </h3>
// //                   {openCategories[section.category] && (
// //                     <div className="symbol-items" style={{ borderLeft: 'none' }}>
// //                       {section.items.map((symbol, symbolIndex) => (
// //                         <SymbolItem key={symbolIndex} symbol={symbol} />
// //                       ))}
// //                     </div>
// //                   )}
// //                 </div>
// //               ))}
// //             </div>
// //           </div>
// //           <div className="main-area">
// //             <Canvas />
// //           </div>
// //         </div>

// //         {/* <div style={{
// //           position: 'absolute',
// //           bottom: 0,
// //           left: '320px',
// //           right: 0,
// //           backgroundColor: '#1e1e2f',
// //           // backgroundColor: 'white',
// //           color: '#e0e0e0',
// //           padding: '20px',
// //           // borderTop: '2px solid #3c3c4f',
// //           display: 'flex',
// //           flexDirection: 'column',
// //           alignItems: 'flex-start',
// //           justifyContent: 'center',
// //           height: '200px',
// //           fontFamily: 'monospace',
// //           overflowY: 'auto',
// //           boxShadow: '0 -4px 12px rgba(0, 0, 0, 0.3)',
// //         }}>
// //           <p style={{ fontSize: '16px', opacity: 0.8, margin: 0 }}>
// //             Simulation Output:
// //           </p>
// //           <pre style={{
// //             marginTop: '10px',
// //             padding: '10px',
// //          background: 'linear-gradient(to bottom right, rgb(226, 232, 240),rgb(226, 232, 240))',
// //             color: 'black',
// //             width: '100%',
// //             height: '100%',
// //             borderRadius: '4px',
// //             overflow: 'auto',
// //             border: '1px solidrgba(60, 60, 79, 0)',
// //           }}>
// //             "Explore your simulation results here"
// //           </pre>
// //         </div> */}

// //         {/* <div style={{ display: 'flex', flexDirection: 'column', minHeight: '73vh' }}>
// //           <div style={{ flex: '1' }}></div>
// //           // <Footer />
// //         </div> */}
// //                {/* <Footer /> */}
// // <Output />
// //       </div>
// //     </DndProvider>
// //   );
// // };

// // export default BlockDiagram;

// new code by dibyanshu and was the final code

// const BlockDiagram = () => {
//   const [tabs, setTabs] = useState([{ id: 1, name: "Simulation", symbols: [] }]);
//   const [activeTab, setActiveTab] = useState(1);
//   const [openCategories, setOpenCategories] = useState({}); // Moved here
//   const MAX_TABS = 5;
//   const navigate = useNavigate();

//   const addNewTab = () => {
//     if (tabs.length >= MAX_TABS) {
//       alert("Maximum of 5 tabs allowed.");
//       return;
//     }
//     const newTabId = tabs.length + 1;
//     const newTab = { id: newTabId, name: `Simulation ${newTabId}`, symbols: [] };
//     setTabs([...tabs, newTab]);
//     setActiveTab(newTabId);
//   };

//   const handleTabClick = (tabId) => setActiveTab(tabId);

//   const closeTab = (tabId, event) => {
//     event.stopPropagation();
//     const newTabs = tabs.filter((tab) => tab.id !== tabId);
//     if (newTabs.length > 0) {
//       if (activeTab === tabId) {
//         setActiveTab(newTabs[newTabs.length - 1].id);
//       }
//     } else {
//       const newTab = { id: 1, name: "Simulation", symbols: [] };
//       setTabs([newTab]);
//       setActiveTab(1);
//     }
//     setTabs(newTabs);
//   };

//   const toggleCategory = (category) => {
//     setOpenCategories((prev) => ({
//       ...prev,
//       [category]: !prev[category],
//     }));
//   };

//   const SymbolItem = ({ symbol }) => {
//     const [, drag] = useDrag(() => ({
//       type: "symbol",
//       item: { symbol },
//     }));

//     return (
//             <button
//         ref={drag}
//         className="symbol-button"
//         style={{
//           cursor: "grab",
//           height: "140px",
//           width: "140px",
//           display: "flex",
//           flexDirection: "column",
//           alignItems: "center",
//           justifyContent: "center"
//         }}
//       >
//   {symbol.type === "unicode" ? (
//     symbol.symbol
//   ) : (
//     <img src={symbol.src} alt="SVG Symbol" className="svg-icon" />
//   )}
//   <div style={{
//     marginTop: "4px",
//     fontSize: "18px",
//     color: "white"
//   }}>
//     {symbol.name}
//   </div>
// </button>

//     );
//   };

// // start
// // Add this custom hook to handle click outside
// const useClickOutside = (ref, handler) => {
//   useEffect(() => {
//     const listener = (event) => {
//       if (!ref.current || ref.current.contains(event.target)) {
//         return;
//       }
//       handler(event);
//     };
//     document.addEventListener('mousedown', listener);
//     document.addEventListener('touchstart', listener);
//     return () => {
//       document.removeEventListener('mousedown', listener);
//       document.removeEventListener('touchstart', listener);
//     };
//   }, [ref, handler]);
// };

// // end

// const Canvas = () => {
//   const [contextMenu, setContextMenu] = useState(null);
//   const [activeSymbol, setActiveSymbol] = useState(null);
//   const contextMenuRef = useRef(null);

//   useClickOutside(contextMenuRef, () => setContextMenu(null));

//   const [, drop] = useDrop(() => ({
//     accept: "symbol",
//     drop: (item, monitor) => {
//       const offset = monitor.getClientOffset();
//       if (item && item.symbol && offset) {
//         const newSymbol = {
//           symbol: item.symbol,
//           x: offset.x - 100,
//           y: offset.y - 100,
//           width: 120,
//           height: 120,
//           id: Date.now() + Math.random(), // Add unique ID
//         };
//         dispatch(addDroppedItem(newSymbol));
//         setActiveSymbol(droppedItems.length);
//       }
//     },
//   }));

//   const activeTabSymbols = tabs.find((tab) => tab.id === activeTab)?.symbols || [];

//   const handleContextMenu = (e, index) => {
//     e.preventDefault();
//     setContextMenu({
//       x: e.clientX,
//       y: e.clientY,
//       symbolIndex: index
//     });
//   };

//   const handleDelete = () => {
//     if (contextMenu) {
//       setTabs((prevTabs) =>
//         prevTabs.map((tab) =>
//           tab.id === activeTab
//             ? {
//                 ...tab,
//                 symbols: tab.symbols.filter(
//                   (_, index) => index !== contextMenu.symbolIndex
//                 ),
//               }
//             : tab
//         )
//       );
//       setContextMenu(null);
//       alert("Symbol deleted successfully!");
//     }
//   };

//   return (
//     <div
//       ref={drop}
//       className="canvas-placeholder"
//       style={{ position: "relative", height: "750px", border: "none",background: "white" }}
//       onClick={() => setActiveSymbol(null)} // Clear active symbol when clicking canvas
//     >
//       {activeTabSymbols.map((item, index) => (
//         <Rnd
//           key={index}
//           default={{
//             x: item.x,
//             y: item.y,
//             width: item.width,
//             height: item.height,
//           }}
//           style={{
//             border: activeSymbol === index ? '2px solid #4299e1' : 'none',
//             borderRadius: '4px',
//             transition: 'border 0.2s ease',
//             boxShadow: activeSymbol === index ? '0 0 10px rgba(66, 153, 225, 0.3)' : 'none'
//           }}
//           onMouseDown={(e) => {
//             e.stopPropagation();
//             setActiveSymbol(index);
//           }}
//           onContextMenu={(e) => handleContextMenu(e, index)}
//           onDragStart={() => setActiveSymbol(index)}
//           onResizeStart={() => setActiveSymbol(index)}
//           onDragStop={(e, d) => {
//             setTabs((prevTabs) =>
//               prevTabs.map((tab) =>
//                 tab.id === activeTab
//                   ? {
//                       ...tab,
//                       symbols: tab.symbols.map((symbol, i) =>
//                         i === index ? { ...symbol, x: d.x, y: d.y } : symbol
//                       ),
//                     }
//                   : tab
//               )
//             );
//           }}
//           onResizeStop={(e, direction, ref, delta, position) => {
//             setTabs((prevTabs) =>
//               prevTabs.map((tab) =>
//                 tab.id === activeTab
//                   ? {
//                       ...tab,
//                       symbols: tab.symbols.map((symbol, i) =>
//                         i === index
//                           ? {
//                               ...symbol,
//                               width: ref.offsetWidth,
//                               height: ref.offsetHeight,
//                               ...position,
//                             }
//                           : symbol
//                       ),
//                     }
//                   : tab
//               )
//             );
//           }}
//         >
//           <div
//             style={{
//               width: '100%',
//               height: '100%',
//               cursor: 'move',
//               position: 'relative'
//             }}
//           >
//             {item.symbol.type === "unicode" ? (
//               <div style={{ fontSize: "24px" }}>{item.symbol.symbol}</div>
//             ) : (
//               <img
//                 src={item.symbol.src}
//                 alt="SVG Element"
//                 style={{
//                   width: "100%",
//                   height: "100%",
//                   pointerEvents: 'none', // Prevents image from interfering with drag
//                   // filter: 'brightness(0)' // Makes the SVG black
//                 }}
//               />
//             )}
//           </div>
//         </Rnd>
//       ))}

//         {/* Spark effects */}
//         {sparkEffects.map((spark) => (
//           <div
//             key={spark.id}
//             style={{
//               position: "absolute",
//               left: spark.x,
//               top: spark.y,
//               width: "60px",
//               height: "60px",
//               transform: "translate(-50%, -50%)",
//               pointerEvents: "none",
//               zIndex: 9999,
//             }}
//           >
//             {/* Spark animation */}
//             <div
//               style={{
//                 position: "absolute",
//                 width: "100%",
//                 height: "100%",
//                 borderRadius: "50%",
//                 background: "radial-gradient(circle, #FFD700 0%, #FFA500 30%, transparent 70%)",
//                 animation: "sparkPulse 0.5s ease-out",
//               }}
//             />
//             <div
//               style={{
//                 position: "absolute",
//                 width: "100%",
//                 height: "100%",
//                 borderRadius: "50%",
//                 background: "radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,215,0,0.5) 40%, transparent 70%)",
//                 animation: "sparkExpand 0.5s ease-out",
//               }}
//             />
//             {/* Lightning bolt emoji */}
//             <div
//               style={{
//                 position: "absolute",
//                 top: "50%",
//                 left: "50%",
//                 transform: "translate(-50%, -50%)",
//                 fontSize: "32px",
//                 animation: "sparkRotate 0.5s ease-out",
//               }}
//             >
//               ⚡
//             </div>
//           </div>
//         ))}

//       {contextMenu && (
//         <div
//           ref={contextMenuRef}
//           style={{
//             position: 'fixed',
//             top: contextMenu.y,
//             left: contextMenu.x,
//             backgroundColor: 'white',
//             border: '1px solid #ccc',
//             borderRadius: '4px',
//             padding: '8px',
//             boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
//             zIndex: 1000
//           }}
//         >
//           <button
//             onClick={handleDelete}
//             style={{
//               backgroundColor: 'red',
//               color: 'white',
//               border: 'none',
//               padding: '8px 16px',
//               borderRadius: '4px',
//               cursor: 'pointer'
//             }}
//           >
//             Delete
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

//   return (
//     <DndProvider backend={HTML5Backend}>
//       <div className="flowchart-container">
//         <Navbar />
//         <div className="top-controls">
//           <div><SimulationOne/></div>
//         {/* <button className="control-button">
//   <FiTrash size={25} />
// </button>
//           <button className="control-button">
//             <Maximize size={25} />
//           </button>
//           <button className="control-button">
//             <ZoomIn size={25} />
//           </button>
//           <button className="control-button">
//             <ZoomOut size={25} />
//           </button>
//           <button className="control-button">
//             <ArrowLeft size={25} />
//           </button>
//           <button className="control-button">
//             <ArrowRight size={25} />
//           </button> */}
//           <SimulationPopup >
//              <button className="control-button">Code</button>
//           </SimulationPopup>
//               </div>

//         <div className="main-content">
//           <div className="sidebar">
//             <div className="symbol-grid">
//               {/* start  */}
//               <div
//                 className="top-buttons"
//                 style={{
//                   display: 'flex',
//                   flexDirection: 'row',
//                   gap: '10px',
//                   alignItems: 'center',
//                   marginBottom: '20px',
//                 }}
//               >

//               </div>

// <div style={{
//   display: 'flex',
//   alignItems: 'center',
//   padding: '10px 14px', // Increased padding for better spacing

// }}>
// {/* SEARCH BOX OPEN  */}
// <InputGroup size="sm">
//       <InputLeftElement pointerEvents="none" children={<FaSearch color="gray.400" />} />
//       <Input
//         type="text"
//         placeholder="Search..."
//         borderRadius="md"
//         borderColor="gray.300"
//       />
//     </InputGroup>
// {/* SEARCH BOX CLOSE  */}
// </div>

//               {/* end  */}
//               {symbols.map((section, sectionIndex) => (
//                 <div key={sectionIndex} className="symbol-section">
//                   <h3
//                     onClick={() => toggleCategory(section.category)}
//                     style={{ cursor: 'pointer' }}
//                   >
//                     {section.category}
//                   </h3>
//                   {openCategories[section.category] && (
//                     <div className="symbol-items" style={{ borderLeft: '1px solid white' }}>
//                     {section.items.map((symbol, symbolIndex) => (
//                         <SymbolItem key={symbolIndex} symbol={symbol} />
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>
//           <div className="main-area">
//             <div
//               style={{
//                 display: 'flex',
//                 alignItems: 'center',
//                 backgroundColor: '#0f0a19',
//                 padding: '8px',
//                 borderRadius: '4px',
//                 marginBottom: '10px',
//                 overflowX: 'auto'
//               }}
//             >
//               {tabs.map((tab) => (
//                 <div
//                   key={tab.id}
//                   onClick={() => handleTabClick(tab.id)}
//                   style={{
//                     display: 'flex',
//                     alignItems: 'center',
//                     backgroundColor: activeTab === tab.id ? '#2d3748' : '#4A5568',
//                     color: 'white',
//                     padding: '6px 12px',
//                     borderRadius: '4px',
//                     marginRight: '8px',
//                     cursor: 'pointer',
//                     fontSize: '14px',
//                     minWidth: 'fit-content'
//                   }}
//                 >
//                   <span style={{ marginRight: '8px' }}>{tab.name}</span>

//                 </div>
//               ))}

//             </div>
//             <Canvas />
//           </div>
//         </div>
//       </div>
//     </DndProvider>
//   );
// };

// export default BlockDiagram;

// Simulation code given by siva

import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Rnd } from "react-rnd";
import { Maximize, ZoomIn, ZoomOut, ArrowLeft, ArrowRight } from "lucide-react";
import { FiTrash } from "react-icons/fi";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Import all your existing SVG icons
import SoundAndVibrationsSensor from "../images/sound and vibrarions sensor.svg";
import ServoMotors from "../images/servo motors.svg";
import RGBLights from "../images/rgb lights.svg";
import PowerSupply from "../images/powersupply.svg";
import OpticalSensor from "../images/optical sensor.svg";
import OledDisplays from "../images/oled displays.svg";
import MotionSensor from "../images/motion sensor.svg";
import Microcontroller from "../images/microcontroller 1.svg";
import EnvironmentalSensor from "../images/environmental sensor.svg";
// import ElectricalAndMagneticsSensor from "../images/ElectricalAndMagneticsSensor.svg";
import DistanceAndRangeSensor from "../images/distance and range sensor.svg";
import Connectors from "../images/connectors.svg";
import ChemicalSensor from "../images/chemaical sensor.svg";
import Buzzer from "../images/buzzer.svg";
import Amplifier from "../images/amplifier.svg";
import ActuatorsRelay from "../images/actuators relay.svg";
import Wire from "../images/wire.svg";
import VibrationsMotors from "../images/vibrations motors.svg";
import TouchAndForceSensor from "../images/touch and force sensor.svg";
import TemperatureSensor from "../images/temperature sensor.svg";
import SimulationPopup from "./SimulationPopup"; // Import the popup component
import BlackWire from "../images/blackwire.svg";
import GreenWire from "../images/greenwire.svg";
import RedWire from "../images/redwire.svg";
import Connectorone from "../images/connectorzoneone.svg";
import Connectortwo from "../images/connectorzonetwo.svg";
import Connectorthree from "../images/connectorzonethree.svg";
import Connectorfour from "../images/connectorzonefour.svg";
import Connectorfive from "../images/connectorzonefive.svg";
import SimulationOne from "./SimulationOne";
import { useAutoSaveTabs } from "../hooks/useAutoSaveTabs";
import { useSimulationAutoSave, useGlobalAutoSave } from "../hooks/useAutoSave";
import { autoSaveManager } from "../utils/autoSaveManager";
import Phsensor from "../images/phsensor.svg";
import Moisturesensor from "../images/moisturesensor.svg";
import Lightsensor from "../images/lightsensor.svg";
import Irsensor from "../images/irsensor.svg";
import Heartbeatsensor from "../images/heartbeatsensor.svg";
import Gassensor from "../images/gassensor.svg";
import Airqualitysensor from "../images/airqualitysensor.svg";
import Airqualitysensorone from "../images/airqualitysensorone.svg";
import Accelerometer from "../images/accelerometer.svg";
import Accelerometerone from "../images/accelerometerone.svg";
import Bluelight from "../images/bluelight.svg";
import Redlight from "../images/redlight.svg";
import Greenlight from "../images/greenlight.svg";
import hooterOff from "../images/hooterOff.svg";
import hooterOn from "../images/hooterOn.svg";
import ledBlueOn from "../images/ledBlueOn.svg";
import powerButtonOff from "../images/powerButtonOff.svg";
import powerButtonOn from "../images/powerButtonOn.svg";
import RGBLED from "../images/RGBLED.svg";
import toggleOff from "../images/toggleOff.svg";
import toggleOn from "../images/toggleOn.svg";
import pushButtonOff from "../images/pushButtonOff.svg";
import pushButtonOn from "../images/pushButtonOn.svg";

import EditorNavbar from "./EditorNavbar";
import { useProject } from "../ProjectContext";
import { checkProductDefinition } from "./EmbeddedFileManagement/EmbeddedFileManagement";
import { fetchFileSystem } from "./EmbeddedFileManagement/EmbeddedFileManagement";
import { buildTree } from "./EmbeddedFileManagement/EmbeddedFileManagement";
import CreateProductButton from "./shared/CreateProductButton";
import ProjectSelectionModal from "./ProjectSelectionModal/ProjectSelectionModal";
import ProjectChangePopup from "./ProjectSelectionPopup/ProjectSelectionPopup";
// ... (rest of your imports)

import Navbar from "./Navbar";
import FileExplorer from "./FileExplorer";
import "./Flowchart.css";
import Output from "./Output";
import {
  Box,
  Text,
  Button,
  Center,
  Heading,
  InputGroup,
  InputLeftElement,
  Input,
  VStack,
  Stack,
  chakra,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import { ToggleSwitch } from "./Toggle/Toggle";
import { baseURL } from "../utilities";
import CodeDrawer from "./codeDrawer/CodeDrawer";

// Your existing symbols array
const symbolsData = [
  {
    category: "SENSORS ▼",
    items: [
      {
        type: "svg",
        src: SoundAndVibrationsSensor,
        name: "Sound and Vibrations Sensor",
      },
      { type: "svg", src: OpticalSensor, name: "Optical Sensor" },
      { type: "svg", src: EnvironmentalSensor, name: "Environmental Sensor" },
      //  {
      //  type: "svg",
      //  src: ElectricalAndMagneticsSensor,
      //  name: "Electrical and Magnetics Sensor",
      //  },
      {
        type: "svg",
        src: DistanceAndRangeSensor,
        name: "Distance and Range Sensor",
      },
      { type: "svg", src: ChemicalSensor, name: "Chemical Sensor" },
      { type: "svg", src: MotionSensor, name: "Motion Sensor" },
      { type: "svg", src: TouchAndForceSensor, name: "Touch and Force Sensor" },
      { type: "svg", src: TemperatureSensor, name: "Temperature Sensor" },
      { type: "svg", src: Phsensor, name: "pH Sensor" },
      { type: "svg", src: Moisturesensor, name: "Moisture Sensor" },
      { type: "svg", src: Lightsensor, name: "Light Sensor" },
      { type: "svg", src: Irsensor, name: "IR Sensor" },
      { type: "svg", src: Heartbeatsensor, name: "Heartbeat Sensor" },
      { type: "svg", src: Gassensor, name: "Gas Sensor" },
      { type: "svg", src: Airqualitysensor, name: "Air Quality Sensor" },
      { type: "svg", src: Airqualitysensorone, name: "Air Quality Sensor" },
      { type: "svg", src: Accelerometer, name: "Accelerometer" },
      { type: "svg", src: Accelerometerone, name: "Accelerometer" },
    ],
  },
  {
    category: "ACTUATORS ▼",
    items: [
      { type: "svg", src: ServoMotors, name: "Servo Motors" },
      { type: "svg", src: VibrationsMotors, name: "Vibrations Motors" },
      { type: "svg", src: ActuatorsRelay, name: " Relay" },
      { type: "svg", src: powerButtonOff, name: "Power Button" },
      { type: "svg", src: pushButtonOff, name: " Push Button" },
      { type: "svg", src: toggleOff, name: " Toggle Button" },
    ],
  },
  {
    category: "DISPLAY AND INDICATORS ▼",
    items: [
      { type: "svg", src: OledDisplays, name: "OLED Displays" },
      // { type: "svg", src: RGBLights, name: "RGB Lights" },
      { type: "svg", src: Buzzer, name: "Buzzer" },
      { type: "svg", src: Redlight, name: "Redlight" },
      { type: "svg", src: Greenlight, name: "Green Light " },
      { type: "svg", src: Bluelight, name: "Blue Light " },
      { type: "svg", src: RGBLED, name: "RGB LED" },
      // { type: "svg", src: ledBlueOn, name: "Blue LED ON" },
      { type: "svg", src: hooterOff, name: "Hooter" },
    ],
  },
  {
    category: "POWER ▼",
    items: [{ type: "svg", src: PowerSupply, name: "Power Supply" }],
  },
  {
    category: "CONNECTORS ▼",
    items: [
      // { type: "svg", src: Connectors, name: "Connectors" },
      { type: "svg", src: Wire, name: "Wire" },
      { type: "svg", src: RedWire, name: "RedWire" },
      { type: "svg", src: GreenWire, name: "GreenWire" },
      { type: "svg", src: BlackWire, name: "BlackWire" },
      { type: "svg", src: Connectorone, name: "Connector Zone1" },
      { type: "svg", src: Connectortwo, name: "Connector Zone2" },
      { type: "svg", src: Connectorthree, name: "Connector Zone3" },
      { type: "svg", src: Connectorfour, name: "Connector Zone4" },
      { type: "svg", src: Connectorfive, name: "Connector Zone5" },
    ],
  },
  {
    category: "AMPLIFIERS ▼",
    items: [{ type: "svg", src: Amplifier, name: "Amplifier" }],
  },
  {
    category: "MICROCONTROLLERS ▼",
    items: [{ type: "svg", src: Microcontroller, name: "Microcontroller" }],
  },
];

import { useDispatch, useSelector } from "react-redux";
import {
  setTabs,
  addTab,
  closeTab,
  setActiveTab,
  addSymbolToTab,
  updateSymbolInTab,
  removeSymbolFromTab,
  addConnectionToTab,
  setTabSymbolsAndConnections,
  updateTabContent,
  renameTab
} from "../store/slices/simulationSlice";

const BlockDiagram = () => {
  const dispatch = useDispatch();
  const tabs = useSelector((state) => state.simulation.tabs);
  const activeTabId = useSelector((state) => state.simulation.activeTab);

  const activeTab = useMemo(() => tabs.find(t => t.id === activeTabId) || tabs[0], [tabs, activeTabId]);
  const droppedItems = activeTab?.symbols || [];
  const connections = activeTab?.connections || [];

  // Internal simulation tab switching
  const handleSimulationTabClick = useCallback((id) => {
    console.log("🔵 handleSimulationTabClick called with id:", id);
    console.log("Current activeTabId:", activeTabId);
    console.log("All tabs:", tabs);
    dispatch(setActiveTab(id));
    console.log("✅ Dispatched setActiveTab");
  }, [dispatch, activeTabId, tabs]);

  const addNewSimulationTab = () => {
    console.log("🟢 Add Tab clicked");
    const newTabId = Date.now();
    const newTab = {
      id: newTabId,
      name: `Simulation ${tabs.length + 1}`,
      symbols: [],
      connections: [],
      content: "// Simulation code\n",
      dirty: false
    };
    console.log("🟢 Dispatching addTab:", newTab);
    dispatch(addTab(newTab));
    dispatch(setActiveTab(newTabId));
    console.log("✅ Add tab complete");
  };

  const closeSimulationTab = (id, e) => {
    console.log("🔴 closeSimulationTab called with id:", id);
    e?.stopPropagation();
    dispatch(closeTab(id));
    console.log("✅ Close tab complete");
  };

  // Enhanced auto-save for simulation canvas state
  const {
    isSaving: isAutoSaving,
    lastSaveTime: lastAutoSaveTime,
    saveNow: saveSimulationNow,
    scheduleSave: scheduleSimulationSave,
    isLoaded: isAutoSaveLoaded,
  } = useSimulationAutoSave(droppedItems, connections, {
    screenKey: "/simulation",
    autoSaveDelay: 2000,
    priority: 3,
    onSave: (data) => {
      console.log("[Simulation] Auto-saved canvas state:", data);
    },
    onLoad: (loadedData) => {
      console.log("[Simulation] Loading saved canvas state:", loadedData);
      // Restore canvas state from auto-save
      if (loadedData) {
        dispatch(setTabSymbolsAndConnections({
          tabId: activeTabId,
          symbols: loadedData.droppedItems || [],
          connections: loadedData.connections || []
        }));
      }
    },
    onError: (error) => {
      console.error("[Simulation] Auto-save error:", error);
    },
  });

  const { saveAll: saveAllScreens } = useGlobalAutoSave();

  // Save canvas state when droppedItems or connections change
  useEffect(() => {
    if (droppedItems.length > 0 || connections.length > 0) {
      scheduleSimulationSave();
    }
  }, [droppedItems, connections, scheduleSimulationSave]);

  // Save before navigating away
  useEffect(() => {
    const handleBeforeUnload = () => {
      saveSimulationNow();
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        saveSimulationNow();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      // Save when unmounting (navigating away)
      saveSimulationNow();
    };
  }, [saveSimulationNow]);

  // Register simulation canvas save strategy with auto-save manager
  useEffect(() => {
    const saveFunction = () => ({
      droppedItems,
      connections: Array.isArray(connections) ? connections : [],
      timestamp: Date.now(),
      activeTab,
      tabs,
    });

    autoSaveManager.registerSaveStrategy("simulation:canvas", saveFunction, {
      priority: 3,
      skipEmpty: false,
    });

    return () => {
      autoSaveManager.unregisterSaveStrategy("simulation:canvas");
    };
  }, [droppedItems, connections, activeTab, tabs]);

  const [activeSymbol, setActiveSymbol] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);
  const contextMenuRef = useRef(null);
  const [openCategories, setOpenCategories] = useState({}); // Moved here
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarMode, setSidebarMode] = useState("components");
  const navigate = useNavigate();
  const toast = useToast();
  // const [connections, setConnections] = useState(new Set()); // REMOVED - using Redux
  const [sparkEffects, setSparkEffects] = useState([]); // Track active spark animations
  const [rotatingItem, setRotatingItem] = useState(null); // Optimize rotation performance

  const [selectedProject, setSelectedProject] = useState(null);
  const [isProductDefined, setIsProductDefined] = useState(null);
  const [fileSystem, setFileSystem] = useState({});
  const [diagramId, setDiagramId] = useState(null);

  // Tab Renaming State
  const [editingTabId, setEditingTabId] = useState(null);
  const [tempName, setTempName] = useState("");

  const startRenaming = (e, tab) => {
    console.log("🟡 Double click detected for tab:", tab.id, tab.name);
    console.log("Event:", e);
    e.stopPropagation();
    setEditingTabId(tab.id);
    setTempName(tab.name);
    console.log("✅ Editing state set");
  };

  const handleRenameChange = (e) => {
    console.log("🟡 Rename input changed:", e.target.value);
    setTempName(e.target.value);
  };

  const handleRenameSubmit = (e) => {
    console.log("🟡 Key pressed:", e.key);
    if (e.key === 'Enter') {
      console.log("🟡 Enter key detected, finishing rename");
      finishRenaming();
    }
  };

  const finishRenaming = () => {
    console.log("🟡 Finishing renaming. ID:", editingTabId, "New Name:", tempName);
    if (editingTabId && tempName.trim()) {
      console.log("🟡 Dispatching renameTab action");
      dispatch(renameTab({ tabId: editingTabId, newName: tempName.trim() }));
      console.log("✅ Rename dispatched");
    } else {
      console.log("⚠️ No rename - ID or name missing");
    }
    setEditingTabId(null);
    setTempName("");
  };

  // Main Navigation (EditorNavbar) handler
  const handleTabChange = useCallback(
    async (tab) => {
      // Save current simulation state before navigating
      try {
        await saveSimulationNow();
        await saveAllScreens();
        console.log("[Simulation] Saved state before tab change to:", tab);
      } catch (error) {
        console.error("[Simulation] Failed to save before tab change:", error);
      }

      const routes = {
        Simulation: "/simulation",
        Flowchart: "/FlowchartTest",
        "Block Diagram": "/BlockDiagram",
        "Block Programming": "/blockprogramming",
        "Code Editor": "/editor",
      };
      const next = routes[tab];
      if (next) {
        navigate(next);
      }
    },
    [navigate, saveSimulationNow, saveAllScreens],
  );

  const {
    activeProjectName,
    activeProjectId,
    activeProductId,
    activeProductName,

    user,
  } = useProject();
  // start
  // Add this effect to store productID in sessionStorage

  const [isFetched, setIsFetched] = useState(false);
  const lastSavedDiagrams = useRef(null);
  const droppedItemsRef = useRef(droppedItems);

  useEffect(() => {
    droppedItemsRef.current = droppedItems;
  }, [droppedItems]);

  const fetchSimulationDiagrams = useCallback(async () => {
    try {
      if (!activeProductId || !activeProjectId) return;

      const url = `${baseURL}/api/v1/getStoredSimulationDiagramData/${activeProductId}/${activeProjectId}`;
      console.log("Fetching from:", url);

      const response = await axios.get(url);
      console.log("Raw Response:", response.data);

      if (
        response?.data?.data?.length > 0 &&
        Array.isArray(response.data.data[0]?.simulationDiagram)
      ) {
        const fetchedDiagrams = response.data.data[0].simulationDiagram.map(
          (diagram) => ({
            ...diagram,
            id: diagram.id || Date.now() + Math.random(), // Ensure ID exists
            symbol: {
              ...diagram.symbol,
              src: decodeURIComponent(diagram.symbol.src),
            },
            x: Number(diagram.x) || 0,
            y: Number(diagram.y) || 0,
            width: Number(diagram.width) || 120,
            height: Number(diagram.height) || 120,
            rotation: Number(diagram.rotation) || 0,
          }),
        );

        console.log("Decoded simulation diagrams:", fetchedDiagrams);

        // Only dispatch if data is actually different to prevent loops
        if (JSON.stringify(fetchedDiagrams) !== JSON.stringify(droppedItemsRef.current)) {
          dispatch(setTabSymbolsAndConnections({
            tabId: activeTabId,
            symbols: fetchedDiagrams,
            connections: [] // Backend doesn't seem to store connections yet
          }));
        }

        setIsFetched(true);
        lastSavedDiagrams.current = fetchedDiagrams;
      } else {
        console.warn("No simulation diagrams found, initializing empty state.");
        if (droppedItemsRef.current.length > 0) {
          dispatch(setTabSymbolsAndConnections({
            tabId: activeTabId,
            symbols: [],
            connections: []
          }));
        }
        setIsFetched(false);
        lastSavedDiagrams.current = [];
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        console.warn("No stored simulation diagrams yet for this project.");
        if (droppedItemsRef.current.length > 0) {
          dispatch(setTabSymbolsAndConnections({
            tabId: activeTabId,
            symbols: [],
            connections: []
          }));
        }
        setIsFetched(false);
        lastSavedDiagrams.current = [];
        return;
      }
      console.error("Error fetching diagrams:", err);
      // Don't clear state on error unless necessary
      setIsFetched(false);
    }
  }, [activeProductId, activeProjectId, dispatch]);

  // Fetch diagrams when product or project changes
  useEffect(() => {
    if (!activeProductId || !activeProjectId) return;
    fetchSimulationDiagrams();
  }, [activeProductId, activeProjectId, fetchSimulationDiagrams]);

  const saveSimulationDiagram = useCallback(async (data) => {
    try {
      const itemsToSave = data || droppedItemsRef.current;

      if (!activeProductId || !activeProjectId || !user?.userId) return;

      if (!isFetched && (!itemsToSave || itemsToSave.length === 0)) {
        console.warn(
          "Skipping save: Default empty state should not be auto-saved.",
        );
        return;
      }

      // Prevent saving if no changes
      if (JSON.stringify(lastSavedDiagrams.current) === JSON.stringify(itemsToSave)) {
        console.log("No changes detected, skipping save.");
        return;
      }

      const payload = {
        fileORFolderId: activeProjectId,
        productId: activeProductId,
        userId: user.userId,
        simulationDiagram: itemsToSave, // Ensure all diagrams are saved
      };

      console.log("Saving or updating simulation diagram:", payload);

      const fetchUrl = `${baseURL}/api/v1/getStoredSimulationDiagramData/${activeProductId}/${activeProjectId}`;
      let existingDiagramId = null;

      try {
        const response = await axios.get(fetchUrl);
        existingDiagramId = response.data?.data[0]?._id || null;
      } catch (error) {
        if (error.response?.status === 404) {
          console.warn("No existing diagram found, creating a new one.");
        } else {
          console.error("Error checking existing diagram:", error);
          return;
        }
      }

      console.log("DiagramId:", existingDiagramId);

      if (existingDiagramId) {
        const response = await axios.put(
          `${baseURL}/api/v1/updateStoredSimulationDiagramData/${existingDiagramId}`,
          payload,
        );

        console.log(response.data);
        console.log("Simulation diagram updated successfully!");
      } else {
        await axios.post(
          `${baseURL}/api/v1/storeSimulationDiagramData`,
          payload,
        );
        console.log("Simulation diagram saved successfully!");
      }

      // Update last saved reference after successful save
      lastSavedDiagrams.current = itemsToSave;
    } catch (error) {
      console.error("Error saving/updating simulation diagram data:", error);
    }
  }, [activeProductId, activeProjectId, user, isFetched]);

  // Auto-save every 5 seconds if data changes
  // Auto-save every 5 seconds if data changes
  useEffect(() => {
    // Check for changes immediately when droppedItems changes
    const currentItems = droppedItems;
    if (!currentItems || currentItems.length === 0) return;

    if (
      lastSavedDiagrams.current &&
      JSON.stringify(lastSavedDiagrams.current) !== JSON.stringify(currentItems)
    ) {
      saveSimulationDiagram(currentItems);
    }

    const interval = setInterval(() => {
      saveSimulationDiagram(droppedItemsRef.current);
    }, 5000);
    return () => clearInterval(interval);
  }, [droppedItems, saveSimulationDiagram]);

  useEffect(() => {
    try {
      fetchFileSystem(user.userId, setFileSystem, buildTree);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    checkProductDefinition(activeProductId, setIsProductDefined);
  }, [activeProductId]);

  // useEffect(() => {
  //   const savedData = localStorage.getItem("savedDesign");
  //   if (savedData) {
  //     setDroppedItems(JSON.parse(savedData));
  //   }
  // }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Delete" && activeSymbol !== null) {
        const itemToDelete = droppedItems[activeSymbol];
        if (itemToDelete) {
          dispatch(removeSymbolFromTab({ tabId: activeTabId, symbolId: itemToDelete.id }));
        }
        setActiveSymbol(null); // Reset active symbol after deletion
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeSymbol]); // Fix: Added activeSymbol as dependency

  // const newTabId = tabs.length + 1;
  // const newTab = { id: newTabId, name: `Simulation ${newTabId}`, symbols: [] };
  // setTabs([...tabs, newTab]);
  // setActiveTab(newTabId);

  const useClickOutside = (ref, handler) => {
    useEffect(() => {
      const listener = (event) => {
        if (!ref.current || ref.current.contains(event.target)) {
          return;
        }
        handler(event);
      };
      document.addEventListener("mousedown", listener);
      return () => {
        document.removeEventListener("mousedown", listener);
      };
    }, [ref, handler]);
  };

  useClickOutside(contextMenuRef, () => setContextMenu(null));

  const toggleCategory = (category) => {
    setOpenCategories((prev) => ({ ...prev, [category]: !prev[category] }));
  };

  const filteredSymbols = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return symbolsData;

    return symbolsData
      .map((section) => {
        const filteredItems = section.items.filter((item) =>
          item.name.toLowerCase().includes(query),
        );
        return filteredItems.length
          ? { ...section, items: filteredItems }
          : null;
      })
      .filter(Boolean);
  }, [searchQuery, symbolsData]);

  useEffect(() => {
    setOpenCategories((prev) => {
      const next = { ...prev };
      filteredSymbols.forEach((section) => {
        if (searchQuery) {
          next[section.category] = true;
        } else if (next[section.category] === undefined) {
          next[section.category] = true;
        }
      });
      return next;
    });
  }, [filteredSymbols, searchQuery]);

  const handleContextMenu = (e, index) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ x: e.clientX, y: e.clientY, symbolIndex: index });
  };

  const handleDelete = () => {
    if (contextMenu) {
      const symbolToDelete = droppedItems[contextMenu.symbolIndex];
      if (symbolToDelete) {
        dispatch(removeSymbolFromTab({ tabId: activeTabId, symbolId: symbolToDelete.id }));
      }
      setContextMenu(null);
      setActiveSymbol(null);
      alert("Symbol deleted successfully!");
    }
  };

  const SNAP_THRESHOLD = 50; // Distance in pixels to trigger snap

  // Calculate the best snap position
  const calculateSnapPosition = (movedItem, allItems) => {
    let bestX = movedItem.x;
    let bestY = movedItem.y;
    let snapped = false;

    allItems.forEach((item) => {
      if (item.id === movedItem.id) return;

      const centerX1 = movedItem.x + movedItem.width / 2;
      const centerY1 = movedItem.y + movedItem.height / 2;
      const centerX2 = item.x + item.width / 2;
      const centerY2 = item.y + item.height / 2;

      const distance = Math.sqrt(
        Math.pow(centerX2 - centerX1, 2) + Math.pow(centerY2 - centerY1, 2),
      );

      // If close enough, snap to a position that aligns centers or edges
      // For "magnetic" feel, let's pull it towards the other component but keep a small gap or align centers
      // Here we implement a simple "gravity" pull towards the center if within threshold
      if (distance < SNAP_THRESHOLD + 100) {
        // Increased range for "pull"
        // Calculate vector to target
        const dx = centerX2 - centerX1;
        const dy = centerY2 - centerY1;

        // If very close, snap to a fixed distance or align
        // Let's try to align centers if they are somewhat aligned
        if (Math.abs(dx) < SNAP_THRESHOLD) {
          bestX = item.x + item.width / 2 - movedItem.width / 2; // Align vertically
          snapped = true;
        }
        if (Math.abs(dy) < SNAP_THRESHOLD) {
          bestY = item.y + item.height / 2 - movedItem.height / 2; // Align horizontally
          snapped = true;
        }
      }
    });

    return { x: bestX, y: bestY, snapped };
  };

  // Check if two components are close enough to be considered "connected"
  const checkProximity = (item1, item2, threshold = 150) => {
    // Increased threshold
    const centerX1 = item1.x + item1.width / 2;
    const centerY1 = item1.y + item1.height / 2;
    const centerX2 = item2.x + item2.width / 2;
    const centerY2 = item2.y + item2.height / 2;

    const distance = Math.sqrt(
      Math.pow(centerX2 - centerX1, 2) + Math.pow(centerY2 - centerY1, 2),
    );

    return distance <= threshold;
  };

  // Handle connection detection and notification
  // Handle connection detection and notification
  const handleConnectionDetection = (movedItem) => {
    console.log("🔍 Checking connections for component:", movedItem.id);
    console.log("Current position:", { x: movedItem.x, y: movedItem.y });
    console.log("Total components:", droppedItems.length);

    droppedItems.forEach((item) => {
      if (item.id === movedItem.id) return; // Skip self

      const distance = Math.sqrt(
        Math.pow(
          item.x + item.width / 2 - (movedItem.x + movedItem.width / 2),
          2,
        ) +
        Math.pow(
          item.y + item.height / 2 - (movedItem.y + movedItem.height / 2),
          2,
        ),
      );

      console.log(`Distance to component ${item.id}:`, distance);

      if (checkProximity(movedItem, item)) {
        // Create a consistent key based on sorted IDs
        const connectionKey = [movedItem.id, item.id].sort().join("-");
        console.log("✅ Connection detected within proximity!", connectionKey);

        // Check if connection exists in Redux state (passed via props/selector)
        // connections is array of strings (connectionKeys)
        const exists = connections.includes(connectionKey);

        if (!exists) {
          console.log("🎉 New connection! Dispatching addConnection...");
          dispatch(addConnectionToTab({ tabId: activeTabId, connection: connectionKey }));

          // Calculate connection point (midpoint between components)
          const connectionX =
            (movedItem.x + movedItem.width / 2 + item.x + item.width / 2) / 2;
          const connectionY =
            (movedItem.y + movedItem.height / 2 + item.y + item.height / 2) / 2;

          // Create spark effect
          const sparkId = Date.now();
          setSparkEffects((prev) => [
            ...prev,
            { id: sparkId, x: connectionX, y: connectionY },
          ]);

          // Remove spark after animation (500ms)
          setTimeout(() => {
            setSparkEffects((prev) => prev.filter((s) => s.id !== sparkId));
          }, 500);

          try {
            // Play connection sound
            const audio = new Audio(
              "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2S57OihUQwOVqzn77BdGAg+ltv1xnMoBSh+zPLaizsKGGGy6OyrYBgINZXX9Mp5LQUohM/y3I4+CxVitOvtrGEaBkCY3PLJdysGKoLO8tuJNggTYbjs6qZTEAhMouDwumkkBSR4yPDck0MLHGW66+yjWBUIQ5zh8sNuIQUofcry2Ig0BhFYrOjuqF4YBzaU2PTJeiwGKIHN8t2LPAoVXrTq7qxgGQg4lNn0zHosBSaAy/DblUAOF2S36+yjVxUIRJ3h8sFuIAQnfsny2Yk3BxNWq+fuqF4WAzWS1vPKeS0GJ4DN8tz",
            );
            audio.volume = 0.5;
            const playPromise = audio.play();
            if (playPromise !== undefined) {
              playPromise.catch(e => {
                console.warn("Audio play failed (autoplay policy?):", e);
              });
            }
          } catch (e) {
            console.error("Audio setup failed:", e);
          }

          // Show toast notification
          console.log("Showing toast for connection");
          toast({
            title: "⚡ Components Connected!",
            description: `${movedItem.symbol.name} ↔ ${item.symbol.name}`,
            status: "success",
            duration: 3000,
            isClosable: true,
            position: "top",
          });
        } else {
          console.log("Connection already exists in state:", connectionKey);
        }
      }
    });
  };

  const handleSaveDesign = () => {
    localStorage.setItem("savedDesign", JSON.stringify(droppedItems));
    alert("Design saved successfully!");
  };

  const handleLoadDesign = () => {
    const savedData = localStorage.getItem("savedDesign");
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      dispatch(
        setTabSymbolsAndConnections({
          tabId: activeTabId,
          symbols: parsedData.map((item) => ({
            ...item,
            x: item.x || 100,
            y: item.y || 100,
            width: item.width || 120,
            height: item.height || 120,
            rotation: item.rotation || 0,
          })),
          connections: [] // Assume no connections in manual load for now or update if stored
        }),
      );
      alert("Design loaded successfully!");
    } else {
      alert("No saved design found.");
    }
  };

  const SymbolItem = ({ symbol }) => {
    const [, drag] = useDrag(() => ({
      type: "symbol",
      item: { symbol },
    }));
    return (
      <chakra.button
        ref={drag}
        display="flex"
        alignItems="center"
        gap={3}
        w="100%"
        p={3}
        borderRadius="lg"
        bg="rgba(39,55,77,0.35)"
        border="1px solid rgba(221,230,237,0.2)"
        boxShadow="0 10px 20px rgba(39,55,77,0.35)"
        _hover={{ bg: "rgba(221,230,237,0.2)", transform: "translateY(-2px)" }}
        transition="all 0.2s ease"
        cursor="grab"
        textAlign="left"
      >
        <Box
          w="48px"
          h="48px"
          borderRadius="lg"
          bg="rgba(39,55,77,0.6)"
          display="grid"
          placeItems="center"
          flexShrink={0}
        >
          <img
            src={symbol.src}
            alt={symbol.name}
            style={{ width: "32px", height: "32px" }}
          />
        </Box>
        <Text fontSize="sm" fontWeight="600" color="#DDE6ED" noOfLines={2}>
          {symbol.name}
        </Text>
      </chakra.button>
    );
  };

  const Canvas = () => {
    const [, drop] = useDrop(
      () => ({
        accept: "symbol",
        drop: (item, monitor) => {
          const offset = monitor.getClientOffset();
          if (item && item.symbol && offset) {
            const newSymbol = {
              symbol: item.symbol,
              x: offset.x - 100,
              y: offset.y - 100,
              width: 120,
              height: 120,
              rotation: 0,
              id: Date.now() + Math.random(),
            };
            dispatch(addSymbolToTab({ tabId: activeTabId, symbol: newSymbol }));
            setActiveSymbol(droppedItems.length);
          }
        },
      }),
      [droppedItems],
    );

    const handleRotateStart = (index, event) => {
      event.preventDefault();
      event.stopPropagation();

      const symbol = droppedItems[index];
      const centerX = symbol.x + symbol.width / 2;
      const centerY = symbol.y + symbol.height / 2;
      const startX = event.clientX;
      const startY = event.clientY;
      const startRotation = symbol.rotation || 0;

      let startAngle =
        Math.atan2(startY - centerY, startX - centerX) * (180 / Math.PI);

      const handleMouseMove = (e) => {
        const currentX = e.clientX;
        const currentY = e.clientY;
        const newAngle =
          Math.atan2(currentY - centerY, currentX - centerX) * (180 / Math.PI);

        const angleChange = newAngle - startAngle;
        const newRotation = startRotation + angleChange;

        setRotatingItem({ index, rotation: newRotation });
      };

      const handleMouseUp = (e) => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);

        // Dispatch final rotation
        // We need to calculate the final rotation again or use the last state?
        // Better to recalculate or just use the last known if we had a ref.
        // But since we are in a closure, we can just recalculate one last time or use the setRotatingItem value?
        // Actually, let's just recalculate to be safe and clean.

        const currentX = e.clientX;
        const currentY = e.clientY;
        const newAngle =
          Math.atan2(currentY - centerY, currentX - centerX) * (180 / Math.PI);
        const angleChange = newAngle - startAngle;

        dispatch(
          updateSymbolInTab({
            tabId: activeTabId,
            symbolId: symbol.id,
            updates: { rotation: startRotation + angleChange },
          }),
        );
        setRotatingItem(null);
      };

      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    };

    const handleResizeStop = (index, _dir, ref, delta, position) => {
      const item = droppedItems[index];
      if (item) {
        dispatch(
          updateSymbolInTab({
            tabId: activeTabId,
            symbolId: item.id,
            updates: {
              width: ref.offsetWidth,
              height: ref.offsetHeight,
              x: position.x,
              y: position.y,
            },
          }),
        );
      }
    };

    const handleSelect = (index) => {
      setActiveSymbol(index);
    };

    return (
      <>
        <style>
          {`
          @keyframes spark-scale {
            0% { transform: scale(0); opacity: 1; }
            100% { transform: scale(1.5); opacity: 0; }
          }
          @keyframes sparkPulse {
            0% { transform: scale(0); opacity: 1; }
            50% { opacity: 1; }
            100% { transform: scale(1.5); opacity: 0; }
          }
          @keyframes sparkExpand {
            0% { transform: scale(0); opacity: 1; }
            100% { transform: scale(2); opacity: 0; }
          }
          @keyframes sparkRotate {
            0% { transform: translate(-50%, -50%) rotate(0deg) scale(0); opacity: 0; }
            50% { opacity: 1; transform: translate(-50%, -50%) rotate(180deg) scale(1.2); }
            100% { transform: translate(-50%, -50%) rotate(360deg) scale(0); opacity: 0; }
          }
        `}
        </style>
        <div
          ref={drop}
          className="canvas-placeholder"
          style={{
            width: "100%",
            height: "100vh",
            position: "relative",
            backgroundColor: "white",
          }}
          onClick={() => setActiveSymbol(null)} // Deselects when clicking outside
        >
          {/* Connection Lines Layer */}
          <svg
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              pointerEvents: "none", // Allow clicks to pass through to canvas/items
              zIndex: 0,
            }}
          >
            {connections.map((connKey) => {
              const [id1, id2] = connKey.split("-");
              // IDs are stored as strings in connection key, but might be numbers in items
              // Convert to string for comparison or just use loose equality if safe, but explicit is better.
              const item1 = droppedItems.find((i) => String(i.id) === id1);
              const item2 = droppedItems.find((i) => String(i.id) === id2);

              if (item1 && item2) {
                return (
                  <line
                    key={connKey}
                    x1={item1.x + item1.width / 2}
                    y1={item1.y + item1.height / 2}
                    x2={item2.x + item2.width / 2}
                    y2={item2.y + item2.height / 2}
                    stroke="black"
                    strokeWidth="2"
                    strokeDasharray="5,5" // Optional: dashed line
                  />
                );
              }
              return null;
            })}
          </svg>

          {/* Spark Effects Layer */}
          {sparkEffects.map((spark) => (
            <div
              key={spark.id}
              style={{
                position: "absolute",
                left: spark.x,
                top: spark.y,
                transform: "translate(-50%, -50%)",
                pointerEvents: "none",
                zIndex: 1000,
              }}
            >
              <div
                className="spark-animation"
                style={{
                  width: "40px",
                  height: "40px",
                  background:
                    "radial-gradient(circle, rgba(255,255,0,1) 0%, rgba(255,165,0,0) 70%)",
                  borderRadius: "50%",
                  animation: "spark-scale 0.5s ease-out forwards",
                }}
              />
            </div>
          ))}

          {droppedItems.map((item, index) => (
            <Rnd
              key={index}
              position={{ x: item.x, y: item.y }}
              size={{ width: item.width, height: item.height }}
              enableResizing={activeSymbol === index}
              disableDragging={false}
              onClick={(e) => {
                e.stopPropagation();
                handleSelect(index);
              }}
              onMouseDown={(e) => {
                e.stopPropagation();
                handleSelect(index);
              }}
              onResizeStop={(e, dir, ref, delta, position) =>
                handleResizeStop(index, dir, ref, delta, position)
              }
              onDragStop={(e, d) => {
                const item = droppedItems[index];
                if (item) {
                  // Calculate snapped position
                  const currentItem = { ...item, x: d.x, y: d.y };
                  const {
                    x: snappedX,
                    y: snappedY,
                    snapped,
                  } = calculateSnapPosition(currentItem, droppedItems);

                  const finalX = snapped ? snappedX : d.x;
                  const finalY = snapped ? snappedY : d.y;

                  const updatedItem = { ...item, x: finalX, y: finalY };

                  dispatch(
                    updateSymbolInTab({
                      tabId: activeTabId,
                      symbolId: item.id,
                      updates: { x: finalX, y: finalY },
                    }),
                  );

                  // Check for connections after drag (using final position)
                  handleConnectionDetection(updatedItem);
                }
              }}
              style={{
                transform: `rotate(${rotatingItem?.index === index ? rotatingItem.rotation : item.rotation}deg)`,
                transformOrigin: "center",
                border: activeSymbol === index ? "2px dashed blue" : "none",
                position: "absolute",
                cursor: "move",
              }}
              onContextMenu={(e) => handleContextMenu(e, index)}
            >
              <div
                style={{ position: "relative", width: "100%", height: "100%" }}
              >
                <Tooltip
                  label={item.symbol.name}
                  placement="top"
                  hasArrow
                  bg="gray.700"
                  color="white"
                  fontSize="sm"
                  px={3}
                  py={2}
                  borderRadius="md"
                >
                  <img
                    src={item.symbol.src}
                    alt={item.symbol.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      pointerEvents: "all",
                      transform: `rotate(${item.rotation}deg)`,
                    }}
                  />
                </Tooltip>
                {activeSymbol === index && (
                  <div
                    className="rotate-handle"
                    style={{
                      position: "absolute",
                      top: "-25px", // Move slightly higher for better reach
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: "30px", // Increase handle size
                      height: "30px",
                      background: "rgba(0, 0, 255, 0.7)", // Slight transparency for better visibility
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor:
                        "url('https://upload.wikimedia.org/wikipedia/commons/0/02/Rotate_cursor.svg'), auto", // Custom rotation cursor
                      transition: "transform 0.2s ease-in-out",
                    }}
                    onMouseDown={(e) => {
                      e.target.style.cursor = "grabbing"; // Change cursor on click
                      handleRotateStart(index, e);
                    }}
                    onMouseUp={(e) => {
                      e.target.style.cursor =
                        "url('https://upload.wikimedia.org/wikipedia/commons/0/02/Rotate_cursor.svg'), auto";
                    }}
                  >
                    🔄 {/* Unicode icon for rotation visual cue */}
                  </div>
                )}
                {/* Size display overlay */}
                {activeSymbol === index && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: "-35px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      background: "rgba(0, 0, 0, 0.8)",
                      color: "white",
                      padding: "4px 12px",
                      borderRadius: "4px",
                      fontSize: "12px",
                      fontWeight: "600",
                      whiteSpace: "nowrap",
                      pointerEvents: "none",
                      zIndex: 1000,
                    }}
                  >
                    {Math.round(item.width)} × {Math.round(item.height)} px
                  </div>
                )}
              </div>
            </Rnd>
          ))}

          {/* Spark effects */}
          {sparkEffects.map((spark) => (
            <div
              key={spark.id}
              style={{
                position: "absolute",
                left: spark.x,
                top: spark.y,
                width: "60px",
                height: "60px",
                transform: "translate(-50%, -50%)",
                pointerEvents: "none",
                zIndex: 9999,
              }}
            >
              {/* Spark animation */}
              <div
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                  background:
                    "radial-gradient(circle, #FFD700 0%, #FFA500 30%, transparent 70%)",
                  animation: "sparkPulse 0.5s ease-out",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                  background:
                    "radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,215,0,0.5) 40%, transparent 70%)",
                  animation: "sparkExpand 0.5s ease-out",
                }}
              />
              {/* Lightning bolt emoji */}
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  fontSize: "32px",
                  animation: "sparkRotate 0.5s ease-out",
                }}
              >
                ⚡
              </div>
            </div>
          ))}

          {contextMenu && (
            <div
              ref={contextMenuRef}
              className="context-menu"
              style={{
                position: "fixed",
                top: contextMenu.y,
                left: contextMenu.x,
              }}
            >
              <button onClick={handleDelete} className="delete-button">
                <FiTrash size={16} /> Delete
              </button>
            </div>
          )}
        </div>
      </>
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flowchart-container">
        <EditorNavbar activeTab="Simulation" onTabChange={handleTabChange} />
        <div
          className="top-controls"

        // style={{ paddingTop: "1px", alignItems: "center" }}
        >
          <Box display="flex" justifyContent="flex-end" width={"100%"} gap={4}>
            {/* {selectedProject?.name && (
              <ProjectChangePopup
                selectedProject={selectedProject}
                onProjectChange={setSelectedProject}
                fileSystem={fileSystem}
              />
            )} */}
          </Box>

          {/* <Box display={"flex"} gap={4}> */}
          {/* <Button
              size="sm"
              width="auto"
              colorScheme="teal"
              onClick={handleSaveDesign}
            >
              Save Design
            </Button> */}
          {/* <Button
              size="sm"
              width="auto"
              colorScheme="teal"
              onClick={handleLoadDesign}
            >
              Load Design
            </Button> */}
          {/* </Box> */}

          <Box display="flex" alignItems="center" gap={3} justifyContent="flex-end" width="100%">
            <SimulationOne />

            <SimulationPopup>
              <Button
                size="sm"
                colorScheme="teal"
                borderRadius="full"
                height="32px"
                px={6}
                className="control-button"
              >
                Code
              </Button>
            </SimulationPopup>

            <Button
              width="auto"
              colorScheme="teal"
              size="sm"
              borderRadius="full"
              height="32px"
              px={6}
              onClick={() => navigate("/view-data")}
            >
              View Data
            </Button>
            <CreateProductButton />
          </Box>
        </div>

        <div className="main-content">
          <div className="sidebar">
            <Box
              display="flex"
              flexDirection="column"
              px={4}
              py={6}
              h="100%"
              bg="#27374D"
              gap={5}
            >
              <Stack direction="row" spacing={2}>
                <chakra.button
                  onClick={() => setSidebarMode("explorer")}
                  flex="1"
                  py={2}
                  borderRadius="md"
                  fontWeight="600"
                  fontSize="sm"
                  letterSpacing="0.05em"
                  textTransform="uppercase"
                  color={sidebarMode === "explorer" ? "#27374D" : "#DDE6ED"}
                  bg={
                    sidebarMode === "explorer"
                      ? "#DDE6ED"
                      : "rgba(221,230,237,0.12)"
                  }
                  border="1px solid rgba(221,230,237,0.24)"
                  transition="all 0.2s ease"
                  _hover={{
                    bg:
                      sidebarMode === "explorer"
                        ? "#B0C4D8"
                        : "rgba(221,230,237,0.2)",
                  }}
                >
                  Explorer
                </chakra.button>
                <chakra.button
                  onClick={() => setSidebarMode("components")}
                  flex="1"
                  py={2}
                  borderRadius="md"
                  fontWeight="600"
                  fontSize="sm"
                  letterSpacing="0.05em"
                  textTransform="uppercase"
                  color={sidebarMode === "components" ? "#27374D" : "#DDE6ED"}
                  bg={
                    sidebarMode === "components"
                      ? "#DDE6ED"
                      : "rgba(221,230,237,0.12)"
                  }
                  border="1px solid rgba(221,230,237,0.24)"
                  transition="all 0.2s ease"
                  _hover={{
                    bg:
                      sidebarMode === "components"
                        ? "#B0C4D8"
                        : "rgba(221,230,237,0.2)",
                  }}
                >
                  Components
                </chakra.button>
              </Stack>

              {sidebarMode === "explorer" ? (
                <Box
                  flex="1"
                  overflowY="auto"
                  borderRadius="lg"
                  border="1px solid rgba(221,230,237,0.22)"
                  bg="rgba(39,55,77,0.35)"
                  px={3}
                  py={4}
                >
                  <FileExplorer variant="diagram" />
                </Box>
              ) : (
                <Box flex="1" display="flex" flexDirection="column" gap={4}>
                  <InputGroup size="sm">
                    <InputLeftElement pointerEvents="none">
                      <FaSearch color="rgba(221,230,237,0.7)" />
                    </InputLeftElement>
                    <Input
                      type="text"
                      placeholder="Search sensors, actuators..."
                      value={searchQuery}
                      onChange={(event) => setSearchQuery(event.target.value)}
                      borderRadius="full"
                      border="1px solid rgba(221,230,237,0.3)"
                      bg="rgba(39,55,77,0.35)"
                      color="#DDE6ED"
                      _placeholder={{ color: "rgba(221,230,237,0.7)" }}
                      _focus={{
                        borderColor: "#9DB2BF",
                        boxShadow: "0 0 0 1px #9DB2BF",
                      }}
                    />
                  </InputGroup>

                  <VStack
                    align="stretch"
                    spacing={5}
                    overflowY="auto"
                    className="symbol-grid"
                  >
                    {filteredSymbols.length === 0 ? (
                      <Center py={12}>
                        <Text color="rgba(221,230,237,0.7)">
                          No components found.
                        </Text>
                      </Center>
                    ) : (
                      filteredSymbols.map((section, sectionIndex) => (
                        <Box key={sectionIndex} className="symbol-section">
                          <chakra.button
                            onClick={() => toggleCategory(section.category)}
                            display="flex"
                            alignItems="center"
                            justifyContent="space-between"
                            width="100%"
                            px={3}
                            py={2}
                            borderRadius="md"
                            bg="rgba(39,55,77,0.35)"
                            border="1px solid rgba(221,230,237,0.2)"
                            color="#DDE6ED"
                            fontSize="xs"
                            fontWeight="700"
                            letterSpacing="0.08em"
                            textTransform="uppercase"
                            transition="all 0.2s ease"
                            _hover={{ bg: "rgba(221,230,237,0.2)" }}
                          >
                            {section.category.replace(" ▼", "")}
                            <Text fontSize="sm" color="rgba(221,230,237,0.75)">
                              {openCategories[section.category] ? "▲" : "▼"}
                            </Text>
                          </chakra.button>

                          {openCategories[section.category] && (
                            <Stack
                              mt={3}
                              spacing={3}
                              pl={1}
                              borderLeft="1px solid rgba(221,230,237,0.25)"
                              className="symbol-items"
                            >
                              {section.items.map((symbol, symbolIndex) => (
                                <SymbolItem key={symbolIndex} symbol={symbol} />
                              ))}
                            </Stack>
                          )}
                        </Box>
                      ))
                    )}
                  </VStack>
                </Box>
              )}
            </Box>
          </div>
          <div className="main-area">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: "#27374D",
                padding: "8px",
                borderRadius: "8px",
                marginBottom: "10px",
                border: "1px solid rgba(221,230,237,0.2)",
                position: "relative",
                zIndex: 1000,
                pointerEvents: "auto"
              }}
            >
              <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', flex: 1, position: 'relative', zIndex: 1001, pointerEvents: 'auto' }}>
                {tabs.map((tab) => (
                  <div
                    key={tab.id}
                    onClick={(e) => {
                      console.log("🎯 TAB CLICKED! Event:", e);
                      e.stopPropagation();
                      handleSimulationTabClick(tab.id);
                    }}
                    onDoubleClick={(e) => {
                      console.log("🎯 TAB DOUBLE-CLICKED! Event:", e);
                      startRenaming(e, tab);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      backgroundColor: activeTabId === tab.id ? '#DDE6ED' : 'rgba(221,230,237,0.1)',
                      color: activeTabId === tab.id ? '#27374D' : '#DDE6ED',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: '600',
                      transition: 'all 0.2s ease',
                      border: '1px solid rgba(221,230,237,0.2)',
                      whiteSpace: 'nowrap',
                      minWidth: '120px',
                      userSelect: 'none',
                      position: 'relative',
                      zIndex: 1002,
                      pointerEvents: 'auto'
                    }}
                  >
                    {editingTabId === tab.id ? (
                      <input
                        type="text"
                        value={tempName}
                        onChange={handleRenameChange}
                        onBlur={finishRenaming}
                        onKeyDown={handleRenameSubmit}
                        autoFocus
                        style={{
                          background: '#ffffff',
                          color: '#000000',
                          border: '1px solid #3182ce',
                          borderRadius: '4px',
                          outline: 'none',
                          width: '100px',
                          padding: '2px 4px',
                          fontSize: '12px'
                        }}
                        onClick={(e) => e.stopPropagation()}
                        onDoubleClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <span style={{ marginRight: '8px', flex: 1 }}>{tab.name}</span>
                    )}

                    {!editingTabId && (
                      <Box
                        as="span"
                        onClick={(e) => closeSimulationTab(tab.id, e)}
                        _hover={{ color: '#ef4444', bg: 'rgba(0,0,0,0.1)', borderRadius: '50%' }}
                        style={{ marginLeft: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '2px' }}
                      >
                        ×
                      </Box>
                    )}
                  </div>
                ))}
                <Button
                  size="xs"
                  variant="solid" // Changed to solid for visibility
                  colorScheme="blue" // Distinct color
                  onClick={(e) => {
                    e.stopPropagation();
                    addNewSimulationTab();
                  }}
                  sx={{
                    minWidth: '80px',
                    height: '28px',
                    fontSize: '12px',
                    cursor: 'pointer',
                    zIndex: 10
                  }}
                >
                  + Add Tab
                </Button>
              </div>
            </div>

            {activeProjectName && (
              <Box mt={4}>
                <Center>
                  <Heading size={"md"}>{activeProjectName}</Heading>
                </Center>
              </Box>
            )}
            {/*
            {!selectedProject?.name && (
              <ProjectSelectionModal
                onProjectSelect={setSelectedProject}
                fileSystem={fileSystem}
              />
            )} */}

            <Canvas />
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

export default BlockDiagram;
