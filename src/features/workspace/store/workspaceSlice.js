import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { uploadProject } from "../upload/services/UploadService";
import { executeRuntimeLifecycle } from "../runtime/services/MockRuntimeService";

export const importProjectZip = createAsyncThunk(
  "workspace/importProjectZip",
  async (file, { dispatch, rejectWithValue }) => {
    try {
      // Transition to uploading state
      dispatch(setRuntimeState("uploading"));
      
      // Pass a callback to track progress
      const result = await uploadProject(file, (progress) => {
        dispatch(setUploadProgress(progress));
      });
      
      // Set initial project metadata and files from real ZIP parse
      dispatch(setWorkspaceMetadata({
        workspaceId: result.workspaceId,
        projectName: result.projectName,
        uploadedFileName: result.uploadedFileName,
        framework: result.metadata.framework,
        packageManager: result.metadata.packageManager,
        projectType: result.metadata.projectType,
        scripts: result.metadata.scripts
      }));
      dispatch(setProjectFiles(result.projectFiles));

      // Start the runtime lifecycle
      dispatch(runProjectLifecycle({
        workspaceId: result.workspaceId,
        metadata: result.metadata
      }));

      return result;
    } catch (error) {
      dispatch(setRuntimeState("failed"));
      return rejectWithValue(error.message || "Upload failed");
    }
  }
);

export const runProjectLifecycle = createAsyncThunk(
  "workspace/runProjectLifecycle",
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      await executeRuntimeLifecycle(payload, {
        onStateChange: (state) => {
          dispatch(setRuntimeState(state));
        },
        onLog: (log) => {
          dispatch(appendTerminalLog(log));
        },
        onMetadataUpdate: (metadata) => {
          dispatch(setWorkspaceMetadata(metadata));
        },
        onFilesReady: (files) => {
          dispatch(setProjectFiles(files));
        }
      });
      return true;
    } catch (error) {
      dispatch(setRuntimeState("failed"));
      dispatch(appendTerminalLog(`> Error: ${error.message}`));
      return rejectWithValue(error.message || "Lifecycle failed");
    }
  }
);

const initialState = {
  workspaceId: null,
  projectName: "",
  uploadedFileName: "",
  framework: "",
  packageManager: "",
  projectType: "", // react, nextjs, node, express, angular, vue, nest, unknown
  scripts: {}, // parsed package.json scripts
  runtimeState: "idle", // idle, uploading, extracting, detecting, installing, starting, running, stopped, failed
  previewUrl: "",
  terminalLogs: [],
  projectFiles: [],
  progress: 0,
  error: null,
};

const workspaceSlice = createSlice({
  name: "workspace",
  initialState,
  reducers: {
    setRuntimeState(state, action) {
      state.runtimeState = action.payload;
    },
    setUploadProgress(state, action) {
      state.progress = action.payload;
    },
    setWorkspaceMetadata(state, action) {
      // Merge partial metadata
      Object.assign(state, action.payload);
    },
    appendTerminalLog(state, action) {
      state.terminalLogs.push(action.payload);
    },
    clearTerminalLogs(state) {
      state.terminalLogs = [];
    },
    setProjectFiles(state, action) {
      state.projectFiles = action.payload;
    },
    resetWorkspace(state) {
      return initialState;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(importProjectZip.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(runProjectLifecycle.rejected, (state, action) => {
        state.error = action.payload;
      });
  }
});

export const { 
  setRuntimeState, 
  setUploadProgress, 
  setWorkspaceMetadata, 
  appendTerminalLog, 
  clearTerminalLogs, 
  setProjectFiles, 
  resetWorkspace 
} = workspaceSlice.actions;

export default workspaceSlice.reducer;
