import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  Center,
} from "@chakra-ui/react";
import { useState, useRef, useEffect } from "react";
import EditProductDefinition from "./EditProductDefinition";
import { Tabs, TabList, TabPanels, Tab, TabPanel, Box } from "@chakra-ui/react";
import ViewProductDefinition from "./ViewProductDefinition";
import AddProductComponent from "./AddProductComponent";
import RemoveProductComponent from "./RemoveProductComponent";
import axios from "axios";
import { getUserInfo } from "../../../utilities";
import { baseURL } from "../../../utilities";

function ProductEditModal({
  productID,
  productName,
  fetchFileSystem,
  setIsProductDefined,
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [userId, setUserId] = useState(null);

  const btnRef = useRef(null);

  const handleRemoveAllComponent = async () => {
    // const storedValues = sessionStorage.getItem("productDefinition");
    // const productID = storedValues ? JSON.parse(storedValues).productID : null;

    if (!productID) {
      alert("No product selected. Please try again.");
      return;
    }

    try {
      await axios.delete(`${baseURL}/product/${productID}/definition`);

      alert("All components removed successfully");

      // Clear the components array in Formik state
    } catch (error) {
      console.error("Error removing all components:", error);
      alert("Failed to remove all components. Please try again.");
    }
  };

  useEffect(() => {
    return () => {
      const userInfo = getUserInfo();
      if (userInfo) {
        fetchFileSystem(userInfo.userId);
      }
    };
  }, []);

  return (
    <>
      <Button
        size="sm"
        colorScheme="teal"
        float={"inline-end"}
        ref={btnRef}
        onClick={onOpen}
        zIndex={999}
      >
        View Product
      </Button>
     

      <Modal
        onClose={onClose}
        finalFocusRef={btnRef}
        isOpen={isOpen}
        scrollBehavior={"outside"}
        size={"2xl"}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            <Box
              style={{
                minHeight: "100vh",
                padding: "50px",
                backgroundColor: "whitesmoke",
                marginTop: "2rem",
              }}
            >
              <Tabs defaultIndex={0}>
                <TabList>
                  <Tab>VIEW PRODUCT</Tab>
                  <Tab>ADD COMPONENT</Tab>
                  <Tab>REMOVE COMPONET</Tab>
                  <Tab>REMOVE ALL COMPONENT</Tab>
                </TabList>

                <TabPanels>
                  <TabPanel overflowY="auto" height="600">
                    <ViewProductDefinition
                      productID={productID}
                      productName={productName}
                    />
                  </TabPanel>
                  <TabPanel overflowY="auto" height="600">
                    <AddProductComponent
                      setIsProductDefined={setIsProductDefined}
                      productID={productID}
                      productName={productName}
                    />
                  </TabPanel>
                  <TabPanel>
                    <RemoveProductComponent
                      setIsProductDefined={setIsProductDefined}
                      productID={productID}
                      productName={productName}
                    />
                  </TabPanel>
                  <TabPanel>
                    <Center>
                      <Button
                        onClick={() => handleRemoveAllComponent()}
                        colorScheme="red"
                        setIsProductDefined={setIsProductDefined}
                      >
                        Remove All Components
                      </Button>
                    </Center>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      
    </>
  );
}

export default ProductEditModal;
