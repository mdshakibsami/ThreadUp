import React from "react";
import useAuth from "../hooks/useAuth";
import { Navigate, useLocation } from "react-router";
import useDBUser from "../hooks/useDBUser";

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const { data: dbUser } = useDBUser(user?.uid);
  console.log(dbUser);

  if (loading) {
    return <span className="loading loading-spinner loading-xl"></span>;
  }

  if (!user) {
    return (
      <Navigate state={{ from: location.pathname }} to="/login"></Navigate>
    );
  }

  if (!dbUser || !dbUser.isAdmin)
    return (
      <Navigate state={{ from: location.pathname }} to="/forbidden"></Navigate>
    );

  return children;
};

export default AdminRoute;
