// // import React, { useEffect, useState } from 'react';
// // import { useParams } from 'react-router-dom';
// // import { DyteMeeting } from '@dytesdk/react-ui-kit';
// // import { DyteProvider, useDyteClient } from '@dytesdk/react-web-core';
// // import { requestDyteSession } from '../services/dyteService';

// // const JoinMeeting = () => {
// //   const { meetingId } = useParams();
// //   const [authToken, setAuthToken] = useState('');
// //   const [meeting, initMeeting, leaveMeeting] = useDyteClient();
// //   const [error, setError] = useState('');
// //   const [loading, setLoading] = useState(true);

// //   // Step 1: Request participant token as soon as meetingId is present
// //   useEffect(() => {
// //     let isMounted = true;
// //     if (!meetingId) {
// //       setError('No meeting ID found in link.');
// //       setLoading(false);
// //       return;
// //     }
// //     setLoading(true);

// //     requestDyteSession({
// //       meetingId,
// //       participantName: 'Guest',
// //       meetingPreset: 'group_call_participant',
// //       clientId: `guest_${Date.now()}`,
// //     })
// //       .then(res => {
// //         if (!isMounted) return;
// //         setAuthToken(res.authToken);
// //         setLoading(false);
// //       })
// //       .catch(err => {
// //         if (!isMounted) return;
// //         setError(err.message || 'Failed to join meeting.');
// //         setLoading(false);
// //       });

// //     return () => {
// //       isMounted = false;
// //     };
// //   }, [meetingId]);

// //   // Step 2: Init Dyte meeting when token is ready
// //   useEffect(() => {
// //     if (!authToken) return;

// //     let didCancel = false;

// //     const startMeeting = async () => {
// //       try {
// //         await initMeeting({
// //           authToken,
// //           defaults: { audio: true, video: true },
// //           videoEnabled: true,
// //           audioEnabled: true,
// //           setupScreen: true,
// //           showSetupScreen: true,
// //         });
// //       } catch (err) {
// //         if (!didCancel) setError(err.message || 'Dyte meeting initialization failed');
// //       }
// //     };

// //     startMeeting();

// //     // Cleanup on unmount or authToken change
// //     return () => {
// //       didCancel = true;
// //       if (meeting && typeof leaveMeeting === 'function') {
// //         leaveMeeting();
// //       }
// //     };
// //   }, [authToken, initMeeting, leaveMeeting, meeting]);

// //   // Event listeners for media permission errors and video state
// //   useEffect(() => {
// //     if (!meeting) return;

// //     const handleMediaPermissionError = (err) => {
// //       setError(`Camera/Microphone permission error: ${err.message || err}`);
// //     };
// //     const handleVideoUpdate = ({ videoEnabled }) => {
// //       if (!videoEnabled) {
// //         setError('Video is turned off or not available');
// //       } else {
// //         setError('');
// //       }
// //     };

// //     meeting.self.on('mediaPermissionError', handleMediaPermissionError);
// //     meeting.self.on('videoUpdate', handleVideoUpdate);

// //     return () => {
// //       meeting.self.off('mediaPermissionError', handleMediaPermissionError);
// //       meeting.self.off('videoUpdate', handleVideoUpdate);
// //     };
// //   }, [meeting]);

// //   // Step 3: Show errors/loader/meeting UI
// //   if (loading) {
// //     return (
// //       <div style={{ color: '#fff', background: '#111', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
// //         Loading meeting...
// //       </div>
// //     );
// //   }

// //   if (error && !meeting) {
// //     return (
// //       <div style={{ color: '#f87171', background: '#111', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
// //         Error: {error}
// //       </div>
// //     );
// //   }

// //   if (!meeting) {
// //     return (
// //       <div style={{ color: '#fff', background: '#111', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
// //         Joining...
// //       </div>
// //     );
// //   }

// //   return (
// //     <DyteProvider value={meeting}>
// //       <DyteMeeting mode="fill" style={{ width: '100vw', height: '100vh', background: '#000' }} />
// //       {error && (
// //         <div style={{ position: 'absolute', bottom: 20, left: 20, color: 'red', backgroundColor: '#311' }}>
// //           {error}
// //         </div>
// //       )}
// //     </DyteProvider>
// //   );
// // };

// // // export default JoinMeeting;
// // import React, { useEffect, useState } from 'react';
// // import { useParams } from 'react-router-dom';
// // import { DyteProvider, useDyteClient } from '@dytesdk/react-web-core';
// // import { DyteMeeting, DyteParticipantTile } from '@dytesdk/react-ui-kit';
// // import { requestDyteSession } from '../services/dyteService';

// // const JoinMeeting = () => {
// //   const { meetingId } = useParams();
// //   const [authToken, setAuthToken] = useState('');
// //   const [meeting, initMeeting, leaveMeeting] = useDyteClient();
// //   const [error, setError] = useState('');
// //   const [loading, setLoading] = useState(true);

// //   useEffect(() => {
// //     if (!meetingId) {
// //       setError('No meeting ID found in link.');
// //       setLoading(false);
// //       return;
// //     }
// //     setLoading(true);
// //     requestDyteSession({
// //       meetingId,
// //       participantName: 'Guest',
// //       meetingPreset: 'group_call_participant',
// //       clientId: `guest_${Date.now()}`,
// //     })
// //       .then(res => {
// //         setAuthToken(res.authToken);
// //         setLoading(false);
// //       })
// //       .catch(err => {
// //         setError(err.message || 'Failed to join meeting.');
// //         setLoading(false);
// //       });
// //   }, [meetingId]);

// //   useEffect(() => {
// //     if (!authToken) return;
// //     let isMounted = true;
// //     const startMeeting = async () => {
// //       try {
// //         await initMeeting({
// //           authToken,
// //           defaults: { audio: true, video: true },
// //           videoEnabled: true,
// //           audioEnabled: true,
// //           setupScreen: true,
// //           showSetupScreen: true,
// //         });
// //       } catch (err) {
// //         if (isMounted) setError(err.message || 'Dyte meeting initialization failed');
// //       }
// //     };
// //     startMeeting();
// //     return () => {
// //       isMounted = false;
// //       if (typeof leaveMeeting === 'function') leaveMeeting();
// //     };
// //   }, [authToken, initMeeting, leaveMeeting]);

// //   useEffect(() => {
// //     if (!meeting) return;
// //     const onPermissionError = (err) => setError('Media permission error: ' + (err.message || err));
// //     meeting.self.on('mediaPermissionError', onPermissionError);
// //     return () => meeting.self.off('mediaPermissionError', onPermissionError);
// //   }, [meeting]);

// //   if (loading) return (<div style={{ color: '#fff', background: '#111', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Loading meeting...</div>);
// //   if (error && !meeting) return (<div style={{ color: '#f87171', background: '#111', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Error: {error}</div>);
// //   if (!meeting) return (<div style={{ color: '#fff', background: '#111', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Joining...</div>);

// //   return (
// //     <DyteProvider value={meeting}>
// //       <DyteMeeting mode="fill" style={{ width: '100vw', height: '100vh', background: '#000' }} />
// //       <div style={{ position: 'absolute', top: 80, right: 30, zIndex: 10 }}>
// //         {meeting.participants?.active.toArray().map(p =>
// //           p.videoEnabled ? (
// //             <DyteParticipantTile key={p.id} participant={p} meeting={meeting} />
// //           ) : null
// //         )}
// //       </div>
// //     </DyteProvider>
// //   );
// // };

// // export default JoinMeeting;

// //10-11-25

// // import React, { useState, useEffect, useRef } from 'react';
// // import { useParams, useNavigate } from 'react-router-dom';
// // import { DyteMeeting } from '@dytesdk/react-ui-kit';
// // import { DyteProvider, useDyteClient } from '@dytesdk/react-web-core';
// // import {
// //   Box,
// //   Center,
// //   Spinner,
// //   Text,
// //   VStack,
// //   Button,
// //   Input,
// //   FormControl,
// //   FormLabel,
// //   useToast,
// //   Container,
// //   Heading,
// //   HStack,
// //   IconButton,
// //   Tooltip,
// // } from '@chakra-ui/react';
// // import { AlertCircle, ArrowLeft, Video } from 'lucide-react';

// // const EUREKA_BASE_URL = 'https://eureka.innotrat.in/api/v1';

// // const JoinMeeting = () => {
// //   const { meetingId } = useParams();
// //   const navigate = useNavigate();
// //   const toast = useToast();

// //   const [meeting, initMeeting] = useDyteClient();
// //   const [participantName, setParticipantName] = useState('');
// //   const [isJoining, setIsJoining] = useState(false);
// //   const [hasJoined, setHasJoined] = useState(false);
// //   const [error, setError] = useState(null);
// //   const initTokenRef = useRef(null);

// //   // Load participant name from localStorage or AuthContext
// //   useEffect(() => {
// //     try {
// //       const stored = localStorage.getItem('currentUserIdentity');
// //       if (stored) {
// //         const parsed = JSON.parse(stored);
// //         if (parsed?.name) {
// //           setParticipantName(parsed.name);
// //         }
// //       }
// //     } catch (err) {
// //       console.warn('Failed to load user identity:', err);
// //     }
// //   }, []);

// //   const handleJoinMeeting = async () => {
// //     if (!participantName.trim()) {
// //       toast({
// //         title: 'Name Required',
// //         description: 'Please enter your name to join the meeting',
// //         status: 'warning',
// //         duration: 3000,
// //         isClosable: true,
// //       });
// //       return;
// //     }

