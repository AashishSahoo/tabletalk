import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AdminUser } from "@/types";

interface AuthState {
  user: AdminUser | null;
  token: string | null;
  status: "idle" | "checking" | "authenticated" | "unauthenticated";
}

const initialState: AuthState = {
  user: null,
  token: null,
  status: "idle",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: AdminUser; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.status = "authenticated";
    },
    setAuthChecking: (state) => {
      state.status = "checking";
    },
    setUnauthenticated: (state) => {
      state.user = null;
      state.token = null;
      state.status = "unauthenticated";
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.status = "unauthenticated";
    },
  },
});

export const { setCredentials, setAuthChecking, setUnauthenticated, logout } = authSlice.actions;
export default authSlice.reducer;
