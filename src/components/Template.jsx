import React from 'react';
import { Box, Button, Flex, Text, VStack, Divider, Input, Icon, Grid } from "@chakra-ui/react";
import { FaFolder } from 'react-icons/fa'; 
import { MdSearch } from 'react-icons/md'; 
import { GiNotebook } from 'react-icons/gi'; 
import { useNavigate } from 'react-router-dom';
import Footer from './Footer';
import Ellipse521 from '../images/Ellipse 521.svg';
import Vector522 from '../images/Vector 522.svg';
import bg from '../images/bg.jpg';



const Template = () => {
  const navigate = useNavigate();

  const handleCreateDiagram = () => {
    navigate('/blockdiagram');
  };

  const handleCreateCode = () => {
    navigate('/editor');
  };

  const handleCreateBlock = () => {
    navigate('/blockdiagram');
  };

  return (
    <>

    {/* Here is the code for first Navbar  */}
    <Box
        position="relative"
        top={0}
        left={ 0}
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

 
    <Box  p={4} 
  maxW="100%" 
  mx="0" 
  textAlign="center" 
  // bgImage={`url(${bg})`}
  // bgColor={'black'}
  backgroundRepeat="no-repeat"
  backgroundSize="cover" 
  backgroundPosition="center">
  {/* Title Section */}
  <Text fontSize="5xl" mb={-4} fontWeight="bold">
    A Platform Built For A New Way of Working In
  </Text>
  <Box
    bgGradient="linear(0deg, #AA2CCB 0%, #B817B8 42%, #6306D7 100%)"
    bgClip="text"
    fontSize="4xl"
    fontWeight="bold"
    display="inline-block"
    mb = {8}
  >
    Embedded World
  </Box>



        {/* New text added  */}
        <Text fontSize="2xl" mb={3} fontWeight="bold" textAlign="center">
        Hi ,What Would You Like To Create With Innoide&nbsp;?
</Text>



      {/* Create Options */}
        {/* <Grid templateColumns="repeat(2, 1fr)" gap={5} pl={400}>
  <Button
    onClick={handleCreateDiagram}
    size="sm"
    width="35%"
    px={4}
    background="linear-gradient(0deg, #AA2CCB 0%, #B817B8 42%, #6306D7 100%)"
    color="white"
    _hover={{
      background: "linear-gradient(0deg, #6306D7 0%, #B817B8 42%, #AA2CCB 100%)",
    }}
  >
    <Text fontSize="lg">Create Diagram</Text>
  </Button>

  <Button
    onClick={handleCreateCode}
    size="sm"
    width="35%"
    px={4}
    background="linear-gradient(0deg, #AA2CCB 0%, #B817B8 42%, #6306D7 100%)"
    color="white"
    _hover={{
      background: "linear-gradient(0deg, #6306D7 0%, #B817B8 42%, #AA2CCB 100%)",
    }}
  >
    <Text fontSize="lg">Create Code</Text>
  </Button>
</Grid> */}
{/* Create Options */}
<Flex justify="center" align="center" gap={2} pl={70}>
  <Button
    onClick={handleCreateDiagram}
    size="sm"
    width="15%"
    px={4}
    background="linear-gradient(0deg, #AA2CCB 0%, #B817B8 42%, #6306D7 100%)"
    color="white"
    _hover={{
      background: "linear-gradient(0deg, #6306D7 0%, #B817B8 42%, #AA2CCB 100%)",
    }}
  >
    <Text fontSize="lg">Create Diagram</Text>
  </Button>

  <Button
    onClick={handleCreateCode}
    size="sm"
    width="15%"
    px={4}
    background="linear-gradient(0deg, #AA2CCB 0%, #B817B8 42%, #6306D7 100%)"
    color="white"
    _hover={{
      background: "linear-gradient(0deg, #6306D7 0%, #B817B8 42%, #AA2CCB 100%)",
    }}
  >
    <Text fontSize="lg">Create Code</Text>
  </Button>

  {/* start  */}

  {/* <Button
    onClick={handleCreateBlock}
    size="sm"
    width="15%"
    px={4}
    background="linear-gradient(0deg, #AA2CCB 0%, #B817B8 42%, #6306D7 100%)"
    color="white"
    _hover={{
      background: "linear-gradient(0deg, #6306D7 0%, #B817B8 42%, #AA2CCB 100%)",
    }}
  >
    <Text fontSize="lg">Create BlockDiagram</Text>
  </Button> */}
  
  {/* end  */}
</Flex>

      

{/* image sections  */}
<Box display="flex" justifyContent="center" alignItems="center" mb={9}>
  {/* Here is the image  */}
  <img src={Vector522} alt="Innoide" style={{ maxWidth: '28%', height: 'auto'  }} />
  </Box>

      {/* Search Box */}
      {/* <Flex mb={4} justifyContent="flex-start">
        <Input placeholder="Search your templates" size="md" width="300px" mr={2} />
        <Icon as={MdSearch} boxSize={6} color="teal" />
      </Flex> */}

      {/* Documents Section */}
      <VStack spacing={2} align="flex-start" mb={2}>
        <Text fontSize="xl" fontWeight="bold">Your Documents</Text>
        <Divider mb={2} />

        {/* Using Grid for Documents */}
        <Grid templateColumns="repeat(5, 1fr)" gap={6} width="100%"  >
          {[...Array(5)].map((_, index) => (
            <VStack key={index} align="center" spacing={1}>
              <FaFolder size={100} color="teal" />
              <Box borderWidth="1px" borderRadius="lg" p={2} width="100px" textAlign="center">
                <Text fontSize="sm">{`Project ${index + 1}`}</Text>
              </Box>
            </VStack>
          ))}
        </Grid>
      </VStack>

      {/* Templates Section */}
      {/* <VStack spacing={2} align="flex-start">
        <Text fontSize="xl" fontWeight="bold">Templates</Text>
        <Divider mb={2} /> */}

        {/* Using Grid for Templates */}
        {/* <Grid templateColumns="repeat(5, 1fr)" gap={6} width="100%">
          <VStack align="center" spacing={1}>
            <GiNotebook size={100} color="teal" />
            <Box borderWidth="1px" borderRadius="lg" p={2} width="100px" textAlign="center">
              <Text fontSize="sm">STM32 U5</Text>
            </Box>
          </VStack>
          <VStack align="center" spacing={1}>
            <GiNotebook size={100} color="teal" />
            <Box borderWidth="1px" borderRadius="lg" p={2} width="100px" textAlign="center">
              <Text fontSize="sm">NRF52840</Text>
            </Box>
          </VStack>
          <VStack align="center" spacing={1}>
            <GiNotebook size={100} color="teal" />
            <Box borderWidth="1px" borderRadius="lg" p={2} width="100px" textAlign="center">
              <Text fontSize="sm">UML Use Case Diagram</Text>
            </Box>
          </VStack>
          <VStack align="center" spacing={1}>
            <GiNotebook size={100} color="teal" />
            <Box borderWidth="1px" borderRadius="lg" p={2} width="100px" textAlign="center">
              <Text fontSize="sm">UML Action And State Diagram</Text>
            </Box>
          </VStack>
          <VStack align="center" spacing={1}>
            <GiNotebook size={100} color="teal" />
            <Box borderWidth="1px" borderRadius="lg" p={2} width="100px" textAlign="center">
              <Text fontSize="sm">UML Sequence Diagram</Text>
            </Box>
          </VStack>
        </Grid> */}
      {/* </VStack> */}
    </Box>
{/* Here i am importing the footer  */}
<Footer />
    </>
  );
};

export default Template;