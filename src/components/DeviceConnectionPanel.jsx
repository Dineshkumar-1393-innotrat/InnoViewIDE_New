import React from 'react';
import { Box, Text, VStack, HStack, Button } from '@chakra-ui/react';

const DeviceConnectionPanel = ({ device, error, onConnectClick }) => {
    const deviceInfo = device ? device.getInfo() : null;

    return (
        <Box p={4} bg="gray.800" color="white" borderRadius="md" w="100%">
            <Text fontSize="lg" fontWeight="bold" mb={4}>Device Connection</Text>
            {error && <Text color="red.400">{error}</Text>}
            {device ? (
                <VStack spacing={3} align="stretch">
                    <HStack justify="space-between">
                        <Text fontSize="sm" color="gray.300">Vendor ID:</Text>
                        <Text fontSize="sm">{deviceInfo.usbVendorId}</Text>
                    </HStack>
                    <HStack justify="space-between">
                        <Text fontSize="sm" color="gray.300">Product ID:</Text>
                        <Text fontSize="sm">{deviceInfo.usbProductId}</Text>
                    </HStack>
                    <HStack justify="space-between">
                        <Text fontSize="sm" color="gray.300">Status:</Text>
                        <Text fontSize="sm" color="green.400">Connected</Text>
                    </HStack>
                </VStack>
            ) : (
                <Button onClick={onConnectClick} size="sm" colorScheme="blue">
                    Connect Device
                </Button>
            )}
        </Box>
    );
};

export default DeviceConnectionPanel;
