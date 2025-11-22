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
//         };
//         setTabs((prevTabs) =>
//           prevTabs.map((tab) =>
//             tab.id === activeTab
//               ? { ...tab, symbols: [...tab.symbols, newSymbol] }
//               : tab
//           )
//         );
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

import React, { useState, useEffect, useRef } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Rnd } from "react-rnd";
import { Maximize, ZoomIn, ZoomOut, ArrowLeft, ArrowRight } from "lucide-react";
import { FiTrash } from "react-icons/fi";
import { InputGroup, InputLeftElement, Input } from "@chakra-ui/react";
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

import Navbarone from "./Navbarone";
import { useProject } from "../ProjectContext";
import { checkProductDefinition } from "./EmbeddedFileManagement/EmbeddedFileManagement";
import CreateProductDefintionModal from "./Product/ProductDefinitionModal/CreateProductDefintionModal";
import { fetchFileSystem } from "./EmbeddedFileManagement/EmbeddedFileManagement";
import ProductEditModal from "./Product/ProductEdit/ProductEditModal";
import { buildTree } from "./EmbeddedFileManagement/EmbeddedFileManagement";
import ProjectSelectionModal from "./ProjectSelectionModal/ProjectSelectionModal";
import ProjectChangePopup from "./ProjectSelectionPopup/ProjectSelectionPopup";
// ... (rest of your imports)

import Navbar from "./Navbar";
import Footer from "./Footer";
import "./Flowchart.css";
import Output from "./Output";
import { Box, Text, Button, Center, Heading } from "@chakra-ui/react";
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

