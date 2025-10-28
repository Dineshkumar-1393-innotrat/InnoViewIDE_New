// import axios from "axios";
// import { LANGUAGE_VERSIONS } from "./constants";

// const API = axios.create({
//   baseURL: "https://emkc.org/api/v2/piston",
// });

// export const executeCode = async (language, sourceCode) => {
//   const response = await API.post("/execute", {
//     language: language,
//     version: LANGUAGE_VERSIONS[language],
//     files: [
//       {
//         content: sourceCode,
//       },
//     ],
//   });
//   return response.data;
// };


import axios from "axios";
import { LANGUAGE_VERSIONS } from "./constants";

const API = axios.create({
  baseURL: "https://emkc.org/api/v2/piston",
});

// Map language names to Piston-compatible names
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

export const executeCode = async (language, sourceCode, stdin = "") => {
  try {
    // Normalize language name
    const normalizedLanguage = language?.toLowerCase() || "c";
    const pistonLanguage = PISTON_LANGUAGE_MAP[normalizedLanguage] || "c";
    
    // Check if code contains ESP32/Arduino specific headers
    const hardwareHeaders = [
      '#include <Arduino.h>',
      '#include "Arduino.h"',
      '#include <freertos/',
      '#include "freertos/',
      '#include <esp_',
      '#include "esp_',
      'pinMode(',
      'digitalWrite(',
      'digitalRead(',
      'analogRead(',
      'analogWrite(',
    ];
    
    const hasHardwareCode = hardwareHeaders.some(header => 
      sourceCode.includes(header)
    );
    
    // If it's ESP32/Arduino code with hardware-specific functions
    if ((normalizedLanguage === "arduino" || normalizedLanguage === "esp32") && hasHardwareCode) {
      throw new Error(
        "⚠️ Hardware-specific code detected!\n\n" +
        "This code contains ESP32/Arduino hardware functions that cannot be executed in the online compiler.\n\n" +
        "To run this code:\n" +
        "1. Connect your ESP32/Arduino device\n" +
        "2. Click the 'Flash' button to upload to hardware\n" +
        "3. Use 'Serial Monitor' to view output\n\n" +
        "The 'Run' button only works for standard C code without hardware dependencies."
      );
    }
    
    // Get version - for arduino/esp32, use C version
    let version = LANGUAGE_VERSIONS[normalizedLanguage];
    if (!version || normalizedLanguage === "arduino" || normalizedLanguage === "esp32") {
      version = LANGUAGE_VERSIONS["c"]; // Default to C compiler version
    }

    // Validate inputs
    if (!sourceCode || sourceCode.trim() === "") {
      throw new Error("Source code cannot be empty");
    }

    const payload = {
      language: pistonLanguage,
      version: version,
      files: [
        {
          content: sourceCode,
        },
      ],
      stdin: stdin || "",
    };

    console.log("Executing code with Piston API:", {
      language: pistonLanguage,
      version,
      codeLength: sourceCode.length,
      hasStdin: Boolean(stdin),
    });

    const response = await API.post("/execute", payload);

    return response.data;
  } catch (error) {
    // Detailed error logging
    console.error("❌ Piston API Error Details:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
      url: error.config?.url,
      method: error.config?.method,
      sentPayload: error.config?.data ? JSON.parse(error.config.data) : null,
    });
    
    // Provide more helpful error messages
    if (error.response?.status === 400) {
      const errorMsg = error.response?.data?.message || JSON.stringify(error.response?.data) || "Invalid request to code execution service";
      throw new Error(`Code execution failed: ${errorMsg}. Please check your code syntax and language selection.`);
    } else if (error.response?.status === 429) {
      throw new Error("Too many requests. Please wait a moment and try again.");
    } else if (error.response?.status >= 500) {
      throw new Error("Code execution service is temporarily unavailable. Please try again later.");
    }
    
    throw error;
  }
};

// Submit code to ESP32 device for flashing
export const submitCodeToDevice = async (sourceCode, language = "esp32") => {
  try {
    // Validate inputs
    if (!sourceCode || sourceCode.trim() === "") {
      throw new Error("Source code cannot be empty");
    }

    const payload = {
      code: sourceCode,
      language: language,
      timestamp: new Date().toISOString(),
    };

    console.log("Submitting code to device:", {
      language,
      codeLength: sourceCode.length,
      endpoint: "https://admin.innotrat.in/submit-code",
    });

    const response = await axios.post("https://admin.innotrat.in/submit-code", payload, {
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 30000, // 30 second timeout
    });

    console.log("✓ Code submitted successfully:", response.data);
    return response.data;
  } catch (error) {
    // Detailed error logging
    console.error("❌ Submit Code API Error:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
      url: error.config?.url,
    });
    
    // Provide helpful error messages
    if (error.response?.status === 400) {
      const errorMsg = error.response?.data?.message || "Invalid code submission";
      throw new Error(`Submission failed: ${errorMsg}`);
    } else if (error.response?.status === 404) {
      throw new Error("Device endpoint not found. Please check your device connection.");
    } else if (error.response?.status >= 500) {
      throw new Error("Device server is temporarily unavailable. Please try again later.");
    } else if (error.code === "ECONNABORTED") {
      throw new Error("Request timeout. Please check your network connection.");
    }
    
    throw error;
  }
};
