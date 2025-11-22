# Dyte Video Meeting Implementation - Google Meet-like Features

## Overview
This document describes the Dyte video conferencing integration with Google Meet-like features including camera, microphone, screen sharing, and participant management.

## Architecture

### Components

#### 1. **DyteMeetingLauncher** (Host Component)
- **Location**: `src/components/DyteMeetingLauncher.jsx`
- **Purpose**: Creates and hosts video meetings
- **Features**:
  - Create new meetings as host
  - Full control over meeting (host permissions)
  - Screen sharing capability
  - Invite link generation
  - Camera and microphone controls

#### 2. **ParticipantJoin** (Participant Component)
- **Location**: `src/components/ParticipantJoin.jsx`
- **Purpose**: Allows participants to join existing meetings
- **Features**:
  - Join meetings via meeting ID
  - View host's screen share
  - Camera and microphone controls
  - Chat and participant list
  - Limited permissions (cannot screen share by default)

#### 3. **dyteService** (Backend Service)
- **Location**: `src/services/dyteService.js`
- **Purpose**: Handles Dyte API interactions
- **Functions**:
  - `createMeetingAsHost()` - Create meeting and get host token
  - `joinExistingMeeting()` - Get participant token for existing meeting
  - `initializePresets()` - Initialize Dyte presets

## Key Features

### ✅ Video & Audio
- **HD video quality** (720p/1080p)
- **30 FPS** frame rate
- **Audio/Video toggle** controls
- **Setup screen** for device selection
- **Auto-enable** on join (configurable)

### ✅ Screen Sharing
- **Host can share screen** with all participants
- **HD screen share quality**
- **Audio sharing** support (system audio)
- **Participants can view** host's screen share
- **Real-time sync** with minimal latency

### ✅ Meeting Controls
- **Mute/Unmute** microphone
- **Camera on/off** toggle
- **Screen share** start/stop
- **Leave meeting** button
- **Participant list** view
- **Chat** functionality
- **Settings** panel

### ✅ UI/UX
- **Google Meet-like interface**
- **Dark theme** with modern design
- **Responsive layout** (mobile & desktop)
- **Setup screen** for testing devices
- **Loading states** and error handling
- **Toast notifications** for actions

## Configuration

### Presets

#### Host Preset (`group_call_host`)
```javascript
{
  view_type: 'GROUP_CALL',
  max_video_streams: { mobile: 4, desktop: 9 },
  permissions: {
    media: {
      video: { can_produce: 'ALLOWED' },
      audio: { can_produce: 'ALLOWED' },
      screenshare: { 
        can_produce: 'ALLOWED',
        can_consume: 'ALLOWED'
      }
    },
    // Host controls
    kick_participant: true,
    disable_participant_audio: true,
    disable_participant_video: true,
    can_record: true,
    can_livestream: true
  }
}
```

#### Participant Preset (`group_call_participant`)
```javascript
{
  view_type: 'GROUP_CALL',
  max_video_streams: { mobile: 4, desktop: 9 },
  permissions: {
    media: {
      video: { can_produce: 'ALLOWED' },
      audio: { can_produce: 'ALLOWED' },
      screenshare: { 
        can_produce: 'NOT_ALLOWED',
        can_consume: 'ALLOWED',  // Can view screen shares
        can_request_produce: true // Can request permission
      }
    },
    // Limited controls
    kick_participant: false,
    can_record: false
  }
}
```

### DyteMeeting Component Config

#### Host Configuration
```jsx
<DyteMeeting
  meeting={meeting}
  mode="fill"
  showSetupScreen={true}
  config={{
    controlBar: {
      elements: {
        fullscreen: true,
        screenShare: true,  // Host can share
        camera: true,
        mic: true,
        participants: true,
        settings: true,
        chat: true,
        leave: true,
      }
    },
    header: {
      elements: {
        logo: true,
        title: true,
        participantCount: true,
        clock: true,
      }
    }
  }}
/>
```

#### Participant Configuration
```jsx
<DyteMeeting
  meeting={meeting}
  mode="fill"
  showSetupScreen={true}
  config={{
    controlBar: {
      elements: {
        fullscreen: true,
        screenShare: false,  // Participants cannot share
        camera: true,
        mic: true,
        participants: true,
        settings: true,
        chat: true,
        leave: true,
      }
    }
  }}
/>
```

## Usage

### Starting a Meeting (Host)

```javascript
import DyteMeetingLauncher from './components/DyteMeetingLauncher';

<DyteMeetingLauncher
  participantName="John Doe"
  meetingTitle="Team Standup"
/>
```

