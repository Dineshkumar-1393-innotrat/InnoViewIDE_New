import { useRef, useReducer, useEffect, useCallback } from "react";
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
import { AddIcon, CloseIcon, ExternalLinkIcon, HamburgerIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import LanguageSelector from "./LanguageSelector";
import { CODE_SNIPPETS } from "../constants";
import Output from "./Output";
// import Footer from "./Footer";
import IconBar from "./IconBar";
import FileExplorer from "./FileExplorer";
import DebugPanel from "./DebugPanel";
import Flash from "./Flash";
import Navbar from "./Navbar";
import ActionButtons from "./ActionButtons";

const initialState = {
  tabs: [{ id: 1, name: "Tab 1", content: CODE_SNIPPETS["C"] || "" }],
  activeTab: 1,
  history: { 1: { stack: [CODE_SNIPPETS["C"] || ""], index: 0 } },
};

function editorReducer(state, action) {
  switch (action.type) {
    case 'SET_ACTIVE_TAB':
      return { ...state, activeTab: action.payload };
    case 'ADD_TAB': {
      const newTabId = state.tabs.length ? Math.max(...state.tabs.map(t => t.id)) + 1 : 1;
      const newTab = { id: newTabId, name: `Tab ${newTabId}`, content: "" };
      return {
        ...state,
        tabs: [...state.tabs, newTab],
        activeTab: newTabId,
        history: { ...state.history, [newTabId]: { stack: [""] , index: 0 } },
      };
    }
    case 'CLOSE_TAB': {
      const tabId = action.payload;
      const newTabs = state.tabs.filter(tab => tab.id !== tabId);
      const newHistory = { ...state.history };
      delete newHistory[tabId];
      let newActiveTab = state.activeTab;
      if (state.activeTab === tabId) {
        newActiveTab = newTabs.length > 0 ? newTabs[newTabs.length - 1].id : null;
      }
      return { ...state, tabs: newTabs, history: newHistory, activeTab: newActiveTab };
    }
    case 'UPDATE_CONTENT': {
      const { newValue, activeTab } = action.payload;
      const tabHistory = state.history[activeTab];
      if (tabHistory && tabHistory.stack[tabHistory.index] === newValue) {
        return state;
      }
      const newStack = tabHistory.stack.slice(0, tabHistory.index + 1);
      newStack.push(newValue);
      return {
        ...state,
        tabs: state.tabs.map(tab => tab.id === activeTab ? { ...tab, content: newValue } : tab),
        history: {
          ...state.history,
          [activeTab]: { stack: newStack, index: newStack.length - 1 },
        },
      };
    }
    case 'UNDO': {
        const { activeTab } = state;
        if (!activeTab) return state;
        const tabHistory = state.history[activeTab];
        if (tabHistory && tabHistory.index > 0) {
            const newIndex = tabHistory.index - 1;
            const newContent = tabHistory.stack[newIndex];
            return {
                ...state,
                tabs: state.tabs.map(t => t.id === activeTab ? { ...t, content: newContent } : t),
                history: { ...state.history, [activeTab]: { ...tabHistory, index: newIndex } },
            };
        }
        return state;
    }
    case 'REDO': {
        const { activeTab } = state;
        if (!activeTab) return state;
        const tabHistory = state.history[activeTab];
        if (tabHistory && tabHistory.index < tabHistory.stack.length - 1) {
            const newIndex = tabHistory.index + 1;
            const newContent = tabHistory.stack[newIndex];
            return {
                ...state,
                tabs: state.tabs.map(t => t.id === activeTab ? { ...t, content: newContent } : t),
                history: { ...state.history, [activeTab]: { ...tabHistory, index: newIndex } },
            };
        }
        return state;
    }
    default:
      return state;
  }
}

const CodeEditor = ({ currentPanel, onDebugClick, onFlashClick, onRunClick }) => {
  const editorRef = useRef();
  const [state, dispatch] = useReducer(editorReducer, initialState);
  const { tabs, activeTab, history } = state;
  const [language, setLanguage] = useState("Select Language");
  const { colorMode } = useColorMode();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const MAX_TABS = 10;
  const navigate = useNavigate();

  // Ensure we always have an active tab if one exists

  const onSelect = (selectedLanguage) => {
    setLanguage(selectedLanguage);
    dispatch({ type: 'UPDATE_CONTENT', payload: { newValue: CODE_SNIPPETS[selectedLanguage] || "", activeTab } });
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
    dispatch({ type: 'ADD_TAB' });
  };

  const handleTabClick = (tabId) => {
    dispatch({ type: 'SET_ACTIVE_TAB', payload: tabId });
  };

  const handleEditorChange = (newValue) => {
    dispatch({ type: 'UPDATE_CONTENT', payload: { newValue, activeTab } });
  };

    const closeTab = (tabId, event) => {
    event?.stopPropagation();
    dispatch({ type: 'CLOSE_TAB', payload: tabId });
  };

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  const undo = useCallback(() => dispatch({ type: 'UNDO' }), []);

  const redo = useCallback(() => dispatch({ type: 'REDO' }), []);

    const handleDeleteActiveTab = () => {
    if (activeTab) {
      closeTab(activeTab);
    }
  };

  const goToFlowchart = () => {
    navigate("/flowchart");
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const ctrlKey = isMac ? event.metaKey : event.ctrlKey;

      if (ctrlKey && event.key === 'z') {
        event.preventDefault();
        undo();
      }
      if (ctrlKey && event.key === 'y') {
        event.preventDefault();
        redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [undo, redo]);

  const editorTheme = colorMode === "dark" ? "vs-dark" : "vs-light";

  const activeTabContent = tabs.find((tab) => tab.id === activeTab)?.content || "";

  return (
    <>
      <Navbar />

      <Flex direction={{ base: "column", md: "row" }} h="calc(100vh - 35px)" w="100%" mt="35px">
        {/* Sidebar */}
        {isSidebarOpen && (
          <Box 
            w={{ base: "100%", md: "20%" }} 
            bg={colorMode === "dark" ? "gray.800" : "gray.100"} 
            p={4}
            borderRight={{ md: "1px solid" }}
            borderColor={colorMode === "dark" ? "gray.700" : "gray.200"}
            overflowY="auto"
          >
                        {(() => {
              switch (currentPanel) {
                case 'flash':
                  return <Flash />;
                case 'debug':
                  return <DebugPanel />;
                case 'run':
                  return <Output editorRef={editorRef} language={language} />;
                default:
                  return <FileExplorer />;
              }
            })()}
          </Box>
        )}

        {/* Editor main area */}
        <Flex direction="column" flex="1" position="relative" minH="0">
          <Flex justifyContent="space-between" alignItems="center" p={2} gap={2}>
            <IconButton
              icon={isSidebarOpen ? <CloseIcon /> : <HamburgerIcon />}
              size="sm"
              onClick={toggleSidebar}
              aria-label="Toggle Sidebar"
              // Show on all breakpoints for accessibility
              display="inline-flex"
            />
            <LanguageSelector language={language} onSelect={onSelect} />
          </Flex>

          {/* Tabs bar */}
          <HStack
            spacing={1}
            px={2}
            py={2}
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
                px={3}
                py={2}
                bg={activeTab === tab.id ? "blue.500" : "gray.600"}
                color="white"
                fontSize="sm"
                borderRadius="md"
                whiteSpace="nowrap"
                cursor="pointer"
                minW="120px"
                maxW="260px"
                overflow="hidden"
                textOverflow="ellipsis"
                _hover={{ bg: "blue.400" }}
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

          {/* Editor */}
          <Box flex="1" minH="0" p={2}>
            <Editor
              options={{ minimap: { enabled: false } }}
              height="100%"
              width="100%"
              theme={editorTheme}
              language={language}
              value={activeTabContent}
              onMount={onMount}
              onChange={handleEditorChange}
            />
          </Box>

          {/* Action bar/footer area (Output visible on smaller screens) */}
          <IconBar onDebugClick={onDebugClick} onFlashClick={onFlashClick} />
        </Flex>

        <Flex p={2} bg={colorMode === "dark" ? "gray.800" : "gray.100"}>
          <ActionButtons onRunClick={onRunClick} onDebugClick={onDebugClick} onFlashClick={onFlashClick} onDeleteClick={handleDeleteActiveTab} onUndoClick={undo} onRedoClick={redo} />
        </Flex>

        {/* Output (visible on large screens to the far right) */}
        <Box flex="1" p={4} borderRadius="4px" display={{ base: "none", md: "block" }}>
          <Output editorRef={editorRef} language={language} />
        </Box>
      </Flex>

      <Box mt={4} display={{ base: "none", md: "block" }}>
        {/* <Footer /> */}
      </Box>
    </>
  );
};

export default CodeEditor;