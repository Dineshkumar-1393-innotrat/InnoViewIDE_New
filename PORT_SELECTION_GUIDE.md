# Port Selection & Device Detection Guide

## Overview
This guide explains the enhanced port selection and automatic device detection features for ESP32/Arduino devices.

## Features Implemented

### 1. **Automatic Device Detection**
When you click the "Detect" or "Select Port" button, the system:
- Scans for all previously authorized USB serial devices
- Identifies device type based on USB Vendor ID
- Displays device information (type, port, memory)
- Opens a selection modal if devices are found

### 2. **Port Selection Modal**
A user-friendly modal that shows:
- **List of detected devices** with:
  - Device type (ESP32, Arduino, etc.)
  - USB port information (VID/PID)
  - Memory capacity
  - Clickable cards for easy selection
- **"Add New Device" button** to connect additional devices
- **Visual feedback** with hover effects

### 3. **Supported Devices**
The system automatically recognizes:
- **ESP32** (VID: 0x10C4 - Silicon Labs)
- **ESP32-S/C Series** (VID: 0x303A - Espressif)
- **ESP32/Arduino Compatible** (VID: 0x1A86 - CH340 chip)
- **Arduino** (VID: 0x2341)
- **FTDI Devices** (VID: 0x0403)
- **Generic Serial Devices**

### 4. **Device Status Display**
- **Green badge** in Output panel showing connected device
- **Device type and memory** displayed prominently
- **Persistent connection** across page refreshes (localStorage)
- **Visual indicators** in Flash panel

## How to Use

### Step 1: Connect Your Device
1. Plug your ESP32/Arduino into a USB port
2. Navigate to the Flash panel (right sidebar)

### Step 2: Detect Devices
Choose one of these methods:

**Method A: Auto-Detect**
1. Click the **"Detect"** button in the Flash panel
2. System scans for authorized devices
3. If found, selection modal opens automatically
4. If not found, browser prompts for device permission

**Method B: Manual Selection**
1. Click the **"Select Port"** button
2. Port selection modal opens
3. Choose from detected devices or add new one

### Step 3: Select Your Device
1. In the Port Selection Modal:
   - **Click on a device card** to select it
   - OR click **"Add New Device"** to connect a new one
2. Browser may ask for permission (first time only)
3. Device information appears in both panels

### Step 4: Flash Your Code
1. Write your ESP32 code in the editor
2. Verify device is connected (green badge visible)
3. Click the **"Flash"** button
4. Code is submitted to device
5. Monitor output in Serial Console

## UI Components

### Flash Panel (Right Sidebar)
```
┌─────────────────────────────────┐
│ Device Connection               │
│ ┌─────────────────────────────┐ │
│ │ Flash Target: ESP32         │ │
│ │ Port: USB (VID: 10C4)       │ │
│ │ Memory: 4MB                 │ │
│ │ Status: Connected ✓         │ │
│ └─────────────────────────────┘ │
│ [Disconnect] [Select Port] [Detect] │
└─────────────────────────────────┘
```

### Port Selection Modal
```
┌─────────────────────────────────────┐
│ Select Device Port              [X] │
├─────────────────────────────────────┤
│ Select a device from the list:     │
│                                     │
│ ┌─────────────────────────────┐   │
│ │ ESP32                       │   │
│ │ USB (VID: 10C4, PID: EA60)  │   │
│ │ Memory: 4MB        [Select] │   │
│ └─────────────────────────────┘   │
│                                     │
│ ┌─────────────────────────────┐   │
│ │ Arduino Compatible          │   │
│ │ USB (VID: 1A86, PID: 7523)  │   │
│ │ Memory: 4MB        [Select] │   │
│ └─────────────────────────────┘   │
│                                     │
│ ─────────────────────────────────  │
│ [+ Add New Device]                 │
│                                     │
│                        [Cancel]     │
└─────────────────────────────────────┘
```

### Output Panel (Bottom)
```
┌─────────────────────────────────────┐
│ ✓ Connected | ESP32 | 4MB          │
├─────────────────────────────────────┤
│ [Flash] [Run] [Build] [Serial Console] [Terminal] │
└─────────────────────────────────────┘
```

## Technical Details

