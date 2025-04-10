import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { X, Eye, EyeOff } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    role: "user",
  });
  const [role, setRole] = useState(null);
  const [token, setToken] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    useState(false);

  const menuItems = [
    { name: "Beranda", href: "#home" },
    { name: "Fitur", href: "#features" },
    { name: "Tentang", href: "#about" },
    { name: "Ulasan", href: "#comments" },
    { name: "FAQ", href: "#faq" },
    { name: "Tim", href: "#team" },
  ];

  // Check if user is already logged in on component mount
  useEffect(() => {
    const savedToken = Cookies.get("token");
    const savedRole = Cookies.get("role");

    if (savedToken && savedRole) {
      setToken(savedToken);
      setRole(savedRole);

      if (savedRole === "admin") {
        navigate("/admin");
      } else {
        navigate("/home");
      }
    }
  }, [navigate]);

  const toggleLoginModal = () => {
    setShowLoginModal(!showLoginModal);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Form validation with specific error messages
  const validateForm = () => {
    if (!formData.email) {
      toast.error("Email harus diisi!", {
        position: "top-center",
        autoClose: 3000,
      });
      return false;
    }

    if (!formData.password) {
      toast.error("Password harus diisi!", {
        position: "top-center",
        autoClose: 3000,
      });
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error("Format email tidak valid!", {
        position: "top-center",
        autoClose: 3000,
      });
      return false;
    }

    if (!isLogin && !formData.name) {
      toast.error("Nama pengguna harus diisi!", {
        position: "top-center",
        autoClose: 3000,
      });
      return false;
    }

    if (!isLogin && formData.password !== formData.password_confirmation) {
      toast.error("Password dan konfirmasi password tidak cocok!", {
        position: "top-center",
        autoClose: 3000,
      });
      return false;
    }

    return true;
  };

 

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      if (isLogin) {
        // Setup axios with headers
        const instance = axios.create({
          baseURL: "http://localhost:8000/api",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });

        // API Login request
        const response = await instance.post("/login", {
          email: formData.email,
          password: formData.password,
        });

        const { token, role } = response.data;

        // Set token in cookies with 1 day expiration
        Cookies.set("token", token, { expires: 1 });
        Cookies.set("role", role, { expires: 1 });

        // Update state
        setToken(token);
        setRole(role);

        // Add token to axios default headers for future requests
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        toast.success(`Login berhasil! Anda masuk sebagai ${role}`, {
          position: "top-center",
          autoClose: 2000,
        });

        // Close the modal after successful login
        setShowLoginModal(false);

        // Role-based redirection
        if (role === "admin") {
          navigate("/admin");
        } else {
          navigate("/home");
        }
      } else {
        // Registration logic
        if (formData.role === "admin") {
          toast.error("Admin tidak bisa melakukan registrasi.", {
            position: "top-center",
            autoClose: 3000,
          });
          return;
        }

        const registerResponse = await axios.post(
          "http://localhost:8000/api/register",
          {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            password_confirmation: formData.password_confirmation,
            role: formData.role,
          },
        );

        toast.success(
          "Registrasi berhasil! Silakan login dengan akun baru Anda.",
          {
            position: "top-center",
            autoClose: 2000,
          },
        );

        // Switch to login form after successful registration
        setTimeout(() => {
          setIsLogin(true);
          // Clear form data except email
          setFormData({
            ...formData,
            name: "",
            password: "",
            password_confirmation: "",
          });
        }, 2000);
      }
    } catch (error) {
      console.error("Error:", error.response?.data || error);

      if (error.response?.status === 401) {
        toast.error("Email atau Password salah", {
          position: "top-center",
          autoClose: 3000,
        });
      } else if (error.response?.data?.errors) {
        // Handle validation errors from backend
        const errors = error.response.data.errors;
        Object.keys(errors).forEach((key) => {
          toast.error(errors[key][0], {
            position: "top-center",
            autoClose: 3000,
          });
        });
      } else {
        toast.error("Terjadi kesalahan, silakan coba lagi", {
          position: "top-center",
          autoClose: 3000,
        });
      }
    }
  };

  // Function to check if user is authenticated
  const isAuthenticated = () => {
    return !!token;
  };

  return (
    <>
      {/* Navbar */}
      <nav className="bg-gray-900 shadow-md fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-white">
                GachaHub
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              {menuItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="block text-white hover:bg-purple-400 hover:text-black focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 px-3 py-2 rounded-md text-sm font-medium"
                >
                  {item.name}
                </a>
              ))}

              {isAuthenticated() ? (
                <button
                  className="bg-red-700
                   text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-400 hover:text-black hover:scale-105 hover:shadow-lg transition duration-300"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              ) : (
                <button
                  className="bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-400 hover:text-black hover:scale-105 hover:shadow-lg transition duration-300"
                  onClick={toggleLoginModal}
                >
                  Masuk
                </button>
              )}
            </div>

            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-white hover:text-purple-light"
              >
                {isOpen ? <HiX size={24} /> : <HiMenuAlt3 size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden bg-dark">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {menuItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-white hover:text-purple-light block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </a>
              ))}

              {isAuthenticated() ? (
                <button
                  className="w-full bg-purple-light text-white px-3 py-2 rounded-md text-base font-medium hover:bg-purple-dark transition"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              ) : (
                <button
                  className="w-full bg-purple-light text-white px-3 py-2 rounded-md text-base font-medium hover:bg-purple-dark transition"
                  onClick={() => {
                    toggleLoginModal();
                    setIsOpen(false);
                  }}
                >
                  Masuk
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Toast Container for notifications */}
      <ToastContainer />

      {/* Login/Register Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-white"
              onClick={toggleLoginModal}
            >
              <X className="h-5 w-5" />
            </button>

            <h2 className="text-xl font-bold text-white mb-6">
              {isLogin ? "Login to GameAccounts" : "Create New Account"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    Username
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="username"
                    className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter your username"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
              )}

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    id="password"
                    className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {!isLogin && (
                <div>
                  <label
                    htmlFor="password_confirmation"
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswordConfirmation ? "text" : "password"}
                      name="password_confirmation"
                      id="password_confirmation"
                      className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Confirm your password"
                      value={formData.password_confirmation}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowPasswordConfirmation(!showPasswordConfirmation)
                      }
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showPasswordConfirmation ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              )}

              {isLogin && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-purple-500 focus:ring-purple-500 border-gray-600 rounded"
                    />
                    <label
                      htmlFor="remember-me"
                      className="ml-2 block text-sm text-gray-300"
                    >
                      Remember me
                    </label>
                  </div>

                  <a
                    href="#forgot-password"
                    className="text-sm text-purple-400 hover:text-purple-300"
                  >
                    Forgot password?
                  </a>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-purple-light hover:bg-purple-dark text-white font-medium py-2 px-4 rounded-md transition-colors"
              >
                {isLogin ? "Sign In" : "Register"}
              </button>

              <div className="text-center text-sm text-gray-400 mt-4">
                {isLogin
                  ? "Don't have an account? "
                  : "Already have an account? "}
                <span
                  className="text-purple-400 hover:text-purple-300 font-medium cursor-pointer"
                  onClick={() => setIsLogin(!isLogin)}
                >
                  {isLogin ? "Register now" : "Sign in"}
                </span>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
