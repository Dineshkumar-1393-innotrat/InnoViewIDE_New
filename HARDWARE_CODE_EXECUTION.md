# Hardware Code Execution Guide

## Understanding Code Execution vs Flashing

InnoIDE supports two different ways to work with your code:

### 1. **Run Button** (Online Execution)
- Uses Piston API online compiler
- Executes **standard C/C++ code only**
- No hardware dependencies allowed
- Good for testing algorithms and logic

### 2. **Flash Button** (Hardware Upload)
- Uses ESP-IDF toolchain
- Uploads to **actual ESP32/Arduino hardware**
- Supports all hardware-specific functions
- Required for GPIO, WiFi, Bluetooth, etc.

## ⚠️ Common Error: Hardware Code in Run Button

### Error Message:
```
fatal error: freertos/FreeRTOS.h: No such file or directory
fatal error: Arduino.h: No such file or directory
```

### Why This Happens:
You're trying to **Run** hardware-specific code using the online compiler, which doesn't have ESP32/Arduino libraries installed.

### Solution:
Use the **Flash** button instead of the **Run** button!

## 📋 Code Type Reference

### ✅ Can Use "Run" Button

**Standard C code without hardware dependencies:**

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main() {
    printf("Hello, World!\n");
    
    // Math operations
    int sum = 5 + 10;
    printf("Sum: %d\n", sum);
    
    // String operations
    char name[] = "InnoIDE";
    printf("Name: %s\n", name);
    
    return 0;
}
```

**What works:**
- ✅ Standard I/O (`printf`, `scanf`)
- ✅ Math operations
- ✅ String manipulation
- ✅ Arrays and pointers
- ✅ Loops and conditionals
- ✅ Functions and recursion
- ✅ Standard C libraries (`stdio.h`, `stdlib.h`, `string.h`, `math.h`)

### ❌ Must Use "Flash" Button

**ESP32/Arduino code with hardware functions:**

```c
#include <Arduino.h>
#include "freertos/FreeRTOS.h"

const int ledPin = 2;

void setup() {
    pinMode(ledPin, OUTPUT);
    Serial.begin(115200);
}

void loop() {
    digitalWrite(ledPin, HIGH);
    delay(1000);
    digitalWrite(ledPin, LOW);
    delay(1000);
}
```

**What requires Flash:**
- ❌ Arduino.h
- ❌ FreeRTOS headers
- ❌ ESP32 headers (esp_*, driver/*)
- ❌ GPIO functions (pinMode, digitalWrite, digitalRead)
- ❌ Analog functions (analogRead, analogWrite)
- ❌ Serial communication (Serial.begin, Serial.print)
- ❌ WiFi, Bluetooth
- ❌ Timers, interrupts
- ❌ Hardware peripherals (I2C, SPI, UART)

## 🎯 Workflow Guide

### For Learning/Testing Algorithms (Use Run)

1. Write standard C code
2. Click **"Run"** button
3. View output immediately
4. No hardware needed

**Example Use Cases:**
- Learning C programming
- Testing sorting algorithms
- String manipulation practice
- Math calculations
- Data structure implementations

### For Hardware Projects (Use Flash)

1. Write ESP32/Arduino code
2. **Connect your device** (Click "Connect" in Flash Control Panel)
3. Click **"Flash"** button
4. Wait for upload to complete
5. Click **"Serial Monitor"** to view output

**Example Use Cases:**
- LED control
- Sensor reading
- WiFi connectivity
- Bluetooth communication
- Motor control
- IoT projects

## 🔄 Quick Decision Tree

```
Do you need to control hardware (LEDs, sensors, WiFi, etc.)?
│
├─ YES → Use "Flash" button
│         (Requires connected device)
│
└─ NO  → Use "Run" button
          (Works without device)
```

## 🛠️ Error Detection

The IDE now automatically detects hardware-specific code and shows a helpful message:

**If you click "Run" on hardware code, you'll see:**
```
⚠️ Hardware-specific code detected!

This code contains ESP32/Arduino hardware functions that cannot 
be executed in the online compiler.

To run this code:
1. Connect your ESP32/Arduino device
2. Click the 'Flash' button to upload to hardware
3. Use 'Serial Monitor' to view output

The 'Run' button only works for standard C code without 
hardware dependencies.
```

## 📝 Converting Hardware Code to Testable Code

If you want to test logic without hardware, you can create a simulation version:

### Original Hardware Code:
```c
#include <Arduino.h>

void setup() {
    pinMode(13, OUTPUT);
}

void loop() {
    digitalWrite(13, HIGH);
    delay(1000);
    digitalWrite(13, LOW);
    delay(1000);
}
```

### Testable Version (for Run button):
```c
#include <stdio.h>

// Simulate LED state
int ledState = 0;

void toggleLED() {
    ledState = !ledState;
    printf("LED is now: %s\n", ledState ? "ON" : "OFF");
}

int main() {
    printf("Starting LED blink simulation\n");
    
    for (int i = 0; i < 10; i++) {
        toggleLED();
        printf("Waiting 1 second...\n");
    }
    
    printf("Simulation complete\n");
    return 0;
}
```

## 🔍 Troubleshooting

### Issue: "Run" button shows compilation errors
**Cause**: Code contains hardware-specific headers or functions
**Solution**: Use "Flash" button instead, or remove hardware dependencies

### Issue: "Flash" button not working
**Cause**: Device not connected
**Solution**: 
1. Click "Connect" in Flash Control Panel
2. Select your device from browser dialog
3. Grant serial port permissions

### Issue: Want to test logic without hardware
**Solution**: Create a simulation version using standard C (see example above)

## 💡 Best Practices

1. **Prototype algorithms with "Run"** first using standard C
2. **Test on hardware with "Flash"** once logic is verified
3. **Use Serial Monitor** to debug hardware issues
4. **Keep hardware code separate** from pure logic when possible
5. **Comment your code** to indicate which parts need hardware

## 🎓 Learning Path

### Beginner:
1. Start with "Run" button and standard C
2. Learn basic programming concepts
3. Practice without hardware

### Intermediate:
1. Move to "Flash" button
2. Connect actual hardware
3. Learn GPIO and basic peripherals

### Advanced:
1. Combine both approaches
2. Test logic with "Run"
3. Deploy to hardware with "Flash"
4. Use Serial Monitor for debugging

## 📚 Related Documentation

- `ESP_IDF_INTEGRATION.md` - ESP-IDF flashing details
- `EDITOR_BUTTONS_GUIDE.md` - Button reference guide
- `PISTON_API_FIX.md` - Online compiler details

## ✅ Summary

| Feature | Run Button | Flash Button |
|---------|-----------|--------------|
| **Requires Device** | ❌ No | ✅ Yes |
| **Speed** | ⚡ Instant | 🐢 ~10 seconds |
| **Hardware Functions** | ❌ No | ✅ Yes |
| **Standard C** | ✅ Yes | ✅ Yes |
| **Arduino/ESP32** | ❌ No | ✅ Yes |
| **Best For** | Learning, Testing | Real Projects |

**Remember**: 
- 🏃 **Run** = Online compiler for standard C
- ⚡ **Flash** = Upload to real hardware for ESP32/Arduino
