// import React, { useState } from 'react';
// import { DyteMeeting } from '@dytesdk/react-ui-kit';
// import { DyteProvider, useDyteClient } from '@dytesdk/react-web-core';
// import { Box, Button, Input, Select, VStack, HStack, Heading } from '@chakra-ui/react';

// // Configure your Dyte backend URL here
// const DYTE_BACKEND_URL = 'https://eureka.innotrat.in/api/v1';

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


import React, { useState, useEffect } from 'react';
import { DyteMeeting } from '@dytesdk/react-ui-kit';
import { DyteProvider, useDyteClient } from '@dytesdk/react-web-core';
import { Box, Button, Input, Select, VStack, HStack, Heading, Text, Spinner, Center } from '@chakra-ui/react';

// Configure your Dyte backend URL here
const DYTE_BACKEND_URL = 'https://eureka.innotrat.in/api/v1';

const DyteMeetingApp = ({ onClose, onMinimize, autoJoinMeetingId = null, autoCreate = false, onMeetingCreated }) => {
    const [meetingId, setMeetingId] = useState('');
    const [userName, setUserName] = useState('');
    const [userRole, setUserRole] = useState('host');
    const [meeting, setMeeting] = useState(null);
    const [baseURL] = useState(DYTE_BACKEND_URL);
    const [inviteLink, setInviteLink] = useState('');
    const [linkCopied, setLinkCopied] = useState(false);
    const [isCreating, setIsCreating] = useState(false);

    // Initialize Dyte Client hook at the top level
    const [dyteMeeting, initMeeting] = useDyteClient();

    // Auto-join functionality when autoJoinMeetingId is provided
    useEffect(() => {
        if (autoJoinMeetingId && autoJoinMeetingId !== 'undefined') {
            setMeetingId(autoJoinMeetingId);
            // Optionally auto-populate user name from localStorage if available
            const storedIdentity = window.localStorage.getItem('currentUserIdentity') ||
                window.sessionStorage.getItem('currentUserIdentity');
            if (storedIdentity) {
                try {
                    const identity = JSON.parse(storedIdentity);
                    const name = identity.name || identity.fullName || identity.username || '';
                    if (name) setUserName(name);
                } catch (e) {
                    console.log('Could not parse user identity');
                }
            }
        }
    }, [autoJoinMeetingId]);

    useEffect(() => {
        if (autoCreate && !meetingId && !isCreating) {
            createMeeting();
        }
    }, [autoCreate]);

    const createMeeting = async () => {
        setIsCreating(true);
        try {
            const resp = await fetch(`${baseURL}/create-meeting`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });
            const data = await resp.json();
            if (data.success) {
                // Handle different response structures based on backend version
                const newMeetingId = data.meetingId || (data.data && data.data.data && data.data.data.id) || (data.data && data.data.id);

                if (newMeetingId) {
                    setMeetingId(newMeetingId);
                    // Generate shareable invite link
                    const link = `${window.location.origin}/meet/${newMeetingId}`;
                    setInviteLink(link);
                    if (onMeetingCreated) {
                        onMeetingCreated(newMeetingId);
                    }
                } else {
                    alert('Failed to retrieve meeting ID from response');
                }
            } else {
                alert('Failed to create meeting: ' + (data.error?.message || 'Unknown error or missing ID'));
            }
        } catch (error) {
            alert('Error creating meeting: ' + error.message);
        } finally {
            setIsCreating(false);
        }
    };

    const copyInviteLink = async () => {
        try {
            await navigator.clipboard.writeText(inviteLink);
            setLinkCopied(true);
            setTimeout(() => setLinkCopied(false), 2000);
        } catch (error) {
            console.error('Failed to copy link:', error);
            alert('Failed to copy link to clipboard');
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

            // ... (inside joinMeeting function)
            const client_specific_id = 'client_' + Math.random().toString(36).substr(2, 9);
            const preset_name = userRole === 'host' ? 'group_call_host' : 'group_call_participant';

            // Ensure invite link exists for the UI
            if (!inviteLink && meetingId && meetingId !== 'undefined') {
                const link = `${window.location.origin}/meet/${meetingId}`;
                setInviteLink(link);
            }

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
        <Box p={0} bg="white" borderRadius="md" minH="500px" h="100%" display="flex" flexDirection="column">
            {!meeting ? (
                <Box p={5}>
                    <Heading size="md" mb={4}>Dyte Video Call</Heading>
                    <VStack spacing={4} align="stretch">
                        {isCreating ? (
                            <Center p={10}>
                                <VStack>
                                    <Spinner size="xl" color="blue.500" />
                                    <Text>Creating meeting...</Text>
                                </VStack>
                            </Center>
                        ) : (
                            <>
                                {!meetingId && !autoJoinMeetingId && (
                                    <HStack>
                                        <Button colorScheme="teal" onClick={createMeeting} w="full">
                                            Create New Meeting
                                        </Button>
                                    </HStack>
                                )}

                                {inviteLink && (
                                    <VStack spacing={2} align="stretch" mt={2} p={3} bg="gray.50" borderRadius="md" borderWidth="1px" borderColor="blue.100">
                                        <Text fontWeight="semibold" fontSize="sm" color="gray.700">Meeting Invite Link:</Text>
                                        <HStack>
                                            <Input
                                                value={inviteLink}
                                                isReadOnly
                                                size="sm"
                                                bg="white"
                                                color="black"
                                                fontSize="sm"
                                            />
                                            <Button
                                                onClick={copyInviteLink}
                                                size="sm"
                                                colorScheme={linkCopied ? "green" : "blue"}
                                                minW="90px"
                                            >
                                                {linkCopied ? "✓ Copied!" : "Copy Link"}
                                            </Button>
                                        </HStack>
                                        <Text fontSize="xs" color="gray.600">
                                            Share this link with others to invite them to the meeting
                                        </Text>
                                    </VStack>
                                )}

                                <Box>
                                    <Text mb={1} fontSize="sm" fontWeight="medium">Meeting ID</Text>
                                    <Input
                                        placeholder="Enter Meeting ID"
                                        value={meetingId}
                                        onChange={(e) => setMeetingId(e.target.value)}
                                        color="black"
                                        bg="white"
                                        isReadOnly={!!autoJoinMeetingId}
                                    />
                                </Box>

                                <Box>
                                    <Text mb={1} fontSize="sm" fontWeight="medium">Your Name</Text>
                                    <Input
                                        placeholder="Enter Your Name"
                                        value={userName}
                                        onChange={(e) => setUserName(e.target.value)}
                                        color="black"
                                        bg="white"
                                    />
                                </Box>

                                <Box>
                                    <Text mb={1} fontSize="sm" fontWeight="medium">Role</Text>
                                    <Select
                                        value={userRole}
                                        onChange={(e) => setUserRole(e.target.value)}
                                        color="black"
                                        bg="white"
                                    >
                                        <option value="host">Host</option>
                                        <option value="participant">Participant</option>
                                    </Select>
                                </Box>

                                <HStack pt={2}>
                                    <Button colorScheme="blue" onClick={joinMeeting} flex={1} isDisabled={!meetingId || !userName}>
                                        Join Meeting
                                    </Button>
                                    {onClose && (
                                        <Button variant="outline" onClick={onClose}>
                                            Close
                                        </Button>
                                    )}
                                </HStack>
                            </>
                        )}
                    </VStack>
                </Box>
            ) : (
                <Box position="relative" w="100%" h="100%" display="flex" flexDirection="column">
                    <Box p={2} bg="gray.50" borderBottomWidth="1px" display="flex" justifyContent="space-between" alignItems="center" flexShrink={0}>
                        <HStack>
                            <Text fontWeight="bold" fontSize="sm">Meeting ID: {meetingId}</Text>
                        </HStack >
                        <HStack>
                            <Button size="xs" onClick={copyInviteLink} colorScheme={linkCopied ? "green" : "gray"}>
                                {linkCopied ? "Copied!" : "Copy Invite Link"}
                            </Button>
                            {onMinimize && <Button size="xs" colorScheme="orange" variant="ghost" onClick={onMinimize}>Minimize</Button>}
                            {onClose && !onMinimize && <Button size="xs" colorScheme="red" variant="ghost" onClick={onClose}>Close</Button>}
                        </HStack>
                    </Box >
                    <Box flex={1} position="relative" overflow="hidden">
                        <DyteProvider value={dyteMeeting}>
                            <DyteMeeting meeting={dyteMeeting} mode="fill" style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }} />
                        </DyteProvider>
                    </Box>
                </Box >
            )}
        </Box >
    );
};

export default DyteMeetingApp;
