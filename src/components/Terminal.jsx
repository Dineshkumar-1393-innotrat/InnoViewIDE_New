import React, { useEffect, useRef } from 'react';
import { Terminal } from 'xterm';
import 'xterm/css/xterm.css';

// --- Create a single, persistent terminal instance ---
const term = new Terminal({ cursorBlink: true });

// --- Mock Shell Implementation ---
let currentLine = '';
const prompt = '$ ';

const processCommand = (command) => {
    switch (command.trim()) {
        case 'help':
            return '\r\nAvailable commands:\r\n  help   - Show this help message\r\n  clear  - Clear the terminal screen\r\n  date   - Display the current date\r\n';
        case 'date':
            return `\r\n${new Date().toString()}\r\n`;
        case 'clear':
            term.clear();
            return '';
        case '':
            return '\r\n';
        default:
            return `\r\nCommand not found: ${command.trim()}\r\n`;
    }
};

// Welcome message
term.write('Welcome to the mock terminal!\r\n');
term.write(prompt);

// Handle user input
term.onData(data => {
    const code = data.charCodeAt(0);

    if (code === 13) { // Enter key
        const output = processCommand(currentLine);
        term.write(output);
        currentLine = '';
        term.write(`\r\n${prompt}`);
    } else if (code === 127) { // Backspace
        if (currentLine.length > 0) {
            term.write('\b \b'); // Move cursor back, write space, move back again
            currentLine = currentLine.slice(0, -1);
        }
    } else if (code >= 32 && code <= 126) { // Printable characters
        currentLine += data;
        term.write(data);
    }
});
// --------------------------------

const XTerm = () => {
    const terminalRef = useRef(null);

    useEffect(() => {
        // Attach the persistent terminal to the DOM when the component mounts
        if (terminalRef.current) {
            term.open(terminalRef.current);
            term.focus();
        }
    }, []);

    return <div ref={terminalRef} style={{ height: '300px', width: '100%' }} />;
};

export default XTerm;
