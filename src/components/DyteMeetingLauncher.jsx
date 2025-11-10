// import { useCallback, useEffect, useMemo, useState } from 'react';
// import {
//   Box,
//   Button,
//   Center,
//   Flex,
//   Modal,
//   ModalBody,
//   ModalCloseButton,
//   ModalContent,
//   ModalFooter,
//   ModalHeader,
//   ModalOverlay,
//   Spinner,
//   Text,
//   useDisclosure,
//   useToast,
//   VStack,
//   HStack,
//   Avatar,
//   AvatarGroup,
//   IconButton,
//   Tooltip,
//   Menu,
//   MenuButton,
//   MenuList,
//   MenuItem,
//   useClipboard,
// } from '@chakra-ui/react';
// import { AlertCircle, Video, Users, Mic, Camera, Share2, PhoneOff, Copy, ExternalLink } from 'lucide-react';
// import { DyteMeeting } from '@dytesdk/react-ui-kit';
// import { DyteProvider, useDyteClient } from '@dytesdk/react-web-core';
// import { requestDyteSession } from '../services/dyteService';
// import { toPng } from 'html-to-image';

// const DyteMeetingLauncher = ({
//   buttonClassName = 'editor-navbar__icon-btn',
//   participantName,
//   meetingTitle,
//   meetingPreset = 'group_call_host',
// }) => {
//   const toast = useToast();
//   const { isOpen, onOpen, onClose } = useDisclosure();
//   const [isLoading, setIsLoading] = useState(false);
//   const [authToken, setAuthToken] = useState(null);
//   const [meetingInfo, setMeetingInfo] = useState(null);
//   const [error, setError] = useState(null);
//   const [meeting, initMeeting] = useDyteClient();
//   const [meetingUrl, setMeetingUrl] = useState('');
//   const [isScreenSharing, setIsScreenSharing] = useState(false);
//   const { onCopy, hasCopied } = useClipboard('');

//   // ✅ Reset state only when leaving manually
//   const resetState = useCallback(() => {
//     setAuthToken(null);
//     setMeetingInfo(null);
//     setError(null);
//   }, []);

//   // ✅ Resolve participant name safely
//   const safeParticipantName = useMemo(() => {
//     if (participantName && participantName.trim()) return participantName.trim();
//     try {
//       const stored = localStorage.getItem('currentUserIdentity');
//       if (stored) {
//         const parsed = JSON.parse(stored);
//         if (parsed?.name) return parsed.name;
//       }
//     } catch {}
//     return 'InnoIDE User';
//   }, [participantName]);

//   // ✅ Initialize Dyte meeting when token is ready and modal is open
//   useEffect(() => {
//     if (!authToken || !isOpen) return;

//     let mounted = true;
//     const loadMeeting = async () => {
//       try {
//         console.log('🔹 Initializing Dyte meeting...');
//         const instance = await initMeeting({
//           authToken,
//           defaults: { audio: true, video: true },
//           videoEnabled: true,
//           audioEnabled: true,
//           setupScreen: true, // Add setup screen
//           showSetupScreen: true,
//         });

//         if (mounted) {
//           console.log('✅ Dyte meeting initialized:', instance);
//         }
//       } catch (err) {
//         console.error('❌ Dyte Init Error:', err);
//         if (mounted) setError(err.message || 'Failed to initialize Dyte meeting.');
//       }
//     };

//     loadMeeting();
//     return () => {
//       // ❌ Do NOT auto-leave here — handled manually
//       mounted = false;
//     };
//   }, [authToken, initMeeting, isOpen]);

//   // ✅ Handle creating or joining meeting
//   const handleLaunch = useCallback(async () => {
//     setError(null);
//     if (!isOpen) onOpen();
//     if (authToken) return;

//     try {
//       setIsLoading(true);

//       const session = await requestDyteSession({
//         title: meetingTitle,
//         participantName: safeParticipantName,
//         meetingPreset: meetingPreset || 'group_call_host',
//         clientId: `user_${Date.now()}`,
//       });

//       console.log('✅ Dyte session created:', session);

//       if (session?.authToken) {
//         setAuthToken(session.authToken);
//         setMeetingInfo({
//           id: session.meetingId || session.data?.id,
//           title: meetingTitle || session.meetingTitle,
//         });

//         toast({
//           title: 'Meeting Ready',
//           description: `Joining ${meetingTitle || 'session'}...`,
//           status: 'success',
//           duration: 3000,
//           isClosable: true,
//         });
//       } else {
//         throw new Error('No authToken returned from Dyte API');
//       }
//     } catch (apiError) {
//       const message = apiError?.message || 'Failed to start Dyte meeting.';
//       setError(message);
//       toast({
//         title: 'Dyte Error',
//         description: message,
//         status: 'error',
//         duration: 5000,
//         isClosable: true,
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   }, [authToken, meetingPreset, meetingTitle, safeParticipantName, toast, isOpen, onOpen]);

//   // ✅ Leave meeting only when user clicks "Leave"
//   const handleClose = useCallback(() => {
//     try {
//       if (meeting && typeof meeting.leaveRoom === 'function') {
//         meeting.leaveRoom();
//         console.log('👋 Left Dyte meeting');
//       }
//     } catch (e) {
//       console.warn('LeaveRoom error:', e);
//     }
//     resetState();
//     onClose();
//   }, [meeting, onClose, resetState]);

//   // Add this after meeting initialization
//   useEffect(() => {
//     if (meetingInfo?.id) {
//       const link = `${window.location.origin}/join/${meetingInfo.id}`;
//       setMeetingUrl(link);
//     }
//   }, [meetingInfo]);

//   // Handle screen sharing
//   const handleScreenShare = useCallback(async () => {
//     if (!meeting) return;

