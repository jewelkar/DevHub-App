import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../features/auth/authSlice";
import { toggleTheme } from "../features/theme/themeSlice";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { mode } = useSelector((state) => state.theme);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/login");
  };

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  return (
    <header className="bg-white shadow-md dark:bg-gray-800">
      <nav className="container flex items-center justify-between px-4 py-4 mx-auto">
        <Link
          to="/"
          className="text-2xl font-bold text-blue-600 dark:text-blue-400"
        >
          DevHub
        </Link>
        <div className="flex items-center space-x-4">
          <Link
            to="/developers"
            className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
          >
            Developers
          </Link>
          <Link
            to="/blogs"
            className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
          >
            Blogs
          </Link>

          {isAuthenticated ? (
            <>
              <span className="hidden text-gray-700 dark:text-gray-300 md:block">
                Welcome, {user?.username}
              </span>
              <button
                onClick={handleLogout}
                className="px-3 py-1 text-sm text-white bg-red-500 rounded-md hover:bg-red-600"
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="px-3 py-1 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600"
            >
              Sign In
            </Link>
          )}

          {/* Dark Mode Toggle */}
          <button
            onClick={handleThemeToggle}
            className="p-2 text-gray-800 bg-gray-200 rounded-full dark:bg-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Toggle dark mode"
          >
            {mode === "dark" ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 10a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 00-.707-.293h-.008a1 1 0 00-.707 1.707l.707.707a1 1 0 001.414-1.414l-.707-.707zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-5 6a1 1 0 01-1 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM3 11a1 1 0 100-2H2a1 1 0 100 2h1zm4.95-4.95l-.707-.707a1 1 0 00-1.414 1.414l.707.707a1 1 0 001.414-1.414z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.914A8.999 8.999 0 0110 18c-4.418 0-8-3.582-8-8 0-2.427 1.077-4.636 2.898-6.183a8.999 8.000 0 0014.395 6.183z" />
              </svg>
            )}
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header;
