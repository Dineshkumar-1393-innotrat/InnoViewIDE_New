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
  InputLeftElement,
  FormErrorMessage,
} from "@chakra-ui/react";
import { FaClock, FaCalendar, FaPlayCircle, FaLock } from "react-icons/fa";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
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
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let newErrors = {};
    let isValid = true;

    const mobileRegex = /^[0-9]{10}$/;
    if (!formData.mobileNumber) {
      newErrors.mobileNumber = "Mobile Number is required";
      isValid = false;
    } else if (!mobileRegex.test(formData.mobileNumber)) {
      newErrors.mobileNumber = "Valid 10-digit Mobile Number is required";
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

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
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await fetch(
        "/api/v1/auth/signin",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      // Safely parse: the server may return an HTML error page on 5xx
      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(
          response.ok
            ? "Invalid response from server"
            : `Server error ${response.status}: ${response.statusText}`
        );
      }

      if (!response.ok) {
        throw new Error(data?.message || `Request failed with status ${response.status}`);
      }

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
      <Box position="relative" width="100vw" height="100vh" overflow="hidden">
        {/* Full-Screen Background Image */}
        <Image src={loginImage} alt="Background" objectFit="cover" position="absolute" top={0} left={0} w="100%" h="100%" zIndex={0} />
        
        {/* Dark Gradient Overlay */}
        <Box position="absolute" top={0} left={0} w="100%" h="100%" bgGradient="linear(to-br, rgba(17, 24, 39, 0.7), rgba(17, 24, 39, 0.9))" zIndex={1} />

        {/* Floating Glass Header */}
        <Flex position="absolute" top={0} left={0} right={0} height={{ base: "70px", md: "80px" }} alignItems="center" justifyContent="space-between" padding={{ base: "0 20px", md: "0 40px" }} zIndex={10} bg="rgba(255, 255, 255, 0.03)" backdropFilter="blur(10px)" borderBottom="1px solid rgba(255, 255, 255, 0.05)">
          <img src={Ellipse521} alt="Innoide" style={{ height: "40px", width: "auto", filter: "drop-shadow(0px 2px 4px rgba(0,0,0,0.5))" }} />
          <HStack spacing={6} color="whiteAlpha.900" fontSize={{ base: "xs", md: "sm" }}>
            <HStack spacing={2}>
              <FaCalendar opacity={0.8} />
              <Text fontWeight="medium" letterSpacing="wide" whiteSpace="nowrap">{formatDate(currentDateTime)}</Text>
            </HStack>
            <Divider orientation="vertical" height="20px" borderColor="whiteAlpha.300" display={{ base: "none", md: "block" }} />
            <HStack spacing={2}>
              <FaClock opacity={0.8} />
              <Text fontWeight="semibold" letterSpacing="wide" fontSize={{ base: "sm", md: "md" }} whiteSpace="nowrap">{formatTime(currentDateTime)}</Text>
            </HStack>
          </HStack>
        </Flex>

        {/* Centered Glass Login Card */}
        <Flex position="relative" zIndex={10} width="100%" height="100%" align="center" justify="center" pt={{ base: "70px", md: "80px" }}>
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
            <Box width={{ base: "90vw", sm: "350px", md: "380px" }} p={{ base: 6, md: 7 }} borderRadius="2xl" bg="rgba(255, 255, 255, 0.05)" backdropFilter="blur(20px)" border="1px solid rgba(255, 255, 255, 0.1)" boxShadow="0 25px 50px -12px rgba(0, 0, 0, 0.5)">
              <VStack as="form" onSubmit={handleLogin} spacing={4} width="full" alignItems="stretch">
                <Box width="full" mb={2} textAlign="center">
                  <Heading as="h1" size="xl" color="white" fontWeight="extrabold" mb={2} letterSpacing="tight" textShadow="0 2px 10px rgba(0,0,0,0.3)">
                    Welcome Back
                  </Heading>
                  <Text fontSize="sm" color="whiteAlpha.700" fontWeight="medium">
                    Sign in to Innotrat Labs IDE
                  </Text>
                </Box>

                <FormControl id="mobileNumber" isRequired isInvalid={!!errors.mobileNumber}>
                  <FormLabel fontSize="sm" fontWeight="semibold" color="whiteAlpha.900" mb={1}>
                    Mobile Number
                  </FormLabel>
                  <Flex align="stretch">
                    <Select id="countryCode" value={formData.countryCode} onChange={handleInputChange} width="100px" height="42px" fontSize="md" borderRightRadius="0" bg="rgba(0, 0, 0, 0.2)" color="white" border="1px solid rgba(255, 255, 255, 0.1)" _focus={{ borderColor: "purple.400", boxShadow: "0 0 0 1px #9F7AEA", zIndex: 1 }} sx={{ '> option': { background: '#1F2937', color: 'white' } }}>
                      <option value="+91">+91</option>
                    </Select>
                    <Input id="mobileNumber" type="tel" placeholder="Enter mobile number" height="42px" fontSize="md" flex={1} w="full" borderLeftRadius="0" borderLeft="none" pattern="[0-9]{10}" maxLength="10" value={formData.mobileNumber} onChange={handleInputChange} bg="rgba(0, 0, 0, 0.2)" color="white" border="1px solid rgba(255, 255, 255, 0.1)" _placeholder={{ color: "whiteAlpha.400" }} _focus={{ borderColor: "purple.400", boxShadow: "0 0 0 1px #9F7AEA", zIndex: 1 }} sx={{ '&:-webkit-autofill': { WebkitBoxShadow: '0 0 0 30px #1F2937 inset !important', WebkitTextFillColor: 'white !important', transition: 'background-color 5000s ease-in-out 0s' } }} />
                  </Flex>
                  {errors.mobileNumber && <FormErrorMessage>{errors.mobileNumber}</FormErrorMessage>}
                </FormControl>

                <FormControl id="password" isRequired isInvalid={!!errors.password}>
                  <FormLabel fontSize="sm" fontWeight="semibold" color="whiteAlpha.900" mb={1}>
                    Password
                  </FormLabel>
                  <InputGroup size="lg" width="100%">
                    <InputLeftElement pointerEvents="none" height="42px">
                      <FaLock color="rgba(255,255,255,0.4)" />
                    </InputLeftElement>
                    <Input id="password" type={show ? "text" : "password"} placeholder="Enter your password" height="42px" fontSize="md" w="100%" borderRadius="lg" value={formData.password} onChange={handleInputChange} pl="10" pr="3rem" bg="rgba(0, 0, 0, 0.2)" color="white" border="1px solid rgba(255, 255, 255, 0.1)" _placeholder={{ color: "whiteAlpha.400" }} _focus={{ borderColor: "purple.400", boxShadow: "0 0 0 1px #9F7AEA" }} sx={{ '&:-webkit-autofill': { WebkitBoxShadow: '0 0 0 30px #1F2937 inset !important', WebkitTextFillColor: 'white !important', transition: 'background-color 5000s ease-in-out 0s' } }} />
                    <InputRightElement height="42px" width="3rem" right="0">
                      <IconButton size="sm" onClick={() => setShow(!show)} icon={show ? <ViewOffIcon /> : <ViewIcon />} variant="ghost" color="whiteAlpha.600" _hover={{ color: "white", bg: "whiteAlpha.200" }} aria-label={show ? "Hide password" : "Show password"} />
                    </InputRightElement>
                  </InputGroup>
                  {errors.password && <FormErrorMessage>{errors.password}</FormErrorMessage>}
                </FormControl>

                <Button type="submit" width="full" height="42px" borderRadius="lg" isLoading={isLoading} loadingText="Signing in..." bgGradient="linear(to-r, purple.500, blue.500)" color="white" fontSize="md" fontWeight="bold" _hover={{ bgGradient: "linear(to-r, purple.400, blue.400)", transform: "translateY(-1px)", boxShadow: "0 10px 20px -10px rgba(102, 126, 234, 0.6)" }} _active={{ transform: "translateY(0)" }} transition="all 0.2s" mt={2}>
                  Sign in
                </Button>

                <VStack spacing={2} width="full" mt={2}>
                  <Flex justify="center" align="center">
                    <Text fontSize="sm" color="whiteAlpha.700">Don't have an account?</Text>
                    <ChakraLink color="purple.300" ml={2} fontSize="sm" fontWeight="bold" onClick={createAccount}>
                      Create an account
                    </ChakraLink>
                  </Flex>
                  <ChakraLink color="whiteAlpha.600" fontSize="xs" fontWeight="semibold" onClick={handleForgotPassword} _hover={{ color: "white", textDecoration: "underline" }}>
                    Forgot your password?
                  </ChakraLink>
                </VStack>

                <HStack width="full" my={2}>
                  <Divider borderColor="whiteAlpha.200" />
                  <Text px={3} fontSize="xs" fontWeight="bold" color="whiteAlpha.500" whiteSpace="nowrap">OR</Text>
                  <Divider borderColor="whiteAlpha.200" />
                </HStack>

                <Box width="full" display="flex" justifyContent="center" sx={{ '.nsm7Bb-HzV7m-LgbsSe': { backgroundColor: 'rgba(255,255,255,0.05) !important', color: 'white !important', border: '1px solid rgba(255,255,255,0.2) !important', borderRadius: '8px !important' }, '.nsm7Bb-HzV7m-LgbsSe:hover': { backgroundColor: 'rgba(255,255,255,0.1) !important' } }}>
                  <GoogleLogin
                    onSuccess={async (credentialResponse) => {
                      try {
                        const response = await fetch("/auth/google", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            token: credentialResponse.credential,
                          }),
                        });

                        // Safely parse response body
                        const text = await response.text();
                        let data;
                        try {
                          data = JSON.parse(text);
                        } catch {
                          throw new Error(
                            `Server error ${response.status}: ${response.statusText}`
                          );
                        }

                        if (!response.ok) {
                          throw new Error(data?.message || `Request failed with status ${response.status}`);
                        }

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
                        });
                      }
                    }}
                    onError={() => {
                      toast({
                        title: "Error",
                        description: "Google Login Failed",
                        status: "error",
                        duration: 3000,
                      });
                    }}
                  />
                </Box>
                <Text textAlign="center" fontSize="xs" color="whiteAlpha.500" mt={4}>
                  InnoIDE_V1Rev1.1_27-02-2026 (C) Innotrat Labs
                </Text>
              </VStack>
            </Box>
          </motion.div>
        </Flex>
      </Box>

        {/* Onboarding Modal */}
        <Modal isOpen={isOpen} onClose={onClose} size={{ base: "full", md: "xl" }} isCentered>
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

    </>
  );
};

export default Home;