//     try {
//       if (isScreenSharing) {
//         await meeting.self.disableScreenShare();
//         setIsScreenSharing(false);
//       } else {
//         await meeting.self.enableScreenShare();
//         setIsScreenSharing(true);
//       }
//     } catch (error) {
//       toast({
//         title: 'Screen sharing error',
//         description: error.message || 'Failed to toggle screen sharing',
//         status: 'error',
//         duration: 3000,
//       });
//     }
//   }, [meeting, isScreenSharing]);

//   // Generate and copy invite link
//   const handleCopyInvite = useCallback(() => {
//     const baseUrl = window.location.origin;
//     const inviteUrl = `${baseUrl}/join/${meetingInfo?.id}`;
//     setMeetingUrl(inviteUrl);
//     onCopy(inviteUrl);
//     toast({
//       title: 'Invite link copied',
//       description: 'Meeting link copied to clipboard',
//       status: 'success',
//       duration: 2000,
//     });
//   }, [meetingInfo?.id, onCopy]);

//   return (
//     <>
//       <Tooltip label="Start video meeting" hasArrow placement="bottom">
//         <IconButton
//           aria-label="Start meeting"
//           icon={isLoading ? <Spinner size="sm" /> : <Video size={20} />}
//           onClick={handleLaunch}
//           isDisabled={isLoading}
//           colorScheme="blue"
//           variant="ghost"
//           rounded="full"
//           size="lg"
//         />
//       </Tooltip>

//       <Modal
//         isOpen={isOpen}
//         onClose={handleClose}
//         size="full"
//         isCentered
//         motionPreset="slideInBottom"
//         closeOnOverlayClick={false}
//       >
//         <ModalOverlay backdropFilter="blur(8px)" />
//         <ModalContent bg="#0a0f1c" maxW="100vw" maxH="100vh" m={0}>
//           <ModalHeader
//             p={4}
//             borderBottom="1px solid rgba(255,255,255,0.1)"
//             bg="#111827"
//             display="flex"
//             alignItems="center"
//             justifyContent="space-between"
//           >
//             <Text fontSize="lg" fontWeight="500">
//               {meetingInfo?.title || meetingTitle || 'New Meeting'}
//             </Text>
//             <HStack spacing={4}>
//               <Text fontSize="sm" color="gray.400">
//                 {meetingInfo?.id && `Meeting ID: ${meetingInfo.id.slice(0, 8)}...`}
//               </Text>
//               <AvatarGroup size="sm" max={3}>
//                 <Avatar name={safeParticipantName} bg="blue.500" color="white" />
//               </AvatarGroup>
//             </HStack>
//           </ModalHeader>

//           <ModalBody p={0} position="relative" h="calc(100vh - 140px)">
//             {error ? (
//               <Center flexDir="column" h="100%">
//                 <VStack spacing={6}>
//                   <AlertCircle size={48} color="#f87171" />
//                   <Box>
//                     <Text fontSize="xl" fontWeight="500">
//                       Unable to join meeting
//                     </Text>
//                     <Text mt={2} color="gray.400">
//                       {error}
//                     </Text>
//                   </Box>
//                   <Button leftIcon={<Video size={16} />} onClick={handleLaunch} colorScheme="blue" size="lg">
//                     Try Again
//                   </Button>
//                 </VStack>
//               </Center>
//             ) : !authToken ? (
//               <Center h="100%">
//                 <VStack spacing={6}>
//                   <Spinner size="xl" color="blue.400" />
//                   <Text fontSize="lg" color="white">
//                     Setting up your meeting...
//                   </Text>
//                   <Text fontSize="sm" color="gray.400">
//                     Please wait a moment
//                   </Text>
//                 </VStack>
//               </Center>
//             ) : meeting && (
//               <Box position="relative" h="full" bg="#000">
//                 <DyteProvider value={meeting}>
//                   <DyteMeeting
//                     mode="fill"
//                     meeting={meeting}
//                     showSetupScreen
//                     style={{
//                       width: '100%',
//                       height: '100%',
//                       // Fix video display
//                       '& video': {
//                         objectFit: 'contain',
//                         background: '#000',
//                       },
//                       // Fix screen share
//                       '& .dyte-screen-share': {
//                         objectFit: 'contain',
//                         maxHeight: '100%',
//                       }
//                     }}
//                   />
//                 </DyteProvider>
//               </Box>
//             )}
//           </ModalBody>

//           <ModalFooter
//             position="fixed"
//             bottom={0}
//             width="100%"
//             py={6}
//             bg="rgba(17,24,39,0.95)"
//             backdropFilter="blur(12px)"
//             borderTop="1px solid rgba(255,255,255,0.1)"
//             zIndex={10}
//           >
//             <Flex w="100%" justify="space-between" align="center">
//               <HStack spacing={2}>
//                 <IconButton aria-label="Toggle mic" icon={<Mic size={20} />} variant="ghost" colorScheme="whiteAlpha" rounded="full" />
//                 <IconButton aria-label="Toggle camera" icon={<Camera size={20} />} variant="ghost" colorScheme="whiteAlpha" rounded="full" />
//                 <IconButton
//                   aria-label="Share screen"
//                   icon={<Share2 size={20} />}
//                   onClick={handleScreenShare}
//                   variant="ghost"
//                   colorScheme={isScreenSharing ? "blue" : "whiteAlpha"}
//                   rounded="full"
//                 />
//                 <Button
//                   leftIcon={<Share2 size={16} />}
//                   onClick={handleCopyInvite}
//                   variant="outline"
//                   size="sm"
//                   colorScheme="whiteAlpha"
//                 >
//                   {hasCopied ? 'Copied!' : 'Copy invite link'}
//                 </Button>
//               </HStack>

//               <Button
//                 leftIcon={<PhoneOff size={16} />}
//                 onClick={handleClose}
//                 colorScheme="red"
//                 size="lg"
//                 rounded="full"
//                 px={8}
//               >
//                 Leave Meeting
//               </Button>

