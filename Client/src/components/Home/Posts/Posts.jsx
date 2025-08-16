import { useNavigate } from "react-router";
import { FaThumbsUp, FaThumbsDown, FaCommentAlt } from "react-icons/fa";
import useAuth from "../../../hooks/useAuth";
import useDBUser from "../../../hooks/useDBUser";
import { useSearch } from "../../../hooks/useFilter";
import { useState, useEffect } from "react";

const Posts = () => {
  const { posts, tag } = useSearch();
  const { user } = useAuth();
  const { data } = useDBUser(user?.uid);
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  console.log(data);

  // Reset pagination when tag changes
  useEffect(() => {
    setCurrentPage(1);
  }, [tag]);

  // Sort posts based on popularity (upVote - downVote)
  const getSortedPosts = () => {
    if (!posts) return [];

    // First filter by tag if a tag is selected
    let filteredPosts = posts;
    if (tag && tag !== "All") {
      filteredPosts = posts.filter((post) => {
        if (post.tags && Array.isArray(post.tags)) {
          return post.tags.some(
            (postTag) => postTag.toLowerCase() === tag.toLowerCase()
          );
        }
        // Fallback for single tag (backward compatibility)
        if (post.tag) {
          return post.tag.toLowerCase() === tag.toLowerCase();
        }
        return false;
      });
    }

    // Then sort if popularity sort is selected
    if (sortBy === "popularity") {
      return [...filteredPosts].sort((a, b) => {
        const popularityA = (a.upVote || 0) - (a.downVote || 0);
        const popularityB = (b.upVote || 0) - (b.downVote || 0);
        return popularityB - popularityA; // Descending order
      });
    }

    return filteredPosts; // Default order with tag filtering
  };

  const sortedPosts = getSortedPosts();

  // Pagination logic
  const totalPosts = sortedPosts.length;
  const totalPages = Math.ceil(totalPosts / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const currentPosts = sortedPosts.slice(startIndex, endIndex);

  // Pagination handlers
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="sm:mx-10 mx-auto p-4">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">
            {tag && tag !== "All" ? `Posts tagged with #${tag}` : "All Posts"}
          </h2>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600 font-medium">Sort by:</span>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setSortBy("default");
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                sortBy === "default"
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Default
            </button>
            <button
              onClick={() => {
                setSortBy("popularity");
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                sortBy === "popularity"
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md transform scale-105"
                  : "bg-gray-100 text-gray-700 hover:bg-gradient-to-r hover:from-purple-100 hover:to-pink-100 hover:text-purple-700"
              }`}
            >
              <span>🔥</span>
              Popularity
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 ">
        {currentPosts &&
          currentPosts.map((post) => (
            <div
              onClick={() => navigate(`/all-posts/${post._id}`)}
              key={post._id}
              className="bg-[#EEEEEE] rounded-xl shadow-lg hover:shadow-2xl hover:scale-102 transition-all duration-300 overflow-hidden border border-gray-100 cursor-pointer flex flex-col justify-between h-full"
            >
              {/* Author Section */}
              <div className="p-6 flex flex-col justify-between h-full">
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={post.authorImage}
                    alt={post.authorName}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-100"
                  />
                  <div className="w-full">
                    <h3 className="font-bold text-xl text-gray-800">
                      {post.title}
                    </h3>
                    <div className="flex justify-between">
                      <p className="text-sm text-gray-600">
                        By{" "}
                        <span className="font-semibold">{post.authorName}</span>
                      </p>
                      <span className="text-xs text-gray-500">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Post Image */}
                {post.image && (
                  <div className="mb-4">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                )}

                {/* Post Description */}
                {post.description && (
                  <div className="mb-4">
                    <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
                      {post.description}
                    </p>
                  </div>
                )}

                {/* Tags and Meta Info */}
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  {/* Display multiple tags */}
                  {post.tags && Array.isArray(post.tags)
                    ? post.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold"
                        >
                          #{tag}
                        </span>
                      ))
                    : // Fallback for single tag (backward compatibility)
                      post.tag && (
                        <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                          #{post.tag}
                        </span>
                      )}
                </div>

                {/* Engagement Section */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <FaThumbsUp className="text-green-600" />
                      <span className="text-sm font-semibold text-gray-700">
                        {post.upVote}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FaThumbsDown className="text-red-600" />
                      <span className="text-sm font-semibold text-gray-700">
                        {post.downVote}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <FaCommentAlt className="text-blue-600" />
                    <span className="text-sm font-semibold text-gray-700">
                      {post.comments.length}
                    </span>
                    <span className="text-xs text-gray-500">comments</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-8 gap-2">
          {/* Previous Button */}
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
              currentPage === 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400"
            }`}
          >
            Previous
          </button>

          {/* Page Numbers */}
          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, index) => {
              const pageNumber = index + 1;
              const isCurrentPage = pageNumber === currentPage;

              // Show first page, last page, current page, and pages around current page
              const showPage =
                pageNumber === 1 ||
                pageNumber === totalPages ||
                Math.abs(pageNumber - currentPage) <= 1;

              // Show ellipsis
              const showEllipsis =
                (pageNumber === 2 && currentPage > 4) ||
                (pageNumber === totalPages - 1 && currentPage < totalPages - 3);

              if (!showPage && !showEllipsis) return null;

              if (showEllipsis) {
                return (
                  <span
                    key={`ellipsis-${pageNumber}`}
                    className="px-2 py-2 text-gray-400"
                  >
                    ...
                  </span>
                );
              }

              return (
                <button
                  key={pageNumber}
                  onClick={() => handlePageClick(pageNumber)}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    isCurrentPage
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600"
                  }`}
                >
                  {pageNumber}
                </button>
              );
            })}
          </div>

          {/* Next Button */}
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
              currentPage === totalPages
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Posts;
