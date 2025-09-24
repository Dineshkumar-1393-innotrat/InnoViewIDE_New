import React, { useEffect, useState } from 'react';
import { DyteProvider, useDyteClient } from '@dytesdk/react-web-core';
import { DyteMeeting } from '@dytesdk/react-ui-kit';

// This component will render the meeting UI once the meeting is initialized.
const MeetingUI = ({ onClose }) => {
  const { meeting } = useDyteClient();

  useEffect(() => {
    if (!meeting) return;

    const handleRoomLeft = () => {
      console.log('User left the meeting');
      onClose();
    };

    meeting.on('roomLeft', handleRoomLeft);

    return () => {
      meeting.removeListener('roomLeft', handleRoomLeft);
    };
  }, [meeting, onClose]);

  return <DyteMeeting meeting={meeting} showSetupScreen={true} style={{ height: '100%' }} />;
};

// This is the main wrapper component that you will use in your application.
const DyteMeetingComponent = ({ authToken, roomName, onClose }) => {
  const [meeting, initMeeting] = useDyteClient();

  useEffect(() => {
    if (authToken && roomName) {
      console.log('Initializing Dyte meeting with:', { authToken, roomName });
      initMeeting({
        authToken,
        roomName,
        apiBase: 'https://api.dyte.io/v2',
        defaults: {
          audio: false,
          video: false,
        },
      }).catch((err) => console.error('Failed to initialize meeting:', err));
    }
  }, [authToken, roomName]);

  return (
    <div style={{ height: '100%', width: '100%' }}>
      {meeting && (
        <DyteProvider value={meeting}>
          <MeetingUI onClose={onClose} />
        </DyteProvider>
      )}
    </div>
  );
};

export default DyteMeetingComponent;
