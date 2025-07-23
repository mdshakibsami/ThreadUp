import React from "react";

// Demo announcement post data
const announcementPost = {
  _id: "announcement_1",
  title: "🎉 Welcome to ThreadUp - Your New Favorite Discussion Platform!",
  description:
    "We're excited to announce the launch of ThreadUp! Join thousands of developers, creators, and innovators sharing knowledge, ideas, and building amazing communities together.",
  image:
    "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
  adminName: "ThreadUp Team",
  adminImage:
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
  createdAt: "2025-01-20T10:00:00Z",
  isUrgent: true,
  type: "announcement",
};

const Announcement = () => {
  return (
    <div className="mt-10">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Announcements
      </h2>
      <div className="bg-white border-l-4 border-blue-500 shadow-lg relative overflow-hidden">
        {/* Simple decorative accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-50 rounded-full translate-y-12 -translate-x-12"></div>

        <div className="relative max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col lg:flex-row items-center gap-6">
            {/* Left side - Content */}
            <div className="flex-1 text-gray-800">
              {/* Admin badge and urgency indicator */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <img
                    src={announcementPost.adminImage}
                    alt={announcementPost.adminName}
                    className="w-8 h-8 rounded-full border-2 border-blue-200"
                  />
                  <span className="text-sm font-medium text-gray-600">
                    {announcementPost.adminName}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-bold">
                    📢 ADMIN ANNOUNCEMENT
                  </span>
                  {announcementPost.isUrgent && (
                    <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                      🔥 IMPORTANT
                    </span>
                  )}
                </div>
              </div>

              {/* Announcement title */}
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 leading-tight text-gray-900">
                {announcementPost.title}
              </h2>

              {/* Description */}
              <p className="text-lg text-gray-600 mb-6 leading-relaxed max-w-2xl">
                {announcementPost.description}
              </p>

              {/* Action buttons and meta info */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <button className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200">
                  Learn More
                </button>

                <div className="text-gray-500 text-sm">
                  Posted on{" "}
                  {new Date(announcementPost.createdAt).toLocaleDateString(
                    "en-US",
                    {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    }
                  )}
                </div>
              </div>
            </div>

            {/* Right side - Image */}
            <div className="lg:w-1/3">
              <div className="relative">
                <img
                  src={announcementPost.image}
                  alt="Announcement"
                  className="w-full h-64 lg:h-80 object-cover rounded-xl shadow-lg border border-gray-200"
                />

                {/* Floating notification badge */}
                <div className="absolute -top-3 -right-3 bg-blue-500 text-white p-3 rounded-full shadow-xl animate-bounce">
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 2L3 7v11a1 1 0 001 1h3a1 1 0 001-1v-5h4v5a1 1 0 001 1h3a1 1 0 001-1V7l-7-5z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom action bar */}
          <div className="mt-8 pt-6 border-t border-gray-200"></div>
        </div>
      </div>
    </div>
  );
};

export default Announcement;
