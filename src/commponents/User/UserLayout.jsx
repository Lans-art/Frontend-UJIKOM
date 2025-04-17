// UserLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Components/Header";

function UserLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Outlet />
    </div>
  );
}

export default UserLayout;
