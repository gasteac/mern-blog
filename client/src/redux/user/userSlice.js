import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentUser: null,
    error: null,
    isLoading: false,
}
export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signInStart: (state) => {
      (state.isLoading = true), (state.error = false);
    },
    signInSuccess: (state, action) => {
      state.currentUser = action.payload;
      ((state.isLoading = false)),
        (state.error = null);
    },
    signInFailure: (state, action) => {
      (state.isLoading = false), (state.error = action.payload);
    },
    signInInProcess: (state)=>{
      state.error = null
    },
    SignUpStart: (state) => {
      (state.isLoading = true), (state.error = false);
    },
    SignUpSuccess: (state, action) => {
      state.currentUser = action.payload;
      ((state.isLoading = false)),
        (state.error = null);
    },
    SignUpFailure: (state, action) => {
      (state.isLoading = false), (state.error = action.payload);
    },
    SignUpInProcess: (state)=>{
      state.error = null
  }}
});
export const {
  signInStart,
  signInSuccess,
  signInFailure,
  signInInProcess,
  SignUpStart,
  SignUpSuccess,
  SignUpFailure,
  SignUpInProcess
} = userSlice.actions;

