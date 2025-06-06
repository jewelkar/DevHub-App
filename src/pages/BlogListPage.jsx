import React, { Suspense, lazy } from "react";
import { useGetAllBlogsQuery } from "../services/blogApi";
import { Link } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";

// Lazy load the BlogCard component
const BlogCard = lazy(() => import("../components/BlogCard"));

const BlogListPage = () => {
  const { data: blogs, isLoading, error } = useGetAllBlogsQuery();

  if (isLoading) return <LoadingSpinner />;
  if (error)
    return (
      <div className="text-center text-red-500 mt-8">Error loading blogs.</div>
    );

  return (
    <div className="container mx-auto p-4 dark:bg-gray-900 dark:text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">DevHub Blog</h1>
      <div className="text-right mb-4">
        <Link
          to="/blogs/new"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Create New Blog Post
        </Link>
      </div>
      {blogs && blogs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <Suspense key={blog.id} fallback={<LoadingSpinner />}>
              <BlogCard blog={blog} />
            </Suspense>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600 dark:text-gray-400">
          No blog posts yet.
        </p>
      )}
    </div>
  );
};

export default BlogListPage;
