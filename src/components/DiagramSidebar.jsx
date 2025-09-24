import { shapeData } from '../shapes/shapeData';
import { FiSearch, FiX, FiChevronDown, FiGrid, FiBox, FiArrowUp, FiRepeat, FiFolder } from 'react-icons/fi';
import { useState } from 'react';
import { useDrag } from 'react-dnd';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { setConnectorType } from '../features/flow/flowSlice';
import { selectConnectorType, selectActiveCategory } from '../features/flow/flowSlice';
import FileExplorer from './FileExplorer';

// DraggableShape - Compact and properly sized
const DraggableShape = ({ shape }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'shape',
    item: { shape },
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
      title={shape.name}
    >
      <div className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center pointer-events-none mb-1">
        <svg
          viewBox={shape.icon?.viewBox || "0 0 24 24"}
          className="w-full h-full"
          preserveAspectRatio="xMidYMid meet"
        >
          <path
            d={shape.icon?.path || "M0 0h24v24H0z"}
            fill={shape.icon?.fill || "#ffffff"}
            stroke={shape.icon?.stroke || "#e5e7eb"}
            strokeWidth={shape.icon?.strokeWidth || "1.5"}
          />
        </svg>
      </div>
      <span className="text-[10px] sm:text-xs text-center text-gray-300 truncate w-full pointer-events-none opacity-100 transition-opacity duration-200 font-medium leading-tight">
        {shape.name}
      </span>
    </div>
  );
};