//               <IconButton aria-label="Show participants" icon={<Users size={20} />} variant="ghost" colorScheme="whiteAlpha" rounded="full" />
//             </Flex>
//           </ModalFooter>
//         </ModalContent>
//       </Modal>
//     </>
//   );
// };

// export default DyteMeetingLauncher;


//08-11-25 

// import React, { useCallback, useEffect, useMemo, useState } from 'react';
// import { DyteMeeting } from '@dytesdk/react-ui-kit';
// import { DyteProvider, useDyteClient } from '@dytesdk/react-web-core';
// import {
//   Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay,
//   Center, Spinner, Text, HStack, Avatar, AvatarGroup, Button, IconButton, Tooltip, useDisclosure, useToast, VStack, Flex, Box, useClipboard,
// } from '@chakra-ui/react';
// import { AlertCircle, Video, Users, Mic, Camera, Share2, PhoneOff } from 'lucide-react';
// import { requestDyteSession } from '../services/dyteService';

// // Change to your actual logo path!
// const LOGO_SRC = '/assets/logo.png';

// const DyteMeetingLauncher = ({
//   buttonClassName = 'editor-navbar__icon-btn',
//   participantName,
//   meetingTitle = 'New Meeting',
// }) => {
//   const toast = useToast();
//   const { isOpen, onOpen, onClose } = useDisclosure();
//   const [isLoading, setIsLoading] = useState(false);
//   const [authToken, setAuthToken] = useState(null);
//   const [meetingInfo, setMeetingInfo] = useState(null);
//   const [error, setError] = useState(null);
//   const [meeting, initMeeting, leaveMeeting] = useDyteClient();
//   const [isScreenSharing, setIsScreenSharing] = useState(false);
//   const { onCopy, hasCopied, setValue: setClipboardValue } = useClipboard('');

//   const resetState = useCallback(() => {
//     setAuthToken(null);
//     setMeetingInfo(null);
//     setError(null);
//     setIsScreenSharing(false);
//   }, []);

//   const safeParticipantName = useMemo(() => {
//     if (participantName && participantName.trim()) return participantName.trim();
//     try {
//       const stored = localStorage.getItem('currentUserIdentity');
//       if (stored) {
//         const parsed = JSON.parse(stored);
//         if (parsed?.name) return parsed.name;
//       }
//     } catch {}
//     return 'Host User';
//   }, [participantName]);

//   useEffect(() => {
//     if (!authToken || !isOpen) return;
//     let mounted = true;
//     const loadMeeting = async () => {
//       try {
//         await initMeeting({
//           authToken,
//           defaults: { audio: true, video: true, screenShare: { displaySurface: 'window' } },
//           videoEnabled: true,
//           audioEnabled: true,
//           setupScreen: true,
//           showSetupScreen: true,
//         });
//       } catch (err) {
//         if (mounted) setError(err.message || 'Failed to initialize Dyte meeting.');
//       }
//     };
//     loadMeeting();
//     return () => { mounted = false; };
//   }, [authToken, initMeeting, isOpen]);

//   useEffect(() => {
//     if (!meeting) return;
//     const onScreenShareUpdate = ({ screenShareEnabled }) => setIsScreenSharing(screenShareEnabled);
//     meeting.self.on('screenShareUpdate', onScreenShareUpdate);
//     return () => meeting.self.off('screenShareUpdate', onScreenShareUpdate);
//   }, [meeting]);

//   const handleLaunch = useCallback(async () => {
//     setError(null);
//     if (!isOpen) onOpen();
//     if (authToken) return;
//     try {
//       setIsLoading(true);
//       const session = await requestDyteSession({
//         title: meetingTitle,
//         participantName: safeParticipantName,
//         meetingPreset: 'group_call_host',
//         clientId: `host_${Date.now()}`,
//       });
//       if (session?.authToken) {
//         setAuthToken(session.authToken);
//         setMeetingInfo({
//           id: session.meetingId || session.data?.id,
//           title: session.meetingTitle || meetingTitle,
//         });
//         toast({
//           title: 'Meeting Ready',
//           description: `Joining ${session.meetingTitle || meetingTitle}...`,
//           status: 'success',
//           duration: 3000,
//           isClosable: true,
//         });
//       } else {
//         throw new Error('No authToken returned from Dyte API');
//       }
//     } catch (apiError) {
//       setError(apiError?.message || 'Failed to start Dyte meeting.');
//       toast({
//         title: 'Dyte Error',
//         description: apiError?.message || 'Failed to start Dyte meeting.',
//         status: 'error',
//         duration: 5000,
//         isClosable: true,
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   }, [authToken, meetingTitle, safeParticipantName, toast, isOpen, onOpen]);

//   const handleClose = useCallback(() => {
//     try { if (meeting && typeof leaveMeeting === 'function') leaveMeeting(); }
//     catch (e) { console.warn('Leave error:', e); }
//     resetState();
//     onClose();
//   }, [leaveMeeting, meeting, onClose, resetState]);

//   const handleCopyInvite = useCallback(() => {
//     if (!meetingInfo?.id) return;
//     const inviteUrl = `${window.location.origin}/join/${meetingInfo.id}`;
//     setClipboardValue(inviteUrl);
//     onCopy();
//     toast({
//       title: 'Invite link copied',
//       description: 'Meeting link copied to clipboard',
//       status: 'success',
//       duration: 2000,
//     });
//   }, [meetingInfo?.id, onCopy, setClipboardValue, toast]);

