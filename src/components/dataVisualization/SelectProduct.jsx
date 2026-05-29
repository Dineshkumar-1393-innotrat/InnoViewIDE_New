import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Box, Heading, Menu, MenuButton, MenuList, MenuItem, Button as ChakraButton } from "@chakra-ui/react";
import { Select, Center } from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import DataTable from "./DataTable";
import { baseURL, productAPIBase } from "../../utilities";
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
        const endpoints = [
          `${baseURL}/getProductIds/${user?.userId}`,
          `${baseURL}/api/v1/getProductIds/${user?.userId}`,
          `${baseURL}/api/v2/getProductIds/${user?.userId}`,
          `${productAPIBase}/getProductIds/${user?.userId}`,
          `${productAPIBase}/api/v1/getProductIds/${user?.userId}`,
          `${productAPIBase}/api/v2/getProductIds/${user?.userId}`,
          `${productAPIBase}/products/${user?.userId}`,
          `${productAPIBase}/product/all/${user?.userId}`,
          `${baseURL}/product/all/${user?.userId}`
        ];

        let productsList = [];
        for (const url of endpoints) {
          try {
            console.log(`[SelectProduct] Fetching products from: ${url}`);
            const response = await axios.get(url);

            if (response.data?.data && Array.isArray(response.data.data)) {
              productsList = response.data.data;
            } else if (Array.isArray(response.data)) {
              productsList = response.data;
            } else if (response.data?.products && Array.isArray(response.data.products)) {
              productsList = response.data.products;
            }

            if (productsList.length > 0) {
              break; // Found products, stop trying
            }
          } catch (e) {
            console.log(`[SelectProduct] Endpoint failed: ${url}`);
          }
        }

        if (productsList.length > 0) {
          setProducts(productsList);

          // Fetch devices for each product immediately after getting products
          const devicePromises = productsList.map(async (product) => {
            const pId = product.productId || product.productID || product._id || product.id;
            
            const deviceEndpoints = [
              { method: 'get', url: `${baseURL}/product/${pId}/devices` },
              { method: 'get', url: `${productAPIBase}/product/${pId}/devices` },
              { method: 'post', url: `${baseURL}/devices/running`, data: { productID: pId } },
              { method: 'post', url: `${productAPIBase}/devices/running`, data: { productID: pId } }
            ];

            let devices = [];
            for (const endpoint of deviceEndpoints) {
              try {
                const res = endpoint.method === 'post' 
                  ? await axios.post(endpoint.url, endpoint.data)
                  : await axios.get(endpoint.url);
                  
                console.log(`API Response for devices on ${endpoint.url}:`, res.data);
                
                let foundDevices = [];
                if (Array.isArray(res.data)) {
                  foundDevices = res.data;
                } else if (res.data?.runningDevices && Array.isArray(res.data.runningDevices)) {
                  foundDevices = res.data.runningDevices;
                } else if (res.data?.devices && Array.isArray(res.data.devices)) {
                  foundDevices = res.data.devices;
                } else if (res.data?.data && Array.isArray(res.data.data)) {
                  foundDevices = res.data.data;
                }

                if (foundDevices.length > 0) {
                  devices = foundDevices;
                  break; // Found devices, stop trying
                }
              } catch (e) {
                console.log(`[SelectProduct] Device endpoint failed: ${endpoint.url}`);
              }
            }

            return {
              productID: pId,
              runningDevices: devices.map((d) => (typeof d === 'string' ? d : d.deviceID || d.deviceId || d.id)) || [],
            };
          });

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
      const found = products.find((p) => (p.productId || p.productID || p._id || p.id) === activeProductId);
      if (found) {
        setSelectedProduct(activeProductId);
        setSelectedProductName(found.productName || found.ProductName || found.name);
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
    const pID = e.target.value;
    setSelectedProduct(pID);

    const product = products.find((p) => (p.productId || p.productID || p._id || p.id) === pID); // Ensure consistency

    if (product) {
      console.log("Product Found:", product.productName || product.ProductName || product.name); // Debugging
      setSelectedProductName(product.productName || product.ProductName || product.name);
    } else {
      console.log("No matching product found for ID:", pID);
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
              ? products.find((p) => (p.productId || p.productID || p._id || p.id) === selectedProduct)?.productName || products.find((p) => (p.productId || p.productID || p._id || p.id) === selectedProduct)?.ProductName || products.find((p) => (p.productId || p.productID || p._id || p.id) === selectedProduct)?.name || "Select Product"
              : "Select Product"}
          </MenuButton>
          <MenuList maxH="250px" overflowY="auto" zIndex={9999}>
            {products.map((product) => {
              const pId = product.productId || product.productID || product._id || product.id;
              const pName = product.productName || product.ProductName || product.name;
              return (
                <MenuItem
                  key={pId}
                  value={pId}
                  onClick={() =>
                    handleProductChange({ target: { value: pId } })
                  }
                  bg={selectedProduct === pId ? "blue.50" : undefined}
                  fontWeight={selectedProduct === pId ? "semibold" : "normal"}
                >
                  {pName}
                </MenuItem>
              );
            })}
          </MenuList>
        </Menu>

        {/* Devices Dropdown - Only shows when a product is selected */}
        {selectedProduct && (
          <>
            {availableDevices.length > 0 ? (
              <Select
                placeholder="Select Device"
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

      <Box overflowX="auto" w="full">
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
