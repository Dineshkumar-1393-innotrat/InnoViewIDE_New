// import React from "react";
// import {
//   Undo,
//   Redo,
//   ZoomIn,
//   ZoomOut,
//   Download,
//   Save,
//   FileUp,
// } from "lucide-react";

// const Header = ({
//   onUndo,
//   onRedo,
//   onZoomIn,
//   onZoomOut,
//   onSave,
//   onLoad,
//   onDownloadImage,
//   canUndo,
//   canRedo,
// }) => {
//   const fileInputRef = React.useRef(null);

//   const handleLoadClick = () => {
//     fileInputRef.current.click();
//   };

//   return (
//     <header className="absolute top-0 left-0 right-0 z-10 bg-gray-800 text-white p-2 flex justify-between items-center shadow-md">
//       {/* <h1 className="text-xl font-bold">Innotrat IDE</h1> */}
//       <div className="flex items-center gap-2">
//         <button
//   onClick={onUndo}
//   disabled={!canUndo}
//   className="p-2 rounded hover:bg-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
//   title="Undo"
// >
//   <Undo size={18} />
// </button>

// <button
//   onClick={onRedo}
//   disabled={!canRedo}
//   className="p-2 rounded hover:bg-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
//   title="Redo"
// >
//   <Redo size={18} />
// </button>

//         {/* <button
//           onClick={onUndo}
//           disabled={!canUndo}
//           className="p-2 hover:bg-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed"
//           title="Undo"
//         >
//           <Undo size={18} />
//         </button>
//         <button
//           onClick={onRedo}
//           disabled={!canRedo}
//           className="p-2 hover:bg-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed"
//           title="Redo"
//         >
//           <Redo size={18} />
//         </button> */}
//         <div className="w-px h-6 bg-gray-600 mx-2" />
//         <button
//           onClick={onZoomIn}
//           className="p-2 hover:bg-gray-700 rounded"
//           title="Zoom In"
//         >
//           <ZoomIn size={18} />
//         </button>
//         <button
//           onClick={onZoomOut}
//           className="p-2 hover:bg-gray-700 rounded"
//           title="Zoom Out"
//         >
//           <ZoomOut size={18} />
//         </button>
//         <div className="w-px h-6 bg-gray-600 mx-2" />
//         <button
//           onClick={onSave}
//           className="p-2 hover:bg-gray-700 rounded"
//           title="Save as JSON"
//         >
//           <Save size={18} />
//         </button>
//         <button
//           onClick={handleLoadClick}
//           className="p-2 hover:bg-gray-700 rounded"
//           title="Load JSON"
//         >
//           <FileUp size={18} />
//         </button>
//         <input
//           type="file"
//           ref={fileInputRef}
//           onChange={onLoad}
//           style={{ display: "none" }}
//           accept="application/json"
//         />
//         <button
//           onClick={onDownloadImage}
//           className="p-2 hover:bg-gray-700 rounded"
//           title="Download as PNG"
//         >
//           <Download size={18} />
//         </button>
//       </div>
//     </header>
//   );
// };

// export default Header;


// import React from "react";
// import {
//   Undo,
//   Redo,
//   ZoomIn,
//   ZoomOut,
//   Download,
//   Save,
//   FileUp,
// } from "lucide-react";

// const Header = ({
//   onUndo,
//   onRedo,
//   onZoomIn,
//   onZoomOut,
//   onSave,
//   onLoad,
//   onDownloadImage,
//   canUndo,
//   canRedo,
// }) => {
//   const fileInputRef = React.useRef(null);

//   const handleLoadClick = () => {
//     if (fileInputRef.current) {
//       fileInputRef.current.click();
//     }
//   };

//   return (
//     <header className="absolute top-0 left-0 right-0 z-10 bg-gray-800 text-white p-2 flex justify-between items-center shadow-md">
//       <div className="flex items-center gap-2">
//         {/* Undo & Redo */}
//         <button
//           onClick={onUndo}
//           disabled={!canUndo}
//           className="p-2 rounded hover:bg-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
//           title="Undo"
//         >
//           <Undo size={18} />
//         </button>
//         <button
//           onClick={onRedo}
//           disabled={!canRedo}
//           className="p-2 rounded hover:bg-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
//           title="Redo"
//         >
//           <Redo size={18} />
//         </button>

