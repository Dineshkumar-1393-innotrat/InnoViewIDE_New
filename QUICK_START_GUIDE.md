# Quick Start Guide - ESP32 Flash & Serial Console

## 🚀 Getting Started in 3 Steps

### Step 1: Connect Your Device 🔌
```
Physical Connection:
┌─────────────┐         USB Cable         ┌──────────────┐
│   ESP32     │ ◄─────────────────────► │   Computer   │
│   Device    │                           │              │
└─────────────┘                           └──────────────┘
```

**What to do:**
- Plug your ESP32/Arduino into any USB port
- Wait for device to power on (LED may light up)
- No drivers? Install CH340 or CP210x drivers first

---

### Step 2: Select Port in IDE 🎯

**Option A: Auto-Detect**
1. Click **"Detect"** button in Flash panel (right sidebar)
2. System scans and shows Port Selection Modal
3. Click on your device card
4. Done! ✅

**Option B: Manual Select**
1. Click **"Select Port"** button in Flash panel
2. Port Selection Modal opens
3. Choose from list OR click "Add New Device"
4. Browser asks permission (first time only)
5. Select your ESP32 device
6. Done! ✅

**Visual Confirmation:**
```
✓ Connected | ESP32 | 4MB
```
This green badge appears at the top of Output panel

---

### Step 3: Flash Your Code ⚡

1. **Write Code** in the editor (or use example below)
2. **Click "Flash"** button in Output panel
3. **Watch Serial Console** for output
4. **See LED blink** on your device!

---

## 📝 Example Code (Copy & Paste)

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

---

## 🎨 IDE Layout

```
┌────────────────────────────────────────────────────────────────┐
│  InnoIDE - ESP32 Development                                   │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────────────┐  ┌─────────────────────────┐│
│  │                              │  │  FLASH PANEL            ││
│  │                              │  │                         ││
│  │      CODE EDITOR             │  │  Device Connection      ││
│  │                              │  │  ┌───────────────────┐  ││
│  │  #include <stdio.h>          │  │  │ ESP32             │  ││
│  │  #include "freertos..."      │  │  │ USB (VID: 10C4)   │  ││
│  │                              │  │  │ 4MB               │  ││
│  │  void app_main(void) {       │  │  │ ✓ Connected       │  ││
│  │    ...                       │  │  └───────────────────┘  ││
│  │  }                           │  │                         ││
│  │                              │  │  [Disconnect]           ││
│  │                              │  │  [Select Port] [Detect] ││
│  │                              │  │                         ││
│  └──────────────────────────────┘  └─────────────────────────┘│
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  OUTPUT PANEL                                            │  │
│  │  ✓ Connected | ESP32 | 4MB                              │  │
│  │  ┌────────────────────────────────────────────────────┐ │  │
│  │  │ [Flash] [Run] [Build] [Serial Console] [Terminal] │ │  │
│  │  └────────────────────────────────────────────────────┘ │  │
│  │                                                          │  │
│  │  Serial Console                                         │  │
│  │  Monitor device logs and USART output in real time.    │  │
│  │  ┌────────────────────────────────────────────────────┐│  │
│  │  │ [12:30:45] LED ON                                  ││  │
│  │  │ [12:30:46] LED OFF                                 ││  │
│  │  │ [12:30:47] LED ON                                  ││  │
│  │  │ [12:30:48] LED OFF                                 ││  │
│  │  │ [12:30:49] [INFO] Device initialized               ││  │
│  │  │ [12:30:51] [DATA] Sensor reading: 42               ││  │
│  │  └────────────────────────────────────────────────────┘│  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────┘
```

---

## 🎯 Port Selection Modal

When you click "Select Port" or "Detect":

```
┌─────────────────────────────────────────────┐
│  Select Device Port                     [X] │
├─────────────────────────────────────────────┤
│  Select a device from the list below:       │
│                                              │
│  ┌─────────────────────────────────────┐   │
│  │  ESP32                              │   │
│  │  USB (VID: 10C4, PID: EA60)         │   │
│  │  Memory: 4MB              [Select]  │   │
│  └─────────────────────────────────────┘   │
│                                              │
│  ┌─────────────────────────────────────┐   │
│  │  Arduino Compatible                 │   │
│  │  USB (VID: 1A86, PID: 7523)         │   │
│  │  Memory: 32KB             [Select]  │   │
│  └─────────────────────────────────────┘   │
│                                              │
│  ────────────────────────────────────────   │
│  [+ Add New Device]                         │
│                                              │
│                              [Cancel]        │
└─────────────────────────────────────────────┘
```

**What each button does:**
- **Device Card**: Click anywhere to select that device
- **Add New Device**: Connect a new device not in the list
- **Cancel**: Close without selecting

