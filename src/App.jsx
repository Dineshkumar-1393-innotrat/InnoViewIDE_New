// import React, { useState } from "react";
// import { Routes, Route } from "react-router-dom";
// import "bootstrap/dist/css/bootstrap.min.css";
// import { ChakraProvider } from "@chakra-ui/react";
// import { AuthProvider } from "./contexts/AuthContext"; // ✅ import your AuthProvider

// import CodeEditor from "./components/CodeEditor";
// import Home from "./components/Home";
// import Navbar from "./components/Navbar";
// import Footer from "./components/Footer";
// import Feedback from "./components/Feedback";
// import Template from "./components/Template";
// import Flowchart from "./components/Flowchart";
// import Flash from "./components/Flash";
// import Embedded from "./components/Embedded"; // Import Embedded component
// import BlockDiagram from "./components/BlockDiagram";
// import DefineProduct from "./components/DefineProduct";
// import TextBox from "./components/TextBox";
// import FileUpload from "./components/FileUpload";
// import Simulation from "./components/Simulation";
// import ForgotPassword from "./components/ForgotPassword";
// import CreateAccount from "./components/CreateAccount";
// import SimulationPopup from "./components/SimulationPopup";
// import TemplateOne from "./components/TemplateOne";
// import TemplateTwo from "./components/TemplateTwo";
// import DefineProductOne from "./components/DefineProductOne";
// import DefineProductTwo from "./components/DefineProductTwo";
// // import NavbarProductId from './components/NavbarProductId';
// import BlockDiagramTest from "./components/BlockDiagramTest";
// import FileExplorerOne from "./components/FileExplorerOne";
// import CreateProductDefination from "../src/components/Product/ProductDefinition/CreateProductDefinition";
// import VisualizeData from "./components/dataVisualization/VisualizeData";
// import Logout from "./components/Logout";
// import UserButton from "./components/UserButton";
// import EmbeddedFileManagement from "./components/EmbeddedFileManagement/EmbeddedFileManagement";
// import Toggle from "./components/Toggle/Toggle"
// import FlowchartTest from "./components/FlowchartTest";
// const App = () => {
//   const [currentPanel, setCurrentPanel] = useState("fileExplorer");

//   const handleToggleDebug = () => {
//     setCurrentPanel((prevPanel) =>
//       prevPanel === "debug" ? "fileExplorer" : "debug"
//     );
//   };

//   const handleToggleFlash = () => {
//     setCurrentPanel((prevPanel) =>
//       prevPanel === "flash" ? "fileExplorer" : "flash"
//     );
//   };

//   return (
//     <ChakraProvider>
//       {/* <Navbar />  */}

//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/template" element={<Template />} />
//         <Route
//           path="/editor"
//           element={
//             <CodeEditor
//               currentPanel={currentPanel}
//               onDebugClick={handleToggleDebug}
//               onFlashClick={handleToggleFlash}
//             />
//           }
//         />
//         <Route path="/flowchart" element={<Flowchart />} />
//         <Route path="/feedback" element={<Feedback />} />{" "}
//         {/* Add the Feedback route */}
//         {/* <Route path="/embedded" element={<Embedded />} /> */}
//         {/* <Route path="/blockdiagram" element={<BlockDiagram />} /> */}
//         <Route path="/defineproduct" element={<DefineProduct />} />
//         <Route path="/textbox" element={<TextBox />} />
//         <Route path="/fileupload" element={<FileUpload />} />
//         <Route path="/simulation" element={<Simulation />} />
//         <Route path="/createaccount" element={<CreateAccount />} />
//         <Route path="/forgotpassword" element={<ForgotPassword />} />
//         <Route path="/simulationpopup" element={<SimulationPopup />} />
//         {/* <Route path="/templateone" element={<TemplateOne/>} />
// <Route path="/templatetwo" element={<TemplateTwo/>} /> */}
//         <Route path="/defineproductone" element={<DefineProductOne />} />
//         <Route path="/defineproducttwo" element={<DefineProductTwo />} />
//         {/* <Route path="/navbarproductid" element={<NavbarProductId/>} /> */}
//         <Route path="/blockdiagramtest" element={<BlockDiagram />} />
//         <Route path="/flowcharttest" element={<Flowchart />} />
//         <Route path="/fileexplorerone" element={<FileExplorerOne />} />
//         <Route
//           path="/createproductdefination"
//           element={<CreateProductDefination />}
//         />
//         <Route path="/view-data" element={<VisualizeData />} />
//         <Route path="/logout" element={<Logout />} />
//         <Route path="/userbutton" element={<UserButton />} />
//         <Route path="/embedded" element={<EmbeddedFileManagement />} />
//         <Route path="/toggle" element={<Toggle />} />

