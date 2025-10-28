import { Tabs, TabList, TabPanels, Tab, TabPanel, Box } from "@chakra-ui/react";
import { LuFolder, LuSquareCheck, LuUser } from "react-icons/lu";
import SelectProduct from "./SelectProduct";
import { useEffect } from "react";
import Navbar from "../EmbeddedFileManagement/Navbar";
import Footer from "../Footer";
const VisualizeData = () => {
  return (
    <>
      <Navbar />
      <Box
        style={{
          marginTop: "1.5rem",
          minHeight: "100vh",
          padding: "50px",
          backgroundColor: "whitesmoke",
        }}
      >
        <Tabs defaultIndex={0}>
          <TabList>
            <Tab>Virtual Device</Tab>
            {/* <Tab>Actual Device</Tab> */}
          </TabList>

          <TabPanels>
            <TabPanel>
              <SelectProduct />
            </TabPanel>
            {/* <TabPanel>Manage your projects</TabPanel> */}
            {/* <TabPanel>Manage your tasks for freelancers</TabPanel> */}
          </TabPanels>
        </Tabs>
      </Box>
      <Footer />
    </>
  );
};

export default VisualizeData;
