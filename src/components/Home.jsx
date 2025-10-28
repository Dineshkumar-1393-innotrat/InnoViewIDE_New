// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import {
//   Box,
//   Flex,
//   VStack,
//   FormControl,
//   FormLabel,
//   Input,
//   Button,
//   Image,
//   Heading,
//   Text,
//   InputGroup,
//   InputRightElement,
//   IconButton,
//   useColorModeValue,
//   Link,
//   useToast,
//   Select
// } from '@chakra-ui/react';
// import { FaEye, FaEyeSlash } from 'react-icons/fa';
// import loginImage from '../images/image.jpg';
// import Template from './Template';
// // import Ellipse521 from '../images/Ellipse 521.svg';
// import { Link as ChakraLink } from '@chakra-ui/react';

// const Home = () => {
//   const [show, setShow] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     mobileNumber: '',
//     password: '',
//     countryCode: '+91'
//   });

//   const navigate = useNavigate();
//   const toast = useToast();

//   const bgColor = useColorModeValue('gray.50', 'gray.800');
//   const boxBgColor = useColorModeValue('white', 'gray.700');

//   const handleInputChange = (e) => {
//     const { id, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [id]: value
//     }));
//   };

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);

//     try {
//       const response = await fetch('https://eureka.innotrat.in/api/v1/auth/signin', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(formData)
//       });

//       const data = await response.json();

//       if (data.status === 'success') {
//         // Store token and user data in localStorage
//         localStorage.setItem('token', data.token);
//         localStorage.setItem('userData', JSON.stringify(data.userData));

//         toast({
//           title: 'Success',
//           description: 'Signin successful',
//           status: 'success',
//           duration: 3000,
//           isClosable: true,
//         });

