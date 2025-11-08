import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../../configuration/axiosClient';

export const fetchFiles = createAsyncThunk(
  'files/fetchFiles',
  async (_, { rejectWithValue }) => {
    try {
      // await new Promise((resolve) => setTimeout(resolve, 3000));
      const res = await axiosClient.get('/files');
      console.log(res.data.files)
      return res.data.files;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const uploadFile = createAsyncThunk(
  'files/uploadFile',
  async ({ formData, onUploadProgress }, { rejectWithValue }) => {
    try {
      const res = await axiosClient.post('/files/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress, // Pass progress handler
      });
      console.log(res.data);
      
      return res.data.file; // backend returns uploaded file metadata
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const fileSlice = createSlice({
  name: 'files',
  initialState: {
    files: [],
    status: 'idle',
    error: null,
    uploadProgress: 0,
  },
  reducers: {
    resetUploadProgress: (state) => {
      state.uploadProgress = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch files
      .addCase(fetchFiles.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchFiles.fulfilled, (state, action) => {
        state.status = 'idle';
        state.files = action.payload;
      })
      .addCase(fetchFiles.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Upload file
      .addCase(uploadFile.pending, (state) => {
        state.status = 'uploading';
        state.uploadProgress = 0;
      })
      .addCase(uploadFile.fulfilled, (state, action) => {
        state.status = 'idle';
        state.files.unshift(action.payload);
        state.uploadProgress = 100;
      })
      .addCase(uploadFile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { resetUploadProgress } = fileSlice.actions;
export default fileSlice.reducer;
