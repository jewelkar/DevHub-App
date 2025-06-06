import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import authReducer from "../features/auth/authSlice";
import themeReducer from "../features/theme/themeSlice";
import { developerApi } from "../services/developerApi";
import { blogApi } from "../services/blogApi";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    [developerApi.reducerPath]: developerApi.reducer,
    [blogApi.reducerPath]: blogApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(developerApi.middleware, blogApi.middleware),
});

setupListeners(store.dispatch);
