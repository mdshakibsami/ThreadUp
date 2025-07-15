import React, { useState } from "react";

const Tags = () => {
  const [selectedTag, setSelectedTag] = useState(null);

  // Tags array with trending tags
  const trendingTags = [
    { name: "JavaScript", count: 2843, color: "bg-yellow-100 text-yellow-800" },
    { name: "React", count: 2156, color: "bg-blue-100 text-blue-800" },
    { name: "Python", count: 1987, color: "bg-green-100 text-green-800" },
    { name: "Health", count: 1876, color: "bg-green-100 text-green-800" },
    { name: "AI", count: 1654, color: "bg-purple-100 text-purple-800" },
    { name: "Fitness", count: 1543, color: "bg-red-100 text-red-800" },
    { name: "Art", count: 1432, color: "bg-red-100 text-red-800" },
    { name: "WebDev", count: 1432, color: "bg-indigo-100 text-indigo-800" },
    {
      name: "Photography",
      count: 1287,
      color: "bg-yellow-100 text-yellow-800",
    },
    { name: "Food", count: 1234, color: "bg-orange-100 text-orange-800" },
    { name: "Writing", count: 1098, color: "bg-blue-100 text-blue-800" },
    { name: "Travel", count: 1098, color: "bg-blue-100 text-blue-800" },
    { name: "DevOps", count: 987, color: "bg-gray-100 text-gray-800" },
    { name: "Music", count: 987, color: "bg-purple-100 text-purple-800" },
    { name: "Fashion", count: 876, color: "bg-pink-100 text-pink-800" },
    { name: "Design", count: 876, color: "bg-pink-100 text-pink-800" },
    { name: "Mindfulness", count: 654, color: "bg-purple-100 text-purple-800" },
    { name: "DIY", count: 654, color: "bg-green-100 text-green-800" },
    { name: "Gaming", count: 543, color: "bg-indigo-100 text-indigo-800" },
    { name: "Business", count: 432, color: "bg-gray-100 text-gray-800" },
    { name: "Sports", count: 398, color: "bg-blue-100 text-blue-800" },
    { name: "Technology", count: 356, color: "bg-cyan-100 text-cyan-800" },
    { name: "Books", count: 321, color: "bg-amber-100 text-amber-800" },
    { name: "Movies", count: 287, color: "bg-red-100 text-red-800" },
    { name: "Education", count: 245, color: "bg-emerald-100 text-emerald-800" },
  ];

  const handleTagClick = (tagName) => {
    setSelectedTag(tagName);
    console.log(`Searching for posts with tag: ${tagName}`);
    // Handle search logic here
  };

  const getTrendingTags = () => {
    return trendingTags.sort((a, b) => b.count - a.count);
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
          {getTrendingTags().map((tag) => (
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
              <span className="ml-2 text-xs opacity-75">{tag.count}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Tags;
