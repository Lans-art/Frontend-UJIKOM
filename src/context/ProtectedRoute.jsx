// src/context/ProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "./UserContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isLoading, isAuthenticated, role } = useUser();

  // console.log("ProtectedRoute =>", { isAuthenticated, role, allowedRoles });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to={role === "admin" ? "/admin" : "/home"} replace />;
  }

  return children;
};

export default ProtectedRoute;
