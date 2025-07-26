import React from "react";
import { useQuery } from "@tanstack/react-query";
import { axiosPublic } from "../../../hooks/useAxios";

const Announcement = () => {
  // Fetch announcements using TanStack Query
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["announcements"],
    queryFn: async () => {
      const response = await axiosPublic.get("/announcements");
      return response.data;
    },
  });

  console.log("Announcements data:", data);
  const announcements = data?.announcements || [];

  if (isLoading) {
    return (
      <div className="mt-10">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Announcements
        </h2>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mt-10">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Announcements
        </h2>
        <div className="text-center text-red-600 p-8">
          <p>
            Error loading announcements: {error?.message || "Please try again."}
          </p>
        </div>
      </div>
    );
  }

  if (announcements.length === 0) {
    return (
      <div className="mt-10">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Announcements
        </h2>
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📢</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            No announcements yet
          </h3>
          <p className="text-gray-600">
            Check back later for important updates and announcements.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-10">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Announcements
      </h2>

      <div className="space-y-8 max-w-7xl mx-auto px-4">
        {announcements.map((announcement, index) => (
          <div
            key={announcement._id || index}
            className="bg-white border-l-4 border-blue-500 shadow-lg relative overflow-hidden rounded-lg"
          >
            {/* Decorative accents */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-50 rounded-full translate-y-12 -translate-x-12"></div>

            <div className="relative px-6 py-8">
              <div className="flex flex-col lg:flex-row items-start gap-6">
                {/* Left side - Content */}
                <div className="flex-1 text-gray-800">
                  {/* Admin badge and timestamp */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">A</span>
                      </div>
                      <span className="text-sm font-medium text-gray-600">
                        Admin
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-bold">
                        📢 ANNOUNCEMENT
                      </span>
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold">
                        ⭐ OFFICIAL
                      </span>
                    </div>
                  </div>

                  {/* Announcement title */}
                  <h3 className="text-2xl md:text-3xl font-bold mb-4 leading-tight text-gray-900">
                    {announcement.title}
                  </h3>

                  {/* Description */}
                  <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                    {announcement.description}
                  </p>

                  {/* Meta info and actions */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="text-gray-500 text-sm flex items-center gap-2">
                      <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                      <span>
                        Posted on{" "}
                        {announcement.createdAt
                          ? new Date(announcement.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "long",
                                day: "numeric",
                                year: "numeric",
                              }
                            )
                          : "Recently"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right side - Icon/Visual */}
                <div className="lg:w-1/4 flex justify-center lg:justify-end">
                  <div className="relative">
                    <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center shadow-lg border border-gray-200">
                      <span className="text-4xl">📢</span>
                    </div>

                    {/* Floating notification badge */}
                    <div className="absolute -top-2 -right-2 bg-blue-500 text-white p-2 rounded-full shadow-xl">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 2L3 7v11a1 1 0 001 1h3a1 1 0 001-1v-5h4v5a1 1 0 001 1h3a1 1 0 001-1V7l-7-5z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Announcement;
