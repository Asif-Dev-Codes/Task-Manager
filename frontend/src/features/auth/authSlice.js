import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    // add async cases here later
  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;