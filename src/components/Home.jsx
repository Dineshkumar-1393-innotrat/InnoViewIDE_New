import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Box,
  Flex,
  VStack,
  HStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  Image,
  Heading,
  Text,
  InputGroup,
  InputRightElement,
  IconButton,
  useColorModeValue,
  useToast,
  Select,
  Divider,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@chakra-ui/react";
import { FaEye, FaEyeSlash, FaClock, FaCalendar, FaPlayCircle, FaLock } from "react-icons/fa";
import loginImage from "../images/image.jpg";
import Ellipse521 from "../images/Ellipse 521.svg";
import { Link as ChakraLink } from "@chakra-ui/react";
import { onboardingSteps } from "../data/onboardingSteps";
import { GoogleLogin } from "@react-oauth/google";

const Home = () => {
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [formData, setFormData] = useState({
    mobileNumber: "",
    password: "",
    countryCode: "+91",
  });

  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(
        "https://eureka.innotrat.in/api/v1/auth/signin",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (data.status === "success") {
        sessionStorage.setItem("token", data.token);
        sessionStorage.setItem("userId", data.userData.userId);
        localStorage.setItem("token", data.token);
        localStorage.setItem("userData", JSON.stringify(data.userData));

        toast({
          title: "Success",
          description: "Signin successful",
          status: "success",
          duration: 3000,
          isClosable: true,
        });

        navigate("/editor", { state: { userId: data.userData.userId } });
      } else {
        throw new Error(data.message || "Sign in failed");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigate("/forgotpassword");
  };

  const createAccount = () => {
    navigate("/createaccount");
  };

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [onboardingStep, setOnboardingStep] = useState(0);

  const handleOpenOnboarding = () => {
    setOnboardingStep(0);
    onOpen();
  };

  const handleNextStep = () => {
    if (onboardingStep < onboardingSteps.length - 1) {
      setOnboardingStep(prev => prev + 1);
    } else {
      onClose();
    }
  };

  const handlePrevStep = () => {
    setOnboardingStep(prev => Math.max(0, prev - 1));
  };

  return (
    <>
      <Box
        position="relative"
        width="100%"
        height="70px"
        borderBottom="2px solid"
        borderColor={useColorModeValue("gray.200", "gray.700")}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        padding="0 40px"
        zIndex={1000}
        bg={useColorModeValue("white", "gray.900")}
        boxShadow="sm"
      >
        <img
          src={Ellipse521}
          alt="Innoide"
          style={{ height: "50px", width: "auto" }}
        />
        <HStack spacing={6} color={useColorModeValue("gray.600", "gray.300")} fontSize="sm">
          <HStack spacing={2}>
            <FaCalendar />
            <Text fontWeight="medium">{formatDate(currentDateTime)}</Text>
          </HStack>
          <Divider orientation="vertical" height="20px" />
          <HStack spacing={2}>
            <FaClock />
            <Text fontWeight="semibold" fontSize="md">{formatTime(currentDateTime)}</Text>
          </HStack>
        </HStack>
      </Box>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Flex
          height="calc(100vh - 70px)"
          width="full"
          align="center"
          justifyContent="center"
          bg={useColorModeValue("linear-gradient(135deg, #667eea 0%, #764ba2 100%)", "gray.900")}
          position="relative"
          overflow="hidden"
          _before={{
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bg: useColorModeValue("rgba(255,255,255,0.1)", "rgba(0,0,0,0.3)"),
            backdropFilter: "blur(10px)",
          }}
        >
          <Box
            borderWidth={0}
            px={0}
            width="full"
            maxWidth="1100px"
            borderRadius="2xl"
            boxShadow="2xl"
            overflow="hidden"
            bg={useColorModeValue("white", "gray.800")}
            position="relative"
            zIndex={1}
          >
            <Flex direction={{ base: "column", md: "row" }} height="full">
              <Box
                flex={1}
                display={{ base: "none", md: "block" }}
                position="relative"
              >
                <Image
                  src={loginImage}
                  alt="Login"
                  objectFit="cover"
                  height="100%"
                  width="100%"
                />

                {/* Onboarding Trigger on Image Side */}
                <Box position="absolute" inset="0" display="flex" alignItems="center" justifyContent="center">
                  <Button
                    leftIcon={<FaPlayCircle />}
                    colorScheme="whiteAlpha"
                    onClick={handleOpenOnboarding}
                    size="lg"
                    backdropFilter="blur(8px)"
                    bg="rgba(0,0,0,0.4)"
                    _hover={{ bg: "rgba(0,0,0,0.6)" }}
                  >
                    Watch Intro Tour
                  </Button>
                </Box>
              </Box>

              <VStack
                as="form"
                onSubmit={handleLogin}
                spacing={5}
                p={8}
                flex={1}
                bg={useColorModeValue("white", "gray.800")}
                alignItems="stretch"
                justify="center"
              >
                <Box width="full" textAlign="left">
                  <Flex justify="space-between" align="center" mb={2}>
                    <Heading
                      as="h1"
                      size="xl"
                      bgGradient="linear(to-r, #667eea, #764ba2)"
                      bgClip="text"
                      fontWeight="extrabold"
                    >
                      Welcome Back
                    </Heading>
                    {/* Mobile Trigger */}
                    <IconButton
                      display={{ base: "flex", md: "none" }}
                      icon={<FaPlayCircle />}
                      aria-label="Watch Intro"
                      onClick={handleOpenOnboarding}
                      variant="ghost"
                      colorScheme="purple"
                    />
                  </Flex>
                  <Text fontSize="sm" color={useColorModeValue("gray.600", "gray.400")} mb={4}>
                    Sign in to Innotrat Labs IDE
                  </Text>
                </Box>

                <FormControl id="mobileNumber" isRequired width="full">
                  <FormLabel fontWeight="bold" mb={3}>Mobile Number</FormLabel>
                  <HStack spacing={2} alignItems="stretch">
                    <Select
                      id="countryCode"
                      value={formData.countryCode}
                      onChange={handleInputChange}
                      width="90px"
                      height="45px"
                      borderRadius="lg"
                      color="black"
                      bg="gray.50"
                      border="1px solid"
                      borderColor="gray.200"
                      _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px #3182ce" }}
                      fontSize="md"
                    >
                      <option value="+91">+91</option>
                    </Select>
                    <Input
                      id="mobileNumber"
                      type="tel"
                      placeholder="Mobile Number"
                      height="45px"
                      borderRadius="lg"
                      pattern="[0-9]{10}"
                      maxLength="10"
                      focusBorderColor="blue.500"
                      value={formData.mobileNumber}
                      onChange={handleInputChange}
                      color="black"
                      bg="gray.50"
                      border="1px solid"
                      borderColor="gray.200"
                      _placeholder={{ color: "gray.400" }}
                      fontSize="md"
                      flex={1}
                      _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px #3182ce" }}
                    />
                  </HStack>
                </FormControl>

                <FormControl id="password" isRequired width="full">
                  <FormLabel fontWeight="bold" mb={3}>Password</FormLabel>
                  <HStack spacing={2} alignItems="stretch">
                    <Flex
                      width="90px"
                      height="45px"
                      borderRadius="lg"
                      bg="gray.50"
                      border="1px solid"
                      borderColor="gray.200"
                      alignItems="center"
                      justifyContent="center"
                      color="gray.400"
                    >
                      <FaLock />
                    </Flex>
                    <InputGroup flex={1}>
                      <Input
                        pr="3.5rem"
                        type={show ? "text" : "password"}
                        placeholder="Password"
                        height="45px"
                        borderRadius="lg"
                        value={formData.password}
                        onChange={handleInputChange}
                        color="black"
                        bg="gray.50"
                        border="1px solid"
                        borderColor="gray.200"
                        _placeholder={{ color: "gray.400" }}
                        fontSize="md"
                        fontWeight="medium"
                        _focus={{ borderColor: "purple.500", boxShadow: "0 0 0 1px #805ad5" }}
                      />
                      <InputRightElement height="45px" width="3.5rem">
                        <IconButton
                          h="1.75rem"
                          size="sm"
                          onClick={() => setShow(!show)}
                          aria-label={show ? "Hide password" : "Show password"}
                          icon={show ? <FaEyeSlash /> : <FaEye />}
                          variant="ghost"
                          color="gray.500"
                          _hover={{ bg: "gray.100" }}
                        />
                      </InputRightElement>
                    </InputGroup>
                  </HStack>
                </FormControl>

                <Button
                  type="submit"
                  width="full"
                  height="45px"
                  fontSize="lg"
                  borderRadius="lg"
                  isLoading={isLoading}
                  loadingText="Signing in..."
                  bgGradient="linear(to-r, #667eea, #764ba2)"
                  color="white"
                  _hover={{
                    bgGradient: "linear(to-r, #764ba2, #667eea)",
                    transform: "translateY(-2px)",
                    boxShadow: "xl",
                  }}
                  _active={{
                    transform: "translateY(0)",
                  }}
                  transition="all 0.2s"
                  fontWeight="bold"
                  mt={2}
                >
                  Sign in
                </Button>

                <Flex justify="space-between" width="full" pt={4}>
                  <ChakraLink color="blue.500" onClick={handleForgotPassword}>
                    Forgot password?
                  </ChakraLink>
                  <ChakraLink color="blue.500" onClick={createAccount}>
                    Create an account
                  </ChakraLink>
                </Flex>
                <Text textAlign="center" fontSize="xs" color="green.500">InnoIDE_Rev1.0_06-02-2026 (C) Innotrat Labs</Text>

                <Box width="full" mt={4} display="flex" justifyContent="center">
                  <GoogleLogin
                    onSuccess={async (credentialResponse) => {
                      try {
                        //http://192.168.0.16:5004/auth/google//
                        const response = await fetch("https://eureka.innotrat.in/auth/google", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            token: credentialResponse.credential,
                          }),
                        });

                        const data = await response.json();

                        if (data.status === "success") {
                          sessionStorage.setItem("token", data.token);
                          sessionStorage.setItem("userId", data.userData.userId);
                          localStorage.setItem("token", data.token);
                          localStorage.setItem("userData", JSON.stringify(data.userData));

                          toast({
                            title: "Success",
                            description: "Google Signin successful",
                            status: "success",
                            duration: 3000,
                            isClosable: true,
                          });

                          navigate("/editor", { state: { userId: data.userData.userId } });
                        } else {
                          throw new Error(data.message || "Google Sign in failed");
                        }
                      } catch (error) {
                        toast({
                          title: "Error",
                          description: error.message || "Google Sign in failed",
                          status: "error",
                          duration: 3000,
                          isClosable: true,
                        });
                      }
                    }}
                    onError={() => {
                      toast({
                        title: "Error",
                        description: "Google Login Failed",
                        status: "error",
                        duration: 3000,
                        isClosable: true,
                      });
                    }}
                  />
                </Box>
              </VStack>
            </Flex>
          </Box>
        </Flex>

        {/* Onboarding Modal */}
        <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
          <ModalOverlay backdropFilter="blur(8px)" />
          <ModalContent borderRadius="2xl" overflow="hidden">
            <ModalHeader borderBottom="1px solid" borderColor="gray.100" py={4}>
              <Flex align="center" gap={2}>
                <Heading size="md">InnoIDE Walkthrough</Heading>
              </Flex>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody p={0} bg="gray.50">
              {/* Video Section */}
              <Box bg="black" width="100%" position="relative" paddingBottom="56.25%">
                <Box position="absolute" top="0" left="0" right="0" bottom="0">
                  {onboardingSteps[onboardingStep].videoUrl ? (
                    <video
                      key={onboardingStep}
                      src={onboardingSteps[onboardingStep].videoUrl}
                      autoPlay
                      loop
                      muted
                      playsInline
                      controls
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <Flex height="100%" align="center" justify="center" bg="gray.900" color="white">
                      <VStack>
                        <FaPlayCircle size={48} opacity={0.5} />
                        <Text>Preview: {onboardingSteps[onboardingStep].title}</Text>
                      </VStack>
                    </Flex>
                  )}
                </Box>
              </Box>

              {/* Content Section */}
              <VStack p={6} spacing={3} textAlign="center" bg="white">
                <Text fontSize="xs" fontWeight="bold" color="blue.500" textTransform="uppercase" letterSpacing="wide">
                  Step {onboardingStep + 1} of {onboardingSteps.length}
                </Text>
                <Heading size="lg" color="gray.800">
                  {onboardingSteps[onboardingStep].title}
                </Heading>
                <Text color="gray.600" fontSize="md" maxW="lg">
                  {onboardingSteps[onboardingStep].description}
                </Text>
              </VStack>
            </ModalBody>
            <ModalFooter bg="white" borderTop="1px solid" borderColor="gray.100" p={6}>
              <Flex justify="space-between" width="100%" align="center">
                <Button
                  variant="ghost"
                  onClick={handlePrevStep}
                  isDisabled={onboardingStep === 0}
                  color="gray.500"
                >
                  Previous
                </Button>

                <HStack spacing={2}>
                  {onboardingSteps.map((_, idx) => (
                    <Box
                      key={idx}
                      h="2"
                      w={idx === onboardingStep ? "6" : "2"}
                      bg={idx === onboardingStep ? "blue.500" : "gray.200"}
                      borderRadius="full"
                      transition="all 0.3s"
                    />
                  ))}
                </HStack>

                <Button
                  colorScheme="blue"
                  bgGradient="linear(to-r, #667eea, #764ba2)"
                  _hover={{ bgGradient: "linear(to-r, #764ba2, #667eea)" }}
                  onClick={handleNextStep}
                >
                  {onboardingStep === onboardingSteps.length - 1 ? 'Finish' : 'Next'}
                </Button>
              </Flex>
            </ModalFooter>
          </ModalContent>
        </Modal>

      </motion.div>
    </>
  );
};

export default Home;