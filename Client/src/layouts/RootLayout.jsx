import React from "react";
import Navbar from "../components/shared/Navbar";
import { Outlet } from "react-router";
import useAuth from "../hooks/useAuth";

const RootLayout = () => {
  const { loading } = useAuth();

  // Show loading spinner while determining auth state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          {/* <p className="text-gray-600 text-lg">Loading...</p> */}
        </div>
      </div>
    );
  }

  return (
    <div >
      <Navbar></Navbar>
      <Outlet></Outlet>
    </div>
  );
};

export default RootLayout;