//         navigate('/template');
//       } else {
//         throw new Error(data.message || 'Sign in failed');
//       }
//     } catch (error) {
//       toast({
//         title: 'Error',
//         description: error.message || 'Something went wrong',
//         status: 'error',
//         duration: 3000,
//         isClosable: true,
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleForgotPassword = () => {
//     navigate('/forgotpassword');
//   };

//   const createAccount = () => {
//     navigate('/createaccount');
//   };

//   return (
//     <>
//       <Box
//         position="relative"
//         top={0}
//         left={0}
//         width="100%"
//         height="65px"
//         borderBottom="1px solid gray"
//         display="flex"
//         alignItems="center"
//         padding="0 20px"
//         zIndex={1000}
//       >
//         <Text fontWeight="bold" fontSize="lg">
//           <img src={Ellipse521} alt="Innoide" style={{ maxWidth: '35%', height: 'auto'}} />
//         </Text>
//       </Box>

//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         exit={{ opacity: 0 }}
//         transition={{ duration: 0.5 }}
//       >
//         <Flex minHeight="90vh" width="full" align="center" justifyContent="center" bg={bgColor}>
//           <Box
//             borderWidth={1}
//             px={8}
//             width="full"
//             maxWidth="1000px"
//             borderRadius="lg"
//             textAlign="center"
//             boxShadow="lg"
//           >
//             <Flex direction={{ base: "column", md: "row" }}>
//               <Box flex={1} display={{ base: "none", md: "block" }}>
//                 <Image
//                   src={loginImage}
//                   alt="Login"
//                   objectFit="cover"
//                   height="100%"
//                   width="100%"
//                   borderLeftRadius="lg"
//                 />
//               </Box>

//               <VStack as="form" onSubmit={handleLogin} spacing={8} p={8} flex={1} bg={boxBgColor} borderRightRadius="lg" alignItems="flex-start">
//                 <VStack spacing={2} align="flex-start" w="full">
//                   <Heading as="h1" size="2xl">Innotrat labs pvt LTD</Heading>
//                 </VStack>

//                 <VStack spacing={4} w="full">
//                   <FormControl id="mobileNumber" isRequired>
//                     <FormLabel>Mobile Number</FormLabel>
//                     <InputGroup>
//                       <Select
//                         id="countryCode"
//                         value={formData.countryCode}
//                         onChange={handleInputChange}
//                         width="100px"
//                         marginRight="2"
//                       >
//                         <option value="+91">+91</option>

//                         {/* Add more country codes as needed */}
//                       </Select>
//                       <Input
//                         type="tel"
//                         placeholder="Enter your mobile number"
//                         size="lg"
//                         pattern="[0-9]{10}"
//                         maxLength="10"
//                         focusBorderColor="blue.500"
//                         value={formData.mobileNumber}
//                         onChange={handleInputChange}
//                       />
//                     </InputGroup>
//                   </FormControl>

//                   <FormControl id="password" isRequired>
//                     <FormLabel>Password</FormLabel>
//                     <InputGroup size="lg">
//                       <Input
//                         pr="4.5rem"
//                         type={show ? "text" : "password"}
//                         placeholder="Enter password"
//                         value={formData.password}
//                         onChange={handleInputChange}
//                       />
//                       <InputRightElement width="4.5rem">
//                         <IconButton
//                           h="1.75rem"
//                           size="sm"
//                           onClick={() => setShow(!show)}
//                           aria-label={show ? "Hide password" : "Show password"}
//                           icon={show ? <FaEyeSlash /> : <FaEye />}
//                         />
//                       </InputRightElement>
//                     </InputGroup>
//                   </FormControl>
//                 </VStack>

//                 <Button
//                   type="submit"
//                   colorScheme="blue"
//                   width="full"
//                   size="lg"
//                   fontSize="md"
//                   isLoading={isLoading}
//                   loadingText="Signing in..."
//                 >
//                   Sign in
//                 </Button>

//                 <Flex justify="space-between" width="full" pt={4}>
//                   <ChakraLink
//                     color="blue.500"
//                     onClick={handleForgotPassword}
//                   >
//                     Forgot password?
//                   </ChakraLink>

//                   <ChakraLink
//                     color="blue.500"
//                     onClick={createAccount}
//                   >
//                     Create an account
//                   </ChakraLink>
//                 </Flex>
//               </VStack>
//             </Flex>
//           </Box>
//         </Flex>
//       </motion.div>

//       <Footer />
//     </>
//   );
// };

// export default Home;

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

const Home = () => {
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
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
      const response = await fetch('https://eureka.innotrat.in/api/v1/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.status === 'success') {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userData', JSON.stringify(data.userData));
        sessionStorage.setItem('token', data.token);
        sessionStorage.setItem('userData', JSON.stringify(data.userData));

        const identity = {
          name:
            data.userData?.name ||
            data.userData?.fullName ||
            data.userData?.username ||
            data.userData?.userName ||
            '',
          email: data.userData?.email || data.userData?.userEmail || formData.email,
          phone:
            data.userData?.mobileNumber ||
            data.userData?.phoneNumber ||
            data.userData?.phone ||
            '',
        };

        sessionStorage.setItem('currentUserIdentity', JSON.stringify(identity));
        localStorage.setItem('currentUserIdentity', JSON.stringify(identity));

        toast({
          title: 'Success',
          description: 'Signin successful',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });

        // Redirect to code editor workspace after login
        navigate('/editor', {
          state: { userId: data.userData.userId, identity },
        });
      } else {
        throw new Error(data.message || 'Sign in failed');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Something went wrong',
        status: 'error',
        duration: 3000,
        isClosable: true,
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

  const handleGoogleSignIn = async () => {
    try {
      await login({
        connection: 'google-oauth2',
        appState: { returnTo: '/editor' },
        authorizationParams: {
          prompt: 'select_account',
        },
      });
    } catch (error) {
      toast({
        title: 'Google sign-in failed',
        description: error?.message || 'Please try again later.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
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
                <FormControl id="email" isRequired>
                  <FormLabel color={headingColor}>Email</FormLabel>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    size="lg"
                    value={formData.email}
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

                <Button
                  variant="outline"
                  leftIcon={<FaGoogle />}
                  size="lg"
                  borderRadius="full"
                  onClick={handleGoogleSignIn}
                >
                  Continue with Google
                </Button>

                <Flex justify="space-between" fontSize="sm" color={subheadingColor}>
                  <ChakraLink color="blue.500" onClick={handleForgotPassword}>
                    Forgot password?
                  </ChakraLink>
                  <ChakraLink color="blue.500" onClick={createAccount}>
                    Create an account
                  </ChakraLink>
                </Flex>

                <Text fontSize="xs" textAlign="center" color="red.500" mt={2}>
                  Version: InnoIDE_V1_Rev0.5_24_09_2025, time: 06:45pm
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

// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import {
//   Box, Flex, VStack, FormControl, FormLabel, Input, Button, Image, Heading, Text,
//   InputGroup, InputRightElement, IconButton, useColorModeValue, useToast, Select
// } from '@chakra-ui/react';
// import { FaEye, FaEyeSlash } from 'react-icons/fa';
// import loginImage from '../images/image.jpg';
// import Ellipse521 from '../images/Ellipse 521.svg';
// import { Link as ChakraLink } from '@chakra-ui/react';
// import Footer from './Footer';

// const Home = () => {
//   const [show, setShow] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     mobileNumber: '',
//     password: '',
//     countryCode: '+91',
//   });

//   const navigate = useNavigate();
//   const toast = useToast();

//   const handleInputChange = (e) => {
//     const { id, value } = e.target;
//     setFormData(prev => ({ ...prev, [id]: value }));
//   };

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);

//     try {
//       const response = await fetch('https://eureka.innotrat.in/api/v1/auth/signin', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(formData),
//       });

//       const data = await response.json();

//       if (data.status === 'success') {
//         // Store in localStorage as before
//         localStorage.setItem('token', data.token);
//         localStorage.setItem('userData', JSON.stringify(data.userData));

//         // Add sessionStorage for userId
//         sessionStorage.setItem('userId', data.userData.userId);

//         toast({
//           title: 'Success',
//           description: 'Signin successful',
//           status: 'success',
//           duration: 3000,
//           isClosable: true,
//         });

//         navigate('/editor', { state: { userId: data.userData.userId } });
//       } else {
//         throw new Error(data.message || 'Sign in failed');
//       }
//     } catch (error) {
//       toast({
//         title: 'Error',
//         description: error.message || 'Something went wrong',
//         status: 'error',
//         duration: 3000,
//         isClosable: true,
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleForgotPassword = () => {
//     navigate('/forgotpassword');
//   };

//   const createAccount = () => {
//     navigate('/createaccount');
//   };

//   return (
//     <>
//       <Box position="relative" width="100%" height="65px" borderBottom="1px solid gray"
//         display="flex" alignItems="center" padding="0 20px" zIndex={1000}>
//         <Text fontWeight="bold" fontSize="lg">
//           <img src={Ellipse521} alt="Innoide" style={{ maxWidth: '35%', height: 'auto' }} />
//         </Text>
//       </Box>

//       <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
//         <Flex minHeight="90vh" width="full" align="center" justifyContent="center" bg={useColorModeValue('gray.50', 'gray.800')}>
//           <Box borderWidth={1} px={8} width="full" maxWidth="1000px" borderRadius="lg"
//             textAlign="center" boxShadow="lg">
//             <Flex direction={{ base: "column", md: "row" }}>
//               <Box flex={1} display={{ base: "none", md: "block" }}>
//                 <Image src={loginImage} alt="Login" objectFit="cover" height="100%" width="100%" borderLeftRadius="lg" />
//               </Box>

//               <VStack as="form" onSubmit={handleLogin} spacing={8} p={8} flex={1} bg={useColorModeValue('white', 'gray.700')}
//                 borderRightRadius="lg" alignItems="flex-start">
//                 <Heading as="h1" size="2xl">Innotrat Labs Pvt Ltd</Heading>

//                 <FormControl id="mobileNumber" isRequired>
//                   <FormLabel>Mobile Number</FormLabel>
//                   <InputGroup>
//                     <Select id="countryCode" value={formData.countryCode} onChange={handleInputChange} width="100px" marginRight="2">
//                       <option value="+91">+91</option>
//                     </Select>
//                     <Input type="tel" placeholder="Enter your mobile number" size="lg" pattern="[0-9]{10}" maxLength="10"
//                       focusBorderColor="blue.500" value={formData.mobileNumber} onChange={handleInputChange} />
//                   </InputGroup>
//                 </FormControl>

//                 <FormControl id="password" isRequired>
//                   <FormLabel>Password</FormLabel>
//                   <InputGroup size="lg">
//                     <Input pr="4.5rem" type={show ? "text" : "password"} placeholder="Enter password"
//                       value={formData.password} onChange={handleInputChange} />
//                     <InputRightElement width="4.5rem">
//                       <IconButton h="1.75rem" size="sm" onClick={() => setShow(!show)}
//                         aria-label={show ? "Hide password" : "Show password"} icon={show ? <FaEyeSlash /> : <FaEye />} />
//                     </InputRightElement>
//                   </InputGroup>
//                 </FormControl>

//                 <Button type="submit" colorScheme="blue" width="full" size="lg" fontSize="md" isLoading={isLoading} loadingText="Signing in...">
//                   Sign in
//                 </Button>
//                 <Flex justify="space-between" width="full" pt={4}>
//                   <ChakraLink color="blue.500" onClick={handleForgotPassword}>
//                     Forgot password?
//                   </ChakraLink>
//                   <ChakraLink color="blue.500" onClick={createAccount}>
//                     Create an account
//                   </ChakraLink>
//                 </Flex>
//               </VStack>
//             </Flex>
//           </Box>
//         </Flex>
//       </motion.div>
//       <Footer />
//     </>
//   );
// };

// export default Home;

// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";
// import {
//   Box,
//   Flex,
//   VStack,
//   FormControl,
//   FormLabel,
//   Input,
//   Button,
//   Image,
//   Heading,
//   Text,
//   InputGroup,
//   InputRightElement,
//   IconButton,
//   useColorModeValue,
//   useToast,
//   Select,
// } from "@chakra-ui/react";
// import { FaEye, FaEyeSlash } from "react-icons/fa";
// import loginImage from "../images/image.jpg";
// import Ellipse521 from "../images/Ellipse 521.svg";
// import { Link as ChakraLink } from "@chakra-ui/react";
// import Footer from "./Footer";

// const Home = () => {
//   const [show, setShow] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     mobileNumber: "",
//     password: "",
//     countryCode: "+91",
//   });

//   const navigate = useNavigate();
//   const toast = useToast();

//   const handleInputChange = (e) => {
//     const { id, value } = e.target;
//     setFormData((prev) => ({ ...prev, [id]: value }));
//   };

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);

//     try {
//       const response = await fetch(
//         "https://eureka.innotrat.in/api/v1/auth/signin",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(formData),
//         }
//       );

//       const data = await response.json();

//       if (data.status === "success") {
//         // Store token and userId in sessionStorage
//         sessionStorage.setItem("token", data.token);
//         sessionStorage.setItem("userId", data.userData.userId);

//         // Keep localStorage for backward compatibility
//         localStorage.setItem("token", data.token);
//         localStorage.setItem("userData", JSON.stringify(data.userData));

//         toast({
//           title: "Success",
//           description: "Signin successful",
//           status: "success",
//           duration: 3000,
//           isClosable: true,
//         });

//         navigate("/embedded", { state: { userId: data.userData.userId } });
//       } else {
//         throw new Error(data.message || "Sign in failed");
//       }
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: error.message || "Something went wrong",
//         status: "error",
//         duration: 3000,
//         isClosable: true,
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleForgotPassword = () => {
//     navigate("/forgotpassword");
//   };

//   const createAccount = () => {
//     navigate("/createaccount");
//   };

//   return (
//     <>
//       <Box
//         position="relative"
//         width="100%"
//         height="65px"
//         borderBottom="1px solid gray"
//         display="flex"
//         alignItems="center"
//         padding="0 20px"
//         zIndex={1000}
//       >
//         <Text fontWeight="bold" fontSize="lg">
//           <img
//             src={Ellipse521}
//             alt="Innoide"
//             style={{ maxWidth: "35%", height: "auto" }}
//           />
//         </Text>
//       </Box>

//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         exit={{ opacity: 0 }}
//         transition={{ duration: 0.5 }}
//       >
//         <Flex
//           minHeight="90vh"
//           width="full"
//           align="center"
//           justifyContent="center"
//           bg={useColorModeValue("gray.50", "gray.800")}
//         >
//           <Box
//             borderWidth={1}
//             px={8}
//             width="full"
//             maxWidth="1000px"
//             borderRadius="lg"
//             textAlign="center"
//             boxShadow="lg"
//           >
//             <Flex direction={{ base: "column", md: "row" }}>
//               <Box flex={1} display={{ base: "none", md: "block" }}>
//                 <Image
//                   src={loginImage}
//                   alt="Login"
//                   objectFit="cover"
//                   height="100%"
//                   width="100%"
//                   borderLeftRadius="lg"
//                 />
//               </Box>

//               <VStack
//                 as="form"
//                 onSubmit={handleLogin}
//                 spacing={8}
//                 p={8}
//                 flex={1}
//                 bg={useColorModeValue("white", "gray.700")}
//                 borderRightRadius="lg"
//                 alignItems="flex-start"
//               >
//                 <Heading as="h1" size="2xl">
//                   Innotrat Labs Pvt Ltd
//                 </Heading>

//                 <FormControl id="mobileNumber" isRequired>
//                   <FormLabel>Mobile Number</FormLabel>
//                   <InputGroup>
//                     <Select
//                       id="countryCode"
//                       value={formData.countryCode}
//                       onChange={handleInputChange}
//                       width="100px"
//                       marginRight="2"
//                     >
//                       <option value="+91">+91</option>
//                     </Select>
//                     <Input
//                       type="tel"
//                       placeholder="Enter your mobile number"
//                       size="md"
//                       pattern="[0-9]{10}"
//                       maxLength="10"
//                       focusBorderColor="blue.500"
//                       value={formData.mobileNumber}
//                       onChange={handleInputChange}
//                     />
//                   </InputGroup>
//                 </FormControl>

//                 <FormControl id="password" isRequired>
//                   <FormLabel>Password</FormLabel>
//                   <InputGroup size="md">
//                     <Input
//                       pr="4.5rem"
//                       type={show ? "text" : "password"}
//                       placeholder="Enter password"
//                       value={formData.password}
//                       onChange={handleInputChange}
//                     />
//                     <InputRightElement width="4.5rem">
//                       <IconButton
//                         h="1.75rem"
//                         size="sm"
//                         onClick={() => setShow(!show)}
//                         aria-label={show ? "Hide password" : "Show password"}
//                         icon={show ? <FaEyeSlash /> : <FaEye />}
//                       />
//                     </InputRightElement>
//                   </InputGroup>
//                 </FormControl>

//                 <Button
//                   type="submit"
//                   colorScheme="blue"
//                   width="full"
//                   size="lg"
//                   fontSize="md"
//                   isLoading={isLoading}
//                   loadingText="Signing in..."
//                 >
//                   Sign in
//                 </Button>
//                 <Flex justify="space-between" width="full" pt={4}>
//                   <ChakraLink color="blue.500" onClick={handleForgotPassword}>
//                     Forgot password?
//                   </ChakraLink>
//                   <ChakraLink color="blue.500" onClick={createAccount}>
//                     Create an account
//                   </ChakraLink>
//                 </Flex>
//               </VStack>
//             </Flex>
//           </Box>
//         </Flex>
//       </motion.div>
//       <Footer />
//     </>
//   );
// };

// export default Home;



// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";
// import {
//   Box,
//   Flex,
//   VStack,
//   FormControl,
//   FormLabel,
//   Input,
//   Button,
//   Image,
//   Heading,
//   Text,
//   InputGroup,
//   InputRightElement,
//   IconButton,
//   Link as ChakraLink,
//   Divider,
// } from "@chakra-ui/react";
// import { FaEye, FaEyeSlash, FaGoogle } from "react-icons/fa";
// import loginImage from "../images/image.jpg";
// import Ellipse521 from "../images/Ellipse 521.svg";
// import { useAuth } from "../contexts/AuthContext";

// const Home = () => {
//   const [show, setShow] = useState(false);
//   const [email, setEmail] = useState("");
//   const handleClick = () => setShow(!show);
//   const navigate = useNavigate();
//   const { login, loginWithEmail, isAuthenticated } = useAuth();

//   useEffect(() => {
//     if (isAuthenticated) {
//       navigate("/embedded");
//     }
//   }, [isAuthenticated, navigate]);

//   const handleLogin = (e) => {
//     e.preventDefault();
//     if (email) {
//       loginWithEmail(email);
//     }
//   };

//   return (
//     <Flex
//       minH="100vh"
//       align="center"
//       justify="center"
//       bgGradient="linear(to-r, blue.50, purple.50)"
//       px={4}
//     >
//       <motion.div
//         initial={{ opacity: 0, y: 40 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6, ease: "easeOut" }}
//         style={{ width: "100%", maxWidth: "1000px" }}
//       >
//         <Flex
//           direction={{ base: "column", md: "row" }}
//           borderRadius="2xl"
//           overflow="hidden"
//           boxShadow="2xl"
//           bg="white"
//         >
//           {/* Left Side - Image */}
//           <Box flex={1} display={{ base: "none", md: "block" }}>
//             <Image
//               src={loginImage}
//               alt="Login Illustration"
//               objectFit="cover"
//               w="100%"
//               h="100%"
//             />
//           </Box>

//           {/* Right Side - Form */}
//           <Box flex={1} p={{ base: 8, md: 12 }} color="black">
//             {/* Logo */}
//             <Flex justify="center" mb={6}>
//               <Image src={Ellipse521} alt="Innoide" boxSize="60px" />
//             </Flex>

//             <Heading
//               as="h1"
//               size="lg"
//               textAlign="center"
//               fontWeight="bold"
//               color="black"
//             >
//               Innotrat Labs Pvt LTD
//             </Heading>
//             <Text fontSize="md" textAlign="center" mt={2} color="black">
//               Sign in to continue to your workspace
//             </Text>

//             <VStack
//               as="form"
//               onSubmit={handleLogin}
//               spacing={5}
//               mt={8}
//               align="stretch"
//             >
//               <FormControl id="email">
//                 <FormLabel color="black">Email</FormLabel>
//                 <Input
//                   type="email"
//                   placeholder="Enter your email"
//                   size="lg"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   color="black"
//                   _placeholder={{ color: "black" }}
//                 />
//               </FormControl>

//               <FormControl id="password">
//                 <FormLabel color="black">Password</FormLabel>
//                 <InputGroup size="lg">
//                   <Input
//                     type={show ? "text" : "password"}
//                     placeholder="Enter password"
//                     color="black"
//                     _placeholder={{ color: "black" }}
//                   />
//                   <InputRightElement width="3rem">
//                     <IconButton
//                       size="sm"
//                       onClick={handleClick}
//                       aria-label={show ? "Hide password" : "Show password"}
//                       icon={show ? <FaEyeSlash /> : <FaEye />}
//                     />
//                   </InputRightElement>
//                 </InputGroup>
//               </FormControl>

//               <Button
//                 type="submit"
//                 colorScheme="blue"
//                 size="lg"
//                 borderRadius="full"
//                 _hover={{ transform: "translateY(-2px)", boxShadow: "lg" }}
//               >
//                 Sign In
//               </Button>
//             </VStack>

//             <Flex align="center" my={6}>
//               <Divider />
//               <Text px={2} fontSize="sm" color="black">
//                 OR
//               </Text>
//               <Divider />
//             </Flex>

//             <Button
//               leftIcon={<FaGoogle />}
//               colorScheme="red"
//               variant="solid"
//               size="lg"
//               onClick={() => login()}
//               w="full"
//               borderRadius="full"
//               _hover={{ transform: "translateY(-2px)", boxShadow: "lg" }}
//             >
//               Sign in with Google
//             </Button>

//             <Flex justify="space-between" mt={6} fontSize="sm">
//               <ChakraLink color="black" onClick={() => navigate("/forgotpassword")}>
//                 Forgot password?
//               </ChakraLink>
//               <ChakraLink color="black" onClick={() => navigate("/createaccount")}>
//                 Create an account
//               </ChakraLink>
//             </Flex>

//             <Text fontSize="xs" mt={8} textAlign="center" color="red.500">
//               Version: InnoIDE_V1_Rev0.5_24_09_2025, time: 06:45pm
//             </Text>
//           </Box>
//         </Flex>
//       </motion.div>
//     </Flex>
//   );
// };

// export default Home;

