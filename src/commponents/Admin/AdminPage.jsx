import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  UserCircle,
  Users,
  FileText,
  MessageSquare,
  History,
  LogOut,
} from "lucide-react";
import axios from "axios";
import Cookies from "js-cookie";

function AdminPage() {
  const location = useLocation();
  const [activePage, setActivePage] = useState(location.pathname);

  // Update activePage when location changes
  useEffect(() => {
    setActivePage(location.pathname);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://127.0.0.1:8000/api/logout",
        {},
        {
          headers: { Authorization: `Bearer ${Cookies.get("token")}` },
        },
      );
    } catch (error) {
      console.error("Logout gagal", error.response?.data);
    }
    Cookies.remove("token");
    window.location.href = "/";
  };

  // Updated sidebar links to match your route configuration
  const sidebarLinks = [
    { key: "admin", path: "/admin", icon: LayoutDashboard, label: "Dashboard" },
    {
      key: "profil",
      path: "/profil",
      icon: UserCircle,
      label: "Profile",
    },
    {
      key: "dataaccount",
      path: "/admin/dataaccount",
      icon: Users,
      label: "Data Account",
    },
    {
      key: "dataartikel",
      path: "/admin/dataartikel",
      icon: FileText,
      label: "Data Artikel",
    },
    {
      key: "confirmaccount",
      path: "/admin/confirmaccount",
      icon: FileText,
      label: "Konfirmasi Account",
    },
    { key: "chat", path: "/admin/chat", icon: MessageSquare, label: "Chat" },
    {
      key: "history",
      path: "/admin/history",
      icon: History,
      label: "History Transaksi",
    },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg">
        <div className="p-4">
          <h1 className="text-2xl font-bold text-indigo-600">Admin Panel</h1>
        </div>
        <nav className="mt-8">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;

            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center px-6 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors ${
                  isActive
                    ? "bg-indigo-50 text-indigo-600 border-r-4 border-indigo-600"
                    : ""
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                <span>{link.label}</span>
              </Link>
            );
          })}
          <button
            onClick={handleLogout}
            className="flex items-center px-6 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors w-full mt-8"
          >
            <LogOut className="w-5 h-5 mr-3" />
            <span>Logout</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}



export default AdminPage;
