import React, { useState } from 'react';
import { FiSearch, FiX, FiChevronDown, FiGrid, FiBox } from 'react-icons/fi';
import { useDrag } from 'react-dnd';
import { motion, AnimatePresence } from 'framer-motion';

// Import all simulation SVG icons
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

// Simulation symbols data organized by categories
const simulationSymbols = [
  {
    category: "SENSORS",
    items: [
      { type: "svg", src: SoundAndVibrationsSensor, name: "Sound and Vibrations Sensor", id: "sound-vibration-sensor" },
      { type: "svg", src: OpticalSensor, name: "Optical Sensor", id: "optical-sensor" },
      { type: "svg", src: EnvironmentalSensor, name: "Environmental Sensor", id: "environmental-sensor" },
      { type: "svg", src: ElectricalAndMagneticsSensor, name: "Electrical and Magnetics Sensor", id: "electrical-magnetic-sensor" },
      { type: "svg", src: DistanceAndRangeSensor, name: "Distance and Range Sensor", id: "distance-range-sensor" },
      { type: "svg", src: ChemicalSensor, name: "Chemical Sensor", id: "chemical-sensor" },
      { type: "svg", src: MotionSensor, name: "Motion Sensor", id: "motion-sensor" },
      { type: "svg", src: TouchAndForceSensor, name: "Touch and Force Sensor", id: "touch-force-sensor" },
      { type: "svg", src: TemperatureSensor, name: "Temperature Sensor", id: "temperature-sensor" },
    ],
  },
  {
    category: "ACTUATORS",
    items: [
      { type: "svg", src: ServoMotors, name: "Servo Motors", id: "servo-motors" },
      { type: "svg", src: VibrationsMotors, name: "Vibrations Motors", id: "vibration-motors" },
      { type: "svg", src: ActuatorsRelay, name: "Actuators Relay", id: "actuators-relay" },
    ],
  },
  {
    category: "DISPLAY AND INDICATORS",
    items: [
      { type: "svg", src: OledDisplays, name: "OLED Displays", id: "oled-displays" },
      { type: "svg", src: RGBLights, name: "RGB Lights", id: "rgb-lights" },
      { type: "svg", src: Buzzer, name: "Buzzer", id: "buzzer" },
    ],
  },
  {
    category: "POWER",
    items: [
      { type: "svg", src: PowerSupply, name: "Power Supply", id: "power-supply" },
    ],
  },
  {
    category: "CONNECTORS",
    items: [
      { type: "svg", src: Connectors, name: "Connectors", id: "connectors" },
      { type: "svg", src: Wire, name: "Wire", id: "wire" },
    ],
  },
  {
    category: "AMPLIFIERS",
    items: [
      { type: "svg", src: Amplifier, name: "Amplifier", id: "amplifier" },
    ],
  },
  {
    category: "MICROCONTROLLERS",
    items: [
      { type: "svg", src: Microcontroller, name: "Microcontroller", id: "microcontroller" },
    ],
  },
];

// DraggableSymbol - Modern and properly sized
const DraggableSymbol = ({ symbol }) => {
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
      className={`
        group relative flex flex-col items-center p-2 rounded-md cursor-grab
        border border-gray-600 bg-gray-700 hover:bg-gray-600 hover:border-gray-500
        transition-all duration-200 ease-in-out transform hover:scale-105
        active:cursor-grabbing active:scale-95 active:shadow-lg
        ${isDragging ? 'opacity-50 shadow-lg' : 'opacity-100 shadow-sm'}
        w-full h-14 sm:h-16 justify-center
      `}
      title={symbol.name}
    >
      <div className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center pointer-events-none mb-1">
        <img
          src={symbol.src}
          alt={symbol.name}
          className="w-full h-full object-contain"
        />
      </div>
      <span className="text-[10px] sm:text-xs text-center text-gray-300 truncate w-full pointer-events-none opacity-100 transition-opacity duration-200 font-medium leading-tight">
        {symbol.name}
      </span>
    </div>
  );
};