//   const handleScreenShare = useCallback(async () => {
//     if (!meeting) return;
//     try {
//       if (isScreenSharing) {
//         await meeting.self.disableScreenShare();
//         setIsScreenSharing(false);
//       } else {
//         await meeting.self.enableScreenShare({ displaySurface: 'window' });
//         setIsScreenSharing(true);
//       }
//     } catch (error) {
//       toast({
//         title: 'Screen sharing error',
//         description: error.message || 'Failed to toggle screen sharing',
//         status: 'error',
//         duration: 3000,
//       });
//     }
//   }, [meeting, isScreenSharing, toast]);

//   return (
//     <>
//       <Tooltip label="Start video meeting" hasArrow placement="bottom">
//         <IconButton
//           aria-label="Start meeting"
//           icon={isLoading ? <Spinner size="sm" /> : <Video size={20} />}
//           onClick={handleLaunch}
//           isDisabled={isLoading}
//           colorScheme="blue"
//           variant="ghost"
//           rounded="full"
//           size="lg"
//           className={buttonClassName}
//         />
//       </Tooltip>
//       <Modal isOpen={isOpen} onClose={handleClose} size="full" isCentered motionPreset="slideInBottom" closeOnOverlayClick={false}>
//         <ModalOverlay backdropFilter="blur(8px)" />
//         <ModalContent bg="#0a0f1c" maxW="100vw" maxH="100vh" m={0}>
//           <ModalHeader p={4} borderBottom="1px solid rgba(255,255,255,0.1)" bg="#111827" display="flex" alignItems="center" justifyContent="space-between">
//             <Text fontSize="lg" fontWeight="500">
//               {meetingInfo?.title || meetingTitle}
//             </Text>
//             <HStack spacing={4}>
//               <Text fontSize="sm" color="gray.400">
//                 {meetingInfo?.id && `Meeting ID: ${meetingInfo.id.slice(0, 8)}...`}
//               </Text>
//               <AvatarGroup size="sm" max={3}>
//                 <Avatar name={safeParticipantName} bg="blue.500" color="white" />
//               </AvatarGroup>
//             </HStack>
//           </ModalHeader>
//           <ModalBody p={0} position="relative" h="calc(100vh - 140px)" bg="#000">
//             {error ? (
//               <Center flexDir="column" h="100%">
//                 <VStack spacing={6}>
//                   <AlertCircle size={48} color="#f87171" />
//                   <Box>
//                     <Text fontSize="xl" fontWeight="500">Unable to join meeting</Text>
//                     <Text mt={2} color="gray.400">{error}</Text>
//                   </Box>
//                   <Button leftIcon={<Video size={16} />} onClick={handleLaunch} colorScheme="blue" size="lg">
//                     Try Again
//                   </Button>
//                 </VStack>
//               </Center>
//             ) : !authToken ? (
//               <Center h="100%">
//                 <VStack spacing={6}>
//                   <Spinner size="xl" color="blue.400" />
//                   <Text fontSize="lg" color="white">Setting up your meeting...</Text>
//                   <Text fontSize="sm" color="gray.400">Please wait a moment</Text>
//                 </VStack>
//               </Center>
//             ) : meeting ? (
//               <Box position="relative" width="100vw" height="100vh" bg="#000">
//                 {/* Add custom logo image (replace path as needed) */}
//                 <Box position="absolute" top="18px" left="20px" zIndex={101}>
//                   <img src={LOGO_SRC} alt="Logo" style={{ height: 38 }} />
//                 </Box>
//                 <DyteProvider value={meeting}>
//                   <DyteMeeting
//                     mode="fill"
//                     meeting={meeting}
//                     showSetupScreen
//                     style={{
//                       width: '100vw',
//                       height: '100vh',
//                       background: '#000',
//                       position: 'absolute',
//                       top: 0,
//                       left: 0
//                     }}
//                   />
//                 </DyteProvider>
//               </Box>
//             ) : null}
//           </ModalBody>
//           <ModalFooter
//             position="fixed"
//             bottom={0}
//             width="100%"
//             py={6}
//             bg="rgba(17,24,39,0.95)"
//             backdropFilter="blur(12px)"
//             borderTop="1px solid rgba(255,255,255,0.1)"
//             zIndex={10}
//           >
//             <Flex w="100%" justify="space-between" align="center">
//               <HStack spacing={2}>
//                 <IconButton aria-label="Toggle mic" icon={<Mic size={20} />} variant="ghost" colorScheme="whiteAlpha" rounded="full" />
//                 <IconButton aria-label="Toggle camera" icon={<Camera size={20} />} variant="ghost" colorScheme="whiteAlpha" rounded="full" />
//                 <IconButton aria-label="Share screen" icon={<Share2 size={20} />} onClick={handleScreenShare} variant="ghost" colorScheme={isScreenSharing ? 'blue' : 'whiteAlpha'} rounded="full" />
//                 <Button leftIcon={<Share2 size={16} />} onClick={handleCopyInvite} variant="outline" size="sm" colorScheme="whiteAlpha">
//                   {hasCopied ? 'Copied!' : 'Copy invite link'}
//                 </Button>
//               </HStack>
//               <Button leftIcon={<PhoneOff size={16} />} onClick={handleClose} colorScheme="red" size="lg" rounded="full" px={8}>
//                 Leave Meeting
//               </Button>
//               <IconButton aria-label="Show participants" icon={<Users size={20} />} variant="ghost" colorScheme="whiteAlpha" rounded="full" />
//             </Flex>
//           </ModalFooter>
//         </ModalContent>
//       </Modal>
//     </>
//   );
// };

// export default DyteMeetingLauncher;


