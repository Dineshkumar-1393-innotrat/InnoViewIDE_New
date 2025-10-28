# Project Management System Implementation

## Overview

A comprehensive project management system has been implemented for the InnoIDE application, providing organized file structures, localStorage persistence, and seamless integration across all diagram types (Flowchart, Block Diagram, Block Programming). The system mimics VS Code behavior with automatic project creation, file organization, and click-to-load functionality.

## 🏗️ Architecture

### Core Components

1. **`projectFileManager.js`** - Central localStorage-based project management
2. **`useCanvasFileIntegration.js`** - React hook for canvas file operations
3. **`ProjectFileExplorer.jsx`** - Enhanced file explorer with project support
4. **`CreateNewProjectModal.jsx`** - Streamlined project creation interface

### Integration Points

- **BlockDiagramTest.jsx** - Full integration with auto-save and file loading
- **FlowchartTest.jsx** - Complete project system integration
- **BlockProgramming.jsx** - Block programming canvas integration
- **MenuSidebar.jsx** & **EmbeddedFileManagement.jsx** - Updated modal usage

## 🎯 Features Implemented

### 1. Project Creation & Management

#### **Automatic Project Structure**
When creating a new project, the system automatically generates:

```
Project Name/
├── simulation.c                    # Default C file
├── Flowchart/                     # Created when Flowchart selected
│   ├── main_flow.json            # Diagram data
│   └── flow_tabs.json            # Tab management
├── BlockDiagram/                  # Created when Block Diagram selected
│   ├── system_diagram.json       # Diagram data
│   └── diagram_tabs.json         # Tab management
├── BlockProgramming/              # Created when Block Programming selected
│   ├── logic_blocks.json         # Block programming data
│   └── blocks_tabs.json          # Tab management
└── Simulation/                    # Created when Simulation selected
    ├── simulation_data.json       # Simulation configuration
    └── sim_tabs.json             # Tab management
```

#### **Project Creation Modal**
- **Simplified Interface**: Removed unnecessary props and dependencies
- **Feature Selection**: Choose from writeCode, FlowchartTest, blockDiagram, Blockprogramming, simulation
- **Automatic Navigation**: Routes to selected feature after creation
- **Toast Notifications**: User feedback for success/error states

### 2. File Management System

#### **localStorage Persistence**
- **Projects Storage**: `ide_projects` - Project metadata and structure
- **Active Project**: `ide_active_project` - Currently selected project
- **File Contents**: `ide_project_files` - All file content with timestamps

#### **File Organization**
- **Hierarchical Structure**: Projects → Subfolders → Files
- **Auto-Classification**: Files organized by diagram type
- **Version Tracking**: Last modified timestamps for all files

### 3. Canvas Integration

#### **Auto-Save Functionality**
- **Debounced Saving**: 1-2 second delay to prevent excessive saves
- **Content Monitoring**: Automatically saves when nodes/edges change
- **Format Conversion**: Proper JSON serialization for each diagram type

#### **File Loading**
- **Click-to-Load**: Single click in File Explorer loads content to canvas
- **Format Detection**: Automatic parsing of JSON vs text files
- **Viewport Restoration**: Maintains zoom and pan positions

#### **PNG Export Integration**
- **Project Integration**: Exported PNGs saved to appropriate project folders
- **Automatic Naming**: `{project}_{type}_{timestamp}.png` format
- **Download + Save**: Both downloads and saves to project

### 4. Enhanced File Explorer

#### **Project-Aware Display**
- **Hierarchical View**: Projects → Folders → Files visualization
- **File Type Icons**: Different icons for .json, .c, .png files
- **Active File Highlighting**: Shows currently open files with indicators
- **Expand/Collapse**: Intuitive folder navigation

#### **Context Menu Actions**
- **Rename**: Rename files and folders
- **Delete**: Remove files with confirmation
- **New File**: Create new files in appropriate folders
- **Export**: Export individual files

## 🔧 Technical Details

### Project Data Structure

