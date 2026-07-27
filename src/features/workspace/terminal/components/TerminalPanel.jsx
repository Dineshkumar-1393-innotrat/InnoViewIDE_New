import React, { useEffect, useRef } from "react";
import { Box, Text, useColorModeValue } from "@chakra-ui/react";
import { useSelector } from "react-redux";

const TerminalPanel = () => {
  const { terminalLogs, runtimeState } = useSelector((state) => state.workspace);
  const bottomRef = useRef(null);
  
  const bgColor = useColorModeValue("gray.900", "black");
  const textColor = useColorModeValue("gray.100", "gray.300");

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [terminalLogs]);

  if (runtimeState === "idle" || runtimeState === "uploading") {
    return null;
  }

  return (
    <Box 
      bg={bgColor} 
      color={textColor} 
      p={4} 
      fontFamily="monospace" 
      fontSize="sm"
      overflowY="auto"
      h="250px"
      w="100%"
      borderTop="1px solid"
      borderColor="gray.700"
    >
      {terminalLogs.map((log, index) => (
        <Text key={index} whiteSpace="pre-wrap" mb={1}>{log}</Text>
      ))}
      <div ref={bottomRef} />
    </Box>
  );
};

export default TerminalPanel;
