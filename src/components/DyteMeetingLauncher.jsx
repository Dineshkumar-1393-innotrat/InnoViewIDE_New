import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Center,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  useDisclosure,
  useToast,
  VStack,
  HStack,
  Avatar,
  AvatarGroup,
  IconButton,
  Tooltip,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useClipboard,
} from '@chakra-ui/react';
import { AlertCircle, Video, Users, Mic, Camera, Share2, PhoneOff, Copy, ExternalLink } from 'lucide-react';
import { DyteMeeting } from '@dytesdk/react-ui-kit';
import { DyteProvider, useDyteClient } from '@dytesdk/react-web-core';
import { requestDyteSession } from '../services/dyteService';

const DyteMeetingLauncher = ({
  buttonClassName = 'editor-navbar__icon-btn',
  participantName,
  meetingTitle,
  meetingPreset = 'group_call_participant',
}) => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);
  const [authToken, setAuthToken] = useState(null);
  const [meetingInfo, setMeetingInfo] = useState(null);
  const [error, setError] = useState(null);
  const [meeting, initMeeting] = useDyteClient();
  const { onCopy, hasCopied } = useClipboard('');
  const [meetingLink, setMeetingLink] = useState('');

  // ✅ Reset state only when leaving manually
  const resetState = useCallback(() => {
    setAuthToken(null);
    setMeetingInfo(null);
    setError(null);
  }, []);

  // ✅ Resolve participant name safely
  const safeParticipantName = useMemo(() => {
    if (participantName && participantName.trim()) return participantName.trim();
    try {
      const stored = localStorage.getItem('currentUserIdentity');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.name) return parsed.name;
      }
    } catch {}
    return 'InnoIDE User';
  }, [participantName]);

  // ✅ Initialize Dyte meeting when token is ready and modal is open
  useEffect(() => {
    if (!authToken || !isOpen) return;

    let mounted = true;
    const loadMeeting = async () => {
      try {
        console.log('🔹 Initializing Dyte meeting...');
        const instance = await initMeeting({
          authToken,
          defaults: { audio: true, video: true },
        });

        if (mounted) {
          console.log('✅ Dyte meeting initialized:', instance);
        }
      } catch (err) {
        console.error('❌ Dyte Init Error:', err);
        if (mounted) setError(err.message || 'Failed to initialize Dyte meeting.');
      }
    };

    loadMeeting();
    return () => {
      // ❌ Do NOT auto-leave here — handled manually
      mounted = false;
    };
  }, [authToken, initMeeting, isOpen]);

  // ✅ Handle creating or joining meeting
  const handleLaunch = useCallback(async () => {
    setError(null);
    if (!isOpen) onOpen();
    if (authToken) return;

    try {
      setIsLoading(true);

      const session = await requestDyteSession({
        title: meetingTitle,
        participantName: safeParticipantName,
        meetingPreset: meetingPreset || 'group_call_participant',
        clientId: `user_${Date.now()}`,
      });

      console.log('✅ Dyte session created:', session);

      if (session?.authToken) {
        setAuthToken(session.authToken);
        setMeetingInfo({
          id: session.meetingId || session.data?.id,
          title: meetingTitle || session.meetingTitle,
        });

        toast({
          title: 'Meeting Ready',
          description: `Joining ${meetingTitle || 'session'}...`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        throw new Error('No authToken returned from Dyte API');
      }
    } catch (apiError) {
      const message = apiError?.message || 'Failed to start Dyte meeting.';
      setError(message);
      toast({
        title: 'Dyte Error',
        description: message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  }, [authToken, meetingPreset, meetingTitle, safeParticipantName, toast, isOpen, onOpen]);

  // ✅ Leave meeting only when user clicks "Leave"
  const handleClose = useCallback(() => {
    try {
      if (meeting && typeof meeting.leaveRoom === 'function') {
        meeting.leaveRoom();
        console.log('👋 Left Dyte meeting');
      }
    } catch (e) {
      console.warn('LeaveRoom error:', e);
    }
    resetState();
    onClose();
  }, [meeting, onClose, resetState]);

  // Add this after meeting initialization
  useEffect(() => {
    if (meetingInfo?.id) {
      const link = `${window.location.origin}/join/${meetingInfo.id}`;
      setMeetingLink(link);
    }
  }, [meetingInfo]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join my InnoIDE Meeting',
          text: `Join my meeting: ${meetingInfo?.title || 'Video Call'}`,
          url: meetingLink
        });
      } catch (err) {
        console.log('Share failed:', err);
      }
    } else {
      onCopy(meetingLink);
      toast({
        title: 'Link copied!',
        description: 'Meeting link copied to clipboard',
        status: 'success',
        duration: 2000
      });
    }
  };

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
        <ModalOverlay backdropFilter="blur(8px)" />
        <ModalContent bg="#0a0f1c" m={0} rounded={0}>
          <ModalHeader
            p={4}
            borderBottom="1px solid rgba(255,255,255,0.1)"
            bg="#111827"
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Text fontSize="lg" fontWeight="500">
              {meetingInfo?.title || meetingTitle || 'New Meeting'}
            </Text>
            <HStack spacing={4}>
              <Text fontSize="sm" color="gray.400">
                {meetingInfo?.id && `Meeting ID: ${meetingInfo.id.slice(0, 8)}...`}
              </Text>
              <AvatarGroup size="sm" max={3}>
                <Avatar name={safeParticipantName} bg="blue.500" color="white" />
              </AvatarGroup>
            </HStack>
          </ModalHeader>

          <ModalBody p={0} h="calc(100vh - 120px)" bg="black">
            {error ? (
              <Center flexDir="column" h="100%">
                <VStack spacing={6}>
                  <AlertCircle size={48} color="#f87171" />
                  <Box>
                    <Text fontSize="xl" fontWeight="500">
                      Unable to join meeting
                    </Text>
                    <Text mt={2} color="gray.400">
                      {error}
                    </Text>
                  </Box>
                  <Button leftIcon={<Video size={16} />} onClick={handleLaunch} colorScheme="blue" size="lg">
                    Try Again
                  </Button>
                </VStack>
              </Center>
            ) : !authToken ? (
              <Center h="100%">
                <VStack spacing={6}>
                  <Spinner size="xl" color="blue.400" />
                  <Text fontSize="lg" color="white">
                    Setting up your meeting...
                  </Text>
                  <Text fontSize="sm" color="gray.400">
                    Please wait a moment
                  </Text>
                </VStack>
              </Center>
            ) : meeting ? (
              <DyteProvider value={meeting}>
                <DyteMeeting mode="fill" meeting={meeting} showSetupScreen />
              </DyteProvider>
            ) : (
              <Center h="100%">
                <Spinner size="lg" color="blue.400" />
              </Center>
            )}
          </ModalBody>

          <ModalFooter
            position="fixed"
            bottom={0}
            w="100%"
            py={6}
            bg="rgba(17,24,39,0.95)"
            borderTop="1px solid rgba(255,255,255,0.1)"
            backdropFilter="blur(12px)"
          >
            <Flex w="100%" justify="space-between" align="center">
              <HStack spacing={2}>
                <IconButton aria-label="Toggle mic" icon={<Mic size={20} />} variant="ghost" colorScheme="whiteAlpha" rounded="full" />
                <IconButton aria-label="Toggle camera" icon={<Camera size={20} />} variant="ghost" colorScheme="whiteAlpha" rounded="full" />
                
                <Menu>
                  <MenuButton
                    as={IconButton}
                    aria-label="Share meeting"
                    icon={<Share2 size={20} />}
                    variant="ghost"
                    colorScheme="whiteAlpha"
                    rounded="full"
                  />
                  <MenuList bg="#1f2937" borderColor="gray.700">
                    <MenuItem
                      icon={<Copy size={16} />}
                      onClick={handleShare}
                      _hover={{ bg: 'gray.700' }}
                    >
                      Copy invite link
                    </MenuItem>
                    {meetingLink && (
                      <MenuItem
                        icon={<ExternalLink size={16} />}
                        onClick={() => window.open(meetingLink, '_blank')}
                        _hover={{ bg: 'gray.700' }}
                      >
                        Open in new tab
                      </MenuItem>
                    )}
                  </MenuList>
                </Menu>
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

              <IconButton aria-label="Show participants" icon={<Users size={20} />} variant="ghost" colorScheme="whiteAlpha" rounded="full" />
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default DyteMeetingLauncher;
