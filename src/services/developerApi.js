// src/services/developerApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const developerApi = createApi({
  reducerPath: "developerApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3001/" }), // Ensure JSON Server is running
  endpoints: (builder) => ({
    getDevelopers: builder.query({
      query: ({ page = 1, limit = 10, search = "", language = "" }) => {
        const params = new URLSearchParams();
        params.append("_page", page);
        params.append("_limit", limit);

        if (search) params.append("name_like", search);
        if (language) params.append("skills_like", language);

        return `developers?${params.toString()}`;
      },

      // Extract pagination info from headers
      transformResponse: (response, meta) => {
        const totalCountHeader = meta?.response?.headers?.get("X-Total-Count");
        const totalCount = totalCountHeader
          ? parseInt(totalCountHeader, 10)
          : response.length;

        return {
          data: response,
          totalCount,
        };
      },
    }),

    getDeveloperById: builder.query({
      query: (id) => {
        return `developers/${id}`;
      },
    }),
  }),
});

export const { useGetDevelopersQuery, useGetDeveloperByIdQuery } = developerApi;
