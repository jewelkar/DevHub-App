import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { loginUser } from "../features/auth/authSlice";
import { Navigate, useNavigate } from "react-router-dom";

const schema = yup.object().shape({
  username: yup.string().required("Username is required"),
  password: yup.string().required("Password is required"),
});

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error, isAuthenticated } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    const resultAction = await dispatch(loginUser(data));
    if (loginUser.fulfilled.match(resultAction)) {
      navigate("/developers"); // Redirect on successful login
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/developers" replace />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md p-8 bg-white rounded-lg shadow-md dark:bg-gray-800"
      >
        <h2 className="mb-6 text-2xl font-bold text-center text-gray-900 dark:text-white">
          Login to DevHub
        </h2>
        <div className="mb-4">
          <label
            className="block mb-2 text-sm font-bold text-gray-700 dark:text-gray-300"
            htmlFor="username"
          >
            Username
          </label>
          <input
            type="text"
            id="username"
            {...register("username")}
            className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-white dark:border-gray-600"
          />
          {errors.username && (
            <p className="mt-1 text-xs italic text-red-500">
              {errors.username.message}
            </p>
          )}
        </div>
        <div className="mb-6">
          <label
            className="block mb-2 text-sm font-bold text-gray-700 dark:text-gray-300"
            htmlFor="password"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            {...register("password")}
            className="w-full px-3 py-2 mb-3 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-white dark:border-gray-600"
          />
          {errors.password && (
            <p className="mt-1 text-xs italic text-red-500">
              {errors.password.message}
            </p>
          )}
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline disabled:opacity-50"
            disabled={status === "loading"}
          >
            {status === "loading" ? "Logging in..." : "Sign In"}
          </button>
        </div>
        {error && <p className="mt-4 text-center text-red-500">{error}</p>}
      </form>
    </div>
  );
};

export default LoginPage;
