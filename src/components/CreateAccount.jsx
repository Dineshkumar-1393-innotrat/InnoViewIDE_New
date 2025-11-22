import React, { useState, useCallback } from 'react';
import {
  Box,
  Heading,
  Input,
  FormControl,
  FormLabel,
  Button,
  VStack,
  HStack,
  FormErrorMessage,
  useToast,
  useColorModeValue,
  Container,
  InputGroup,
  InputRightElement,
  IconButton,
  Text,
  Flex,
  Link as ChakraLink
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import { signup } from '../services/authService';
import { motion } from 'framer-motion';

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,20}$/;

const CreateAccount = () => {
  const [formData, setFormData] = useState({
    name: '',
    countryCode: '+91',
    mobileNumber: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const toast = useToast();

  const validateForm = useCallback(() => {
    const newErrors = {};

    if (!USERNAME_REGEX.test(formData.name)) {
      newErrors.name = 'Name must be 3-20 characters and can only contain letters, numbers, and underscores';
    }

    if (!/^\d{10}$/.test(formData.mobileNumber)) {
      newErrors.mobileNumber = 'Mobile number must be 10 digits';
    }

    if (!PASSWORD_REGEX.test(formData.password)) {
      newErrors.password =
        'Password must be at least 8 characters and contain uppercase, lowercase, number, and special character';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!validateForm()) return;

    try {
      const response = await signup(formData);

      if (response.status === 'success') {
        toast({
          title: 'Account created successfully',
          status: 'success',
          duration: 3000
        });
        navigate('/');
      } else {
        throw new Error(response.message || 'Failed to create account');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 3000
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      countryCode: '+91',
      mobileNumber: '',
      password: '',
      confirmPassword: ''
    });
    setErrors({});
  };

  return (
    <Flex
      minHeight="100vh"
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ width: '100%', maxWidth: '500px', zIndex: 1 }}
      >
        <Box
          bg={useColorModeValue('white', 'gray.800')}
          p={8}
          borderRadius="2xl"
          boxShadow="2xl"
          mx={4}
        >
          <VStack spacing={2} mb={8}>
            <Heading
              as="h2"
              size="xl"
              textAlign="center"
              bgGradient="linear(to-r, #667eea, #764ba2)"
              bgClip="text"
              fontWeight="extrabold"
            >
              Create Account
            </Heading>
            <Text color="gray.500" fontSize="md">
              Join Innotrat Labs IDE today
            </Text>
          </VStack>

          <form onSubmit={handleSubmit}>
            <VStack spacing={5}>
              <FormControl isInvalid={!!errors.name} isRequired>
                <FormLabel fontWeight="medium">Full Name</FormLabel>
                <Input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  autoComplete="name"
                  size="lg"
                  borderRadius="lg"
                  color="black"
                  _placeholder={{ color: 'gray.400' }}
                  focusBorderColor="purple.500"
                />
                <FormErrorMessage>{errors.name}</FormErrorMessage>
              </FormControl>

              <HStack spacing={4} width="full">
                <FormControl isRequired width="30%">
                  <FormLabel fontWeight="medium">Code</FormLabel>
                  <Input
                    type="text"
                    name="countryCode"
                    value={formData.countryCode}
                    isReadOnly
                    size="lg"
                    borderRadius="lg"
                    color="black"
                    bg="gray.50"
                  />
                </FormControl>

                <FormControl isInvalid={!!errors.mobileNumber} isRequired width="70%">
                  <FormLabel fontWeight="medium">Mobile Number</FormLabel>
                  <Input
                    type="tel"
                    name="mobileNumber"
                    placeholder="10-digit number"
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    autoComplete="tel"
                    size="lg"
                    borderRadius="lg"
                    color="black"
                    _placeholder={{ color: 'gray.400' }}
                    focusBorderColor="purple.500"
                  />
                  <FormErrorMessage>{errors.mobileNumber}</FormErrorMessage>
                </FormControl>
              </HStack>

              <FormControl isInvalid={!!errors.password} isRequired>
                <FormLabel fontWeight="medium">Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                    size="lg"
                    borderRadius="lg"
                    color="black"
                    _placeholder={{ color: 'gray.400' }}
                    focusBorderColor="purple.500"
                  />
                  <InputRightElement h="full">
                    <IconButton
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                      onClick={() => setShowPassword(!showPassword)}
                      variant="ghost"
                      color="gray.500"
                      _hover={{ bg: 'transparent', color: 'purple.500' }}
                    />
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage>{errors.password}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.confirmPassword} isRequired>
                <FormLabel fontWeight="medium">Confirm Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    placeholder="Re-enter your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    autoComplete="new-password"
                    size="lg"
                    borderRadius="lg"
                    color="black"
                    _placeholder={{ color: 'gray.400' }}
                    focusBorderColor="purple.500"
                  />
                  <InputRightElement h="full">
                    <IconButton
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                      onClick={() => setShowPassword(!showPassword)}
                      variant="ghost"
                      color="gray.500"
                      _hover={{ bg: 'transparent', color: 'purple.500' }}
                    />
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage>{errors.confirmPassword}</FormErrorMessage>
              </FormControl>

              <VStack spacing={4} w="100%" pt={4}>
                <Button
                  type="submit"
                  width="full"
                  size="lg"
                  fontSize="md"
                  isLoading={loading}
                  loadingText="Creating Account..."
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
                  borderRadius="lg"
                  fontWeight="bold"
                >
                  Create Account
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  size="md"
                  onClick={resetForm}
                  width="full"
                  color="gray.500"
                  fontWeight="medium"
                  _hover={{ color: "gray.700", bg: "gray.100" }}
                >
                  Reset Form
                </Button>

                <HStack pt={2}>
                  <Text fontSize="sm" color="gray.500">Already have an account?</Text>
                  <ChakraLink
                    color="purple.600"
                    fontWeight="semibold"
                    onClick={() => navigate('/')}
                    _hover={{ textDecoration: 'none', color: 'purple.700' }}
                  >
                    Sign In
                  </ChakraLink>
                </HStack>
              </VStack>
            </VStack>
          </form>
        </Box>
      </motion.div>
    </Flex>
  );
};

export default CreateAccount;