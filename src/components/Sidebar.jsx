// import React, { useState } from 'react';
// import { shapeData } from '../shapes';
// import DraggableShape from './DraggableShape';
// import ColorPalette from './ColorPalette';

// const Sidebar = ({ onSelectColor }) => {
//   const [openCategories, setOpenCategories] = useState(
//     Object.fromEntries(Object.keys(shapeData).map((key) => [key, true]))
//   );
//   const [searchTerm, setSearchTerm] = useState('');
//   const [showColorPalette, setShowColorPalette] = useState(false);

//   const toggleCategory = (category) => {
//     setOpenCategories((prev) => ({ ...prev, [category]: !prev[category] }));
//   };

//   const handleSelectColor = (color) => {
//     onSelectColor(color);
//     setShowColorPalette(false);
//   };

//   const filteredShapeData = Object.entries(shapeData).reduce((acc, [category, shapes]) => {
//     const filtered = shapes.filter((shape) =>
//       shape.name.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//     if (filtered.length > 0) {
//       acc[category] = filtered;
//     }
//     return acc;
//   }, {});

//   return (
//     <div className="w-64 h-screen bg-gray-800 text-white flex flex-col">
//       <div className="p-4">
//         <input
//           type="text"
//           placeholder="Search shapes..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="w-full px-2 py-1 bg-gray-700 rounded-md focus:outline-none"
//         />
//       </div>
//       <div className="flex-1 overflow-y-auto">
//         {Object.entries(filteredShapeData).map(([category, shapes]) => (
//           <div key={category} className="p-2">
//             <button
//               onClick={() => toggleCategory(category)}
//               className="w-full text-left font-bold p-2 hover:bg-gray-700 rounded-md flex justify-between items-center"
//             >
//               {category}
//               <span className={`transform transition-transform ${openCategories[category] ? 'rotate-180' : ''}`}>▼</span>
//             </button>
//             {openCategories[category] && (
//               <div className="grid grid-cols-2 gap-2 p-2">
//                 {shapes.map((shape) => (
//                   <DraggableShape key={shape.id} shape={shape} />
//                 ))}
//               </div>
//             )}
//           </div>
//         ))}
//         <div className="mt-4 p-2">
//           <button
//             onClick={() => setShowColorPalette(!showColorPalette)}
//             className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
//           >
//             {showColorPalette ? 'Close Palette' : 'Change Color'}
//           </button>
//           {showColorPalette && <ColorPalette onSelectColor={handleSelectColor} />}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;
import React, { useState } from 'react';
import { shapeData } from '../shapes';
import DraggableShape from './DraggableShape';

const Sidebar = ({ onSelectColor }) => {
  const [openCategories, setOpenCategories] = useState(
    Object.fromEntries(Object.keys(shapeData).map((key) => [key, true]))
  );
  const [searchTerm, setSearchTerm] = useState('');

  const toggleCategory = (category) => {
    setOpenCategories((prev) => ({ ...prev, [category]: !prev[category] }));
  };

  const filteredShapeData = Object.entries(shapeData).reduce((acc, [category, shapes]) => {
    const filtered = shapes.filter((shape) =>
      shape.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (filtered.length > 0) acc[category] = filtered;
    return acc;
  }, {});

  return (
    <div className="w-64 h-full bg-gray-800 text-white flex flex-col">
      {/* Search */}
      <div className="p-4">
        <input
          type="text"
          placeholder="Search shapes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-2 py-1 bg-gray-700 rounded-md focus:outline-none"
        />
      </div>

      {/* Shape categories */}
      <div className="flex-1 overflow-y-auto px-2">
        {Object.entries(filteredShapeData).map(([category, shapes]) => (
          <div key={category} className="mb-4">
            <button
              onClick={() => toggleCategory(category)}
              className="w-full text-left font-bold p-2 hover:bg-gray-700 rounded-md flex justify-between items-center"
            >
              {category}
              <span
                className={`transform transition-transform ${
                  openCategories[category] ? 'rotate-180' : ''
                }`}
              >
                ▼
              </span>
            </button>

            {openCategories[category] && (
              <div className="grid grid-cols-2 gap-2 p-2">
                {shapes.map((shape) => (
                  <div
                    key={shape.id}
                    className="relative group p-1 bg-gray-700 rounded hover:bg-gray-600"
                  >
                    <DraggableShape shape={shape} />
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none whitespace-nowrap">
                      {shape.name}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
