import React from "react";
import useAuth from "../../hooks/useAuth";
import useDBUser from "../../hooks/useDBUser";
import { useQuery } from "@tanstack/react-query";
import { axiosSecure } from "../../hooks/useAxiosSecure";
import { useNavigate } from "react-router";

const MyProfile = () => {
  const { user } = useAuth();
  const { data: dbUser } = useDBUser(user?.uid);
  const navigate = useNavigate();
  // console.log("data from userdb", dbUser);

  const email = user?.email;
  console.log(email);
  const { data, isLoading, isError } = useQuery({
    queryKey: ["userPosts", email],
    queryFn: async () => {
      if (!email) throw new Error("Email is required");

      const res = await axiosSecure.get(`/three-posts?email=${email}`);
      return res.data;
    },
    enabled: !!email,
  });
  console.log("these are ", data?.posts);
  const threeePosts = data?.posts || [];

  // Get user data from database or use defaults
  const userData = {
    isMember: dbUser?.isMember || false,
    badge: dbUser?.badge,
    joinDate: dbUser?.createdAt
      ? new Date(dbUser.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
        })
      : "January 2024",
    postsCount: dbUser?.postCount || 0,
    role: dbUser?.role,
  };

  // Handle post click navigation
  const handlePostClick = (postId) => {
    navigate(`/posts/${postId}`);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* User Profile Card */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Profile Image */}
          <img
            src={
              dbUser?.photoURL ||
              user?.photoURL ||
              "https://via.placeholder.com/120"
            }
            alt={dbUser?.name || user?.displayName || "User"}
            className="w-32 h-32 rounded-full object-cover ring-4 ring-blue-100 shadow-lg"
          />

          {/* User Info */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {dbUser?.name || user?.displayName || "User Name"}
            </h1>
            <p className="text-gray-600 mb-2">
              {dbUser?.email || user?.email || "user@example.com"}
            </p>
            <p className="text-sm text-gray-500 mb-4">Role: {userData.role}</p>

            {/* User Stats */}
            <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-4">
              <div className="bg-blue-50 px-4 py-2 rounded-lg">
                <span className="text-blue-600 font-semibold">Posts: </span>
                <span className="text-gray-800 font-bold">
                  {userData.postsCount}
                </span>
              </div>
              <div className="bg-green-50 px-4 py-2 rounded-lg">
                <span className="text-green-600 font-semibold">Badge: </span>
                <span className="text-gray-800 font-bold capitalize">
                  {userData.badge}
                </span>
              </div>
              <div className="bg-purple-50 px-4 py-2 rounded-lg">
                <span className="text-purple-600 font-semibold">
                  Member since:{" "}
                </span>
                <span className="text-gray-800 font-bold">
                  {userData.joinDate}
                </span>
              </div>
            </div>

            {/* Badges */}
            <div className="flex justify-center md:justify-start gap-3">
              {/* Dynamic Badge based on database value */}
              {userData.badge === "bronze" && (
                <div className="flex items-center gap-2 bg-gradient-to-r from-orange-400 to-orange-600 text-white px-4 py-2 rounded-full shadow-md">
                  <span className="text-xl">🥉</span>
                  <span className="font-semibold">Bronze Member</span>
                </div>
              )}

              {userData.badge === "gold" && (
                <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-4 py-2 rounded-full shadow-md">
                  <span className="text-xl">🥇</span>
                  <span className="font-semibold">Gold Member</span>
                </div>
              )}

              {/* Premium Member Badge - Show if isMember is true */}
              {userData.isMember && (
                <div className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-purple-700 text-white px-4 py-2 rounded-full shadow-md">
                  <span className="text-xl">👑</span>
                  <span className="font-semibold">Premium Member</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Posts Section */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          My Recent Posts
        </h2>

        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : isError ? (
          <div className="text-center text-red-600 p-4">
            <p>Error loading your recent posts. Please try again.</p>
          </div>
        ) : threeePosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {threeePosts.map((post) => (
              <div
                key={post._id}
                className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow duration-200 cursor-pointer hover:bg-gray-100"
                onClick={() => handlePostClick(post._id)}
              >
                {/* Post Header */}
                <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2">
                  {post.title}
                </h3>

                {/* Post Description */}
                <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                  {post.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {post.tags && Array.isArray(post.tags)
                    ? post.tags.slice(0, 2).map((tag, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium"
                        >
                          #{tag}
                        </span>
                      ))
                    : post.tag && (
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                          #{post.tag}
                        </span>
                      )}
                  {post.tags && post.tags.length > 2 && (
                    <span className="text-gray-500 text-xs px-2 py-1">
                      +{post.tags.length - 2} more
                    </span>
                  )}
                </div>

                {/* Post Stats */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <span className="text-green-600">👍</span>
                      <span className="text-gray-700 font-medium">
                        {post.upVote || 0}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-red-600">👎</span>
                      <span className="text-gray-700 font-medium">
                        {post.downVote || 0}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-blue-600">💬</span>
                      <span className="text-gray-700 font-medium">
                        {post.comments?.length || 0}
                      </span>
                    </div>
                  </div>
                  <span className="text-gray-500 text-xs">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {/* Click indicator */}
                <div className="mt-3 pt-2 border-t border-gray-200">
                  <p className="text-xs text-blue-600 font-medium text-center">
                    Click to view full post →
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-8">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              No posts yet
            </h3>
            <p className="text-gray-500">
              Start sharing your thoughts with the community!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProfile;
