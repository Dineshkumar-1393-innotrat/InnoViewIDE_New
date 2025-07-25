import React, { createContext, useContext } from 'react';
import { ReactFlowProvider, useStore } from 'reactflow';

// Zoom context - now properly connected to ReactFlow
export const ZoomContext = createContext(1);

// ZoomProvider that gets zoom from ReactFlow context
export function ZoomProvider({ children }) {
  return (
    <ReactFlowProvider>
      <ZoomProviderWithReactFlow>
        {children}
      </ZoomProviderWithReactFlow>
    </ReactFlowProvider>
  );
}

function ZoomProviderWithReactFlow({ children }) {
  const zoom = useStore((state) => state.transform[2]);
  return (
    <ZoomContext.Provider value={zoom || 1}>{children}</ZoomContext.Provider>
  );
}

// Hook to use zoom context
export const useZoom = () => {
  const zoom = useContext(ZoomContext);
  return zoom || 1;
};
