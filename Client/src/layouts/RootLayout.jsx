import React from "react";
import Navbar from "../components/shared/Navbar";
import { Outlet } from "react-router";
import useAuth from "../hooks/useAuth";
import Footer from "../components/Footer/Footer";

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
    <div className="bg-[#FFF5F2] ">
      <Navbar></Navbar>
      <div className="min-h-screen">
        <Outlet></Outlet>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default RootLayout;
