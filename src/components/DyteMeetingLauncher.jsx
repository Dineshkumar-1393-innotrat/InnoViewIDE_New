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
} from '@chakra-ui/react';
import { AlertCircle, Video } from 'lucide-react';
import { DyteMeeting } from '@dytesdk/react-ui-kit';
import { DyteProvider, useDyteClient } from '@dytesdk/react-web-core';
import { requestDyteSession } from '../services/dyteService';

const DyteMeetingLauncher = ({
  buttonClassName = 'editor-navbar__icon-btn',
  participantName,
  meetingTitle,
  meetingPreset,
  participantPreset,
}) => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);
  const [authToken, setAuthToken] = useState(null);
  const [meetingInfo, setMeetingInfo] = useState(null);
  const [error, setError] = useState(null);
  const [meeting, initMeeting] = useDyteClient();

  const resetState = useCallback(() => {
    setAuthToken(null);
    setMeetingInfo(null);
    setError(null);
  }, []);

  const safeParticipantName = useMemo(() => {
    if (participantName && typeof participantName === 'string' && participantName.trim()) {
      return participantName.trim();
    }
    if (typeof window !== 'undefined') {
      const raw = window.localStorage.getItem('currentUserIdentity');
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          if (parsed?.name) return parsed.name;
        } catch (error) {
          // ignore parse errors
        }
      }
    }
    return 'InnoIDE User';
  }, [participantName]);

  useEffect(() => {
    if (!authToken || !isOpen) return;

    let cancelled = false;

    const loadMeeting = async () => {
      try {
        await initMeeting({
          authToken,
          defaults: {
            audio: true,
            video: true,
          },
        });
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError?.message || 'Failed to initialize Dyte meeting.');
        }
      }
    };

    loadMeeting();

    return () => {
      cancelled = true;
      if (meeting?.leaveRoom) {
        meeting.leaveRoom();
      }
    };
  }, [authToken, initMeeting, isOpen, meeting]);

  const handleLaunch = useCallback(async () => {
    setError(null);

    if (!isOpen) {
      onOpen();
    }

    if (authToken) {
      return;
    }

    try {
      setIsLoading(true);
      const session = await requestDyteSession({
        title: meetingTitle,
        participantName: safeParticipantName,
        meetingPreset,
        participantPreset,
      });

      setAuthToken(session?.authToken);
      setMeetingInfo({
        id: session?.meetingId,
        title: session?.meetingTitle,
      });
      setError(null);
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
  }, [authToken, meetingPreset, meetingTitle, onOpen, participantPreset, safeParticipantName, toast, isOpen]);

  const handleClose = useCallback(() => {
    if (meeting?.leaveRoom) {
      meeting.leaveRoom();
    }
    resetState();
    onClose();
  }, [meeting, onClose, resetState]);

  return (
    <>
      <button
        type="button"
        className={buttonClassName}
        title="Start Dyte meeting"
        onClick={handleLaunch}
        disabled={isLoading}
      >
        {isLoading ? <Spinner size="xs" /> : <Video size={18} />}
      </button>

      <Modal isOpen={isOpen} onClose={handleClose} size="6xl" isCentered motionPreset="scale">
        <ModalOverlay backdropFilter="blur(6px)" />
        <ModalContent bg="#0b1220" color="white" borderRadius="2xl" border="1px solid rgba(148,163,184,0.24)">
          <ModalHeader borderBottom="1px solid rgba(148,163,184,0.18)">
            {meetingInfo?.title || meetingTitle || 'Live Collaboration'}
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody minH="520px" p={0} overflow="hidden">
            {error && (
              <Center flexDirection="column" gap={4} h="100%" p={8} textAlign="center">
                <AlertCircle size={48} color="#f87171" />
                <Box>
                  <Text fontWeight="bold">Unable to join the Dyte meeting</Text>
                  <Text opacity={0.8}>{error}</Text>
                </Box>
                <Button onClick={handleLaunch} colorScheme="blue">
                  Retry
                </Button>
              </Center>
            )}

            {!error && !authToken && (
              <Center h="100%" flexDirection="column" gap={4} p={8}>
                <Spinner size="xl" thickness="4px" color="blue.300" />
                <Text opacity={0.72}>Creating a Dyte meeting…</Text>
              </Center>
            )}

            {!error && authToken && meeting && (
              <DyteProvider value={meeting}>
                <DyteMeeting mode="fill" />
              </DyteProvider>
            )}
          </ModalBody>

          <ModalFooter borderTop="1px solid rgba(148,163,184,0.18)">
            <Flex w="100%" justify="space-between" align="center">
              <Box fontSize="sm" opacity={0.7}>
                {meetingInfo?.id ? `Meeting ID: ${meetingInfo.id}` : null}
              </Box>
              <Button onClick={handleClose} variant="outline" colorScheme="gray">
                Leave
              </Button>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default DyteMeetingLauncher;
