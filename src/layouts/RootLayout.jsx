import React from "react";
import Navbar from "../components/shared/Navbar";
import { Outlet } from "react-router";

const RootLayout = () => {
  return (
    <div className="max-w-11/12 mx-auto">
      <Navbar></Navbar>
      <Outlet></Outlet>
    </div>
  );
};

export default RootLayout;
