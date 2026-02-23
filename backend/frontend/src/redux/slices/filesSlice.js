import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getFiles,
  getUserFiles,
  postFile,
  patchFile,
  deleteFile,
  getDownloadLink
} from '../../api/requests';

// Async thunks
export const fetchFiles = createAsyncThunk(
  'files/fetchFiles',
  async (userId = null, { rejectWithValue }) => {
    try {
      const response = userId ? await getUserFiles(userId) : await getFiles();
      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue('Failed to fetch files');
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const uploadFile = createAsyncThunk(
  'files/uploadFile',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await postFile(formData);
      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue('Failed to upload file');
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateFile = createAsyncThunk(
  'files/updateFile',
  async ({ fileData, userStorageId = null }, { rejectWithValue }) => {
    try {
      const response = await patchFile(fileData, userStorageId);
      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue('Failed to update file');
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeFile = createAsyncThunk(
  'files/removeFile',
  async ({ fileId, userStorageId = null }, { rejectWithValue }) => {
    try {
      const response = await deleteFile(fileId, userStorageId);

      if (!response.ok) {
        return rejectWithValue('Failed to delete file');
      }

      return fileId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchDownloadLink = createAsyncThunk(
  'files/fetchDownloadLink',
  async (fileId, { rejectWithValue }) => {
    try {
      const response = await getDownloadLink(fileId);
      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue('Failed to get download link');
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Slice
const filesSlice = createSlice({
  name: 'files',
  initialState: {
    files: [],
    currentFile: null,
    downloadLink: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearFiles: (state) => {
      state.files = [];
    },
    clearError: (state) => {
      state.error = null;
    },
    setCurrentFile: (state, action) => {
      state.currentFile = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch files
      .addCase(fetchFiles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFiles.fulfilled, (state, action) => {
        state.loading = false;
        state.files = action.payload;
      })
      .addCase(fetchFiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Upload file
      .addCase(uploadFile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadFile.fulfilled, (state, action) => {
        state.loading = false;
        state.files = action.payload;
      })
      .addCase(uploadFile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update file
      .addCase(updateFile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateFile.fulfilled, (state, action) => {
        state.loading = false;
        state.files = action.payload;
      })
      .addCase(updateFile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Remove file
      .addCase(removeFile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFile.fulfilled, (state, action) => {
        state.loading = false;
        state.files = state.files.filter(file => file.id !== action.payload);
      })
      .addCase(removeFile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch download link
      .addCase(fetchDownloadLink.fulfilled, (state, action) => {
        state.downloadLink = action.payload;
      });
  },
});

export const { clearFiles, clearError, setCurrentFile } = filesSlice.actions;
export default filesSlice.reducer;
