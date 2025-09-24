import React, { useState, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
    useColorMode,
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    RadioGroup,
    Stack,
    Radio,
    Flex,
    HStack,
    IconButton,
    Text,
    Box
} from '@chakra-ui/react';
import { Editor } from "@monaco-editor/react";
import { AddIcon, CloseIcon } from "@chakra-ui/icons";
import LanguageSelector from "./LanguageSelector";
import { CODE_SNIPPETS } from "../constants";
import OutputStatus from './OutputStatus';
import Terminal from './Terminal';
import SerialConsole from './SerialConsole';

const Embedded = () => {
    const {
        startFlashing,
        device,
        tabs,
        activeTab,
        language,
        handleEditorChange,
        handleLanguageChange,
        addNewTab,
        closeTab,
        setActiveTab,
        activeView,
        setActiveView,
        setEditorRef
    } = useOutletContext();
    const editorRef = useRef();
    const { colorMode } = useColorMode();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [alignment, setAlignment] = useState('left');

    // --- Definitive State Management for Output ---
    const [output, setOutput] = useState('');
    const [problemOutput, setProblemOutput] = useState('');
        const [status, setStatus] = useState({ errors: 1, warnings: 1, branch: 'main', errorLine: { line: 11, row: 2 } });
    // ---------------------------------------------

    const MAX_TABS = 5;

    const onMount = (editor, monaco) => {
        setEditorRef(editor.getDomNode());
        editor.focus();
    };






    const closeModal = () => setIsModalOpen(false);

    const activeTabContent = tabs.find(tab => tab.id === activeTab)?.content || "";

    // --- Definitive handleSubmit Logic ---
    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!device) {
            alert('Device not found. Please ensure the device is connected.');
            return;
        }

        startFlashing();

        // Simulate dynamic status updates
        const newErrors = Math.floor(Math.random() * 5);
        const newWarnings = Math.floor(Math.random() * 10);
        setStatus(prevStatus => ({
            ...prevStatus,
            errors: newErrors,
            warnings: newWarnings,
            errorLine: newErrors > 0 ? { line: Math.floor(Math.random() * 20) + 1, row: Math.floor(Math.random() * 10) + 1 } : null
        }));

        // Original fetch logic
        try {
            const res = await fetch('https://admin.innotrat.in/submit-code', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: activeTabContent })
            });

            const result = await res.json();
            setProblemOutput(result.message || 'No output received.');
            setOutput('Code received and stored for flashing');
            setActiveView('output');
        } catch (error) {
            console.error('Error:', error);
            setOutput('Error flashing code to the device');
        }
    };
    // -----------------------------------


    const buttonStyle = {
        padding: '10px 20px',
        fontSize: '16px',
        color: 'white',
        backgroundColor: colorMode === 'dark' ? '#4A90E2' : '#3182CE',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        marginTop: '10px',
        // opacity: isFlashing ? 0.6 : 1,
    };

    const responseStyle = {
        marginTop: '20px',
        padding: '10px',
        backgroundColor: colorMode === 'dark' ? '#2D3748' : '#F7FAFC',
        color: colorMode === 'dark' ? '#E2E8F0' : '#2D3748',
        borderRadius: '5px',
        border: `1px solid ${colorMode === 'dark' ? '#4A5568' : '#CBD5E0'}`,
    };

    const editorTheme = colorMode === "dark" ? "vs-dark" : "vs-light";

    return (
        <>
            <Box p={4}>
                <Flex justifyContent="flex-end">
                    <LanguageSelector language={language} onSelect={handleLanguageChange} />
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
                            onClick={() => setActiveTab(tab.id)}
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
                            <Text mr={2} noOfLines={1}>{tab.name}</Text>
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
                </HStack>

                <Editor
                    height="300px"
                    theme={editorTheme}
                    language={language.toLowerCase()}
                    value={activeTabContent}
                    onMount={onMount}
                    onChange={handleEditorChange}
                    options={{ minimap: { enabled: false } }}
                />

                <form onSubmit={handleSubmit} style={{ marginTop: '10px' }}>
                    <Flex align="center">
                        <button
                            type="submit"
                            style={buttonStyle}
                            disabled={activeTabContent.trim().length === 0}
                        >
                            'Flash Code'
                        </button>
                        {/* --- Definitive onClick Handlers --- */}
                        <Button size="sm" colorScheme="blue" variant="outline" onClick={() => { setOutput(problemOutput); setActiveView('output'); }} ml={4}>
                            Problem Output
                        </Button>
                        <Button size="sm" colorScheme="blue" variant="outline" onClick={() => setActiveView('serial')} ml={2}>
                            Serial Console
                        </Button>
                        <Button size="sm" colorScheme="blue" variant="outline" onClick={() => setActiveView('terminal')} ml={2}>
                            Terminal
                        </Button>
                        {/* ------------------------------------ */}
                    </Flex>
                </form>

                {/* --- Definitive Rendering Logic --- */}
                <Box mt={4}>
                    {activeView === 'output' && output && (
                        <pre style={responseStyle}>{output}</pre>
                    )}
                    {activeView === 'serial' && <SerialConsole />}
                    {activeView === 'terminal' && <Terminal />}
                </Box>
                {/* ---------------------------------- */}

                <OutputStatus stats={status} />
        </Box>

            <Modal isOpen={isModalOpen} onClose={closeModal}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Choose Panel Alignment</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <RadioGroup onChange={setAlignment} value={alignment}>
                            <Stack direction="column">
                                <Radio value="left">Left</Radio>
                                <Radio value="right">Right</Radio>
                                <Radio value="top">Top</Radio>
                                <Radio value="bottom">Bottom</Radio>
                            </Stack>
                        </RadioGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={closeModal}>
                            Apply
                        </Button>
                        <Button variant="ghost" onClick={closeModal}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default Embedded;
