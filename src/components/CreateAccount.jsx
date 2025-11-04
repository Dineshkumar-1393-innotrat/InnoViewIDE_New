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
  IconButton
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import { signup } from '../services/authService';

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

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

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

    try {
      if (formData.password !== formData.confirmPassword) {
        throw new Error('Passwords do not match');
      }

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
    <Container maxW="container.sm" py={10}>
      <Box
        bg={bgColor}
        p={8}
        borderRadius="xl"
        boxShadow="lg"
        border="1px"
        borderColor={borderColor}
      >
        <Heading as="h2" size="lg" mb={6} textAlign="center">
          Create Account
        </Heading>

        <form onSubmit={handleSubmit}>
          <VStack spacing={5}>
            <FormControl isInvalid={!!errors.name} isRequired>
              <FormLabel>Name</FormLabel>
              <Input
                type="text"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                autoComplete="name"
                size="lg"
              />
              <FormErrorMessage>{errors.name}</FormErrorMessage>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Country Code</FormLabel>
              <Input
                type="text"
                name="countryCode"
                value={formData.countryCode}
                isReadOnly
                size="lg"
              />
            </FormControl>

            <FormControl isInvalid={!!errors.mobileNumber} isRequired>
              <FormLabel>Mobile Number</FormLabel>
              <Input
                type="tel"
                name="mobileNumber"
                placeholder="Enter your mobile number"
                value={formData.mobileNumber}
                onChange={handleChange}
                autoComplete="tel"
                size="lg"
              />
              <FormErrorMessage>{errors.mobileNumber}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.password} isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  size="lg"
                />
                <InputRightElement h="full">
                  <IconButton
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                    onClick={() => setShowPassword(!showPassword)}
                    variant="ghost"
                  />
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage>{errors.password}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.confirmPassword} isRequired>
              <FormLabel>Confirm Password</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  autoComplete="new-password"
                  size="lg"
                />
                <InputRightElement h="full">
                  <IconButton
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                    onClick={() => setShowPassword(!showPassword)}
                    variant="ghost"
                  />
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage>{errors.confirmPassword}</FormErrorMessage>
            </FormControl>

            <HStack spacing={4} w="100%" pt={4}>
              <Button 
                type="submit" 
                colorScheme="blue" 
                size="lg" 
                flex="1" 
                isLoading={loading}
                loadingText="Creating Account"
              >
                Create Account
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                size="lg" 
                onClick={resetForm} 
                flex="1"
              >
                Reset
              </Button>
            </HStack>
          </VStack>
        </form>
      </Box>
    </Container>
  );
};

export default CreateAccount;