// //     if (!meetingId) {
// //       setError('Invalid meeting ID');
// //       return;
// //     }

// //     setIsJoining(true);
// //     setError(null);

// //     try {
// //       console.log('🎫 Requesting participant token for meeting:', meetingId);

// //       // Get participant token
// //       const response = await fetch(`${EUREKA_BASE_URL}/get-participant-token`, {
// //         method: 'POST',
// //         headers: {
// //           'Content-Type': 'application/json',
// //           Accept: 'application/json',
// //         },
// //         body: JSON.stringify({
// //           meetingId: meetingId,
// //           name: participantName.trim(),
// //           preset: 'group_call_participant',
// //         }),
// //       });

// //       const data = await response.json();

// //       if (!response.ok) {
// //         throw new Error(data.message || 'Failed to get participant token');
// //       }

// //       const token = data?.data?.token;

// //       if (!token) {
// //         throw new Error('No token received from server');
// //       }

// //       console.log('✅ Token received, initializing meeting...');

// //       // Prevent duplicate initialization
// //       if (initTokenRef.current === token) {
// //         return;
// //       }
// //       initTokenRef.current = token;

// //       // Initialize Dyte meeting
// //       await initMeeting({
// //         authToken: token,
// //         defaults: {
// //           audio: false,
// //           video: false,
// //         },
// //       });

// //       setHasJoined(true);
// //       toast({
// //         title: 'Joined Meeting',
// //         description: 'Successfully joined the meeting',
// //         status: 'success',
// //         duration: 2000,
// //         isClosable: true,
// //       });
// //     } catch (err) {
// //       console.error('❌ Failed to join meeting:', err);
// //       setError(err.message || 'Failed to join meeting');
// //       toast({
// //         title: 'Join Failed',
// //         description: err.message || 'Failed to join meeting',
// //         status: 'error',
// //         duration: 5000,
// //         isClosable: true,
// //       });
// //     } finally {
// //       setIsJoining(false);
// //     }
// //   };

// //   const handleLeaveMeeting = () => {
// //     try {
// //       if (meeting) {
// //         meeting.leaveRoom();
// //       }
// //     } catch (err) {
// //       console.warn('Leave error:', err);
// //     }
// //     navigate('/');
// //   };

// //   // If meeting is active, show the meeting UI
// //   if (hasJoined && meeting) {
// //     return (
// //       <Box w="100vw" h="100vh" bg="#000" position="relative">
// //         {/* Header with Leave Button */}
// //         <Box
// //           position="absolute"
// //           top={0}
// //           left={0}
// //           right={0}
// //           zIndex={100}
// //           bg="rgba(0,0,0,0.8)"
// //           backdropFilter="blur(10px)"
// //           p={4}
// //         >
// //           <HStack justify="space-between">
// //             <HStack spacing={3}>
// //               <Text color="white" fontSize="lg" fontWeight="500">
// //                 Meeting: {meetingId?.slice(0, 8)}...
// //               </Text>
// //               <Text color="gray.400" fontSize="sm">
// //                 ({participantName})
// //               </Text>
// //             </HStack>
// //             <Button
// //               leftIcon={<ArrowLeft size={16} />}
// //               onClick={handleLeaveMeeting}
// //               colorScheme="red"
// //               size="md"
// //             >
// //               Leave Meeting
// //             </Button>
// //           </HStack>
// //         </Box>

// //         {/* Dyte Meeting Component */}
// //         <DyteProvider value={meeting}>
// //           <DyteMeeting
// //             mode="fill"
// //             meeting={meeting}
// //             showSetupScreen={true}
// //             style={{
// //               width: '100%',
// //               height: '100%',
// //             }}
// //           />
// //         </DyteProvider>
// //       </Box>
// //     );
// //   }

// //   // Join meeting form
// //   return (
// //     <Box minH="100vh" bg="gray.50" py={10}>
// //       <Container maxW="md">
// //         <VStack spacing={8}>
// //           {/* Header */}
// //           <VStack spacing={2}>
// //             <Tooltip label="Back to Home">
// //               <IconButton
// //                 icon={<ArrowLeft size={20} />}
// //                 onClick={() => navigate('/')}
// //                 variant="ghost"
// //                 colorScheme="gray"
// //                 alignSelf="flex-start"
// //                 mb={4}
// //               />
// //             </Tooltip>
// //             <Box
// //               bg="blue.500"
// //               p={4}
// //               borderRadius="full"
// //               display="inline-flex"
// //               alignItems="center"
// //               justifyContent="center"
// //             >
// //               <Video size={32} color="white" />
// //             </Box>
// //             <Heading size="lg" textAlign="center">
// //               Join Meeting
// //             </Heading>
// //             <Text color="gray.600" textAlign="center" fontSize="sm">
// //               Meeting ID: <strong>{meetingId?.slice(0, 8)}...</strong>
// //             </Text>
// //           </VStack>

// //           {/* Error Display */}
// //           {error && (
// //             <Box
// //               w="100%"
// //               bg="red.50"
// //               border="1px solid"
// //               borderColor="red.200"
// //               borderRadius="md"
// //               p={4}
// //             >
// //               <HStack spacing={3}>
// //                 <AlertCircle size={20} color="#E53E3E" />
// //                 <Text color="red.700" fontSize="sm">
// //                   {error}
// //                 </Text>
// //               </HStack>
// //             </Box>
// //           )}

// //           {/* Join Form */}
// //           <Box
// //             w="100%"
// //             bg="white"
// //             borderRadius="lg"
// //             boxShadow="md"
// //             p={8}
// //             border="1px solid"
// //             borderColor="gray.200"
// //           >
// //             <VStack spacing={6}>
// //               <FormControl isRequired>
// //                 <FormLabel>Your Name</FormLabel>
// //                 <Input
// //                   placeholder="Enter your name"
// //                   value={participantName}
// //                   onChange={(e) => setParticipantName(e.target.value)}
// //                   onKeyPress={(e) => {
// //                     if (e.key === 'Enter') {
// //                       handleJoinMeeting();
// //                     }
// //                   }}
// //                   size="lg"
// //                   isDisabled={isJoining}
// //                 />
// //               </FormControl>

// //               <Button
// //                 colorScheme="blue"
// //                 size="lg"
// //                 w="100%"
// //                 leftIcon={isJoining ? <Spinner size="sm" /> : <Video size={20} />}
// //                 onClick={handleJoinMeeting}
// //                 isLoading={isJoining}
// //                 loadingText="Joining..."
// //                 isDisabled={!participantName.trim()}
// //               >
// //                 Join Meeting
// //               </Button>
// //             </VStack>
// //           </Box>

// //           {/* Help Text */}
// //           <Text color="gray.500" fontSize="xs" textAlign="center">
// //             By joining this meeting, you agree to our terms of service and
// //             privacy policy.
// //           </Text>
// //         </VStack>
// //       </Container>
// //     </Box>
// //   );
// // };

// // export default JoinMeeting;


// // import React, { useEffect, useState } from "react";
// // import { useParams } from "react-router-dom";
// // import { DyteMeeting } from "@dytesdk/react-ui-kit";
// // import { DyteProvider, useDyteClient } from "@dytesdk/react-web-core";

// // const JoinMeetingInner = ({ token }) => {
// //   const [meeting, initMeeting] = useDyteClient();

// //   useEffect(() => {
// //     if (token) {
// //       initMeeting({
// //         authToken: token,
// //       });
// //     }
// //   }, [token, initMeeting]);

// //   if (!meeting) return <p style={{ textAlign: "center" }}>Loading meeting...</p>;

// //   return (
// //     <div style={{ height: "100vh", width: "100vw" }}>
// //       <DyteMeeting meeting={meeting} />
// //     </div>
// //   );
// // };

// // const JoinMeeting = () => {
// //   const { meetingId } = useParams();
// //   const [token, setToken] = useState("");

// //   useEffect(() => {
// //     const getToken = async () => {
// //       try {
// //         const res = await fetch("https://eureka.innotrat.in/api/v1/get-participant-token", {
// //           method: "POST",
// //           headers: { "Content-Type": "application/json" },
// //           body: JSON.stringify({
// //             meetingId: meetingId,
// //             preset: "group_call_host", // Corrected: use 'preset' not 'presetName'
// //             name: "Host",
// //           }),
// //         });
// //         const data = await res.json();
// //         if (data?.data?.token) {
// //           setToken(data.data.token);
// //         } else {
// //           console.error("Token not found:", data);
// //         }
// //       } catch (error) {
// //         console.error("Error fetching token:", error);
// //       }
// //     };
// //     getToken();
// //   }, [meetingId]);

// //   if (!token)
// //     return <p style={{ textAlign: "center", marginTop: "50px" }}>Joining meeting...</p>;

// //   return (
// //     // <DyteProvider>
// //     //   <JoinMeetingInner token={token} />
// //     // </DyteProvider>

// //     <DyteProvider value={meeting}>
// //   <JoinMeetingInner token={token} />
// // </DyteProvider>
// //   );
// // };

// // export default JoinMeeting;
// // import React, { useEffect, useState, useRef } from "react";
// // import { useParams, useNavigate } from "react-router-dom";
// // import { DyteMeeting } from "@dytesdk/react-ui-kit";
// // import { DyteProvider, useDyteClient } from "@dytesdk/react-web-core";

// // const JoinMeeting = () => {
// //   const { meetingId } = useParams();
// //   const navigate = useNavigate();
// //   const [token, setToken] = useState("");
// //   const [participantName, setParticipantName] = useState("");
// //   const [hasJoined, setHasJoined] = useState(false);
// //   const [isLoading, setIsLoading] = useState(false);
// //   const [error, setError] = useState(null);
// //   const [meeting, initMeeting] = useDyteClient();
// //   const initTokenRef = useRef(null);

