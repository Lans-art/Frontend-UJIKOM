import React, { useState, useEffect } from "react";
import {
  ShoppingCart,
  Gamepad2,
  User,
  Home as HomeIcon,
  Bell,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import axios from "axios";
import Cookies from "js-cookie";

const menuItems = [
  { name: "Home", path: "/home", icon: HomeIcon },
  { name: "Account Games", path: "/accountgames", icon: Gamepad2 },
  { name: "Cart", path: "/cart", icon: ShoppingCart },
  { name: "Notifikasi", path: "/notifikasi", icon: Bell },
  { name: "Profile", path: "/profile", icon: User },
];

function Header() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [activePage, setActivePage] = useState("home");
  const [cartItemCount, setCartItemCount] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const path = window.location.pathname;
    const activeItem = menuItems.find((item) =>
      path.includes(item.path.slice(1))
    );
    setActivePage(activeItem ? activeItem.name.toLowerCase() : "home");

    const updateCartCount = () => {
      const cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
      const totalItems = cartItems.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      setCartItemCount(totalItems);
    };

    updateCartCount();
    window.addEventListener("add-to-cart", updateCartCount);
    return () => window.removeEventListener("add-to-cart", updateCartCount);
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://127.0.0.1:8000/api/logout",
        {},
        {
          headers: { Authorization: `Bearer ${Cookies.get("token")}` },
        }
      );
      Cookies.remove("token");
      window.location.href = "/";
    } catch (error) {
      console.error("Logout gagal", error.response?.data);
    }
  };

  return (
    <header 
      className={`sticky w-full top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/80 backdrop-blur-md shadow-lg' 
          : 'bg-white shadow-sm'
      }`}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent transition-all duration-300 hover:scale-105">
            GachaHub
          </h1>

          <nav className="hidden md:flex items-center space-x-8">
            {menuItems.map(({ name, path, icon: Icon }) => (
              <a
                key={name}
                href={path}
                className={`group relative flex flex-col items-center transition-all duration-300 ${
                  activePage === name.toLowerCase()
                    ? "text-indigo-600"
                    : "text-gray-600 hover:text-indigo-600"
                }`}
              >
                <div className="relative flex items-center justify-center transition-transform group-hover:scale-110">
                  <Icon className={`h-6 w-6 transition-all duration-300 ${
                    activePage === name.toLowerCase() ? "stroke-2" : "stroke-1"
                  }`} />
                  {name === "Cart" && cartItemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full animate-pulse">
                      {cartItemCount}
                    </span>
                  )}
                </div>
                <span className="mt-1 text-xs font-medium opacity-90">{name}</span>
                {activePage === name.toLowerCase() && (
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-indigo-600 rounded-full transform scale-x-100 transition-transform duration-300" />
                )}
              </a>
            ))}
            <button
              onClick={handleLogout}
              className="group flex flex-col items-center text-gray-600 hover:text-red-600 transition-all duration-300"
            >
              <div className="transition-transform group-hover:scale-110">
                <LogOut className="h-6 w-6" />
              </div>
              <span className="mt-1 text-xs font-medium opacity-90">Logout</span>
            </button>
          </nav>

          <button
            className="md:hidden text-gray-700 transition-transform duration-300 hover:scale-110"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            {showMobileMenu ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        <div
          className={`md:hidden fixed inset-x-0 top-[60px] bg-white/80 backdrop-blur-md shadow-lg transition-all duration-300 transform ${
            showMobileMenu ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
          }`}
        >
          <nav className="container mx-auto py-4 px-4">
            <div className="flex flex-col space-y-3">
              {menuItems.map(({ name, path, icon: Icon }) => (
                <a
                  key={name}
                  href={path}
                  className={`flex items-center space-x-3 p-2 rounded-lg transition-all duration-300 ${
                    activePage === name.toLowerCase()
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-gray-600 hover:bg-gray-50 hover:text-indigo-600"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{name}</span>
                  {name === "Cart" && cartItemCount > 0 && (
                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      {cartItemCount}
                    </span>
                  )}
                </a>
              ))}
              <button
                onClick={handleLogout}
                className="flex items-center space-x-3 p-2 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-300"
              >
                <LogOut className="h-5 w-5" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;