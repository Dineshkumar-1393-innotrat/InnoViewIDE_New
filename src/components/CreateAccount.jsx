import React, { useState } from "react";
import {
  Box,
  Heading,
  Input,
  FormControl,
  FormLabel,
  Button,
  VStack,
  HStack,
  Text,
  Alert,
  AlertIcon,
  useColorModeValue,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const CreateAccount = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [alert, setAlert] = useState({ type: "", message: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { username, email, password, confirmPassword } = formData;

    if (!username || !email || !password || !confirmPassword) {
      setAlert({ type: "error", message: "All fields are required." });
      return;
    }
    if (password !== confirmPassword) {
      setAlert({ type: "error", message: "Passwords do not match." });
      return;
    }

    setAlert({ type: "success", message: "Account created successfully!" });
    setFormData({ username: "", email: "", password: "", confirmPassword: "" });
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
        Create Account
      </Heading>

      {alert.message && (
        <Alert status={alert.type} mb={4} borderRadius="md">
          <AlertIcon />
          {alert.message}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl id="username" isRequired>
            <FormLabel>Username</FormLabel>
            <Input
              type="text"
              name="username"
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleChange}
              size="sm"
            />
          </FormControl>

          <FormControl id="email" isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              size="sm"
            />
          </FormControl>

          <FormControl id="password" isRequired>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              size="sm"
            />
          </FormControl>

          <FormControl id="confirmPassword" isRequired>
            <FormLabel>Confirm Password</FormLabel>
            <Input
              type="password"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              size="sm"
            />
          </FormControl>

          <HStack spacing={4} w="100%">
            <Button type="submit" colorScheme="blue" flex="1" size="sm">
              Create Account
            </Button>
            <Button
              type="button"
              variant="outline"
              colorScheme="gray"
              flex="1"
              size="sm"
              onClick={() =>
                setFormData({ username: "", email: "", password: "", confirmPassword: "" })
              }
            >
              Cancel
            </Button>
          </HStack>
        </VStack>
      </form>

      <Text fontSize="sm" color="gray.600" mt={4} textAlign="center">
        Already have an account?{" "}
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

export default CreateAccount;
