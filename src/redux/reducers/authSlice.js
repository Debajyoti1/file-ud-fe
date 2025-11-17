import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../configuration/axiosClient";

// Fetch current user info from backend (cookies sent automatically)
export const fetchUser = createAsyncThunk(
  "auth/fetchUser",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosClient.get("/auth/me");
      return res.data.user;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Login handled via backend cookies
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await axiosClient.post("/auth/login", payload);
      return res.data.user;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Signup handled via backend cookies
export const signupUser = createAsyncThunk(
  "auth/signupUser",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await axiosClient.post("/auth/register", payload);
      return res.data.user;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Logout handled via backend for cookie clearing
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await axiosClient.post("/auth/logout");
      return true;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const initialState = {
  user: null,
  status: "idle",
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchUser
      .addCase(fetchUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = "idle";
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.user = null;
        state.status = "failed";
        state.error = action.payload;
      })

      // loginUser
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = "idle";
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.user = null;
        state.status = "failed";
        state.error = action.payload;
      })

      // signupUser
      .addCase(signupUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = "idle";
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.user = null;
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(logoutUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(logoutUser.fulfilled, () => initialState)
      .addCase(logoutUser.rejected, (state, action) => {
        state.error = action.payload;
        state.user = null;
        state.status = "failed";
      });
  },
});

export default authSlice.reducer;
