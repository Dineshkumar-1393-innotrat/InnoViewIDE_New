# Editor Screen Buttons Guide

## Overview

This guide describes all the buttons available in the `/editor` screen for ESP-IDF flashing and development workflow.

## Button Locations

### 1. Top Navigation Bar (EditorNavbar)

Located at the very top of the editor screen.

#### Tools Menu Dropdown

Click on **"Tools"** in the navigation bar to access:

| Button | Icon | Function | Requires Device |
|--------|------|----------|----------------|
| **Compile** | ⚙️ | Pre-build compilation check | No |
| **Build** | 🔨 | Full ESP-IDF project build (idf.py build) | Yes |
| **Debugger** | 🐛 | Start/Stop debugger | Yes |
| **Flash** | ⚡ | Build and flash firmware to device (idf.py flash) | Yes |
| **Erase Chip** | 🗑️ | Erase flash memory completely | Yes |
| **Serial Monitor** | 📡 | Open/Close serial monitor | Yes |
| **Terminal** | 💻 | Open/Close terminal | No |
| **Library Manager** | 📚 | Manage ESP-IDF libraries | No |

**Note**: Buttons requiring a device will be disabled (grayed out) until you connect an ESP32 device.

### 2. Left Sidebar - Flash Control Panel

Appears when a device is connected.

#### Device Connection Section

| Button | Function |
|--------|----------|
| **Connect** | Opens device selection dialog (Web Serial API) |
| **Disconnect** | Disconnects current device |
| **Refresh** | Re-detect connected device |

#### Flash Control Section

| Button | Icon | Function |
|--------|------|----------|
| **Start Flash** | ▶️ | Begin flashing process |
| **Stop Flash** | ⏹️ | Abort current flash operation |
| **Retry Flash** | 🔄 | Retry failed flash operation |

#### Configuration Dropdowns

| Setting | Options | Default |
|---------|---------|---------|
| **Baud Rate** | 115200 (Safe), 460800 (Default), 921600 (Fast) | 460800 |
| **Flash Mode** | DIO, QIO, DOUT, QOUT | DIO |

### 3. Bottom Panel - Output Section

Located at the bottom of the editor.

| Button | Function | Description |
|--------|----------|-------------|
| **Flash** | Flash firmware | Build and flash in one operation |
| **Run** | Execute code | Run code on connected device |
| **Build** | Build project | ESP-IDF build only (no flash) |
| **Serial Console** | Open serial monitor | View device output in real-time |
| **Terminal** | Open terminal | Execute shell commands |

## Typical Workflows

### Workflow 1: First Time Flash

1. Write your ESP32 code in the editor
2. Click **"Connect"** in the Flash Control Panel (left sidebar)
3. Select your ESP32 device from the browser dialog
4. Click **"Build"** in the bottom panel to verify compilation
5. Click **"Flash"** in the bottom panel to upload firmware
6. Click **"Serial Console"** to view device output

### Workflow 2: Quick Flash (Recommended)

1. Write/modify your code
2. Ensure device is connected (check Flash Control Panel)
3. Click **"Flash"** in the bottom panel (builds and flashes automatically)
4. View output in Serial Console

### Workflow 3: Using Tools Menu

1. Write your code
2. Click **"Tools"** → **"Build"** to compile
3. Click **"Tools"** → **"Flash"** to upload
4. Click **"Tools"** → **"Serial Monitor"** to view output

### Workflow 4: Erase and Reflash

1. Click **"Tools"** → **"Erase Chip"** to clear flash memory
2. Confirm the erase operation
3. Click **"Flash"** to upload new firmware

## Button States

### Enabled State
- Button is clickable
- Full color/opacity
- Shows normal cursor on hover

### Disabled State
- Button is grayed out
- Reduced opacity (50%)
- Shows "not-allowed" cursor
- Tooltip explains why disabled (e.g., "Connect a device to use this feature")

### Loading State
- Button shows spinner animation
- Text changes (e.g., "Flashing...", "Building...")
- Button is temporarily disabled during operation

## Visual Indicators

### Device Connection Status

In the Flash Control Panel:
- 🟢 **Green**: Connected
- 🟡 **Yellow**: Detecting...
- 🔴 **Red**: Disconnected

### Flash Progress

- **Progress Bar**: Shows 0-100% completion
- **Status Text**: Displays current operation
- **Elapsed Time**: Shows time since flash started
- **Flash Logs**: Real-time log output (when available)

## Keyboard Shortcuts

While keyboard shortcuts aren't explicitly shown, you can:
- Press **Enter** in Terminal to execute commands
- Use **Ctrl+S** to save files (standard browser behavior)

## Troubleshooting

### "No Device Connected" Error

**Problem**: Buttons are disabled or show error message

**Solution**:
1. Click **"Connect"** in Flash Control Panel
2. Grant browser permission to access serial port
3. Select your ESP32 device from the list

### Flash Button Not Working

**Problem**: Flash operation fails immediately

**Solution**:
1. Check device connection (green status indicator)
2. Verify USB cable is properly connected
3. Try lower baud rate (115200)
4. Check if device is in bootloader mode

### Build Button Shows Error

**Problem**: Build fails with errors

**Solution**:
1. Check code syntax in the editor
2. Review error messages in the output panel
3. Ensure all required libraries are included
4. Check ESP-IDF configuration

## Tips

1. **Always connect device first** before attempting to flash
2. **Use "Build" before "Flash"** to catch errors early
3. **Monitor Serial Console** after flashing to verify operation
4. **Try different baud rates** if flashing is unreliable
5. **Use "Erase Chip"** if experiencing persistent issues
6. **Check Flash Logs** for detailed error information

## Browser Requirements

For device connection and flashing:
- ✅ Chrome 89+ (Recommended)
- ✅ Edge 89+
- ✅ Opera 75+
- ❌ Firefox (Web Serial API not supported)
- ❌ Safari (Web Serial API not supported)

## Quick Reference Card

```
┌─────────────────────────────────────────────────────────┐
│ TOP BAR: Tools Menu                                     │
│  ⚙️ Compile  🔨 Build  ⚡ Flash  🗑️ Erase  📡 Monitor  │
├─────────────────────────────────────────────────────────┤
│ LEFT SIDEBAR: Flash Control                             │
│  [Connect Device]  [Disconnect]                         │
│  ▶️ Start  ⏹️ Stop  🔄 Retry                            │
│  Baud: [460800 ▼]  Mode: [DIO ▼]                       │
├─────────────────────────────────────────────────────────┤
│ BOTTOM PANEL: Quick Actions                             │
│  [Flash] [Run] [Build] [Serial Console] [Terminal]     │
└─────────────────────────────────────────────────────────┘
```

## Support

For additional help:
- See `ESP_IDF_INTEGRATION.md` for technical details
- Contact: satya@innotrat.com
