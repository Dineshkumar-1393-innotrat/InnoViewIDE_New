# Diagram Editor Integration

This document describes the integration of the InnoViewIDE diagram editor functionality into the client application.

## Overview

The diagram editor has been completely replaced with a modern, feature-rich editor based on ReactFlow and Redux. The new editor provides:

- **Advanced Diagram Creation**: Drag-and-drop interface with comprehensive shape library
- **Real-time Editing**: Resize, move, and customize nodes and connections
- **Undo/Redo**: Full history management with keyboard shortcuts
- **Auto-layout**: Automatic arrangement of diagram elements
- **Export/Import**: Save and load diagrams as JSON, export as PNG
- **Color Customization**: Change colors of nodes, edges, and text
- **Responsive Design**: Works on desktop and mobile devices

## Features

### Shape Library
The editor includes a comprehensive shape library organized into categories:
- **Flowchart**: Basic flowchart shapes (rectangles, diamonds, ovals, etc.)
- **Basic**: Simple geometric shapes
- **UML Use Case Diagram**: UML-specific shapes
- **UML Sequence Diagram**: Sequence diagram elements
- **UML Timing Diagram**: Timing diagram components
- **Activity & State Diagram**: Activity and state diagram shapes
- **Connectors**: Various connection types

### Editing Capabilities
- **Drag & Drop**: Drag shapes from the sidebar to the canvas
- **Resize**: Click and drag corners to resize nodes
- **Move**: Click and drag to move nodes around
- **Connect**: Drag from connection handles to create connections
- **Edit Text**: Double-click on nodes or edges to edit labels
- **Delete**: Select elements and press Delete or Backspace

### Keyboard Shortcuts
- `Ctrl+Z` / `Cmd+Z`: Undo
- `Ctrl+Y` / `Cmd+Y` or `Ctrl+Shift+Z`: Redo
- `Delete` / `Backspace`: Delete selected elements

### File Operations
- **Save**: Save diagram as JSON file
- **Load**: Load diagram from JSON file
- **Export**: Export diagram as PNG image

## Usage

### Accessing the Editor
1. Navigate to `/diagram-editor` in the application
2. The old `/flowchart` and `/blockdiagram` routes now redirect to the new editor

### Creating a Diagram
1. **Add Shapes**: Drag shapes from the left sidebar to the canvas
2. **Connect Elements**: Drag from connection handles (small circles) on nodes to create connections
3. **Edit Labels**: Double-click on nodes or edges to edit their text
4. **Customize Colors**: Right-click on elements to open the color palette
5. **Auto-layout**: Click the grid icon in the toolbar to automatically arrange elements

### Saving and Loading
1. **Save**: Click the save icon in the toolbar to download the diagram as JSON
2. **Load**: Click the upload icon to load a previously saved diagram
3. **Export**: Click the download icon to export the diagram as a PNG image

## Technical Implementation

### Dependencies Added
- `@reduxjs/toolkit`: State management
- `react-redux`: React bindings for Redux
- `reactflow`: Diagram editor library
- `react-dnd-multi-backend`: Enhanced drag-and-drop
- `html-to-image`: Image export functionality
- `dagre`: Auto-layout algorithm
- `uuid`: Unique ID generation
- `redux-undo`: Undo/redo functionality

### Key Components
- `DiagramEditor.jsx`: Main editor component
- `DiagramSidebar.jsx`: Shape library sidebar
- `DiagramHeader.jsx`: Toolbar with controls
- `ResizableNode.jsx`: Custom node component
- `CustomEdge.jsx`: Custom edge component
- `LabelNode.jsx`: Text label component

### State Management
- Redux store manages nodes, edges, and undo/redo history
- Flow slice handles all diagram operations
- Selectors provide efficient state access

### Styling
- Tailwind CSS for responsive design
- Custom CSS for ReactFlow components
- Consistent color scheme and modern UI

## Migration from Old Components

The old `Flowchart.jsx` and `BlockDiagram.jsx` components have been replaced with redirects to the new diagram editor. This ensures backward compatibility while providing a much more powerful and feature-rich experience.

## Browser Compatibility

The diagram editor supports:
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Touch devices (tablets, phones)
- Keyboard navigation
- Screen readers (basic accessibility)

## Future Enhancements

Potential improvements for future versions:
- Collaborative editing
- More shape libraries
- Advanced styling options
- Template system
- Version control integration
- Real-time collaboration 