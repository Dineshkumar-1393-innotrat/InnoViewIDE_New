import React from 'react';
import { Box, Button, Flex, Text, VStack, Divider, Input, Icon, Grid } from "@chakra-ui/react";
import { FaFolder } from 'react-icons/fa'; 
import { MdSearch } from 'react-icons/md'; 
import { GiNotebook } from 'react-icons/gi'; 
import { useNavigate } from 'react-router-dom';
// import Footer from './Footer';
import Ellipse521 from '../images/Ellipse 521.svg';
import Vector522 from '../images/Vector 522.svg';
import bg from '../images/bg.jpg';



const Template = () => {
  const navigate = useNavigate();

  const handleCreateDiagram = () => {
    navigate('/flowchart');
  };

  const handleCreateCode = () => {
    navigate('/editor');
  };

  const handleOpenDocument = (docId) => {
    console.log(`Opening document ${docId}`);
    navigate('/editor');
  };

  return (
    <Box bg="gray.900" color="white" minH="100vh">
      {/* Header */}
      <Flex as="header" align="center" justify="space-between" p={4} borderBottom="1px solid" borderColor="gray.700">
        <img src={Ellipse521} alt="Innoide Logo" style={{ height: '40px' }} />
      </Flex>

      <Box as="main" p={{ base: 4, md: 8 }}>
        {/* Hero Section */}
        <VStack spacing={8} textAlign="center" mb={16}>
          <Text fontSize={{ base: '3xl', md: '5xl' }} fontWeight="bold">
            A Platform Built For A New Way of Working In
          </Text>
          <Text
            bgGradient="linear(to-r, #AA2CCB, #6306D7)"
            bgClip="text"
            fontSize={{ base: '2xl', md: '4xl' }}
            fontWeight="bold"
          >
            Embedded World
          </Text>
          <Text fontSize={{ base: 'lg', md: '2xl' }} maxW="3xl" mx="auto">
            Hi, what would you like to create with Innoide?
          </Text>
          <Flex direction={{ base: 'column', sm: 'row' }} gap={4}>
            <Button
              onClick={handleCreateDiagram}
              size="lg"
              px={8}
              bgGradient="linear(to-r, #AA2CCB, #6306D7)"
              color="white"
              _hover={{ bgGradient: 'linear(to-r, #6306D7, #AA2CCB)' }}
            >
              Create Diagram
            </Button>
            <Button
              onClick={handleCreateCode}
              size="lg"
              px={8}
              variant="outline"
              borderColor="#AA2CCB"
              _hover={{ bg: '#AA2CCB', color: 'white' }}
            >
              Create Code
            </Button>
          </Flex>
        </VStack>

        {/* Documents Section */}
        <VStack spacing={8} align="stretch">
          <Text fontSize="2xl" fontWeight="bold">Your Documents</Text>
          <Divider borderColor="gray.600" />
          <Grid
            templateColumns={{ base: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(4, 1fr)', lg: 'repeat(5, 1fr)' }}
            gap={6}
          >
            {[...Array(5)].map((_, index) => (
              <VStack
                key={index}
                as="button"
                onClick={() => handleOpenDocument(index + 1)}
                spacing={4}
                p={4}
                bg="gray.800"
                borderRadius="lg"
                _hover={{ bg: 'gray.700', transform: 'translateY(-4px)' }}
                transition="all 0.2s"
              >
                <Icon as={FaFolder} w={{ base: 16, md: 24 }} h={{ base: 16, md: 24 }} color="teal.300" />
                <Text fontSize="sm">{`Project ${index + 1}`}</Text>
              </VStack>
            ))}
          </Grid>
        </VStack>
      </Box>

      {/* <Footer /> */}
    </Box>
  );
};

export default Template;