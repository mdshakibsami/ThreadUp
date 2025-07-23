import React, { useState } from "react";
import { useSearch } from "../../../hooks/useFilter";

const Tags = () => {
  const [selectedTag, setSelectedTag] = useState(null);
  const { setTag } = useSearch();

  // Tags array with trending tags
  const trendingTags = [
    { name: "JavaScript", color: "bg-yellow-100 text-yellow-800" },
    { name: "React", color: "bg-blue-100 text-blue-800" },
    { name: "Python", color: "bg-green-100 text-green-800" },
    { name: "Health", color: "bg-green-100 text-green-800" },
    { name: "AI", color: "bg-purple-100 text-purple-800" },
    { name: "Fitness", color: "bg-red-100 text-red-800" },
    { name: "Art", color: "bg-red-100 text-red-800" },
    { name: "WebDev", color: "bg-indigo-100 text-indigo-800" },
    { name: "Photography", color: "bg-yellow-100 text-yellow-800" },
    { name: "Food", color: "bg-orange-100 text-orange-800" },
    { name: "Writing", color: "bg-blue-100 text-blue-800" },
    { name: "Travel", color: "bg-blue-100 text-blue-800" },
    { name: "DevOps", color: "bg-gray-100 text-gray-800" },
    { name: "Music", color: "bg-purple-100 text-purple-800" },
    { name: "Fashion", color: "bg-pink-100 text-pink-800" },
    { name: "Design", color: "bg-pink-100 text-pink-800" },
    { name: "Mindfulness", color: "bg-purple-100 text-purple-800" },
    { name: "DIY", color: "bg-green-100 text-green-800" },
    { name: "Gaming", color: "bg-indigo-100 text-indigo-800" },
    { name: "Business", color: "bg-gray-100 text-gray-800" },
    { name: "Sports", color: "bg-blue-100 text-blue-800" },
    { name: "Technology", color: "bg-cyan-100 text-cyan-800" },
    { name: "Books", color: "bg-amber-100 text-amber-800" },
    { name: "Movies", color: "bg-red-100 text-red-800" },
    { name: "Education", color: "bg-emerald-100 text-emerald-800" },
  ];

  const handleTagClick = (tagName) => {
    setSelectedTag(tagName);
    setTag(tagName); // Update the context tag as well
    if (tagName === "All") {
      console.log("Showing all posts");
    } else {
      console.log(`Filtering posts with tag: ${tagName}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
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
          {trendingTags.map((tag) => (
            <button
              key={`trending-${tag.name}`}
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
