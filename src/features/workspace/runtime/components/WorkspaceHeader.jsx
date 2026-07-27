import React from "react";
import { Flex, HStack, Button, Text, useColorModeValue } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { Play, Square, RotateCw, Download, Trash2, ExternalLink, Package } from "lucide-react";
import ProjectStatus from "./ProjectStatus";
import { setRuntimeState, appendTerminalLog, clearTerminalLogs } from "../../store/workspaceSlice";

const WorkspaceHeader = () => {
  const dispatch = useDispatch();
  const { runtimeState, projectName, projectType, previewUrl, terminalLogs } = useSelector((state) => state.workspace);
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  const isProcessing = ["uploading", "extracting", "detecting", "installing", "starting"].includes(runtimeState);
  const isRunning = runtimeState === "running";

  if (runtimeState === "idle") return null;

  const handleStart = () => {
    dispatch(setRuntimeState("starting"));
    dispatch(appendTerminalLog("> Starting development server..."));
    setTimeout(() => {
      dispatch(setRuntimeState("running"));
      dispatch(appendTerminalLog("> VITE v7.2.1"));
      dispatch(appendTerminalLog("> Local: http://localhost:5173"));
    }, 1500);
  };

  const handleStop = () => {
    dispatch(setRuntimeState("stopped"));
    dispatch(appendTerminalLog("> Server stopped by user."));
  };

  const handleRestart = () => {
    handleStop();
    setTimeout(() => {
      handleStart();
    }, 1000);
  };

  const handleInstall = () => {
    dispatch(setRuntimeState("installing"));
    dispatch(appendTerminalLog("> Running npm install..."));
    setTimeout(() => {
      dispatch(appendTerminalLog("> added packages, and audited..."));
      dispatch(appendTerminalLog("> Done."));
      dispatch(setRuntimeState("stopped"));
    }, 2000);
  };

  const handleClear = () => {
    dispatch(clearTerminalLogs());
  };

  const handlePreview = () => {
    if (previewUrl) {
      window.open(previewUrl, "_blank");
    }
  };

  const handleDownloadLogs = () => {
    const element = document.createElement("a");
    const file = new Blob([terminalLogs.join("\n")], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${projectName || "project"}-logs.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <Flex 
      w="100%" 
      p={3} 
      bg={bgColor} 
      borderBottom="1px solid" 
      borderColor={borderColor}
      alignItems="center"
      justifyContent="space-between"
    >
      <HStack spacing={4}>
        <Text fontWeight="bold" fontSize="md">
          {projectName || "Untitled Project"}
        </Text>
        <ProjectStatus status={runtimeState} projectType={projectType} />
      </HStack>

      <HStack spacing={2}>
        <Button size="xs" leftIcon={<Play size={14} />} isDisabled={isRunning || isProcessing} colorScheme="green" onClick={handleStart}>
          Start
        </Button>
        <Button size="xs" leftIcon={<Square size={14} />} isDisabled={!isRunning && !isProcessing} colorScheme="red" onClick={handleStop}>
          Stop
        </Button>
        <Button size="xs" leftIcon={<RotateCw size={14} />} isDisabled={!isRunning} variant="outline" onClick={handleRestart}>
          Restart
        </Button>
        <Button size="xs" leftIcon={<Package size={14} />} isDisabled={isRunning || isProcessing} variant="outline" onClick={handleInstall}>
          Install
        </Button>
        <Button size="xs" leftIcon={<ExternalLink size={14} />} isDisabled={!previewUrl} variant="outline" onClick={handlePreview}>
          Preview
        </Button>
        <Button size="xs" leftIcon={<Trash2 size={14} />} variant="ghost" colorScheme="red" title="Clear Terminal" onClick={handleClear}>
          Clear
        </Button>
        <Button size="xs" leftIcon={<Download size={14} />} variant="ghost" title="Download Logs" onClick={handleDownloadLogs}>
          Logs
        </Button>
      </HStack>
    </Flex>
  );
};

export default WorkspaceHeader;
