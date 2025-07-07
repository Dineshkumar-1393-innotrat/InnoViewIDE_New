

import React, { useState } from 'react';
import { Handle, Position, NodeResizer } from 'reactflow';
import Shape from './Shape';

const ResizableNode = ({ id, data, selected }) => {
  const { shape, onNameChange } = data;
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(shape.name);

  const handleDoubleClick = () => setIsEditing(true);
  const handleNameChange = (e) => setName(e.target.value);
  const handleBlur = () => {
    setIsEditing(false);
    onNameChange(id, name);
  };
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleBlur();
  };

  const handleStyle = `!w-3 !h-3 !bg-gray-400 ${selected ? 'opacity-100' : 'opacity-0'} transition-opacity`;

  return (
    <div className="relative w-full h-full group">
      <NodeResizer
        minWidth={50}
        minHeight={30}
        isVisible={selected}
        lineClassName="border-blue-500"
        handleClassName="bg-white border-2 border-blue-500"
        keepAspectRatio
      />

      {/* Target Handles */}
      <Handle id="t" type="target" position={Position.Top} className={handleStyle} />
      <Handle id="r" type="target" position={Position.Right} className={handleStyle} />
      <Handle id="b" type="target" position={Position.Bottom} className={handleStyle} />
      <Handle id="l" type="target" position={Position.Left} className={handleStyle} />

      {/* Source Handles */}
      <Handle id="t" type="source" position={Position.Top} className={handleStyle} />
      <Handle id="r" type="source" position={Position.Right} className={handleStyle} />
      <Handle id="b" type="source" position={Position.Bottom} className={handleStyle} />
      <Handle id="l" type="source" position={Position.Left} className={handleStyle} />

      <Shape icon={shape.icon} name={shape.name} onCanvas={true} />

      <div
        className="absolute top-0 left-0 w-full h-full flex items-center justify-center p-2"
        onDoubleClick={handleDoubleClick}
      >
        {isEditing ? (
          <input
            type="text"
            value={name}
            onChange={handleNameChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent text-white text-center border-none  focus:outline-none"
            autoFocus
          />
        ) : (
          <p className="text-white text-center font-semibold text-sm text-top break-words">{name}</p>
        )}
      </div>
    </div>
  );
};

export default ResizableNode;

// import React, { useState } from 'react'; 2
// import { Handle, Position, NodeResizer } from 'reactflow';
// import Shape from './Shape';

// const ResizableNode = ({ id, data, selected }) => {
//   const { shape, onNameChange } = data;
//   const [isEditing, setIsEditing] = useState(false);
//   const [name, setName] = useState(shape.name);

//   const handleDoubleClick = () => setIsEditing(true);
//   const handleNameChange = (e) => setName(e.target.value);
//   const handleBlur = () => {
//     setIsEditing(false);
//     onNameChange(id, name);
//   };
//   const handleKeyDown = (e) => {
//     if (e.key === 'Enter') handleBlur();
//   };

//   const positions = [Position.Top, Position.Right, Position.Bottom, Position.Left];

//   return (
//     <div className="relative w-full h-full group">
//       <NodeResizer
//         minWidth={50}
//         minHeight={30}
//         isVisible={selected}
//         lineClassName="border-blue-500"
//         handleClassName="bg-white border-2 border-blue-500"
//         keepAspectRatio
//       />

//       {positions.map((pos) => (
//         <Handle
//           key={`target-${pos}`}
//           type="target"
//           position={pos}
//           className="!w-3 !h-3 !bg-gray-400 opacity-100"
//         />
//       ))}
//       {positions.map((pos) => (
//         <Handle
//           key={`source-${pos}`}
//           type="source"
//           position={pos}
//           className="!w-3 !h-3 !bg-gray-400 opacity-100"
//         />
//       ))}

//       <Shape icon={shape.icon} name={shape.name} onCanvas={true} />
//       <div
//         className="absolute top-0 left-0 w-full h-full flex items-center justify-center p-2"
//         onDoubleClick={handleDoubleClick}
//       >
//         {isEditing ? (
//           <input
//             type="text"
//             value={name}
//             onChange={handleNameChange}
//             onBlur={handleBlur}
//             onKeyDown={handleKeyDown}
//             className="w-full bg-transparent text-white text-center border-none focus:outline-none"
//             autoFocus
//           />
//         ) : (
//           <p className="text-white text-center font-semibold text-sm break-words">{name}</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ResizableNode;

// import React, { useState } from 'react';  1 
// import { Handle, Position, NodeResizer } from 'reactflow';
// import Shape from './Shape';

// const ResizableNode = ({ id, data, selected }) => {
//   const { shape, onNameChange } = data;
//   const [isEditing, setIsEditing] = useState(false);
//   const [name, setName] = useState(shape.name);

//   const handleDoubleClick = () => {
//     setIsEditing(true);
//   };

//   const handleNameChange = (e) => {
//     setName(e.target.value);
//   };

//   const handleBlur = () => {
//     setIsEditing(false);
//     onNameChange(id, name);
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === 'Enter') {
//       handleBlur();
//     }
//   };

//   return (
//     <div className="relative w-full h-full group">
//       <NodeResizer minWidth={50} minHeight={30} isVisible={selected} lineClassName="border-blue-500" handleClassName="bg-white border-2 border-blue-500" keepAspectRatio />

//       {/* Handles for connections */}
//       <Handle type="target" position={Position.Top} className={`!w-3 !h-3 !bg-gray-400 ${selected ? 'opacity-100' : 'opacity-0'} transition-opacity`} />
//       <Handle type="target" position={Position.Right} className={`!w-3 !h-3 !bg-gray-400 ${selected ? 'opacity-100' : 'opacity-0'} transition-opacity`} />
//       <Handle type="target" position={Position.Bottom} className={`!w-3 !h-3 !bg-gray-400 ${selected ? 'opacity-100' : 'opacity-0'} transition-opacity`} />
//       <Handle type="target" position={Position.Left} className={`!w-3 !h-3 !bg-gray-400 ${selected ? 'opacity-100' : 'opacity-0'} transition-opacity`} />
//       <Handle type="source" position={Position.Top} className={`!w-3 !h-3 !bg-gray-400 ${selected ? 'opacity-100' : 'opacity-0'} transition-opacity`} />
//       <Handle type="source" position={Position.Right} className={`!w-3 !h-3 !bg-gray-400 ${selected ? 'opacity-100' : 'opacity-0'} transition-opacity`} />
//       <Handle type="source" position={Position.Bottom} className={`!w-3 !h-3 !bg-gray-400 ${selected ? 'opacity-100' : 'opacity-0'} transition-opacity`} />
//       <Handle type="source" position={Position.Left} className={`!w-3 !h-3 !bg-gray-400 ${selected ? 'opacity-100' : 'opacity-0'} transition-opacity`} />

//       <Shape icon={shape.icon} name={shape.name} onCanvas={true} />
//       <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center p-2" onDoubleClick={handleDoubleClick} style={{top:"0"}}>
//         {isEditing ? (
//           <input
//             type="text"
//             value={name}
//             onChange={handleNameChange}
//             onBlur={handleBlur}
//             onKeyDown={handleKeyDown}
//             className="w-full bg-transparent text-white text-center border-none focus:outline-none"
//             autoFocus
//           />
//         ) : (
//           <p className="text-white text-center font-semibold text-sm break-words">{name}</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ResizableNode;