// //   // Load participant name from storage on mount
// //   useEffect(() => {
// //     try {
// //       const stored = localStorage.getItem("currentUserIdentity");
// //       if (stored) {
// //         const parsed = JSON.parse(stored);
// //         if (parsed?.name) {
// //           setParticipantName(parsed.name);
// //         }
// //       }
// //     } catch (err) {
// //       console.warn("Failed to load user identity:", err);
// //     }
// //   }, []);

// //   // Initialize meeting when token is available
// //   useEffect(() => {
// //     if (!token || initTokenRef.current === token) return;

// //     const initialize = async () => {
// //       try {
// //         console.log("🎥 Initializing Dyte meeting...");
// //         initTokenRef.current = token;
        
// //         await initMeeting({
// //           authToken: token,
// //           defaults: { audio: false, video: false },
// //         });

// //         console.log("✅ Meeting initialized successfully");
// //       } catch (err) {
// //         console.error("❌ Failed to initialize meeting:", err);
// //         setError(err.message || "Failed to initialize meeting");
// //       }
// //     };

// //     initialize();
// //   }, [token, initMeeting]);

// //   // Fetch token and join meeting
// //   const handleJoinMeeting = async () => {
// //     if (!participantName.trim()) {
// //       setError("Please enter your name");
// //       return;
// //     }

// //     if (!meetingId) {
// //       setError("Invalid meeting ID");
// //       return;
// //     }

// //     setIsLoading(true);
// //     setError(null);

// //     try {
// //       console.log("🎫 Fetching participant token for:", meetingId);

// //       const res = await fetch("https://eureka.innotrat.in/api/v1/get-participant-token", {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify({
// //           meetingId: meetingId,
// //           name: participantName.trim(),
// //           preset: "group_call_participant", // ✅ Fixed: was "preset_name"
// //         }),
// //       });

// //       const data = await res.json();

// //       if (!res.ok) {
// //         throw new Error(data.message || "Failed to get participant token");
// //       }

// //       if (data?.data?.token) {
// //         console.log("✅ Token received successfully");
// //         setToken(data.data.token);
// //         setHasJoined(true);
// //       } else {
// //         throw new Error("Token not found in response");
// //       }
// //     } catch (err) {
// //       console.error("❌ Error fetching token:", err);
// //       setError(err.message || "Failed to join meeting");
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   };

// //   const handleLeaveMeeting = () => {
// //     try {
// //       if (meeting) {
// //         meeting.leaveRoom();
// //       }
// //     } catch (err) {
// //       console.warn("Leave error:", err);
// //     }
// //     navigate("/");
// //   };

// //   // Show meeting UI if joined and meeting is ready
// //   if (hasJoined && meeting) {
// //     return (
// //       <DyteProvider value={meeting}>
// //         <div style={{ height: "100vh", width: "100vw", position: "relative", background: "#000" }}>
// //           {/* Header with Leave Button */}
// //           <div
// //             style={{
// //               position: "absolute",
// //               top: 0,
// //               left: 0,
// //               right: 0,
// //               zIndex: 100,
// //               background: "rgba(0,0,0,0.8)",
// //               padding: "16px",
// //               display: "flex",
// //               justifyContent: "space-between",
// //               alignItems: "center",
// //             }}
// //           >
// //             <div style={{ color: "#fff" }}>
// //               <strong>Meeting:</strong> {meetingId?.slice(0, 10)}... | <strong>You:</strong> {participantName}
// //             </div>
// //             <button
// //               onClick={handleLeaveMeeting}
// //               style={{
// //                 background: "#e53e3e",
// //                 color: "#fff",
// //                 border: "none",
// //                 padding: "8px 20px",
// //                 borderRadius: "8px",
// //                 cursor: "pointer",
// //                 fontWeight: "500",
// //               }}
// //             >
// //               Leave Meeting
// //             </button>
// //           </div>

// //           {/* Dyte Meeting Component */}
// //           <DyteMeeting
// //             meeting={meeting}
// //             mode="fill"
// //             showSetupScreen={true}
// //             style={{ width: "100%", height: "100%" }}
// //           />
// //         </div>
// //       </DyteProvider>
// //     );
// //   }

// //   // Show join form
// //   return (
// //     <div
// //       style={{
// //         minHeight: "100vh",
// //         background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
// //         display: "flex",
// //         alignItems: "center",
// //         justifyContent: "center",
// //         padding: "20px",
// //       }}
// //     >
// //       <div
// //         style={{
// //           background: "#fff",
// //           borderRadius: "16px",
// //           padding: "40px",
// //           maxWidth: "450px",
// //           width: "100%",
// //           boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
// //         }}
// //       >
// //         {/* Header */}
// //         <div style={{ textAlign: "center", marginBottom: "30px" }}>
// //           <div
// //             style={{
// //               width: "64px",
// //               height: "64px",
// //               background: "#667eea",
// //               borderRadius: "50%",
// //               display: "inline-flex",
// //               alignItems: "center",
// //               justifyContent: "center",
// //               marginBottom: "16px",
// //             }}
// //           >
// //             <svg
// //               width="32"
// //               height="32"
// //               viewBox="0 0 24 24"
// //               fill="none"
// //               stroke="#fff"
// //               strokeWidth="2"
// //               strokeLinecap="round"
// //               strokeLinejoin="round"
// //             >
// //               <path d="M23 7l-7 5 7 5V7z" />
// //               <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
// //             </svg>
// //           </div>
// //           <h2 style={{ margin: 0, fontSize: "24px", color: "#2d3748" }}>Join Meeting</h2>
// //           <p style={{ margin: "8px 0 0 0", color: "#718096", fontSize: "14px" }}>
// //             Meeting ID: <strong>{meetingId?.slice(0, 10)}...</strong>
// //           </p>
// //         </div>

// //         {/* Error Message */}
// //         {error && (
// //           <div
// //             style={{
// //               background: "#fed7d7",
// //               border: "1px solid #fc8181",
// //               borderRadius: "8px",
// //               padding: "12px",
// //               marginBottom: "20px",
// //               color: "#c53030",
// //               fontSize: "14px",
// //             }}
// //           >
// //             {error}
// //           </div>
// //         )}

// //         {/* Join Form */}
// //         <div style={{ marginBottom: "20px" }}>
// //           <label
// //             style={{
// //               display: "block",
// //               marginBottom: "8px",
// //               fontWeight: "500",
// //               color: "#2d3748",
// //               fontSize: "14px",
// //             }}
// //           >
// //             Your Name *
// //           </label>
// //           <input
// //             type="text"
// //             value={participantName}
// //             onChange={(e) => setParticipantName(e.target.value)}
// //             onKeyPress={(e) => {
// //               if (e.key === "Enter" && !isLoading) {
// //                 handleJoinMeeting();
// //               }
// //             }}
// //             placeholder="Enter your name"
// //             disabled={isLoading}
// //             style={{
// //               width: "100%",
// //               padding: "12px",
// //               border: "2px solid #e2e8f0",
// //               borderRadius: "8px",
// //               fontSize: "16px",
// //               outline: "none",
// //               transition: "border 0.2s",
// //             }}
// //             onFocus={(e) => (e.target.style.borderColor = "#667eea")}
// //             onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
// //           />
// //         </div>

// //         {/* Join Button */}
// //         <button
// //           onClick={handleJoinMeeting}
// //           disabled={isLoading || !participantName.trim()}
// //           style={{
// //             width: "100%",
// //             padding: "14px",
// //             background: isLoading || !participantName.trim() ? "#cbd5e0" : "#667eea",
// //             color: "#fff",
// //             border: "none",
// //             borderRadius: "8px",
// //             fontSize: "16px",
// //             fontWeight: "600",
// //             cursor: isLoading || !participantName.trim() ? "not-allowed" : "pointer",
// //             transition: "background 0.2s",
// //           }}
// //           onMouseEnter={(e) => {
// //             if (!isLoading && participantName.trim()) {
// //               e.target.style.background = "#5568d3";
// //             }
// //           }}
// //           onMouseLeave={(e) => {
// //             if (!isLoading && participantName.trim()) {
// //               e.target.style.background = "#667eea";
// //             }
// //           }}
// //         >
// //           {isLoading ? "Joining..." : "Join Meeting"}
// //         </button>

// //         {/* Back Button */}
// //         <button
// //           onClick={() => navigate("/")}
// //           style={{
// //             width: "100%",
// //             padding: "12px",
// //             background: "transparent",
// //             color: "#718096",
// //             border: "none",
// //             borderRadius: "8px",
// //             fontSize: "14px",
// //             fontWeight: "500",
// //             cursor: "pointer",
// //             marginTop: "12px",
// //           }}
// //         >
// //           Back to Home
// //         </button>
// //       </div>
// //     </div>
// //   );
// // };

// // export default JoinMeeting;




// // import React, { useEffect, useState, useRef } from "react";
// // import { useParams, useNavigate } from "react-router-dom";
// // import { DyteMeeting } from "@dytesdk/react-ui-kit";
// // import { DyteProvider, useDyteClient } from "@dytesdk/react-web-core";

// // const JoinMeeting = () => {
// //   const { meetingId } = useParams();
// //   const navigate = useNavigate();
// //   const [token, setToken] = useState("");
// //   const [participantName, setParticipantName] = useState("");
// //   const [hasJoined, setHasJoined] = useState(false);
// //   const [isLoading, setIsLoading] = useState(false);
// //   const [error, setError] = useState(null);
// //   const [meeting, initMeeting] = useDyteClient();
// //   const initTokenRef = useRef(null);

