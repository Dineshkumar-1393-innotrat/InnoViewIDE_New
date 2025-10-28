# ESP32 Arduino Libraries - Quick Reference

## 📡 WiFi & Networking

| Library | Use Case | Quick Start |
|---------|----------|-------------|
| **WiFi** | Connect to WiFi networks | `WiFi.begin(ssid, password)` |
| **WiFiClientSecure** | HTTPS/TLS connections | `client.connect(host, 443)` |
| **WiFiProv** | WiFi provisioning via BLE/SoftAP | `WiFiProv.beginProvision()` |
| **WebServer** | Create HTTP server | `server.on("/", handleRoot)` |
| **HTTPClient** | Make HTTP requests | `http.GET()` |
| **ESPmDNS** | Local network discovery | `MDNS.begin("esp32")` |
| **DNSServer** | Custom DNS server | `dnsServer.start()` |

## 🔵 Bluetooth

| Library | Use Case | Quick Start |
|---------|----------|-------------|
| **BluetoothSerial** | Classic Bluetooth UART | `SerialBT.begin("ESP32")` |
| **ESP32 BLE Arduino** | Bluetooth Low Energy | `BLEDevice::init("ESP32")` |
| **SimpleBLE** | Simple BLE advertiser | `SimpleBLE.begin()` |

## 💾 Storage

| Library | Use Case | Quick Start |
|---------|----------|-------------|
| **SPIFFS** | Flash file system | `SPIFFS.begin()` |
| **LittleFS** | Modern flash FS | `LittleFS.begin()` |
| **SD** | SD card (SPI) | `SD.begin(CS_PIN)` |
| **SD_MMC** | SD card (SDMMC) | `SD_MMC.begin()` |
| **FFat** | FAT file system | `FFat.begin()` |
| **EEPROM** | Non-volatile storage | `EEPROM.begin(size)` |
| **Preferences** | Key-value storage | `preferences.begin("app")` |

## 🔌 Hardware Interfaces

| Library | Use Case | Quick Start |
|---------|----------|-------------|
| **Wire** | I2C communication | `Wire.begin(SDA, SCL)` |
| **SPI** | SPI communication | `SPI.begin()` |
| **I2S** | Audio/digital audio | `I2S.begin()` |

## 🔄 Updates & OTA

| Library | Use Case | Quick Start |
|---------|----------|-------------|
| **ArduinoOTA** | WiFi OTA updates | `ArduinoOTA.begin()` |
| **HTTPUpdate** | HTTP firmware update | `httpUpdate.update()` |
| **HTTPUpdateServer** | Web update server | `httpUpdater.setup(&server)` |
| **Update** | Update API | `Update.begin(size)` |

## ⏱️ Timing

| Library | Use Case | Quick Start |
|---------|----------|-------------|
| **Ticker** | Timed callbacks | `ticker.attach(1.0, callback)` |

## 🔧 Device Management

| Library | Use Case | Quick Start |
|---------|----------|-------------|
| **ESP Insights** | Remote diagnostics | `esp_insights_init()` |
| **ESP RainMaker** | IoT cloud platform | `RMaker.init()` |

## 🌐 Advanced Networking

| Library | Use Case | Quick Start |
|---------|----------|-------------|
| **ESP32 Async UDP** | Async UDP | `udp.listen(port)` |
| **Ethernet** | Wired ethernet | `ETH.begin()` |
| **NetBIOS** | Windows name resolution | `NBNS.begin("esp32")` |

## 🔋 Hardware

| Library | Use Case | Quick Start |
|---------|----------|-------------|
| **USB** | ESP32-S2 USB | `USB.begin()` |
| **FS** | File system base | Base for all FS libs |

---

## 🎯 Common Use Cases

### Web Server with WiFi
```cpp
#include <WiFi.h>
#include <WebServer.h>

WiFi.begin(ssid, password);
WebServer server(80);
server.on("/", handleRoot);
server.begin();
```

### BLE Beacon
```cpp
#include <BLEDevice.h>
#include <BLEServer.h>

BLEDevice::init("ESP32");
BLEServer *pServer = BLEDevice::createServer();
pServer->startAdvertising();
```

### File Storage
```cpp
#include <SPIFFS.h>

SPIFFS.begin(true);
File file = SPIFFS.open("/data.txt", FILE_WRITE);
file.println("Hello!");
file.close();
```

### OTA Updates
```cpp
#include <WiFi.h>
#include <ArduinoOTA.h>

WiFi.begin(ssid, password);
ArduinoOTA.begin();
// In loop: ArduinoOTA.handle();
```

### I2C Sensor
```cpp
#include <Wire.h>

Wire.begin(21, 22); // SDA, SCL
Wire.beginTransmission(address);
Wire.write(data);
Wire.endTransmission();
```

---

## 📋 Pin Defaults (ESP32 DevKit)

- **I2C**: SDA=21, SCL=22
- **SPI**: MISO=19, MOSI=23, SCK=18, CS=5
- **UART**: TX=1, RX=3
- **Built-in LED**: GPIO 2
- **SD Card (SPI)**: CS=5
- **SD Card (MMC)**: CMD=15, CLK=14, D0=2, D1=4, D2=12, D3=13

---

## 💡 Quick Tips

1. **Always check WiFi.status()** before network operations
2. **Use Preferences** instead of EEPROM for ESP32
3. **LittleFS is faster** than SPIFFS for most cases
4. **BLE uses less power** than Classic Bluetooth
5. **ArduinoOTA requires WiFi** to be connected first
6. **HTTPClient needs WiFi.h** to be included
7. **Wire.begin() can specify** custom SDA/SCL pins
8. **Ticker callbacks** should be short and fast

---

## 🔗 Library Combinations

### IoT Device (WiFi + MQTT + OTA)
- WiFi
- ArduinoOTA
- PubSubClient (external)
- Preferences

### BLE Sensor (BLE + Battery + Sleep)
- ESP32 BLE Arduino
- Wire (for sensors)
- Preferences
- esp_sleep functions

### Web Dashboard (WiFi + WebServer + WebSocket)
- WiFi
- WebServer
- ESPmDNS
- SPIFFS (for HTML)

### Data Logger (SD + RTC + Sensors)
- SD or SD_MMC
- Wire (I2C sensors)
- SPI (SPI sensors)

---

**Use the Library Manager** (Tools → Library Manager) to quickly add these libraries to your project!
