# How to Connect Your ESP32 Device

## Current Situation
✅ **Physical Connection**: Your ESP32 is plugged into USB (I saw it in your photo!)  
❌ **Software Connection**: The IDE doesn't know about it yet

The orange warning badge "⚠ Not Connected" means the **software** hasn't detected the device yet.

---

## Step-by-Step Connection Guide

### Step 1: Find the Flash Panel
Look at the **RIGHT SIDEBAR** of your IDE. You should see two sections:
1. **Top half**: File Explorer
2. **Bottom half**: **Flash Panel** ← This is what you need!

The Flash panel should look like this:
```
┌─────────────────────────────────┐
│ Flash Control Panel             │
│ ─────────────────────────────── │
│ Flash Progress: [░░░░░░░░░░] 0% │
│ Status: Idle                    │
│ [Stop] [Play] [Retry] [Reset]   │
├─────────────────────────────────┤
│ Device Connection               │
│ ┌───────────────────────────┐   │
│ │ Flash Target: --          │   │
│ │ Port: --                  │   │
│ │ Memory: --                │   │
│ │ Status: Disconnected      │   │
│ └───────────────────────────┘   │
│                                 │
│ [Select Port] [Detect]          │  ← CLICK HERE!
└─────────────────────────────────┘
```

### Step 2: Click "Select Port" or "Detect" Button
In the Flash panel, you'll see two buttons:
- **"Select Port"** - Opens device selection modal
- **"Detect"** - Auto-scans and opens device selection modal

**Click either button!**

### Step 3: Port Selection Modal Opens
A modal window will appear showing detected devices:

```
┌─────────────────────────────────────┐
│ Select Device Port              [X] │
├─────────────────────────────────────┤
│ Select a device from the list:     │
│                                     │
│ ┌─────────────────────────────┐   │
│ │ ESP32                       │   │
│ │ USB (VID: 10C4, PID: EA60)  │   │
│ │ Memory: 4MB        [Select] │   │  ← CLICK THIS!
│ └─────────────────────────────┘   │
│                                     │
│ OR                                  │
│                                     │
│ [+ Add New Device]                  │  ← Or click this
│                        [Cancel]     │
└─────────────────────────────────────┘
```

### Step 4: Select Your Device
- **If you see your ESP32 in the list**: Click on the device card
- **If the list is empty**: Click "Add New Device" button

### Step 5: Browser Permission (First Time Only)
If this is your first time, the browser will ask:
```
┌─────────────────────────────────────┐
│ localhost wants to connect to a    │
│ serial port                         │
│                                     │
│ [ESP32 Serial Port]                 │
│                                     │
│         [Cancel]  [Connect]         │  ← Click Connect
└─────────────────────────────────────┘
```
**Click "Connect"**

### Step 6: Success!
You should immediately see:

**✅ In Flash Panel:**
```
Device Connection
┌───────────────────────────┐
│ Flash Target: ESP32       │
│ Port: USB (VID: 10C4)     │
│ Memory: 4MB               │
│ Status: ✓ Connected       │  ← Green checkmark!
└───────────────────────────┘
```

**✅ In Output Panel (Bottom):**
```
┌─────────────────────────────────┐
│ ✓ Connected | ESP32 | 4MB       │  ← Green badge!
└─────────────────────────────────┘
```

**✅ Flash Button Enabled:**
The Flash button will turn blue and become clickable!

---

## Troubleshooting

### Issue: "I don't see the Flash panel"
**Solution:**
1. Make sure you're on the Code Editor page
2. Look at the right sidebar
3. Scroll down if needed
4. The Flash panel should be at the bottom half

### Issue: "Select Port button doesn't do anything"
**Solution:**
1. Open browser console (F12)
2. Look for errors
3. Make sure you're using Chrome, Edge, or Opera (Web Serial API required)
4. Try clicking "Detect" instead

### Issue: "Modal is empty / No devices shown"
**Solution:**
1. Click "Add New Device" button in the modal
2. Browser will prompt you to select a port
3. Choose your ESP32 from the list
4. Click "Connect"

### Issue: "Browser doesn't show my device"
**Solution:**
1. Check if device is properly plugged in
2. Try a different USB port
3. Install CH340 or CP210x drivers if needed
4. Restart browser and try again

### Issue: "Permission denied"
**Solution:**
1. Close Arduino IDE or other serial monitors
2. Unplug and replug the device
3. Click "Detect" again
4. Grant permission when browser asks

---

## Quick Test

Run this in browser console (F12) to check current state:
```javascript
console.log('Device connected:', localStorage.getItem('innoide:device-connected'));
console.log('Device info:', localStorage.getItem('innoide:device-info'));
```

**Expected after connection:**
```
Device connected: true
Device info: {"deviceType":"ESP32","memory":"4MB",...}
```

---

## Visual Checklist

Before connecting:
- [ ] Orange badge: "⚠ Not Connected"
- [ ] Flash button disabled (grayed out)
- [ ] Flash panel shows "Status: Disconnected"

After connecting:
- [ ] Green badge: "✓ Connected | ESP32 | 4MB"
- [ ] Flash button enabled (blue)
- [ ] Flash panel shows "Status: ✓ Connected"
- [ ] Device info visible in Flash panel

---

## Summary

**The device is physically connected, but you need to:**
1. **Find Flash panel** (right sidebar, bottom half)
2. **Click "Select Port" or "Detect"** button
3. **Choose your ESP32** from the modal
4. **Click "Connect"** if browser asks
5. **See green badge** appear
6. **Flash your code!**

The orange warning is just telling you to complete these steps! 🚀
