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
} from "@chakra-ui/react";
import { FaEye, FaEyeSlash, FaClock, FaCalendar } from "react-icons/fa";
import loginImage from "../images/image.jpg";
import Ellipse521 from "../images/Ellipse 521.svg";
import { Link as ChakraLink } from "@chakra-ui/react";

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
          minHeight="calc(100vh - 70px)"
          width="full"
          align="center"
          justifyContent="center"
          bg={useColorModeValue("linear-gradient(135deg, #667eea 0%, #764ba2 100%)", "gray.900")}
          position="relative"
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
            textAlign="center"
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
              </Box>

              <VStack
                as="form"
                onSubmit={handleLogin}
                spacing={6}
                p={10}
                flex={1}
                bg={useColorModeValue("white", "gray.800")}
                alignItems="flex-start"
                justify="center"
              >
                <Box width="full">
                  <Heading
                    as="h1"
                    size="xl"
                    bgGradient="linear(to-r, #667eea, #764ba2)"
                    bgClip="text"
                    fontWeight="extrabold"
                    mb={2}
                  >
                    Welcome Back
                  </Heading>
                  <Text fontSize="md" color={useColorModeValue("gray.600", "gray.400")} mb={4}>
                    Sign in to Innotrat Labs IDE
                  </Text>
                </Box>

                <FormControl id="mobileNumber" isRequired>
                  <FormLabel>Mobile Number</FormLabel>
                  <InputGroup>
                    <Select
                      id="countryCode"
                      value={formData.countryCode}
                      onChange={handleInputChange}
                      width="100px"
                      marginRight="2"
                      color="black"
                    >
                      <option value="+91">+91</option>
                    </Select>
                    <Input
                      type="tel"
                      placeholder="Enter your mobile number"
                      size="md"
                      pattern="[0-9]{10}"
                      maxLength="10"
                      focusBorderColor="blue.500"
                      value={formData.mobileNumber}
                      onChange={handleInputChange}
                      color="black"
                      _placeholder={{ color: "gray.400" }}
                    />
                  </InputGroup>
                </FormControl>

                <FormControl id="password" isRequired>
                  <FormLabel>Password</FormLabel>
                  <InputGroup size="md">
                    <Input
                      pr="4.5rem"
                      type={show ? "text" : "password"}
                      placeholder="Enter password"
                      value={formData.password}
                      onChange={handleInputChange}
                      color="black"
                      _placeholder={{ color: "gray.400" }}
                      fontWeight="medium"
                    />
                    <InputRightElement width="4.5rem">
                      <IconButton
                        h="1.75rem"
                        size="sm"
                        onClick={() => setShow(!show)}
                        aria-label={show ? "Hide password" : "Show password"}
                        icon={show ? <FaEyeSlash /> : <FaEye />}
                        variant="ghost"
                      />
                    </InputRightElement>
                  </InputGroup>
                </FormControl>

                <Button
                  type="submit"
                  width="full"
                  size="lg"
                  fontSize="md"
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
                  fontWeight="semibold"
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
              </VStack>
            </Flex>
          </Box>
        </Flex>
      </motion.div>
    </>
  );
};

export default Home;