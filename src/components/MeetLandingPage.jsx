import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  VStack,
  IconButton,
  useColorModeValue,
} from "@chakra-ui/react";
import { Search, Video, ArrowRight } from "lucide-react";
import DyteMeetingLauncher from "./DyteMeetingLauncher";

const MeetLanding = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState("");

  const bg = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const headingColor = useColorModeValue("gray.800", "white");
  const subheadingColor = useColorModeValue("gray.600", "gray.300");

  // Resolve current user name for meeting title / host name
  const currentUserName = useMemo(() => {
    try {
      const stored = localStorage.getItem("currentUserIdentity");
      if (!stored) return "InnoIDE User";
      const parsed = JSON.parse(stored);
      return parsed?.name || "InnoIDE User";
    } catch {
      return "InnoIDE User";
    }
  }, []);

  const handleJoinByCode = () => {
    const trimmed = code.trim();
    if (!trimmed) return;
    navigate(`/join/${trimmed}`);
  };

  const handleCodeKey = (e) => {
    if (e.key === "Enter") {
      handleJoinByCode();
    }
  };

  return (
    <Flex
      minH="100vh"
      bg={bg}
      align="center"
      justify="center"
      px={4}
    >
      <Box
        maxW="960px"
        w="100%"
        bg={cardBg}
        borderRadius="2xl"
        boxShadow="2xl"
        p={{ base: 8, md: 12 }}
      >
        {/* Header */}
        <Flex justify="space-between" align="center" mb={8}>
          <Flex align="center" gap={2}>
            <Box
              bg="blue.500"
              borderRadius="md"
              w={8}
              h={8}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Video size={18} color="white" />
            </Box>
            <Heading as="h1" size="md" color={headingColor}>
              InnoIDE Meet
            </Heading>
          </Flex>
        </Flex>

        {/* Main content */}
        <Flex direction={{ base: "column", md: "row" }} gap={10}>
          {/* Left: hero text */}
          <VStack align="flex-start" spacing={4} flex={1}>
            <Heading as="h2" size="xl" color={headingColor}>
              Secure video conferencing for your workspace
            </Heading>
            <Text fontSize="md" color={subheadingColor} maxW="480px">
              Start an instant meeting or join using a code. Powered by Dyte and
              integrated with InnoIDE.
            </Text>

            {/* New meeting button (uses DyteMeetingLauncher under the hood) */}
            <Flex align="center" gap={4} mt={4}>
              <DyteMeetingLauncher
                buttonClassName="meet-landing-new-meeting-btn"
                participantName={currentUserName}
                meetingTitle={`${currentUserName}'s InnoIDE Session`}
                asLandingButton
              />
            </Flex>
          </VStack>

          {/* Right: join by code */}
          <VStack
            spacing={4}
            align="stretch"
            flex={1}
            bg={useColorModeValue("gray.50", "gray.700")}
            borderRadius="xl"
            p={6}
          >
            <Text fontWeight="semibold" color={headingColor}>
              Join with a code
            </Text>
            <InputGroup size="lg">
              <Input
                placeholder="Enter meeting code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onKeyDown={handleCodeKey}
                bg={useColorModeValue("white", "gray.800")}
              />
              <InputRightElement>
                <IconButton
                  aria-label="Join by code"
                  icon={<ArrowRight size={18} />}
                  size="sm"
                  colorScheme="blue"
                  onClick={handleJoinByCode}
                  isDisabled={!code.trim()}
                />
              </InputRightElement>
            </InputGroup>
            <Text fontSize="sm" color={subheadingColor}>
              Use the meeting ID shared by the host. You'll be asked to allow
              access to your camera and microphone.     
            </Text>
          </VStack>
        </Flex>
      </Box>
    </Flex>
  );
};

export default MeetLanding;
