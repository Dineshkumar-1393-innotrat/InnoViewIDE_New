
import { shapeDataone } from '../shapes/shapeDataone';
import { FiSearch, FiX } from 'react-icons/fi';
import { useState } from 'react';
import { useDrag } from 'react-dnd';

// DraggableShape (same as before but compact)
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
        group flex flex-col items-center p-1.5 rounded-md cursor-grab
         border border-transparent  hover:bg-blue-50
        transition-all duration-200 ease-in-out transform hover:scale-105
        active:cursor-grabbing active:scale-95 active:shadow-lg
        ${isDragging ? 'opacity-50' : 'opacity-100'}
        w-full
      `}
      title={shape.name}
    >
      <div className="w-6 h-6 flex items-center justify-center pointer-events-none">
        <svg
          viewBox={shape.icon?.viewBox || "0 0 24 24"}
          className="w-full h-full"
          preserveAspectRatio="xMidYMid meet"
        >
          <path
            d={shape.icon?.path || "M0 0h24v24H0z"}
            fill={shape.icon?.fill || "#ffffff"}
            stroke={shape.icon?.stroke || "#02000a"}
            strokeWidth={shape.icon?.strokeWidth || "5"}
          />
        </svg>
      </div>
      <span className="text-[10px] text-center text-black-700 truncate w-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        {shape.name}
      </span>
    </div>
  );
};

const ShapeCategory = ({ title, shapes }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="mb-3">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-2 py-1.5 text-xs font-bold text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
      >
        <span>{title}</span>
        <span className={`transform transition-transform duration-300 ease-in-out ${isOpen ? 'rotate-90' : ''}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </button>
      {isOpen && (
        <div className="mt-2 grid grid-cols-3 sm:grid-cols-4 gap-2 px-1">
          {shapes.map((shape) => (
            <DraggableShape key={shape.id} shape={shape} />
          ))}
        </div>
      )}
    </div>
  );
};

const Sidebar = ({ sidebarOpen, toggleSidebar }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const categories = Object.entries(shapeDataone).map(([category, shapes]) => ({
    name: category,
    shapes: shapes.map((shape) => ({
      ...shape,
      id: shape.id || `shape-${category}-${Math.random().toString(36).substr(2, 9)}`,
    })),
  }));

  const filteredCategories = categories
    .map((category) => ({
      ...category,
      shapes: category.shapes.filter((shape) =>
        shape.name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    }))
    .filter((category) => category.shapes.length > 0);

  return (
    <div
      className={`
        h-full flex flex-col border-r-4 shadow-lg
        bg-[#ffffff] text-gray-900
        w-64
        rounded-r-xl
        custom-blue-scrollbar
      `}
    >
      {/* Mobile close button */}
      <div className="lg:hidden flex justify-end p-2">
        <button onClick={toggleSidebar} className="text-blue-700 hover:text-blue-900 transition-colors">
          <FiX size={20} />
        </button>
      </div>

      {/* Header */}
      <div className="p-3 border-b border-blue-100 bg-[#f8fafc] rounded-t-xl">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-700" />
          <input
            type="text"
            placeholder="Search shapes..."
            className="w-full pl-10 pr-3 py-2 rounded-md text-sm text-gray-900 placeholder-blue-400 border border-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-transparent transition-all bg-blue-50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Scrollable Shape Area */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin custom-blue-scrollbar bg-[#ffffff]">
        {filteredCategories.length > 0 ? (
          filteredCategories.map((category) => (
            <ShapeCategory key={category.name} title={category.name} shapes={category.shapes} />
          ))
        ) : (
          <div className="text-center text-blue-700 py-8 text-sm">
            <p className="font-semibold">No shapes found</p>
            <p className="mt-1">Try a different search term.</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-2 border-t border-blue-100 text-[11px] text-blue-700 bg-[#f8fafc] rounded-b-xl">
        <div className="flex justify-between items-center">
          <span>{Object.values(shapeDataone).flat().length} shapes available</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

/* Add this to the bottom of the file for custom blue scrollbar */
/* Tailwind doesn't support custom scrollbar colors out of the box, so add this style: */
/*
Add to your global CSS (e.g., index.css):
.custom-blue-scrollbar::-webkit-scrollbar {
  width: 8px;
  background: #e0e7ff;
}
.custom-blue-scrollbar::-webkit-scrollbar-thumb {
  background: #60a5fa;
  border-radius: 8px;
}
.custom-blue-scrollbar {
  scrollbar-color: #60a5fa #e0e7ff;
  scrollbar-width: thin;
}
*/
