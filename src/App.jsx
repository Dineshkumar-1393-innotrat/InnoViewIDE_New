import React, { useState } from "react";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Routes, Route } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react"; 
import { Provider } from 'react-redux';
import { store } from './store';
import CodeEditor from "./components/CodeEditor";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
// import Footer from "./components/Footer";
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
import ForgotPassword from "./components/ForgotPassword"
import CreateAccount from "./components/CreateAccount"
import SimulationPopup from "./components/SimulationPopup"
import DiagramEditor from "./components/DiagramEditor";

const App = () => {
    const [currentPanel, setCurrentPanel] = useState("fileExplorer");

  const handleToggleRun = () => {
    setCurrentPanel((prevPanel) =>
      prevPanel === "run" ? "fileExplorer" : "run"
    );
  };

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
    <Provider store={store}>
      <ChakraProvider>
        {/* <Navbar />  */}
        
        <ToastContainer
          className="toast-container-custom"
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
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
                onRunClick={handleToggleRun}
              />
            }
          />
          <Route path="/flowchart" element={<Flowchart />} />
          <Route path="/feedback" element={<Feedback />} /> {/* Add the Feedback route */}
          <Route path="/embedded" element={<Embedded />} />
          <Route path="/blockdiagram" element={<BlockDiagram />} />
          <Route path="/defineproduct" element={<DefineProduct />} />
          <Route path="/textbox" element={<TextBox />} />
          <Route path="/fileupload" element={<FileUpload />} />
          <Route path="/simulation" element={<Simulation />} />
          <Route path="/createaccount" element={<CreateAccount />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/simulationpopup" element={<SimulationPopup />} />
          <Route path="/diagram-editor" element={<DiagramEditor />} />
            <Route path = "/flash" element={<Flash />} />
        </Routes>

        {/* <Footer />  */}
      </ChakraProvider>
    </Provider>
  );
};

export default App;
