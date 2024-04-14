import { createSlice } from "@reduxjs/toolkit";
// Initial State de userSlice
const initialState = {
  error: null,
  isLoading: false,
};

// userSlice maneja el estado de la autenticación del usuario
// es solo un slice (una parte) del estado global de la aplicación
// aca NO se realizan tareas asincrónicas, solo se maneja el estado
// Si queremos realizar algo sincrono se debe usar un thunk
export const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    //TODOS ESTOS SON LOS REDUCERS RECORDAR XDXD
    startFromZero: (state) => {
      state.isLoading = false;
      state.error = null;
    },
  }
});
export const {
  signInStart
} = postSlice.actions;