### Joining a Meeting (Participant)

1. Host shares invite link: `https://yourapp.com/join/{meetingId}`
2. Participant navigates to link
3. Enters their name
4. Clicks "Join Meeting"

## API Endpoints

### Backend API (Eureka Server)
- **Base URL**: `https://eureka.innotrat.in/api/v1`

#### Create Meeting
```
POST /create-meeting
Body: { title: "Meeting Title" }
Response: { data: { id: "meeting-id" } }
```

#### Get Participant Token
```
POST /get-participant-token
Body: {
  meetingId: "meeting-id",
  name: "Participant Name",
  preset_name: "group_call_host" | "group_call_participant"
}
Response: { data: { token: "auth-token" } }
```

## Troubleshooting

### Screen Share Not Working

**Issue**: Host cannot share screen or participants cannot see screen share

**Solutions**:
1. **Check Permissions**: Ensure `can_produce: 'ALLOWED'` for host preset
2. **Check Consumption**: Ensure `can_consume: 'ALLOWED'` for participants
3. **Browser Permissions**: Allow screen sharing in browser settings
4. **Room Joined**: Wait for `roomJoined` event before enabling screen share
5. **Preset Configuration**: Verify `max_screenshare_count` is set (default: 2)

### Video/Audio Not Working

**Issue**: Camera or microphone not detected

**Solutions**:
1. **Setup Screen**: Enable `showSetupScreen={true}` for device testing
2. **Browser Permissions**: Grant camera/mic permissions in browser
3. **Defaults**: Set `defaults: { audio: true, video: true }` in initMeeting
4. **Device Selection**: Use setup screen to select correct devices

### Meeting Not Loading

**Issue**: Stuck on "Setting up your meeting..."

**Solutions**:
1. **Token Validation**: Check auth token is valid and not expired
2. **Network**: Verify backend API is reachable
3. **Preset Initialization**: Ensure presets are created before joining
4. **Console Logs**: Check browser console for specific errors

## Best Practices

### 1. **Preset Initialization**
- Initialize presets once on app startup
- Use `initializePresets()` before creating meetings
- Handle preset already exists errors gracefully

### 2. **Error Handling**
- Always wrap Dyte API calls in try-catch
- Provide user-friendly error messages
- Log errors for debugging

### 3. **State Management**
- Track meeting state (roomJoined, screenShareEnabled, etc.)
- Use event listeners for state updates
- Clean up listeners on component unmount

### 4. **Performance**
- Use `mode="fill"` for optimal layout
- Limit max video streams based on device (mobile: 4, desktop: 9)
- Enable HD quality only when bandwidth permits

### 5. **Security**
- Never expose API keys in frontend code
- Use backend proxy for Dyte API calls
- Validate meeting IDs before joining
- Implement waiting rooms for sensitive meetings

## Dependencies

```json
{
  "@dytesdk/react-ui-kit": "^3.0.8",
  "@dytesdk/react-web-core": "^3.1.11",
  "@chakra-ui/react": "^2.10.0",
  "lucide-react": "^0.447.0"
}
```

## Environment Variables

```env
# Backend API
VITE_EUREKA_API_URL=https://eureka.innotrat.in/api/v1

# Dyte Credentials (Backend Only - DO NOT expose in frontend)
DYTE_ORG_ID=your-org-id
DYTE_API_KEY=your-api-key
```

## Testing

### Manual Testing Checklist

- [ ] Host can create meeting
- [ ] Host can share screen
- [ ] Host can toggle camera/mic
- [ ] Participant can join via link
- [ ] Participant can see host's screen share
- [ ] Participant can toggle camera/mic
- [ ] Chat works between host and participants
- [ ] Participant list shows all users
- [ ] Leave meeting works correctly
- [ ] Invite link copies to clipboard
- [ ] Setup screen shows device options
- [ ] Error messages display correctly

### Browser Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Edge 90+
- ✅ Safari 14+
- ⚠️ Mobile browsers (limited screen share support)

## Support

For issues or questions:
1. Check browser console for errors
2. Verify Dyte SDK versions are up to date
3. Review Dyte documentation: https://docs.dyte.io
4. Check backend API status

## Version History

- **v1.3** (2024-11-14): Optimized Google Meet-like features, removed custom controls
- **v1.2** (2024-11-13): Added comprehensive screen share support
- **v1.1** (2024-11-10): Enhanced preset configuration
- **v1.0** (2024-11-08): Initial Dyte integration
