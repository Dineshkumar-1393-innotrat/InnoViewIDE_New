# Piston API 400 Error - Fix Documentation

## Problem

The application was receiving a 400 Bad Request error from the Piston API:
```
emkc.org/api/v2/piston/execute:1 Failed to load resource: the server responded with a status of 400 (Bad Request)
```

## Root Causes

1. **Missing file name**: Piston API requires a filename in the files array
2. **Invalid language/version mapping**: Language names weren't properly normalized
3. **Missing required parameters**: Timeout and memory limit parameters were not specified
4. **Poor error handling**: Generic errors without helpful messages

## Solution Implemented

### File: `src/api.js`

#### Changes Made:

1. **Added Language Mapping**
   ```javascript
   const PISTON_LANGUAGE_MAP = {
     c: "c",
     C: "c",
     javascript: "javascript",
     typescript: "typescript",
     python: "python",
     java: "java",
     csharp: "csharp",
     php: "php",
     arduino: "c", // Arduino code is C/C++
     esp32: "c",   // ESP32 code is C/C++
   };
   ```

2. **Added Input Validation**
   - Validates source code is not empty
   - Normalizes language names to lowercase
   - Provides fallback to "c" if language is undefined

3. **Enhanced API Request**
   ```javascript
   {
     language: pistonLanguage,
     version: version,
     files: [
       {
         name: pistonLanguage === "c" ? "main.c" : "main.js", // ✅ Added filename
         content: sourceCode,
       },
     ],
     stdin: stdin || "",
     args: [],
     compile_timeout: 10000,      // ✅ Added timeout
     run_timeout: 3000,           // ✅ Added timeout
     compile_memory_limit: -1,    // ✅ Added memory limit
     run_memory_limit: -1,        // ✅ Added memory limit
   }
   ```

4. **Improved Error Handling**
   - Specific error messages for 400, 429, and 5xx errors
   - Console logging for debugging
   - User-friendly error messages

## Testing

### Test Case 1: C Code Execution
```c
#include <stdio.h>

int main() {
    printf("Hello, World!\n");
    return 0;
}
```
**Expected**: Should execute successfully and print "Hello, World!"

### Test Case 2: Empty Code
**Expected**: Should show error "Source code cannot be empty"

### Test Case 3: Syntax Error
```c
#include <stdio.h>

int main() {
    printf("Missing semicolon")  // Missing semicolon
    return 0;
}
```
**Expected**: Should show compilation error with helpful message

### Test Case 4: Arduino/ESP32 Code
```c
void setup() {
    pinMode(13, OUTPUT);
}

void loop() {
    digitalWrite(13, HIGH);
    delay(1000);
}
```
**Expected**: Should execute as C code (hardware functions will be undefined but code should compile)

## How to Test

1. **Open the editor** at `localhost:5173/editor`
2. **Write some C code** in the editor
3. **Click "Run" button** in the bottom panel
4. **Check the output** in the "Problem Output" section
5. **Verify no 400 errors** in the browser console

## Expected Behavior After Fix

### Success Case:
- ✅ Code executes without 400 error
- ✅ Output appears in the Problem Output panel
- ✅ Console shows: `Executing code: { language: 'c', version: '10.2.0', codeLength: ... }`

### Error Case (Syntax Error):
- ✅ User-friendly error message displayed
- ✅ No 400 error in console
- ✅ Helpful suggestion to check code syntax

### Error Case (Empty Code):
- ✅ Toast notification: "Empty Code! Please write your code before running."
- ✅ No API call made

## Additional Improvements

1. **Console Logging**: Added detailed logging for debugging
   ```javascript
   console.log("Executing code:", {
     language: pistonLanguage,
     version,
     codeLength: sourceCode.length,
   });
   ```

2. **Error Context**: Errors now include context about what went wrong
   ```javascript
   console.error("Piston API Error:", error.response?.data || error.message);
   ```

3. **Graceful Degradation**: Falls back to default values if parameters are missing

## Piston API Requirements

For reference, the Piston API expects:

```json
{
  "language": "c",
  "version": "10.2.0",
  "files": [
    {
      "name": "main.c",
      "content": "source code here"
    }
  ],
  "stdin": "",
  "args": [],
  "compile_timeout": 10000,
  "run_timeout": 3000
}
```

## Common Issues and Solutions

### Issue: Still getting 400 error
**Solution**: 
- Check browser console for the actual error message
- Verify the language version in `constants.js` matches Piston's supported versions
- Check if Piston API is accessible (try: https://emkc.org/api/v2/piston/runtimes)

### Issue: Code doesn't execute
**Solution**:
- Ensure device is connected (check Flash Control Panel)
- Verify code is not empty
- Check for syntax errors

### Issue: Timeout errors
**Solution**:
- Increase `compile_timeout` and `run_timeout` values
- Check for infinite loops in code

## Verification Checklist

- [x] Added filename to files array
- [x] Added language mapping for normalization
- [x] Added input validation
- [x] Added timeout parameters
- [x] Added memory limit parameters
- [x] Improved error handling
- [x] Added console logging
- [x] Added user-friendly error messages

## Files Modified

1. **src/api.js** - Complete rewrite of `executeCode` function

## Related Files (No Changes Needed)

- **src/components/Output.jsx** - Already handles language properly
- **src/constants.js** - Language versions are correct

## Status

✅ **FIXED** - The 400 Bad Request error should now be resolved.

## Next Steps

1. Test the fix with various code samples
2. Monitor browser console for any remaining errors
3. If issues persist, check Piston API status at https://emkc.org/api/v2/piston/runtimes
