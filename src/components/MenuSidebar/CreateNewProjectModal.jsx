import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  RadioGroup,
  Stack,
  Radio,
  VStack,
  Checkbox,
  Button,
  useToast,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useProject } from "../../ProjectContext";
import projectFileManager from "../../utils/projectFileManager";

const CreateNewProjectModal = ({
  isOpen,
  onClose,
}) => {
  const [projectName, setProjectName] = useState("");
  const [boardType, setBoardType] = useState("STM32 U5");
  const [projectType, setProjectType] = useState("bare metal");
  const [feature, setFeature] = useState("writeCode");
  const [isCreating, setIsCreating] = useState(false);

  const {
    user,
    setActiveProductId,
    setActiveProjectId,
    setActiveProductName,
    setActiveProjectName,
  } = useProject();

  const navigate = useNavigate();
  const toast = useToast();

  /**
   * Handle project creation using the new localStorage-based system
   */
  const handleCreateProject = async () => {
    if (!projectName.trim()) {
      toast({
        title: "Project name required",
        description: "Please enter a valid project name",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsCreating(true);

    try {
      // Create project using the new project file manager
      const project = projectFileManager.createProject({
        projectName: projectName.trim(),
        projectType,
        boardType,
        selectedFeature: feature,
        userId: user?.id || user?.userId || 'default_user'
      });

      // Update project context
      setActiveProductId(project.id);
      setActiveProjectId(project.id);
      setActiveProductName(project.name);
      setActiveProjectName(project.name);

      // Show success message
      toast({
        title: "Project created successfully!",
        description: `${project.name} has been created with organized folder structure`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      // Navigate to appropriate screen based on selected feature
      const routeMap = {
        'writeCode': '/embedded',
        'FlowchartTest': '/FlowchartTest', 
        'blockDiagram': '/BlockDiagram',
        'Blockprogramming': '/blockprogramming',
        'simulation': '/simulation'
      };

      const targetRoute = routeMap[feature] || '/embedded';
      navigate(targetRoute);

      // Reset form and close modal
      setProjectName("");
      setFeature("writeCode");
      onClose();

    } catch (error) {
      console.error("Error creating project:", error);
      toast({
        title: "Failed to create project",
        description: error.message || "An unexpected error occurred",
        status: "error", 
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create New Project</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl isRequired>
            <FormLabel>Project Name</FormLabel>
            <Input
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Enter project name"
            />
          </FormControl>

          <FormControl mt={4} isRequired>
            <FormLabel>Project Type</FormLabel>
            <RadioGroup value={projectType} onChange={setProjectType}>
              <Stack direction="row">
                <Radio value="bare metal">Bare Metal</Radio>
                {/* <Radio value="RTOS">RTOS</Radio> */}
              </Stack>
            </RadioGroup>
          </FormControl>

          <FormControl mt={4} isRequired>
            <FormLabel>Board</FormLabel>
            <RadioGroup value={boardType} onChange={setBoardType}>
              <Stack direction="row">
                <Radio value="STM32 U5">STM32 U5</Radio>
                <Radio value="NRF52840">NRF52840</Radio>
              </Stack>
            </RadioGroup>
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Additional Options</FormLabel>
            <RadioGroup value={feature} onChange={setFeature}>
              <VStack align="start">
                <Radio value="writeCode">Write Code</Radio>
                <Radio value="FlowchartTest">Flow Chart</Radio>
                <Radio value="blockDiagram">Block Diagram</Radio>
                <Radio value="simulation">Simulation</Radio>
                <Radio value="Blockprogramming">Block Programming</Radio>
              </VStack>
            </RadioGroup>
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button variant="outline" mr={3} onClick={onClose} isDisabled={isCreating}>
            Cancel
          </Button>
          <Button
            colorScheme="blue"
            onClick={handleCreateProject}
            isLoading={isCreating}
            loadingText="Creating..."
            isDisabled={!projectName.trim()}
          >
            Create
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateNewProjectModal;