```javascript
// Project Metadata
{
  id: 'proj_myproject_1234567890',
  name: 'My Project',
  type: 'bare metal',
  board: 'STM32 U5',
  selectedFeature: 'FlowchartTest',
  userId: 'user123',
  createdAt: '2024-10-14T12:30:00.000Z',
  lastModified: '2024-10-14T12:35:00.000Z',
  structure: { /* hierarchical folder structure */ }
}

// File Storage
{
  'proj_id': {
    'Flowchart/main_flow.json': {
      content: '{"nodes":[],"edges":[],"viewport":null}',
      lastModified: '2024-10-14T12:35:00.000Z'
    },
    'simulation.c': {
      content: '// Simulation code...',
      lastModified: '2024-10-14T12:30:00.000Z'
    }
  }
}
```

### Canvas Integration API

```javascript
// useCanvasFileIntegration Hook
const {
  loadFileToCanvas,      // Load file content to canvas
  saveCanvasToFile,      // Save canvas content to file
  exportCanvasAsPNG,     // Export and save PNG
  createNewFile,         // Create new project file
  setupAutoSave,         // Setup periodic auto-save
  setupAutoSaveOnChange, // Setup change-based auto-save
  getActiveProject       // Get current active project
} = useCanvasFileIntegration('Flowchart');
```

## 🚀 Usage Guide

### Creating a New Project

1. **Open Modal**: Click "Create New Project" in MenuSidebar
2. **Enter Details**: 
   - Project name (required)
   - Board type (STM32 U5, etc.)
   - Project type (bare metal, etc.)
   - Feature selection (FlowchartTest, blockDiagram, etc.)
3. **Create**: Click "Create" button
4. **Auto-Navigation**: Automatically navigates to selected feature
5. **File Structure**: Project appears in File Explorer with organized structure

### Working with Files

1. **File Explorer**: View all projects and files in left sidebar
2. **Click to Load**: Single click any file to load into active canvas
3. **Auto-Save**: Changes automatically saved to project files
4. **Export PNG**: Use navbar export button to save PNG to project

### Project Management

1. **Active Project**: System maintains active project context
2. **Project Switching**: Click different projects to switch context
3. **File Organization**: Files automatically organized by type
4. **Persistence**: All data persists in localStorage between sessions

## 📊 Benefits Achieved

### ✅ VS Code-like Experience
- **Project-based organization** with hierarchical file structure
- **Click-to-load functionality** for seamless file access
- **Auto-save capabilities** preventing data loss
- **Organized export system** with automatic file placement

### ✅ Enhanced User Workflow
- **Streamlined project creation** with automatic structure generation
- **Integrated file management** across all diagram types
- **Persistent session state** with localStorage
- **Consistent UI/UX** across all components

### ✅ Technical Improvements
- **Centralized project management** with single source of truth
- **Modular architecture** with reusable hooks and components
- **Event-driven updates** for real-time synchronization
- **Type-safe implementations** with proper error handling

## 🔮 Future Enhancements

### Planned Features (Low Priority)
1. **Project Import/Export**: Backup and restore complete projects
2. **Advanced File Operations**: Copy, move, duplicate files
3. **Project Templates**: Pre-configured project structures
4. **Collaboration Features**: Share projects between users
5. **Version Control**: Basic git-like versioning for projects

## 🛠️ Development Notes

### Key Design Decisions
- **localStorage over API**: Immediate persistence without server dependency
- **Event-driven architecture**: Real-time updates across components
- **Hook-based integration**: Reusable canvas integration logic
- **Modular file structure**: Separate concerns for maintainability

### Performance Considerations
- **Debounced auto-save**: Prevents excessive localStorage writes
- **Lazy loading**: Only load file content when needed
- **Efficient serialization**: Optimized JSON storage format
- **Memory management**: Proper cleanup of event listeners

## 📝 Implementation Status

✅ **All core features implemented and integrated**
✅ **Full project lifecycle management**
✅ **Cross-component file handling**
✅ **Auto-save and persistence**
✅ **Export integration**
✅ **Enhanced user experience**

The project management system is now fully functional and provides a comprehensive foundation for organized, persistent, and user-friendly project management within the InnoIDE application.
