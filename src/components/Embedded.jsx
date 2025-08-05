import React, { useState } from 'react';
import { useColorMode, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, RadioGroup, Stack, Radio } from '@chakra-ui/react';
import Navbar from './Navbar';
import Footer from './Footer';
import OutputStatus from './OutputStatus'; // Assuming OutputStatus is a component you have

const Embedded = () => {
    const [code, setCode] = useState('');
    const [response, setResponse] = useState('');
    const [isFlashing, setIsFlashing] = useState(false); // New state for flashing status
    const { colorMode } = useColorMode(); // Get current color mode
    const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
    const [alignment, setAlignment] = useState('left'); // State to control alignment
    const closeModal = () => setIsModalOpen(false); // Close modal function

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsFlashing(true); // Disable the button

        try {
            const res = await fetch('https://admin.innotrat.in/submit-code', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code })
            });

            const result = await res.json();
            setResponse(result.message); // Update UI with the response message
        } catch (error) {
            console.error('Error:', error);
            setResponse('Error flashing code to the device');
        } finally {
            setIsFlashing(false); // Re-enable the button after flashing completes
        }
    };

    const containerStyle = {
        padding: '20px',
        backgroundColor: colorMode === 'dark' ? '#2D3748' : '#F7FAFC',
        color: colorMode === 'dark' ? '#E2E8F0' : '#2D3748',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    };

    const headingStyle = {
        fontSize: '24px',
        fontWeight: 'bold',
        marginBottom: '20px',
    };

    const textareaStyle = {
        width: '100%',
        height: '300px',
        padding: '10px',
        fontSize: '16px',
        borderRadius: '5px',
        border: `1px solid ${colorMode === 'dark' ? '#4A5568' : '#CBD5E0'}`,
        backgroundColor: colorMode === 'dark' ? '#1A202C' : '#F7FAFC',
        color: colorMode === 'dark' ? '#E2E8F0' : '#2D3748',
        resize: 'none',
    };

    const buttonStyle = {
        padding: '10px 20px',
        fontSize: '16px',
        color: 'white',
        backgroundColor: colorMode === 'dark' ? '#4A90E2' : '#3182CE',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        marginTop: '10px',
        opacity: isFlashing ? 0.6 : 1,
    };

    const responseStyle = {
        marginTop: '20px',
        padding: '10px',
        backgroundColor: colorMode === 'dark' ? '#2D3748' : '#F7FAFC',
        color: colorMode === 'dark' ? '#E2E8F0' : '#2D3748',
        borderRadius: '5px',
        border: `1px solid ${colorMode === 'dark' ? '#4A5568' : '#CBD5E0'}`,
    };

    return (
        <>
            <Navbar />
            <div style={containerStyle}>
                <h1 style={headingStyle}>Let's Flash it Out!</h1>
                <form onSubmit={handleSubmit}>
                    <textarea
                        style={textareaStyle}
                        placeholder="Enter your code here..."
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                    />
                    <br />
                    <button
                        type="submit"
                        style={buttonStyle}
                        disabled={isFlashing || code.trim().length === 0} // Disable if flashing or no code
                    >
                        {isFlashing ? 'Flashing Code...' : 'Flash Code'}
                    </button>
                    &nbsp;&nbsp;&nbsp;

                    <Button size="sm" colorScheme="blue" variant="outline" onClick={() => console.log('Problem Output clicked')}>
                        Problem Output
                    </Button>
                    <Button size="sm" colorScheme="blue" variant="outline" onClick={() => console.log('Serial Console clicked')} ml={2}>
                        Serial Console
                    </Button>
                    <Button size="sm" colorScheme="blue" variant="outline" onClick={() => console.log('Terminal clicked')} ml={2}>
                        Terminal
                    </Button>
                </form>

                <pre style={responseStyle}>{response}</pre>

                <OutputStatus errorLine={{ line: 11, row: 2 }} />
            </div>

            <Modal isOpen={isModalOpen} onClose={closeModal}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Choose Panel Alignment</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <RadioGroup onChange={setAlignment} value={alignment}>
                            <Stack direction="column">
                                <Radio value="left">Left</Radio>
                                <Radio value="right">Right</Radio>
                                <Radio value="top">Top</Radio>
                                <Radio value="bottom">Bottom</Radio>
                            </Stack>
                        </RadioGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={closeModal}>
                            Apply
                        </Button>
                        <Button variant="ghost" onClick={closeModal}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            <Footer />
        </>
    );
};

export default Embedded;
