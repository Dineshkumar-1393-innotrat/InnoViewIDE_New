// import { useRef, useState } from "react";
// import {
//   Box,
//   Flex,
//   HStack,
//   IconButton,
//   useColorMode,
//   Text,
//   Tooltip,
// } from "@chakra-ui/react";
// import { Editor } from "@monaco-editor/react";
// import { AddIcon, CloseIcon, ExternalLinkIcon } from "@chakra-ui/icons";
// import { useNavigate } from "react-router-dom";
// import LanguageSelector from "./LanguageSelector";
// import { CODE_SNIPPETS } from "../constants";
// import Output from "./Output";
// import Footer from "./Footer";
// import IconBar from "./IconBar";
// import FileExplorer from "./FileExplorer";
// import Debug from "./Debug";
// import Flash from "./Flash";
// import Navbar from "./Navbar";

// const CodeEditor = ({ currentPanel, onDebugClick, onFlashClick }) => {
//   const editorRef = useRef();
//   const [value, setValue] = useState(CODE_SNIPPETS["C"] || "");
//   const [language, setLanguage] = useState("Select Language");
//   const { colorMode } = useColorMode();
//   const [tabs, setTabs] = useState([{ id: 1, name: "Tab 1", content: "" }]);
//   const [activeTab, setActiveTab] = useState(1);
//   const MAX_TABS = 10;
//   const navigate = useNavigate();

//   const onSelect = (selectedLanguage) => {
//     setLanguage(selectedLanguage);
//     setValue(CODE_SNIPPETS[selectedLanguage] || "");
//   };

  
//   const onMount = (editor) => {
//     editorRef.current = editor;
//     editor.focus();
//   };

//   const addNewTab = () => {
//     if (tabs.length >= MAX_TABS) {
//       alert("Maximum of 10 tabs allowed.");
//       return;
//     }

//     const newTabId = tabs.length + 1;
//     const newTab = { id: newTabId, name: `Tab ${newTabId}`, content: "" };
//     setTabs([...tabs, newTab]);
//     setActiveTab(newTabId);
//   };

//   const handleTabClick = (tabId) => {
//     setActiveTab(tabId);
//     const selectedTab = tabs.find((tab) => tab.id === tabId);
//     setValue(selectedTab.content);
//   };

//   const handleEditorChange = (newValue) => {
//     setValue(newValue);
//     setTabs(
//       tabs.map((tab) =>
//         tab.id === activeTab ? { ...tab, content: newValue } : tab
//       )
//     );
//   };

//   const closeTab = (tabId, event) => {
//     event.stopPropagation();
//     const newTabs = tabs.filter((tab) => tab.id !== tabId);

//     if (newTabs.length > 0) {
//       if (activeTab === tabId) {
//         setActiveTab(newTabs[newTabs.length - 1].id);
//         setValue(newTabs[newTabs.length - 1].content);
//       }
//     } else {
//       setValue("");
//     }

//     setTabs(newTabs);
//   };

//   const goToFlowchart = () => {
//     navigate("/flowchart");
//   };

//   const editorTheme = colorMode === "dark" ? "vs-dark" : "vs-light";

//   return (
//     <>
//       <Navbar />

//       <Flex direction="column" h="85vh" w="100%" mt={12}>  {/* mt updated */}
//         <Flex flex="4" position="relative">
//           <Box flex="0 0 20%">
//             {currentPanel === "flash" ? (
//               <Flash />
//             ) : currentPanel === "debug" ? (
//               <Debug />
//             ) : (
//               <FileExplorer />
//             )}
//           </Box>

//           <Box flex="1" position="relative">
//             {/* Language Selector with additional margin */}
//             <Flex justifyContent="flex-end" mb={4} mt={4}> {/* Adjusted position here i have adjusted the position for navbar problem*/}
//               <LanguageSelector language={language} onSelect={onSelect} />
//             </Flex>