// import React, { useCallback, useEffect, useMemo, useState } from 'react';
// import { DyteMeeting } from '@dytesdk/react-ui-kit';
// import { DyteProvider, useDyteClient } from '@dytesdk/react-web-core';
// import {
//   Modal,
//   ModalBody,
//   ModalContent,
//   ModalFooter,
//   ModalHeader,
//   ModalOverlay,
//   Center,
//   Spinner,
//   Text,
//   HStack,
//   Avatar,
//   AvatarGroup,
//   Button,
//   IconButton,
//   Tooltip,
//   useDisclosure,
//   useToast,
//   VStack,
//   Flex,
//   Box,
//   useClipboard,
// } from '@chakra-ui/react';
// import { AlertCircle, Video, Users, Mic, Camera, Share2, PhoneOff } from 'lucide-react';
// import { requestDyteSession } from '../services/dyteService';

// const LOGO_SRC = './assets/Logo.png';

// const DyteMeetingLauncher = ({
//   buttonClassName = 'editor-navbar__icon-btn',
//   participantName,
//   meetingTitle = 'New Meeting',
// }) => {
//   const toast = useToast();
//   const { isOpen, onOpen, onClose } = useDisclosure();
//   const [isLoading, setIsLoading] = useState(false);
//   const [authToken, setAuthToken] = useState(null);
//   const [meetingInfo, setMeetingInfo] = useState(null);
//   const [error, setError] = useState(null);
//   const [meeting, initMeeting, leaveMeeting] = useDyteClient();
//   const [isScreenSharing, setIsScreenSharing] = useState(false);
//   const { onCopy, hasCopied, setValue: setClipboardValue } = useClipboard('');

//   const resetState = useCallback(() => {
//     setAuthToken(null);
//     setMeetingInfo(null);
//     setError(null);
//     setIsScreenSharing(false);
//   }, []);

//   const safeParticipantName = useMemo(() => {
//     if (participantName && participantName.trim()) return participantName.trim();
//     try {
//       const stored = localStorage.getItem('currentUserIdentity');
//       if (stored) {
//         const parsed = JSON.parse(stored);
//         if (parsed?.name) return parsed.name;
//       }
//     } catch {}
//     return 'Host User';
//   }, [participantName]);

//   useEffect(() => {
//     if (!authToken || !isOpen) return;
//     let mounted = true;
//     const loadMeeting = async () => {
//       try {
//         await initMeeting({
//           authToken,
//           defaults: { audio: true, video: true, screenShare: { displaySurface: 'window' } },
//           videoEnabled: true,
//           audioEnabled: true,
//           setupScreen: true,
//           showSetupScreen: true,
//         });
//       } catch (err) {
//         if (mounted) setError(err.message || 'Failed to initialize Dyte meeting.');
//       }
//     };
//     loadMeeting();
//     return () => { mounted = false; };
//   }, [authToken, initMeeting, isOpen]);

//   useEffect(() => {
//     if (!meeting) return;
//     const onScreenShareUpdate = ({ screenShareEnabled }) => setIsScreenSharing(screenShareEnabled);
//     meeting.self.on('screenShareUpdate', onScreenShareUpdate);
//     return () => meeting.self.off('screenShareUpdate', onScreenShareUpdate);
//   }, [meeting]);

//   const handleLaunch = useCallback(async () => {
//     setError(null);
//     if (!isOpen) onOpen();
//     if (authToken) return;
//     try {
//       setIsLoading(true);
//       const session = await requestDyteSession({
//         title: meetingTitle,
//         participantName: safeParticipantName,
//         meetingPreset: 'group_call_host',
//         clientId: `host_${Date.now()}`,
//       });
//       if (session?.authToken) {
//         setAuthToken(session.authToken);
//         setMeetingInfo({
//           id: session.meetingId || session.data?.id,
//           title: session.meetingTitle || meetingTitle,
//         });
//         toast({
//           title: 'Meeting Ready',
//           description: `Joining ${session.meetingTitle || meetingTitle}...`,
//           status: 'success',
//           duration: 3000,
//           isClosable: true,
//         });
//       } else {
//         throw new Error('No authToken returned from Dyte API');
//       }
//     } catch (apiError) {
//       setError(apiError?.message || 'Failed to start Dyte meeting.');
//       toast({
//         title: 'Dyte Error',
//         description: apiError?.message || 'Failed to start Dyte meeting.',
//         status: 'error',
//         duration: 5000,
//         isClosable: true,
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   }, [authToken, meetingTitle, safeParticipantName, toast, isOpen, onOpen]);

//   const handleClose = useCallback(() => {
//     try { if (meeting && typeof leaveMeeting === 'function') leaveMeeting(); }
//     catch (e) { console.warn('Leave error:', e); }
//     resetState();
//     onClose();
//   }, [leaveMeeting, meeting, onClose, resetState]);

//   const handleCopyInvite = useCallback(() => {
//     if (!meetingInfo?.id) return;
//     const inviteUrl = `${window.location.origin}/join/${meetingInfo.id}`;
//     setClipboardValue(inviteUrl);
//     onCopy();
//     toast({
//       title: 'Invite link copied',
//       description: 'Meeting link copied to clipboard',
//       status: 'success',
//       duration: 2000,
//     });
//   }, [meetingInfo?.id, onCopy, setClipboardValue, toast]);

//   const handleScreenShare = useCallback(async () => {
//     if (!meeting) return;
//     try {
//       if (isScreenSharing) {
//         await meeting.self.disableScreenShare();
//         setIsScreenSharing(false);
//       } else {
//         await meeting.self.enableScreenShare({ displaySurface: 'window' });
//         setIsScreenSharing(true);
//       }
//     } catch (error) {
//       toast({
//         title: 'Screen sharing error',
//         description: error.message || 'Failed to toggle screen sharing',
//         status: 'error',
//         duration: 3000,
//       });
//     }
//   }, [meeting, isScreenSharing, toast]);

