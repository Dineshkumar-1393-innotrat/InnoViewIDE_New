import Sidebarone from '../components/Sidebarone';
import Canvas from './Canvas';
import Header from './Header';
import { useState } from 'react';
import { exportAsPng as exportImage } from '../utils/exportImage';
import { DndProvider } from 'react-dnd';
import { MultiBackend, TouchTransition } from 'react-dnd-multi-backend';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { ZoomProvider, useZoom } from '../contexts/ZoomContext';

const DND_PIPELINE = {
  backends: [
    {
      id: 'html5',
      backend: HTML5Backend,
      transition: TouchTransition,
    },
    {
      id: 'touch',
      backend: TouchBackend,
      options: { enableMouseEvents: true },
      preview: true,
      transition: TouchTransition,
    },
  ],
};

// Component that uses zoom context
function LayoutOneContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const zoom = useZoom();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleZoomIn = () => window.dispatchEvent(new Event('zoom-in'));
  const handleZoomOut = () => window.dispatchEvent(new Event('zoom-out'));
  const handleSave = () => window.dispatchEvent(new Event('save-json'));
  const handleExport = () => window.dispatchEvent(new Event('export-image'));

  const handleLoadJSON = (event) => {
    const loadEvent = new CustomEvent('load-json-file', {
      detail: event.target.files[0],
    });
    window.dispatchEvent(loadEvent);
  };

  return (
    <div className="h-screen flex flex-col bg-canvas-modern text-gray-200">
      <div className="bg-header-modern">
        <Header
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          handleSave={handleSave}
          handleExport={handleExport}
          toggleSidebar={toggleSidebar}
          exportImage={exportImage}
          zoom={zoom}
        />
      </div>
      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar */}
        <div
          className={`
            fixed top-0 left-0 z-40 h-full transition-transform duration-300 ease-in-out 
            transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
            lg:static lg:translate-x-0
            ${sidebarOpen ? 'pointer-events-auto' : 'pointer-events-none'}
          `}
        >
          <div className="pointer-events-auto h-full w-64">
            <Sidebarone sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
          </div>
        </div>

        {/* Main Canvas Area */}
        <main className="flex-1 h-full relative bg-canvas-modern">
          <Canvas />
        </main>
      </div>
    </div>
  );
}

export default function Layoutone() {
  return (
    <DndProvider backend={MultiBackend} options={DND_PIPELINE}>
      <ZoomProvider>
        <LayoutOneContent />
      </ZoomProvider>
    </DndProvider>
  );
}

