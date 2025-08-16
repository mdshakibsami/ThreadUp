import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosSecure } from "../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth";

const MakeAnnouncements = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const name = user.displayName;
  const photo = user.photoURL;
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  // Mutation for creating announcement
  const createAnnouncementMutation = useMutation({
    mutationFn: async (announcementData) => {
      const response = await axiosSecure.post(
        "/announcements",
        announcementData
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["announcements"]);
      Swal.fire({
        title: "Success!",
        text: "Announcement has been created successfully.",
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "#10B981",
      });
      // Reset form
      setFormData({
        title: "",
        description: "",
      });
    },
    onError: (error) => {
      console.error("Error creating announcement:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to create announcement. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#EF4444",
      });
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.title.trim()) {
      Swal.fire({
        title: "Validation Error",
        text: "Please enter a title for the announcement.",
        icon: "warning",
        confirmButtonText: "OK",
        confirmButtonColor: "#F59E0B",
      });
      return;
    }

    if (!formData.description.trim()) {
      Swal.fire({
        title: "Validation Error",
        text: "Please enter a description for the announcement.",
        icon: "warning",
        confirmButtonText: "OK",
        confirmButtonColor: "#F59E0B",
      });
      return;
    }

    // Confirm before creating
    const result = await Swal.fire({
      title: "Create Announcement?",
      text: `Are you sure you want to create this announcement: "${formData.title}"?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#10B981",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, create it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      createAnnouncementMutation.mutate({
        name,
        photo,
        title: formData.title.trim(),
        description: formData.description.trim(),
        createdAt: new Date().toISOString(),
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header Section */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
          <span className="text-3xl">📢</span>
        </div>
        <h2 className="text-4xl font-bold bg-black bg-clip-text text-transparent">
          Make Announcements
        </h2>
        <p className="text-gray-600 mt-2 text-lg">
          Create important announcements to keep your community informed
        </p>
      </div>

      {/* Main Form Card */}
      <div className="bg-[#eeeeee] rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Card Header */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-8 py-6 border-b border-gray-100">
          <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-3">
            
            Announcement Details
          </h3>
          <p className="text-gray-600 mt-1">
            Fill in the information below to create your announcement
          </p>
        </div>

        {/* Form Content */}
        <div className="p-8 bg-[#eeeeee]">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Title Field */}
            <div className="group">
              <label
                htmlFor="title"
                className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3"
              >
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                Title <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter a compelling announcement title..."
                  className="w-full px-6 py-4 border-2 bg-[#fff5f2] border-gray-200 rounded-xl text-base focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 placeholder-gray-400 group-hover:border-gray-300"
                  disabled={createAnnouncementMutation.isPending}
                />
             
              </div>
              <p className="text-sm text-gray-500 mt-2 flex items-center gap-2">
                <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                Make it attention-grabbing and clear
              </p>
            </div>

            {/* Description Field */}
            <div className="group">
              <label
                htmlFor="description"
                className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3"
              >
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                Description <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Provide detailed information about your announcement. What do you want your community to know?"
                  rows={8}
                  className="w-full px-6  bg-[#fff5f2] py-4 border-2 border-gray-200 rounded-xl text-base focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all duration-200 placeholder-gray-400 resize-none group-hover:border-gray-300"
                  disabled={createAnnouncementMutation.isPending}
                />
             
              </div>
              <p className="text-sm text-gray-500 mt-2 flex items-center gap-2">
                <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                Include all important details and context
              </p>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={
                  createAnnouncementMutation.isPending ||
                  !formData.title.trim() ||
                  !formData.description.trim()
                }
                className="w-full px-8 py-4 bg-[#e43636] text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
              >
                {createAnnouncementMutation.isPending ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>Creating Announcement...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-3">
                  
                    <span>Publish Announcement</span>
                  </div>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MakeAnnouncements;
