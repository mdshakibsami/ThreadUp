import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosSecure } from "../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

const ManageUser = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["allUsers"],
    queryFn: async () => {
      const response = await axiosSecure.get("/all-user");
      return response.data;
    },
  });

  console.log("All users:", data);
  const allUsers = data?.users || [];

  // Mutation for making user admin
  const makeAdminMutation = useMutation({
    mutationFn: async (userId) => {
      const response = await axiosSecure.patch(`/make-admin/${userId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["allUsers"]);
      Swal.fire({
        title: "Success!",
        text: "User has been promoted to admin successfully.",
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "#10B981",
      });
    },
    onError: (error) => {
      console.error("Error making admin:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to promote user to admin. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#EF4444",
      });
    },
  });

  const handleMakeAdmin = async (userId, userName) => {
    const result = await Swal.fire({
      title: "Make Admin?",
      text: `Are you sure you want to make "${userName}" an admin? This will give them full administrative privileges.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#10B981",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, make admin!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      makeAdminMutation.mutate(userId);
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
        <p>Error loading users: {error?.message || "Please try again."}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Manage Users</h2>
        <p className="text-gray-600 mt-1">
          Total Users: {allUsers?.length || 0}
        </p>
      </div>

      {allUsers && allUsers.length > 0 ? (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User Info
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role & Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Activity
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {allUsers.map((user, index) => (
                  <tr
                    key={user._id || index}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {/* User Info */}
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-3">
                        {user.photoURL && (
                          <img
                            src={user.photoURL}
                            alt={user.name}
                            className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                          />
                        )}
                        <div className="min-w-0 flex-1">
                          <h3 className="text-sm font-bold text-gray-900">
                            {user.name || "No name"}
                          </h3>
                          <p className="text-xs text-gray-500 mt-1">
                            {user.email}
                          </p>
                          {user._id && (
                            <p className="text-xs text-gray-400">
                              ID: {user._id.substring(0, 8)}...
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Role & Status */}
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            user.role === "admin"
                              ? "bg-red-100 text-red-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {user.role || "user"}
                        </span>
                        {user.badge && (
                          <div>
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                user.badge === "gold"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-orange-100 text-orange-800"
                              }`}
                            >
                              {user.badge}
                            </span>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Activity */}
                    <td className="px-6 py-4">
                      <div className="text-sm space-y-1">
                        <p className="text-gray-700">
                          Posts: {user.postCount || 0}
                        </p>
                        {user.createdAt && (
                          <p className="text-gray-500 text-xs">
                            Joined:{" "}
                            {new Date(user.createdAt).toLocaleDateString()}
                          </p>
                        )}
                        {user.last_log_in && (
                          <p className="text-gray-500 text-xs">
                            Last login:{" "}
                            {new Date(user.last_log_in).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        {user.role !== "admin" ? (
                          <button
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Make Admin"
                            onClick={() => handleMakeAdmin(user._id, user.name)}
                            disabled={makeAdminMutation.isPending}
                          >
                            <span>👑</span>
                            {makeAdminMutation.isPending
                              ? "Processing..."
                              : "Make Admin"}
                          </button>
                        ) : (
                          <span className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-500 bg-gray-100 rounded-lg">
                            <span>👑</span>
                            Already Admin
                          </span>
                        )}
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
          <div className="text-6xl mb-4">👥</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            No users found
          </h3>
          <p className="text-gray-600 mb-6">
            There are no users to display at the moment.
          </p>
        </div>
      )}
    </div>
  );
};

export default ManageUser;
