import { Tabs, TabList, TabPanels, Tab, TabPanel, Box } from "@chakra-ui/react";
import { LuFolder, LuSquareCheck, LuUser } from "react-icons/lu";
import SelectProduct from "./SelectProduct";
import { useEffect } from "react";
import EditorNavbar from "../EditorNavbar";
import { useNavigate } from "react-router-dom";


const VisualizeData = () => {
  const navigate = useNavigate();

  const handleTabChange = (tab) => {
    const routes = {
      Simulation: "/simulation",
      Flowchart: "/FlowchartTest",
      "Block Diagram": "/BlockDiagram",
      "Block Programming": "/blockprogramming",
      "Code Editor": "/editor",
      MathCodeEditor: "/mathcodeeditor",
    };
    const next = routes[tab];
    if (next) {
      navigate(next);
    }
  };

  return (
    <>
      <EditorNavbar onTabChange={handleTabChange} />
      <Box
        style={{
          marginTop: "70px",
          minHeight: "calc(100vh - 70px)",
          padding: "20px",
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

    </>
  );
};

export default VisualizeData;
