
import { useRef, useState } from "react";
import { Box, Flex, HStack, IconButton, useColorMode, Text, Tooltip } from "@chakra-ui/react";
import { Editor } from "@monaco-editor/react";
import { AddIcon, CloseIcon, ExternalLinkIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import LanguageSelector from "./LanguageSelector";
import { CODE_SNIPPETS } from "../constants";
import Output from "./Output";
// import Footer from "./Footer";
import IconBar from "./IconBar";
import ProjectExplorer from "./ProjectExplorer"; // Import ProjectExplorer component

const CodeEditor = () => {
  const editorRef = useRef();
  const [value, setValue] = useState(CODE_SNIPPETS["C"] || "");
  const [language, setLanguage] = useState("Select Language");
  const { colorMode } = useColorMode();
  const [tabs, setTabs] = useState([{ id: 1, name: "Tab 1", content: "" }]);
  const [activeTab, setActiveTab] = useState(1);
  const MAX_TABS = 10;
  const navigate = useNavigate();

  // Handle editor mount
  const onMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };

  // Handle language selection
  const onSelect = (language) => {
    setLanguage(language);
    setValue(CODE_SNIPPETS[language] || "");
  };

  // Add new tab
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

  // Handle tab click
  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    const selectedTab = tabs.find((tab) => tab.id === tabId);
    setValue(selectedTab.content);
  };

  // Handle value change in editor and update the active tab's content
  const handleEditorChange = (newValue) => {
    setValue(newValue);
    setTabs(
      tabs.map((tab) =>
        tab.id === activeTab ? { ...tab, content: newValue } : tab
      )
    );
  };

  // Close a tab
  const closeTab = (tabId, event) => {
    event.stopPropagation();
    const newTabs = tabs.filter((tab) => tab.id !== tabId);

    if (newTabs.length > 0) {
      if (activeTab === tabId) {
        setActiveTab(newTabs[newTabs.length - 1].id);
        setValue(newTabs[newTabs.length - 1].content);
      }
    } else {
      setValue("");
    }

    setTabs(newTabs);
  };

  // Navigate to Flowchart page
  const goToFlowchart = () => {
    navigate("/flowchart");
  };

  // Determine theme based on Chakra UI color mode
  const editorTheme = colorMode === "dark" ? "vs-dark" : "vs-light";

  return (
    <Flex direction="column" h="80vh" w="100%">
      <Flex flex="4" position="relative">
        {/* Left Section: Project Explorer */}
        <Box flex="0 0 20%" bg="transparent">
          <ProjectExplorer /> {/* Render ProjectExplorer here */}
        </Box>

        {/* Right Section: Code Editor */}
        <Box flex="1" position="relative">
          {/* Language Selector */}
          <Flex justifyContent="flex-end" mb={2}>
            <LanguageSelector language={language} onSelect={onSelect} />
          </Flex>

          {/* Tabs Section */}
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

                {/* Close Tab Icon */}
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

            {/* New Tab Button */}
            <IconButton
              icon={<AddIcon />}
              size="sm"
              onClick={addNewTab}
              aria-label="Add new tab"
              variant="outline"
              _hover={{ bg: "gray.300" }}
            />

            {/* Flow Chart Toggle Button */}
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
            height="70vh"
            theme={editorTheme}
            language={language}
            value={value}
            onMount={onMount}
            onChange={handleEditorChange}
          />

          {/* Add Icon Bar */}
          <IconBar />
        </Box>
      </Flex>

      {/* Bottom Section: Output */}
      <Box flex="1" p={4} borderRadius="4px">
        <Output editorRef={editorRef} language={language} />
      </Box>

      {/* Footer Section */}
      <Box mt={4}>
        {/* <Footer /> */}
      </Box>
    </Flex>
  );
};

export default CodeEditor;
