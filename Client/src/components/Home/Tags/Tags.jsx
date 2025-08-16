import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearch } from "../../../hooks/useFilter";
import { axiosPublic } from "../../../hooks/useAxios";

const Tags = () => {
  const [selectedTag, setSelectedTag] = useState(null);
  const { setTag } = useSearch();

  // Fetch tags using TanStack Query
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["tags"],
    queryFn: async () => {
      const response = await axiosPublic.get("/tags");
      return response.data;
    },
  });

  console.log("Fetched tags data:", data);

  // Extract tags from the response (based on API structure: { success: true, tags: [...] })
  const tags = data?.tags || [];

  // Color array for tags
  const tagColors = [
    "bg-yellow-100 text-yellow-800",
    "bg-blue-100 text-blue-800",
    "bg-green-100 text-green-800",
    "bg-purple-100 text-purple-800",
    "bg-red-100 text-red-800",
    "bg-indigo-100 text-indigo-800",
    "bg-orange-100 text-orange-800",
    "bg-gray-100 text-gray-800",
    "bg-pink-100 text-pink-800",
    "bg-cyan-100 text-cyan-800",
    "bg-amber-100 text-amber-800",
    "bg-emerald-100 text-emerald-800",
  ];

  // Assign colors to tags
  const tagsWithColors = tags.map((tag, index) => ({
    ...tag,
    color: tagColors[index % tagColors.length],
  }));

  const handleTagClick = (tagName) => {
    setSelectedTag(tagName);
    setTag(tagName); // Update the context tag as well
    if (tagName === "All") {
      console.log("Showing all posts");
    } else {
      console.log(`Filtering posts with tag: ${tagName}`);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Trending Tags
          </h2>
        </div>
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
          <span className="ml-4 text-gray-600">Loading tags...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Trending Tags
          </h2>
        </div>
        <div className="text-center text-red-600 py-12">
          <p>Error loading tags: {error?.message || "Please try again."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="sm:px-10 sm:py-13 py-7">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">Trending Tags</h2>
      </div>

      {/* Trending Tags Section */}
      <div className="mb-12">
        <div className="flex flex-wrap justify-center gap-3">
          {/* All Tags Button */}
          <button
            onClick={() => handleTagClick("All")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105 transform ${
              selectedTag === "All"
                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                : "bg-gray-100 text-gray-800"
            } hover:shadow-md`}
          >
            All Posts
          </button>

          {/* Individual Tags */}
          {tagsWithColors.map((tag) => (
            <button
              key={`trending-${tag._id || tag.id || tag.name}`}
              onClick={() => handleTagClick(tag.name)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105 transform ${
                selectedTag === tag.name
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                  : tag.color
              } hover:shadow-md`}
            >
              #{tag.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Tags;