//       </Routes>

//       {/* <Footer />  */}
//     </ChakraProvider>
//   );
// };

// export default App;


import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { ChakraProvider } from "@chakra-ui/react";
import { AuthProvider } from "./contexts/AuthContext";
import { ProjectProvider } from "./ProjectContext";

import MeetLanding from "./components/MeetLanding";
import JoinMeeting from "./components/JoinMeeting";
import CodeEditor from "./components/CodeEditor";
import Home from "./components/Home";
// import MeetLandingPage from "./components/MeetLandingPage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Feedback from "./components/Feedback";
import Template from "./components/Template";
// import Flowchart from "./components/Flowchart";
import Flash from "./components/Flash";
import Embedded from "./components/Embedded";
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
import BlockDiagramTest from "./components/BlockDiagramTest";
import FileExplorerOne from "./components/FileExplorerOne";
import CreateProductDefination from "./components/Product/ProductDefinition/CreateProductDefinition";
import VisualizeData from "./components/dataVisualization/VisualizeData";
import Logout from "./components/Logout";
import UserButton from "./components/UserButton";
import EmbeddedFileManagement from "./components/EmbeddedFileManagement/EmbeddedFileManagement";
import Toggle from "./components/Toggle/Toggle";
import FlowchartTest from "./components/FlowchartTest";
import BlockProgramming from "./components/BlockProgramming";
import MathCodeEditor from "./components/MathCodeEditor";
import ParticipantJoin from "./components/ParticipantJoin";
// import JoinMeeting from "./components/JoinMeeting";
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
      <ProjectProvider>
        <AuthProvider>
          {/* <Navbar /> */}

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/template" element={<Template />} />
            <Route path="/meet" element={<MeetLanding />} />
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
            {/* <Route path="/Flowchartone" element={<Flowchartone />} /> */}
            <Route path="/FlowchartTest" element={<FlowchartTest />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/defineproduct" element={<DefineProduct />} />
            <Route path="/textbox" element={<TextBox />} />
            <Route path="/fileupload" element={<FileUpload />} />
            <Route path="/simulation" element={<Simulation />} />
            <Route path="/createaccount" element={<CreateAccount />} />
            <Route path="/forgotpassword" element={<ForgotPassword />} />
            <Route path="/simulationpopup" element={<SimulationPopup />} />
            <Route path="/defineproductone" element={<DefineProductOne />} />
            <Route path="/defineproducttwo" element={<DefineProductTwo />} />
            <Route path="/BlockDiagram" element={<BlockDiagramTest />} />
            {/* <Route path="/flowcharttest" element={<Flowchart />} />  */}
            <Route path="/blockprogramming" element={<BlockProgramming />} />
            <Route path="/fileexplorerone" element={<FileExplorerOne />} />
            <Route
              path="/createproductdefination"
              element={<CreateProductDefination />}
            />
            <Route path="/view-data" element={<VisualizeData />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/userbutton" element={<UserButton />} />
            <Route path="/embedded" element={<EmbeddedFileManagement />} />
            <Route path="/embedded/manage" element={<EmbeddedFileManagement />} />
            <Route path="/toggle" element={<Toggle />} />
            <Route path="/mathcodeeditor" element={<MathCodeEditor />} />
            {/* <Route path="/join/:meetingId" element={<ParticipantJoin />} /> */}
            {/* <Route path="/dytemeeting" element={<MeetLandingPage />} />
        <Route path="/join" element={<JoinMeeting />} /> */}
            <Route path="/join/:meetingId" element={<JoinMeeting />} />
          </Routes>

          {/* <Footer /> */}
        </AuthProvider>
      </ProjectProvider>
    </ChakraProvider>
  );
};

export default App;






