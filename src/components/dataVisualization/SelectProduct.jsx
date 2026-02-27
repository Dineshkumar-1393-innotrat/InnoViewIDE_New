import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Box, Heading, Menu, MenuButton, MenuList, MenuItem, Button as ChakraButton } from "@chakra-ui/react";
import { Select, Center } from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import DataTable from "./DataTable";
import { baseURL } from "../../utilities";
import { useProject } from "../../ProjectContext";
import { Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const SelectProduct = () => {
  const [selectedProduct, setSelectedProduct] = useState("");
  const [availableDevices, setAvailableDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState("");
  const [selectedProductName, setSelectedProductName] = useState("");

  const [products, setProducts] = useState([]);
  const [runningDevices, setRunningDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user, activeProjectName, activeProductId } = useProject();

  const navigate = useNavigate();

  console.log("user", user);

  useEffect(() => {
    // Retrieve userId from localStorage
    // const storedUserData = localStorage.getItem("userData");
    // if (!user?.userId) {
    //   setError("User data not found in localStorage");
    //   setLoading(false);
    //   return;
    // }

    // const { userId } = JSON.parse(storedUserData);
    if (!user?.userId) {
      setError("User ID not found");
      setLoading(false);
      return;
    }

    // Fetch product data from API
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/getProductIds/${user?.userId}`
        );

        if (response.data?.data && Array.isArray(response.data.data)) {
          const productsList = response.data.data;
          setProducts(productsList);

          // Fetch devices for each product immediately after getting products
          const devicePromises = productsList.map((product) =>
            axios
              .post(`${baseURL}/devices/running`, {
                productID: product.productId,
              })
              .then((res) => {
                console.log(`API Response for ${product.productId}:`, res.data);

                // Handle different response structures
                let devices = [];
                if (Array.isArray(res.data)) {
                  devices = res.data;
                } else if (res.data?.runningDevices && Array.isArray(res.data.runningDevices)) {
                  // API returns { status, runningDevicesCount, runningDevices: [{deviceID, active}] }
                  devices = res.data.runningDevices;
                } else if (res.data?.devices && Array.isArray(res.data.devices)) {
                  devices = res.data.devices;
                } else if (res.data?.data && Array.isArray(res.data.data)) {
                  devices = res.data.data;
                }

                return {
                  productID: product.productId,
                  runningDevices: devices.map((d) => (typeof d === 'string' ? d : d.deviceID)) || [],
                };
              })
              .catch((error) => {
                console.error(
                  `Error fetching devices for ${product.productId}:`,
                  error
                );
                return { productID: product.productId, runningDevices: [] };
              })
          );

          const deviceResults = await Promise.allSettled(devicePromises);
          const finalRunningDevices = deviceResults.map((r) =>
            r.status === "fulfilled"
              ? r.value
              : { productID: "", runningDevices: [] }
          );

          console.log("Final Running Devices State:", finalRunningDevices);
          setRunningDevices(finalRunningDevices);
        } else {
          setProducts([]); // Ensure it's never null
        }
      } catch (err) {
        setError(err.message || "Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Auto-select product based on activeProductId
  useEffect(() => {
    if (activeProductId && products.length > 0 && !selectedProduct) {
      const found = products.find((p) => p.productId === activeProductId);
      if (found) {
        setSelectedProduct(activeProductId);
        setSelectedProductName(found.productName);
      }
    }
  }, [activeProductId, products, selectedProduct]);

  // Update available devices when runningDevices or selectedProduct changes
  useEffect(() => {
    if (selectedProduct && runningDevices.length > 0) {
      const deviceData = runningDevices.find(
        (item) => item.productID === selectedProduct
      );
      setAvailableDevices(deviceData?.runningDevices ?? []);
    }
  }, [selectedProduct, runningDevices]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const handleProductChange = (e) => {
    const productID = e.target.value;
    setSelectedProduct(productID);

    const product = products.find((product) => product.productId === productID); // Ensure consistency

    if (product) {
      console.log("Product Found:", product.productName); // Debugging
      setSelectedProductName(product.productName);
    } else {
      console.log("No matching product found for ID:", productID);
    }

    // Logic for available devices is now handled by useEffect
    setSelectedDevice(""); // Reset selected device
  };

  const handleDeviceChange = (e) => {
    const deviceID = e.target.value;
    setSelectedDevice(deviceID);
  };

  return (
    <Box>
      {activeProjectName && (
        <Box mt={4} mb={4}>
          <Center>
            <Heading size={"md"}>{activeProjectName}</Heading>
          </Center>
        </Box>
      )}
      <Box display="flex" flexWrap="wrap" alignItems="center" gap={2}>
        {/* Product Dropdown - Menu-based to avoid viewport clipping */}
        <Menu>
          <MenuButton
            as={ChakraButton}
            rightIcon={<ChevronDownIcon />}
            size="sm"
            variant="outline"
            minW="180px"
            textAlign="left"
            fontWeight="normal"
            color={selectedProduct ? "inherit" : "gray.400"}
          >
            {selectedProduct
              ? products.find((p) => p.productId === selectedProduct)?.productName || "Select Product"
              : "Select Product"}
          </MenuButton>
          <MenuList maxH="250px" overflowY="auto" zIndex={9999}>
            {products.map((product) => (
              <MenuItem
                key={product.productId}
                value={product.productId}
                onClick={() =>
                  handleProductChange({ target: { value: product.productId } })
                }
                bg={selectedProduct === product.productId ? "blue.50" : undefined}
                fontWeight={selectedProduct === product.productId ? "semibold" : "normal"}
              >
                {product.productName}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>

        {/* Running Devices Dropdown - Only shows when a product is selected */}
        {selectedProduct && (
          <>
            {availableDevices.length > 0 ? (
              <Select
                placeholder="Select Running Device"
                onChange={handleDeviceChange}
                minW="180px"
                size={"sm"}
              >
                {availableDevices.map((deviceID) => (
                  <option key={deviceID} value={deviceID}>
                    {deviceID}
                  </option>
                ))}
              </Select>
            ) : (
              <Box
                px={3}
                py={1}
                bg="orange.50"
                border="1px solid"
                borderColor="orange.300"
                borderRadius="md"
                fontSize="xs"
                color="orange.700"
                whiteSpace="nowrap"
                display="flex"
                alignItems="center"
              >
                ⚠ No devices registered for this product
              </Box>
            )}
          </>
        )}

        <Button
          size="sm"
          colorScheme="blue"
          disabled={!selectedProduct}
          onClick={() => {
            navigate("/editor");
          }}
        >
          Flash
        </Button>
      </Box>

      <Box>
        <DataTable
          selectedProduct={selectedProduct}
          selectedDevice={selectedDevice}
          selectedName={selectedProductName}
        />
      </Box>
    </Box>
  );
};

export default SelectProduct;
