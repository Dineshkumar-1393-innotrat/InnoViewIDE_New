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
      const { run: result } = await executeCode(language, sourceCode, userInput); // Pass user input
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
      <Box display="flex" alignItems="center" mb={2}>
        {/* Add Hamburger Icon Button for Alignment by me  */}
        <Button
          size="sm"
          colorScheme="gray"
          variant="ghost"
          onClick={openModal}
          mr={4}
        >
          &#9776;
        </Button>

        <Text
          fontWeight="bold"
          cursor="pointer"
          onClick={handleRunClick}
          textDecoration={isRunClicked ? "underline" : "none"}
          color="green.500"
          mr={4}
        >
          Run Code
        </Text>

        <Button size="sm" colorScheme="blue" variant="outline" onClick={() => console.log('Problem Output clicked')}>
          Problem Output
        </Button>
        <Button size="sm" colorScheme="blue" variant="outline" onClick={() => console.log('Serial Console clicked')} ml={2}>
          Serial Console
        </Button>
        <Button size="sm" colorScheme="blue" variant="outline" onClick={() => console.log('Terminal clicked')} ml={2}>
          Terminal
        </Button>
      </Box>

      {/* Input box for stdin is this section i have added here */}
      <Box mb={4}>
        <Text fontSize="sm" mb={1}>
          Provide Input for Your Code:
          
        </Text>
        <Input
          placeholder="Type input here"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
        />
      </Box>

      <Box as="hr" borderColor={colorMode === "dark" ? "gray.600" : "gray.300"} mb={4} />

      <Box
        width="100%"
        height="18vh"
        p={3}
        color={isError ? "red.400" : colorMode === "dark" ? "gray.300" : "gray.800"}
        bg={colorMode === "dark" ? "gray.900" : "#ffffff"}
        border="1px solid"
        borderColor={isError ? "red.500" : colorMode === "dark" ? "gray.700" : "gray.300"}
        borderRadius="md"
        overflowY="auto"
      >
        {output.length > 0
          ? output.map((line, i) => <Text key={i}>{line}</Text>)
          : 'Click "Run Code" to see the output here'}
      </Box>

      <OutputStatus errorLine={{ line: 11, row: 2 }} />

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