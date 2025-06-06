import React from "react";
import { useParams, Link } from "react-router-dom";
import { useGetDeveloperByIdQuery } from "../services/developerApi";
import LoadingSpinner from "../components/LoadingSpinner";

const DeveloperProfilePage = () => {
  const { id } = useParams();
  const { data: developer, isLoading, error } = useGetDeveloperByIdQuery(id);

  if (isLoading) return <LoadingSpinner />;
  if (error)
    return (
      <div className="text-center text-red-500 mt-8">
        Error loading developer profile.
      </div>
    );
  if (!developer)
    return (
      <div className="text-center text-gray-600 mt-8">Developer not found.</div>
    );

  return (
    <div className="container mx-auto p-4 dark:bg-gray-900 dark:text-white min-h-screen">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
        <div className="flex flex-col md:flex-row items-center md:items-start mb-8">
          <img
            src={developer.avatar}
            alt={developer.name}
            className="w-32 h-32 rounded-full object-cover mb-4 md:mb-0 md:mr-8 border-4 border-blue-400"
          />
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              {developer.name}
            </h1>
            <p className="text-gray-700 dark:text-gray-300 text-lg mb-4">
              {developer.bio}
            </p>
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              {developer.skills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-indigo-100 text-indigo-800 text-sm font-medium px-3 py-1 rounded-full dark:bg-indigo-900 dark:text-indigo-300"
                >
                  {skill}
                </span>
              ))}
            </div>
            <div className="flex gap-4 mt-4 justify-center md:justify-start">
              {developer.social.github && (
                <a
                  href={developer.social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-500"
                >
                  GitHub
                </a>
              )}
              {developer.social.linkedin && (
                <a
                  href={developer.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-500"
                >
                  LinkedIn
                </a>
              )}
            </div>
          </div>
        </div>

        <hr className="my-8 border-gray-200 dark:border-gray-700" />

        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Blog Posts by {developer.name}
        </h2>
        {developer.blogs && developer.blogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {developer.blogs.map((blog) => (
              <Link to={`/blogs/${blog.id}`} key={blog.id} className="block">
                <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {blog.title}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 text-sm mb-3">
                    {blog.excerpt}
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 text-xs">
                    Published: {new Date(blog.date).toLocaleDateString()}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 dark:text-gray-400">No blog posts yet.</p>
        )}
      </div>
    </div>
  );
};

export default DeveloperProfilePage;