// //   // Load participant name from storage on mount
// //   useEffect(() => {
// //     try {
// //       const stored = localStorage.getItem("currentUserIdentity");
// //       if (stored) {
// //         const parsed = JSON.parse(stored);
// //         if (parsed?.name) {
// //           setParticipantName(parsed.name);
// //         }
// //       }
// //     } catch (err) {
// //       console.warn("Failed to load user identity:", err);
// //     }
// //   }, []);

// //   // Initialize meeting when token is available
// //   useEffect(() => {
// //     if (!token || initTokenRef.current === token || !hasJoined) return;

// //     const initialize = async () => {
// //       try {
// //         console.log("🎥 Initializing Dyte meeting...");
// //         initTokenRef.current = token;
        
// //         await initMeeting({
// //           authToken: token,
// //           defaults: { 
// //             audio: false, 
// //             video: false 
// //           },
// //         });

// //         console.log("✅ Meeting initialized successfully");
// //       } catch (err) {
// //         console.error("❌ Failed to initialize meeting:", err);
// //         setError(err.message || "Failed to initialize meeting");
// //       }
// //     };

// //     initialize();
// //   }, [token, initMeeting, hasJoined]);

// //   // Fetch token and join meeting
// //   const handleJoinMeeting = async () => {
// //     if (!participantName.trim()) {
// //       setError("Please enter your name");
// //       return;
// //     }

// //     if (!meetingId) {
// //       setError("Invalid meeting ID");
// //       return;
// //     }

// //     setIsLoading(true);
// //     setError(null);

// //     try {
// //       console.log("🎫 Fetching participant token for:", meetingId);

// //       const res = await fetch("http://192.168.68.112:5004/api/v1/get-participant-token", {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify({
// //           meetingId: meetingId,
// //           name: participantName.trim(),
// //           preset_name: "group_call_participant", // ✅ FIXED: Using 'preset_name' as backend expects
// //         }),
// //       });

// //       const data = await res.json();

// //       if (!res.ok) {
// //         throw new Error(data.message || "Failed to get participant token");
// //       }

// //       if (data?.data?.token) {
// //         console.log("✅ Token received successfully");
// //         setToken(data.data.token);
// //         setHasJoined(true);
// //       } else {
// //         throw new Error("Token not found in response");
// //       }
// //     } catch (err) {
// //       console.error("❌ Error fetching token:", err);
// //       setError(err.message || "Failed to join meeting");
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   };

// //   const handleLeaveMeeting = () => {
// //     try {
// //       if (meeting) {
// //         meeting.leaveRoom();
// //       }
// //     } catch (err) {
// //       console.warn("Leave error:", err);
// //     }
// //     navigate("/");
// //   };

// //   // Show meeting UI if joined and meeting is ready
// //   if (hasJoined && meeting) {
// //     return (
// //       <DyteProvider value={meeting}>
// //         <div style={{ height: "100vh", width: "100vw", position: "relative", background: "#000" }}>
// //           {/* Header with Leave Button */}
// //           <div
// //             style={{
// //               position: "absolute",
// //               top: 0,
// //               left: 0,
// //               right: 0,
// //               zIndex: 100,
// //               background: "rgba(0,0,0,0.8)",
// //               padding: "16px",
// //               display: "flex",
// //               justifyContent: "space-between",
// //               alignItems: "center",
// //             }}
// //           >
// //             <div style={{ color: "#fff" }}>
// //               <strong>Meeting:</strong> {meetingId?.slice(0, 10)}... | <strong>You:</strong> {participantName}
// //             </div>
// //             <button
// //               onClick={handleLeaveMeeting}
// //               style={{
// //                 background: "#e53e3e",
// //                 color: "#fff",
// //                 border: "none",
// //                 padding: "8px 20px",
// //                 borderRadius: "8px",
// //                 cursor: "pointer",
// //                 fontWeight: "500",
// //               }}
// //             >
// //               Leave Meeting
// //             </button>
// //           </div>

// //           {/* Dyte Meeting Component */}
// //           <DyteMeeting
// //             meeting={meeting}
// //             mode="fill"
// //             showSetupScreen={true}
// //             style={{ width: "100%", height: "100%" }}
// //           />
// //         </div>
// //       </DyteProvider>
// //     );
// //   }

// //   // Show join form
// //   return (
// //     <div
// //       style={{
// //         minHeight: "100vh",
// //         background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
// //         display: "flex",
// //         alignItems: "center",
// //         justifyContent: "center",
// //         padding: "20px",
// //       }}
// //     >
// //       <div
// //         style={{
// //           background: "#fff",
// //           borderRadius: "16px",
// //           padding: "40px",
// //           maxWidth: "450px",
// //           width: "100%",
// //           boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
// //         }}
// //       >
// //         {/* Header */}
// //         <div style={{ textAlign: "center", marginBottom: "30px" }}>
// //           <div
// //             style={{
// //               width: "64px",
// //               height: "64px",
// //               background: "#667eea",
// //               borderRadius: "50%",
// //               display: "inline-flex",
// //               alignItems: "center",
// //               justifyContent: "center",
// //               marginBottom: "16px",
// //             }}
// //           >
// //             <svg
// //               width="32"
// //               height="32"
// //               viewBox="0 0 24 24"
// //               fill="none"
// //               stroke="#fff"
// //               strokeWidth="2"
// //               strokeLinecap="round"
// //               strokeLinejoin="round"
// //             >
// //               <path d="M23 7l-7 5 7 5V7z" />
// //               <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
// //             </svg>
// //           </div>
// //           <h2 style={{ margin: 0, fontSize: "24px", color: "#2d3748" }}>Join Meeting</h2>
// //           <p style={{ margin: "8px 0 0 0", color: "#718096", fontSize: "14px" }}>
// //             Meeting ID: <strong>{meetingId?.slice(0, 10)}...</strong>
// //           </p>
// //         </div>

// //         {/* Error Message */}
// //         {error && (
// //           <div
// //             style={{
// //               background: "#fed7d7",
// //               border: "1px solid #fc8181",
// //               borderRadius: "8px",
// //               padding: "12px",
// //               marginBottom: "20px",
// //               color: "#c53030",
// //               fontSize: "14px",
// //             }}
// //           >
// //             {error}
// //           </div>
// //         )}

// //         {/* Join Form */}
// //         <div style={{ marginBottom: "20px" }}>
// //           <label
// //             style={{
// //               display: "block",
// //               marginBottom: "8px",
// //               fontWeight: "500",
// //               color: "#2d3748",
// //               fontSize: "14px",
// //             }}
// //           >
// //             Your Name *
// //           </label>
// //           <input
// //             type="text"
// //             value={participantName}
// //             onChange={(e) => setParticipantName(e.target.value)}
// //             onKeyPress={(e) => {
// //               if (e.key === "Enter" && !isLoading) {
// //                 handleJoinMeeting();
// //               }
// //             }}
// //             placeholder="Enter your name"
// //             disabled={isLoading}
// //             style={{
// //               width: "100%",
// //               padding: "12px",
// //               border: "2px solid #e2e8f0",
// //               borderRadius: "8px",
// //               fontSize: "16px",
// //               outline: "none",
// //               transition: "border 0.2s",
// //             }}
// //             onFocus={(e) => (e.target.style.borderColor = "#667eea")}
// //             onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
// //           />
// //         </div>

// //         {/* Join Button */}
// //         <button
// //           onClick={handleJoinMeeting}
// //           disabled={isLoading || !participantName.trim()}
// //           style={{
// //             width: "100%",
// //             padding: "14px",
// //             background: isLoading || !participantName.trim() ? "#cbd5e0" : "#667eea",
// //             color: "#fff",
// //             border: "none",
// //             borderRadius: "8px",
// //             fontSize: "16px",
// //             fontWeight: "600",
// //             cursor: isLoading || !participantName.trim() ? "not-allowed" : "pointer",
// //             transition: "background 0.2s",
// //           }}
// //           onMouseEnter={(e) => {
// //             if (!isLoading && participantName.trim()) {
// //               e.target.style.background = "#5568d3";
// //             }
// //           }}
// //           onMouseLeave={(e) => {
// //             if (!isLoading && participantName.trim()) {
// //               e.target.style.background = "#667eea";
// //             }
// //           }}
// //         >
// //           {isLoading ? "Joining..." : "Join Meeting"}
// //         </button>

// //         {/* Back Button */}
// //         <button
// //           onClick={() => navigate("/")}
// //           style={{
// //             width: "100%",
// //             padding: "12px",
// //             background: "transparent",
// //             color: "#718096",
// //             border: "none",
// //             borderRadius: "8px",
// //             fontSize: "14px",
// //             fontWeight: "500",
// //             cursor: "pointer",
// //             marginTop: "12px",
// //           }}
// //         >
// //           Back to Home
// //         </button>
// //       </div>
// //     </div>
// //   );
// // };

// // export default JoinMeeting;



// // import React, { useEffect, useState, useRef } from "react";
// // import { useParams, useNavigate } from "react-router-dom";
// // import { DyteMeeting } from "@dytesdk/react-ui-kit";
// // import { DyteProvider, useDyteClient } from "@dytesdk/react-web-core";