// Accordion-style category with smooth animations
const SymbolCategory = ({ title, symbols }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-2">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-3 rounded-md text-left text-gray-200 bg-gray-700/[0.5] hover:bg-gray-700 transition-all duration-200 shadow-sm"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <span className="font-semibold text-sm tracking-wide uppercase">{title}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <FiChevronDown size={18} />
        </motion.div>
      </motion.button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { opacity: 1, height: 'auto' },
              collapsed: { opacity: 0, height: 0 },
            }}
            transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-900/[0.5] rounded-b-md">
              {symbols.map((symbol) => (
                <DraggableSymbol key={symbol.id} symbol={symbol} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const SimulationSidebar = ({ sidebarOpen, toggleSidebar }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all'); // 'all', 'sensors', 'actuators', etc.
  const [isLoading, setIsLoading] = useState(false);

  // Define categories that match simulation components
  const allCategories = [
    { 
      name: 'Sensors', 
      symbols: simulationSymbols.find(cat => cat.category === 'SENSORS')?.items || []
    },
    { 
      name: 'Actuators', 
      symbols: simulationSymbols.find(cat => cat.category === 'ACTUATORS')?.items || []
    },
    { 
      name: 'Display & Indicators', 
      symbols: simulationSymbols.find(cat => cat.category === 'DISPLAY AND INDICATORS')?.items || []
    },
    { 
      name: 'Power', 
      symbols: simulationSymbols.find(cat => cat.category === 'POWER')?.items || []
    },
    { 
      name: 'Connectors', 
      symbols: simulationSymbols.find(cat => cat.category === 'CONNECTORS')?.items || []
    },
    { 
      name: 'Amplifiers', 
      symbols: simulationSymbols.find(cat => cat.category === 'AMPLIFIERS')?.items || []
    },
    { 
      name: 'Microcontrollers', 
      symbols: simulationSymbols.find(cat => cat.category === 'MICROCONTROLLERS')?.items || []
    },
  ];

  // Filter categories based on active category
  const getFilteredCategories = () => {
    if (activeCategory === 'all') {
      return allCategories;
    }
    return allCategories.filter(cat => 
      cat.name.toLowerCase() === activeCategory.toLowerCase()
    );
  };

  const filteredCategories = getFilteredCategories().map(category => ({
    ...category,
    symbols: category.symbols.filter(symbol =>
      symbol.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.symbols.length > 0);

  // Calculate dynamic symbol count based on active category and search
  const getDynamicSymbolCount = () => {
    if (activeCategory === 'all') {
      return allCategories.reduce((total, category) => {
        const filteredSymbols = category.symbols.filter(symbol =>
          symbol.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        return total + filteredSymbols.length;
      }, 0);
    } else {
      const activeCategories = allCategories.filter(cat => 
        cat.name.toLowerCase() === activeCategory.toLowerCase()
      );
      return activeCategories.reduce((total, category) => {
        const filteredSymbols = category.symbols.filter(symbol =>
          symbol.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        return total + filteredSymbols.length;
      }, 0);
    }
  };

  const dynamicSymbolCount = getDynamicSymbolCount();
  const visibleSymbolCount = filteredCategories.reduce((total, category) => total + category.symbols.length, 0);

  const handleCategoryChange = (category) => {
    setIsLoading(true);
    setActiveCategory(category);
    setTimeout(() => setIsLoading(false), 300);
  };

  return (
    <motion.div
      className="h-full bg-gray-800 border-r border-gray-700 flex flex-col overflow-hidden"
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -300, opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-700 flex-shrink-0 space-y-4">
        {/* Title and Toggle */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-200 flex items-center gap-2">
            <FiBox className="text-blue-500" size={20} />
            Simulation Components
          </h2>
          <motion.button
            onClick={toggleSidebar}
            className="p-2 text-gray-400 hover:text-gray-200 hover:bg-gray-700 rounded-md transition-all duration-200"
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            title="Close Sidebar"
          >
            <FiX size={20} />
          </motion.button>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 p-2 bg-gray-900/[0.5] rounded-lg">
          {[
            { key: 'all', label: 'All', icon: FiGrid },
            { key: 'sensors', label: 'Sensors', icon: FiBox },
            { key: 'actuators', label: 'Actuators', icon: FiBox },
            { key: 'power', label: 'Power', icon: FiBox },
          ].map(({ key, label, icon: Icon }) => (
            <motion.button
              key={key}
              onClick={() => handleCategoryChange(key)}
              className={`
                px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 flex items-center gap-1
                ${activeCategory === key 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-gray-200'
                }
              `}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Icon size={12} />
              {label}
            </motion.button>
          ))}
        </div>
        
        {/* Search Bar */}
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search components..."
            className="w-full pl-10 pr-3 py-2.5 rounded-md text-sm text-gray-200 placeholder-gray-400 
                     border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 
                     focus:border-transparent transition-all bg-gray-700 shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Scrollable Symbol Area */}
      <motion.div 
        className="flex-1 overflow-y-auto p-4 space-y-2 custom-blue-scrollbar"
        key={activeCategory} // Force re-render when category changes
      >
        {isLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center py-12"
          >
            <div className="text-center">
              <svg className="animate-spin h-8 w-8 text-blue-500 mx-auto mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-gray-400 text-sm">Loading components...</p>
            </div>
          </motion.div>
        ) : (
          <AnimatePresence mode="wait">
            {filteredCategories.length > 0 ? (
              <motion.div
                key="symbols"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-2"
              >
                {filteredCategories.map((category) => (
                  <SymbolCategory key={category.name} title={category.name} symbols={category.symbols} />
                ))}
              </motion.div>
            ) : (
              <motion.div 
                key="no-results"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="text-center text-gray-400 py-8"
              >
                <div className="w-12 h-12 mx-auto mb-3 bg-gray-700 rounded-full flex items-center justify-center">
                  <FiSearch size={20} className="text-gray-500" />
                </div>
                <p className="font-medium text-gray-300 mb-1 text-sm">No components found</p>
                <p className="text-xs">Try a different search term</p>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </motion.div>

      {/* Footer */}
      <motion.div 
        className="p-4 border-t border-gray-700 bg-gray-800 flex-shrink-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex justify-between items-center text-xs text-gray-400">
          <span className="font-medium">
            {searchTerm ? `${visibleSymbolCount} of ${dynamicSymbolCount}` : `${dynamicSymbolCount}`} components available
          </span>
          <span className="text-gray-500 text-[10px] hidden sm:inline">
            Drag to canvas
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SimulationSidebar;
