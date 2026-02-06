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
  InputRightElement,
  IconButton,
  HStack,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: Forgot Password, 2: Reset Password
  const [mobileNumber, setMobileNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "" });
  const navigate = useNavigate();

  const validateMobileNumber = (number) => {
    const mobileRegex = /^[0-9]{10}$/;
    return mobileRegex.test(number);
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setAlert({ type: "", message: "" });

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
      const response = await fetch('https://eureka.innotrat.in/api/v1/auth/forgotPassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mobileNumber,
        }),
      });

      const data = await response.json();

      if (data.status === "success") {
        setAlert({
          type: "success",
          message: data.message || "OTP sent successfully.",
        });
        setStep(2);
      } else {
        throw new Error(data.message || 'Forgot password request failed');
      }
    } catch (error) {
      setAlert({
        type: "error",
        message: error.message || "Failed to process your request. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setAlert({ type: "", message: "" });

    if (!otp || !newPassword || !confirmPassword) {
      setAlert({ type: "error", message: "All fields are required." });
      return;
    }

    if (newPassword !== confirmPassword) {
      setAlert({ type: "error", message: "Passwords do not match." });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('https://eureka.innotrat.in/api/v1/auth/resetPassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mobileNumber,
          otp,
          newPassword,
        }),
      });

      const data = await response.json();

      if (data.status === "success") {
        setAlert({
          type: "success",
          message: data.message || "Password reset successful.",
        });
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        throw new Error(data.message || 'Password reset failed');
      }
    } catch (error) {
      setAlert({
        type: "error",
        message: error.message || "Failed to reset password. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      minHeight="100vh"
      width="full"
      align="center"
      justifyContent="center"
      display="flex"
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
        bg={useColorModeValue("white", "gray.800")}
        p={8}
        maxW="450px"
        width="full"
        borderRadius="2xl"
        shadow="2xl"
        mx={4}
        position="relative"
        zIndex={1}
      >
        <VStack spacing={2} mb={8}>
          <Heading
            as="h2"
            size="xl"
            bgGradient="linear(to-r, #667eea, #764ba2)"
            bgClip="text"
            fontWeight="extrabold"
            textAlign="center"
          >
            {step === 1 ? "Forgot Password" : "Reset Password"}
          </Heading>
          <Text color="gray.500" fontSize="md">
            {step === 1
              ? "Enter your mobile number to receive an OTP"
              : "Enter the OTP sent to your phone and choose a new password"}
          </Text>
        </VStack>

        {alert.message && (
          <Alert status={alert.type} mb={6} borderRadius="lg">
            <AlertIcon />
            {alert.message}
          </Alert>
        )}

        {step === 1 ? (
          <form onSubmit={handleForgotSubmit} style={{ width: '100%' }}>
            <VStack spacing={5}>
              <FormControl id="mobileNumber" isRequired>
                <FormLabel fontWeight="medium">Mobile Number</FormLabel>
                <InputGroup size="lg">
                  <InputLeftAddon children="+91" borderRadius="lg" bg="gray.50" />
                  <Input
                    type="tel"
                    placeholder="10-digit number"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                    maxLength={10}
                    borderRadius="lg"
                    color="black"
                    bg="gray.50"
                    _placeholder={{ color: 'gray.400' }}
                    focusBorderColor="purple.500"
                  />
                </InputGroup>
              </FormControl>

              <Button
                type="submit"
                width="full"
                size="lg"
                isLoading={isLoading}
                loadingText="Sending OTP..."
                bgGradient="linear(to-r, #667eea, #764ba2)"
                color="white"
                _hover={{
                  bgGradient: "linear(to-r, #764ba2, #667eea)",
                  transform: "translateY(-2px)",
                  boxShadow: "xl",
                }}
                _active={{ transform: "translateY(0)" }}
                transition="all 0.2s"
                fontWeight="bold"
                borderRadius="lg"
              >
                Send OTP
              </Button>
            </VStack>
          </form>
        ) : (
          <form onSubmit={handleResetSubmit} style={{ width: '100%' }}>
            <VStack spacing={5}>
              <FormControl id="otp" isRequired>
                <FormLabel fontWeight="medium">OTP</FormLabel>
                <Input
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  size="lg"
                  borderRadius="lg"
                  color="black"
                  bg="gray.50"
                  _placeholder={{ color: 'gray.400' }}
                  focusBorderColor="purple.500"
                />
              </FormControl>

              <FormControl id="newPassword" isRequired>
                <FormLabel fontWeight="medium">New Password</FormLabel>
                <InputGroup size="lg">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    borderRadius="lg"
                    color="black"
                    bg="gray.50"
                    _placeholder={{ color: 'gray.400' }}
                    focusBorderColor="purple.500"
                  />
                  <InputRightElement h="full">
                    <IconButton
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      icon={showPassword ? <FaEyeSlash /> : <FaEye />}
                      onClick={() => setShowPassword(!showPassword)}
                      variant="ghost"
                      color="gray.500"
                      _hover={{ bg: 'transparent', color: 'purple.500' }}
                    />
                  </InputRightElement>
                </InputGroup>
              </FormControl>

              <FormControl id="confirmPassword" isRequired>
                <FormLabel fontWeight="medium">Confirm Password</FormLabel>
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  size="lg"
                  borderRadius="lg"
                  color="black"
                  bg="gray.50"
                  _placeholder={{ color: 'gray.400' }}
                  focusBorderColor="purple.500"
                />
              </FormControl>

              <Button
                type="submit"
                width="full"
                size="lg"
                isLoading={isLoading}
                loadingText="Resetting..."
                bgGradient="linear(to-r, #667eea, #764ba2)"
                color="white"
                _hover={{
                  bgGradient: "linear(to-r, #764ba2, #667eea)",
                  transform: "translateY(-2px)",
                  boxShadow: "xl",
                }}
                _active={{ transform: "translateY(0)" }}
                transition="all 0.2s"
                fontWeight="bold"
                borderRadius="lg"
              >
                Reset Password
              </Button>

              <Button
                variant="ghost"
                onClick={() => setStep(1)}
                color="gray.500"
                size="sm"
              >
                Back to Mobile Number
              </Button>
            </VStack>
          </form>
        )}

        <HStack pt={8} justify="center">
          <Text fontSize="sm" color="gray.500">Remember your password?</Text>
          <Text
            as="span"
            color="purple.600"
            fontWeight="semibold"
            cursor="pointer"
            onClick={() => navigate("/")}
            _hover={{ color: "purple.700", textDecoration: "underline" }}
          >
            Log In
          </Text>
        </HStack>
      </Box>
    </Box>
  );
};

export default ForgotPassword;