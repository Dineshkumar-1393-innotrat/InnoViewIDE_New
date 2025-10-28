# Library Manager Implementation Guide

## ✅ Complete Implementation

The InnoIDE now includes a comprehensive **Library Manager** supporting both **ESP32 Arduino Framework** and **STM32 HAL** libraries.

---

## 📚 Features

### ESP32 Arduino Framework Libraries (32 libraries)
All official ESP32 Arduino libraries are included:

#### **Communication Libraries**
- **ArduinoOTA** - Over-the-Air firmware updates
- **ESP32 Async UDP** - Asynchronous UDP communication
- **ESP32 BLE Arduino** - Bluetooth Low Energy support
- **BluetoothSerial** - Classic Bluetooth UART bridge
- **DNSServer** - Simple DNS server
- **ESPmDNS** - mDNS responder
- **Ethernet** - Ethernet connectivity
- **HTTPClient** - HTTP client
- **HTTPUpdate** - HTTP-based firmware updates
- **HTTPUpdateServer** - Web-based firmware update server
- **NetBIOS** - Windows network name resolution
- **SimpleBLE** - Simple BLE advertiser
- **USB** - ESP32-S2 USB support
- **WebServer** - Web server library
- **WiFi** - WiFi connectivity
- **WiFiClientSecure** - Secure WiFi (TLS/SSL)
- **WiFiProv** - WiFi provisioning (SoftAP/BLE)

#### **Data Storage Libraries**
- **EEPROM** - Flash-based EEPROM emulation
- **FFat** - FAT file system
- **FS** - Base file system
- **LittleFS** - Little File System
- **Preferences** - Non-volatile storage
- **SD** - SD card support
- **SD_MMC** - SD card via SDMMC
- **SPIFFS** - SPI Flash File System

#### **Signal I/O Libraries**
- **I2S** - Inter-IC Sound bus
- **SPI** - Serial Peripheral Interface
- **Wire** - I2C (Two-Wire Interface)

#### **Device Management**
- **ESP Insights** - Remote monitoring and diagnostics
- **ESP RainMaker** - IoT cloud platform
- **Update** - Firmware update library

#### **Timing**
- **Ticker** - Interval-based callbacks

#### **Examples**
- **ESP32** - Example sketches collection

### STM32 HAL Libraries (13 libraries)
Standard STM32 HAL/LL peripheral libraries:

- **STM32 HAL** - Hardware Abstraction Layer (Core)
- **STM32 GPIO** - General Purpose I/O
- **STM32 UART** - UART/USART communication
- **STM32 I2C** - I2C communication
- **STM32 SPI** - SPI communication
- **STM32 ADC** - Analog to Digital Converter
- **STM32 Timer** - Timer/Counter peripherals
- **STM32 PWM** - Pulse Width Modulation
- **STM32 DMA** - Direct Memory Access
- **STM32 RTC** - Real-Time Clock
- **STM32 CAN** - Controller Area Network
- **STM32 USB** - USB Device/Host
- **STM32 Flash** - Flash memory operations

---

## 🚀 How to Use

### Step 1: Open Library Manager

**Method 1 - Via Tools Menu:**
1. Navigate to `/editor` route
2. Click **Tools** in the navbar
3. Click **Library Manager**

**Method 2 - Via Event (Programmatic):**
```javascript
window.dispatchEvent(new CustomEvent('innoide:libraries-open'));
```

### Step 2: Select Platform

The Library Manager automatically detects your platform based on the selected language:
- **ESP32/Arduino** - Shown when `esp32` or `arduino` language is selected
- **STM32** - Shown for other embedded platforms

You can also manually switch between platforms using the platform selector buttons.

### Step 3: Search and Filter

**Search:**
- Use the search bar to find libraries by name, description, or author
- Example: Search "WiFi" to find all WiFi-related libraries

**Filter by Category:**
- Click category buttons to filter libraries
- Categories include: Communication, Data Storage, Signal I/O, Device Management, Timing, Core, Examples

### Step 4: Browse Library Details

Click on any library to expand and view:

