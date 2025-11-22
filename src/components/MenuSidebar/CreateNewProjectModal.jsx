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
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useProject } from "../../ProjectContext";
import axios from "axios";
import { fetchFileSystem } from "../EmbeddedFileManagement/EmbeddedFileManagement";
import { buildTree } from "../EmbeddedFileManagement/EmbeddedFileManagement";

const CreateNewProjectModal = ({
  isOpen,
  onClose,
  // handleCreateProject,
  fileSystem,
  folder,
  userId,
  setFileSystem,
}) => {
  const [projectName, setProjectName] = useState("");
  const [boardType, setBoardType] = useState("STM32 U5");
  const [projectType, setProjectType] = useState("bare metal");
  const [feature, setFeature] = useState("writeCode");

  const {
    user,
    setActiveProductId,
    setActiveProjectId,
    setActiveProductName,
    setActiveProjectName,
  } = useProject();

  const navigate = useNavigate();

  //   const handleCreate = () => {
  //     console.log({
  //       projectName,
  //       projectType,
  //       boardType,
  //       features,
  //     });
  //     onClose();
  //   };

  const createDefaultFile = async (parentId, userId) => {
    try {
      const { data } = await axios.post(
        "https://eureka.innotrat.in/api/v1/createFileAndFolder",
        {
          parentId: parentId,
          name: "simulation.c",
          type: "file",
          userId,
        }
      );
    } catch (error) {
      console.error(`Error creating ${type}:`, error);

      // Handle both validation errors & API errors
      alert(
        error.message || error.response?.data?.message || "An error occurred."
      );
    }
  };

  //   handle create project
  const handleCreateProject = async (
    fileSystem,
    type,
    userId,
    projectName,
    projectType,
    boardType,
    features
  ) => {
    try {
      // First API request to create a product
      const response = await axios.post("https://eureka.innotrat.in/product", {
        name: projectName,
        userId,
      });

      console.log("Product Response:", response.data); // Debugging

      const productId = response.data.productID;
      if (!productId) throw new Error("Product ID not received.");

      alert(`${projectName} project created successfully`);

      // Second API request to create a file/folder
      const { data } = await axios.post(
        "https://eureka.innotrat.in/api/v1/createFileAndFolder",
        {
          parentId: fileSystem?._id,
          name: projectName,
          type,
          userId,
          productId,
          projectType,
          boardType,
          features,
        }
      );

      console.log("Created File/Folder Response:", data); // Debugging

      setActiveProductId(data?.file?.productId);
      setActiveProjectId(data?.file?._id);
      setActiveProductName(data?.file?.name);
      setActiveProjectName(data?.file?.name);

      await axios.post(
        "https://eureka.innotrat.in/api/v1/createFileAndFolder",
        {
          parentId: data?.file?._id,
          name: "simulation.c",
          type: "file",
          userId,
        }
      );

      console.log("default file created successfully!");

      // Refresh the file system if creation was successful
      if (data.success) {
        fetchFileSystem(userId, setFileSystem, buildTree);
      } else {
        throw new Error("File/Folder creation failed.");
      }

      if (feature === "writeCode") navigate("/editor");
      else navigate(`/${feature}`);

      onClose();
    } catch (error) {
      console.error("Error creating project:", error?.response?.data?.message);
      alert(
        error.response?.data?.message || error.message || "An error occurred."
      );
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
              color="gray.800"
              _selection={{ bg: "blue.200", color: "gray.800" }}
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
                <Radio value="flowChart">Flow Chart</Radio>
                <Radio value="blockDiagram">Block Diagram</Radio>
                <Radio value="simulation">Simulation</Radio>
              </VStack>
            </RadioGroup>
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button variant="outline" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button
            colorScheme="blue"
            onClick={async () => {
              try {
                await handleCreateProject(
                  fileSystem,
                  folder,
                  userId,
                  projectName,
                  projectType,
                  boardType,
                  feature
                );
              } catch (error) {
                console.log(error);
              }
            }}
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
