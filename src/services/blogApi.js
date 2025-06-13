import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const blogApi = createApi({
  reducerPath: "blogApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://devhub-backend-zz7i.onrender.com/",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Blog", "Comment"], // For invalidation
  endpoints: (builder) => ({
    getAllBlogs: builder.query({
      query: () => "blogs",
      providesTags: ["Blog"],
    }),
    getBlogById: builder.query({
      query: (id) => `blogs/${id}?_embed=comments`, // Fetch comments along with blog
      providesTags: (result, error, id) => [{ type: "Blog", id }, "Comment"],
    }),
    createBlogPost: builder.mutation({
      query: (newBlog) => ({
        url: "blogs",
        method: "POST",
        body: newBlog,
      }),
      invalidatesTags: ["Blog"],
    }),
    updateBlogPost: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `blogs/${id}`,
        method: "PUT", // Or PATCH for partial updates
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Blog", id }],
    }),
    deleteBlogPost: builder.mutation({
      query: (id) => ({
        url: `blogs/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Blog"],
    }),
    addComment: builder.mutation({
      query: ({ blogId, comment }) => ({
        url: `comments`, // Assuming comments are a top-level resource linked by blogId
        method: "POST",
        body: { ...comment, blogId, date: new Date().toISOString() }, // Add blogId to comment
      }),
      invalidatesTags: (result, error, { blogId }) => [
        { type: "Blog", id: blogId },
        "Comment",
      ],
    }),
  }),
});

export const {
  useGetAllBlogsQuery,
  useGetBlogByIdQuery,
  useCreateBlogPostMutation,
  useUpdateBlogPostMutation,
  useDeleteBlogPostMutation,
  useAddCommentMutation,
} = blogApi;
