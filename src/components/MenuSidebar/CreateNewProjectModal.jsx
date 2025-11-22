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
    setActiveProductId,
    setActiveProjectId,
    setActiveProductName,
    setActiveProjectName,
  } = useProject();

  const navigate = useNavigate();

  // DEFAULT file creation
  const createDefaultFile = async (parentId, userId) => {
    try {
      await axios.post("https://eureka.innotrat.in/api/v1/createFileAndFolder", {
        parentId,
        name: "simulation.c",
        type: "file",
        userId,
      });
    } catch (error) {
      console.error(`Error creating default file:`, error);
      alert(
        error.message ||
          error.response?.data?.message ||
          "Error creating default file."
      );
    }
  };

  // ● Create Project Handler
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
      // 1️⃣ Create Product
      const response = await axios.post("https://eureka.innotrat.in/product", {
        name: projectName,
        userId,
      });

      const productId = response.data.productID;
      if (!productId) throw new Error("Product ID not received.");

      alert(`${projectName} project created successfully`);

      // 2️⃣ Create Project Folder/File
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

      setActiveProductId(data?.file?.productId);
      setActiveProjectId(data?.file?._id);
      setActiveProductName(data?.file?.name);
      setActiveProjectName(data?.file?.name);

      // 3️⃣ Create default file
      await createDefaultFile(data?.file?._id, userId);

      // 4️⃣ Refresh UI
      if (data.success) {
        fetchFileSystem(userId, setFileSystem, buildTree);
      } else {
        throw new Error("File/Folder creation failed.");
      }

      // 5️⃣ Navigate
      if (feature === "writeCode") navigate("/embedded");
      else navigate(`/${feature}`);

      onClose();
    } catch (error) {
      console.error(`Error creating project:`, error);
      alert(
        error.response?.data?.message ||
          error.message ||
          "An error occurred while creating project."
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
            />
          </FormControl>

          <FormControl mt={4} isRequired>
            <FormLabel>Project Type</FormLabel>
            <RadioGroup value={projectType} onChange={setProjectType}>
              <Stack direction="row">
                <Radio value="bare metal">Bare Metal</Radio>
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
              await handleCreateProject(
                fileSystem,
                folder,
                userId,
                projectName,
                projectType,
                boardType,
                feature
              );
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
