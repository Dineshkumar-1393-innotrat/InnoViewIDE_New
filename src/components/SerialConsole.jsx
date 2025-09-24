import React, { useState, useRef, useEffect } from 'react';
import { Button, Box, Text } from '@chakra-ui/react';

const SerialConsole = () => {
    const [port, setPort] = useState(null);
    const [output, setOutput] = useState('');
    const outputRef = useRef('');

    const connectToSerial = async () => {
        if ('serial' in navigator) {
            try {
                const serialPort = await navigator.serial.requestPort();
                await serialPort.open({ baudRate: 9600 });
                setPort(serialPort);
                setOutput('Connected to serial port.\n');

                const reader = serialPort.readable.getReader();
                try {
                    while (true) {
                        const { value, done } = await reader.read();
                        if (done) {
                            break;
                        }
                        const text = new TextDecoder().decode(value);
                        outputRef.current += text;
                        setOutput(outputRef.current);
                    }
                } catch (error) {
                    console.error('Error reading from serial port:', error);
                } finally {
                    reader.releaseLock();
                }
            } catch (error) {
                console.error('Error connecting to serial port:', error);
            }
        } else {
            alert('Web Serial API is not supported in this browser.');
        }
    };

    return (
        <Box>
            <Button onClick={connectToSerial} mb={4} disabled={!!port}>
                {port ? 'Connected' : 'Connect to Serial Device'}
            </Button>
            <Box as="pre" p={2} bg="gray.100" borderRadius="md" whiteSpace="pre-wrap" height="200px" overflowY="scroll">
                {output}
            </Box>
        </Box>
    );
};

export default SerialConsole;
