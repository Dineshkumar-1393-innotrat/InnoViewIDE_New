import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Box,
  Flex,
  VStack,
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
} from "@chakra-ui/react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import loginImage from "../images/image.jpg";
import Ellipse521 from "../images/Ellipse 521.svg";
import { Link as ChakraLink } from "@chakra-ui/react";
import Footer from "./Footer";

const Home = () => {
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    mobileNumber: "",
    password: "",
    countryCode: "+91",
  });

  const navigate = useNavigate();
  const toast = useToast();

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
        // Store token and userId in sessionStorage
        sessionStorage.setItem("token", data.token);
        sessionStorage.setItem("userId", data.userData.userId);

        // Keep localStorage for backward compatibility
        localStorage.setItem("token", data.token);
        localStorage.setItem("userData", JSON.stringify(data.userData));

        toast({
          title: "Success",
          description: "Signin successful",
          status: "success",
          duration: 3000,
          isClosable: true,
        });

        navigate("/embedded", { state: { userId: data.userData.userId } });
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
        height="65px"
        borderBottom="1px solid gray"
        display="flex"
        alignItems="center"
        padding="0 20px"
        zIndex={1000}
      >
        <Text fontWeight="bold" fontSize="lg">
          <img
            src={Ellipse521}
            alt="Innoide"
            style={{ maxWidth: "35%", height: "auto" }}
          />
        </Text>
      </Box>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Flex
          minHeight="90vh"
          width="full"
          align="center"
          justifyContent="center"
          bg={useColorModeValue("gray.50", "gray.800")}
        >
          <Box
            borderWidth={1}
            px={8}
            width="full"
            maxWidth="1000px"
            borderRadius="lg"
            textAlign="center"
            boxShadow="lg"
          >
            <Flex direction={{ base: "column", md: "row" }}>
              <Box flex={1} display={{ base: "none", md: "block" }}>
                <Image
                  src={loginImage}
                  alt="Login"
                  objectFit="cover"
                  height="100%"
                  width="100%"
                  borderLeftRadius="lg"
                />
              </Box>

              <VStack
                as="form"
                onSubmit={handleLogin}
                spacing={8}
                p={8}
                flex={1}
                bg={useColorModeValue("white", "gray.700")}
                borderRightRadius="lg"
                alignItems="flex-start"
              >
                <Heading as="h1" size="2xl">
                  Innotrat Labs Pvt Ltd
                </Heading>

                <FormControl id="mobileNumber" isRequired>
                  <FormLabel>Mobile Number</FormLabel>
                  <InputGroup>
                    <Select
                      id="countryCode"
                      value={formData.countryCode}
                      onChange={handleInputChange}
                      width="100px"
                      marginRight="2"
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
                    />
                    <InputRightElement width="4.5rem">
                      <IconButton
                        h="1.75rem"
                        size="sm"
                        onClick={() => setShow(!show)}
                        aria-label={show ? "Hide password" : "Show password"}
                        icon={show ? <FaEyeSlash /> : <FaEye />}
                      />
                    </InputRightElement>
                  </InputGroup>
                </FormControl>

                <Button
                  type="submit"
                  colorScheme="blue"
                  width="full"
                  size="lg"
                  fontSize="md"
                  isLoading={isLoading}
                  loadingText="Signing in..."
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
      <Footer />
    </>
  );
};

export default Home;