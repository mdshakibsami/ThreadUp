import React from "react";
import { Link } from "react-router";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F6EFD2] text-center px-4">
      <h1 className="text-6xl font-bold text-[#E43636] mb-4">404</h1>
      <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 mb-2">
        Page Not Found
      </h2>
      <p className="text-gray-500 mb-8">
        Sorry, the page you are looking for does not exist.
      </p>
      <Link
        to="/"
        className="btn bg-[#E43636] text-white font-bold px-6 py-2 rounded hover:bg-[#c12c2c] transition-all duration-200"
      >
        Go Home
      </Link>
    </div>
  );
};

export default NotFound;
