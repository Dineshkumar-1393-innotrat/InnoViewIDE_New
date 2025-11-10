import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
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
  Divider,
  Link as ChakraLink,
} from '@chakra-ui/react';
import { FaEye, FaEyeSlash, FaGoogle } from 'react-icons/fa';
import loginImage from '../images/image.jpg';
import Ellipse521 from '../images/Ellipse 521.svg';
import { useAuth } from '../contexts/AuthContext';
import { signin } from '../services/authService';
import { useGoogleLogin } from '@react-oauth/google';

const Home = () => {
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    countryCode: '+91',
    mobileNumber: '',
    password: ''
  });

  const navigate = useNavigate();
  const toast = useToast();
  const { login } = useAuth();
  const bgGradient = useColorModeValue('linear(to-r, #e6f3ff, #f5f3ff)', 'linear(to-r, gray.900, gray.900)');
  const cardBg = useColorModeValue('white', 'gray.800');
  const headingColor = useColorModeValue('gray.800', 'white');
  const subheadingColor = useColorModeValue('gray.500', 'gray.300');
  const inputPlaceholderColor = useColorModeValue('gray.500', 'gray.400');

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await signin(formData);

      if (response.status === 'success') {
        // Store auth data
        localStorage.setItem('token', response.token);
        localStorage.setItem('userData', JSON.stringify(response.userData));
        sessionStorage.setItem('token', response.token);

        const identity = {
          name: response.userData?.name,
          mobileNumber: formData.mobileNumber,
          userId: response.userData?.userId
        };

        localStorage.setItem('currentUserIdentity', JSON.stringify(identity));
        sessionStorage.setItem('currentUserIdentity', JSON.stringify(identity));

        navigate('/editor', { state: { identity } });
      } else {
        throw new Error(response.message || 'Invalid credentials');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 3000
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigate('/forgotpassword');
  };

  const createAccount = () => {
    navigate('/createaccount');
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${tokenResponse.access_token}`,
            'Accept': 'application/json',
          }
        });

        const userInfo = await userInfoResponse.json();

        // First try to sign in
        const signInResponse = await fetch('https://eureka.innotrat.in/api/v1/auth/google-signin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Access-Control-Allow-Origin': '*'
          },
          body: JSON.stringify({
            email: userInfo.email,
            name: userInfo.name,
            googleId: userInfo.sub,
            picture: userInfo.picture,
            accessToken: tokenResponse.access_token
          })
        });

        if (signInResponse.ok) {
          const data = await signInResponse.json();
          handleAuthSuccess(data, userInfo);
        } else if (signInResponse.status === 404) {
          // If user not found, try to sign up
          const signUpResponse = await fetch('https://eureka.innotrat.in/api/v1/auth/google-signup', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
              email: userInfo.email,
              name: userInfo.name,
              googleId: userInfo.sub,
              picture: userInfo.picture,
              accessToken: tokenResponse.access_token
            })
          });

          if (signUpResponse.ok) {
            const data = await signUpResponse.json();
            handleAuthSuccess(data, userInfo);
          } else {
            throw new Error('Failed to create account');
          }
        } else {
          throw new Error('Authentication failed');
        }
      } catch (error) {
        console.error('Google signin error:', error);
        toast({
          title: 'Error',
          description: error.message || 'Failed to authenticate with Google',
          status: 'error',
          duration: 3000
        });
      }
    },
    onError: (error) => {
      console.error('Google OAuth error:', error);
      toast({
        title: 'Error',
        description: 'Failed to connect with Google',
        status: 'error',
        duration: 3000
      });
    },
    flow: 'implicit',
    scope: 'email profile',
    ux_mode: 'popup',
  });

  const handleAuthSuccess = (data, userInfo) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('userData', JSON.stringify(data.userData));

    const identity = {
      name: userInfo.name,
      email: userInfo.email,
      picture: userInfo.picture,
      userId: data.userData?.userId
    };

    localStorage.setItem('currentUserIdentity', JSON.stringify(identity));
    sessionStorage.setItem('currentUserIdentity', JSON.stringify(identity));

    toast({
      title: 'Success',
      description: 'Successfully signed in with Google',
      status: 'success',
      duration: 3000
    });

    navigate('/editor');
  };

  return (
    <>
      <Flex
        minH="100vh"
        align="center"
        justify="center"
        bgGradient={bgGradient}
        px={4}
        py={{ base: 12, md: 0 }}
      >
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ width: '100%', maxWidth: '1024px' }}
        >
          <Flex
            direction={{ base: 'column', lg: 'row' }}
            borderRadius="3xl"
            overflow="hidden"
            boxShadow="2xl"
            bg={cardBg}
          >
            <Box flex={{ base: 'none', lg: 1 }} display={{ base: 'none', lg: 'block' }}>
              <Image
                src={loginImage}
                alt="Login"
                objectFit="cover"
                w="100%"
                h="100%"
              />
            </Box>

            <Box flex={{ base: 1, lg: 1 }} p={{ base: 8, md: 12 }}>
              <Flex justify="center" mb={6}>
                <Image src={Ellipse521} alt="Innotrat Labs" boxSize={{ base: '56px', md: '64px' }} />
              </Flex>
              <Heading
                as="h1"
                size="lg"
                textAlign="center"
                color={headingColor}
                fontWeight="semibold"
              >
                Innotrat Labs Pvt LTD
              </Heading>
              <Text textAlign="center" mt={2} color={subheadingColor}>
                Sign in to continue to your workspace
              </Text>

              <VStack
                as="form"
                onSubmit={handleLogin}
                spacing={5}
                mt={8}
                align="stretch"
              >
                <FormControl id="mobileNumber" isRequired>
                  <FormLabel color={headingColor}>Mobile Number</FormLabel>
                  <Input
                    type="tel"
                    placeholder="Enter your mobile number"
                    size="lg"
                    value={formData.mobileNumber}
                    onChange={handleInputChange}
                    color={headingColor}
                    _placeholder={{ color: inputPlaceholderColor }}
                  />
                </FormControl>

                <FormControl id="password" isRequired>
                  <FormLabel color={headingColor}>Password</FormLabel>
                  <InputGroup size="lg">
                    <Input
                      pr="4.5rem"
                      type={show ? 'text' : 'password'}
                      placeholder="Enter password"
                      value={formData.password}
                      onChange={handleInputChange}
                      color={headingColor}
                      _placeholder={{ color: inputPlaceholderColor }}
                    />
                    <InputRightElement width="4.5rem">
                      <IconButton
                        h="2.25rem"
                        size="sm"
                        variant="ghost"
                        onClick={() => setShow(!show)}
                        aria-label={show ? 'Hide password' : 'Show password'}
                        icon={show ? <FaEyeSlash /> : <FaEye />}
                      />
                    </InputRightElement>
                  </InputGroup>
                </FormControl>

                <Button
                  type="submit"
                  size="lg"
                  bgGradient="linear(to-r, #2D9CDB, #155BC2)"
                  color="white"
                  borderRadius="full"
                  _hover={{ filter: 'brightness(1.05)', boxShadow: 'lg' }}
                  isLoading={isLoading}
                  loadingText="Signing in..."
                >
                  Sign In
                </Button>

                <Flex align="center" gap={4} color={subheadingColor}>
                  <Divider />
                  <Text fontSize="sm">OR</Text>
                  <Divider />
                </Flex>

                {/* <Button
                  leftIcon={<FaGoogle />}
                  onClick={() => handleGoogleLogin()}
                  isLoading={isLoading}
                  loadingText="Connecting..."
                  size="lg"
                  w="full"
                  colorScheme="red"
                  variant="outline"
                  mb={4}
                >
                  Continue with Google
                </Button> */}

                <Flex justify="space-between" fontSize="sm" color={subheadingColor}>
                  <ChakraLink color="blue.500" onClick={handleForgotPassword}>
                    Forgot password?
                  </ChakraLink>
                  <ChakraLink color="blue.500" onClick={createAccount}>
                    Create an account
                  </ChakraLink>
                </Flex>

                <Text fontSize="xs" textAlign="center" color="red.500" mt={2}>
                  Version: InnoIDE_V1_Rev0.6_10_11_2025, time: 07:00pm
                </Text>
              </VStack>
            </Box>
          </Flex>
        </motion.div>
      </Flex>
    </>
  );
};

export default Home;

