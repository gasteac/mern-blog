import { createSlice } from "@reduxjs/toolkit";
// Esto se encarga de manejar el estado global del tema de la aplicación.
export const themeSlice = createSlice({
  name: "theme",
  initialState: {
    theme: "dark",
  },
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === "light" ? "dark" : "light";
    },
  },
});
export const { toggleTheme } = themeSlice.actions;
