import { useRef, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { searchFilteredPosts } from "../../../servises/api";
import { useSearch } from "../../../hooks/useFilter";

const SearchBar = () => {
  const inputRef = useRef();
  const { setPosts } = useSearch();
  const [search, setSearch] = useState(" ");

  const handleSearch = (e) => {
    e.preventDefault();
    const search = e.target.search.value;
    console.log(search);
    setSearch(search);
    // Reset input
    inputRef.current.value = "";
  };

  const { data, error, isLoading } = useQuery({
    queryKey: ["posts", { search }],
    queryFn: searchFilteredPosts,
  });

  // Use useEffect to update posts when data changes
  useEffect(() => {
    if (data) {
      setPosts(data);
    }
  }, [data, setPosts]);

  if (isLoading) return;
  <div className="flex justify-center items-center h-64">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
  </div>;
  if (error) return <p>Error: {error.message}</p>;

  // console.log("data found", data);

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
          <div className="bg-white rounded-2xl shadow-2xl p-2 flex items-center gap-2">
            {/* Search input */}
            <div className="flex-1 relative">
              <input
                type="text"
                ref={inputRef}
                name="search"
                placeholder="Search for posts, topics, or users..."
                className="input input-bordered w-full bg-gray-50 border-gray-200 focus:border-purple-400 focus:outline-none pr-12"
              />
            </div>

            {/* Search button */}
            <button
              type="submit"
              className="btn bg-gradient-to-r from-purple-500 to-[#e43636] text-white border-none hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
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
