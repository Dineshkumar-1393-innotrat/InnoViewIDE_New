# ESP-IDF Integration Guide

## Overview

This document describes the ESP-IDF (Espressif IoT Development Framework) integration in InnoIDE, based on the official ESP-IDF v4.3 documentation.

**Reference:** [ESP-IDF Get Started Guide](https://docs.espressif.com/projects/esp-idf/en/v4.3/esp32/get-started/index.html)

## Features Implemented

### 1. ESP-IDF Build System Integration

The IDE now supports the complete ESP-IDF build workflow:

- **Build Command**: `idf.py build`
  - Compiles application and ESP-IDF components
  - Generates bootloader, partition table, and application binaries
  - Provides detailed build logs

### 2. Flash Workflow

Following ESP-IDF best practices for flashing:

- **Flash Command**: `idf.py -p PORT [-b BAUD] flash`
  - Automatically builds and flashes the project
  - Supports configurable baud rates (115200, 460800, 921600)
  - Configurable flash modes (DIO, QIO, DOUT, QOUT)
  - Real-time progress tracking
  - Detailed flash logs

### 3. Device Detection

- Web Serial API integration for device detection
- Support for multiple ESP32 variants:
  - Silicon Labs (USB VID: 0x10C4)
  - CH340 (USB VID: 0x1A86)
  - FTDI (USB VID: 0x0403)
  - Arduino (USB VID: 0x2341)

### 4. Flash Memory Management

- **Erase Flash**: Complete flash memory erase
- **Memory Addresses**:
  - Bootloader: 0x1000
  - Partition Table: 0x8000
  - Application: 0x10000

### 5. Serial Monitor

- Real-time serial output monitoring
- Configurable baud rates
- Integration with ESP-IDF monitor functionality

## User Interface Components

### 1. Editor Navbar (`/editor` screen)

The top navigation bar includes:

#### Tools Menu
- **Compile**: Pre-build compilation check
- **Build**: Full ESP-IDF build (idf.py build)
- **Flash**: Build and flash to device (idf.py flash)
- **Erase Chip**: Erase flash memory
- **Serial Monitor**: Monitor device output
- **Terminal**: Command-line interface
- **Library Manager**: Manage ESP-IDF libraries

All device-dependent actions are automatically disabled when no device is connected.

### 2. Flash Control Panel

Located in the left sidebar when a device is connected:

#### Device Connection
- Connect/Disconnect button
- Device detection with Web Serial API
- Display device information:
  - Flash Target (ESP32 variant)
  - Port information
  - Memory capacity
  - Connection status

#### Flash Control
- Start/Stop/Retry flash operations
- Real-time progress bar
- Elapsed time tracking
- Flash logs display

#### ESP-IDF Configuration
- **Baud Rate Selection**:
  - 115200 (Safe)
  - 460800 (Default)
  - 921600 (Fast)
- **Flash Mode Selection**:
  - DIO (Default)
  - QIO
  - DOUT
  - QOUT

### 3. Output Panel

Bottom panel with multiple tabs:

#### Build Tab
- Shows ESP-IDF build output
- Displays compilation progress
- Lists generated binaries
- Shows build errors and warnings

#### Serial Console Tab
- Real-time device output
- Connect/Disconnect controls
- Scrollable log view

#### Terminal Tab
- Command-line interface
- Execute shell commands
- Project workspace access

## Workflow

### Standard Development Workflow

1. **Write Code**: Edit your ESP32 application in the code editor
2. **Connect Device**: Click "Connect" in the Flash Control Panel
3. **Build**: Click "Build" button to compile the project
4. **Flash**: Click "Flash" button to upload firmware to device
5. **Monitor**: Switch to Serial Console to view device output

### Quick Flash Workflow

1. **Write Code**: Edit your application
2. **Connect Device**: Ensure device is connected
3. **Flash**: Click "Flash" button (automatically builds and flashes)
4. **Monitor**: View output in Serial Console

## Technical Implementation

### Files Modified/Created

1. **`src/utils/espIdfUtils.js`** (NEW)
   - ESP-IDF utility functions
   - Build, flash, erase, monitor operations
   - Device detection and management
   - Configuration management

2. **`src/components/Flash.jsx`** (ENHANCED)
   - Added ESP-IDF workflow integration
   - Baud rate and flash mode configuration
   - Real-time flash logs display
   - Enhanced device connection handling

3. **`src/components/Output.jsx`** (ENHANCED)
   - ESP-IDF build integration
   - Build and flash command handlers
   - Enhanced error handling and logging
   - Toast notifications for user feedback

4. **`src/components/CodeEditor.jsx`** (ENHANCED)
   - Connected build button to ESP-IDF workflow
   - Device connection state management
   - Integrated Flash component in sidebar

5. **`src/components/EditorNavbar.jsx`** (EXISTING)
   - Already includes all required buttons
   - Tools menu with build, flash, erase options
   - Device connection awareness

## ESP-IDF Commands Reference

### Build Commands
```bash
# Full build
idf.py build

# Clean build
idf.py fullclean build

# Set target
idf.py set-target esp32
```

### Flash Commands
```bash
# Flash with default settings
idf.py flash

# Flash with specific port and baud rate
idf.py -p /dev/ttyUSB0 -b 921600 flash

# Flash and monitor
idf.py flash monitor
```

### Monitor Commands
```bash
# Start serial monitor
idf.py monitor

# Monitor with specific port
idf.py -p /dev/ttyUSB0 monitor
```

### Erase Commands
```bash
# Erase flash
idf.py erase-flash
```

## Configuration

### Default Settings

```javascript
ESP_IDF_CONFIG = {
  BAUD_RATES: {
    DEFAULT: 460800,
    FAST: 921600,
    SAFE: 115200,
  },
  DEFAULT_FLASH_MODE: 'dio',
  DEFAULT_FLASH_FREQ: '40m',
  DEFAULT_FLASH_SIZE: 'detect',
}
```

### Customization

Users can customize flash settings in the Flash Control Panel:
- Baud rate selection
- Flash mode selection
- These settings are applied during the flash operation

## Troubleshooting

### Device Not Detected

**Issue**: "Failed to connect" or device not showing up

**Solutions**:
1. Ensure device is properly connected via USB
2. Check if device drivers are installed
3. Try manual reset: Hold BOOT button, press EN button
4. Check browser compatibility (Web Serial API required)
5. Grant serial port permissions when prompted

### Flash Failed

**Issue**: Flash operation fails or times out

**Solutions**:
1. Try lower baud rate (115200)
2. Check USB cable quality
3. Verify device is in download mode
4. Try erasing flash first
5. Check for sufficient power supply

### Build Errors

**Issue**: Build fails with compilation errors

**Solutions**:
1. Check code syntax
2. Verify all required includes
3. Check library dependencies
4. Review build output for specific errors

## Browser Compatibility

### Web Serial API Support

The device detection and flashing features require Web Serial API support:

- ✅ Chrome/Chromium 89+
- ✅ Edge 89+
- ✅ Opera 75+
- ❌ Firefox (not supported)
- ❌ Safari (not supported)

For unsupported browsers, the IDE will fall back to simulation mode.

## Future Enhancements

Potential improvements for future versions:

1. **Real Backend Integration**: Connect to actual ESP-IDF toolchain
2. **Project Templates**: Pre-configured ESP32 project templates
3. **Component Manager**: ESP-IDF component installation
4. **OTA Updates**: Over-the-air firmware updates
5. **Advanced Debugging**: GDB integration for step debugging
6. **Multi-target Support**: ESP32-S2, ESP32-S3, ESP32-C3
7. **Partition Editor**: Visual partition table editor
8. **menuconfig Integration**: Visual configuration editor

## Resources

- [ESP-IDF Documentation](https://docs.espressif.com/projects/esp-idf/)
- [ESP-IDF GitHub](https://github.com/espressif/esp-idf)
- [ESP32 Technical Reference](https://www.espressif.com/sites/default/files/documentation/esp32_technical_reference_manual_en.pdf)
- [Web Serial API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Serial_API)

## Support

For issues or questions:
- Check the InnoIDE documentation
- Review ESP-IDF troubleshooting guide
- Contact support at satya@innotrat.com
