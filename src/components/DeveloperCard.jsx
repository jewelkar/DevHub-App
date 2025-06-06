import React from "react";
import { Link } from "react-router-dom";

const DeveloperCard = ({ developer = {} }) => {
  return (
    <Link to={`/developers/${developer?.id}`} className="block">
      <div className="p-6 transition-transform duration-200 transform bg-white rounded-lg shadow-md dark:bg-gray-800 hover:scale-105">
        <div className="flex items-center mb-4">
          <img
            src={developer?.avatar || "https://via.placeholder.com/150"}
            alt={developer?.name || "Developer Avatar"}
            className="object-cover w-16 h-16 mr-4 rounded-full"
          />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {developer?.name || "Unknown Developer"}
          </h2>
        </div>
        <p className="mb-4 text-gray-700 dark:text-gray-300 line-clamp-2">
          {developer?.bio || "No bio available."}
        </p>
        <div className="flex flex-wrap gap-2">
          {developer?.skills?.length ? (
            developer.skills.map((skill, index) => (
              <span
                key={index}
                className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300"
              >
                {skill}
              </span>
            ))
          ) : (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              No skills listed.
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default DeveloperCard;
