import { createSlice } from "@reduxjs/toolkit";
import localforage from "localforage";

const initialState = {
  mode: "light", // Always use light here; real value set in App.jsx useEffect
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
      localforage.setItem("theme", state.mode); // still okay
    },
    setTheme: (state, action) => {
      state.mode = action.payload;
      localforage.setItem("theme", state.mode);
    },
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;
