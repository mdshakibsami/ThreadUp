import { useParams } from "react-router";
import { axiosSecure } from "../../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";

const PostDetails = () => {
  const { id } = useParams();
  console.log(id);

  const fetchPostById = async () => {
    const response = await axiosSecure.get(`/posts/${id}`);
    return response.data;
  };

  const {
    data: post,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["post", id],
    queryFn: fetchPostById,
  });

  console.log(post);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">
            Error Loading Post
          </h2>
          <p className="text-gray-600">
            The post you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.description,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const handleComment = () => {
    // Add comment functionality here
    console.log("Comment clicked");
  };

  const handleUpvote = () => {
    // Add upvote functionality here
    console.log("Upvote clicked");
  };

  const handleDownvote = () => {
    // Add downvote functionality here
    console.log("Downvote clicked");
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Author Section */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <img
              src={post.authorImage}
              alt={post.authorName}
              className="w-16 h-16 rounded-full object-cover ring-4 ring-blue-100"
            />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {post.authorName}
              </h3>
              <p className="text-sm text-gray-500">{post.authorEmail}</p>
              <p className="text-sm text-gray-500">
                {new Date(post.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Post Content */}
        <div className="p-6">
          {/* Post Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
            {post.title}
          </h1>

          {/* Post Description */}
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            {post.description}
          </p>

          {/* Post Image */}
          {post.image && (
            <div className="mb-6">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-auto rounded-lg shadow-md"
              />
            </div>
          )}

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-600 mb-3">
                Tags:
              </h4>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors cursor-pointer"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between">
            {/* Left side - Engagement buttons */}
            <div className="flex items-center gap-6">
              {/* Upvote Button */}
              <button
                onClick={handleUpvote}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition-all duration-200 group"
              >
                <svg
                  className="w-5 h-5 group-hover:scale-110 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 15l7-7 7 7"
                  />
                </svg>
                <span className="font-semibold">{post.upVote}</span>
                <span className="text-sm">Upvote</span>
              </button>

              {/* Downvote Button */}
              <button
                onClick={handleDownvote}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 transition-all duration-200 group"
              >
                <svg
                  className="w-5 h-5 group-hover:scale-110 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
                <span className="font-semibold">{post.downVote}</span>
                <span className="text-sm">Downvote</span>
              </button>

              {/* Comment Button */}
              <button
                onClick={handleComment}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-all duration-200 group"
              >
                <svg
                  className="w-5 h-5 group-hover:scale-110 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                  />
                </svg>
                <span className="font-semibold">{post.commentsCount}</span>
                <span className="text-sm">Comments</span>
              </button>
            </div>

            {/* Right side - Share button */}
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-200 group"
            >
              <svg
                className="w-5 h-5 group-hover:scale-110 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                />
              </svg>
              <span className="text-sm">Share</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetails;
