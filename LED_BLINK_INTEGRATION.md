# LED Blink Integration Guide

This guide explains how to use the LED blinking functionality in InnoIDE for ESP32 and Arduino devices.

## Features

- **LED Blink Code Templates**: Pre-built code snippets for Arduino and ESP32
- **Visual Flash Panel**: Interactive controls for LED blinking operations
- **Event-Based Integration**: Easy integration with external hardware libraries
- **Real-time Control**: Start/stop LED blinking with configurable delay

## Quick Start

### 1. Using LED Blink Templates

1. Navigate to the `/editor` route in your IDE
2. Click on the **Language Selector** dropdown
3. Choose either:
   - `arduino (1.8.19)` for Arduino boards
   - `esp32 (2.0.14)` for ESP32 boards
4. The editor will load a pre-configured LED blink code template

### 2. LED Blink Template Code

#### ESP32 Template (GPIO 2)
```cpp
// LED Blink Example for ESP32
// Define the LED pin (built-in LED on most ESP32 boards is GPIO 2)
const int ledPin = 2;

void setup() {
  // Initialize the digital pin as an output
  pinMode(ledPin, OUTPUT);
  Serial.begin(115200);
  Serial.println("ESP32 LED Blink Started");
}

void loop() {
  digitalWrite(ledPin, HIGH);   // Turn the LED on
  Serial.println("LED ON");
  delay(1000);                  // Wait for 1 second
  digitalWrite(ledPin, LOW);    // Turn the LED off
  Serial.println("LED OFF");
  delay(1000);                  // Wait for 1 second
}
```

#### Arduino Template (GPIO 13)
```cpp
// LED Blink Example for Arduino
// Define the LED pin (built-in LED on most Arduino boards is pin 13)
const int ledPin = 13;

void setup() {
  // Initialize the digital pin as an output
  pinMode(ledPin, OUTPUT);
}

void loop() {
  digitalWrite(ledPin, HIGH);   // Turn the LED on
  delay(1000);                  // Wait for 1 second
  digitalWrite(ledPin, LOW);    // Turn the LED off
  delay(1000);                  // Wait for 1 second
}
```

### 3. Using the Flash Panel

The Flash panel provides visual controls for LED blinking:

1. **Open Flash Panel**: Click the "Flash" button in the Tools menu or toolbar
2. **Configure LED Pin**: Select the GPIO pin (default: GPIO 2 for ESP32, GPIO 13 for Arduino)
3. **Set Blink Delay**: Use the slider to set delay between blinks (100ms - 3000ms)
4. **Start Blinking**: Click "Start Blink" to begin
5. **Stop Blinking**: Click "Stop Blink" to stop

#### Available GPIO Pins
- GPIO 2 (Built-in ESP32)
- GPIO 13 (Arduino)
- GPIO 5
- GPIO 12
- GPIO 14
- GPIO 16

## Integration with External Libraries

### Custom Event System

The LED blink functionality dispatches custom events that you can listen to:

#### Events

1. **`innoide:led-blink-start`**
   - Triggered when LED blinking starts
   - Detail: `{ pin, delay }`

2. **`innoide:led-blink`**
   - Triggered on each LED state change
   - Detail: `{ pin, state, delay, count }`

3. **`innoide:led-blink-stop`**
   - Triggered when LED blinking stops
   - Detail: `{ pin, totalBlinks }`

4. **`innoide:flash-start`**
   - Triggered when flash operation starts

5. **`innoide:flash-complete`**
   - Triggered when flash operation completes

### Example Integration

See `src/utils/ledBlinkIntegration.js` for a complete integration example.

#### Basic Event Listener

```javascript
// Listen for LED blink events
window.addEventListener('innoide:led-blink-start', (event) => {
  const { pin, delay } = event.detail;
  console.log(`Starting blink on GPIO ${pin} with ${delay}ms delay`);
  
  // Send to your hardware library
  yourHardwareLibrary.startBlink(pin, delay);
});

window.addEventListener('innoide:led-blink', (event) => {
  const { pin, state } = event.detail;
  
  // Update hardware LED state
  yourHardwareLibrary.digitalWrite(pin, state ? 'HIGH' : 'LOW');
});

window.addEventListener('innoide:led-blink-stop', (event) => {
  const { pin, totalBlinks } = event.detail;
  console.log(`Stopped after ${Math.floor(totalBlinks / 2)} blinks`);
  
  // Turn off LED
  yourHardwareLibrary.digitalWrite(pin, 'LOW');
});
```

### Integration with Web Serial API

For browser-based hardware communication:

```javascript
let port;

async function connectToDevice() {
  port = await navigator.serial.requestPort();
  await port.open({ baudRate: 115200 });
}

window.addEventListener('innoide:led-blink', async (event) => {
  const { pin, state } = event.detail;
  const command = `LED:${pin}:${state ? 'HIGH' : 'LOW'}\n`;
  
  if (port && port.writable) {
    const writer = port.writable.getWriter();
    await writer.write(new TextEncoder().encode(command));
    writer.releaseLock();
  }
});
```

### Integration with Electron + SerialPort

For desktop applications:

```javascript
const SerialPort = require('serialport');
const port = new SerialPort('/dev/ttyUSB0', { baudRate: 115200 });

window.addEventListener('innoide:led-blink', (event) => {
  const { pin, state } = event.detail;
  const command = `LED:${pin}:${state ? 'HIGH' : 'LOW'}\n`;
  
  port.write(command, (err) => {
    if (err) console.error('Error writing to port:', err);
  });
});
```

## Workflow

### Typical Development Workflow

1. **Select Language**: Choose `arduino` or `esp32` from the language selector
2. **Edit Code**: Modify the LED blink template or write your own code
3. **Compile**: Use the Tools menu to compile your code
4. **Flash**: Click "Flash" in the Tools menu to upload to device
5. **Test Blink**: Use the Flash panel's LED Blink Control to test
6. **Monitor**: Watch the Serial Monitor for debug output

### Hardware Setup

#### ESP32
- Connect ESP32 to your computer via USB
- Built-in LED is typically on GPIO 2
- Some boards use GPIO 5 or other pins

#### Arduino
- Connect Arduino to your computer via USB
- Built-in LED is typically on pin 13
- External LEDs can be connected to any digital pin

## Customization

### Custom Pin Configuration

You can add more pins to the Flash panel by modifying `src/components/Flash.jsx`:

```jsx
<Select value={ledPin} onChange={(e) => setLedPin(Number(e.target.value))}>
  <option value={2}>GPIO 2 (Built-in ESP32)</option>
  <option value={13}>GPIO 13 (Arduino)</option>
  <option value={YOUR_PIN}>GPIO {YOUR_PIN} (Your Label)</option>
</Select>
```

### Custom Blink Patterns

You can extend the functionality to support different blink patterns by modifying the Flash component or creating custom code templates in `src/constants.js`.

## Troubleshooting

### LED Not Blinking
1. Check if the correct GPIO pin is selected
2. Verify hardware connection
3. Check Serial Monitor for errors
4. Ensure code is flashed to device

### Connection Issues
1. Check USB cable connection
2. Verify correct COM port/device
3. Check driver installation
4. Try different USB port

### Events Not Firing
1. Check browser console for errors
2. Verify event listeners are registered
3. Check if Flash panel is properly loaded

## Additional Resources

- [ESP32 Documentation](https://docs.espressif.com/projects/esp-idf/en/latest/esp32/)
- [Arduino Reference](https://www.arduino.cc/reference/en/)
- [Web Serial API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Serial_API)

## Support

For issues or questions, contact the InnoIDE development team.
