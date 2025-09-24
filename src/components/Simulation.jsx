import React, { useState, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Rnd } from 'react-rnd';
// import { Maximize, ZoomIn, ZoomOut, ArrowLeft, ArrowRight, Trash2 } from 'lucide-react';
import { FiTrash } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

// import Footer from './Footer';
import SimulationSidebar from './SimulationSidebar';
import SimulationPopup from './SimulationPopup';
import './Simulation.css';
import Output from './Output';
import { Box, Text } from '@chakra-ui/react';

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

// Your existing symbols array (kept for backward compatibility with existing drag/drop logic)
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
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [canvasItems, setCanvasItems] = useState([]);
  const [openCategories, setOpenCategories] = useState({});
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, itemIndex: null });
  const [selectedItem, setSelectedItem] = useState(null); // Track selected item for showing handles
  const [zoom, setZoom] = useState(1);
  const navigate = useNavigate();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Toggle category visibility
  const toggleCategory = (category) => {
    setOpenCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  // Right-click context menu handler
  const handleContextMenu = (e, index) => {
    e.preventDefault();
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
      setCanvasItems(prev => prev.filter((_, index) => index !== contextMenu.itemIndex));
    }
    setContextMenu({ visible: false, x: 0, y: 0, itemIndex: null });
  };

  // Close context menu when clicking outside
  const handleClickOutside = (e) => {
    if (contextMenu.visible && !e.target.closest('.context-menu')) {
      setContextMenu({ visible: false, x: 0, y: 0, itemIndex: null });
    }
    // Deselect item when clicking on canvas
    if (!e.target.closest('.rnd')) {
      setSelectedItem(null);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [contextMenu.visible]);

  // Initialize categories as open
  useEffect(() => {
    const initialOpenState = {};
    symbols.forEach(section => {
      initialOpenState[section.category] = true;
    });
    setOpenCategories(initialOpenState);
  }, []);

  // SymbolItem component (drag source) - kept for compatibility
  const SymbolItem = ({ symbol }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
      type: 'symbol',
      item: { symbol },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }));

    return (
      <div
        ref={drag}
        className="symbol-item"
        style={{
          opacity: isDragging ? 0.5 : 1,
          cursor: 'grab',
          padding: '8px',
          margin: '4px',
          border: '1px solid #ddd',
          borderRadius: '4px',
          backgroundColor: '#f9f9f9',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          minHeight: '60px',
        }}
      >
        <img src={symbol.src} alt={symbol.name} style={{ width: '30px', height: '30px', marginBottom: '4px' }} />
        <span style={{ fontSize: '10px', textAlign: 'center' }}>{symbol.name}</span>
      </div>
    );
  };

  // Canvas component (drop target)
  const Canvas = () => {
    const [{ isOver }, drop] = useDrop(() => ({
      accept: ['symbol'],
      drop: (item, monitor) => {
        const offset = monitor.getClientOffset();
        const canvasRect = document.querySelector('.canvas').getBoundingClientRect();
        const x = offset.x - canvasRect.left;
        const y = offset.y - canvasRect.top;

        setCanvasItems(prev => [...prev, {
          ...item.symbol,
          x: Math.max(0, x - 40), // Center the item and ensure it's within bounds
          y: Math.max(0, y - 40),
          width: 80,
          height: 80,
          rotation: 0, // Add rotation property
          id: Date.now() + Math.random() // Ensure unique ID
        }]);
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    }));

    return (
      <div
        ref={drop}
        className="canvas"
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: isOver ? '#e8f4fd' : '#f5f5f5',
          position: 'relative',
          border: '2px dashed #ccc',
          borderRadius: '8px',
          minHeight: '500px',
        }}
      >
        {canvasItems.map((item, index) => (
          <Rnd
            key={item.id}
            default={{
              x: item.x,
              y: item.y,
              width: item.width || 80,
              height: item.height || 80,
            }}
            bounds="parent"
            enableResizing={{
              top: true,
              right: true,
              bottom: true,
              left: true,
              topRight: true,
              bottomRight: true,
              bottomLeft: true,
              topLeft: true,
            }}
            disableDragging={false}
            onDragStart={() => setSelectedItem(index)}
            onDragStop={(e, d) => {
              setCanvasItems(prev =>
                prev.map((canvasItem, i) =>
                  i === index ? { ...canvasItem, x: d.x, y: d.y } : canvasItem
                )
              );
            }}
            onResizeStart={() => setSelectedItem(index)}
            onResizeStop={(e, direction, ref, delta, position) => {
              setCanvasItems(prev =>
                prev.map((canvasItem, i) =>
                  i === index
                    ? {
                        ...canvasItem,
                        width: ref.offsetWidth,
                        height: ref.offsetHeight,
                        x: position.x,
                        y: position.y,
                      }
                    : canvasItem
                )
              );
            }}
            onContextMenu={(e) => handleContextMenu(e, index)}
            onClick={() => setSelectedItem(index)}
            style={{
              border: selectedItem === index ? '2px solid #3b82f6' : 'none',
              borderRadius: '8px',
              backgroundColor: 'transparent',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '4px',
              boxShadow: selectedItem === index ? '0 0 0 2px rgba(59, 130, 246, 0.3)' : 'none',
              cursor: 'move',
              transform: `rotate(${item.rotation || 0}deg)`,
              transition: 'all 0.2s ease',
            }}
          >
            <div 
              style={{ 
                width: '100%', 
                height: '100%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
              }}
            >
              <img 
                src={item.src} 
                alt={item.name} 
                style={{ 
                  maxWidth: '90%', 
                  maxHeight: '90%', 
                  objectFit: 'contain',
                  pointerEvents: 'none'
                }} 
              />
            </div>
            
            {/* Rotation Handle - only show when selected */}
            {selectedItem === index && (
              <div
                style={{
                  position: 'absolute',
                  top: '-15px',
                  right: '-15px',
                  width: '30px',
                  height: '30px',
                  backgroundColor: '#3b82f6',
                  borderRadius: '50%',
                  cursor: 'grab',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  color: 'white',
                  fontWeight: 'bold',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                  border: '2px solid white',
                  zIndex: 10,
                  userSelect: 'none',
                }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  
                  const rndElement = e.currentTarget.closest('.rnd');
                  if (!rndElement) return;
                  
                  const rect = rndElement.getBoundingClientRect();
                  const centerX = rect.left + rect.width / 2;
                  const centerY = rect.top + rect.height / 2;
                  
                  // Calculate initial angle
                  const initialAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);
                  const currentRotation = item.rotation || 0;
                  
                  const handleMouseMove = (moveEvent) => {
                    const currentAngle = Math.atan2(moveEvent.clientY - centerY, moveEvent.clientX - centerX) * (180 / Math.PI);
                    const deltaAngle = currentAngle - initialAngle;
                    const newRotation = currentRotation + deltaAngle;
                    
                    setCanvasItems(prev =>
                      prev.map((canvasItem, i) =>
                        i === index 
                          ? { ...canvasItem, rotation: newRotation }
                          : canvasItem
                      )
                    );
                  };
                  
                  const handleMouseUp = () => {
                    document.removeEventListener('mousemove', handleMouseMove);
                    document.removeEventListener('mouseup', handleMouseUp);
                    document.body.style.cursor = 'default';
                  };
                  
                  document.body.style.cursor = 'grabbing';
                  document.addEventListener('mousemove', handleMouseMove);
                  document.addEventListener('mouseup', handleMouseUp);
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
                title="Drag to rotate component"
              >
                ⟲
              </div>
            )}
          </Rnd>
        ))}
        
        {/* Drop Zone Indicator */}
        {isOver && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              padding: '20px',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              border: '2px dashed #3b82f6',
              borderRadius: '12px',
              color: '#3b82f6',
              fontSize: '16px',
              fontWeight: '600',
              pointerEvents: 'none',
            }}
          >
            Drop component here
          </div>
        )}
      </div>
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="simulation-container flex flex-col bg-gray-900 h-full">
        <div className="flex-grow">
        {/* Top Controls - Commented out to remove duplicate header */}
        {/*
        <div className="top-controls flex items-center gap-2 p-4 bg-gray-800 border-b border-gray-700">
          <SimulationPopup>
            <button className="control-button p-2 px-4 text-gray-200 bg-blue-600 hover:bg-blue-700 rounded-md transition-all duration-200 font-medium">
              Code
            </button>
          </SimulationPopup>
        </div>
        */}

        {/* Main Content */}
        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
          {sidebarOpen && (
            <div className="w-full md:w-64 flex-shrink-0 bg-gray-800 border-r border-gray-700 overflow-y-auto">
              <SimulationSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
            </div>
          )}

          {/* Main Canvas and Output Area */}
          <div className="flex-1 flex flex-col h-full bg-gray-900 min-w-0 relative">
            {/* Toolbar */}
            <div className="w-full bg-gray-800 p-2 flex items-center justify-between border-b border-gray-700">
              <div className="flex items-center gap-2">
                <button className="control-button p-2 text-green-400 bg-gray-700 hover:bg-gray-600 rounded-md">Play</button>
                <button className="control-button p-2 text-red-400 bg-gray-700 hover:bg-gray-600 rounded-md">Stop</button>
                <button className="control-button p-2 text-blue-400 bg-gray-700 hover:bg-gray-600 rounded-md">View Data</button>
              </div>
              <div className="flex items-center gap-2 text-white">
                <button onClick={() => setZoom(z => Math.max(0.2, z - 0.1))} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-md">-</button>
                <span>{Math.round(zoom * 100)}%</span>
                <button onClick={() => setZoom(z => Math.min(2, z + 0.1))} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-md">+</button>
              </div>
            </div>
            {/* Sidebar Toggle Button */}
            {!sidebarOpen && (
              <button
                onClick={toggleSidebar}
                className="absolute top-4 left-4 z-10 p-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-all"
                title="Open Sidebar"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            )}
            {/* Main Canvas Area */}
            <main className="flex-1 h-full relative bg-gray-900 min-w-0" style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}>
              <Canvas />
            </main>
            {selectedItem !== null && (
              <div
                style={{
                  position: 'absolute',
                  top: canvasItems[selectedItem].y + canvasItems[selectedItem].height + 10,
                  left: canvasItems[selectedItem].x,
                  zIndex: 100,
                }}
              >
                <button
                  onMouseDown={(e) => {
                    e.preventDefault();
                    const item = canvasItems[selectedItem];
                    const newRotation = (item.rotation || 0) + 15;
                    setCanvasItems(prev =>
                      prev.map((canvasItem, i) =>
                        i === selectedItem ? { ...canvasItem, rotation: newRotation } : canvasItem
                      )
                    );
                  }}
                  className="p-1 bg-blue-500 text-white rounded-full"
                >
                  ⟳
                </button>
              </div>
            )}

            {/* Simulation Output */}
            <div className="bg-gray-900 text-gray-200 p-4 border-t-2 border-gray-700 h-48 font-mono overflow-y-auto shadow-lg">
              <p className="text-base opacity-80 mb-2">Simulation Output:</p>
              <pre className="mt-2 p-3 bg-gray-800 text-gray-300 w-full h-full rounded border border-gray-700 overflow-auto">
                "Explore your simulation results here"
              </pre>
            </div>
          </div>
        </div>

        {/* Context Menu */}
        {contextMenu.visible && (
          <div
            className="context-menu fixed bg-white border border-gray-300 rounded-md shadow-lg z-50 p-2"
            style={{
              top: contextMenu.y,
              left: contextMenu.x,
            }}
          >
            <button
              onClick={handleDelete}
              className="flex items-center justify-center w-8 h-8 bg-transparent text-red-600 border-2 border-transparent rounded-full cursor-pointer transition-all duration-300 hover:bg-red-600 hover:text-white hover:border-red-600"
              aria-label="Delete"
            >
              <FiTrash size={16} />
            </button>
          </div>
        )}

        {/* Footer */}
        {/* <Footer /> */}
      </div>
      </div>
    </DndProvider>
  );
};

export default BlockDiagram;
