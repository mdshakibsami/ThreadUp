import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosSecure } from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import Swal from "sweetalert2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { Pie } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale);

const AdminProfile = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [tagName, setTagName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch admin statistics
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["adminStats"],
    queryFn: async () => {
      const response = await axiosSecure.get("/get-number");
      return response.data;
    },
  });

  // Add tag mutation
  const addTagMutation = useMutation({
    mutationFn: async (newTag) => {
      const response = await axiosSecure.post("/tags", { name: newTag });
      return response.data;
    },
    onSuccess: () => {
      Swal.fire({
        title: "Success!",
        text: "Tag added successfully",
        icon: "success",
        confirmButtonColor: "#3b82f6",
      });
      setTagName("");
      setIsSubmitting(false);
    },
    onError: (error) => {
      Swal.fire({
        title: "Error!",
        text: error.response?.data?.message || "Failed to add tag",
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
      setIsSubmitting(false);
    },
  });

  // Handle tag form submission
  const handleAddTag = async (e) => {
    e.preventDefault();
    if (!tagName.trim()) {
      Swal.fire({
        title: "Warning!",
        text: "Please enter a tag name",
        icon: "warning",
        confirmButtonColor: "#f59e0b",
      });
      return;
    }

    setIsSubmitting(true);
    addTagMutation.mutate(tagName.trim());
  };

  console.log("Admin stats:", data);

  // Prepare data for pie chart
  const chartData = {
    labels: ["Posts", "Comments", "Users"],
    datasets: [
      {
        label: "Platform Statistics",
        data: [
          data?.postCount || 0,
          data?.commentCount || 0,
          data?.userCount || 0,
        ],
        backgroundColor: [
          "rgba(34, 197, 94, 0.8)", // Green for posts
          "rgba(59, 130, 246, 0.8)", // Blue for comments
          "rgba(147, 51, 234, 0.8)", // Purple for users
        ],
        borderColor: [
          "rgba(34, 197, 94, 1)",
          "rgba(59, 130, 246, 1)",
          "rgba(147, 51, 234, 1)",
        ],
        borderWidth: 2,
        hoverBackgroundColor: [
          "rgba(34, 197, 94, 0.9)",
          "rgba(59, 130, 246, 0.9)",
          "rgba(147, 51, 234, 0.9)",
        ],
        hoverBorderColor: [
          "rgba(34, 197, 94, 1)",
          "rgba(59, 130, 246, 1)",
          "rgba(147, 51, 234, 1)",
        ],
        hoverBorderWidth: 3,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          padding: 20,
          font: {
            size: 14,
            family: "Inter, sans-serif",
          },
          color: "#374151",
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      tooltip: {
        backgroundColor: "rgba(17, 24, 39, 0.9)",
        titleColor: "white",
        bodyColor: "white",
        borderColor: "rgba(209, 213, 219, 0.3)",
        borderWidth: 1,
        cornerRadius: 8,
        titleFont: {
          size: 14,
          weight: "bold",
        },
        bodyFont: {
          size: 13,
        },
        padding: 12,
        callbacks: {
          label: function (context) {
            const label = context.label || "";
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage =
              total > 0 ? ((value / total) * 100).toFixed(1) : 0;
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
    elements: {
      arc: {
        borderWidth: 2,
      },
    },
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 1000,
    },
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
          Error loading admin statistics:{" "}
          {error?.message || "Please try again."}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Admin Profile</h2>
        <p className="text-gray-600 mt-1">Dashboard overview and statistics</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Admin Profile Card and Statistics Cards */}
        <div className="space-y-8">
          {/* Admin Profile Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-6">
              <h3 className="text-xl font-semibold text-white flex items-center gap-3">
                <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm">👤</span>
                </div>
                Admin Profile
              </h3>
            </div>

            <div className="p-8">
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <img
                    src={
                      user?.photoURL ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        user?.displayName || "Admin"
                      )}&background=3b82f6&color=fff&size=120`
                    }
                    alt={user?.displayName || "Admin"}
                    className="w-24 h-24 rounded-full object-cover border-4 border-blue-100 shadow-lg mx-auto"
                  />
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                    <span className="text-white text-xs">👑</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="text-center">
                  <h4 className="text-xl font-bold text-gray-800 mb-1">
                    {user?.displayName || "Admin User"}
                  </h4>
                  <p className="text-gray-600 text-sm">
                    {user?.email || "admin@example.com"}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-center gap-2">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-bold">
                      🔧 ADMINISTRATOR
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="space-y-4">
            {/* Posts Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="bg-gradient-to-r from-green-400 to-green-600 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm font-medium">
                      Total Posts
                    </p>
                    <p className="text-white text-2xl font-bold">
                      {data?.postCount || 0}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                    <span className="text-white text-2xl">📝</span>
                  </div>
                </div>
              </div>
              <div className="px-6 py-4">
                <p className="text-gray-600 text-sm">
                  Posts created by all users
                </p>
              </div>
            </div>

            {/* Comments Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="bg-gradient-to-r from-blue-400 to-blue-600 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">
                      Total Comments
                    </p>
                    <p className="text-white text-2xl font-bold">
                      {data?.commentCount || 0}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                    <span className="text-white text-2xl">💬</span>
                  </div>
                </div>
              </div>
              <div className="px-6 py-4">
                <p className="text-gray-600 text-sm">Comments from all users</p>
              </div>
            </div>

            {/* Users Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="bg-gradient-to-r from-purple-400 to-purple-600 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">
                      Total Users
                    </p>
                    <p className="text-white text-2xl font-bold">
                      {data?.userCount || 0}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                    <span className="text-white text-2xl">👥</span>
                  </div>
                </div>
              </div>
              <div className="px-6 py-4">
                <p className="text-gray-600 text-sm">
                  Registered platform users
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Pie Chart */}
        <div>
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden h-full">
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-8 py-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm">📊</span>
                </div>
                Statistics Overview
              </h3>
              <p className="text-gray-600 mt-1">
                Visual representation of platform data
              </p>
            </div>

            <div className="p-8 flex flex-col justify-center h-full">
              {/* Pie Chart */}
              <div className="relative mb-8">
                <div className="h-80 w-full">
                  <Pie data={chartData} options={chartOptions} />
                </div>
              </div>

              {/* Statistics Summary */}
              <div className="space-y-4">
                <div className="text-center">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">
                    Platform Breakdown
                  </h4>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="w-4 h-4 bg-green-500 rounded-full mx-auto mb-2"></div>
                    <div className="text-green-800 font-bold text-lg">
                      {data?.postCount || 0}
                    </div>
                    <div className="text-green-600 text-xs">Posts</div>
                  </div>

                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="w-4 h-4 bg-blue-500 rounded-full mx-auto mb-2"></div>
                    <div className="text-blue-800 font-bold text-lg">
                      {data?.commentCount || 0}
                    </div>
                    <div className="text-blue-600 text-xs">Comments</div>
                  </div>

                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="w-4 h-4 bg-purple-500 rounded-full mx-auto mb-2"></div>
                    <div className="text-purple-800 font-bold text-lg">
                      {data?.userCount || 0}
                    </div>
                    <div className="text-purple-600 text-xs">Users</div>
                  </div>
                </div>

                <div className="mt-6 text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-800">
                    {(data?.postCount || 0) +
                      (data?.commentCount || 0) +
                      (data?.userCount || 0)}
                  </div>
                  <div className="text-gray-600 text-sm">
                    Total Platform Activity
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Tag Form Section */}
      <div className="mt-8">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 px-8 py-6 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm">🏷️</span>
              </div>
              Add New Tag
            </h3>
            <p className="text-gray-600 mt-1">
              Create new tags for post categorization
            </p>
          </div>

          <div className="p-8">
            <form onSubmit={handleAddTag} className="max-w-md mx-auto">
              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="tagName"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Tag Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="tagName"
                      value={tagName}
                      onChange={(e) => setTagName(e.target.value)}
                      placeholder="Enter tag name (e.g., Technology, Sports, Music)"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors duration-200 text-gray-900 placeholder-gray-500"
                      disabled={isSubmitting}
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-emerald-500 text-lg">🏷️</span>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !tagName.trim()}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      Adding Tag...
                    </>
                  ) : (
                    <>
                      <span>➕</span>
                      Add Tag
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                💡 Tag Guidelines:
              </h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Use descriptive and relevant names</li>
                <li>• Keep tag names concise (1 words)</li>
                <li>• Avoid special characters</li>
                <li>• Tags help users find related content</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
