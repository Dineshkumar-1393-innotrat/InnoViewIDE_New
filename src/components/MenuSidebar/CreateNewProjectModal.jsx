import React, { useState } from "react";
import { API } from '@/config';
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
  Textarea,
  Select,
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
import { baseURL, productAPIBase } from "../../utilities";
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
  const [description, setDescription] = useState("");
  const [projectCategory, setProjectCategory] = useState("Logistics");
  const [boardType, setBoardType] = useState("STM32 U5");
  const [projectType, setProjectType] = useState("bare metal");
  const [feature, setFeature] = useState("writeCode");
  const [isCreating, setIsCreating] = useState(false); // prevent double-submit

  const {
    user,
    setActiveProductId,
    setActiveProjectId,
    setActiveProductName,
    setActiveProjectName,
    switchProject
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
        `${API.MAIN}/api/v1/createFileAndFolder`,
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
  // const handleCreateProject = async (
  //   fileSystem,
  //   type,
  //   userId,
  //   projectName,
  //   projectType,
  //   boardType,
  //   features
  // ) => {
  //   try {
  //     // First API request to create a product
  //     const response = await axios.post(`${API.MAIN}/product`, {
  //       name: projectName,
  //       userId,
  //     });

  //     console.log("Product Response:", response.data); // Debugging

  //     const productId = response.data.productID;
  //     if (!productId) throw new Error("Product ID not received.");

  //     alert(`${projectName} project created successfully`);

  //     // Second API request to create a file/folder
  //     const { data } = await axios.post(
  //       `${API.MAIN}/api/v1/createFileAndFolder`,
  //       {
  //         parentId: fileSystem?._id,
  //         name: projectName,
  //         type,
  //         userId,
  //         // productId,
  //         projectType,
  //         boardType,
  //         features,
  //       }
  //     );

  //     console.log("Created File/Folder Response:", data); // Debugging

  //     setActiveProductId(data?.file?.productId);
  //     setActiveProjectId(data?.file?._id);
  //     setActiveProductName(data?.file?.name);
  //     setActiveProjectName(data?.file?.name);

  //     await axios.post(
  //       `${API.MAIN}/api/v1/createFileAndFolder`,
  //       {
  //         parentId: data?.file?._id,
  //         name: "simulation.c",
  //         type: "file",
  //         userId,
  //       }
  //     );

  //     console.log("default file created successfully!");

  //     // Refresh the file system if creation was successful
  //     if (data.success) {
  //       fetchFileSystem(userId, setFileSystem, buildTree);
  //     } else {
  //       throw new Error("File/Folder creation failed.");
  //     }

  //     // Navigate based on selected feature
  //     const routeMap = {
  //       writeCode: "/editor",
  //       flowChart: "/FlowchartTest",
  //       blockDiagram: "/BlockDiagram",
  //       simulation: "/simulation",
  //     };

  //     navigate(routeMap[feature] || "/editor");

  //     onClose();
  //   } catch (error) {
  //     console.error("Error creating project:", error?.response?.data?.message);
  //     alert(
  //       error.response?.data?.message || error.message || "An error occurred."
  //     );
  //   }
  // };

  // const handleCreateProject = async (
  //   parentFileSystem,
  //   type,
  //   userId,
  //   projectName,
  //   projectType,
  //   boardType,
  //   feature
  // ) => {
  //   try {
  //     // Single API call: create folder/file & project metadata
  //     const { data } = await axios.post(
  //       `${API.MAIN}/api/v1/createFileAndFolder`,
  //       {
  //         parentId: parentFileSystem?._id,
  //         name: projectName,
  //         type, // "folder" (or "file")
  //         userId,
  //         projectType,
  //         boardType,
  //         features: feature, // matches example payload you showed
  //       }
  //     );

  //     console.log("Created File/Folder Response:", data);

  //     if (!data?.success || !data?.file) {
  //       throw new Error("File/Folder creation failed or returned no file.");
  //     }

  //     const createdFile = data.file;

  //     // Set active ids/names — productId might be undefined if backend doesn't return it
  //     setActiveProductId(createdFile?.productId ?? null);
  //     setActiveProjectId(createdFile?._id ?? null);
  //     setActiveProductName(createdFile?.name ?? projectName);
  //     setActiveProjectName(createdFile?.name ?? projectName);

  //     // Create default file inside the new folder (simulation.c)
  //     // Only attempt when the created entity is a folder
  //     if (createdFile && createdFile._id && type === "folder") {
  //       try {
  //         await axios.post(
  //           `${API.MAIN}/api/v1/createFileAndFolder`,
  //           {
  //             parentId: createdFile._id,
  //             name: "simulation.c",
  //             type: "file",
  //             userId,
  //           }
  //         );
  //         console.log("default file created successfully!");
  //       } catch (e) {
  //         // non-fatal, but log it
  //         console.warn("Default file creation failed:", e);
  //       }
  //     }

  //     // Refresh the file system
  //     fetchFileSystem(userId, setFileSystem, buildTree);

  //     // Navigate by selected feature
  //     const routeMap = {
  //       writeCode: "/editor",
  //       flowChart: "/FlowchartTest",
  //       blockDiagram: "/BlockDiagram",
  //       simulation: "/simulation",
  //     };
  //     navigate(routeMap[feature] || "/editor");

  //     onClose();
  //   } catch (error) {
  //     console.error("Error creating project:", error?.response?.data || error);
  //     alert(
  //       error?.response?.data?.message || error?.message || "An error occurred."
  //     );
  //   }
  // };

  // const handleCreateProject = async (
  //   parentFileSystem,
  //   type,
  //   userId,
  //   projectName,
  //   projectType,
  //   boardType,
  //   feature
  // ) => {
  //   try {
  //     // Single API call: create folder/file & project metadata
  //     const { data } = await axios.post(
  //       `${API.MAIN}/api/v1/createFileAndFolder`,
  //       {
  //         parentId: parentFileSystem?._id,
  //         name: projectName,
  //         type, // "folder" (or "file")
  //         userId,
  //         projectType,
  //         boardType,
  //         features: feature, // matches example payload you showed
  //       }
  //     );

  //     console.log("Created File/Folder Response:", data);

  //     if (!data?.success || !data?.file) {
  //       throw new Error("File/Folder creation failed or returned no file.");
  //     }

  //     const createdFile = data.file;

  //     // Set active ids/names — productId might be undefined if backend doesn't return it
  //     setActiveProductId(createdFile?.productId ?? null);
  //     setActiveProjectId(createdFile?._id ?? null);
  //     setActiveProductName(createdFile?.name ?? projectName);
  //     setActiveProjectName(createdFile?.name ?? projectName);

  //     // --- STORE in localStorage (recommended: one JSON object) ---
  //     // Key: "activeProject"
  //     // Value: { id: "<_id>", name: "<name>", path: "<path>" (optional) }
  //     try {
  //       const projectToStore = {
  //         id: createdFile?._id ?? null,
  //         name: createdFile?.name ?? projectName,
  //         path: createdFile?.path ?? null,
  //         productId: createdFile?.productId ?? null,
  //         createdAt: createdFile?.createdAt ?? null,
  //       };
  //       localStorage.setItem("activeProjectId", projectToStore.id);
  //     } catch (lsErr) {
  //       console.warn("Failed to save project to localStorage:", lsErr);
  //     }

  //     // Create default file inside the new folder (simulation.c)
  //     // Only attempt when the created entity is a folder
  //     if (createdFile && createdFile._id && type === "folder") {
  //       try {
  //         await axios.post(
  //           `${API.MAIN}/api/v1/createFileAndFolder`,
  //           {
  //             parentId: createdFile._id,
  //             name: "simulation.c",
  //             type: "file",
  //             userId,
  //           }
  //         );
  //         console.log("default file created successfully!");
  //       } catch (e) {
  //         // non-fatal, but log it
  //         console.warn("Default file creation failed:", e);
  //       }
  //     }

  //     // Refresh the file system
  //     fetchFileSystem(userId, setFileSystem, buildTree);

  //     // Navigate by selected feature
  //     const routeMap = {
  //       writeCode: "/editor",
  //       flowChart: "/FlowchartTest",
  //       blockDiagram: "/BlockDiagram",
  //       simulation: "/simulation",
  //     };
  //     navigate(routeMap[feature] || "/editor");

  //     onClose();
  //   } catch (error) {
  //     console.error("Error creating project:", error?.response?.data || error);
  //     alert(
  //       error?.response?.data?.message || error?.message || "An error occurred."
  //     );
  //   }
  // };

  //testing one  08-05-26 
  const handleCreateProject = async (
    parentFileSystem,
    type,
    userId,
    projectName,
    projectType,
    boardType,
    feature,
    projDesc,
    category
  ) => {
    try {
      // 1. Create Project in the file system first to get a projectId
      const { data } = await axios.post(
        `${baseURL}/api/v1/createFileAndFolder`,
        {
          parentId: parentFileSystem?._id,
          name: projectName,
          type,
          userId,
          projectType,
          boardType,
          features: feature,
          description: projDesc,
          category: category,
        }
      );

      console.log("Created File/Folder Response:", data);

      if (!data?.success || !data?.file) {
        throw new Error("File/Folder creation failed.");
      }

      const createdFile = data.file;
      const generatedProjectId = createdFile._id;

      // 2. Create Product in the microservice and link the projectId
      const prodResponse = await axios.post(`${productAPIBase}/productNew`, {
        name: projectName,
        userId,
        projectId: generatedProjectId, // Pass projectId to satisfy backend validation
        productDesc: projDesc || "Testing",
        category: category || "Logistics"
      });

      const productId = prodResponse.data.productID || prodResponse.data.productId;
      if (!productId) throw new Error("Product ID generation failed.");

      console.log(`[CreateNewProjectModal] Product created: ${productId}`);

      // Switch to the new project globally
      await switchProject({
        projectId: generatedProjectId,
        projectName: createdFile?.name ?? projectName,
        productId: productId,
        productName: createdFile?.name ?? projectName
      });

      // Refresh filesystem
      await fetchFileSystem(userId, setFileSystem, buildTree);

      // Navigation mapping
      const routeMap = {
        writeCode: "/editor",
        flowChart: "/FlowchartTest",
        blockDiagram: "/BlockDiagram",
        simulation: "/simulation",
      };

      navigate(routeMap[feature] || "/editor");

      onClose();
    } catch (error) {
      console.error(
        "Error creating project:",
        error?.response?.data || error
      );

      alert(
        error?.response?.data?.message ||
        error?.message ||
        "An error occurred."
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
            <FormLabel fontSize="sm" fontWeight="bold">Project Name</FormLabel>
            <Input
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="e.g. Smart Factory Monitor"
              color="gray.800"
              _selection={{ bg: "blue.200", color: "gray.800" }}
            />
          </FormControl>

          <FormControl mt={4}>
            <FormLabel fontSize="sm" fontWeight="bold">Description</FormLabel>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what this project monitors..."
              color="gray.800"
              rows={3}
              resize="none"
            />
          </FormControl>

          <FormControl mt={4}>
            <FormLabel fontSize="sm" fontWeight="bold">Project Category</FormLabel>
            <Select
              value={projectCategory}
              onChange={(e) => setProjectCategory(e.target.value)}
              color="gray.800"
            >
              <option value="Logistics">Logistics</option>
              <option value="Industrial IoT">Industrial IoT</option>
              <option value="Environmental">Environmental</option>
              <option value="Energy">Energy</option>
              <option value="Agriculture">Agriculture</option>
              <option value="Smart Building">Smart Building</option>
            </Select>
          </FormControl>

          <FormControl mt={4} isRequired>
            <FormLabel fontSize="sm" fontWeight="bold">Project Type</FormLabel>
            <RadioGroup value={projectType} onChange={setProjectType}>
              <Stack direction="row">
                <Radio value="bare metal">Bare Metal</Radio>
                {/* <Radio value="RTOS">RTOS</Radio> */}
              </Stack>
            </RadioGroup>
          </FormControl>

          <FormControl mt={4} isRequired>
            <FormLabel fontSize="sm" fontWeight="bold">Board</FormLabel>
            <RadioGroup value={boardType} onChange={setBoardType}>
              <Stack direction="row">
                <Radio value="STM32 U5">STM32 U5</Radio>
                <Radio value="NRF52840">NRF52840</Radio>
                {/* <Radio value="STM32">STM32</Radio> */}
              </Stack>
            </RadioGroup>
          </FormControl>

          <FormControl mt={4}>
            <FormLabel fontSize="sm" fontWeight="bold">Additional Options</FormLabel>
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
            isLoading={isCreating}
            loadingText="Creating…"
            isDisabled={isCreating || !projectName.trim()}
            onClick={async () => {
              if (isCreating) return; // extra guard
              setIsCreating(true);
              try {
                await handleCreateProject(
                  fileSystem, // parent (folder) object
                  folder, // type (e.g. "folder")
                  userId,
                  projectName,
                  projectType,
                  boardType,
                  feature, // string like "writeCode", "flowChart", etc.
                  description,
                  projectCategory
                );
              } catch (error) {
                console.error("Create project error:", error);
              } finally {
                setIsCreating(false);
              }
            }}
          >
            Create
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateNewProjectModal;
