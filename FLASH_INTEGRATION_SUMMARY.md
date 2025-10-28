# Flash Integration & Serial Console Implementation

## Overview
This document describes the implementation of the ESP32 code flashing feature and serial console monitoring.

## Changes Made

### 1. API Integration (`src/api.js`)
Added new function `submitCodeToDevice()` that:
- Submits ESP32 code to `https://admin.innotrat.in/submit-code`
- Sends code with language and timestamp
- Handles errors with detailed messages
- 30-second timeout for network requests

**Usage:**
```javascript
import { submitCodeToDevice } from "../api";

const result = await submitCodeToDevice(sourceCode, "esp32");
```

### 2. Flash Button Handler (`src/components/Output.jsx`)
Modified `handleCodeFlash()` function to:
- Call the new `submitCodeToDevice()` API
- Automatically switch to Serial Console view after flashing
- Display real-time status messages
- Show toast notifications for success/failure
- Clear and initialize serial output

**Flow:**
1. User clicks "Flash" button
2. Code is submitted to device API
3. View switches to Serial Console
4. Success/error messages displayed
5. Serial monitor shows LED blink output

### 3. Serial Console Enhancement (`src/components/Output.jsx`)
Improved serial console with:
- **LED Blink Simulation**: Shows "LED ON" / "LED OFF" every 1 second
- **Color-Coded Messages**:
  - 🔴 Red: ERROR messages
  - 🔵 Blue: INFO messages
  - 🟡 Yellow: DEBUG messages
  - 🟢 Green: DATA messages and LED ON
  - ⚪ Gray: LED OFF
- **Clear Button**: Clears serial output
- **Connect/Disconnect**: Toggle serial monitoring
- **Auto-scroll**: Keeps last 50 lines
- **Max Height**: 300px with scrollbar

## How to Use

### For Users:
1. **Connect Physical Device**: Plug your ESP32/Arduino into a USB port
2. **Select Port**: 
   - Click "Select Port" or "Detect" button in the Flash panel
   - Choose your device from the Port Selection Modal
   - OR click "Add New Device" to connect a new one
3. **Verify Connection**: Check for green "Connected" badge in Output panel
4. **Write ESP32 Code**: Use the code editor to write your ESP32 code
5. **Flash Code**: Click the "Flash" button in the Output panel
6. **Monitor Output**: View real-time serial output in the Serial Console tab
7. **See LED Blink**: The serial monitor will show LED ON/OFF messages

### Example ESP32 Code:
```c
#include <stdio.h>
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "driver/gpio.h"
#include "esp_log.h"

#define BLINK_GPIO 2

static const char *TAG = "LED_BLINK";

void app_main(void)
{
    gpio_reset_pin(BLINK_GPIO);
    gpio_set_direction(BLINK_GPIO, GPIO_MODE_OUTPUT);

    while (1) {
        gpio_set_level(BLINK_GPIO, 1);
        ESP_LOGI(TAG, "LED ON");
        vTaskDelay(1000 / portTICK_PERIOD_MS);

        gpio_set_level(BLINK_GPIO, 0);
        ESP_LOGI(TAG, "LED OFF");
        vTaskDelay(1000 / portTICK_PERIOD_MS);
    }
}
```

## API Endpoint Details

### POST `https://admin.innotrat.in/submit-code`

**Request Body:**
```json
{
  "code": "string (ESP32 source code)",
  "language": "string (default: esp32)",
  "timestamp": "string (ISO 8601 format)"
}
```

**Response:**
- Success: Returns device response data
- Error: Returns error message with status code

**Error Handling:**
- 400: Invalid code submission
- 404: Device endpoint not found
- 500+: Server unavailable
- Timeout: Network connection issue

## Features

### ✅ Implemented
- [x] API function to submit code to device
- [x] Flash button calls the API
- [x] Serial console displays real-time logs
- [x] Color-coded log messages
- [x] LED blink simulation
- [x] Toast notifications
- [x] Error handling
- [x] Auto-switch to serial console on flash
- [x] Clear button for serial output
- [x] Connect/Disconnect toggle
- [x] **Port selection modal with device list**
- [x] **Automatic device detection**
- [x] **Multiple device support**
- [x] **Device type identification (ESP32, Arduino, etc.)**
- [x] **Visual device status badge**
- [x] **Persistent device connection (localStorage)**
- [x] **"Select Port" and "Detect" buttons**
- [x] **Add new device functionality**

### 🔄 Simulated (for demo purposes)
- Serial output is currently simulated
- Real device integration requires actual ESP32 hardware
- LED blink messages generated every 1 second

## Testing

To test the integration:
1. Open the IDE
2. Load the ESP32 LED blink code
3. Click "Flash" button
4. Observe:
   - Toast notification appears
   - View switches to Serial Console
   - Serial output shows connection messages
   - LED ON/OFF messages appear every second
   - Color-coded messages display correctly

## Notes

- The Flash button requires a device to be connected (checked via device connection state)
- Serial console automatically connects when flashing starts
- The simulation mimics real ESP32 behavior with 1-second intervals
- Actual LED blinking on hardware depends on the device API response
- Maximum 50 serial output lines are kept in memory

## Troubleshooting

**Issue**: Flash button disabled
- **Solution**: Connect a device first using the Flash panel

**Issue**: No serial output
- **Solution**: Click "Connect" in the Serial Monitor

**Issue**: API timeout
- **Solution**: Check network connection and device availability

**Issue**: LED not blinking on hardware
- **Solution**: Verify device is properly connected and API endpoint is working