const ShapeCategory = ({ title, shapes }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <motion.div
      className="mb-3"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 rounded transition-all duration-200 group"
      >
        <span className="text-gray-200 text-xs sm:text-sm">{title}</span>
        <FiChevronDown
          className={`h-4 w-4 text-gray-400 transition-transform duration-300 ease-in-out group-hover:text-gray-300 ${isOpen ? 'rotate-180' : ''
            }`}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-1 sm:gap-2 px-1 sm:px-2 shape-grid"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {shapes.map((shape, index) => (
              <motion.div
                key={shape.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
              >
                <DraggableShape shape={shape} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const ConnectorTypeSelector = () => {
  const dispatch = useDispatch();
  const connectorType = useSelector(selectConnectorType);

  const handleConnectorTypeChange = (type) => {
    dispatch(setConnectorType(type));
  };

  return (
    <div className="p-4 border-t border-gray-700">
      <h3 className="text-sm font-medium text-gray-300 mb-3">Connector Type</h3>
      <div className="flex gap-2">
        <button
          onClick={() => handleConnectorTypeChange('single')}
          className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${connectorType === 'single'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          title="Single Arrow"
        >
          <FiArrowUp size={14} />
          <span>Single</span>
        </button>
        <button
          onClick={() => handleConnectorTypeChange('double')}
          className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${connectorType === 'double'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          title="Double Arrow"
        >
          <FiRepeat size={14} />
          <span>Double</span>
        </button>
      </div>
    </div>
  );
};

const DiagramSidebar = ({ isCollapsed, activeTab, setActiveTab, onFlipDirection, onFileSystemUpdate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const activeCategory = useSelector(selectActiveCategory);
  const [isLoading, setIsLoading] = useState(false);
  const selectedEdge = useSelector(state => state.flow.present.edges.find(e => e.selected));
  const dispatch = useDispatch();

  // Define categories that match the reference image
  const allCategories = [
    {
      name: 'Flowchart',
      shapes: (shapeData.Flowchart || []).map(shape => ({
        ...shape,
        id: shape.id || `shape-flowchart-${Math.random().toString(36).substr(2, 9)}`
      }))
    },
    {
      name: 'DSA',
      shapes: (shapeData['Data Structures'] || []).map(shape => ({
        ...shape,
        id: shape.id || `shape-dsa-${Math.random().toString(36).substr(2, 9)}`
      }))
    },
    {
      name: 'Block Diagram',
      shapes: (shapeData['Block Diagram'] || []).map(shape => ({
        ...shape,
        id: shape.id || `shape-blockdiagram-${Math.random().toString(36).substr(2, 9)}`
      }))
    },
    {
      name: 'Basic',
      shapes: (shapeData.Basic || []).map(shape => ({
        ...shape,
        id: shape.id || `shape-basic-${Math.random().toString(36).substr(2, 9)}`
      }))
    },
    {
      name: 'UML Use Case Diagram',
      shapes: (shapeData['UML Use Case Diagram'] || []).map(shape => ({
        ...shape,
        id: shape.id || `shape-uml-usecase-${Math.random().toString(36).substr(2, 9)}`
      }))
    },
    {
      name: 'UML Sequence Diagram',
      shapes: (shapeData['UML Sequence Diagram'] || []).map(shape => ({
        ...shape,
        id: shape.id || `shape-uml-sequence-${Math.random().toString(36).substr(2, 9)}`
      }))
    },
    {
      name: 'UML Timing Diagram',
      shapes: (shapeData['UML Timing Diagram'] || []).map(shape => ({
        ...shape,
        id: shape.id || `shape-uml-timing-${Math.random().toString(36).substr(2, 9)}`
      }))
    },
    {
      name: 'Activity & State Diagram',
      shapes: (shapeData['Activity & State Diagram'] || []).map(shape => ({
        ...shape,
        id: shape.id || `shape-activity-${Math.random().toString(36).substr(2, 9)}`
      }))
    },
    {
      name: 'Connectors',
      shapes: (shapeData.Connectors || []).map(shape => ({
        ...shape,
        id: shape.id || `shape-connectors-${Math.random().toString(36).substr(2, 9)}`
      }))
    },
  ];

  // Filter categories based on active category
  const getFilteredCategories = () => {
    if (activeCategory === 'all') {
      return allCategories;
    } else if (activeCategory === 'flowchart') {
      return allCategories.filter(cat => cat.name === 'Flowchart' || cat.name === 'DSA');
    } else if (activeCategory === 'blockdiagram') {
      return allCategories.filter(cat => cat.name === 'Block Diagram');
    }
    return allCategories;
  };

  const categories = getFilteredCategories();

  const filteredCategories = categories
    .map((category) => ({
      ...category,
      shapes: category.shapes.filter((shape) =>
        shape.name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    }))
    .filter((category) => category.shapes.length > 0);

  const handleCategoryChange = (category) => {
    setIsLoading(true);
    dispatch(setActiveCategory(category));
    // Simulate loading for smooth transition
    setTimeout(() => setIsLoading(false), 150);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'flowchart':
        return (
          <>
            <ConnectorTypeSelector />
            <div className="p-4 border-t border-gray-700">
              <h3 className="text-sm font-medium text-gray-300 mb-3">Actions</h3>
              <button
                onClick={onFlipDirection}
                disabled={!selectedEdge}
                className="w-full text-left px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 rounded-md flex items-center justify-between transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>Flip Direction</span>
                <FiRepeat size={14} />
              </button>
            </div>

            {/* Category filters and search */}
            <div className="px-4 space-y-3">
              {/* <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCategoryChange('all')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${activeCategory === 'all' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  title="All"
                >
                  <FiGrid size={14} />
                  <span>All</span>
                </button>
                <button
                  onClick={() => handleCategoryChange('flowchart')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${activeCategory === 'flowchart' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  title="Flowchart"
                >
                  <FiGrid size={14} />
                  <span>Flowchart</span>
                </button>
                <button
                  onClick={() => handleCategoryChange('blockdiagram')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${activeCategory === 'blockdiagram' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  title="Block Diagram"
                >
                  <FiBox size={14} />
                  <span>Block Diagram</span>
                </button>
              </div> */}

              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search shapes..."
                  className="w-full pl-8 pr-8 py-2 rounded-md bg-gray-700 text-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
                    title="Clear"
                  >
                    <FiX size={14} />
                  </button>
                )}
              </div>
            </div>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <p>Loading...</p>
              </div>
            ) : (
              <AnimatePresence mode="wait">
                {filteredCategories.length > 0 ? (
                  <motion.div
                    key="shapes"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-2"
                  >
                    {filteredCategories.map((category) => (
                      <ShapeCategory key={category.name} title={category.name} shapes={category.shapes} />
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
                    <p>No shapes found</p>
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </>
        );
      // case 'icons':
      //   return <div>Icons Content Here</div>;
      // case 'images':
      //   return <div>Images Content Here</div>;
      case 'explorer':
        return <FileExplorer onFileSystemUpdate={onFileSystemUpdate} />;
      default:
        return null;
    }
  };

  if (isCollapsed) {
    return null;
  }

  return (
    <div className="w-64 bg-gray-800 flex flex-col overflow-y-auto transition-all duration-300">
      {/* <div className="p-4">
        <h2 className="text-lg font-semibold text-white">Diagram</h2>
      </div> */}
      <div className="flex-grow p-4 space-y-4">
        {renderContent()}
      </div>
    </div>
  );
};

export default DiagramSidebar; 