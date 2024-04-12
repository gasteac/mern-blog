import { createSlice } from "@reduxjs/toolkit";
// Initial State de userSlice
const initialState = {
  currentUser: null,
  error: null,
  isLoading: false,
};

// userSlice maneja el estado de la autenticación del usuario
// es solo un slice (una parte) del estado global de la aplicación
// aca NO se realizan tareas asincrónicas, solo se maneja el estado
// Si queremos realizar algo sincrono se debe usar un thunk
export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    //TODOS ESTOS SON LOS REDUCERS RECORDAR XDXD
    signInStart: (state) => {
      (state.isLoading = true), (state.error = false);
    },
    signInSuccess: (state, action) => {
      state.currentUser = action.payload;
      (state.isLoading = false), (state.error = null);
    },
    signInFailure: (state, action) => {
      (state.isLoading = false), (state.error = action.payload);
    },
    signInInProcess: (state) => {
      state.error = null;
    },
    signUpStart: (state) => {
      (state.isLoading = true), (state.error = false);
    },
    signUpSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    signUpFailure: (state, action) => {
      (state.isLoading = false), (state.error = action.payload);
    },
    signUpInProcess: (state) => {
      state.error = null;
    },
    modifyUserStart: (state) => {
      (state.isLoading = true), (state.error = false);
    },
    modifyUserSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    modifyUserFailure: (state, action) => {
      (state.isLoading = false), (state.error = action.payload);
    },
    deleteUserSuccess: (state) => {
      state.currentUser = null;
      state.isLoading = false;
      state.error = null;
    },
  },
});
export const {
  signInStart,
  signInSuccess,
  signInFailure,
  signInInProcess,
  signUpStart,
  signUpSuccess,
  signUpFailure,
  signUpInProcess,
  modifyUserStart,
  modifyUserSuccess,
  modifyUserFailure,
  deleteUserSuccess,
} = userSlice.actions;
