import React from "react";
import { Link } from "react-router-dom";

const BlogCard = ({ blog }) => {
  return (
    <Link to={`/blogs/${blog.id}`} className="block">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transform hover:scale-105 transition-transform duration-200">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
          {blog.title}
        </h2>
        <p className="text-gray-700 dark:text-gray-300 text-sm mb-3 line-clamp-3">
          {blog.excerpt}
        </p>
        <p className="text-gray-500 dark:text-gray-400 text-xs">
          Published: {new Date(blog.date).toLocaleDateString()}
        </p>
      </div>
    </Link>
  );
};

export default BlogCard;
