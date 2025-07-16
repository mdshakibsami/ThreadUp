import { useSearch } from "../../../hooks/useFilter";

const Posts = () => {
  const { posts } = useSearch();
  console.log("all the posts", posts);
  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
        All Posts
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {posts &&
          posts.map((post) => (
            <div
              key={post._id}
              className="bg-white rounded-xl shadow-lg hover:shadow-2xl hover:scale-102 transition-all duration-300 overflow-hidden border border-gray-100 cursor-pointer"
            >
              {/* Author Section */}
              <div className="p-6">
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
                      <span className="text-green-600">👍</span>
                      <span className="text-sm font-semibold text-gray-700">
                        {post.upVote}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-red-600">👎</span>
                      <span className="text-sm font-semibold text-gray-700">
                        {post.downVote}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-blue-600">💬</span>
                    <span className="text-sm font-semibold text-gray-700">
                      {post.commentsCount}
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

export default Posts;