// // const JoinMeeting = () => {
// //   const { meetingId } = useParams();
// //   const navigate = useNavigate();
// //   const [token, setToken] = useState("");
// //   const [participantName, setParticipantName] = useState("");
// //   const [hasJoined, setHasJoined] = useState(false);
// //   const [isLoading, setIsLoading] = useState(false);
// //   const [error, setError] = useState(null);
// //   const [meeting, initMeeting] = useDyteClient();
// //   const initTokenRef = useRef(null);
  
// //   // ✅ NEW: Network quality state
// //   const [networkQuality, setNetworkQuality] = useState({
// //     score: 100,
// //     status: 'excellent' // excellent, good, fair, poor
// //   });

// //   // Load participant name from storage on mount
// //   useEffect(() => {
// //     try {
// //       const stored = localStorage.getItem("currentUserIdentity");
// //       if (stored) {
// //         const parsed = JSON.parse(stored);
// //         if (parsed?.name) {
// //           setParticipantName(parsed.name);
// //         }
// //       }
// //     } catch (err) {
// //       console.warn("Failed to load user identity:", err);
// //     }
// //   }, []);

// //   // Initialize meeting when token is available
// //   useEffect(() => {
// //     if (!token || initTokenRef.current === token || !hasJoined) return;

// //     const initialize = async () => {
// //       try {
// //         console.log("🎥 Initializing Dyte meeting as PARTICIPANT...");
// //         initTokenRef.current = token;
        
// //         await initMeeting({
// //           authToken: token,
// //           defaults: { 
// //             audio: false,
// //             video: false 
// //           },
// //         });

// //         console.log("✅ Participant meeting initialized successfully");
// //       } catch (err) {
// //         console.error("❌ Failed to initialize meeting:", err);
// //         setError(err.message || "Failed to initialize meeting");
// //       }
// //     };

// //     initialize();
// //   }, [token, initMeeting, hasJoined]);

// //   // ✅ NEW: Monitor network quality
// //   useEffect(() => {
// //     if (!meeting) return;

// //     // Listen for network quality updates
// //     const handleNetworkQualityUpdate = (data) => {
// //       console.log("📊 Network quality:", data);
      
// //       // Calculate status based on score
// //       let status = 'excellent';
// //       if (data.quality < 80) status = 'good';
// //       if (data.quality < 60) status = 'fair';
// //       if (data.quality < 40) status = 'poor';
      
// //       setNetworkQuality({
// //         score: data.quality,
// //         status
// //       });
// //     };

// //     // Listen for connection state changes
// //     meeting.self?.on('networkQualityUpdate', handleNetworkQualityUpdate);
    
// //     return () => {
// //       meeting.self?.off('networkQualityUpdate', handleNetworkQualityUpdate);
// //     };
// //   }, [meeting]);

// //   // Fetch PARTICIPANT token and join meeting
// //   const handleJoinMeeting = async () => {
// //     if (!participantName.trim()) {
// //       setError("Please enter your name");
// //       return;
// //     }

// //     if (!meetingId) {
// //       setError("Invalid meeting ID");
// //       return;
// //     }

// //     setIsLoading(true);
// //     setError(null);

// //     try {
// //       console.log("🎫 Fetching PARTICIPANT token for meeting:", meetingId);

// //       const res = await fetch("http://192.168.68.112:5004/api/v1/get-participant-token", {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify({
// //           meetingId: meetingId,
// //           name: participantName.trim(),
// //           preset_name: "group_call_participant",
// //         }),
// //       });

// //       const data = await res.json();

// //       if (!res.ok) {
// //         throw new Error(data.message || "Failed to get participant token");
// //       }

// //       if (data?.data?.token) {
// //         console.log("✅ PARTICIPANT token received successfully");
// //         setToken(data.data.token);
// //         setHasJoined(true);
// //       } else {
// //         throw new Error("Token not found in response");
// //       }
// //     } catch (err) {
// //       console.error("❌ Error fetching participant token:", err);
// //       setError(err.message || "Failed to join meeting");
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   };

// //   const handleLeaveMeeting = () => {
// //     try {
// //       if (meeting) {
// //         meeting.leaveRoom();
// //       }
// //     } catch (err) {
// //       console.warn("Leave error:", err);
// //     }
// //     navigate("/");
// //   };

// //   // ✅ NEW: Get network indicator color
// //   const getNetworkColor = () => {
// //     switch(networkQuality.status) {
// //       case 'excellent': return '#48bb78';
// //       case 'good': return '#38a169';
// //       case 'fair': return '#ed8936';
// //       case 'poor': return '#e53e3e';
// //       default: return '#48bb78';
// //     }
// //   };

// //   // Show meeting UI if joined and meeting is ready
// //   if (hasJoined && meeting) {
// //     return (
// //       <DyteProvider value={meeting}>
// //         <div style={{ height: "100vh", width: "100vw", position: "relative", background: "#000" }}>
// //           {/* Header with Leave Button and Network Indicator */}
// //           <div
// //             style={{
// //               position: "absolute",
// //               top: 0,
// //               left: 0,
// //               right: 0,
// //               zIndex: 100,
// //               background: "rgba(0,0,0,0.8)",
// //               padding: "16px",
// //               display: "flex",
// //               justifyContent: "space-between",
// //               alignItems: "center",
// //             }}
// //           >
// //             <div style={{ color: "#fff", fontSize: "14px", display: "flex", alignItems: "center", gap: "12px" }}>
// //               <div>
// //                 <strong>Meeting:</strong> {meetingId?.slice(0, 10)}... | 
// //                 <strong> You:</strong> {participantName}
// //               </div>
              
// //               {/* ✅ NEW: Network Quality Indicator */}
// //               <div style={{
// //                 display: "flex",
// //                 alignItems: "center",
// //                 gap: "6px",
// //                 padding: "4px 10px",
// //                 background: "rgba(255,255,255,0.1)",
// //                 borderRadius: "12px",
// //                 fontSize: "12px"
// //               }}>
// //                 <div style={{
// //                   width: "8px",
// //                   height: "8px",
// //                   borderRadius: "50%",
// //                   background: getNetworkColor(),
// //                   animation: networkQuality.status === 'poor' ? 'pulse 1.5s infinite' : 'none'
// //                 }} />
// //                 <span style={{ textTransform: "capitalize" }}>{networkQuality.status}</span>
// //               </div>
// //             </div>
            
// //             <button
// //               onClick={handleLeaveMeeting}
// //               style={{
// //                 background: "#e53e3e",
// //                 color: "#fff",
// //                 border: "none",
// //                 padding: "8px 20px",
// //                 borderRadius: "8px",
// //                 cursor: "pointer",
// //                 fontWeight: "500",
// //               }}
// //             >
// //               Leave Meeting
// //             </button>
// //           </div>

// //           {/* Dyte Meeting Component */}
// //           <DyteMeeting
// //             meeting={meeting}
// //             mode="fill"
// //             showSetupScreen={true}
// //             style={{ width: "100%", height: "100%" }}
// //           />
// //         </div>
// //       </DyteProvider>
// //     );
// //   }

// //   // Show join form
// //   return (
// //     <div
// //       style={{
// //         minHeight: "100vh",
// //         background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
// //         display: "flex",
// //         alignItems: "center",
// //         justifyContent: "center",
// //         padding: "20px",
// //       }}
// //     >
// //       <div
// //         style={{
// //           background: "#fff",
// //           borderRadius: "16px",
// //           padding: "40px",
// //           maxWidth: "450px",
// //           width: "100%",
// //           boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
// //         }}
// //       >
// //         <div style={{ textAlign: "center", marginBottom: "30px" }}>
// //           <div
// //             style={{
// //               width: "64px",
// //               height: "64px",
// //               background: "#667eea",
// //               borderRadius: "50%",
// //               display: "inline-flex",
// //               alignItems: "center",
// //               justifyContent: "center",
// //               marginBottom: "16px",
// //             }}
// //           >
// //             <svg
// //               width="32"
// //               height="32"
// //               viewBox="0 0 24 24"
// //               fill="none"
// //               stroke="#fff"
// //               strokeWidth="2"
// //               strokeLinecap="round"
// //               strokeLinejoin="round"
// //             >
// //               <path d="M23 7l-7 5 7 5V7z" />
// //               <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
// //             </svg>
// //           </div>
// //           <h2 style={{ margin: 0, fontSize: "24px", color: "#2d3748" }}>Join Meeting</h2>
// //           <p style={{ margin: "8px 0 0 0", color: "#718096", fontSize: "14px" }}>
// //             Meeting ID: <strong>{meetingId?.slice(0, 10)}...</strong>
// //           </p>
// //         </div>

// //         {error && (
// //           <div
// //             style={{
// //               background: "#fed7d7",
// //               border: "1px solid #fc8181",
// //               borderRadius: "8px",
// //               padding: "12px",
// //               marginBottom: "20px",
// //               color: "#c53030",
// //               fontSize: "14px",
// //             }}
// //           >
// //             {error}
// //           </div>
// //         )}

// //         <div style={{ marginBottom: "20px" }}>
// //           <label
// //             style={{
// //               display: "block",
// //               marginBottom: "8px",
// //               fontWeight: "500",
// //               color: "#2d3748",
// //               fontSize: "14px",
// //             }}
// //           >
// //             Your Name *
// //           </label>
// //           <input
// //             type="text"
// //             value={participantName}
// //             onChange={(e) => setParticipantName(e.target.value)}
// //             onKeyPress={(e) => {
// //               if (e.key === "Enter" && !isLoading) {
// //                 handleJoinMeeting();
// //               }
// //             }}
// //             placeholder="Enter your name"
// //             disabled={isLoading}
// //             style={{
// //               width: "100%",
// //               padding: "12px",
// //               border: "2px solid #e2e8f0",
// //               borderRadius: "8px",
// //               fontSize: "16px",
// //               outline: "none",
// //               transition: "border 0.2s",
// //             }}
// //             onFocus={(e) => (e.target.style.borderColor = "#667eea")}
// //             onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
// //           />
// //         </div>