//             <HStack
//               spacing={1}
//               p={2}
//               borderBottom="1px solid"
//               borderColor={colorMode === "dark" ? "gray.700" : "gray.200"}
//               bg={colorMode === "dark" ? "gray.800" : "gray.100"}
//               overflowX="auto"
//             >
//               {tabs.map((tab) => (
//                 <Flex
//                   key={tab.id}
//                   align="center"
//                   onClick={() => handleTabClick(tab.id)}
//                   p={2}
//                   bg={activeTab === tab.id ? "blue.500" : "gray.600"}
//                   color="white"
//                   fontSize="sm"
//                   flexShrink={0}
//                   borderRadius="md"
//                   whiteSpace="nowrap"
//                   cursor="pointer"
//                   _hover={{ bg: "blue.400" }}
//                   maxW="100px"
//                   textOverflow="ellipsis"
//                   overflow="hidden"
//                 >
//                   <Text mr={2} noOfLines={1}>
//                     {tab.name}
//                   </Text>

//                   <IconButton
//                     icon={<CloseIcon />}
//                     size="xs"
//                     ml={1}
//                     aria-label="Close tab"
//                     variant="ghost"
//                     onClick={(event) => closeTab(tab.id, event)}
//                     _hover={{ bg: "red.500" }}
//                     color="white"
//                   />
//                 </Flex>
//               ))}

//               <IconButton
//                 icon={<AddIcon />}
//                 size="sm"
//                 onClick={addNewTab}
//                 aria-label="Add new tab"
//                 variant="outline"
//                 _hover={{ bg: "gray.300" }}
//               />

//               <Tooltip label="Flow Chart" aria-label="Flow Chart Tooltip">
//                 <IconButton
//                   icon={<ExternalLinkIcon />}
//                   size="sm"
//                   onClick={goToFlowchart}
//                   aria-label="Go to Flow Chart"
//                   variant="outline"
//                   _hover={{ bg: "gray.300" }}
//                 />
//               </Tooltip>
//             </HStack>

//             <Editor
//               options={{
//                 minimap: { enabled: false },
//               }}
//               height="73vh"
//               theme={editorTheme}
//               language={language}
//               value={value}
//               onMount={onMount}
//               onChange={handleEditorChange}
//             />

//             <IconBar onDebugClick={onDebugClick} onFlashClick={onFlashClick} />
//           </Box>
//         </Flex>

//         <Box flex="1" p={4} borderRadius="4px">
//           <Output editorRef={editorRef} language={language} />
//         </Box>

//         <Box mt={4}>
//           <Footer />
//         </Box>
//       </Flex>
//     </>
//   );
// };

// export default CodeEditor;

