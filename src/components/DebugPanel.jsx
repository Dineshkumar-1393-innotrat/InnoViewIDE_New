import React from 'react';
import { Box, Heading, Text, useColorModeValue } from '@chakra-ui/react';

const DebugPanel = () => {
  const bgColor = useColorModeValue('gray.100', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'gray.100');

  return (
    <Box bg={bgColor} color={textColor} p={4} borderRadius="md" h="100%">
      <Heading size="md" mb={4}>Debug Panel</Heading>
      <Text>Debug output will appear here.</Text>
    </Box>
  );
};

export default DebugPanel;
