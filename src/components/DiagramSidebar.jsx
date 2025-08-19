import { shapeData } from '../shapes/shapeData';
import { FiSearch, FiX, FiChevronDown, FiGrid, FiBox } from 'react-icons/fi';
import { useState } from 'react';
import { useDrag } from 'react-dnd';
import { motion, AnimatePresence } from 'framer-motion';

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
          className={`h-4 w-4 text-gray-400 transition-transform duration-300 ease-in-out group-hover:text-gray-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-1 sm:gap-2 px-1 sm:px-2 shape-grid"
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

const DiagramSidebar = ({ sidebarOpen, toggleSidebar }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all'); // 'all', 'flowchart', 'blockdiagram'
  const [isLoading, setIsLoading] = useState(false);

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
      return allCategories.filter(cat => cat.name === 'Flowchart');
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

  // Calculate dynamic shape count based on active category and search
  const getDynamicShapeCount = () => {
    if (activeCategory === 'all') {
      return allCategories.reduce((total, category) => total + category.shapes.length, 0);
    } else if (activeCategory === 'flowchart') {
      const flowchartCategory = allCategories.find(cat => cat.name === 'Flowchart');
      return flowchartCategory ? flowchartCategory.shapes.length : 0;
    } else if (activeCategory === 'blockdiagram') {
      const blockCategory = allCategories.find(cat => cat.name === 'Block Diagram');
      return blockCategory ? blockCategory.shapes.length : 0;
    }
    return 0;
  };

  const dynamicShapeCount = getDynamicShapeCount();
  const visibleShapeCount = filteredCategories.reduce((total, category) => total + category.shapes.length, 0);

  const handleCategoryChange = (category) => {
    setIsLoading(true);
    setActiveCategory(category);
    // Simulate loading for smooth transition
    setTimeout(() => setIsLoading(false), 150);
  };

  return (
    <motion.div
      className={`
        h-full flex flex-col bg-gray-800 border-r border-gray-700
        shadow-lg w-full custom-blue-scrollbar sidebar-responsive
      `}
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {/* Header with Search and Category Tabs */}
      <div className="p-4 border-b border-gray-700 bg-gray-800 flex-shrink-0">
        {/* Category Tabs */}
        <div className="flex gap-2 mb-3 flex-wrap">
          <motion.button
            onClick={() => handleCategoryChange('all')}
            className={`category-button flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              activeCategory === 'all' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isLoading}
          >
            <FiGrid size={14} />
            <span className="hidden sm:inline">All</span>
            {isLoading && activeCategory === 'all' && (
              <svg className="animate-spin h-4 w-4 text-white ml-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
          </motion.button>
          <motion.button
            onClick={() => handleCategoryChange('flowchart')}
            className={`category-button flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              activeCategory === 'flowchart' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isLoading}
          >
            <FiGrid size={14} />
            <span className="hidden sm:inline">Flowchart</span>
            {isLoading && activeCategory === 'flowchart' && (
              <svg className="animate-spin h-4 w-4 text-white ml-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
          </motion.button>
          <motion.button
            onClick={() => handleCategoryChange('blockdiagram')}
            className={`category-button flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              activeCategory === 'blockdiagram' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isLoading}
          >
            <FiBox size={14} />
            <span className="hidden sm:inline">Block Diagram</span>
            {isLoading && activeCategory === 'blockdiagram' && (
              <svg className="animate-spin h-4 w-4 text-white ml-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
          </motion.button>
        </div>
        
        {/* Search Bar */}
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search shapes..."
            className="w-full pl-10 pr-3 py-2.5 rounded-md text-sm text-gray-200 placeholder-gray-400 
                     border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 
                     focus:border-transparent transition-all bg-gray-700 shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Scrollable Shape Area */}
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
              <svg className="animate-spin h-8 w-8 text-blue-500 mx-auto mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-gray-400 text-sm">Loading shapes...</p>
            </div>
          </motion.div>
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
                <div className="w-12 h-12 mx-auto mb-3 bg-gray-700 rounded-full flex items-center justify-center">
                  <FiSearch size={20} className="text-gray-500" />
                </div>
                <p className="font-medium text-gray-300 mb-1 text-sm">No shapes found</p>
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
            {searchTerm ? `${visibleShapeCount} of ${dynamicShapeCount}` : `${dynamicShapeCount}`} shapes available
          </span>
          <span className="text-gray-500 text-[10px] hidden sm:inline">
            Drag to canvas
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DiagramSidebar; 