import React, { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { axiosSecure } from "../../../hooks/useAxiosSecure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import Swal from "sweetalert2";
import {
  FacebookShareButton,
  FacebookIcon,
  WhatsappShareButton,
  WhatsappIcon,
  TelegramShareButton,
  TelegramIcon,
} from "react-share";

const PostDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [comment, setComment] = useState("");

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

  //  Upvote Query

  const { mutate: upvoteQuery, isPending: isUpvoting } = useMutation({
    mutationFn: async () => {
      const result = await axiosSecure.patch(`/posts/upvote/${id}`);
      console.log(result);
      return result.data;
    },
    onSuccess: () => {
      // This will refetch the post data immediately after successful upvote
      queryClient.invalidateQueries(["post", id]);
    },
    onError: (error) => {
      console.error("Upvote failed:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to upvote. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#EF4444",
      });
    },
  });

  //  Downvote Query
  const { mutate: downvoteQuery } = useMutation({
    mutationFn: async () => {
      const result = await axiosSecure.patch(`/posts/downvote/${id}`);
      console.log(result);
      return result.data;
    },
    onSuccess: () => {
      // This will refetch the post data immediately after successful Downvote
      queryClient.invalidateQueries(["post", id]);
    },
    onError: (error) => {
      console.error("Downvote failed:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to downvote. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#EF4444",
      });
    },
  });

  // Comment mutation
  const { mutate: submitComment, isPending: isSubmittingComment } = useMutation(
    {
      mutationFn: async (commentText) => {
        const result = await axiosSecure.post(`/posts/${id}/comments`, {
          content: commentText,
          authorName: user?.displayName,
          authorImage: user?.photoURL,
          createdAt: new Date().toISOString(),
        });
        return result.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries(["post", id]);
        setComment(""); // Clear the comment input
        Swal.fire({
          title: "Success!",
          text: "Comment added successfully!",
          icon: "success",
          confirmButtonText: "OK",
          confirmButtonColor: "#10B981",
        });
      },
      onError: (error) => {
        console.error("Comment failed:", error);
        Swal.fire({
          title: "Error!",
          text: "Failed to add comment. Please try again.",
          icon: "error",
          confirmButtonText: "OK",
          confirmButtonColor: "#EF4444",
        });
      },
    }
  );

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

  const handleSubmitComment = (e) => {
    e.preventDefault();

    // check user login
    if (!user) {
      Swal.fire({
        title: "Login Required",
        text: "Please login to add a comment.",
        icon: "warning",
        confirmButtonText: "Go to Login",
        confirmButtonColor: "#3B82F6",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login");
        }
      });
      return;
    }

    if (!comment.trim()) {
      Swal.fire({
        title: "Empty Comment",
        text: "Please write a comment before submitting.",
        icon: "warning",
        confirmButtonText: "OK",
        confirmButtonColor: "#F59E0B",
      });
      return;
    }

    submitComment(comment.trim());
  };

  const handleUpvote = () => {
    // check user login
    if (!user) {
      Swal.fire({
        title: "Login Required",
        text: "Please login to upvote this post.",
        icon: "warning",
        confirmButtonText: "Go to Login",
        confirmButtonColor: "#3B82F6",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login");
        }
      });
      return;
    }

    upvoteQuery();
  };

  const handleDownvote = () => {
    // check user login
    if (!user) {
      Swal.fire({
        title: "Login Required",
        text: "Please login to downvote this post.",
        icon: "warning",
        confirmButtonText: "Go to Login",
        confirmButtonColor: "#3B82F6",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login");
        }
      });
      return;
    }

    downvoteQuery();
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
                disabled={isUpvoting}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 group ${
                  isUpvoting
                    ? "bg-green-100 text-green-600 opacity-75 cursor-not-allowed"
                    : "bg-green-50 text-green-700 hover:bg-green-100"
                }`}
              >
                {isUpvoting ? (
                  <div className="w-5 h-5 animate-spin border-2 border-green-600 border-t-transparent rounded-full"></div>
                ) : (
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
                )}
                <span className="font-semibold">{post.upVote}</span>
                <span className="text-sm">
                  {isUpvoting ? "Voting..." : "Upvote"}
                </span>
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
            </div>

            <div className="space-x-2">
              <TelegramShareButton url={window.location.href}>
                <TelegramIcon size={26}></TelegramIcon>
              </TelegramShareButton>
              <FacebookShareButton url={window.location.href}>
                <FacebookIcon size={26}></FacebookIcon>
              </FacebookShareButton>
              <WhatsappShareButton url={window.location.href}>
                <WhatsappIcon size={26}></WhatsappIcon>
              </WhatsappShareButton>
            </div>
          </div>
        </div>

        {/* Comment Section */}
        <div className="px-6 py-6 border-t border-gray-200 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Add a Comment
          </h3>

          <form onSubmit={handleSubmitComment} className="space-y-4">
            <div>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write your comment here..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows="4"
                maxLength="500"
              />
              <div className="text-right text-xs text-gray-500 mt-1">
                {comment.length}/500 characters
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                {!user && (
                  <span className="text-red-600">Please login to comment</span>
                )}
              </div>

              <button
                type="submit"
                disabled={!comment.trim() || isSubmittingComment || !user}
                className={`px-6 py-2 rounded-lg font-semibold transition-all duration-200 ${
                  !comment.trim() || isSubmittingComment || !user
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700 transform hover:scale-105"
                }`}
              >
                {isSubmittingComment ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 animate-spin border-2 border-white border-t-transparent rounded-full"></div>
                    Posting...
                  </span>
                ) : (
                  "Post Comment"
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Comments List */}
        {post.comments && post.comments.length > 0 && (
          <div className="px-6 py-6 border-t border-gray-200 bg-white">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Comments ({post.comments.length})
            </h3>
            <ul className="space-y-4">
              {post.comments.map((comment, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <img
                    src={
                      comment.authorImage ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        comment.authorName || "User"
                      )}&background=0d8abc&color=fff`
                    }
                    alt={comment.authorName || "User"}
                    className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-800">
                        {comment.authorName || "Anonymous"}
                      </span>
                      <span className="text-xs text-gray-500">
                        {comment.createdAt &&
                          new Date(comment.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                      </span>
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                      {comment.content}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostDetails;
