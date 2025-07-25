import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosSecure } from "../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

const ReportedComments = () => {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState("");

  // Fetch reported comments
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["reportedComments", statusFilter],
    queryFn: async () => {
      const params = statusFilter ? `?status=${statusFilter}` : "";
      const response = await axiosSecure.get(`/reported-comments${params}`);
      return response.data;
    },
  });

  console.log("Reported comments:", data);
  const reportedComments = data?.reports || [];

  // Mutation for deleting comment
  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId) => {
      const response = await axiosSecure.delete(`/comments/${commentId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["reportedComments"]);
      Swal.fire({
        title: "Deleted!",
        text: "Comment has been deleted successfully.",
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "#EF4444",
      });
    },
    onError: (error) => {
      console.error("Error deleting comment:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to delete comment. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#EF4444",
      });
    },
  });

  // Mutation for keeping comment (update status)
  const keepCommentMutation = useMutation({
    mutationFn: async (reportId) => {
      const response = await axiosSecure.patch(
        `/reported-comments/${reportId}/status`,
        {
          status: "reviewed",
        }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["reportedComments"]);
      Swal.fire({
        title: "Kept!",
        text: "Comment report has been marked as reviewed and kept.",
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "#10B981",
      });
    },
    onError: (error) => {
      console.error("Error keeping comment:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to update report status. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#EF4444",
      });
    },
  });

  const handleDeleteComment = async (commentId, reportedText) => {
    const result = await Swal.fire({
      title: "Delete Comment?",
      text: `Are you sure you want to delete this comment: "${
        reportedText?.substring(0, 50) || "N/A"
      }..."?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      deleteCommentMutation.mutate(commentId);
    }
  };

  const handleKeepComment = async (reportId, reportedText) => {
    const result = await Swal.fire({
      title: "Keep Comment?",
      text: `Mark this report as reviewed and keep the comment: "${
        reportedText?.substring(0, 50) || "N/A"
      }..."?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#10B981",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, keep it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      keepCommentMutation.mutate(reportId);
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
        <p>
          Error loading reported comments:{" "}
          {error?.message || "Please try again."}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">
              Reported Comments
            </h2>
            <p className="text-gray-600 mt-1">
              Total Reports: {reportedComments?.length || 0}
            </p>
          </div>

          {/* Status Filter */}
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="reviewed">Reviewed</option>
            </select>
          </div>
        </div>
      </div>

      {reportedComments && reportedComments.length > 0 ? (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Report Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reported Content
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reportedComments.map((comment, index) => (
                  <tr
                    key={comment._id || index}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {/* Report Details */}
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <div>
                          <span className="text-xs font-medium text-gray-500">
                            Reason:
                          </span>
                          <p className="text-sm font-semibold text-red-600">
                            {comment.reason || "No reason provided"}
                          </p>
                        </div>
                        <div>
                          <span className="text-xs font-medium text-gray-500">
                            Reported At:
                          </span>
                          <p className="text-sm text-gray-900">
                            {comment.reportedAt
                              ? new Date(comment.reportedAt).toLocaleString()
                              : "N/A"}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Reported Content */}
                    <td className="px-6 py-4">
                      <div className="max-w-xs">
                        <span className="text-xs font-medium text-gray-500">
                          Reported Text:
                        </span>
                        <p className="text-sm text-gray-900 mt-1 p-2 bg-gray-50 rounded border-l-4 border-red-400">
                          "{comment.reportedText || "No content available"}"
                        </p>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                          comment.status === "reviewed"
                            ? "bg-green-100 text-green-800"
                            : comment.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {comment.status || "pending"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-2">
                        <button
                          className="inline-flex items-center justify-center gap-1 px-3 py-2 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Delete Comment"
                          onClick={() =>
                            handleDeleteComment(
                              comment.commentId,
                              comment.reportedText
                            )
                          }
                          disabled={deleteCommentMutation.isPending}
                        >
                          🗑️
                          {deleteCommentMutation.isPending
                            ? "Deleting..."
                            : "Delete"}
                        </button>

                        <button
                          className="inline-flex items-center justify-center gap-1 px-3 py-2 text-xs font-medium text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Keep Comment"
                          onClick={() =>
                            handleKeepComment(comment._id, comment.reportedText)
                          }
                          disabled={keepCommentMutation.isPending}
                        >
                          ✅
                          {keepCommentMutation.isPending
                            ? "Keeping..."
                            : "Keep"}
                        </button>
                      </div>
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
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            No reported comments found
          </h3>
          <p className="text-gray-600 mb-6">
            {statusFilter
              ? `No reported comments with status "${statusFilter}".`
              : "There are no reported comments at the moment."}
          </p>
          {statusFilter && (
            <button
              onClick={() => setStatusFilter("")}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              Clear Filter
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ReportedComments;