---

## 🔄 Complete Workflow

```
1. CONNECT DEVICE
   └─► Plug ESP32 into USB
   
2. DETECT DEVICE
   └─► Click "Detect" or "Select Port"
   
3. SELECT FROM LIST
   └─► Choose your ESP32 from modal
   
4. VERIFY CONNECTION
   └─► See green badge: "✓ Connected | ESP32"
   
5. WRITE CODE
   └─► Type or paste ESP32 code
   
6. FLASH CODE
   └─► Click "Flash" button
   
7. MONITOR OUTPUT
   └─► Switch to "Serial Console" tab
   
8. SEE RESULTS
   └─► LED blinks on device
   └─► Serial shows: "LED ON" / "LED OFF"
```

---

## 🎨 Button Guide

### Flash Panel Buttons

| Button | What It Does |
|--------|--------------|
| **Select Port** | Opens port selection modal to choose device |
| **Detect** | Auto-scans for devices and opens selection modal |
| **Disconnect** | Disconnects current device |
| **Refresh** | Re-scans for the same device |

### Output Panel Buttons

| Button | What It Does | Requires Device? |
|--------|--------------|------------------|
| **Flash** | Uploads code to device | ✅ Yes |
| **Run** | Runs code in simulator | ✅ Yes |
| **Build** | Compiles code only | ✅ Yes |
| **Serial Console** | Shows device output | ❌ No |
| **Terminal** | Command line interface | ❌ No |

---

## ✅ Success Indicators

**Device Connected:**
```
✓ Connected | ESP32 | 4MB
```
- Green badge at top of Output panel
- Flash button is enabled (blue)
- Device info shown in Flash panel

**Flash Successful:**
```
Toast Notification: "Flash Successful!"
Serial Console: "[INFO] Code submitted successfully"
Serial Console: "[INFO] Flashing firmware to device..."
```

**LED Blinking:**
```
[12:30:45] LED ON
[12:30:46] LED OFF
[12:30:47] LED ON
[12:30:48] LED OFF
```

---

## ❌ Troubleshooting

### Problem: No devices detected

**Solutions:**
1. ✅ Check USB cable (must be data cable, not charge-only)
2. ✅ Try different USB port
3. ✅ Install device drivers (CH340 or CP210x)
4. ✅ Click "Add New Device" to manually select
5. ✅ Restart browser and try again

---

### Problem: Flash button is disabled

**Solutions:**
1. ✅ Click "Select Port" or "Detect" button
2. ✅ Choose a device from the list
3. ✅ Verify green "Connected" badge appears
4. ✅ Check device is still plugged in

---

### Problem: Permission denied

**Solutions:**
1. ✅ Browser blocks serial access - click "Allow"
2. ✅ Close Arduino IDE or other serial monitors
3. ✅ Disconnect and reconnect device
4. ✅ Try a different browser (Chrome recommended)

---

### Problem: LED not blinking

**Solutions:**
1. ✅ Check LED is connected to GPIO pin 2
2. ✅ Verify code was flashed successfully
3. ✅ Look for errors in Serial Console
4. ✅ Try pressing reset button on ESP32
5. ✅ Check power supply is adequate

---

## 🌐 Browser Support

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome 89+ | ✅ Full | Recommended |
| Edge 89+ | ✅ Full | Works great |
| Opera 75+ | ✅ Full | Fully supported |
| Firefox | ⚠️ Limited | Simulation mode only |
| Safari | ⚠️ Limited | Simulation mode only |

**Note:** Web Serial API is required for real device connection.

---

## 📚 Additional Resources

- **Full Documentation**: See `FLASH_INTEGRATION_SUMMARY.md`
- **Port Selection Guide**: See `PORT_SELECTION_GUIDE.md`
- **ESP32 Documentation**: https://docs.espressif.com/
- **Arduino Reference**: https://www.arduino.cc/reference/

---

## 🎓 Tips & Best Practices

1. **Always select device before flashing**
   - Don't skip the port selection step
   - Verify green badge is visible

2. **Keep device connected**
   - Don't unplug during flash
   - Use a stable USB connection

3. **Monitor Serial Console**
   - Switch to Serial Console tab after flashing
   - Watch for LED ON/OFF messages

4. **Check for errors**
   - Red messages indicate errors
   - Read error messages carefully

5. **Use appropriate GPIO pins**
   - GPIO 2 is common for built-in LED
   - Check your board's pinout diagram

---

## 🎉 You're Ready!

Follow these 3 steps and you'll be flashing ESP32 code in no time:

1. **Connect** your ESP32 device
2. **Select Port** using the modal
3. **Flash** your code and watch it run!

Happy coding! 🚀
