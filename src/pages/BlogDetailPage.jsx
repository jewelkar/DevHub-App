import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  useGetBlogByIdQuery,
  useDeleteBlogPostMutation,
  useAddCommentMutation,
} from "../services/blogApi";
import { useSelector } from "react-redux";
import LoadingSpinner from "../components/LoadingSpinner";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const commentSchema = yup.object().shape({
  author: yup.string().required("Name is required"),
  content: yup.string().required("Comment cannot be empty"),
});

const BlogDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { data: blog, isLoading, error } = useGetBlogByIdQuery(id);
  const [deleteBlogPost] = useDeleteBlogPostMutation();
  const [addComment] = useAddCommentMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(commentSchema),
  });

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this blog post?")) {
      await deleteBlogPost(id);
      navigate("/blogs");
    }
  };

  const onCommentSubmit = async (data) => {
    await addComment({ blogId: id, comment: data });
    reset(); // Clear form after submission
  };

  if (isLoading) return <LoadingSpinner />;
  if (error)
    return (
      <div className="text-center text-red-500 mt-8">
        Error loading blog post.
      </div>
    );
  if (!blog)
    return (
      <div className="text-center text-gray-600 mt-8">Blog post not found.</div>
    );

  const isAuthor = isAuthenticated && user?.id === blog.authorId; // Assuming blog has authorId

  return (
    <div className="container mx-auto p-4 dark:bg-gray-900 dark:text-white min-h-screen">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          {blog.title}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
          Published on {new Date(blog.date).toLocaleDateString()} by{" "}
          {blog.authorName || "DevHub Author"}
        </p>

        <div className="prose dark:prose-invert max-w-none mb-8">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {blog.content}
          </ReactMarkdown>
        </div>

        {isAuthor && (
          <div className="flex gap-4 mb-8">
            <Link
              to={`/blogs/edit/${blog.id}`}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              Edit Blog
            </Link>
            <button
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Delete Blog
            </button>
          </div>
        )}

        <hr className="my-8 border-gray-200 dark:border-gray-700" />

        {/* Comment Section */}
        <h2 className="text-2xl font-bold mb-4">Comments</h2>
        {blog.comments && blog.comments.length > 0 ? (
          <div className="space-y-4 mb-8">
            {blog.comments.map((comment) => (
              <div
                key={comment.id}
                className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg"
              >
                <p className="font-semibold text-gray-900 dark:text-white">
                  {comment.author}
                </p>
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  {comment.content}
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                  {new Date(comment.date).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            No comments yet.
          </p>
        )}

        {isAuthenticated && (
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4">Leave a Comment</h3>
            <form
              onSubmit={handleSubmit(onCommentSubmit)}
              className="space-y-4"
            >
              <div>
                <label
                  htmlFor="commentAuthor"
                  className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
                >
                  Your Name
                </label>
                <input
                  type="text"
                  id="commentAuthor"
                  {...register("author")}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
                {errors.author && (
                  <p className="text-red-500 text-xs italic mt-1">
                    {errors.author.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="commentContent"
                  className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
                >
                  Comment
                </label>
                <textarea
                  id="commentContent"
                  {...register("content")}
                  rows="4"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-white dark:border-gray-600"
                ></textarea>
                {errors.content && (
                  <p className="text-red-500 text-xs italic mt-1">
                    {errors.content.message}
                  </p>
                )}
              </div>
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Post Comment
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogDetailPage;
