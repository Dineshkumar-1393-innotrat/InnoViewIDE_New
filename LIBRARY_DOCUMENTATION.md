# InnoView IDE - Library Documentation

This document outlines the libraries and dependencies used for various features within the InnoView IDE.

## Core UI & Design System
*Libraries used to build the overall layout, theme, and interactive UI components.*

| Library | Version | Purpose |
| :--- | :--- | :--- |
| `@chakra-ui/react` | ^2.10.0 | Primary UI framework for accessible and consistent layout. |
| `@chakra-ui/icons` | ^2.1.1 | Standardized iconography for menus and controls. |
| `framer-motion` | ^11.18.2 | Smooth transitions and complex UI animations. |
| `lucide-react` | ^0.447.0 | Clean, modern vector icons used across the workspace. |
| `react-icons` | ^5.4.0 | Additional icon sets for specialized UI needs. |
| `bootstrap` | ^5.3.3 | Supplementary styling for specific legacy or standard components. |

---

## Code Editor
*Libraries powering the integrated development environment for writing code.*

| Library | Version | Purpose |
| :--- | :--- | :--- |
| `@monaco-editor/react` | ^4.6.0 | React wrapper for the Monaco Editor (VS Code core). |
| `monaco-editor` | ^0.52.0 | Core editor engine providing syntax highlighting, IntelliSense, and multi-file support. |

---

## Diagrams & Visual Programming
*Libraries for creating flowcharts, block diagrams, and visual logic builders.*

| Library | Version | Purpose |
| :--- | :--- | :--- |
| `reactflow` | ^11.10.0 | Primary engine for node-based editors (Flowchart & Block Programming). |
| `@reactflow/node-resizer`| ^2.2.14 | Enhanced node interaction for custom shape resizing. |
| `html-to-image` | ^1.11.11 | Functionality to export diagrams as high-quality PNG images. |
| `html2canvas` | ^1.4.1 | Alternative engine for capturing complex canvas elements. |
| `react-dnd` | ^16.0.1 | Drag-and-drop orchestration for the Block Diagram palette. |
| `react-dnd-html5-backend`| ^16.0.1 | Browser-specific backend for the drag-and-drop system. |
| `react-rnd` | ^10.4.13 | Resizable and draggable wrapper for Block Diagram elements. |

---

## Simulation & Visuals
*Libraries used for real-time simulation and data visualization.*

| Library | Version | Purpose |
| :--- | :--- | :--- |
| `react-konva` | ^18.2.10 | Fast 2D canvas drawing used for Simulation and complex rendering. |
| `axios` | ^1.7.7 | Handling API requests for simulation data and telemetry. |

---

## Rule Engine
*Libraries used for state machine logic and real-time rule evaluation.*

| Library | Version | Purpose |
| :--- | :--- | :--- |
| `@chakra-ui/react` | ^2.10.0 | Dashboard UI, Sliders, and real-time state alerts (Toasts). |
| *Internal Hooks* | N/A | Custom logic for evaluating vehicle facts against predefined thresholds. |

---

## Authentication & Security
*Libraries managing user identity and secure access.*

| Library | Version | Purpose |
| :--- | :--- | :--- |
| `@auth0/auth0-react` | ^2.2.4 | Enterprise-grade authentication and user session management. |
| `@react-oauth/google` | ^0.12.2 | Seamless Google login integration. |
| `js-cookie` | ^3.0.5 | Securely managing session tokens and preferences in cookies. |

---

## Meetings & Collaboration
*Libraries for peer-to-peer conferencing and live collaboration.*

| Library | Version | Purpose |
| :--- | :--- | :--- |
| `@dytesdk/react-ui-kit` | ^3.0.8 | Pre-built UI components for video meetings. |
| `@dytesdk/react-web-core`| ^3.1.11 | Core meeting logic and participant management. |

---

## State Management & Persistence
*Libraries handling global application state and local data persistence.*

| Library | Version | Purpose |
| :--- | :--- | :--- |
| `@reduxjs/toolkit` | ^2.11.0 | Standard toolset for efficient Redux state logic. |
| `react-redux` | ^9.2.0 | Binding Redux state to React components. |
| `redux-persist` | ^6.0.0 | Automatically saving application state (e.g., open tabs) across refreshes. |

---

## Desktop Integration (Electron)
*Libraries for packaging the web app as a desktop application.*

| Library | Version | Purpose |
| :--- | :--- | :--- |
| `electron` | ^39.2.1 | Core desktop shell for the IDE. |
| `@electron/remote` | ^2.1.2 | Facilitating communication between renderer and main process. |
| `electron-builder` | ^26.2.0 | Packaging and distribution for Windows platform. |
