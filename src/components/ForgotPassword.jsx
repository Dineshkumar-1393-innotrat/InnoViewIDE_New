import React, { useState } from "react";
import {
  Box,
  Heading,
  Input,
  FormControl,
  FormLabel,
  Button,
  VStack,
  Text,
  Alert,
  AlertIcon,
  useColorModeValue,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [alert, setAlert] = useState({ type: "", message: "" });
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email) {
      setAlert({ type: "error", message: "Please enter your email address." });
      return;
    }

    setAlert({
      type: "success",
      message: "Password reset instructions have been sent to your email.",
    });
    setEmail("");
  };

  return (
    <Box
      bg={useColorModeValue("gray.50", "gray.800")}
      p={6}
      maxW="400px"
      borderRadius="lg"
      shadow="md"
      mx="auto"
      mt={10}
    >
      <Heading as="h2" size="lg" mb={4} textAlign="center">
        Forgot Password
      </Heading>

      {alert.message && (
        <Alert status={alert.type} mb={4} borderRadius="md">
          <AlertIcon />
          {alert.message}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl id="email" isRequired>
            <FormLabel>Email Address</FormLabel>
            <Input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              size="sm"
            />
          </FormControl>

          <Button type="submit" colorScheme="blue" size="sm" w="100%">
            Reset Password
          </Button>
        </VStack>
      </form>

      <Text fontSize="sm" color="gray.600" mt={4} textAlign="center">
        Remember your password?{" "}
        <Text
          as="span"
          color="blue.500"
          cursor="pointer"
          onClick={() => navigate("/")}
        >
          Log In
        </Text>
      </Text>
    </Box>
  );
};

export default ForgotPassword;
