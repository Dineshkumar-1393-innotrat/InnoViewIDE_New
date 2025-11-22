# Dyte Video Meeting - Testing Guide

## Quick Start Testing

### 1. Start the Application
```bash
npm run dev
```

### 2. Test Host Features

#### Create a Meeting
1. Click the **Video icon** button in the navbar
2. Wait for "Meeting Ready" toast notification
3. You should see the Dyte setup screen
4. Click "Join" to enter the meeting

#### Test Camera & Microphone
- ✅ Camera preview should appear in setup screen
- ✅ Click camera icon to toggle video on/off
- ✅ Click microphone icon to toggle audio on/off
- ✅ Test different devices in settings

#### Test Screen Sharing
1. Wait for meeting to fully load (you'll see video grid)
2. Click the **Screen Share** button in the control bar
3. Select window/screen to share
4. Click "Share"
5. ✅ Your screen should appear in the main view
6. ✅ "Screen sharing active" toast should appear
7. Click screen share button again to stop

#### Copy Invite Link
1. Click **"Copy Invite Link"** button (top-right)
2. ✅ "Invite link copied" toast should appear
3. Link format: `http://localhost:5173/join/{meeting-id}`

### 3. Test Participant Features

#### Join as Participant
1. Open the invite link in a **new browser window** (or incognito)
2. Enter your name (e.g., "Test Participant")
3. Click "Join Meeting"
4. ✅ Should see setup screen
5. Click "Join" to enter meeting

#### View Host's Screen Share
1. Host starts screen sharing (from step 2)
2. ✅ Participant should see host's screen in main view
3. ✅ "Screen Share Active" indicator should appear
4. ✅ Screen should update in real-time

#### Test Participant Controls
- ✅ Can toggle own camera on/off
- ✅ Can toggle own microphone on/off
- ✅ **Cannot** start screen sharing (button disabled/hidden)
- ✅ Can see participant list
- ✅ Can use chat
- ✅ Can leave meeting

## Expected Behavior

### ✅ Host Capabilities
- Create meetings
- Share screen with audio
- Control own camera/mic
- See all participants
- Kick participants (if needed)
- End meeting for all

### ✅ Participant Capabilities
- Join via invite link
- View host's screen share
- Control own camera/mic
- See other participants
- Use chat
- Leave meeting

### ❌ Participant Restrictions
- Cannot share screen (by default)
- Cannot kick other participants
- Cannot end meeting for others

## Common Issues & Solutions

### Issue: "Meeting not loading"
**Solution**: 
- Check browser console for errors
- Verify backend API is running: `https://eureka.innotrat.in/api/v1`
- Clear browser cache and reload

### Issue: "Screen share not working"
**Solution**:
- Grant screen sharing permission in browser
- Use Chrome or Firefox (best support)
- Wait for "Room joined" before sharing
- Check console for permission errors

### Issue: "Camera/Mic not detected"
**Solution**:
- Grant camera/mic permissions in browser
- Check device is not used by another app
- Try different browser
- Use setup screen to select correct device

### Issue: "Participant can't see screen share"
**Solution**:
- Ensure host has started screen sharing
- Check participant's network connection
- Refresh participant's browser
- Verify preset configuration allows `can_consume: 'ALLOWED'`

### Issue: "Video quality is poor"
**Solution**:
- Check network bandwidth
- Reduce number of video streams
- Lower video quality in settings
- Close other bandwidth-heavy apps

## Browser Console Logs

### Successful Meeting Creation
```
🔧 Initializing Dyte presets...
✅ Presets initialized successfully
🚀 Creating Dyte session as HOST...
✅ Host session created
📋 Meeting ID: abc123...
🎥 Initializing Dyte meeting...
✅ Meeting instance created, waiting for room join...
✅ Dyte meeting initialized successfully
✅ Room joined successfully - all features now available
```

### Successful Screen Share
```
🎥 Host screen share status changed: true
📺 Screen share is now active and should be visible to participants
```

### Successful Participant Join
```
🎫 Fetching participant token for: abc123...
✅ Token received successfully
🎥 Initializing Dyte meeting...
✅ Meeting initialized successfully
📺 Participant view - Screen share status: Active
```

## Testing Checklist

### Pre-Meeting
- [ ] Application starts without errors
- [ ] Video button is visible in navbar
- [ ] Backend API is accessible

### Host Flow
- [ ] Can click video button to start meeting
- [ ] Setup screen appears with device preview
- [ ] Can select camera/microphone devices
- [ ] Can join meeting from setup screen
- [ ] Meeting loads successfully
- [ ] Can see own video feed
- [ ] Can toggle camera on/off
- [ ] Can toggle microphone on/off
- [ ] Can start screen sharing
- [ ] Screen share appears in main view
- [ ] Can stop screen sharing
- [ ] Can copy invite link
- [ ] Invite link is valid format
- [ ] Can leave meeting

### Participant Flow
- [ ] Can open invite link
- [ ] Join form appears with meeting ID
- [ ] Can enter name
- [ ] Can join meeting
- [ ] Setup screen appears
- [ ] Can join from setup screen
- [ ] Meeting loads successfully
- [ ] Can see own video feed
- [ ] Can see host's video feed
- [ ] Can see host's screen share (when active)
- [ ] Can toggle own camera on/off
- [ ] Can toggle own microphone on/off
- [ ] Cannot start screen sharing
- [ ] Can see participant list
- [ ] Can use chat
- [ ] Can leave meeting

### Multi-Participant
- [ ] Multiple participants can join same meeting
- [ ] All participants see each other
- [ ] All participants see host's screen share
- [ ] Chat works between all participants
- [ ] Participant list updates in real-time
- [ ] Leaving doesn't affect others

## Performance Testing

### Network Conditions
- Test on good connection (>10 Mbps)
- Test on moderate connection (2-5 Mbps)
- Test on poor connection (<1 Mbps)

### Device Testing
- Desktop Chrome
- Desktop Firefox
- Desktop Edge
- Mobile Chrome (Android)
- Mobile Safari (iOS)

### Load Testing
- 2 participants
- 5 participants
- 10 participants
- 20+ participants (if needed)

## Debug Mode

Enable debug logging by opening browser console:
```javascript
// Enable verbose Dyte logs
localStorage.setItem('dyte:debug', '*');

// Disable debug logs
localStorage.removeItem('dyte:debug');
```

## API Testing

### Test Backend Endpoints

#### Create Meeting
```bash
curl -X POST https://eureka.innotrat.in/api/v1/create-meeting \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Meeting"}'
```

#### Get Participant Token
```bash
curl -X POST https://eureka.innotrat.in/api/v1/get-participant-token \
  -H "Content-Type: application/json" \
  -d '{
    "meetingId":"your-meeting-id",
    "name":"Test User",
    "preset_name":"group_call_participant"
  }'
```

## Success Criteria

### ✅ All Features Working
- Host can create meetings
- Host can share screen
- Participants can join
- Participants can view screen share
- Audio/video works for all
- Chat and participant list functional
- No console errors
- Smooth performance

### ✅ Google Meet-like Experience
- Clean, modern UI
- Intuitive controls
- Fast loading times
- Reliable screen sharing
- Good video/audio quality
- Responsive design

## Next Steps After Testing

1. **Production Deployment**
   - Set up production backend
   - Configure environment variables
   - Test on production domain

2. **Feature Enhancements**
   - Recording functionality
   - Virtual backgrounds
   - Breakout rooms
   - Polls and reactions

3. **Monitoring**
   - Set up error tracking (Sentry)
   - Monitor API usage
   - Track user metrics

## Support Resources

- **Dyte Documentation**: https://docs.dyte.io
- **Dyte SDK Reference**: https://docs.dyte.io/react-ui-kit
- **Browser Compatibility**: https://docs.dyte.io/guides/capabilities/browser-compatibility
- **Troubleshooting**: See `DYTE_IMPLEMENTATION.md`
