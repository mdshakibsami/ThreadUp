import React, { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router";
import useAuth from "../hooks/useAuth";
import { FaUserCircle, FaPlusCircle } from "react-icons/fa";
import useDBUser from "../hooks/useDBUser";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { data: dbUser } = useDBUser(user?.uid);
  console.log(dbUser);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-[#FFF5F2]">
      {/* Mobile Menu Button */}
      <div className="lg:hidden bg-white shadow-md p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/")}
              className="p-2 bg-[#c12c2c] text-white rounded-lg transition-colors"
              title="Home"
            >
              🏠
            </button>
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isSidebarOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="flex bg-[#FFF5F2]">
        {/* Sidebar */}
        <div
          className={`fixed inset-y-0 left-0 z-50 w-80 bg-[#eeeeee] mr-4 shadow-lg transform transition-transform duration-300 lg:relative lg:translate-x-0 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex flex-col h-full">
            {/* User Info */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-4">
                <img
                  src={user?.photoURL || "https://via.placeholder.com/40"}
                  alt={user?.displayName || "User"}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-100"
                />
                <div>
                  <h3 className="font-bold text-gray-800">
                    {user?.displayName || "User Name"}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {user?.email || "user@example.com"}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 p-4">
              <ul className="space-y-3">
                <li>
                  <Link
                    to="/dashboard"
                    onClick={() => setIsSidebarOpen(false)}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 text-gray-700 hover:bg-blue-50 hover:text-blue-600 hover:shadow-md group"
                  >
                    <FaUserCircle className="text-xl group-hover:scale-110 transition-transform duration-200" />
                    <span className="font-medium">My Profile</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/dashboard/add-post"
                    onClick={() => setIsSidebarOpen(false)}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 text-gray-700 hover:bg-green-50 hover:text-green-600 hover:shadow-md group"
                  >
                    <FaPlusCircle className="text-xl group-hover:scale-110 transition-transform duration-200" />
                    <span className="font-medium">Add Post</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/dashboard/my-posts"
                    onClick={() => setIsSidebarOpen(false)}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 text-gray-700 hover:bg-purple-50 hover:text-purple-600 hover:shadow-md group"
                  >
                    <span className="text-xl group-hover:scale-110 transition-transform duration-200">
                      📝
                    </span>
                    <span className="font-medium">My Posts</span>
                  </Link>
                </li>
                {dbUser?.isAdmin && (
                  <>
                    <Link
                      to="/dashboard/admin-profile"
                      onClick={() => setIsSidebarOpen(false)}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 text-gray-700 hover:bg-purple-50 hover:text-purple-600 hover:shadow-md group"
                    >
                      <span className="text-xl group-hover:scale-110 transition-transform duration-200">
                        🛡️
                      </span>
                      <span className="font-medium">Admin Profile</span>
                    </Link>

                    <Link
                      to="/dashboard/manage-users"
                      onClick={() => setIsSidebarOpen(false)}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 text-gray-700 hover:bg-purple-50 hover:text-purple-600 hover:shadow-md group"
                    >
                      <span className="text-xl group-hover:scale-110 transition-transform duration-200">
                        👥
                      </span>
                      <span className="font-medium">Manage Users</span>
                    </Link>

                    <Link
                      to="/dashboard/reported-comments"
                      onClick={() => setIsSidebarOpen(false)}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 text-gray-700 hover:bg-purple-50 hover:text-purple-600 hover:shadow-md group"
                    >
                      <span className="text-xl group-hover:scale-110 transition-transform duration-200">
                        🚩
                      </span>
                      <span className="font-medium">Reported Comments</span>
                    </Link>

                    <Link
                      to="/dashboard/announcements"
                      onClick={() => setIsSidebarOpen(false)}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 text-gray-700 hover:bg-purple-50 hover:text-purple-600 hover:shadow-md group"
                    >
                      <span className="text-md group-hover:scale-110 transition-transform duration-200">
                        📢
                      </span>
                      <span className="font-medium">Make Announcement</span>
                    </Link>
                  </>
                )}
              </ul>
            </nav>
          </div>
        </div>

        {/* Mobile Overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={toggleSidebar}
          ></div>
        )}

        {/* Main Content */}
        <div className="flex-1 lg:ml-0">
          <div className="p-6">
            {/* Desktop Header */}
            <div className="hidden lg:flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
                <p className="text-gray-600 mt-1">
                  Welcome back, {user?.displayName || "User"}!
                </p>
              </div>
              <button
                onClick={() => navigate("/")}
                className="flex bg-[#c12c2c] hover:bg-[#ea3535] items-center gap-2 px-6 py-3 text-white rounded-lg transition-colors font-semibold"
              >
                <span>Home</span>
              </button>
            </div>

            <div className="min-h-screen">
              <Outlet></Outlet>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