// //         <button
// //           onClick={handleJoinMeeting}
// //           disabled={isLoading || !participantName.trim()}
// //           style={{
// //             width: "100%",
// //             padding: "14px",
// //             background: isLoading || !participantName.trim() ? "#cbd5e0" : "#667eea",
// //             color: "#fff",
// //             border: "none",
// //             borderRadius: "8px",
// //             fontSize: "16px",
// //             fontWeight: "600",
// //             cursor: isLoading || !participantName.trim() ? "not-allowed" : "pointer",
// //             transition: "background 0.2s",
// //           }}
// //         >
// //           {isLoading ? "Joining..." : "Join Meeting"}
// //         </button>

// //         <button
// //           onClick={() => navigate("/")}
// //           style={{
// //             width: "100%",
// //             padding: "12px",
// //             background: "transparent",
// //             color: "#718096",
// //             border: "none",
// //             borderRadius: "8px",
// //             fontSize: "14px",
// //             fontWeight: "500",
// //             cursor: "pointer",
// //             marginTop: "12px",
// //           }}
// //         >
// //           Back to Home
// //         </button>
// //       </div>
// //     </div>
// //   );
// // };

// // export default JoinMeeting;


// import React, { useEffect, useState, useRef, useCallback } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { DyteMeeting } from "@dytesdk/react-ui-kit";
// import { DyteProvider, useDyteClient } from "@dytesdk/react-web-core";
// import { joinExistingMeeting } from "../services/dyteService";

// const JoinMeeting = () => {
//   const { meetingId } = useParams();
//   const navigate = useNavigate();
//   const [participantName, setParticipantName] = useState("");
//   const [hasJoined, setHasJoined] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [meeting, initMeeting] = useDyteClient();
//   const initTokenRef = useRef(null);
  
//   // Network quality state
//   const [networkQuality, setNetworkQuality] = useState({
//     score: 100,
//     status: 'excellent'
//   });

//   // Load participant name from storage on mount
//   useEffect(() => {
//     try {
//       const stored = localStorage.getItem("currentUserIdentity");
//       if (stored) {
//         const parsed = JSON.parse(stored);
//         if (parsed?.name) {
//           setParticipantName(parsed.name);
//         }
//       }
//     } catch (err) {
//       console.warn("Failed to load user identity:", err);
//     }
//   }, []);

//   // Monitor network quality
//   useEffect(() => {
//     if (!meeting) return;

//     const handleNetworkQualityUpdate = (data) => {
//       console.log("📊 Network quality:", data);
      
//       let status = 'excellent';
//       if (data.quality < 80) status = 'good';
//       if (data.quality < 60) status = 'fair';
//       if (data.quality < 40) status = 'poor';
      
//       setNetworkQuality({
//         score: data.quality,
//         status
//       });
//     };

//     meeting.self?.on('networkQualityUpdate', handleNetworkQualityUpdate);
    
//     return () => {
//       meeting.self?.off('networkQualityUpdate', handleNetworkQualityUpdate);
//     };
//   }, [meeting]);

//   // Fetch PARTICIPANT token and join meeting
//   const handleJoinMeeting = useCallback(async () => {
//     if (!participantName.trim()) {
//       setError("Please enter your name");
//       return;
//     }

//     if (!meetingId) {
//       setError("Invalid meeting ID");
//       return;
//     }

//     setIsLoading(true);
//     setError(null);

//     try {
//       console.log("🎫 Fetching PARTICIPANT token for meeting:", meetingId);

//       // Use the dyteService function instead of direct fetch
//       const session = await joinExistingMeeting(
//         meetingId,
//         participantName.trim(),
//         false // Join as participant, not host
//       );

//       console.log("✅ PARTICIPANT session created:", session);

//       if (session?.authToken && initTokenRef.current !== session.authToken) {
//         initTokenRef.current = session.authToken;

//         console.log("🎥 Initializing Dyte meeting as PARTICIPANT...");

//         // Initialize meeting
//         await initMeeting({
//           authToken: session.authToken,
//           defaults: { 
//             audio: false,
//             video: false 
//           },
//         });

//         console.log("✅ Participant meeting initialized successfully");
//         setHasJoined(true);
//       } else {
//         throw new Error("Token not found in response");
//       }
//     } catch (err) {
//       console.error("❌ Error joining meeting:", err);
//       setError(err.message || "Failed to join meeting. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   }, [meetingId, participantName, initMeeting]);

//   // Leave meeting handler
//   const handleLeaveMeeting = useCallback(() => {
//     try {
//       if (meeting) {
//         console.log("👋 Leaving meeting...");
//         meeting.leaveRoom();
//       }
//     } catch (err) {
//       console.warn("Leave error:", err);
//     }
//     navigate("/");
//   }, [meeting, navigate]);

//   // Get network indicator color
//   const getNetworkColor = () => {
//     switch(networkQuality.status) {
//       case 'excellent': return '#48bb78';
//       case 'good': return '#38a169';
//       case 'fair': return '#ed8936';
//       case 'poor': return '#e53e3e';
//       default: return '#48bb78';
//     }
//   };

//   // Show meeting UI if joined and meeting is ready
//   if (hasJoined && meeting) {
//     return (
//       <DyteProvider value={meeting}>
//         <div style={{ height: "100vh", width: "100vw", position: "relative", background: "#000" }}>
//           {/* Header with Leave Button and Network Indicator */}
//           <div
//             style={{
//               position: "absolute",
//               top: 0,
//               left: 0,
//               right: 0,
//               zIndex: 100,
//               background: "rgba(0,0,0,0.8)",
//               backdropFilter: "blur(10px)",
//               padding: "16px",
//               display: "flex",
//               justifyContent: "space-between",
//               alignItems: "center",
//               borderBottom: "1px solid rgba(255,255,255,0.1)"
//             }}
//           >
//             <div style={{ 
//               color: "#fff", 
//               fontSize: "14px", 
//               display: "flex", 
//               alignItems: "center", 
//               gap: "12px" 
//             }}>
//               <div>
//                 <strong>Meeting:</strong> {meetingId?.slice(0, 10)}... | 
//                 <strong> You:</strong> {participantName}
//               </div>
              
//               {/* Network Quality Indicator */}
//               <div style={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: "6px",
//                 padding: "4px 10px",
//                 background: "rgba(255,255,255,0.1)",
//                 borderRadius: "12px",
//                 fontSize: "12px"
//               }}>
//                 <div style={{
//                   width: "8px",
//                   height: "8px",
//                   borderRadius: "50%",
//                   background: getNetworkColor(),
//                   animation: networkQuality.status === 'poor' ? 'pulse 1.5s infinite' : 'none'
//                 }} />
//                 <span style={{ textTransform: "capitalize" }}>{networkQuality.status}</span>
//               </div>
//             </div>
            
//             <button
//               onClick={handleLeaveMeeting}
//               style={{
//                 background: "#e53e3e",
//                 color: "#fff",
//                 border: "none",
//                 padding: "10px 24px",
//                 borderRadius: "8px",
//                 cursor: "pointer",
//                 fontWeight: "600",
//                 fontSize: "14px",
//                 transition: "all 0.2s",
//               }}
//               onMouseEnter={(e) => e.target.style.background = "#c53030"}
//               onMouseLeave={(e) => e.target.style.background = "#e53e3e"}
//             >
//               Leave Meeting
//             </button>
//           </div>

//           {/* Dyte Meeting Component */}
//           <DyteMeeting
//             meeting={meeting}
//             mode="fill"
//             showSetupScreen={true}
//             style={{ width: "100%", height: "100%" }}
//           />

//           {/* CSS for pulse animation */}
//           <style>{`
//             @keyframes pulse {
//               0%, 100% { opacity: 1; }
//               50% { opacity: 0.5; }
//             }
//           `}</style>
//         </div>
//       </DyteProvider>
//     );
//   }

//   // Show loading state while initializing meeting
//   if (hasJoined && !meeting) {
//     return (
//       <div style={{
//         minHeight: "100vh",
//         background: "#000",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         flexDirection: "column",
//         gap: "20px"
//       }}>
//         <div style={{
//           width: "60px",
//           height: "60px",
//           border: "4px solid rgba(102, 126, 234, 0.2)",
//           borderTop: "4px solid #667eea",
//           borderRadius: "50%",
//           animation: "spin 1s linear infinite"
//         }}></div>
//         <div style={{ color: "#fff", fontSize: "18px" }}>
//           Loading meeting...
//         </div>
//         <div style={{ color: "#888", fontSize: "14px" }}>
//           Please wait a moment
//         </div>
//         <style>{`
//           @keyframes spin {
//             0% { transform: rotate(0deg); }
//             100% { transform: rotate(360deg); }
//           }
//         `}</style>
//       </div>
//     );
//   }

