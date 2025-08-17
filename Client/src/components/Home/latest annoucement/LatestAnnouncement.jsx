import { useQuery } from "@tanstack/react-query";
import { axiosSecure } from "../../../hooks/useAxiosSecure";

const fetchLatestAnnouncement = async () => {
  const res = await axiosSecure.get("/latest-announcement");
  return res.data;
};

const LatestAnnouncement = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["latestAnnouncement"],
    queryFn: fetchLatestAnnouncement,
  });

  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#e43636] mb-4"></div>
        <span className="text-[#e43636] text-lg font-semibold">
          Loading latest announcement...
        </span>
      </div>
    );
  if (error || !data || !Array.isArray(data) || data.length === 0)
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <div className="rounded-full h-16 w-16 bg-[#fff5f2] flex items-center justify-center border-4 border-[#e43636] mb-4">
          <span className="text-4xl text-[#e43636]">📢</span>
        </div>
        <span className="text-[#e43636] text-lg font-semibold">
          No announcement found.
        </span>
      </div>
    );

  const announcement = data[0];

  return (
    <div className="px-4 sm:px-10 py-10">
      <h2 className="text-3xl font-bold mb-2 text-[#e43636] text-center tracking-tight">
        Latest Announcement
      </h2>
      <p className="text-center text-gray-700 mb-8 max-w-5xl text-md mx-auto text-base">
        Stay updated with the most recent news, updates, and important
        information from the ThreadUp team. Latest announcements keep you
        informed about new features, events, and community highlights.
      </p>
      <div
        key={announcement._id}
        className="bg-[#eeeeee] border-l-4 border-blue-500 shadow-lg relative overflow-hidden rounded-lg"
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
                <img
                  src={announcement.photo}
                  alt={announcement.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="text-sm font-medium text-gray-600">
                  {announcement.name}
                </span>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-bold">
                  📢 ANNOUNCEMENT
                </span>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold">
                  ⭐ OFFICIAL
                </span>
              </div>
              {/* Announcement title */}
              <h3 className="text-2xl md:text-3xl font-bold mb-4 leading-tight text-gray-900">
                {announcement.title}
              </h3>
              {/* Description */}
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                {announcement.description}
              </p>
              {/* Meta info */}
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
    </div>
  );
};

export default LatestAnnouncement;