import { useRef, useState } from "react";
import {
  Box,
  Flex,
  HStack,
  IconButton,
  useColorMode,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { Editor } from "@monaco-editor/react";
import { AddIcon, CloseIcon, ExternalLinkIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import LanguageSelector from "./LanguageSelector";
import { CODE_SNIPPETS } from "../constants";
import Output from "./Output";
import Footer from "./Footer";
import IconBar from "./IconBar";
import FileExplorer from "./FileExplorer";
import Debug from "./Debug";
import Flash from "./Flash";
import Navbar from "./Navbar";

const CodeEditor = ({ currentPanel, onDebugClick, onFlashClick }) => {
  const editorRef = useRef();
  const [tabs, setTabs] = useState([
    { id: 1, name: "Tab 1", content: CODE_SNIPPETS["C"] || "" },
  ]);
  const [activeTab, setActiveTab] = useState(1);
  const [language, setLanguage] = useState("Select Language");
  const { colorMode } = useColorMode();
  const navigate = useNavigate();

  const MAX_TABS = 10;

  const onSelect = (selectedLanguage) => {
    setLanguage(selectedLanguage);
    const updatedTabs = tabs.map((tab) =>
      tab.id === activeTab
        ? { ...tab, content: CODE_SNIPPETS[selectedLanguage] || "" }
        : tab
    );
    setTabs(updatedTabs);
  };

  const onMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };

  const addNewTab = () => {
    if (tabs.length >= MAX_TABS) {
      alert("Maximum of 10 tabs allowed.");
      return;
    }

    const newTabId = tabs.length + 1;
    const newTab = { id: newTabId, name: `Tab ${newTabId}`, content: "" };
    setTabs([...tabs, newTab]);
    setActiveTab(newTabId);
  };

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  const handleEditorChange = (newValue) => {
    setTabs(
      tabs.map((tab) =>
        tab.id === activeTab ? { ...tab, content: newValue } : tab
      )
    );
  };

  const closeTab = (tabId, event) => {
    event.stopPropagation();
    const newTabs = tabs.filter((tab) => tab.id !== tabId);

    if (newTabs.length > 0) {
      if (activeTab === tabId) {
        setActiveTab(newTabs[newTabs.length - 1].id);
      }
    } else {
      setActiveTab(null);
    }

    setTabs(newTabs);
  };

  const goToFlowchart = () => {
    navigate("/flowchart");
  };

  const editorTheme = colorMode === "dark" ? "vs-dark" : "vs-light";

  const activeTabContent = tabs.find((tab) => tab.id === activeTab)?.content || "";

  return (
    <>
      <Navbar />

      <Flex direction="column" h="85vh" w="100%" mt={12}>
        <Flex flex="4" position="relative">
          <Box flex="0 0 20%">
            {currentPanel === "flash" ? (
              <Flash />
            ) : currentPanel === "debug" ? (
              <Debug />
            ) : (
              <FileExplorer />
            )}
          </Box>

          <Box flex="1" position="relative">
            <Flex justifyContent="flex-end" mb={4} mt={4}>
              <LanguageSelector language={language} onSelect={onSelect} />
            </Flex>

            <HStack
              spacing={1}
              p={2}
              borderBottom="1px solid"
              borderColor={colorMode === "dark" ? "gray.700" : "gray.200"}
              bg={colorMode === "dark" ? "gray.800" : "gray.100"}
              overflowX="auto"
            >
              {tabs.map((tab) => (
                <Flex
                  key={tab.id}
                  align="center"
                  onClick={() => handleTabClick(tab.id)}
                  p={2}
                  bg={activeTab === tab.id ? "blue.500" : "gray.600"}
                  color="white"
                  fontSize="sm"
                  flexShrink={0}
                  borderRadius="md"
                  whiteSpace="nowrap"
                  cursor="pointer"
                  _hover={{ bg: "blue.400" }}
                  maxW="100px"
                  textOverflow="ellipsis"
                  overflow="hidden"
                >
                  <Text mr={2} noOfLines={1}>
                    {tab.name}
                  </Text>

                  <IconButton
                    icon={<CloseIcon />}
                    size="xs"
                    ml={1}
                    aria-label="Close tab"
                    variant="ghost"
                    onClick={(event) => closeTab(tab.id, event)}
                    _hover={{ bg: "red.500" }}
                    color="white"
                  />
                </Flex>
              ))}

              <IconButton
                icon={<AddIcon />}
                size="sm"
                onClick={addNewTab}
                aria-label="Add new tab"
                variant="outline"
                _hover={{ bg: "gray.300" }}
              />

              <Tooltip label="Flow Chart" aria-label="Flow Chart Tooltip">
                <IconButton
                  icon={<ExternalLinkIcon />}
                  size="sm"
                  onClick={goToFlowchart}
                  aria-label="Go to Flow Chart"
                  variant="outline"
                  _hover={{ bg: "gray.300" }}
                />
              </Tooltip>
            </HStack>

            <Editor
              options={{
                minimap: { enabled: false },
              }}
              height="73vh"
              theme={editorTheme}
              language={language}
              value={activeTabContent}
              onMount={onMount}
              onChange={handleEditorChange}
            />

            <IconBar onDebugClick={onDebugClick} onFlashClick={onFlashClick} />
          </Box>
        </Flex>

        <Box flex="1" p={4} borderRadius="4px">
          <Output editorRef={editorRef} language={language} />
        </Box>

        <Box mt={4}>
          <Footer />
        </Box>
      </Flex>
    </>
  );
};

export default CodeEditor;
