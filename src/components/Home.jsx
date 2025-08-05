import React from 'react';
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
  Link
} from '@chakra-ui/react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import loginImage from '../images/image.jpg'; 
import Template from './Template';
import Footer from './Footer';
import Ellipse521 from '../images/Ellipse 521.svg';
import { Link as ChakraLink } from '@chakra-ui/react';


const Home = () => {
  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);
  const navigate = useNavigate();

  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const boxBgColor = useColorModeValue('white', 'gray.700');

  const handleLogin = (e) => {
    e.preventDefault();
    navigate('/template');
  };


  const handleForgotPassword = () => {
    navigate('/forgotpassword');
  };

  const createAccount = () => {
    navigate('/createaccount');
  };

  return (
    <>

{/* Here is the code for first Navbar  */}
<Box
        position="relative"
        top={0}
        left={0}
        width="100%"
        height="65px"
        // bg={bgColor}
        // color={textColor}
        borderBottom="1px solid gray"
        display="flex"
        alignItems="center"
        padding="0 20px"
        zIndex={1000}
      >
        <Text fontWeight="bold" fontSize="lg">
          {/* INNOIDE */}
          <img src={ Ellipse521} alt="Innoide" style={{ maxWidth: '35%', height: 'auto'}} />
        </Text>
      </Box>
    {/* Ends here  */}

    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Flex minHeight="90vh" width="full" align="center" justifyContent="center" bg={bgColor}>
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
            {/* Left Side - Image */}
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
            
            {/* Right Side - Form */}
            <VStack as="form" onSubmit={handleLogin} spacing={8} p={8} flex={1} bg={boxBgColor} borderRightRadius="lg" alignItems="flex-start">
              <VStack spacing={2} align="flex-start" w="full">
                <Heading as="h1" size="2xl">Innotrat labs pvt LTD</Heading>
                {/* <Text>We're so excited to see you again!</Text> */}
              </VStack>
              
              <VStack spacing={4} w="full">
                <FormControl id="email">
                  <FormLabel>Email</FormLabel>
                  <Input type="email" placeholder="Enter your email" size="lg" />
                </FormControl>
                
                <FormControl id="password">
                  <FormLabel>Password</FormLabel>
                  <InputGroup size="lg">
                    <Input
                      pr="4.5rem"
                      type={show ? "text" : "password"}
                      placeholder="Enter password"
                    />
                    <InputRightElement width="4.5rem">
                      <IconButton
                        h="1.75rem"
                        size="sm"
                        onClick={handleClick}
                        aria-label={show ? "Hide password" : "Show password"}
                        icon={show ? <FaEyeSlash /> : <FaEye />}
                      />
                    </InputRightElement>
                  </InputGroup>
                </FormControl>
              </VStack>

              <Button type="submit" colorScheme="blue" width="full" size="lg" fontSize="md">
                Sign in
              </Button>

              <Flex justify="space-between" width="full" pt={4}>
              <ChakraLink 
      color="blue.500" 
      onClick={handleForgotPassword}
    >
      Forgot password?
    </ChakraLink>


    <ChakraLink 
      color="blue.500" 
      onClick={createAccount}
    >
      Create an account 
    </ChakraLink>



              </Flex>
            </VStack>
          </Flex>
        </Box>
      </Flex>
    </motion.div>

    {/* Here i have exported the footer  */}
    <Footer  />
    </>
  );
};

export default Home;