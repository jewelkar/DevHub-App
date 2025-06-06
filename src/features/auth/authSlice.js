import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import localforage from "localforage";

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  status: "idle",
  error: null,
};

// Async Thunks for Login/Logout (Mock)
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ username, password }, { rejectWithValue }) => {
    try {
      // Mock API call
      const response = await fetch("http://localhost:3001/users");
      const users = await response.json();
      const user = users.find(
        (u) => u.username === username && u.password === password
      );

      if (user) {
        await localforage.setItem("authToken", user.token);
        await localforage.setItem("user", JSON.stringify(user));
        return {
          user: { id: user.id, username: user.username },
          token: user.token,
        };
      } else {
        return rejectWithValue("Invalid credentials");
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
  await localforage.removeItem("authToken");
  await localforage.removeItem("user");
  return null;
});

export const loadUserFromStorage = createAsyncThunk(
  "auth/loadUserFromStorage",
  async (_, { rejectWithValue }) => {
    try {
      const token = await localforage.getItem("authToken");
      const userString = await localforage.getItem("user");
      if (token && userString) {
        return { user: JSON.parse(userString), token };
      }
      return rejectWithValue("No user found");
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.status = "idle";
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(loadUserFromStorage.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.status = "succeeded";
      })
      .addCase(loadUserFromStorage.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.status = "idle";
      });
  },
});

export default authSlice.reducer;
