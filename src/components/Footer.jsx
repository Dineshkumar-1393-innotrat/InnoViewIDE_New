import { Box, VStack, Text, Link as ChakraLink, Icon, Flex, useColorMode } from "@chakra-ui/react";
import { FaFacebook, FaLinkedin, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';
import { Link } from "react-router-dom"; // Import Link from react-router-dom

const Footer = () => {
  const { colorMode } = useColorMode();

  const bgColor = colorMode === "dark" ? "#0f0a19" : "gray.200";
  const textColor = colorMode === "dark" ? "gray.500" : "gray.1000";
  const borderColor = colorMode === "dark" ? "gray.600" : "gray.300";

  return (
    <Box as="footer" bg={bgColor} color={textColor} py={6} px={{ base: 4, md: 8 }}>
      <Flex 
        direction={{ base: 'column', lg: 'row' }} 
        spacing={{ base: 8, lg: 12 }} 
        justify="space-between"
        align={{ base: 'center', lg: 'start' }}
        textAlign={{ base: 'center', lg: 'left' }}
      >
        {/* Company Info */}
        <VStack align={{ base: 'center', lg: 'start' }} spacing={3} mb={{ base: 8, lg: 0 }}>
          <Text fontSize="xl" fontWeight="bold">Innotrat Labs</Text>
          <Text maxW="300px">
            At Innotrat, we blend expertise and creativity to drive technological advancements.
          </Text>
          <Flex mt={4} justify={{ base: 'center', lg: 'start' }} w="100%">
            {/* Social Media Icons */}
            <ChakraLink href="https://www.facebook.com/InnotratLabs/" aria-label="Facebook" isExternal mx={2}>
              <Icon as={FaFacebook} boxSize={6} />
            </ChakraLink>
            <ChakraLink href="https://x.com/i/flow/login?redirect_after_login=%2FInnotrat_Labs" aria-label="Twitter" isExternal mx={2}>
              <Icon as={FaTwitter} boxSize={6} />
            </ChakraLink>
            <ChakraLink href="https://www.linkedin.com/company/innotrat-labs/" aria-label="LinkedIn" isExternal mx={2}>
              <Icon as={FaLinkedin} boxSize={6} />
            </ChakraLink>
            <ChakraLink href="https://www.instagram.com/innotrat.labs/" aria-label="Instagram" isExternal mx={2}>
              <Icon as={FaInstagram} boxSize={6} />
            </ChakraLink>
            <ChakraLink href="https://www.youtube.com/@innotratlabs" aria-label="YouTube" isExternal mx={2}>
              <Icon as={FaYoutube} boxSize={6} />
            </ChakraLink>
          </Flex>
        </VStack>

        {/* Links Grid */}
        <Flex direction={{ base: 'column', md: 'row' }} gap={{ base: 8, lg: 16 }} >
          {/* Quick Links */}
          <VStack align={{ base: 'center', lg: 'start' }} spacing={2}>
            <Text fontSize="lg" fontWeight="bold">Quick Links</Text>
            <ChakraLink as={Link} to="/">Home</ChakraLink> 
            <ChakraLink as={Link} to="/feedback">Feedback</ChakraLink>
          </VStack>

          {/* Information */}
          <VStack align={{ base: 'center', lg: 'start' }} spacing={2}>
            <Text fontSize="lg" fontWeight="bold">Information</Text>
            <Text>Contact</Text>
            <Text>Email: contact@innotrat.in</Text>
            <Text>Phone: +91 9777013904</Text>
            <Text>Sales: sales@innotrat.in</Text>
            <Text>Phone: +91 8970035093</Text>
          </VStack>

          {/* Location */}
          <VStack align={{ base: 'center', lg: 'start' }} spacing={2}>
            <Text fontSize="lg" fontWeight="bold">Our Location</Text>
            <Text>Innotrat Labs, Chennai</Text>
            <Text>New No.7, Old No.147, Anna Salai, Little Mount, Saidapet</Text>
            <Text>Chennai, Tamil Nadu 600015</Text>
            <Text>Odisha Location:</Text>
            <Text>INNOVEX, CIPET Incubation, Patia, Bhubaneswar</Text>
            <Text>Odisha 751024</Text>
          </VStack>
        </Flex>
      </Flex>

      {/* Footer Bottom Links */}
      <Flex 
        direction={{ base: 'column', md: 'row' }} 
        justify="space-between" 
        align="center"
        mt={8} 
        pt={4} 
        borderTop="1px solid" 
        borderColor={borderColor}
      >
        <Text fontSize="md" mb={{ base: 4, md: 0 }}>Copyright  2024 All rights reserved InnoIDE_V1Rev0_18Jan2025</Text>
        <Flex spacing={6}>
          <ChakraLink as={Link} to="/feedback">Feedback</ChakraLink> {/* Link to feedback page */}
        </Flex>
      </Flex>
    </Box>
  );
};

export default Footer;