//   return (
//     <>
//       <Tooltip label="Start video meeting" hasArrow placement="bottom">
//         <IconButton
//           aria-label="Start meeting"
//           icon={isLoading ? <Spinner size="sm" /> : <Video size={20} />}
//           onClick={handleLaunch}
//           isDisabled={isLoading}
//           colorScheme="blue"
//           variant="ghost"
//           rounded="full"
//           size="lg"
//           className={buttonClassName}
//         />
//       </Tooltip>
//       <Modal isOpen={isOpen} onClose={handleClose} size="full" isCentered motionPreset="slideInBottom" closeOnOverlayClick={false}>
//         <ModalOverlay backdropFilter="blur(8px)" />
//         <ModalContent bg="#0a0f1c" maxW="100vw" maxH="100vh" m={0}>
//           <ModalHeader p={4} borderBottom="1px solid rgba(255,255,255,0.1)" bg="#111827" display="flex" alignItems="center" justifyContent="space-between">
//             <Text fontSize="lg" fontWeight="500">
//               {meetingInfo?.title || meetingTitle}
//             </Text>
//             <HStack spacing={4}>
//               <Text fontSize="sm" color="gray.400">
//                 {meetingInfo?.id && `Meeting ID: ${meetingInfo.id.slice(0, 8)}...`}
//               </Text>
//               <AvatarGroup size="sm" max={3}>
//                 <Avatar name={safeParticipantName} bg="blue.500" color="white" />
//               </AvatarGroup>
//             </HStack>
//           </ModalHeader>
//           <ModalBody p={0} position="relative" style={{ width: '100vw', height: '100vh', background: '#000' }}>
//             {error ? (
//               <Center flexDir="column" h="100%">
//                 <VStack spacing={6}>
//                   <AlertCircle size={48} color="#f87171" />
//                   <Box>
//                     <Text fontSize="xl" fontWeight="500">Unable to join meeting</Text>
//                     <Text mt={2} color="gray.400">{error}</Text>
//                   </Box>
//                   <Button leftIcon={<Video size={16} />} onClick={handleLaunch} colorScheme="blue" size="lg">
//                     Try Again
//                   </Button>
//                 </VStack>
//               </Center>
//             ) : !authToken ? (
//               <Center h="100%">
//                 <VStack spacing={6}>
//                   <Spinner size="xl" color="blue.400" />
//                   <Text fontSize="lg" color="white">Setting up your meeting...</Text>
//                   <Text fontSize="sm" color="gray.400">Please wait a moment</Text>
//                 </VStack>
//               </Center>
//             ) : meeting ? (
//               <Box position="relative" w="100vw" h="100vh" bg="#000">
//                 {/* Logo top-left */}
//                 <Box position="absolute" top="18px" left="20px" zIndex={101}>
//                   <img src={LOGO_SRC} alt="Logo" style={{ height: 38 }} onError={e => (e.target.style.display = 'none')} />
//                 </Box>
//                 <DyteProvider value={meeting}>
//                   <DyteMeeting
//                     mode="fill"
//                     meeting={meeting}
//                     showSetupScreen
//                     style={{
//                       width: '100vw',
//                       height: '100vh',
//                       background: '#000',
//                       position: 'absolute',
//                       top: 0,
//                       left: 0,
//                     }}
//                   />
//                 </DyteProvider>
//               </Box>
//             ) : null}
//           </ModalBody>
//           <ModalFooter
//             position="fixed"
//             bottom={0}
//             width="100%"
//             py={6}
//             bg="rgba(17,24,39,0.95)"
//             backdropFilter="blur(12px)"
//             borderTop="1px solid rgba(255,255,255,0.1)"
//             zIndex={10}
//           >
//             <Flex w="100%" justify="space-between" align="center">
//               <HStack spacing={2}>
//                 <IconButton aria-label="Toggle mic" icon={<Mic size={20} />} variant="ghost" colorScheme="whiteAlpha" rounded="full" />
//                 <IconButton aria-label="Toggle camera" icon={<Camera size={20} />} variant="ghost" colorScheme="whiteAlpha" rounded="full" />
//                 <IconButton aria-label="Share screen" icon={<Share2 size={20} />} onClick={handleScreenShare} variant="ghost" colorScheme={isScreenSharing ? 'blue' : 'whiteAlpha'} rounded="full" />
//                 <Button leftIcon={<Share2 size={16} />} onClick={handleCopyInvite} variant="outline" size="sm" colorScheme="whiteAlpha">
//                   {hasCopied ? 'Copied!' : 'Copy invite link'}
//                 </Button>
//               </HStack>
//               <Button leftIcon={<PhoneOff size={16} />} onClick={handleClose} colorScheme="red" size="lg" rounded="full" px={8}>
//                 Leave Meeting
//               </Button>
//               <IconButton aria-label="Show participants" icon={<Users size={20} />} variant="ghost" colorScheme="whiteAlpha" rounded="full" />
//             </Flex>
//           </ModalFooter>
//         </ModalContent>
//       </Modal>
//     </>
//   );
// };

// export default DyteMeetingLauncher;


//10-11-25

import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import { DyteMeeting } from '@dytesdk/react-ui-kit';
import { DyteProvider, useDyteClient } from '@dytesdk/react-web-core';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Center,
  Spinner,
  Text,
  HStack,
  Avatar,
  AvatarGroup,
  Button,
  IconButton,
  Tooltip,
  useDisclosure,
  useToast,
  VStack,
  Flex,
  Box,
  useClipboard,
} from '@chakra-ui/react';
import { AlertCircle, Video, Users, Mic, Camera, Share2, PhoneOff, Copy } from 'lucide-react';
import { requestDyteSession } from '../services/dyteService';

import LOGO_SRC from '../assets/Logo.png';

