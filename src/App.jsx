import React, { useEffect, Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setTheme } from "./features/theme/themeSlice";
import { loadUserFromStorage } from "./features/auth/authSlice";
import localforage from "localforage";

import Header from "./components/Header";
import Footer from "./components/Footer";
import LoadingSpinner from "./components/LoadingSpinner";
import ProtectedRoute from "./components/ProtectedRoute";

// Lazy loaded pages
const DeveloperListPage = lazy(() => import("./pages/DeveloperListPage"));
const DeveloperProfilePage = lazy(() => import("./pages/DeveloperProfilePage"));
const BlogListPage = lazy(() => import("./pages/BlogListPage"));
const BlogDetailPage = lazy(() => import("./pages/BlogDetailPage"));
const BlogFormPage = lazy(() => import("./pages/BlogFormPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

function App() {
  const dispatch = useDispatch();
  const { mode } = useSelector((state) => state.theme);

  // Load theme and user on app start
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const storedTheme = await localforage.getItem("theme");

        if (storedTheme) {
          dispatch(setTheme(storedTheme));
        } else if (typeof window !== "undefined" && window.matchMedia) {
          const prefersDarkMode = window.matchMedia(
            "(prefers-color-scheme: dark)"
          ).matches;
          dispatch(setTheme(prefersDarkMode ? "dark" : "light"));
        }

        dispatch(loadUserFromStorage());
      } catch (error) {}
    };

    loadInitialData();
  }, [dispatch]);

  // Apply dark/light mode class to body
  useEffect(() => {
    document.body.classList.remove("light", "dark");
    document.body.classList.add(mode);
  }, [mode]);

  return (
    <Router>
      <div className="flex flex-col min-h-screen text-gray-900 bg-gray-100 dark:bg-gray-900 dark:text-white">
        <Header />
        <main className="flex-grow">
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<DeveloperListPage />} />
              <Route path="/developers" element={<DeveloperListPage />} />
              <Route
                path="/developers/:id"
                element={<DeveloperProfilePage />}
              />
              <Route path="/blogs" element={<BlogListPage />} />
              <Route path="/blogs/:id" element={<BlogDetailPage />} />
              <Route path="/login" element={<LoginPage />} />

              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/blogs/new" element={<BlogFormPage />} />
                <Route path="/blogs/edit/:id" element={<BlogFormPage />} />
              </Route>

              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