//         <div className="w-px h-6 bg-gray-600 mx-2" />

//         {/* Zoom In & Zoom Out */}
//         <button
//           onClick={onZoomIn}
//           className="p-2 rounded hover:bg-gray-700 transition"
//           title="Zoom In"
//         >
//           <ZoomIn size={18} />
//         </button>
//         <button
//           onClick={onZoomOut}
//           className="p-2 rounded hover:bg-gray-700 transition"
//           title="Zoom Out"
//         >
//           <ZoomOut size={18} />
//         </button>

//         <div className="w-px h-6 bg-gray-600 mx-2" />

//         {/* Save, Load, Export */}
//         <button
//           onClick={onSave}
//           className="p-2 rounded hover:bg-gray-700 transition"
//           title="Save as JSON"
//         >
//           <Save size={18} />
//         </button>
//         <button
//           onClick={handleLoadClick}
//           className="p-2 rounded hover:bg-gray-700 transition"
//           title="Load JSON"
//         >
//           <FileUp size={18} />
//         </button>
//         <input
//           type="file"
//           ref={fileInputRef}
//           onChange={onLoad}
//           style={{ display: "none" }}
//           accept="application/json"
//         />
//         <button
//           onClick={onDownloadImage}
//           className="p-2 rounded hover:bg-gray-700 transition"
//           title="Download as PNG"
//         >
//           <Download size={18} />
//         </button>
//       </div>
//     </header>
//   );
// };

// export default Header;
import React, { useRef, useState } from 'react';
import {
  Undo,
  Redo,
  ZoomIn,
  ZoomOut,
  Download,
  Save,
  FileUp,
  UserCircle2,
} from 'lucide-react';

const Header = ({
  onUndo,
  onRedo,
  onZoomIn,
  onZoomOut,
  onSave,
  onLoad,
  onDownloadImage,
  canUndo,
  canRedo,
}) => {
  const fileInputRef = useRef(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLoadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleToggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  return (
    <header className="absolute top-0 left-0 right-0 z-10 bg-gray-800 text-white px-4 py-2 flex flex-wrap justify-between items-center shadow-md">
      {/* Left tools */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className="p-2 rounded hover:bg-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          title="Undo"
        >
          <Undo size={18} />
        </button>
        <button
          onClick={onRedo}
          disabled={!canRedo}
          className="p-2 rounded hover:bg-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          title="Redo"
        >
          <Redo size={18} />
        </button>

        <div className="w-px h-6 bg-gray-600 mx-1" />

        <button
          onClick={onZoomIn}
          className="p-2 rounded hover:bg-gray-700 transition"
          title="Zoom In"
        >
          <ZoomIn size={18} />
        </button>
        <button
          onClick={onZoomOut}
          className="p-2 rounded hover:bg-gray-700 transition"
          title="Zoom Out"
        >
          <ZoomOut size={18} />
        </button>

        <div className="w-px h-6 bg-gray-600 mx-1" />

        <button
          onClick={onSave}
          className="p-2 rounded hover:bg-gray-700 transition"
          title="Save as JSON"
        >
          <Save size={18} />
        </button>
        <button
          onClick={handleLoadClick}
          className="p-2 rounded hover:bg-gray-700 transition"
          title="Load JSON"
        >
          <FileUp size={18} />
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={onLoad}
          style={{ display: 'none' }}
          accept="application/json"
        />
        <button
          onClick={onDownloadImage}
          className="p-2 rounded hover:bg-gray-700 transition"
          title="Download as PNG"
        >
          <Download size={18} />
        </button>
      </div>

      {/* Avatar + Dropdown */}
      <div className="relative">
        <button
          onClick={handleToggleDropdown}
          className="p-2 rounded-full hover:bg-gray-700 transition"
          title="Account"
        >
          <UserCircle2 size={28} />
        </button>
        {showDropdown && (
          <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded-md shadow-lg z-50 overflow-hidden">
            <button
              onClick={() => alert('Sign In clicked')}
              className="w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              Sign In
            </button>
            <button
              onClick={() => alert('Logout clicked')}
              className="w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
