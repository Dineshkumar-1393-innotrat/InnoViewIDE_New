import React from 'react';
import { Box, Text, Progress, VStack, HStack, Divider, IconButton, ButtonGroup, Tooltip } from '@chakra-ui/react';
import { FaStopCircle, FaPlayCircle, FaSync } from 'react-icons/fa';

const FlashControlPanel = ({ progress, elapsedTime, estimatedTime, deviceInfo, onAbort, onContinue, onRestart }) => {
    const defaultDeviceInfo = {
        name: 'Micro Controller',
        port: 'USB',
        memory: '22000',
        status: 'Connected',
    };

    const finalDeviceInfo = deviceInfo || defaultDeviceInfo;

    return (
        <Box
            p={4}
            bg="gray.800"
            color="white"
            borderRadius="md"
            h="100%"
            w="280px"
        >
            <Text fontSize="lg" fontWeight="bold" mb={4}>Flash Control Panel</Text>
            
            <Progress value={progress} size="sm" colorScheme="green" mb={2} />
            <Text fontSize="xs" color="gray.400" mb={4}>{`Flashing... ${progress.toFixed(0)}% complete`}</Text>

            <ButtonGroup size="md" spacing={4} mb={4}>
                <Tooltip label="Abort" fontSize="md">
                    <IconButton icon={<FaStopCircle />} colorScheme="red" onClick={onAbort} aria-label="Abort" />
                </Tooltip>
                <Tooltip label="Continue" fontSize="md">
                    <IconButton icon={<FaPlayCircle />} colorScheme="yellow" onClick={onContinue} aria-label="Continue" />
                </Tooltip>
                <Tooltip label="Restart" fontSize="md">
                    <IconButton icon={<FaSync />} colorScheme="green" onClick={onRestart} aria-label="Restart" />
                </Tooltip>
            </ButtonGroup>

            <Divider my={4} />

            <VStack spacing={3} align="stretch">
                <Text fontWeight="bold">Device Connection</Text>
                <HStack justify="space-between">
                    <Text fontSize="sm" color="gray.300">Flash Target:</Text>
                    <Text fontSize="sm">{finalDeviceInfo.name}</Text>
                </HStack>
                <HStack justify="space-between">
                    <Text fontSize="sm" color="gray.300">Port:</Text>
                    <Text fontSize="sm">{finalDeviceInfo.port}</Text>
                </HStack>
                <HStack justify="space-between">
                    <Text fontSize="sm" color="gray.300">Memory Capacity:</Text>
                    <Text fontSize="sm">{finalDeviceInfo.memory}</Text>
                </HStack>
                <HStack justify="space-between">
                    <Text fontSize="sm" color="gray.300">Device Status:</Text>
                    <Text fontSize="sm" color="green.400">{finalDeviceInfo.status}</Text>
                </HStack>
            </VStack>

            <Divider my={4} />

            <VStack spacing={3} align="stretch">
                <Text fontWeight="bold">Flashing Time</Text>
                <HStack justify="space-between">
                    <Text fontSize="sm" color="gray.300">Elapsed Time:</Text>
                    <Text fontSize="sm">{elapsedTime}</Text>
                </HStack>
                <HStack justify="space-between">
                    <Text fontSize="sm" color="gray.300">Estimated Time:</Text>
                    <Text fontSize="sm">{estimatedTime}</Text>
                </HStack>
            </VStack>
        </Box>
    );
};

export default FlashControlPanel;
