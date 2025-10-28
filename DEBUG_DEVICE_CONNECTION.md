# Debug Device Connection Issue

## Problem
Flash button shows "Connect a device" even after device is connected.

## Debugging Steps

### Step 1: Open Browser Console
1. Press `F12` or `Ctrl+Shift+I` (Windows) / `Cmd+Option+I` (Mac)
2. Click on the **Console** tab
3. Keep it open while testing

### Step 2: Connect Device
1. Click "Select Port" or "Detect" button in Flash panel
2. Select your device from the modal
3. Watch the console for these messages:

**Expected Console Output:**
```
Device selected, dispatching event: {deviceType: "ESP32", memory: "4MB", ...}
Output: Device connect event received {deviceType: "ESP32", ...}
Output: Device connection state updated to true
```

### Step 3: Check Flash Button
1. Look for the green badge at top of Output panel:
   ```
   ✓ Connected | ESP32 | 4MB
   ```
2. Click the "Flash" button
3. Watch console for:

**If Working:**
```
Flash button clicked. Device connected: true
Selected device info: {deviceType: "ESP32", ...}
```

**If Not Working:**
```
Flash button clicked. Device connected: false
Selected device info: null
Flash blocked: No device connected
```

### Step 4: Check localStorage
In the console, type:
```javascript
localStorage.getItem('innoide:device-connected')
localStorage.getItem('innoide:device-info')
```

**Expected:**
```
"true"
"{\"deviceType\":\"ESP32\",\"memory\":\"4MB\",...}"
```

## Common Issues & Fixes

### Issue 1: Event Not Firing
**Symptom:** No "Device selected" message in console

**Fix:**
1. Refresh the page
2. Try selecting device again
3. Check if Flash component is loaded

### Issue 2: Event Received But State Not Updated
**Symptom:** See "Device connect event received" but Flash button still disabled

**Fix:**
1. Check if there are any JavaScript errors in console
2. Try clearing localStorage:
   ```javascript
   localStorage.clear()
   ```
3. Refresh page and reconnect device

### Issue 3: localStorage Not Persisting
**Symptom:** Device disconnects on page refresh

**Fix:**
1. Check browser privacy settings
2. Ensure cookies/localStorage are enabled
3. Try in incognito mode to test

### Issue 4: Multiple Output Components
**Symptom:** Events firing but wrong component receiving them

**Fix:**
1. Ensure only one Output component is mounted
2. Check React component tree in React DevTools

## Manual Fix (Temporary)

If device is connected but Flash button won't work, run this in console:

```javascript
// Force enable Flash button
localStorage.setItem('innoide:device-connected', 'true');
localStorage.setItem('innoide:device-info', JSON.stringify({
  deviceType: 'ESP32',
  memory: '4MB',
  port: 'USB'
}));

// Dispatch event manually
window.dispatchEvent(new CustomEvent('innoide:device-detect-complete', {
  detail: {
    deviceType: 'ESP32',
    memory: '4MB',
    port: 'USB'
  }
}));

// Refresh page
location.reload();
```

## Verification Checklist

- [ ] Console shows "Device selected, dispatching event"
- [ ] Console shows "Output: Device connect event received"
- [ ] Console shows "Output: Device connection state updated to true"
- [ ] Green badge appears in Output panel
- [ ] Flash button is enabled (not grayed out)
- [ ] localStorage has 'innoide:device-connected' = 'true'
- [ ] localStorage has 'innoide:device-info' with device data

## Report Issue

If problem persists, provide:
1. Screenshot of console messages
2. Browser name and version
3. Device type (ESP32, Arduino, etc.)
4. Steps taken before error

## Additional Debugging

### Check React State
Install React DevTools extension, then:
1. Find `Output` component in component tree
2. Check state values:
   - `isDeviceConnectedForActions` should be `true`
   - `selectedDeviceInfo` should have device data

### Check Event Listeners
In console:
```javascript
// Check if event listeners are registered
getEventListeners(window)
```

Look for `innoide:device-detect-complete` in the list.

### Force Re-render
In console:
```javascript
// Trigger a re-render by dispatching event
window.dispatchEvent(new CustomEvent('innoide:device-detect-complete', {
  detail: {
    deviceType: 'ESP32',
    memory: '4MB',
    port: { usbVendorId: 0x10C4 }
  }
}));
```

## Success Indicators

✅ **Device Connected Successfully:**
- Green badge visible: "✓ Connected | ESP32 | 4MB"
- Flash button enabled (blue, not grayed)
- Console shows all connection events
- localStorage has device data
- No errors in console

❌ **Device Not Connected:**
- No green badge
- Flash button disabled (grayed out)
- Console shows "Flash blocked: No device connected"
- localStorage empty or 'false'

## Next Steps

After following these steps:
1. If working: Great! You can flash your code
2. If not working: Share console output for further debugging
3. If partially working: Note which step fails
