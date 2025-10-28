// import React, { useState } from "react";
// import {
//   Box,
//   Heading,
//   Input,
//   FormControl,
//   FormLabel,
//   Button,
//   VStack,
//   Text,
//   Alert,
//   AlertIcon,
//   useColorModeValue,
// } from "@chakra-ui/react";
// import { useNavigate } from "react-router-dom";

// const ForgotPassword = () => {
//   const [email, setEmail] = useState("");
//   const [alert, setAlert] = useState({ type: "", message: "" });
//   const navigate = useNavigate();

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if (!email) {
//       setAlert({ type: "error", message: "Please enter your email address." });
//       return;
//     }

//     setAlert({
//       type: "success",
//       message: "Password reset instructions have been sent to your email.",
//     });
//     setEmail("");
//   };

//   return (
//     <Box
//       bg={useColorModeValue("gray.50", "gray.800")}
//       p={6}
//       maxW="400px"
//       borderRadius="lg"
//       shadow="md"
//       mx="auto"
//       mt={10}
//     >
//       <Heading as="h2" size="lg" mb={4} textAlign="center">
//         Forgot Password
//       </Heading>

//       {alert.message && (
//         <Alert status={alert.type} mb={4} borderRadius="md">
//           <AlertIcon />
//           {alert.message}
//         </Alert>
//       )}

//       <form onSubmit={handleSubmit}>
//         <VStack spacing={4}>
//           <FormControl id="email" isRequired>
//             <FormLabel>Email Address</FormLabel>
//             <Input
//               type="email"
//               name="email"
//               placeholder="Enter your email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               size="sm"
//             />
//           </FormControl>

//           <Button type="submit" colorScheme="blue" size="sm" w="100%">
//             Reset Password
//           </Button>
//         </VStack>
//       </form>

//       <Text fontSize="sm" color="gray.600" mt={4} textAlign="center">
//         Remember your password?{" "}
//         <Text
//           as="span"
//           color="blue.500"
//           cursor="pointer"
//           onClick={() => navigate("/")}
//         >
//           Log In
//         </Text>
//       </Text>
//     </Box>
//   );
// };

// export default ForgotPassword;
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
  InputGroup,
  InputLeftAddon,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [mobileNumber, setMobileNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "" });
  const navigate = useNavigate();

  const validateMobileNumber = (number) => {
    const mobileRegex = /^[0-9]{10}$/;
    return mobileRegex.test(number);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear any existing alerts
    setAlert({ type: "", message: "" });

    // Validate mobile number
    if (!mobileNumber) {
      setAlert({ type: "error", message: "Please enter your mobile number." });
      return;
    }

    if (!validateMobileNumber(mobileNumber)) {
      setAlert({ type: "error", message: "Please enter a valid 10-digit mobile number." });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('inno/auth/reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mobileNumber,
        }),
      });

      if (!response.ok) {
        throw new Error('Reset request failed');
      }

      const data = await response.json();
      
      setAlert({
        type: "success",
        message: "Password reset instructions have been sent to your mobile number.",
      });
      setMobileNumber("");
    } catch (error) {
      setAlert({
        type: "error",
        message: "Failed to process your request. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
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
          <FormControl id="mobileNumber" isRequired>
            <FormLabel>Mobile Number</FormLabel>
            <InputGroup size="sm">
              <InputLeftAddon children="+91" />
              <Input
                type="tel"
                placeholder="Enter your mobile number"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                maxLength={10}
              />
            </InputGroup>
          </FormControl>

          <Button 
            type="submit" 
            colorScheme="blue" 
            size="sm" 
            w="100%"
            isLoading={isLoading}
            loadingText="Sending"
          >
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