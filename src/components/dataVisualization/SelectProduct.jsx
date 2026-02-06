import { useState, useEffect } from "react";
import axios from "axios";
import { Box, Heading } from "@chakra-ui/react";
import { Select, Center } from "@chakra-ui/react";
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
          setProducts(response.data.data);
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

  useEffect(() => {
    if (!products || products.length === 0) return; // Ensure products exist

    const getAllRunningDevices = async () => {
      try {
        const promises = products.map((product) =>
          axios
            .post(`${baseURL}/devices/running`, {
              productID: product.productId,
            })
            .then((response) => ({
              productID: product.productId,
              runningDevices:
                response.data?.runningDevices?.map((d) => d.deviceID) || [],
            }))
            .catch((error) => {
              console.error(
                `Error fetching devices for ${product.productId}:`,
                error
              );
              return { productID: product.productId, runningDevices: [] };
            })
        );

        const results = await Promise.allSettled(promises);
        setRunningDevices(
          results.map((r) =>
            r.status === "fulfilled"
              ? r.value
              : { productID: "", runningDevices: [] }
          )
        );
      } catch (error) {
        console.error("Error fetching running devices:", error);
      }
    };

    getAllRunningDevices();
  }, [products]);

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
      <Box width="100%" maxW="300px" style={{ display: "flex" }}>
        {/* Product Dropdown */}
        <Select
          placeholder="Select Product"
          value={selectedProduct}
          onChange={handleProductChange}
          width="100%"
          size={"sm"}
        >
          {products.map((product) => (
            <option key={product.productId} value={product.productId}>
              {product.productName}
            </option>
          ))}
        </Select>

        {/* Running Devices Dropdown - Only shows when a product is selected */}
        {selectedProduct && (
          <Select
            placeholder="Select Running Device"
            onChange={handleDeviceChange}
            width="100%"
            size={"sm"}
            ml="2"
            position={"relative"}
          >
            {availableDevices.length > 0 ? (
              availableDevices.map((deviceID) => (
                <option key={deviceID} value={deviceID}>
                  {deviceID}
                </option>
              ))
            ) : (
              <option disabled>No Active Devices</option>
            )}
          </Select>
        )}

        <Button
          ms={4}
          p={4}
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