**Includes Tab:**
- Shows required header files
- Click "Copy" to copy individual includes
- Click "Add to Editor" to insert all includes at the top of your code

**Examples Tab (if available):**
- View example code snippets
- Click "Copy code" to copy to clipboard
- Click "Insert" to add example code to your editor

**Info Tab:**
- Library name and version
- Author information
- Category
- Full description

---

## 💡 Usage Examples

### Example 1: Adding WiFi to ESP32 Project

1. Select **esp32** language in editor
2. Open Library Manager (Tools → Library Manager)
3. Search for "WiFi"
4. Click on **WiFi** library
5. Go to **Includes** tab
6. Click **Add to Editor**
7. Result: `#include <WiFi.h>` is added to your code
8. Go to **Examples** tab
9. Click **Insert** on "WiFiScan" example
10. Complete WiFi scanning code is added!

### Example 2: Using Multiple Libraries

For a complete ESP32 web server with OTA:

1. Add **WiFi** library includes
2. Add **WebServer** library includes
3. Add **ArduinoOTA** library includes
4. Insert example code from each
5. Combine into your project

### Example 3: STM32 GPIO Setup

1. Switch platform to **STM32 HAL**
2. Find **STM32 GPIO** library
3. Insert GPIO initialization example
4. Modify pin numbers for your board

---

## 🎨 Library Manager UI

```
┌─────────────────────────────────────────────────────────┐
│ 📚 Library Manager                    [32 libraries]    │
│ ─────────────────────────────────────────────────────── │
│ Platform: [ESP32 Arduino] [STM32 HAL]                   │
│ ─────────────────────────────────────────────────────── │
│ 🔍 Search libraries...                                  │
│ ─────────────────────────────────────────────────────── │
│ [All] [Communication] [Data Storage] [Signal I/O] ...   │
│ ─────────────────────────────────────────────────────── │
│                                                          │
│ ▼ WiFi  v2.0.0  [Communication]                         │
│   by Hristo Gochkov                                     │
│   Enables network connection using ESP32 WiFi...        │
│   ─────────────────────────────────────────────────     │
│   [Includes] [Examples (1)] [Info]                      │
│                                                          │
│   Required includes:                                    │
│   #include <WiFi.h>                         [Copy]      │
│   [Add to Editor]                                       │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## 📁 Files Structure

```
src/
├── data/
│   ├── esp32Libraries.js     # ESP32 library database (32 libraries)
│   └── stm32Libraries.js     # STM32 library database (13 libraries)
│
├── components/
│   ├── LibraryManager.jsx    # Library Manager component
│   ├── EditorNavbar.jsx      # Updated with Library Manager button
│   └── CodeEditor.jsx        # Integrated Library Manager
│
└── constants.js              # Language mappings (unchanged)
```

---

## 🔧 Technical Details

### Library Data Structure

```javascript
{
  id: 'wifi',
  name: 'WiFi',
  version: '2.0.0',
  author: 'Hristo Gochkov',
  description: 'Enables network connection using ESP32 WiFi...',
  category: 'Communication',
  includes: ['WiFi.h'],
  examples: [
    {
      name: 'WiFiScan',
      code: `#include "WiFi.h"\n\nvoid setup() {...}`
    }
  ]
}
```

### Integration Points

**EditorNavbar.jsx:**
- Added `Library` icon import
- Added `onLibrariesClick` prop
- Added `handleLibraries` callback
- Added "Library Manager" to Tools menu

**CodeEditor.jsx:**
- Added `LibraryManager` import
- Added `isLibraryManagerOpen` state
- Added `handleLibrariesClick` callback
- Added `handleInsertLibraryCode` callback to insert code
- Added platform detection based on language
- Renders `LibraryManager` component

**Code Insertion Logic:**
- Include statements (`#include`) → Added at top of file
- Example code → Added at bottom of file
- Updates editor content via `editorRef.current.setValue()`

---

## 🎯 Key Features

### ✅ Smart Code Insertion
- Include files automatically added to top of code
- Example code added to bottom or cursor position
- Preserves existing code
- Updates Monaco Editor in real-time

