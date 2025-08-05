import React, { useState, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Rnd } from 'react-rnd';
import { Maximize, ZoomIn, ZoomOut, ArrowLeft, ArrowRight, Trash2 } from 'lucide-react';
import { FiTrash } from 'react-icons/fi';
import { InputGroup, InputLeftElement, Input } from '@chakra-ui/react';
import { FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

// Import all your existing SVG icons
import SoundAndVibrationsSensor from '../images/sound and vibrarions sensor.svg';
import ServoMotors from '../images/servo motors.svg';
import RGBLights from '../images/rgb lights.svg';
import PowerSupply from '../images/powersupply.svg';
import OpticalSensor from '../images/optical sensor.svg';
import OledDisplays from '../images/oled displays.svg';
import MotionSensor from '../images/motion sensor.svg';
import Microcontroller from '../images/microcontroller 1.svg';
import EnvironmentalSensor from '../images/environmental sensor.svg';
import ElectricalAndMagneticsSensor from '../images/electrical and magnetics  sensor.svg';
import DistanceAndRangeSensor from '../images/distance and range sensor.svg';
import Connectors from '../images/connectors.svg';
import ChemicalSensor from '../images/chemaical sensor.svg';
import Buzzer from '../images/buzzer.svg';
import Amplifier from '../images/amplifier.svg';
import ActuatorsRelay from '../images/actuators relay.svg';
import Wire from '../images/wire.svg';
import VibrationsMotors from '../images/vibrations motors.svg';
import TouchAndForceSensor from '../images/touch and force sensor.svg';
import TemperatureSensor from '../images/temperature sensor.svg';
import SimulationPopup from './SimulationPopup'; // Import the popup component

// ... (rest of your imports)

import Navbar from './Navbar';
import Footer from './Footer';
import './Simulation.css';
import Output from './Output';
import { Box, Text } from '@chakra-ui/react';

// Your existing symbols array
const symbols = [
  {
    category: "SENSORS ▼",
    items: [
      { type: "svg", src: SoundAndVibrationsSensor, name: "Sound and Vibrations Sensor" },
      { type: "svg", src: OpticalSensor, name: "Optical Sensor" },
      { type: "svg", src: EnvironmentalSensor, name: "Environmental Sensor" },
      { type: "svg", src: ElectricalAndMagneticsSensor, name: "Electrical and Magnetics Sensor" },
      { type: "svg", src: DistanceAndRangeSensor, name: "Distance and Range Sensor" },
      { type: "svg", src: ChemicalSensor, name: "Chemical Sensor" },
      { type: "svg", src: MotionSensor, name: "Motion Sensor" },
      { type: "svg", src: TouchAndForceSensor, name: "Touch and Force Sensor" },
      { type: "svg", src: TemperatureSensor, name: "Temperature Sensor" },
    ],
  },
  {
    category: "ACTUATORS ▼",
    items: [
      { type: "svg", src: ServoMotors, name: "Servo Motors" },
      { type: "svg", src: VibrationsMotors, name: "Vibrations Motors" },
      { type: "svg", src: ActuatorsRelay, name: "Actuators Relay" },
    ],
  },
  {
    category: "DISPLAY AND INDICATORS ▼",
    items: [
      { type: "svg", src: OledDisplays, name: "OLED Displays" },
      { type: "svg", src: RGBLights, name: "RGB Lights" },
      { type: "svg", src: Buzzer, name: "Buzzer" },
    ],
  },
  {
    category: "POWER ▼",
    items: [
      { type: "svg", src: PowerSupply, name: "Power Supply" },
    ],
  },
  {
    category: "CONNECTORS ▼",
    items: [
      { type: "svg", src: Connectors, name: "Connectors" },
      { type: "svg", src: Wire, name: "Wire" },
    ],
  },
  {
    category: "AMPLIFIERS ▼",
    items: [
      { type: "svg", src: Amplifier, name: "Amplifier" },
    ],
  },
  {
    category: "MICROCONTROLLERS ▼",
    items: [
      { type: "svg", src: Microcontroller, name: "Microcontroller" },
    ],
  },
];


const BlockDiagram = () => {
  const [openCategories, setOpenCategories] = useState({});
  const [droppedItems, setDroppedItems] = useState([]);
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    itemIndex: null
  });
  const navigate = useNavigate();

  // Toggle category visibility
  const toggleCategory = (category) => {
    setOpenCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  // Right-click context menu handler
  const handleContextMenu = (e, index) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      itemIndex: index
    });
  };

  // Delete item handler
  const handleDelete = () => {
    if (contextMenu.itemIndex !== null) {
      const updatedItems = droppedItems.filter((_, index) => index !== contextMenu.itemIndex);
      setDroppedItems(updatedItems);
      
      // Show delete success notification
      alert('Icon deleted successfully');
      
      // Reset context menu
      setContextMenu({ visible: false, x: 0, y: 0, itemIndex: null });
    }
  };

  // Close context menu when clicking outside
  const handleClickOutside = (e) => {
    if (contextMenu.visible && 
        !e.target.closest('.context-menu') && 
        !e.target.closest('.dropped-item')) {
      setContextMenu({ visible: false, x: 0, y: 0, itemIndex: null });
    }
  };

  // Add event listener for closing context menu
  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // SymbolItem component (drag source)
  const SymbolItem = ({ symbol }) => {
    const [, drag] = useDrag(() => ({
      type: "symbol",
      item: { symbol },
    }));
    
    return (
      <button 
        ref={drag} 
        className="symbol-button" 
        style={{ 
          cursor: "grab", 
          height: "140px",
          width: "140px",
          display: "flex",  
          flexDirection: "column", 
          alignItems: "center", 
          justifyContent: "center"
        }}
      >
        {symbol.type === "unicode" ? (
          symbol.symbol
        ) : (
          <img src={symbol.src} alt="SVG Symbol" className="svg-icon" />
        )}
        <div style={{ 
          marginTop: "4px", 
          fontSize: "18px", 
          color: "white" 
        }}>
          {symbol.name}
        </div>
      </button>
    );
  };

  // Canvas component (drop target)
  const Canvas = () => {
    const [, drop] = useDrop(() => ({
      accept: "symbol",
      drop: (item, monitor) => {
        if (item && item.symbol) {
          const offset = monitor.getClientOffset();
          if (offset) {
            const newSymbol = {
              symbol: item.symbol,
              x: offset.x - 100,
              y: offset.y - 100,
              width: 120,
              height: 120,
            };
            setDroppedItems((prev) => [...prev, newSymbol]);
          }
        }
      },
    }));

    return (
      <div 
        ref={drop} 
        className="canvas-placeholder" 
        style={{ position: "relative", height: "500px", border: "none"}}
      >
        {droppedItems.map((item, index) => (
          <Rnd
            key={index}
            className="dropped-item"
            default={{
              x: item.x,
              y: item.y,
              width: item.width,
              height: item.height,
            }}
            style={{
              border: "none",
            }}
            onDragStop={(e, d) => {
              setDroppedItems((prev) =>
                prev.map((dropped, i) =>
                  i === index ? { ...dropped, x: d.x, y: d.y } : dropped
                )
              );
            }}
            onResizeStop={(e, direction, ref, delta, position) => {
              setDroppedItems((prev) =>
                prev.map((dropped, i) =>
                  i === index
                    ? {
                        ...dropped,
                        width: ref.offsetWidth,
                        height: ref.offsetHeight,
                        ...position,
                      }
                    : dropped
                )
              );
            }}
            onContextMenu={(e) => handleContextMenu(e, index)}
          >
            {item.symbol.type === "unicode" ? (
              <div style={{ fontSize: "24px" }}>{item.symbol.symbol}</div>
            ) : (
              <img
                src={item.symbol.src}
                alt="SVG Element"
                style={{ width: "100%", height: "100%" }}
              />
            )}
          </Rnd>
        ))}
      </div>
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flowchart-container">
        <Navbar />
        <div className="top-controls">
        <button className="control-button">
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
          </button>
          {/* <button className="control-button">  Code   </button> */}
          {/* Start */}
          <SimulationPopup>
        <button className="control-button">Code</button>
      </SimulationPopup>
      {/* end  */}
        </div>



        <div className="main-content">
        <div className="sidebar" style={{ height: '658px' }}>



<div style={{
  display: 'flex',
  alignItems: 'center',
  padding: '10px 14px', // Increased padding for better spacing

}}>
{/* SEARCH BOX OPEN  */}
<InputGroup size="sm">
      <InputLeftElement pointerEvents="none" children={<FaSearch color="gray.400" />} />
      <Input
        type="text"
        placeholder="Search..."
        borderRadius="md"
        borderColor="gray.300"
      />
    </InputGroup>
{/* SEARCH BOX CLOSE  */}
</div>

            <div className="symbol-grid">
              {symbols.map((section, sectionIndex) => (
                <div key={sectionIndex} className="symbol-section">
                  <h3
                    onClick={() => toggleCategory(section.category)}
                    style={{ cursor: "pointer" }}
                  >
                    {section.category}
                  </h3>
                  {openCategories[section.category] && (
                    <div className="symbol-items" style={{ borderLeft: 'none' }}>
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
            <Canvas />
          </div>
        </div>

        {/* Context Menu */}
        {contextMenu.visible && (
          <div
            className="context-menu"
            style={{
              position: 'fixed',
              top: contextMenu.y,
              left: contextMenu.x,
              backgroundColor: 'white',
              border: '1px solid #ccc',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              zIndex: 1000,
              padding: '10px',
              borderRadius: '5px'
            }}
          >
           <button
  onClick={handleDelete}
  style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '20px', // Adjust size for just the icon
    height: '20px',
    backgroundColor: 'transparent',
    color: '#2D4378',
    border: '2px solid transparent',
    borderRadius: '50%',
    cursor: 'pointer',
    transition: 'all 0.3s ease', // Smooth animation
  }}
  onMouseEnter={(e) => {
    e.target.style.backgroundColor = '#f44336';
    e.target.style.color = 'white';
    e.target.style.borderColor = '#f44336';
  }}
  onMouseLeave={(e) => {
    e.target.style.backgroundColor = 'transparent';
    e.target.style.color = '#f44336';
    e.target.style.borderColor = 'transparent';
  }}
  aria-label="Delete"
>
  <FiTrash size={20} />
</button>
          </div>
        )}

        {/* start  */}
        <div
  style={{
    position: 'absolute',
    bottom: 0,
    left: '320px', // Sidebar width
    right: 0, // Stretch to the rightmost edge
    backgroundColor: '#1e1e2f', // Darker background to look like an output area
    color: '#e0e0e0', // Slightly lighter text for contrast
    padding: '20px',
    borderTop: '2px solid #3c3c4f', // Subtle border to define the top
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    height: '200px', // Slightly taller for spaciousness
    fontFamily: 'monospace', // Monospace font to resemble a console
    overflowY: 'auto', // Enable scrolling if content exceeds height
    boxShadow: '0 -4px 12px rgba(0, 0, 0, 0.3)', // Subtle shadow for depth
  }}
>
  <p
    style={{
      fontSize: '16px',
      opacity: 0.8,
      margin: 0,
    }}
  >
    Simulation Output:
  </p>
  <pre
    style={{
      marginTop: '10px',
      padding: '10px',
      backgroundColor: '#252526', // Slightly lighter section for output
      color: '#d4d4d4', // Neutral text color
      width: '100%',
      height: '100%',
      borderRadius: '4px', // Rounded corners for a modern look
      overflow: 'auto', // Enable scrolling for long outputs
      border: '1px solid #3c3c4f', // Border to define the output area
    }}
  >
    "Explore your simulation results here"
  </pre>
</div>
        {/* end  */}

        {/* footer starts  */}
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '73vh' }}>
    <div style={{ flex: '1' }}>
    </div>
    <div>
        <Footer />
    </div>
</div>
{/* footer ends  */}
      </div>
    </DndProvider>
  );
};

export default BlockDiagram;
