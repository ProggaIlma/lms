import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import { authApi } from "@/lib/api/auth.api";
import { AuthState, LoginPayload, RegisterPayload, User } from "@/types/auth.types";

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

export const login = createAsyncThunk("auth/login", async (payload: LoginPayload, { rejectWithValue }) => {
  try {
    const data = await authApi.login(payload);
    return data; // { user, token }
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.error || "Login failed");
  }
});

export const register = createAsyncThunk("auth/register", async (payload: RegisterPayload, { rejectWithValue }) => {
  try {
    console.log("THUNK CALLED WITH:", payload);
    const result = await authApi.register(payload);
    console.log("THUNK GOT RESULT:", result);
    return result;
  } catch (err: any) {
    console.log("THUNK ERROR:", err);
    return rejectWithValue(err.response?.data?.message || "Registration failed");
  }
});

export const fetchCurrentUser = createAsyncThunk("auth/fetchCurrentUser", async (_, { rejectWithValue }) => {
  try {
    const response = await authApi.getMe();
    // handle any response shape
    const user = response?.data ?? response;
    console.log("FETCHED USER:", user);
    return user;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch user");
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      Cookies.remove("token");
    },
    setCredentials(state, action: PayloadAction<{ user: User; token: string }>) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = {
          ...action.payload.user,
          userId: action.payload.user.id, // map id → userId
        };
        state.token = action.payload.token;
        state.isAuthenticated = true;
        Cookies.set("token", action.payload.token, { expires: 7, sameSite: "strict" });
      })

      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Register
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        console.log("FULFILLED PAYLOAD:", action.payload); // ← check this
        state.isLoading = false;

        if (!action.payload || !action.payload.user) return;

        state.user = {
          id: action.payload.user.id,
          userId: action.payload.user.id,
          name: action.payload.user.name,
          email: action.payload.user.email,
          role: action.payload.user.role,
          isActive: true,
          createdAt: new Date().toISOString(),
        };
        state.token = action.payload.token;
        state.isAuthenticated = true;
        Cookies.set("token", action.payload.token, { expires: 7, sameSite: "strict" });
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch current user
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;

        if (!action.payload) return;

        const payload = action.payload as any;

        state.user = {
          id: payload.id,
          userId: payload.id, // ✅ map id → userId
          name: payload.name,
          email: payload.email,
          role: payload.role,
          isActive: payload.isActive ?? true,
          createdAt: payload.createdAt ?? new Date().toISOString(),
        };
        state.isAuthenticated = true;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        Cookies.remove("token");
      });
  },
});

export const { logout, setCredentials, clearError } = authSlice.actions;
export default authSlice.reducer;
