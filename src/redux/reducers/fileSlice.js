import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../configuration/axiosClient";

export const fetchFileInfo = createAsyncThunk(
  "files/fetchFileInfo",
  async (id, { rejectWithValue }) => {
    try {
      // await new Promise((resolve) => setTimeout(resolve, 3000));
      const res = await axiosClient.get(`/files/${id}`);
      return res.data.file;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);
export const deleteFile = createAsyncThunk(
  "files/deleteFile",
  async (id, { rejectWithValue }) => {
    try {
      // await new Promise((resolve) => setTimeout(resolve, 3000));
      const res = await axiosClient.delete(`/files/${id}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const updateFilePublicStatus = createAsyncThunk(
  "files/updateFilePublicStatus",
  async ({ id, isPublic }, { rejectWithValue }) => {
    try {
      const res = await axiosClient.patch(`/files/${id}`, { isPublic });
      return res.data.file;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchFiles = createAsyncThunk(
  "files/fetchFiles",
  async ({ page = 1, limit = 5 }, { rejectWithValue }) => {
    try {
      // await new Promise((resolve) => setTimeout(resolve, 3000));
      const res = await axiosClient.get(
        "/files?page=" + page + "&limit=" + limit
      );
      console.log(res.data.files);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const uploadFile = createAsyncThunk(
  "files/uploadFile",
  async ({ formData, onUploadProgress }, { rejectWithValue }) => {
    try {
      const res = await axiosClient.post("/files", formData, {
        headers: { "Content-Type": "multipart/form-data" },
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
  name: "files",
  initialState: {
    files: [],
    status: "idle",
    hasMore: true,
    error: null,
    fileOperation: {
      status: "idle",
      error: null,
      file: null,
    },
    fileUploadOperation: {
      status: "idle",
      error: null,
      file: null,
      uploadProgress: 0,
    },
  },
  reducers: {
    setUploadProgress: (state, action) => {
      state.fileUploadOperation.uploadProgress = action.payload;
    },
    resetUploadProgress: (state) => {
      state.fileUploadOperation.uploadProgress = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch files
      .addCase(fetchFiles.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchFiles.fulfilled, (state, action) => {
        state.status = "idle";
        const { files, hasMore } = action.payload;
        state.files.push(...files);
        state.hasMore = hasMore;
      })
      .addCase(fetchFiles.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Upload file
      .addCase(uploadFile.pending, (state) => {
        state.fileUploadOperation.status = "uploading";
        state.fileUploadOperation.uploadProgress = 0;
      })
      .addCase(uploadFile.fulfilled, (state, action) => {
        state.fileUploadOperation.status = "idle";
        console.log(action.payload)
        state.files.unshift(action.payload);
        state.fileUploadOperation.uploadProgress = 100;
      })
      .addCase(uploadFile.rejected, (state, action) => {
        state.fileUploadOperation.status = "failed";
        state.fileUploadOperation.error = action.payload;
      })
      // Handle single file operation
      .addCase(updateFilePublicStatus.pending, (state) => {
        state.fileOperation.status = "loading";
      })
      .addCase(updateFilePublicStatus.fulfilled, (state, action) => {
        state.fileOperation.status = "idle";
        const fileId = action.payload.id;
        const file = state.files.find((f) => f.id === fileId);
        if (file) file.public = action.payload.public; // only update this object
        state.fileOperation[fileId] = { status: "idle", error: null };
      })
      .addCase(updateFilePublicStatus.rejected, (state, action) => {
        state.fileOperation.status = "idle";
        state.fileOperation.error = action.payload;
      })
      // Fetch file info
      .addCase(fetchFileInfo.pending, (state) => {
        state.fileOperation.status = "loading";
      })
      .addCase(fetchFileInfo.fulfilled, (state, action) => {
        state.fileOperation.status = "idle";
        state.fileOperation.file = action.payload;
        state.fileOperation.error = null;
      })
      .addCase(fetchFileInfo.rejected, (state, action) => {
        state.fileOperation.status = "idle";
        state.fileOperation.error = action.payload;
      })
      // Delete file
      .addCase(deleteFile.pending, (state) => {
        state.fileOperation.status = "loading";
      })
      .addCase(deleteFile.fulfilled, (state, action) => {
        state.fileOperation.status = "idle";
        state.files = state.files.filter((f) => f.id !== action.meta.arg);
        state.fileOperation.error = null;
      })
      .addCase(deleteFile.rejected, (state, action) => {
        state.fileOperation.status = "idle";
        state.fileOperation.error = action.payload;
      });
  },
});

export const { resetUploadProgress, setUploadProgress } = fileSlice.actions;
export default fileSlice.reducer;
