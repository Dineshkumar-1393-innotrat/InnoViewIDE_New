import { useState } from "react";
import {
  Box,
  Text,
  Button,
  useColorMode,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  RadioGroup,
  Radio,
  Stack,
  Input,
} from "@chakra-ui/react";
import { executeCode } from "../api";
import OutputStatus from "./OutputStatus";

import axios from "axios";

const Output = ({ editorRef, language }) => {
  const toast = useToast();
  const { colorMode } = useColorMode();
  const [output, setOutput] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isRunClicked, setIsRunClicked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [alignment, setAlignment] = useState("left");
  const [userInput, setUserInput] = useState(""); // User input for stdin
  const [response, setResponse] = useState("");

  const responseStyle = {
    marginTop: "20px",
    padding: "10px",
    backgroundColor: colorMode === "dark" ? "#2D3748" : "#F7FAFC",
    color: colorMode === "dark" ? "#E2E8F0" : "#2D3748",
    borderRadius: "5px",
    border: `1px solid ${colorMode === "dark" ? "#4A5568" : "#CBD5E0"}`,
  };

  const runCode = async () => {
    const sourceCode = editorRef.current.getValue();
    if (!sourceCode) {
      toast({
        title: "No code provided.",
        description: "Please write some code to execute.",
        status: "warning",
        duration: 3000,
      });
      return;
    }

    try {
      setIsLoading(true);
      const { run: result } = await executeCode("c", sourceCode, userInput); // Pass user input
      setOutput((prevOutput) => [...prevOutput, ...result.output.split("\n")]); // Append output
      setIsError(!!result.stderr);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error occurred.",
        description: error.message || "Could not execute the code.",
        status: "error",
        duration: 6000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // handle flash code

  const handleCodeFlash = async () => {
    setIsLoading(true);
    const sourceCode = editorRef.current.getValue();

    console.log(sourceCode);

    if (!sourceCode) {
      alert(
        "⚠️ No source code detected.\nPlease write or upload the firmware before flashing."
      );
      setIsLoading(false);
      return;
    }

    try {
      const { data } = await axios.post(
        "https://admin.innotrat.in/submit-code",
        { code: sourceCode },
        { headers: { "Content-Type": "application/json" } }
      );

      setResponse(data.message);

      alert(
        `✅ Firmware successfully flashed!\nDevice Response: ${data.message}`
      );
    } catch (error) {
      console.error("Flashing Error:", error);
      alert(
        "❌ Firmware flashing failed!\nPlease check your connection, code syntax, and device status."
      );
    } finally {
      setIsLoading(false); // Ensure button re-enables after request
    }
  };

  const handleRunClick = () => {
    setIsRunClicked(true);
    runCode();
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <Box w="100%" p={4} borderRadius="md">
      <Box display="flex" alignItems="center" mb={4} gap={4}>
        {/* Add Hamburger Icon Button for Alignment by me  */}
        <Button
          size="sm"
          colorScheme="blue"
          variant="outline"
          onClick={openModal}
          // mr={4}
        >
          &#9776;
        </Button>

        <Button
          loadingText="Flashing"
          spinnerPlacement="start"
          isLoading={isLoading}
          size={"sm"}
          colorScheme="blue"
          variant={isLoading ? "solid" : "outline"}
          cursor="pointer"
          onClick={handleCodeFlash}
        >
          Flash
        </Button>

        {/* <Text
          fontWeight="bold"
          cursor="pointer"
          onClick={handleRunClick}
          textDecoration={isRunClicked ? "underline" : "none"}
          color="green.500"
          mr={4}
        >
          Run Code
        </Text> */}

        <Button
          size="sm"
          colorScheme="blue"
          variant="outline"
          onClick={() => console.log("Problem Output clicked")}
        >
          Problem Output
        </Button>
        <Button
          size="sm"
          colorScheme="blue"
          variant="outline"
          onClick={() => console.log("Serial Console clicked")}
        >
          Serial Console
        </Button>
        <Button
          size="sm"
          colorScheme="blue"
          variant="outline"
          onClick={() => console.log("Terminal clicked")}
        >
          Terminal
        </Button>
      </Box>

      <pre style={responseStyle}>{response}</pre>

      {/* Input box for stdin is this section i have added here */}
      {/* <Box mb={4}>
        <Text fontSize="sm" mb={4}>
          Provide Input for Your Code:
        </Text>
        <Input
          placeholder="Type input here"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
        />
      </Box> */}

      {/* <Box
        as="hr"
        borderColor={colorMode === "dark" ? "gray.600" : "gray.300"}
        mb={4}
      /> */}

      {/* <Box
        width="100%"
        height="18vh"
        p={3}
        color={
          isError ? "red.400" : colorMode === "dark" ? "gray.300" : "gray.800"
        }
        bg={colorMode === "dark" ? "gray.900" : "#ffffff"}
        border="1px solid"
        borderColor={
          isError ? "red.500" : colorMode === "dark" ? "gray.700" : "gray.300"
        }
        borderRadius="md"
        overflowY="auto"
      >
        {output.length > 0
          ? output.map((line, i) => <Text key={i}>{line}</Text>)
          : 'Click "Run Code" to see the output here'}
      </Box> */}

      {/* <OutputStatus errorLine={{ line: 11, row: 2 }} /> */}

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
    </Box>
  );
};

export default Output;
