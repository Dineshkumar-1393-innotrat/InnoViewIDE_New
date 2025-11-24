// import React, { useState } from 'react';
// import { DyteMeeting } from '@dytesdk/react-ui-kit';
// import { DyteProvider, useDyteClient } from '@dytesdk/react-web-core';
// import { Box, Button, Input, Select, VStack, HStack, Heading } from '@chakra-ui/react';

// // Configure your Dyte backend URL here
// const DYTE_BACKEND_URL = 'http://192.168.68.115:5004/api/v1';

// const DyteMeetingApp = ({ onClose }) => {
//     const [meeting, setMeeting] = useState(null);
//     const [meetingId, setMeetingId] = useState('');
//     const [userName, setUserName] = useState('');
//     const [userRole, setUserRole] = useState('host');
//     const [baseURL] = useState(DYTE_BACKEND_URL);

//     const initMeeting = async ({ authToken }) => {
//         // This should use useDyteClient hook or implementation as per your requirements
//         const dyteClient = await useDyteClient({ authToken });
//         setMeeting(dyteClient);
//     };

//     const createMeeting = async () => {
//         try {
//             const resp = await fetch(`${baseURL}/create-meeting`, {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//             });
//             const data = await resp.json();
//             if (data.success) {
//                 setMeetingId(data.data.id);
//             } else {
//                 alert('Failed to create meeting: ' + (data.error?.message || 'Unknown error'));
//             }
//         } catch (error) {
//             alert('Error creating meeting: ' + error.message);
//         }
//     };

//     const joinMeeting = async () => {
//         try {
//             if (!meetingId) {
//                 alert('Please enter a meeting ID');
//                 return;
//             }
//             if (!userName) {
//                 alert('Please enter your name');
//                 return;
//             }

//             const client_specific_id = 'client_' + Math.random().toString(36).substr(2, 9);
//             const preset_name = userRole === 'host' ? 'group_call_host' : 'group_call_participant';

//             const resp = await fetch(`${baseURL}/meetings/${meetingId}/participants`, {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({
//                     name: userName,
//                     preset_name,
//                     client_specific_id,
//                 }),
//             });

//             const data = await resp.json();
//             if (data.success) {
//                 await initMeeting({ authToken: data.data.token });
//             } else {
//                 alert('Failed to join meeting: ' + (data.error?.message || 'Unknown error'));
//             }
//         } catch (error) {
//             alert('Error joining meeting: ' + error.message);
//         }
//     };

//     return (
//         <Box p={5} bg="white" borderRadius="md" minH="400px">
//             <Heading size="md" mb={4}>Dyte Video Call</Heading>
//             {!meeting ? (
//                 <VStack spacing={4} align="stretch">
//                     <HStack>
//                         <Button colorScheme="teal" onClick={createMeeting}>
//                             Create Meeting
//                         </Button>
//                     </HStack>
//                     <Input
//                         placeholder="Enter Meeting ID"
//                         value={meetingId}
//                         onChange={(e) => setMeetingId(e.target.value)}
//                     />
//                     <Input
//                         placeholder="Enter Your Name"
//                         value={userName}
//                         onChange={(e) => setUserName(e.target.value)}
//                     />
//                     <Select
//                         value={userRole}
//                         onChange={(e) => setUserRole(e.target.value)}
//                     >
//                         <option value="host">Host</option>
//                         <option value="participant">Participant</option>
//                     </Select>
//                     <HStack>
//                         <Button colorScheme="blue" onClick={joinMeeting} flex={1}>
//                             Join Meeting
//                         </Button>
//                         {onClose && (
//                             <Button variant="outline" onClick={onClose}>
//                                 Close
//                             </Button>
//                         )}
//                     </HStack>
//                 </VStack>
//             ) : (
//                 <Box>
//                     <DyteProvider value={meeting}>
//                         <DyteMeeting meeting={meeting} />
//                     </DyteProvider>
//                 </Box>
//             )}
//         </Box>
//     );
// };

// export default DyteMeetingApp;


import React, { useState } from 'react';
import { DyteMeeting } from '@dytesdk/react-ui-kit';
import { DyteProvider, useDyteClient } from '@dytesdk/react-web-core';
import { Box, Button, Input, Select, VStack, HStack, Heading } from '@chakra-ui/react';

// Configure your Dyte backend URL here
const DYTE_BACKEND_URL = 'https://eureka.innotrat.in/api/v1';

const DyteMeetingApp = ({ onClose }) => {
    const [meetingId, setMeetingId] = useState('');
    const [userName, setUserName] = useState('');
    const [userRole, setUserRole] = useState('host');
    const [meeting, setMeeting] = useState(null);
    const [baseURL] = useState(DYTE_BACKEND_URL);

    // Initialize Dyte Client hook at the top level
    const [dyteMeeting, initMeeting] = useDyteClient();

    const createMeeting = async () => {
        try {
            const resp = await fetch(`${baseURL}/create-meeting`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });
            const data = await resp.json();
            if (data.success) {
                setMeetingId(data.data.id);
            } else {
                alert('Failed to create meeting: ' + (data.error?.message || 'Unknown error'));
            }
        } catch (error) {
            alert('Error creating meeting: ' + error.message);
        }
    };

    const joinMeeting = async () => {
        try {
            if (!meetingId) {
                alert('Please enter a meeting ID');
                return;
            }
            if (!userName) {
                alert('Please enter your name');
                return;
            }

            const client_specific_id = 'client_' + Math.random().toString(36).substr(2, 9);
            const preset_name = userRole === 'host' ? 'group_call_host' : 'group_call_participant';

            const resp = await fetch(`${baseURL}/meetings/${meetingId}/participants`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: userName,
                    preset_name,
                    client_specific_id,
                }),
            });

            const data = await resp.json();
            if (data.success) {
                await initMeeting({ authToken: data.data.token });
                setMeeting(dyteMeeting);
            } else {
                alert('Failed to join meeting: ' + (data.error?.message || 'Unknown error'));
            }
        } catch (error) {
            alert('Error joining meeting: ' + error.message);
        }
    };

    return (
        <Box p={5} bg="white" borderRadius="md" minH="400px">
            <Heading size="md" mb={4}>Dyte Video Call</Heading>
            {!meeting ? (
                <VStack spacing={4} align="stretch">
                    <HStack>
                        <Button colorScheme="teal" onClick={createMeeting}>
                            Create Meeting
                        </Button>
                    </HStack>
                    <Input
                        placeholder="Enter Meeting ID"
                        value={meetingId}
                        onChange={(e) => setMeetingId(e.target.value)}
                        color="black" // Ensures input text is black
                        bg="white"    // Input background stays white
                    />
                    <Input
                        placeholder="Enter Your Name"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        color="black"
                        bg="white"
                    />
                    <Select
                        value={userRole}
                        onChange={(e) => setUserRole(e.target.value)}
                        color="black"
                        bg="white"
                    >
                        <option value="host">Host</option>
                        <option value="participant">Participant</option>
                    </Select>
                    <HStack>
                        <Button colorScheme="blue" onClick={joinMeeting} flex={1}>
                            Join Meeting
                        </Button>
                        {onClose && (
                            <Button variant="outline" onClick={onClose}>
                                Close
                            </Button>
                        )}
                    </HStack>
                </VStack>
            ) : (
                <Box>
                    <DyteProvider value={dyteMeeting}>
                        <DyteMeeting meeting={dyteMeeting} />
                    </DyteProvider>
                </Box>
            )}
        </Box>
    );
};

export default DyteMeetingApp;