### Device Detection Flow
```
User clicks "Detect" or "Select Port"
    ↓
scanForDevices() called
    ↓
Check for Web Serial API support
    ↓
Get previously authorized ports
    ↓
For each port:
    - Get port info (VID/PID)
    - Identify device type
    - Add to detected devices list
    ↓
Open Port Selection Modal
    ↓
User selects device
    ↓
selectDevice() called
    ↓
Update device info state
    ↓
Dispatch 'device-detect-complete' event
    ↓
Enable Flash button
    ↓
Save to localStorage
```

### USB Vendor IDs
| VID    | Manufacturer      | Common Devices        |
|--------|-------------------|-----------------------|
| 0x2341 | Arduino           | Arduino boards        |
| 0x10C4 | Silicon Labs      | ESP32 (CP210x)        |
| 0x1A86 | QinHeng (CH340)   | ESP32/Arduino clones  |
| 0x0403 | FTDI              | FTDI USB-Serial       |
| 0x303A | Espressif         | ESP32-S2/S3/C3        |

### State Management
Device connection state is persisted using:
- **localStorage**: Survives page refreshes
- **Custom events**: Synchronizes across components
- **React state**: Real-time UI updates

### Key Functions

#### `scanForDevices()`
- Scans for all authorized serial ports
- Identifies device types
- Opens selection modal

#### `requestNewPort()`
- Prompts user to select a new device
- Requests browser permission
- Adds device to list

#### `selectDevice(device)`
- Sets selected port
- Updates device info
- Dispatches connection event
- Saves to localStorage

#### `disconnectDevice()`
- Closes serial port
- Clears device info
- Removes from localStorage

## Troubleshooting

### Issue: No devices detected
**Solutions:**
1. Click "Add New Device" to manually select
2. Ensure device is properly connected
3. Check USB cable is data-capable (not charge-only)
4. Try a different USB port

### Issue: Device not recognized
**Solutions:**
1. Install device drivers (CH340, CP210x, etc.)
2. Check Device Manager (Windows) or System Info (Mac)
3. Reconnect the device
4. Try "Refresh" button

### Issue: Permission denied
**Solutions:**
1. Browser blocks serial access - grant permission
2. Close other applications using the port
3. Disconnect and reconnect device
4. Clear browser cache and try again

### Issue: Flash button disabled
**Solutions:**
1. Select a device using "Select Port" or "Detect"
2. Verify green "Connected" badge is visible
3. Check device status in Flash panel
4. Reconnect if status shows "Disconnected"

### Issue: Connection lost during flash
**Solutions:**
1. Check USB cable connection
2. Ensure device has stable power
3. Close other serial monitor applications
4. Reconnect and try again

## Browser Compatibility

### Web Serial API Support
✅ **Supported:**
- Chrome 89+
- Edge 89+
- Opera 75+

❌ **Not Supported:**
- Firefox (fallback to simulation mode)
- Safari (fallback to simulation mode)

**Note:** In unsupported browsers, a simulated device mode is available for testing.

## Best Practices

1. **Always select device before flashing**
   - Use "Select Port" or "Detect" button
   - Verify green badge appears

2. **Keep device connected**
   - Don't unplug during flash operation
   - Ensure stable USB connection

3. **One device at a time**
   - Disconnect unused devices
   - Reduces confusion and errors

4. **Check device status**
   - Green badge = ready to flash
   - No badge = need to connect

5. **Use appropriate drivers**
   - Install manufacturer drivers
   - Keep drivers updated

## Example Workflow

```
1. Connect ESP32 to USB port
2. Click "Select Port" button
3. Port Selection Modal opens
4. Click on "ESP32" device card
5. Green badge appears: "✓ Connected | ESP32 | 4MB"
6. Write code in editor
7. Click "Flash" button
8. View output in Serial Console
9. See LED blinking on device
```

## API Integration

When flashing, the selected device info is available:
```javascript
{
  deviceType: "ESP32",
  memory: "4MB",
  port: {
    usbVendorId: 0x10C4,
    usbProductId: 0xEA60
  }
}
```

This information can be sent to the backend API for device-specific optimizations.

## Summary

The port selection feature provides:
- ✅ Automatic device detection
- ✅ User-friendly selection interface
- ✅ Multiple device support
- ✅ Persistent connections
- ✅ Visual feedback
- ✅ Error handling
- ✅ Browser compatibility fallbacks

Users can now easily select their ESP32/Arduino device and flash code with confidence!
