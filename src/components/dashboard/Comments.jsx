import React, { useState } from "react";
import { axiosSecure } from "../../hooks/useAxiosSecure";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";

const Comments = () => {
  const { id } = useParams();
  const [reportingComment, setReportingComment] = useState(null);

  // fetch the post
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
    enabled: !!id,
  });

  const comments = post?.comments || [];

  const handleReportComment = async (commentId, commentText) => {
    const { value: reason } = await Swal.fire({
      title: "Report Comment",
      text: `Why are you reporting this comment: "${commentText.substring(
        0,
        50
      )}..."?`,
      input: "select",
      inputOptions: {
        spam: "Spam",
        harassment: "Harassment",
        "hate-speech": "Hate Speech",
        inappropriate: "Inappropriate Content",
        misinformation: "Misinformation",
        other: "Other",
      },
      inputPlaceholder: "Select a reason",
      showCancelButton: true,
      confirmButtonText: "Report",
      confirmButtonColor: "#EF4444",
      cancelButtonText: "Cancel",
      inputValidator: (value) => {
        if (!value) {
          return "Please select a reason for reporting";
        }
      },
    });

    if (reason) {
      setReportingComment(commentId);
      console.log("This is comment", commentId, id, reason, commentText);
      try {
        // Here you would make an API call to report the comment
        const response = await axiosSecure.post("/report-comment", {
          commentId,
          postId: id,
          reason,
          reportedText: commentText,
        });

        // Check if the response indicates the comment was already reported
        if (response.data && !response.data.success) {
          Swal.fire({
            title: "Already Reported!",
            text:
              response.data.message || "This comment has already been reported",
            icon: "info",
            confirmButtonText: "OK",
            confirmButtonColor: "#3B82F6",
          });
        } else {
          Swal.fire({
            title: "Reported!",
            text: "Comment has been reported successfully. Our team will review it.",
            icon: "success",
            confirmButtonText: "OK",
            confirmButtonColor: "#10B981",
          });
        }
      } catch (error) {
        console.error("Error reporting comment:", error);

        // Check if the error response contains the "already reported" message
        if (
          error.response &&
          error.response.data &&
          !error.response.data.success
        ) {
          Swal.fire({
            title: "Already Reported!",
            text:
              error.response.data.message ||
              "This comment has already been reported",
            icon: "info",
            confirmButtonText: "OK",
            confirmButtonColor: "#3B82F6",
          });
        } else {
          Swal.fire({
            title: "Error!",
            text: "Failed to report comment. Please try again.",
            icon: "error",
            confirmButtonText: "OK",
            confirmButtonColor: "#EF4444",
          });
        }
      } finally {
        setReportingComment(null);
      }
    }
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
        <p>Error loading comments. Please try again.</p>
      </div>
    );
  }

  console.log(post);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800">
          Comments Management
        </h2>
        <p className="text-gray-600 mt-1">
          {post?.title && `Post: "${post.title}"`}
        </p>
        <p className="text-gray-500 text-sm mt-1">
          Total Comments: {comments.length}
        </p>
      </div>

      {comments.length > 0 ? (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Commenter Info
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Comment Content
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {comments.map((comment, index) => (
                  <tr
                    key={comment._id || index}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {/* Commenter Info */}
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-3">
                        {comment.authorImage && (
                          <img
                            src={comment.authorImage}
                            alt={comment.authorName}
                            className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                          />
                        )}
                        <div className="min-w-0 flex-1">
                          <h3 className="text-sm font-bold text-gray-900">
                            {comment.authorName || "Anonymous"}
                          </h3>
                          {comment._id && (
                            <p className="text-xs text-gray-400">
                              Comment ID: {comment._id.substring(0, 8)}...
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Comment Content */}
                    <td className="px-6 py-4">
                      <div className="max-w-md">
                        <p className="text-sm text-gray-700 break-words">
                          {comment.content || "No content"}
                        </p>
                      </div>
                    </td>

                    {/* Date & Time */}
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        {comment.createdAt ? (
                          <>
                            <p className="text-gray-900 font-medium">
                              {new Date(comment.createdAt).toLocaleDateString()}
                            </p>
                            <p className="text-gray-500 text-xs">
                              {new Date(comment.createdAt).toLocaleTimeString()}
                            </p>
                          </>
                        ) : (
                          <p className="text-gray-500">No date available</p>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <button
                        className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Report Comment"
                        onClick={() =>
                          handleReportComment(`${index}`, comment.content || "")
                        }
                      >
                        <span>🚨</span>
                        {reportingComment === (comment._id || `temp-${index}`)
                          ? "Reporting..."
                          : "Report"}
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
          <div className="text-6xl mb-4">💬</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            No comments yet
          </h3>
          <p className="text-gray-600 mb-6">
            This post doesn't have any comments to display.
          </p>
        </div>
      )}
    </div>
  );
};

export default Comments;
