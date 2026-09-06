import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Tenant } from "@/types";

interface TenantState {
  list: Tenant[];
  total: number;
  selected: Tenant | null;
}

const initialState: TenantState = {
  list: [],
  total: 0,
  selected: null,
};

const tenantSlice = createSlice({
  name: "tenant",
  initialState,
  reducers: {
    setTenants: (state, action: PayloadAction<{ items: Tenant[]; total: number }>) => {
      state.list = action.payload.items;
      state.total = action.payload.total;
    },
    upsertTenant: (state, action: PayloadAction<Tenant>) => {
      const idx = state.list.findIndex((t) => t.uuid === action.payload.uuid);
      if (idx >= 0) {
        state.list[idx] = action.payload;
      } else {
        state.list.unshift(action.payload);
        state.total += 1;
      }
      if (state.selected?.uuid === action.payload.uuid) {
        state.selected = action.payload;
      }
    },
    removeTenant: (state, action: PayloadAction<string>) => {
      state.list = state.list.filter((t) => t.uuid !== action.payload);
      state.total = Math.max(0, state.total - 1);
    },
    setSelectedTenant: (state, action: PayloadAction<Tenant | null>) => {
      state.selected = action.payload;
    },
  },
});

export const { setTenants, upsertTenant, removeTenant, setSelectedTenant } =
  tenantSlice.actions;
export default tenantSlice.reducer;
