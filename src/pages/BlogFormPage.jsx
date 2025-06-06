import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import {
  useCreateBlogPostMutation,
  useUpdateBlogPostMutation,
  useGetBlogByIdQuery,
} from "../services/blogApi";
import { useSelector } from "react-redux";
import LoadingSpinner from "../components/LoadingSpinner";

const blogSchema = yup.object().shape({
  title: yup
    .string()
    .required("Title is required")
    .min(5, "Title must be at least 5 characters"),
  excerpt: yup
    .string()
    .required("Excerpt is required")
    .min(10, "Excerpt must be at least 10 characters"),
  content: yup
    .string()
    .required("Content is required")
    .min(50, "Content must be at least 50 characters"),
});

const BlogFormPage = () => {
  const { id } = useParams(); // For edit mode
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth); // Get current user for authorId

  const isEditMode = !!id;

  const {
    data: blogToEdit,
    isLoading: isBlogLoading,
    error: blogError,
  } = useGetBlogByIdQuery(id, {
    skip: !isEditMode, // Skip query if not in edit mode
  });

  const [createBlogPost, { isLoading: isCreating }] =
    useCreateBlogPostMutation();
  const [updateBlogPost, { isLoading: isUpdating }] =
    useUpdateBlogPostMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(blogSchema),
  });

  useEffect(() => {
    if (isEditMode && blogToEdit) {
      reset(blogToEdit); // Populate form for editing
    }
  }, [isEditMode, blogToEdit, reset]);

  const onSubmit = async (data) => {
    try {
      if (isEditMode) {
        await updateBlogPost({ id, ...data });
        navigate(`/blogs/${id}`);
      } else {
        // Assign authorId from the logged-in user
        const newBlog = {
          ...data,
          date: new Date().toISOString(),
          authorId: user.id,
          authorName: user.username, // Or display name
          comments: [],
        };
        const result = await createBlogPost(newBlog);
        if (result.data) {
          navigate(`/blogs/${result.data.id}`);
        }
      }
    } catch (err) {
      console.error("Failed to save blog:", err);
      // Handle error display
    }
  };

  if (isEditMode && isBlogLoading) return <LoadingSpinner />;
  if (isEditMode && blogError)
    return (
      <div className="text-center text-red-500 mt-8">
        Error loading blog for editing.
      </div>
    );

  return (
    <div className="container mx-auto p-4 dark:bg-gray-900 dark:text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">
        {isEditMode ? "Edit Blog Post" : "Create New Blog Post"}
      </h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md max-w-3xl mx-auto"
      >
        <div className="mb-4">
          <label
            htmlFor="title"
            className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            {...register("title")}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-white dark:border-gray-600"
          />
          {errors.title && (
            <p className="text-red-500 text-xs italic mt-1">
              {errors.title.message}
            </p>
          )}
        </div>
        <div className="mb-4">
          <label
            htmlFor="excerpt"
            className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
          >
            Excerpt
          </label>
          <textarea
            id="excerpt"
            {...register("excerpt")}
            rows="3"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-white dark:border-gray-600"
          ></textarea>
          {errors.excerpt && (
            <p className="text-red-500 text-xs italic mt-1">
              {errors.excerpt.message}
            </p>
          )}
        </div>
        <div className="mb-6">
          <label
            htmlFor="content"
            className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
          >
            Content (Markdown)
          </label>
          <textarea
            id="content"
            {...register("content")}
            rows="15"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-white dark:border-gray-600"
          ></textarea>
          {errors.content && (
            <p className="text-red-500 text-xs italic mt-1">
              {errors.content.message}
            </p>
          )}
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
            disabled={isCreating || isUpdating}
          >
            {isCreating || isUpdating
              ? "Saving..."
              : isEditMode
              ? "Update Blog"
              : "Create Blog"}
          </button>
          <button
            type="button"
            onClick={() => navigate(isEditMode ? `/blogs/${id}` : "/blogs")}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default BlogFormPage;