const BlockDiagram = () => {
  const [droppedItems, setDroppedItems] = useState([]);
  const [activeSymbol, setActiveSymbol] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);
  const contextMenuRef = useRef(null);
  const [tabs, setTabs] = useState([]);
  const [activeTab, setActiveTab] = useState(1);
  const [openCategories, setOpenCategories] = useState({}); // Moved here
  const MAX_TABS = 5;
  const navigate = useNavigate();

  const [selectedProject, setSelectedProject] = useState(null);
  const [isProductDefined, setIsProductDefined] = useState(null);
  const [fileSystem, setFileSystem] = useState({});
  const [diagramId, setDiagramId] = useState(null);

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

  const fetchSimulationDiagrams = async () => {
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
            symbol: {
              ...diagram.symbol,
              src: decodeURIComponent(diagram.symbol.src),
            },
          })
        );

        console.log("Decoded simulation diagrams:", fetchedDiagrams);

        // Ensure all diagrams are retrieved and replace existing state
        setDroppedItems(fetchedDiagrams);

        setIsFetched(true);
        lastSavedDiagrams.current = fetchedDiagrams;
      } else {
        console.warn("No simulation diagrams found, initializing empty state.");
        setDroppedItems([]);
        setIsFetched(false);
        lastSavedDiagrams.current = [];
      }
    } catch (err) {
      console.error("Error fetching diagrams:", err);
      setDroppedItems([]);
      setIsFetched(false);
      lastSavedDiagrams.current = [];
    }
  };

  // Fetch diagrams when product or project changes
  useEffect(() => {
    if (!activeProductId || !activeProjectId) return;
    fetchSimulationDiagrams();
  }, [activeProductId, activeProjectId]);

  const saveSimulationDiagram = async (data = droppedItems) => {
    try {
      if (!activeProductId || !activeProjectId || !user?.userId) return;

      if (!isFetched && data.length === 0) {
        console.warn(
          "Skipping save: Default empty state should not be auto-saved."
        );
        return;
      }

      // Prevent saving if no changes
      if (JSON.stringify(lastSavedDiagrams.current) === JSON.stringify(data)) {
        console.log("No changes detected, skipping save.");
        return;
      }

      const payload = {
        fileORFolderId: activeProjectId,
        productId: activeProductId,
        userId: user.userId,
        simulationDiagram: data, // Ensure all diagrams are saved
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
          payload
        );

        console.log(response.data);
        console.log("Simulation diagram updated successfully!");
      } else {
        await axios.post(
          `${baseURL}/api/v1/storeSimulationDiagramData`,
          payload
        );
        console.log("Simulation diagram saved successfully!");
      }

      // Update last saved reference after successful save
      lastSavedDiagrams.current = data;
    } catch (error) {
      console.error("Error saving/updating simulation diagram data:", error);
    }
  };

  // Auto-save every 5 seconds if data changes
  useEffect(() => {
    if (!droppedItems || droppedItems.length === 0) return;

    if (
      JSON.stringify(lastSavedDiagrams.current) !== JSON.stringify(droppedItems)
    ) {
      saveSimulationDiagram();
    }

    const interval = setInterval(() => saveSimulationDiagram(), 5000);
    return () => clearInterval(interval);
  }, [droppedItems]);

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
        setDroppedItems((prev) =>
          prev.filter((_, index) => index !== activeSymbol)
        );
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

  const handleContextMenu = (e, index) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ x: e.clientX, y: e.clientY, symbolIndex: index });
  };

  const handleDelete = () => {
    if (contextMenu) {
      setDroppedItems((items) =>
        items.filter((_, index) => index !== contextMenu.symbolIndex)
      );
      setContextMenu(null);
      setActiveSymbol(null);
      alert("Symbol deleted successfully!");
    }
  };

  const handleSaveDesign = () => {
    localStorage.setItem("savedDesign", JSON.stringify(droppedItems));
    alert("Design saved successfully!");
  };

  const handleLoadDesign = () => {
    const savedData = localStorage.getItem("savedDesign");
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setDroppedItems(
        parsedData.map((item) => ({
          ...item,
          x: item.x || 100, // Preserve original x-position
          y: item.y || 100, // Preserve original y-position
          width: item.width || 120, // Preserve width
          height: item.height || 120, // Preserve height
          rotation: item.rotation || 0, // Preserve rotation
        }))
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
      <button
        ref={drag}
        className="symbol-button"
        style={{ cursor: "grab", height: "140px", width: "140px" }}
      >
        <img src={symbol.src} alt={symbol.name} className="svg-icon" />
        <div style={{ marginTop: "4px", fontSize: "18px", color: "white" }}>
          {symbol.name}
        </div>
      </button>
    );
  };

  const Canvas = () => {
    const [, drop] = useDrop(() => ({
      accept: "symbol",
      drop: (item, monitor) => {
        const offset = monitor.getClientOffset();
        if (item && item.symbol && offset) {
          setDroppedItems((prev) => {
            const newSymbol = {
              symbol: item.symbol,
              x: offset.x - 100,
              y: offset.y - 100,
              width: 120,
              height: 120,
              rotation: 0,
            };
            return [...prev, newSymbol];
          });
        }
      },
    }));

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

        setDroppedItems((prev) =>
          prev.map((item, i) =>
            i === index
              ? { ...item, rotation: startRotation + angleChange }
              : item
          )
        );
      };

      const handleMouseUp = () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };

      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    };

    const handleResizeStop = (index, _dir, ref, delta, position) => {
      setDroppedItems((prev) =>
        prev.map((item, i) =>
          i === index
            ? {
                ...item,
                width: parseFloat(ref.style.width), // Ensure width is updated
                height: parseFloat(ref.style.height), // Ensure height is updated
                x: position.x,
                y: position.y,
              }
            : item
        )
      );
    };

    const handleSelect = (index) => {
      setActiveSymbol(index);
    };

    return (
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
              setDroppedItems((prev) =>
                prev.map((item, i) =>
                  i === index ? { ...item, x: d.x, y: d.y } : item
                )
              );
            }}
            style={{
              transform: `rotate(${item.rotation}deg)`,
              transformOrigin: "center",
              border: activeSymbol === index ? "2px dashed blue" : "none",
              position: "absolute",
              cursor: "move",
            }}
          >
            <div
              style={{ position: "relative", width: "100%", height: "100%" }}
            >
              <img
                src={item.symbol.src}
                alt={item.symbol.name}
                style={{
                  width: "100%",
                  height: "100%",
                  pointerEvents: "none",
                  transform: `rotate(${item.rotation}deg)`,
                }}
              />
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
            </div>
          </Rnd>
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
    );
  };
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flowchart-container">
        <Navbarone />
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
            {isProductDefined ? (
              <ProductEditModal
                setIsProductDefined={setIsProductDefined}
                productID={activeProductId}
                productName={activeProjectName}
                fetchFileSystem={() =>
                  fetchFileSystem(user?.userId, setFileSystem, buildTree)
                }
              />
            ) : (
              <CreateProductDefintionModal
                setIsProductDefined={setIsProductDefined}
                productID={activeProductId}
                productName={activeProjectName}
                fetchFileSystem={() =>
                  fetchFileSystem(user?.userId, setFileSystem, buildTree)
                }
              />
            )}
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

          <div>
            <SimulationOne />
          </div>
          {/* <button className="control-button">
 <FiTrash size={25} />
 </button>
 <button className="control-button">
 <Maximize size={25} />
 </button>
 <button className="control-button">
 <ZoomIn size={25} />
 </button>
 <button className="control-button">
 <ZoomOut size={25} />
 </button>
 <button className="control-button">
 <ArrowLeft size={25} />
 </button>
 <button className="control-button">
 <ArrowRight size={25} />
 </button> */}

          <Box display={"flex"} gap={4}>
            <SimulationPopup>
              <Button size={"sm"} colorScheme="teal" className="control-button">
                Code
              </Button>
            </SimulationPopup>

            {/* <CodeDrawer /> */}

            <Button
              width={"auto"}
              colorScheme="teal"
              size="sm"
              onClick={() => navigate("/view-data")}
            >
              View Data
            </Button>
          </Box>
        </div>

        <div className="main-content">
          <div className="sidebar">
            <div className="symbol-grid">
              {/* start */}
              <div
                className="top-buttons"
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "10px",
                  alignItems: "center",
                  marginBottom: "20px",
                }}
              ></div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "10px 14px", // Increased padding for better spacing
                }}
              >
                {/* SEARCH BOX OPEN */}
                <InputGroup size="sm">
                  <InputLeftElement
                    pointerEvents="none"
                    children={<FaSearch color="gray.400" />}
                  />
                  <Input
                    type="text"
                    placeholder="Search..."
                    borderRadius="md"
                    borderColor="gray.300"
                  />
                </InputGroup>
                {/* SEARCH BOX CLOSE */}
              </div>

              {/* end */}
              {symbolsData.map((section, sectionIndex) => (
                <div key={sectionIndex} className="symbol-section">
                  <h3
                    onClick={() => toggleCategory(section.category)}
                    style={{ cursor: "pointer" }}
                  >
                    {section.category}
                  </h3>
                  {openCategories[section.category] && (
                    <div
                      className="symbol-items"
                      style={{ borderLeft: "1px solid white" }}
                    >
                      {section.items.map((symbol, symbolIndex) => (
                        <SymbolItem key={symbolIndex} symbol={symbol} />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="main-area">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "#0f0a19",
                padding: "8px",
                borderRadius: "4px",
                marginBottom: "10px",
                overflowX: "auto",
              }}
            >
              {tabs.map((tab) => (
                <div
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    backgroundColor:
                      activeTab === tab.id ? "#2d3748" : "#4A5568",
                    color: "white",
                    padding: "6px 12px",
                    borderRadius: "4px",
                    marginRight: "8px",
                    cursor: "pointer",
                    fontSize: "14px",
                    minWidth: "fit-content",
                  }}
                >
                  <span style={{ marginRight: "8px" }}>{tab.name}</span>
                </div>
              ))}
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