### ✅ Cross-Platform Support
- ESP32 Arduino Framework (32 libraries)
- STM32 HAL (13 libraries)
- Auto-detection based on selected language
- Manual platform switching available

### ✅ Rich Metadata
- Library versions
- Author information
- Categorization
- Full descriptions
- Example code snippets

### ✅ Powerful Search & Filter
- Full-text search across name, description, author
- Category filtering
- Real-time results
- Responsive UI

### ✅ User Experience
- Large modal dialog (6xl size)
- Scrollable content
- Accordion interface for libraries
- Tabbed details (Includes/Examples/Info)
- Copy to clipboard functionality
- Toast notifications for actions
- Color mode support (light/dark)

---

## 🚀 Future Enhancements

Potential additions for future versions:

1. **Custom Library Installation**
   - Upload external libraries
   - Parse library.json/library.properties
   - Add to library list

2. **PlatformIO Integration**
   - Auto-generate platformio.ini
   - Library dependency management
   - Version constraints

3. **Arduino Library Manager API**
   - Fetch libraries from Arduino Library Registry
   - Check for updates
   - Install specific versions

4. **Code Templates**
   - Project templates combining multiple libraries
   - Quick-start wizards
   - Best practice examples

5. **More Platforms**
   - Arduino AVR libraries
   - Raspberry Pi Pico libraries
   - Nordic nRF libraries
   - Microchip PIC libraries

6. **Library Documentation**
   - Inline API documentation
   - Function reference
   - Links to external docs

---

## 📊 Statistics

- **Total Libraries**: 45 (32 ESP32 + 13 STM32)
- **Categories**: 7 unique categories
- **Example Code**: 15+ working examples included
- **Search Performance**: Instant filtering with useMemo
- **UI Components**: Accordion, Tabs, Modal, Search, Filters

---

## 🧪 Testing

### Test Case 1: ESP32 WiFi Project
1. Select `esp32` language
2. Open Library Manager
3. Add WiFi library
4. Insert WiFiScan example
5. Verify code compilation

### Test Case 2: STM32 GPIO Blink
1. Select `c` language (defaults to STM32)
2. Open Library Manager
3. Switch to STM32 platform
4. Add GPIO library
5. Insert GPIO blink example
6. Verify code structure

### Test Case 3: Multiple Libraries
1. Add WiFi library
2. Add WebServer library
3. Add ArduinoOTA library
4. Verify all includes at top
5. Combine example codes

### Test Case 4: Search & Filter
1. Search "bluetooth"
2. Verify BLE and BluetoothSerial appear
3. Filter by "Communication" category
4. Verify correct libraries shown

---

## 📝 Usage Tips

### Tip 1: Start with Includes
Always add library includes before inserting example code. This ensures proper code organization.

### Tip 2: Combine Examples
You can insert multiple examples and combine them into one project. Just edit to remove duplicate `setup()` and `loop()` functions.

### Tip 3: Platform Detection
The library manager automatically detects your platform, but you can manually switch if needed.

### Tip 4: Search Smart
Use partial words like "wifi", "ble", "uart" to find related libraries quickly.

### Tip 5: Check Examples
Most libraries have working examples. Use them as templates for your projects.

---

## 🎉 Summary

The Library Manager provides:

✅ **45 Built-in Libraries** (ESP32 + STM32)  
✅ **One-Click Code Insertion** (includes + examples)  
✅ **Smart Platform Detection** (ESP32 vs STM32)  
✅ **Powerful Search & Filtering** (instant results)  
✅ **Professional UI** (modal, tabs, accordion)  
✅ **Complete Metadata** (versions, authors, descriptions)  
✅ **Working Examples** (15+ code snippets)  
✅ **Copy to Clipboard** (individual or bulk)  
✅ **Dark Mode Support** (Chakra UI theming)  
✅ **Toast Notifications** (user feedback)  

**Your IDE now has a professional library management system!** 🚀

---

**Implementation Date**: 2025-01-11  
**Status**: ✅ Complete and Ready to Use  
**Libraries**: 45 (32 ESP32 + 13 STM32)  
**Integration**: EditorNavbar + CodeEditor  
**Access**: Tools → Library Manager
