import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAuth from "../../hooks/useAuth";
import { axiosSecure } from "../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

const MyPosts = () => {
  const { user } = useAuth();
  const email = user?.email;
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["userPosts", email],
    queryFn: async () => {
      if (!email) throw new Error("Email is required");

      const res = await axiosSecure.get(`/my-posts?email=${email}`);
      return res.data;
    },
    enabled: !!email,
  });
  console.log("these are ", data?.posts);
  const posts = data?.posts || [];

  // Use mutation hook at component level
  const deletePostMutation = useMutation({
    mutationFn: async (id) => {
      const res = await axiosSecure.delete(`/delete/${id}`);
      return res.data;
    },
    onSuccess: () => {
      // Refetch posts after successful deletion
      queryClient.invalidateQueries(["userPosts"]);
      // Show success message
      Swal.fire({
        title: "Deleted!",
        text: "Your post has been deleted successfully.",
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "#10B981",
      });
    },
    onError: (error) => {
      console.error("Delete failed:", error.message);
      // Show error message
      Swal.fire({
        title: "Error!",
        text: "Failed to delete post. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#EF4444",
      });
    },
  });

  // Handle delete post function
  const handleDeletePost = (postId, postTitle) => {
    Swal.fire({
      title: "Are you sure?",
      text: `Do you want to delete "${postTitle}"? This action cannot be undone!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        deletePostMutation.mutate(postId);
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-600 p-8">
        <p>Error loading your posts. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800">My Posts</h2>
        <p className="text-gray-600 mt-1">
          You have {posts.length} published post{posts.length !== 1 ? "s" : ""}
        </p>
      </div>

      {posts.length > 0 ? (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Post Title
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Number of Votes
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Comment
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Delete
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {posts.map((post) => (
                  <tr
                    key={post._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {/* Post Title */}
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-3">
                        {post.image && (
                          <img
                            src={post.image}
                            alt={post.title}
                            className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                          />
                        )}
                        <div className="min-w-0 flex-1">
                          <h3 className="text-sm font-bold text-gray-900 line-clamp-2">
                            {post.title}
                          </h3>
                          <div className="text-xs text-gray-500 mt-1">
                            <p>
                              Created:{" "}
                              {new Date(post.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Number of Votes */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <span className="text-green-600">👍</span>
                          <span className="text-sm font-semibold text-gray-700">
                            {post.upVote || 0}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-red-600">👎</span>
                          <span className="text-sm font-semibold text-gray-700">
                            {post.downVote || 0}
                          </span>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Total: {(post.upVote || 0) + (post.downVote || 0)} votes
                      </div>
                    </td>

                    {/* Comment Button */}
                    <td className="px-6 py-4">
                      <button
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                        title="View Comments"
                      >
                        <span className="text-blue-600">💬</span>
                        Comments ({post.comments?.length || 0})
                      </button>
                    </td>

                    {/* Delete Button */}
                    <td className="px-6 py-4">
                      <button
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Delete Post"
                        onClick={() => handleDeletePost(post._id, post.title)}
                        disabled={deletePostMutation.isPending}
                      >
                        <span>🗑️</span>
                        {deletePostMutation.isPending
                          ? "Deleting..."
                          : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">No posts yet</h3>
          <p className="text-gray-600 mb-6">
            Start sharing your thoughts with the community!
          </p>
        </div>
      )}
    </div>
  );
};

export default MyPosts;
