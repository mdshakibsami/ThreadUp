import React, { useState } from "react";

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Search query:", searchQuery);
    console.log("Category:", selectedCategory);
    // Handle search logic here
  };

  const categories = [
    { value: "all", label: "All Posts" },
    { value: "technology", label: "Technology" },
    { value: "lifestyle", label: "Lifestyle" },
    { value: "travel", label: "Travel" },
    { value: "food", label: "Food" },
    { value: "fashion", label: "Fashion" },
    { value: "health", label: "Health" },
  ];

  return (
    <div className="relative bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 py-20 px-4 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-10 left-10 w-20 h-20 bg-blue-500 bg-opacity-20 rounded-full blur-xl"></div>
        <div className="absolute top-32 right-20 w-32 h-32 bg-purple-500 bg-opacity-20 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 left-1/3 w-24 h-24 bg-pink-500 bg-opacity-20 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-28 h-28 bg-blue-600 bg-opacity-15 rounded-full blur-xl"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Banner text */}
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
          Discover Amazing Content
        </h1>
        <p className="text-xl md:text-2xl text-white text-opacity-90 mb-8 drop-shadow-md">
          Search through thousands of posts, stories, and discussions
        </p>

        {/* Search form */}
        <form onSubmit={handleSearch} className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-2 flex flex-col md:flex-row gap-2">
            {/* Category selector */}
            <div className="flex-shrink-0">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="select select-bordered w-full md:w-auto bg-gray-50 border-gray-200 focus:border-purple-400 focus:outline-none"
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Search input */}
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search for posts, topics, or users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input input-bordered w-full bg-gray-50 border-gray-200 focus:border-purple-400 focus:outline-none pr-12"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            {/* Search button */}
            <button
              type="submit"
              className="btn bg-gradient-to-r from-purple-500 to-pink-500 text-white border-none hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              Search
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SearchBar;