const DyteMeetingLauncher = ({
  buttonClassName = 'editor-navbar__icon-btn',
  participantName,
  meetingTitle = 'New Meeting',
}) => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);
  const [authToken, setAuthToken] = useState(null);
  const [meetingInfo, setMeetingInfo] = useState(null);
  const [error, setError] = useState(null);
  const [meeting, initMeeting] = useDyteClient();
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isMicEnabled, setIsMicEnabled] = useState(true);
  const [isCameraEnabled, setIsCameraEnabled] = useState(true);
  const { onCopy, hasCopied, setValue: setClipboardValue } = useClipboard('');
  const initTokenRef = useRef(null);

  // Safe participant name extraction
  const safeParticipantName = useMemo(() => {
    if (participantName && participantName.trim()) return participantName.trim();
    try {
      const stored = localStorage.getItem('currentUserIdentity');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.name) return parsed.name;
      }
    } catch {}
    return 'Host User';
  }, [participantName]);

  // Reset state on close
  const resetState = useCallback(() => {
    setAuthToken(null);
    setMeetingInfo(null);
    setError(null);
    setIsScreenSharing(false);
    setIsMicEnabled(true);
    setIsCameraEnabled(true);
    initTokenRef.current = null;
  }, []);

  // Initialize Dyte meeting when authToken is available
  useEffect(() => {
    if (!authToken || !isOpen || initTokenRef.current === authToken) return;

    let mounted = true;
    const loadMeeting = async () => {
      try {
        console.log('🎥 Initializing Dyte meeting...');
        initTokenRef.current = authToken;
        
        await initMeeting({
          authToken,
          defaults: {
            audio: true,
            video: true,
          },
        });

        if (mounted) {
          console.log('✅ Dyte meeting initialized successfully');
        }
      } catch (err) {
        console.error('❌ Dyte initialization error:', err);
        if (mounted) {
          setError(err.message || 'Failed to initialize Dyte meeting.');
        }
      }
    };

    loadMeeting();
    return () => {
      mounted = false;
    };
  }, [authToken, initMeeting, isOpen]);

  // Monitor meeting state changes
  useEffect(() => {
    if (!meeting || !meeting.self) return;

    const handleMicUpdate = ({ audioEnabled }) => setIsMicEnabled(audioEnabled);
    const handleCameraUpdate = ({ videoEnabled }) => setIsCameraEnabled(videoEnabled);
    const handleScreenShareUpdate = ({ screenShareEnabled }) => setIsScreenSharing(screenShareEnabled);

    meeting.self.on('audioUpdate', handleMicUpdate);
    meeting.self.on('videoUpdate', handleCameraUpdate);
    meeting.self.on('screenShareUpdate', handleScreenShareUpdate);

    return () => {
      meeting.self.removeListener('audioUpdate', handleMicUpdate);
      meeting.self.removeListener('videoUpdate', handleCameraUpdate);
      meeting.self.removeListener('screenShareUpdate', handleScreenShareUpdate);
    };
  }, [meeting]);

  // Launch meeting handler
  const handleLaunch = useCallback(async () => {
    setError(null);
    if (!isOpen) onOpen();
    if (authToken) return; // Already initialized

    try {
      setIsLoading(true);
      console.log('🚀 Creating Dyte session...');

      const session = await requestDyteSession({
        title: meetingTitle,
        participantName: safeParticipantName,
        meetingPreset: 'group_call_host',
        clientId: `host_${Date.now()}`,
      });

      if (session?.authToken) {
        setAuthToken(session.authToken);
        setMeetingInfo({
          id: session.meetingId,
          title: session.meetingTitle || meetingTitle,
        });

        toast({
          title: 'Meeting Ready',
          description: `Joining ${session.meetingTitle || meetingTitle}...`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        throw new Error('No authToken returned from Dyte API');
      }
    } catch (apiError) {
      console.error('❌ Failed to create session:', apiError);
      setError(apiError?.message || 'Failed to start Dyte meeting.');
      toast({
        title: 'Meeting Error',
        description: apiError?.message || 'Failed to start Dyte meeting.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  }, [authToken, meetingTitle, safeParticipantName, toast, isOpen, onOpen]);

  // Close and cleanup
  const handleClose = useCallback(() => {
    try {
      if (meeting && meeting.self) {
        meeting.leaveRoom();
      }
    } catch (e) {
      console.warn('Leave error:', e);
    }
    resetState();
    onClose();
  }, [meeting, onClose, resetState]);

  // Copy invite link
  const handleCopyInvite = useCallback(() => {
    if (!meetingInfo?.id) return;
    const inviteUrl = `${window.location.origin}/join/${meetingInfo.id}`;
    setClipboardValue(inviteUrl);
    onCopy();
    toast({
      title: 'Invite link copied',
      description: 'Meeting link copied to clipboard',
      status: 'success',
      duration: 2000,
    });
  }, [meetingInfo?.id, onCopy, setClipboardValue, toast]);

  // Toggle controls
  const toggleMic = useCallback(async () => {
    if (!meeting || !meeting.self) return;
    try {
      if (isMicEnabled) {
        await meeting.self.disableAudio();
      } else {
        await meeting.self.enableAudio();
      }
    } catch (error) {
      console.error('Mic toggle error:', error);
    }
  }, [meeting, isMicEnabled]);

  const toggleCamera = useCallback(async () => {
    if (!meeting || !meeting.self) return;
    try {
      if (isCameraEnabled) {
        await meeting.self.disableVideo();
      } else {
        await meeting.self.enableVideo();
      }
    } catch (error) {
      console.error('Camera toggle error:', error);
    }
  }, [meeting, isCameraEnabled]);

  const toggleScreenShare = useCallback(async () => {
    if (!meeting || !meeting.self) return;
    try {
      if (isScreenSharing) {
        await meeting.self.disableScreenShare();
      } else {
        await meeting.self.enableScreenShare();
      }
    } catch (error) {
      console.error('Screen share error:', error);
      toast({
        title: 'Screen sharing error',
        description: error.message || 'Failed to toggle screen sharing',
        status: 'error',
        duration: 3000,
      });
    }
  }, [meeting, isScreenSharing, toast]);

  return (
    <>
      <Tooltip label="Start video meeting" hasArrow placement="bottom">
        <IconButton
          aria-label="Start meeting"
          icon={isLoading ? <Spinner size="sm" /> : <Video size={20} />}
          onClick={handleLaunch}
          isDisabled={isLoading}
          colorScheme="blue"
          variant="ghost"
          rounded="full"
          size="lg"
          className={buttonClassName}
        />
      </Tooltip>

      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        size="full"
        isCentered
        motionPreset="slideInBottom"
        closeOnOverlayClick={false}
      >
        <ModalOverlay backdropFilter="blur(8px)" bg="blackAlpha.800" />
        <ModalContent
          bg="#0a0f1c"
          maxW="100vw"
          maxH="100vh"
          w="100vw"
          h="100vh"
          m={0}
          borderRadius={0}
        >
          {/* Header */}
          <ModalHeader
            p={4}
            borderBottom="1px solid"
            borderColor="whiteAlpha.200"
            bg="#111827"
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <HStack spacing={3}>
              {/* <img
                src={LOGO_SRC}
                alt="Logo"
                style={{ height: 32 }}
                onError={(e) => (e.target.style.display = 'none')}
              /> */}
              <Text fontSize="lg" fontWeight="500" color="white">
                {meetingInfo?.title || meetingTitle}
              </Text>
            </HStack>
            <HStack spacing={4}>
              {meetingInfo?.id && (
                <Text fontSize="sm" color="gray.400">
                  ID: {meetingInfo.id.slice(0, 8)}
                </Text>
              )}
              <AvatarGroup size="sm" max={3}>
                <Avatar name={safeParticipantName} bg="blue.500" color="white" />
              </AvatarGroup>
            </HStack>
          </ModalHeader>

          {/* Body */}
          <ModalBody p={0} position="relative" overflow="hidden">
            {error ? (
              <Center h="100%" bg="#0a0f1c">
                <VStack spacing={6}>
                  <AlertCircle size={48} color="#f87171" />
                  <Box textAlign="center">
                    <Text fontSize="xl" fontWeight="500" color="white">
                      Unable to join meeting
                    </Text>
                    <Text mt={2} color="gray.400">
                      {error}
                    </Text>
                  </Box>
                  <Button
                    leftIcon={<Video size={16} />}
                    onClick={handleLaunch}
                    colorScheme="blue"
                    size="lg"
                  >
                    Try Again
                  </Button>
                </VStack>
              </Center>
            ) : !meeting ? (
              <Center h="100%" bg="#0a0f1c">
                <VStack spacing={6}>
                  <Spinner size="xl" color="blue.400" thickness="4px" />
                  <Text fontSize="lg" color="white">
                    Setting up your meeting...
                  </Text>
                  <Text fontSize="sm" color="gray.400">
                    Please wait a moment
                  </Text>
                </VStack>
              </Center>
            ) : (
              <Box w="100%" h="100%" bg="#000" position="relative">
                <DyteProvider value={meeting}>
                  <DyteMeeting
                    mode="fill"
                    meeting={meeting}
                    showSetupScreen={false}
                    style={{
                      width: '100%',
                      height: '100%',
                    }}
                  />
                </DyteProvider>
              </Box>
            )}
          </ModalBody>

          {/* Footer Controls */}
          {meeting && (
            <ModalFooter
              position="absolute"
              bottom={0}
              width="100%"
              py={4}
              px={6}
              bg="rgba(17,24,39,0.95)"
              backdropFilter="blur(12px)"
              borderTop="1px solid"
              borderColor="whiteAlpha.200"
              zIndex={100}
            >
              <Flex w="100%" justify="space-between" align="center">
                <HStack spacing={2}>
                  <Tooltip label={isMicEnabled ? 'Mute' : 'Unmute'}>
                    <IconButton
                      aria-label="Toggle mic"
                      icon={<Mic size={20} />}
                      onClick={toggleMic}
                      variant="ghost"
                      colorScheme={isMicEnabled ? 'whiteAlpha' : 'red'}
                      rounded="full"
                    />
                  </Tooltip>
                  <Tooltip label={isCameraEnabled ? 'Turn off camera' : 'Turn on camera'}>
                    <IconButton
                      aria-label="Toggle camera"
                      icon={<Camera size={20} />}
                      onClick={toggleCamera}
                      variant="ghost"
                      colorScheme={isCameraEnabled ? 'whiteAlpha' : 'red'}
                      rounded="full"
                    />
                  </Tooltip>
                  <Tooltip label={isScreenSharing ? 'Stop sharing' : 'Share screen'}>
                    <IconButton
                      aria-label="Share screen"
                      icon={<Share2 size={20} />}
                      onClick={toggleScreenShare}
                      variant="ghost"
                      colorScheme={isScreenSharing ? 'blue' : 'whiteAlpha'}
                      rounded="full"
                    />
                  </Tooltip>
                  <Button
                    leftIcon={<Copy size={16} />}
                    onClick={handleCopyInvite}
                    variant="outline"
                    size="sm"
                    colorScheme="whiteAlpha"
                  >
                    {hasCopied ? 'Copied!' : 'Copy invite'}
                  </Button>
                </HStack>

                <Button
                  leftIcon={<PhoneOff size={16} />}
                  onClick={handleClose}
                  colorScheme="red"
                  size="lg"
                  rounded="full"
                  px={8}
                >
                  Leave Meeting
                </Button>

                <Tooltip label="Participants">
                  <IconButton
                    aria-label="Show participants"
                    icon={<Users size={20} />}
                    variant="ghost"
                    colorScheme="whiteAlpha"
                    rounded="full"
                  />
                </Tooltip>
              </Flex>
            </ModalFooter>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default DyteMeetingLauncher;
