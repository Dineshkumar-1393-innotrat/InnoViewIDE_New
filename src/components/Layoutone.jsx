import Sidebarone from '../components/Sidebarone';
import Canvas, { ZoomProvider, useZoom } from './Canvas';
import Header from './Header';
import { useState } from 'react';
import { exportAsPng as exportImage } from '../utils/exportImage';
// import { applyNodeChanges } from 'reactflow';
import { ReactFlowProvider } from 'reactflow';


export default function Layout() {
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
      <ReactFlowProvider>
        <ZoomProvider>
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
                fixed top-0 left-0 z-40 h-full bg-sidebar-modern transition-transform duration-300 ease-in-out 
                transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
                sm:static sm:translate-x-0 sm:w-64 sm:flex-shrink-0
              `}
              style={{ transitionProperty: 'transform, width' }}
            >
              <Sidebarone sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
            </div>

            {/* Main Canvas Area */}
            <main className="flex-1 h-full relative bg-canvas-modern">
              <Canvas />
            </main>
          </div>
        </ZoomProvider>
      </ReactFlowProvider>
    </div>
  );
}
