import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { ChakraProvider } from "@chakra-ui/react";
import CodeEditor from "./components/CodeEditor";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Feedback from "./components/Feedback";
import Template from "./components/Template";
import Flowchart from "./components/Flowchart";
import Flash from "./components/Flash";
import Embedded from "./components/Embedded"; // Import Embedded component
import BlockDiagram from "./components/BlockDiagram";
import DefineProduct from "./components/DefineProduct";
import TextBox from "./components/TextBox";
import FileUpload from "./components/FileUpload";
import Simulation from "./components/Simulation";
import ForgotPassword from "./components/ForgotPassword";
import CreateAccount from "./components/CreateAccount";
import SimulationPopup from "./components/SimulationPopup";
import TemplateOne from "./components/TemplateOne";
import TemplateTwo from "./components/TemplateTwo";
import DefineProductOne from "./components/DefineProductOne";
import DefineProductTwo from "./components/DefineProductTwo";
// import NavbarProductId from './components/NavbarProductId';
import BlockDiagramTest from "./components/BlockDiagramTest";
import FileExplorerOne from "./components/FileExplorerOne";
import CreateProductDefination from "../src/components/Product/ProductDefinition/CreateProductDefinition";
import VisualizeData from "./components/dataVisualization/VisualizeData";
import Logout from "./components/Logout";
import UserButton from "./components/UserButton";
import EmbeddedFileManagement from "./components/EmbeddedFileManagement/EmbeddedFileManagement";
import Toggle from "./components/Toggle/Toggle"
const App = () => {
  const [currentPanel, setCurrentPanel] = useState("fileExplorer");

  const handleToggleDebug = () => {
    setCurrentPanel((prevPanel) =>
      prevPanel === "debug" ? "fileExplorer" : "debug"
    );
  };

  const handleToggleFlash = () => {
    setCurrentPanel((prevPanel) =>
      prevPanel === "flash" ? "fileExplorer" : "flash"
    );
  };

  return (
    <ChakraProvider>
      {/* <Navbar />  */}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/template" element={<Template />} />
        <Route
          path="/editor"
          element={
            <CodeEditor
              currentPanel={currentPanel}
              onDebugClick={handleToggleDebug}
              onFlashClick={handleToggleFlash}
            />
          }
        />
        <Route path="/flowchart" element={<Flowchart />} />
        <Route path="/feedback" element={<Feedback />} />{" "}
        {/* Add the Feedback route */}
        {/* <Route path="/embedded" element={<Embedded />} /> */}
        <Route path="/blockdiagram" element={<BlockDiagram />} />
        <Route path="/defineproduct" element={<DefineProduct />} />
        <Route path="/textbox" element={<TextBox />} />
        <Route path="/fileupload" element={<FileUpload />} />
        <Route path="/simulation" element={<Simulation />} />
        <Route path="/createaccount" element={<CreateAccount />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/simulationpopup" element={<SimulationPopup />} />
        {/* <Route path="/templateone" element={<TemplateOne/>} />
<Route path="/templatetwo" element={<TemplateTwo/>} /> */}
        <Route path="/defineproductone" element={<DefineProductOne />} />
        <Route path="/defineproducttwo" element={<DefineProductTwo />} />
        {/* <Route path="/navbarproductid" element={<NavbarProductId/>} /> */}
        <Route path="/blockdiagramtest" element={<BlockDiagramTest />} />
        <Route path="/fileexplorerone" element={<FileExplorerOne />} />
        <Route
          path="/createproductdefination"
          element={<CreateProductDefination />}
        />
        <Route path="/view-data" element={<VisualizeData />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/userbutton" element={<UserButton />} />
        <Route path="/embedded" element={<EmbeddedFileManagement />} />
        <Route path="/toggle" element={<Toggle />} />

      </Routes>

      {/* <Footer />  */}
    </ChakraProvider>
  );
};

export default App;
