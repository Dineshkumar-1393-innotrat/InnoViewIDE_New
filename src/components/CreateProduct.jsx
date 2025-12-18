
import {
  Box,
  VStack,
  HStack,
  Text,
  Input,
  Textarea,
  Button,
  Select,
  IconButton,
  useToast,
  Grid,
  GridItem,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { AddIcon, EditIcon, DeleteIcon } from "@chakra-ui/icons";
import axios from "axios";

export default function ProductDefinition() {
  const toast = useToast();

  // compnneets type
  const [componentTypes, setComponentTypes] = useState([]);
  const [selectedComponentTypes, setSelectedComponentTypes] = useState('');
  const [loadingComponentType, setLoadingComponentType] = useState(true);

  // basic states
  const [urlLink, setUrlLink] = useState("");
  const [note, setNote] = useState("");

  // Step 1 (popup) or Step 2 (full form)
  const [step, setStep] = useState(1);

  // Basic Info (Step 1 + reused in Step 2)
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");

  // Basic Info - Step 2
  const [numDevices, setNumDevices] = useState(1); // numeric

  // Selected Component & Component Name
  const [selectedComponent, setSelectedComponent] = useState(""); // Sensor / Actuator
  const [selectedComponentName, setSelectedComponentName] = useState(""); // e.g. Flame Sensor

  // Components list (type + name + parameters)
  const [components, setComponents] = useState([]);

  // deviceInfos is an array of device identity objects (one per device)
  const [deviceInfos, setDeviceInfos] = useState([{ imei: "", iccid: "", phone: "" }]);

  // Popup for adding a new Component (type + name)
  const [showComponentPopup, setShowComponentPopup] = useState(false);
  const [newComponent, setNewComponent] = useState({
    name: "",
    type: "Sensor", // Sensor / Actuator
  });

  // small editing states for inline edit controls
  const [editingParam, setEditingParam] = useState(null); // { compIndex, paramIndex } or null
  const [editingComponentIndex, setEditingComponentIndex] = useState(null); // index or null

  const inputStyles = {
    bg: "white",
    color: "black",
    _placeholder: { color: "gray.400" },
  };

  // Keep deviceInfos in sync with numDevices
  useEffect(() => {
    const n = Number(numDevices) || 0;
    setDeviceInfos((prev) => {
      const copy = [...prev];
      if (n <= 0) return [];
      if (copy.length === n) return copy;
      if (copy.length < n) {
        // push empty entries
        return [
          ...copy,
          ...Array.from({ length: n - copy.length }, () => ({ imei: "", iccid: "", phone: "" })),
        ];
      }
      // truncate if larger
      return copy.slice(0, n);
    });
  }, [numDevices]);

  // helper to update a particular device's field
  const handleDeviceInfoChange = (index, field, value) => {
    setDeviceInfos((prev) => {
      const copy = [...prev];
      if (!copy[index]) copy[index] = { imei: "", iccid: "", phone: "" };
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  // existing handlers (addComponent, addParameter, updateParameter, handleVariableChange)
  const addComponent = (compData) => {
    setComponents((prev) => [
      ...prev,
      {
        ...compData,
        name: compData.name || "",
        type: compData.type || "Sensor",
        parameters: compData.parameters || [],
      },
    ]);

    toast({
      title: "Component added successfully!",
      description: `"${compData.name}" has been added to the list`,
      status: "success",
      duration: 2000,
    });
  };

  const addParameter = (compIndex, type) => {
    if (compIndex < 0 || compIndex >= components.length) return;
    setComponents((prev) => {
      const updated = [...prev];
      updated[compIndex].parameters.push({
        type: type === "constant" ? "constant" : "inconstant",
        name: "",
        min: "",
        max: "",
        unit: "",
        value: "",
      });
      return updated;
    });
  };

  const updateParameter = (compIndex, paramIndex, field, value) => {
    setComponents((prev) => {
      const updated = [...prev];
      if (!updated[compIndex] || !updated[compIndex].parameters[paramIndex]) return prev;
      updated[compIndex].parameters[paramIndex][field] = value;
      return updated;
    });
  };

  const handleVariableChange = (compIndex, paramIndex, newValue) => {
    setComponents((prev) => {
      const updated = [...prev];
      const param = updated[compIndex].parameters[paramIndex];
      param.type = newValue === "Constant" ? "constant" : "inconstant";
      updated[compIndex].parameters[paramIndex] = param;
      return updated;
    });
  };

  // ---------- New helpers: edit / delete ----------
  const deleteParameter = (compIndex, paramIndex) => {
    if (!window.confirm("Delete this parameter?")) return;
    setComponents((prev) => {
      const copy = [...prev];
      if (!copy[compIndex]) return prev;
      copy[compIndex] = {
        ...copy[compIndex],
        parameters: copy[compIndex].parameters.filter((_, i) => i !== paramIndex),
      };
      return copy;
    });
  };

  const saveParameterField = (compIndex, paramIndex, field, value) => {
    updateParameter(compIndex, paramIndex, field, value);
    setEditingParam(null);
  };

  const deleteComponent = (compIndex) => {
    if (!window.confirm("Delete this component and its parameters?")) return;
    setComponents((prev) => {
      const copy = prev.filter((_, i) => i !== compIndex);
      return copy;
    });
    // clear selection if needed
    setSelectedComponent((curr) => {
      if (!components[compIndex]) return curr;
      if (components[compIndex].type === curr) return "";
      return curr;
    });
    setSelectedComponentName((curr) => {
      if (!components[compIndex]) return curr;
      if (components[compIndex].name === curr) return "";
      return curr;
    });
  };

  const deleteDeviceInfo = (index) => {
    if (!window.confirm("Delete this device info?")) return;
    setDeviceInfos((prev) => {
      const copy = [...prev];
      copy.splice(index, 1);
      // adjust numDevices to match
      setNumDevices(copy.length);
      return copy;
    });
  };

  // ---------- submit / persistence logic ----------
  const handleFinalSubmit = () => {
    if (!productName.trim()) {
      toast({
        title: "Product Name Required",
        description: "Please enter a product name",
        status: "warning",
        duration: 2000,
      });
      return;
    }
    if (!urlLink.trim()) {
      toast({
        title: "URL Required",
        description: "Please enter the URL link",
        status: "warning",
        duration: 2000,
      });
      return;
    }

    const payload = {
      productName,
      description,
      numDevices,
      selectedComponent,
      selectedComponentName,
      components,
      urlLink,
      note,
      deviceInfos,
    };

    console.log("FINAL FORM SUBMIT:", payload);

    toast({
      title: "Product Created",
      description: "Your product has been configured successfully.",
      status: "success",
      duration: 3000,
    });
  };

  //newly added start 10/12/2025
  const [loading, setLoading] = useState(false);
  const [activeProjectId, setActiveProjectId] = useState(undefined);

  useEffect(() => {
    const readActiveProject = () => {
      try {
        const id = localStorage.getItem("activeProjectId");
        if (id) setActiveProjectId(id);
        else {
          const objRaw = localStorage.getItem("activeProject");
          if (objRaw) {
            try {
              const obj = JSON.parse(objRaw);
              if (obj?.id) setActiveProjectId(obj.id);
              else if (obj?._id) setActiveProjectId(obj._id);
              else if (obj?.projectId) setActiveProjectId(obj.projectId);
            } catch {
              /* ignore parse errors */
            }
          }
        }
      } catch (e) {
        console.warn("Failed reading activeProjectId from localStorage", e);
      }
    };

    readActiveProject();

    const onStorage = (e) => {
      if (e.key === "activeProjectId" || e.key === "activeProject") {
        readActiveProject();
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const saveToLocal = (key, value) => {
    try {
      localStorage.setItem(key, typeof value === "string" ? value : JSON.stringify(value));
    } catch (e) {
      console.warn("localStorage set error", e);
    }
  };

  const handleInitialSubmit = async () => {
    if (!productName.trim()) {
      toast({
        title: "Product Name Required",
        description: "Please enter a product name",
        status: "warning",
        duration: 2000,
      });
      return;
    }

    if (components && components.length > 0) {
      setSelectedComponent(components[0].type);
      setSelectedComponentName(components[0].name);
    }

    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    const payload = {
      name: productName,
      userId: userData.userId,
      projectId: localStorage.getItem("activeProjectId") ?? undefined,
      productDesc: description ?? "",
    };


    if (!payload.projectId) {
      toast({
        title: "Missing projectId",
        description: "activeProjectId not found in localStorage. Please create/choose a project first.",
        status: "error",
        duration: 3000,
      });
      return;
    }

    setLoading(true);
    try {
      saveToLocal("pendingProductNew", payload);

      const url = "http://192.168.68.109:5004/productNew";
      const resp = await axios.post(url, payload);
      console.log(resp, "productID----");

      // Extract productID from response
      const productId = resp.data.productID; 
      console.log("Extracted Product ID:", productId);

      // Store in localStorage
      localStorage.setItem("activeProjectIds", productId);


      saveToLocal("productNewResponse", resp.data);

      toast({
        title: "Product created",
        description: resp?.data?.message ?? "ProductNew created successfully",
        status: "success",
        duration: 2500,
      });

      setStep(2);
    } catch (error) {
      console.error("productNew error:", error?.response ?? error);
      toast({
        title: "Failed to create product",
        description: error?.response?.data?.message ?? error?.message ?? "An error occurred while creating product",
        status: "error",
        duration: 4000,
      });
    } finally {
      setLoading(false);
    }
  };
  //newly added end 10/12/2025

  //newly added start 11/12/2025
  const adjustDeviceInfosToCount = (count) => {
    const current = [...deviceInfos];
    if (count > current.length) {
      // Add empty objects
      while (current.length < count) {
        current.push({ imei: "", iccid: "", phone: "" });
      }
    } else if (count < current.length) {
      // Trim from end
      current.length = count;
    }
    setDeviceInfos(current);
  };
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmitDevices = async () => {
    setIsLoading(true);
    const productId = localStorage.getItem("activeProjectIds");

    if (!productId) {
      toast({
        title: "Product ID Missing",
        description: "activeProjectId not found in localStorage.",
        status: "error",
        duration: 3000,
      });
      setIsLoading(false);
      return;
    }

    // Validation: Check if at least one device has data
    const hasData = deviceInfos.some(dev =>
      dev.imei.trim() || dev.iccid.trim() || dev.phone.trim()
    );

    if (!hasData) {
      toast({
        title: "No Data",
        description: "Please enter at least one device's information",
        status: "warning",
        duration: 3000,
      });
      setIsLoading(false);
      return;
    }

    const infos = [...deviceInfos];
    const required = Math.max(0, Number(numDevices) || 0);

    // Build devices array
    const devices = infos.map((d) => {
      const IMEI = (d?.imei || "").trim();
      const ICCID = (d?.iccid || "").trim();
      const mobileNumber = (d?.phone || "").trim();

      if (!IMEI && !ICCID && !mobileNumber) return null;
      return { IMEI, ICCID, mobileNumber };
    }).filter(Boolean);

    const payload = {
      deviceCount: required,
      devices,
    };

    console.log("📤 Devices Payload:", payload);

    try {
      const url = `http://192.168.68.109:5004/product/${productId}/devicesNew`;
      const resp = await axios.post(url, payload);

      toast({
        title: "Devices Saved",
        description: resp?.data?.message || "Device list updated successfully",
        status: "success",
        duration: 3000,
      });

      console.log("📥 Devices Response:", resp.data);
    } catch (error) {
      console.error("❌ Devices API Error:", error);

      toast({
        title: "Failed to Save Devices",
        description:
          error?.response?.data?.message || error.message || "Unknown error",
        status: "error",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  //component type 
  const [componentsLoading, setComponentsLoading] = useState(false);
  const [componentsError, setComponentsError] = useState(null);

  useEffect(() => {
    const fetchComponentTypes = async () => {
      setComponentsLoading(true);
      setComponentsError(null);

      try {
        const resp = await axios.get("http://192.168.68.105:5004/api/v2/componentTypes");
        // expecting resp.data.data to be the array per your sample
        const list = Array.isArray(resp?.data?.data) ? resp.data.data : [];
        setComponents(list);
      } catch (err) {
        console.error("Failed to load component types", err);
        setComponentsError(err);
        toast({
          title: "Failed to load components",
          description: err?.response?.data?.message || err.message || "Check server",
          status: "error",
          duration: 3000,
        });
      } finally {
        setComponentsLoading(false);
      }
    };

    fetchComponentTypes();
  }, []);

  const handleAddComponentPrompt = async () => {
    const name = prompt("New component name", "Audio Components");
    if (!name) return;

    setComponentsLoading(true);
    try {
      const token = localStorage.getItem("token"); // if you use auth
      const res = await fetch("http://192.168.68.109:5004/api/v2/componentTypes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ componentName: name }),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || "Failed to create component");
      }

      const data = await res.json();
      // Append new component to list
      setComponents((prev) => [data, ...prev]);
      // Optionally set selected
      setSelectedComponent(data.componentName);
      setSelectedComponentName(data.componentName);
      // show success toast (if using Chakra useToast)
    } catch (err) {
      console.error("Create component error:", err);
      // show error toast
    } finally {
      setComponentsLoading(false);
    }
  };

  //newly added end 11/12/2025
  const handleCancel = () => {
    setProductName("");
    setDescription("");
    setNumDevices(1);
    setSelectedComponent("");
    setSelectedComponentName("");
    setComponents([
      {
        name: "Flame Sensor",
        type: "Sensor",
        parameters: [
          {
            type: "inconstant",
            name: "Flame Intensity",
            min: "",
            max: "",
            unit: "",
            value: "",
          },
        ],
      },
      {
        name: "Vibration Motor",
        type: "Actuator",
        parameters: [],
      },
    ]);
    setDeviceInfos([{ imei: "", iccid: "", phone: "" }]);
    setUrlLink("");
    setNote("");
    setStep(1);
    setEditingParam(null);
    setEditingComponentIndex(null);
  };

  // popup handlers
  const openComponentPopup = () => {
    setNewComponent({ name: "", type: "Sensor" });
    setShowComponentPopup(true);
  };

  const handleComponentPopupCancel = () => {
    setShowComponentPopup(false);
    setNewComponent({ name: "", type: "Sensor" });
  };

  const handleComponentPopupSubmit = () => {
    if (!newComponent.name.trim()) {
      toast({
        title: "Component Name Required",
        description: "Please enter a component name",
        status: "warning",
        duration: 2000,
      });
      return;
    }

    const exists = components.some(
      (comp) => comp.name.toLowerCase() === newComponent.name.trim().toLowerCase() && comp.type === newComponent.type
    );
    if (exists) {
      toast({
        title: "Component Already Exists",
        description: `Component "${newComponent.name}" already exists in the list`,
        status: "error",
        duration: 3000,
      });
      return;
    }

    addComponent({
      name: newComponent.name.trim(),
      type: newComponent.type,
      parameters: [],
    });

    setSelectedComponent(newComponent.type);
    setSelectedComponentName(newComponent.name.trim());

    setShowComponentPopup(false);
    setNewComponent({ name: "", type: "Sensor" });
  };

  const fetchComponentType = async () => {
    setLoadingComponentType(true);

    try {
      const response = await axios.get('http://192.168.68.109:5004/api/v2/componentTypes');

      if (response.data.status === "success") {
        setComponentTypes(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching component types:", err);
    } finally {
      setLoadingComponentType(false);
    }
  };

  useEffect(() => {
    fetchComponentType();
  }, []);

  // STEP 1 UI
  if (step === 1) {
    return (
      <Box width="100%" minH="100%" display="flex" alignItems="center" justifyContent="center" bg="gray.100" py={10}>
        <Box bg="#f5f5f5" borderRadius="md" borderWidth="1px" maxW="600px" w="100%" p={8}>
          <VStack align="stretch" spacing={4}>
            <Box>
              <Text fontSize="sm" mb={2}>
                Product Name{" "}
                <Text as="span" color="red.500">
                  *
                </Text>
              </Text>
              <Input size="sm" value={productName} onChange={(e) => setProductName(e.target.value)} sx={inputStyles} />
            </Box>

            <Box>
              <Text fontSize="sm" mb={2}>
                Product Descriptions
              </Text>
              <Textarea size="sm" minH="120px" value={description} onChange={(e) => setDescription(e.target.value)} sx={inputStyles} />
            </Box>
          </VStack>

          <Box textAlign="center" mt={8}>
            <Button colorScheme="blue" size="sm" px={10} onClick={handleInitialSubmit}>
              Submit
            </Button>
          </Box>
        </Box>
      </Box>
    );
  }

  // STEP 2 UI
  const activeComponentIndex = (() => {
    const idx = components.findIndex((c) => c.name === selectedComponentName && c.type === selectedComponent);
    return idx === -1 ? 0 : idx;
  })();
  const activeComponent = components[activeComponentIndex] || components[0];



  return (
    <Box width="100%" bg="gray.100" py={8}>
      <Box maxW="1100px" mx="auto" bg="#f5f5f5" borderRadius="md" borderWidth="1px" p={6}>
        {/* Product Name */}
        <Box mb={6}>
          <Text fontSize="md" fontWeight="bold" mb={1}>
            Product Name
          </Text>
          <Input size="sm" value={productName} onChange={(e) => setProductName(e.target.value)} sx={inputStyles} placeholder="Enter product name" />
        </Box>

        <VStack align="stretch" spacing={6}>
          {/* Basic Information */}
          <Box>
            <Text fontSize="md" fontWeight="bold" mb={3}>
              Basic Information
            </Text>

            <Grid templateColumns="repeat(3, 1fr)" gap={4} mb={3}>
              {/* No. of Devices */}
              <GridItem>
                <Text fontSize="sm" mb={1} fontWeight="medium">
                  No. Of Devices{" "}
                  <Text as="span" color="red.500">
                    *
                  </Text>
                </Text>

                <NumberInput
                  size="sm"
                  min={1}
                  max={20}
                  value={numDevices}
                  onChange={(valueString) => {
                    const n = parseInt(valueString || "0", 10) || 0;
                    setNumDevices(n);
                    adjustDeviceInfosToCount(n); // keep deviceInfos in sync
                  }}
                  clampValueOnBlur={true}
                >
                  <NumberInputField placeholder="Select or type..." sx={inputStyles} />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </GridItem>

              <GridItem>
                <HStack justify="space-between" mb={1}>
                  <Text fontSize="sm" fontWeight="medium">
                    Component{" "}
                    <Text as="span" color="red.500">
                      *
                    </Text>
                  </Text>
                  <IconButton
                    aria-label="Add component"
                    icon={<AddIcon boxSize={3} />}
                    size="xs"
                    variant="ghost"
                    onClick={handleAddComponentPrompt}
                  />
                </HStack>

                {/* <Select
                  size="sm"
                  placeholder={componentsLoading ? "Loading components..." : "Select Component"}
                  value={selectedComponent}
                  onChange={(e) => {
                    const newType = e.target.value;
                    setSelectedComponent(newType);
                    const firstCompOfType = components.find((c) => c.componentName === newType);
                    setSelectedComponentName(firstCompOfType ? firstCompOfType.componentName : "");
                  }}
                  sx={inputStyles}
                  isDisabled={componentsLoading || components.length === 0}
                >

                  {components.map((c) => (
                    <option key={c.data._id} value={c.data.componentName}>
                      {c.data.componentName}
                    </option>
                  ))}
                </Select> */}
                <Select
                  value={selectedComponentTypes}
                  onChange={(e) => setSelectedComponentTypes(e.target.value)}
                  placeholder={loadingComponentType ? "Loading..." : "Select type"}
                >
                  {componentTypes.map((type) => (
                    <option key={type._id} value={type._id}>
                      {type.componentName}
                    </option>
                  ))}
                </Select>
              </GridItem>


              {/* COMPONENT NAME */}
              <GridItem>
                <HStack justify="space-between" mb={1} align="center">
                  <Text fontSize="sm" fontWeight="medium">
                    Component Name{" "}
                    <Text as="span" color="red.500">
                      *
                    </Text>
                  </Text>

                  <HStack spacing={1}>
                    <IconButton
                      size="xs"
                      aria-label="Edit component"
                      icon={<EditIcon />}
                      variant="ghost"
                      onClick={() => {
                        const idx = components.findIndex((c) => c.name === selectedComponentName && c.type === selectedComponent);
                        if (idx === -1) return;
                        setEditingComponentIndex(idx);
                      }}
                    />
                    <IconButton
                      size="xs"
                      aria-label="Delete component"
                      icon={<DeleteIcon />}
                      variant="ghost"
                      onClick={() => {
                        const idx = components.findIndex((c) => c.name === selectedComponentName && c.type === selectedComponent);
                        if (idx === -1) return alert("No component selected");
                        deleteComponent(idx);
                      }}
                    />
                    <IconButton aria-label="Add component name" icon={<AddIcon boxSize={3} />} size="xs" variant="ghost" onClick={openComponentPopup} />
                  </HStack>
                </HStack>

                {editingComponentIndex !== null ? (
                  <HStack>
                    <Input
                      size="sm"
                      value={components[editingComponentIndex]?.name || ""}
                      onChange={(e) => {
                        const v = e.target.value;
                        setComponents((prev) => {
                          const c = [...prev];
                          c[editingComponentIndex] = { ...c[editingComponentIndex], name: v };
                          return c;
                        });
                        setSelectedComponentName(v);
                      }}
                      sx={inputStyles}
                    />
                    <Button size="xs" onClick={() => setEditingComponentIndex(null)}>
                      Done
                    </Button>
                  </HStack>
                ) : (
                  <Select size="sm" placeholder="Select Component Name" value={selectedComponentName} onChange={(e) => setSelectedComponentName(e.target.value)} sx={inputStyles}>
                    <option value="">Select Component Name</option>
                    {components
                      .filter((comp) => (selectedComponent ? comp.type === selectedComponent : true))
                      .map((comp, idx) => (
                        <option key={idx} value={comp.name}>
                          {comp.name}
                        </option>
                      ))}
                  </Select>
                )}
              </GridItem>
            </Grid>

            <Button size="xs" colorScheme="blue" variant="outline" leftIcon={<AddIcon />} onClick={() => addParameter(activeComponentIndex, "inconstant")}>
              Add Parameters
            </Button>
          </Box>

          {/* Specific Parameters (Inconstant) */}
          <Box>
            <Text fontSize="md" fontWeight="bold" mb={1}>
              Specific Parameters
            </Text>
            <Text fontSize="xs" mb={3} color="gray.600">
              Inconstant parameters for the selected component.
            </Text>

            {activeComponent?.parameters?.map(
              (param, paramIndex) =>
                param.type !== "inconstant" ? null : (
                  <Box key={paramIndex} bg="white" p={3} borderRadius="md" borderWidth="1px" position="relative" mb={3}>
                    <HStack position="absolute" top="8px" right="8px" spacing={1}>
                      <IconButton
                        size="xs"
                        aria-label="Edit parameter"
                        icon={<EditIcon />}
                        onClick={() => setEditingParam({ compIndex: activeComponentIndex, paramIndex })}
                        variant="ghost"
                      />
                      <IconButton size="xs" aria-label="Delete parameter" icon={<DeleteIcon />} onClick={() => deleteParameter(activeComponentIndex, paramIndex)} variant="ghost" />
                    </HStack>

                    <Grid templateColumns="repeat(4, 1fr)" gap={4}>
                      <GridItem>
                        <Text fontSize="sm" mb={1} fontWeight="medium">
                          Specific Parameter
                        </Text>

                        {editingParam && editingParam.compIndex === activeComponentIndex && editingParam.paramIndex === paramIndex ? (
                          <HStack>
                            <Input
                              size="sm"
                              value={param.name}
                              onChange={(e) => saveParameterField(activeComponentIndex, paramIndex, "name", e.target.value)}
                              sx={inputStyles}
                            />
                            <Button size="xs" onClick={() => setEditingParam(null)}>
                              Done
                            </Button>
                          </HStack>
                        ) : (
                          <Input size="sm" value={param.name} onChange={(e) => updateParameter(activeComponentIndex, paramIndex, "name", e.target.value)} sx={inputStyles} placeholder="Flame Intensity" />
                        )}
                      </GridItem>

                      <GridItem>
                        <Text fontSize="sm" mb={1} fontWeight="medium">
                          Variables
                        </Text>
                        <Select size="sm" value={param.type === "constant" ? "Constant" : "Inconstant"} onChange={(e) => handleVariableChange(activeComponentIndex, paramIndex, e.target.value)} sx={inputStyles}>
                          <option value="Inconstant">Inconstant</option>
                          <option value="Constant">Constant</option>
                        </Select>
                      </GridItem>

                      <GridItem>
                        <Text fontSize="sm" mb={1} fontWeight="medium">
                          Range
                        </Text>
                        <HStack spacing={2}>
                          <Input size="sm" placeholder="Min Value" value={param.min} onChange={(e) => updateParameter(activeComponentIndex, paramIndex, "min", e.target.value)} sx={inputStyles} />
                          <Text fontSize="xs">to</Text>
                          <Input size="sm" placeholder="Max Value" value={param.max} onChange={(e) => updateParameter(activeComponentIndex, paramIndex, "max", e.target.value)} sx={inputStyles} />
                        </HStack>
                      </GridItem>

                      <GridItem>
                        <Text fontSize="sm" mb={1} fontWeight="medium">
                          Unit
                        </Text>
                        <Select size="sm" value={param.unit} onChange={(e) => updateParameter(activeComponentIndex, paramIndex, "unit", e.target.value)} sx={inputStyles}>
                          <option value="">Select Unit</option>
                          <option value="Celsius">Celsius</option>
                          <option value="Lux">Lux</option>
                          <option value="PPM">PPM</option>
                        </Select>
                      </GridItem>
                    </Grid>
                  </Box>
                )
            )}
          </Box>

          {/* Add Parameters Specification (Constant) */}
          <Box>
            <Text fontSize="md" fontWeight="bold" mb={1}>
              Add Parameters Specification
            </Text>
            <Text fontSize="xs" mb={3} color="gray.600">
              Constant parameters (common specification) for the selected component.
            </Text>

            {activeComponent?.parameters?.map(
              (param, paramIndex) =>
                param.type !== "constant" ? null : (
                  <Grid key={paramIndex} templateColumns="repeat(3, 1fr)" gap={4} mb={3}>
                    <GridItem>
                      <Text fontSize="sm" mb={1} fontWeight="medium">
                        Component Name
                      </Text>
                      <Select size="sm" value={activeComponent?.name || ""} sx={inputStyles}>
                        <option value={activeComponent?.name || ""}>{activeComponent?.name || "Select Component"}</option>
                      </Select>
                    </GridItem>

                    <GridItem>
                      <Text fontSize="sm" mb={1} fontWeight="medium">
                        Variables
                      </Text>
                      <Select size="sm" value="Constant" sx={inputStyles}>
                        <option value="Constant">Constant</option>
                        <option value="Inconstant">Inconstant</option>
                      </Select>
                    </GridItem>

                    <GridItem>
                      <Text fontSize="sm" mb={1} fontWeight="medium">
                        Constant Values
                      </Text>
                      <Input size="sm" placeholder="Enter value" value={param.value} onChange={(e) => updateParameter(activeComponentIndex, paramIndex, "value", e.target.value)} sx={inputStyles} />
                    </GridItem>
                  </Grid>
                )
            )}

            <Button size="xs" colorScheme="blue" variant="outline" leftIcon={<AddIcon />} onClick={() => addParameter(activeComponentIndex, "constant")}>
              Add Parameters
            </Button>
          </Box>

          {/* URL Link */}
          <Box>
            <Text fontSize="md" fontWeight="bold" mb={2}>
              Url Link{" "}
              <Text as="span" color="red.500">
                *
              </Text>
            </Text>
            <Input size="sm" value={urlLink} onChange={(e) => setUrlLink(e.target.value)} sx={inputStyles} placeholder="Enter URL" />
          </Box>

          {/* Note */}
          <Box>
            <Text fontSize="md" fontWeight="bold" mb={2}>
              Note (Optional)
            </Text>
            <Textarea size="sm" minH="80px" value={note} onChange={(e) => setNote(e.target.value)} sx={inputStyles} placeholder="Add notes here..." />
          </Box>

          {/* Identity of Device - render per-device blocks */}
          <Box>
            <Text fontSize="md" fontWeight="bold" mb={3}>
              Identity Of Device
            </Text>

            <VStack spacing={4} align="stretch">
              {deviceInfos.map((dev, idx) => (
                <Box key={idx} bg="white" p={3} borderRadius="md" borderWidth="1px" position="relative">
                  <HStack position="absolute" top="8px" right="8px" spacing={1}>
                    <IconButton
                      size="xs"
                      aria-label="Edit device"
                      icon={<EditIcon />}
                      variant="ghost"
                      onClick={() => {
                        toast({ title: "Edit device", description: `You can edit fields directly for device ${idx + 1}`, status: "info", duration: 1200 });
                      }}
                    />
                    <IconButton size="xs" aria-label="Delete device" icon={<DeleteIcon />} onClick={() => deleteDeviceInfo(idx)} variant="ghost" />
                  </HStack>

                  <Text fontSize="sm" fontWeight="semibold" mb={2}>
                    Device {idx + 1}
                  </Text>
                  <Grid templateColumns="repeat(3, 1fr)" gap={4}>
                    <GridItem>
                      <Text fontSize="sm" mb={1} fontWeight="medium">
                        IMEI
                      </Text>
                      <Input size="sm" value={dev.imei} onChange={(e) => handleDeviceInfoChange(idx, "imei", e.target.value)} sx={inputStyles} placeholder="Enter IMEI" />
                    </GridItem>

                    <GridItem>
                      <Text fontSize="sm" mb={1} fontWeight="medium">
                        ICCID
                      </Text>
                      <Input size="sm" value={dev.iccid} onChange={(e) => handleDeviceInfoChange(idx, "iccid", e.target.value)} sx={inputStyles} placeholder="Enter ICCID" />
                    </GridItem>

                    <GridItem>
                      <Text fontSize="sm" mb={1} fontWeight="medium">
                        Phone No.
                      </Text>
                      <Input size="sm" value={dev.phone} onChange={(e) => handleDeviceInfoChange(idx, "phone", e.target.value)} sx={inputStyles} placeholder="Enter Phone Number" />
                    </GridItem>
                  </Grid>
                </Box>
              ))}
            </VStack>
          </Box>

          {/* Cancel and Create Product Buttons */}
          <HStack justify="center" spacing={6} mt={8} pt={4} borderTop="1px" borderColor="gray.300">
            <Button variant="outline" size="md" borderColor="blue.500" color="blue.500" onClick={handleCancel} px={10}>
              Cancel
            </Button>
            <Button colorScheme="blue" size="md" px={10} onClick={handleSubmitDevices}
              isLoading={isLoading}>
              Create Product
            </Button>
          </HStack>
        </VStack>
      </Box>

      {/* POPUP: Add Component (type + name) */}
      {showComponentPopup && (
        <Box position="fixed" top={0} left={0} w="100vw" h="100vh" bg="blackAlpha.400" display="flex" alignItems="center" justifyContent="center" zIndex={1000}>
          <Box bg="#f5f5f5" borderRadius="md" borderWidth="1px" maxW="400px" w="100%" p={6}>
            <HStack justify="space-between" mb={4}>
              <Text fontSize="sm" fontWeight="semibold">
                Add Component
              </Text>
              <Button variant="ghost" size="sm" fontSize="sm" onClick={handleComponentPopupCancel} px={2}>
                ✕
              </Button>
            </HStack>

            <VStack align="stretch" spacing={4}>
              <Box>
                <Text fontSize="xs" mb={1}>
                  Component
                </Text>
                <Select size="sm" value={newComponent.type} onChange={(e) => setNewComponent((prev) => ({ ...prev, type: e.target.value }))} sx={inputStyles}>
                  <option value="Sensor">Sensor</option>
                  <option value="Actuator">Actuator</option>
                </Select>
              </Box>

              <Box>
                <Text fontSize="xs" mb={1}>
                  Component Name{" "}
                  <Text as="span" color="red.500">
                    *
                  </Text>
                </Text>
                <Input size="sm" value={newComponent.name} onChange={(e) => setNewComponent((prev) => ({ ...prev, name: e.target.value }))} sx={inputStyles} placeholder="Enter component name" />
              </Box>
            </VStack>

            <Box textAlign="center" mt={6}>
              <Button colorScheme="blue" size="sm" px={8} onClick={handleComponentPopupSubmit}>
                Submit
              </Button>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
}