//   // Show join form
//   return (
//     <div
//       style={{
//         minHeight: "100vh",
//         background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         padding: "20px",
//       }}
//     >
//       <div
//         style={{
//           background: "#fff",
//           borderRadius: "16px",
//           padding: "40px",
//           maxWidth: "450px",
//           width: "100%",
//           boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
//         }}
//       >
//         <div style={{ textAlign: "center", marginBottom: "30px" }}>
//           <div
//             style={{
//               width: "64px",
//               height: "64px",
//               background: "#667eea",
//               borderRadius: "50%",
//               display: "inline-flex",
//               alignItems: "center",
//               justifyContent: "center",
//               marginBottom: "16px",
//             }}
//           >
//             <svg
//               width="32"
//               height="32"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="#fff"
//               strokeWidth="2"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//             >
//               <path d="M23 7l-7 5 7 5V7z" />
//               <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
//             </svg>
//           </div>
//           <h2 style={{ margin: 0, fontSize: "24px", color: "#2d3748", fontWeight: "600" }}>
//             Join Meeting
//           </h2>
//           <p style={{ margin: "8px 0 0 0", color: "#718096", fontSize: "14px" }}>
//             Meeting ID: <strong>{meetingId?.slice(0, 10)}...</strong>
//           </p>
//         </div>

//         {error && (
//           <div
//             style={{
//               background: "#fed7d7",
//               border: "1px solid #fc8181",
//               borderRadius: "8px",
//               padding: "12px 16px",
//               marginBottom: "20px",
//               color: "#c53030",
//               fontSize: "14px",
//               display: "flex",
//               alignItems: "center",
//               gap: "8px"
//             }}
//           >
//             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//               <circle cx="12" cy="12" r="10"/>
//               <line x1="12" y1="8" x2="12" y2="12"/>
//               <line x1="12" y1="16" x2="12.01" y2="16"/>
//             </svg>
//             {error}
//           </div>
//         )}

//         <div style={{ marginBottom: "20px" }}>
//           <label
//             style={{
//               display: "block",
//               marginBottom: "8px",
//               fontWeight: "500",
//               color: "#2d3748",
//               fontSize: "14px",
//             }}
//           >
//             Your Name <span style={{ color: "#e53e3e" }}>*</span>
//           </label>
//           <input
//             type="text"
//             value={participantName}
//             onChange={(e) => setParticipantName(e.target.value)}
//             onKeyPress={(e) => {
//               if (e.key === "Enter" && !isLoading && participantName.trim()) {
//                 handleJoinMeeting();
//               }
//             }}
//             placeholder="Enter your name"
//             disabled={isLoading}
//             style={{
//               width: "100%",
//               padding: "12px",
//               border: "2px solid #e2e8f0",
//               borderRadius: "8px",
//               fontSize: "16px",
//               outline: "none",
//               transition: "border 0.2s",
//               boxSizing: "border-box"
//             }}
//             onFocus={(e) => (e.target.style.borderColor = "#667eea")}
//             onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
//           />
//         </div>

//         <button
//           onClick={handleJoinMeeting}
//           disabled={isLoading || !participantName.trim()}
//           style={{
//             width: "100%",
//             padding: "14px",
//             background: isLoading || !participantName.trim() ? "#cbd5e0" : "#667eea",
//             color: "#fff",
//             border: "none",
//             borderRadius: "8px",
//             fontSize: "16px",
//             fontWeight: "600",
//             cursor: isLoading || !participantName.trim() ? "not-allowed" : "pointer",
//             transition: "background 0.2s",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             gap: "8px"
//           }}
//           onMouseEnter={(e) => {
//             if (!isLoading && participantName.trim()) {
//               e.target.style.background = "#5568d3";
//             }
//           }}
//           onMouseLeave={(e) => {
//             if (!isLoading && participantName.trim()) {
//               e.target.style.background = "#667eea";
//             }
//           }}
//         >
//           {isLoading ? (
//             <>
//               <div style={{
//                 width: "16px",
//                 height: "16px",
//                 border: "2px solid rgba(255,255,255,0.3)",
//                 borderTop: "2px solid #fff",
//                 borderRadius: "50%",
//                 animation: "spin 0.8s linear infinite"
//               }}></div>
//               Joining...
//             </>
//           ) : (
//             <>
//               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                 <path d="M23 7l-7 5 7 5V7z"/>
//                 <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
//               </svg>
//               Join Meeting
//             </>
//           )}
//         </button>

//         <button
//           onClick={() => navigate("/")}
//           disabled={isLoading}
//           style={{
//             width: "100%",
//             padding: "12px",
//             background: "transparent",
//             color: "#718096",
//             border: "none",
//             borderRadius: "8px",
//             fontSize: "14px",
//             fontWeight: "500",
//             cursor: isLoading ? "not-allowed" : "pointer",
//             marginTop: "12px",
//             transition: "color 0.2s"
//           }}
//           onMouseEnter={(e) => !isLoading && (e.target.style.color = "#2d3748")}
//           onMouseLeave={(e) => (e.target.style.color = "#718096")}
//         >
//           Back to Home
//         </button>

//         <style>{`
//           @keyframes spin {
//             0% { transform: rotate(0deg); }
//             100% { transform: rotate(360deg); }
//           }
//         `}</style>
//       </div>
//     </div>
//   );
// };

// export default JoinMeeting;



// // JoinMeeting.jsx
// import React, { useEffect, useState } from 'react';
// import { getParticipantToken } from '../services/dyteService';
// // NOTE: this assumes you have included Dyte client SDK in your project
// // Example using window.DYTE or a React wrapper; replace with actual Dyte init API.
// export default function JoinMeeting({ location }) {
//   const params = new URLSearchParams(location.search);
//   const meetingId = params.get('room');
//   const role = params.get('role') || 'participant'; // 'host' or 'participant'
//   const [name, setName] = useState('');
//   const [tokenData, setTokenData] = useState(null);
//   const [loading, setLoading] = useState(false);
//   useEffect(() => {
//     // If role=host we already created host participant at meeting creation,
//     // but in some flows you might still request a fresh token.
//   }, []);
//   const join = async () => {
//     if (!meetingId) return alert('No meeting specified');
//     setLoading(true);
//     try {
//       const preset = role === 'host' ? 'group_call_host' : 'group_call_participant';
//       const resp = await getParticipantToken({ meetingId, name: name || (role==='host' ? 'Host' : 'Guest'), preset_name: preset });
//       if (!resp?.success) {
//         alert('Failed to get token: ' + JSON.stringify(resp));
//         setLoading(false);
//         return;
//       }
//       const data = resp.data; // should include token & participant info
//       console.log(resp,"resp--");
      
//       setTokenData(data);
//       // Launch Dyte meeting UI — the exact method depends on SDK version.
//       // Example pseudo-code:
//       if (window.DYTE && data?.auth_token) {
//         // pseudo-init:
//         window.DYTE.init({ authToken: data.auth_token, meetingId });
//       } else if (data?.token) {
//         // another variant
//         window.DYTE.init({ token: data.token, meetingId });
//       } else {
//         // You might need to use participant id + token fields; check Dyte SDK you're using
//         console.log('Token data:', data);
//         alert('Token received, now initialize Dyte SDK with data: ' + JSON.stringify(data));
//       }
//     } catch (err) {
//       console.error(err);
//       alert('Error joining meeting');
//     } finally {
//       setLoading(false);
//     }
//   };
//   return (
//     <div>
//       <h2>Join Meeting: {meetingId}</h2>
//       <input placeholder="Your name" value={name} onChange={e => setName(e.target.value)} />
//       <button onClick={join} disabled={loading}>{loading ? 'Joining...' : 'Join'}</button>
//       <pre>{tokenData && JSON.stringify(tokenData, null, 2)}</pre>
//     </div>
//   );
// }







// import { useState } from "react";
// import { getParticipantToken } from "../services/dyteService";
// export default function JoinMeeting() {
//   const params = new URLSearchParams(window.location.search);
//   const meetingId = params.get("room");
//   const role = params.get("role");
//   const [name, setName] = useState("");
//   const join = async () => {
//     const preset = role === "host" ? "group_call_host" : "group_call_participant";
//     const resp = await getParticipantToken({
//       meetingId,
//       name,
//       preset_name: preset,
//     });
//     console.log("Dyte response:", resp);
//     //const data = resp.data;
//     const token =
//      resp?.data?.auth_token || resp?.data?.token;
//     if (!token) return alert("No valid Dyte token found");
//     window.Dyte.init({
//       authToken: token,
//       roomName: meetingId,
//     });
//   };
//   return (
//     <div>
//       <h2>Join Meeting {meetingId}</h2>
//       <input placeholder="Your name" onChange={(e) => setName(e.target.value)} />
//       <button onClick={join}>Join</button>
//     </div>
//   );
// }


// import { useState } from "react";
// import { getParticipantToken } from "../services/dyteService";
// export default function JoinMeeting() {
//   const params = new URLSearchParams(window.location.search);
//   const meetingId = params.get("room");
//   const role = params.get("role");
//   const [name, setName] = useState("");
//   const join = async () => {
//     const preset =
//       role === "host" ? "group_call_host" : "group_call_participant";
//     const resp = await getParticipantToken({
//       meetingId,
//       name,
//       preset_name: preset,
//     });
//     console.log("Dyte response:", resp);
//     const token = resp?.data?.token;
//     if (!token) return alert("No valid Dyte token found");
//     // :fire: Check SDK exists
//     if (!window.Dyte) {
//       console.error("Dyte SDK missing");
//       return alert("Dyte SDK not loaded. Add <script src='https://cdn.dyte.io/v1.31.0/dyte.js'></script>");
//     }
//     // :fire: INIT WORKS ONLY WITH THE RIGHT SDK
//     window.Dyte.init({
//       authToken: token,
//       roomName: meetingId,
//     });
//   };
//   return (
//     <div>
//       <h2>Join Meeting {meetingId}</h2>
//       <input
//         placeholder="Your name"
//         onChange={(e) => setName(e.target.value)}

