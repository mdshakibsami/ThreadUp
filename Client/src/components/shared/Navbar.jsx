import React from "react";
import { Link, NavLink } from "react-router";
import useAuth from "../../hooks/useAuth";
import Swal from "sweetalert2";
import "../Auth/sweetalert-custom.css";
import useDBUser from "../../hooks/useDBUser";

const Navbar = () => {
  const { user, logOut } = useAuth();
  const notificationCount = 3; // This would come from your notification state/API

  const { data: dbUser } = useDBUser(user?.uid);
  console.log(dbUser);

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out of your account.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, logout",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      customClass: {
        popup: "custom-swal-popup",
        title: "custom-swal-title",
        content: "custom-swal-content",
        confirmButton: "custom-swal-error-btn",
        cancelButton: "custom-swal-cancel-btn",
      },
      background: "#ffffff",
      color: "#374151",
      iconColor: "#f59e0b",
      buttonsStyling: false,
    }).then((result) => {
      if (result.isConfirmed) {
        logOut()
          .then(() => {
            Swal.fire({
              icon: "success",
              title: "Logged Out",
              text: "You have been successfully logged out.",
              confirmButtonText: "OK",
              customClass: {
                popup: "custom-swal-popup",
                title: "custom-swal-title",
                content: "custom-swal-content",
                confirmButton: "custom-swal-confirm-btn",
              },
              background: "#ffffff",
              color: "#374151",
              iconColor: "#10b981",
              buttonsStyling: false,
            });
            console.log("User signed out");
          })
          .catch((error) => {
            Swal.fire({
              icon: "error",
              title: "Logout Failed",
              text: "There was an error logging you out. Please try again.",
              confirmButtonText: "OK",
              customClass: {
                popup: "custom-swal-popup",
                title: "custom-swal-title",
                content: "custom-swal-content",
                confirmButton: "custom-swal-error-btn",
              },
              background: "#ffffff",
              color: "#374151",
              iconColor: "#ef4444",
              buttonsStyling: false,
            });
            console.error("Error signing out:", error);
          });
      }
    });
  };

  const links = (
    <>
      <li>
        <NavLink
          to="/"
          className={({ isActive }) =>
            `font-bold transition-colors duration-200 ${isActive ? "text-[#E43636]" : "text-gray-700"}`
          }
        >
          Home
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/announcements"
          className={({ isActive }) =>
            `font-bold transition-colors duration-200 ${isActive ? "text-[#E43636]" : "text-gray-700"}`
          }
        >
          Announcements
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/all-post"
          className={({ isActive }) =>
            `font-bold transition-colors duration-200 ${isActive ? "text-[#E43636]" : "text-gray-700"}`
          }
        >
          All Post
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/dashboard"
            className={({ isActive }) =>
            `font-bold transition-colors duration-200 ${isActive ? "text-[#E43636]" : "text-gray-700"}`
          }
        >
          Dashboard
        </NavLink>
      </li>
    </>
  );
  return (
    <div className="navbar bg-[#F6EFD2] px-10 ">
      
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {" "}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />{" "}
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            {links}
          </ul>
        </div>
        <a
          href="/"
          className=" hidden md:block text-xl text-[#E43636] font-bold"
        >
          ThreadUp
        </a>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">{links}</ul>
      </div>
      <div className="navbar-end space-x-2">
        {user ? (
          <>
            {!dbUser?.isMember && (
              <Link
                to="/member"
                className="btn text-white bg-[#E43636] hover:scale-101"
              >
                Be The Member
              </Link>
            )}
            {/* Notification Icon */}
            <button className="btn btn-ghost btn-circle">
              <div className="indicator">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                {notificationCount > 0 && (
                  <span className="badge badge-sm badge-primary bg-[#E43636] indicator-item">
                    {notificationCount > 99 ? "99+" : notificationCount}
                  </span>
                )}
              </div>
            </button>
            {/* Profile dropdown */}
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
              >
                <div className="w-10 rounded-full">
                  <img
                    alt="Profile"
                    src={
                      user.photoURL ||
                      "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                    }
                  />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
              >
                <li className="menu-title">
                  <span className="text-sm font-medium text-gray-600">
                    {user.displayName}
                  </span>
                </li>
                <li>
                  <Link to="/dashboard">Dashboard</Link>
                </li>
                <li>
                  <a
                    onClick={handleLogout}
                    className="text-red-500 hover:text-red-700"
                  >
                    Logout
                  </a>
                </li>
              </ul>
            </div>
          </>
        ) : (
          <>
            <Link to="/login" className=" btn">
              Login
            </Link>
            <Link
              to="/register"
              className="btn text-white color-primary bg-[#E43636] hover:scale-101"
            >
              Join Us
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
