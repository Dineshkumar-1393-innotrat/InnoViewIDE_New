import React from 'react';
import FileExplorer from './FileExplorer';
import DeviceConnectionPanel from './DeviceConnectionPanel';
import { VStack, Divider } from '@chakra-ui/react';

const GlobalSidebar = ({ fileSystem, onFileSystemUpdate, refreshFileSystem, device, deviceError, onConnectClick }) => {
  return (
    <div className="w-full h-full bg-gray-800 border-r border-gray-700 p-4 overflow-y-auto">
      <VStack spacing={4} align="stretch">
        <FileExplorer 
          onFileSystemUpdate={onFileSystemUpdate} 
          refreshFileSystem={refreshFileSystem} 
        />
        <Divider />
        <DeviceConnectionPanel device={device} error={deviceError} onConnectClick={onConnectClick} />
      </VStack>
    </div>
  );
};

export default GlobalSidebar;
