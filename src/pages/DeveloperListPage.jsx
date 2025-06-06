// src/pages/DeveloperListPage.jsx
import React, { useState, Suspense, useMemo } from "react";
import { useGetDevelopersQuery } from "../services/developerApi";
import { Link } from "react-router-dom";
import Pagination from "../components/Pagination";
import DeveloperCard from "../components/DeveloperCard";
import LoadingSpinner from "../components/LoadingSpinner";

const DeveloperListPage = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [languageFilter, setLanguageFilter] = useState("");
  const limit = 6;

  const queryParams = useMemo(
    () => ({ page, limit, search, language: languageFilter }),
    [page, limit, search, languageFilter]
  );

  const { data, isLoading, isFetching, error } =
    useGetDevelopersQuery(queryParams);

  const developers = data?.data || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / limit);

  const handleSearchChange = (e) => {
    setSearch(e.target.value.trim());
    setPage(1);
  };

  const handleLanguageFilterChange = (e) => {
    setLanguageFilter(e.target.value.trim());
    setPage(1);
  };

  if (error) {
    return (
      <div className="mt-8 text-center text-red-500">
        Error:{" "}
        {error?.message || "Unable to fetch data. Please try again later."}
      </div>
    );
  }

  return (
    <div className="container min-h-screen p-4 mx-auto dark:bg-gray-900 dark:text-white">
      <h1 className="mb-6 text-3xl font-bold text-center">
        DevHub Developer Directory
      </h1>

      {/* Search & Filter */}
      <div className="flex flex-col gap-4 mb-6 md:flex-row">
        <input
          type="text"
          placeholder="Search developers..."
          value={search}
          onChange={handleSearchChange}
          className="w-full p-2 border rounded-md md:flex-1 dark:bg-gray-700 dark:text-white dark:border-gray-600"
        />
        <select
          value={languageFilter}
          onChange={handleLanguageFilterChange}
          className="w-full p-2 border rounded-md md:w-auto dark:bg-gray-700 dark:text-white dark:border-gray-600"
        >
          <option value="">Filter by Language</option>
          <option value="React">React</option>
          <option value="Node.js">Node.js</option>
          <option value="JavaScript">JavaScript</option>
          <option value="Python">Python</option>
          <option value="CSS">CSS</option>
        </select>
      </div>

      {/* Developer List */}
      {isLoading || isFetching ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {developers.length > 0 ? (
              developers.map((dev) => (
                <Suspense key={dev.id} fallback={<LoadingSpinner />}>
                  <DeveloperCard developer={dev} />
                </Suspense>
              ))
            ) : (
              <p className="text-center text-gray-600 col-span-full dark:text-gray-400">
                No developers found.
              </p>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          )}
        </>
      )}
    </div>
  );
};

export default DeveloperListPage;
