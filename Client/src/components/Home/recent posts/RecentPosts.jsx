import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { FaThumbsUp, FaThumbsDown, FaCommentAlt } from "react-icons/fa";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const fetchRecentPosts = async (axiosInstance) => {
  const res = await axiosInstance.get("/latest-posts");
  return res.data;
};

const RecentPosts = () => {
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const {
    data: popularPosts,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["recentPosts"],
    queryFn: () => fetchRecentPosts(axiosSecure),
  });

  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#e43636] mb-4"></div>
        <span className="text-[#e43636] text-lg font-semibold">
          Loading popular posts...
        </span>
      </div>
    );
  if (
    error ||
    !popularPosts ||
    !Array.isArray(popularPosts) ||
    popularPosts.length === 0
  )
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <div className="rounded-full h-16 w-16 bg-[#fff5f2] flex items-center justify-center border-4 border-[#e43636] mb-4">
          <span className="text-4xl text-[#e43636]">🔥</span>
        </div>
        <span className="text-[#e43636] text-lg font-semibold">
          No popular posts found.
        </span>
      </div>
    );

  return (
    <div className="my-10 px-2 sm:px-10">
      <h2 className="text-3xl font-bold text-[#e43636] mb-2 text-center tracking-tight">
        Recent Posts
      </h2>
      <p className="text-center text-gray-700 mb-8 max-w-5xl text-md mx-auto ">
        Explore the latest contributions from our community. Recent posts
        highlight new questions, ideas, and discussions, helping you stay
        up-to-date with what's happening right now on ThreadUp.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {popularPosts.map((post) => (
          <div
            onClick={() => navigate(`/all-posts/${post._id}`)}
            key={post._id}
            className="bg-[#EEEEEE] rounded-xl shadow-lg hover:shadow-2xl hover:scale-102 transition-all duration-300 overflow-hidden border border-gray-100 cursor-pointer flex flex-col justify-between h-full"
          >
            <div className="p-6 flex flex-col justify-between h-full">
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={post.authorImage}
                  alt={post.authorName}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-100"
                />
                <div className="w-full">
                  <h3 className="font-bold text-sm text-gray-800">
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
                {post.tags && Array.isArray(post.tags)
                  ? post.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold"
                      >
                        #{tag}
                      </span>
                    ))
                  : post.tag && (
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
    </div>
  );
};

export default RecentPosts;