import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { DyteMeeting } from "@dytesdk/react-ui-kit";
import { DyteProvider, useDyteClient } from "@dytesdk/react-web-core";
import { getParticipantToken } from "../services/dyteService";

const JoinMeeting = () => {
  const params = useParams();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const pathId = params.meetingId;
  const queryId = query.get("room");
  const meetingId = pathId || queryId;
  const navigate = useNavigate();
  const [participantName, setParticipantName] = useState("");
  const [hasJoined, setHasJoined] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [meeting, initMeeting] = useDyteClient();
  const meetingRef = useRef(null);
  const initTokenRef = useRef(null);

  // Network quality state
  const [networkQuality, setNetworkQuality] = useState({
    score: 100,
    status: "excellent",
  });

  useEffect(() => {
    if (meeting) {
      meetingRef.current = meeting;
    }
  }, [meeting]);

  // Load participant name from storage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("currentUserIdentity");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.name) {
          setParticipantName(parsed.name);
        }
      }
    } catch (err) {
      console.warn("Failed to load user identity:", err);
    }
  }, []);

  // Monitor network quality
  useEffect(() => {
    if (!meeting) return;

    const handleNetworkQualityUpdate = (data) => {
      console.log("📊 Network quality:", data);
      
      let status = 'excellent';
      if (data.quality < 80) status = 'good';
      if (data.quality < 60) status = 'fair';
      if (data.quality < 40) status = 'poor';
      
      setNetworkQuality({
        score: data.quality,
        status
      });
    };

    meeting.self?.on('networkQualityUpdate', handleNetworkQualityUpdate);
    
    return () => {
      meeting.self?.off('networkQualityUpdate', handleNetworkQualityUpdate);
    };
  }, [meeting]);

  // Fetch PARTICIPANT token and join meeting
  const handleJoinMeeting = useCallback(async () => {
    if (!participantName.trim()) {
      setError("Please enter your name");
      return;
    }

    if (!meetingId) {
      setError("Invalid meeting ID");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log("🎫 Fetching PARTICIPANT token for meeting:", meetingId);

      const session = await getParticipantToken({
        meetingId,
        name: participantName.trim(),
      });

      if (!session?.authToken) {
        throw new Error("Token not found in response");
      }

      if (initTokenRef.current === session.authToken) {
        setHasJoined(true);
        return;
      }

      initTokenRef.current = session.authToken;

      console.log("🎥 Initializing Dyte meeting as PARTICIPANT...");
      const meetingInstance = await initMeeting({
        authToken: session.authToken,
        defaults: {
          audio: false,
          video: false,
        },
        setupScreen: true,
        showSetupScreen: true,
      });

      if (!meetingInstance) {
        throw new Error("Dyte meeting failed to initialize");
      }

      setHasJoined(true);
    } catch (err) {
      console.error("❌ Error joining meeting:", err);
      setError(err.message || "Failed to join meeting. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [meetingId, participantName, initMeeting]);

  // Leave meeting handler
  const handleLeaveMeeting = useCallback(() => {
    try {
      const client = meetingRef.current || meeting;
      if (client) {
        console.log("👋 Leaving meeting...");
        client.leaveRoom();
      }
    } catch (err) {
      console.warn("Leave error:", err);
    }
    navigate("/");
  }, [meeting, navigate]);

  // Get network indicator color
  const getNetworkColor = () => {
    switch(networkQuality.status) {
      case 'excellent': return '#48bb78';
      case 'good': return '#38a169';
      case 'fair': return '#ed8936';
      case 'poor': return '#e53e3e';
      default: return '#48bb78';
    }
  };

  // Show meeting UI if joined and meeting is ready
  if (hasJoined && meeting?.self?.roomJoined) {
    return (
      <DyteProvider value={meeting}>
        <div style={{ height: "100vh", width: "100vw", position: "relative", background: "#000" }}>
          {/* Header with Leave Button and Network Indicator */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              zIndex: 100,
              background: "rgba(0,0,0,0.8)",
              backdropFilter: "blur(10px)",
              padding: "16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: "1px solid rgba(255,255,255,0.1)"
            }}
          >
            <div style={{ 
              color: "#fff", 
              fontSize: "14px", 
              display: "flex", 
              alignItems: "center", 
              gap: "12px" 
            }}>
              <div>
                <strong>Meeting:</strong> {meetingId?.slice(0, 10)}... | 
                <strong> You:</strong> {participantName}
              </div>
              
              {/* Network Quality Indicator */}
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "4px 10px",
                background: "rgba(255,255,255,0.1)",
                borderRadius: "12px",
                fontSize: "12px"
              }}>
                <div style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: getNetworkColor(),
                  animation: networkQuality.status === 'poor' ? 'pulse 1.5s infinite' : 'none'
                }} />
                <span style={{ textTransform: "capitalize" }}>{networkQuality.status}</span>
              </div>
            </div>
            
            <button
              onClick={handleLeaveMeeting}
              style={{
                background: "#e53e3e",
                color: "#fff",
                border: "none",
                padding: "10px 24px",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "14px",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => e.target.style.background = "#c53030"}
              onMouseLeave={(e) => e.target.style.background = "#e53e3e"}
            >
              Leave Meeting
            </button>
          </div>

          {/* Dyte Meeting Component */}
          <DyteMeeting
            meeting={meeting}
            mode="fill"
            showSetupScreen={true}
            style={{ width: "100%", height: "100%" }}
          />

          {/* CSS for pulse animation */}
          <style>{`
            @keyframes pulse {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.5; }
            }
          `}</style>
        </div>
      </DyteProvider>
    );
  }

  // Show loading state while initializing meeting
  if (hasJoined && !meeting?.self?.roomJoined) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "#000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: "20px"
      }}>
        <div style={{
          width: "60px",
          height: "60px",
          border: "4px solid rgba(102, 126, 234, 0.2)",
          borderTop: "4px solid #667eea",
          borderRadius: "50%",
          animation: "spin 1s linear infinite"
        }}></div>
        <div style={{ color: "#fff", fontSize: "18px" }}>
          Loading meeting...
        </div>
        <div style={{ color: "#888", fontSize: "14px" }}>
          Please wait a moment
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Show join form
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "16px",
          padding: "40px",
          maxWidth: "450px",
          width: "100%",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <div
            style={{
              width: "64px",
              height: "64px",
              background: "#667eea",
              borderRadius: "50%",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "16px",
            }}
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M23 7l-7 5 7 5V7z" />
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
            </svg>
          </div>
          <h2 style={{ margin: 0, fontSize: "24px", color: "#2d3748", fontWeight: "600" }}>
            Join Meeting
          </h2>
          <p style={{ margin: "8px 0 0 0", color: "#718096", fontSize: "14px" }}>
            Meeting ID: <strong>{meetingId?.slice(0, 10)}...</strong>
          </p>
        </div>

        {error && (
          <div
            style={{
              background: "#fed7d7",
              border: "1px solid #fc8181",
              borderRadius: "8px",
              padding: "12px 16px",
              marginBottom: "20px",
              color: "#c53030",
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {error}
          </div>
        )}

        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "500",
              color: "#2d3748",
              fontSize: "14px",
            }}
          >
            Your Name <span style={{ color: "#e53e3e" }}>*</span>
          </label>
          <input
            type="text"
            value={participantName}
            onChange={(e) => setParticipantName(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter" && !isLoading && participantName.trim()) {
                handleJoinMeeting();
              }
            }}
            placeholder="Enter your name"
            disabled={isLoading}
            style={{
              width: "100%",
              padding: "12px",
              border: "2px solid #e2e8f0",
              borderRadius: "8px",
              fontSize: "16px",
              outline: "none",
              transition: "border 0.2s",
              boxSizing: "border-box"
            }}
            onFocus={(e) => (e.target.style.borderColor = "#667eea")}
            onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
          />
        </div>

        <button
          onClick={handleJoinMeeting}
          disabled={isLoading || !participantName.trim()}
          style={{
            width: "100%",
            padding: "14px",
            background: isLoading || !participantName.trim() ? "#cbd5e0" : "#667eea",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: "600",
            cursor: isLoading || !participantName.trim() ? "not-allowed" : "pointer",
            transition: "background 0.2s",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px"
          }}
          onMouseEnter={(e) => {
            if (!isLoading && participantName.trim()) {
              e.target.style.background = "#5568d3";
            }
          }}
          onMouseLeave={(e) => {
            if (!isLoading && participantName.trim()) {
              e.target.style.background = "#667eea";
            }
          }}
        >
          {isLoading ? (
            <>
              <div style={{
                width: "16px",
                height: "16px",
                border: "2px solid rgba(255,255,255,0.3)",
                borderTop: "2px solid #fff",
                borderRadius: "50%",
                animation: "spin 0.8s linear infinite"
              }}></div>
              Joining...
            </>
          ) : (
            <>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M23 7l-7 5 7 5V7z"/>
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
              </svg>
              Join Meeting
            </>
          )}
        </button>

        <button
          onClick={() => navigate("/")}
          disabled={isLoading}
          style={{
            width: "100%",
            padding: "12px",
            background: "transparent",
            color: "#718096",
            border: "none",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: "500",
            cursor: isLoading ? "not-allowed" : "pointer",
            marginTop: "12px",
            transition: "color 0.2s"
          }}
          onMouseEnter={(e) => !isLoading && (e.target.style.color = "#2d3748")}
          onMouseLeave={(e) => (e.target.style.color = "#718096")}
        >
          Back to Home
        </button>

        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
};

export default JoinMeeting;
