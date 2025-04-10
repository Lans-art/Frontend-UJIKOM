import React, { useState, useEffect } from "react";
import { GamepadIcon, X, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useUser } from "../../context/UserContext";

function Header({ activeSection, scrollToSection }) {
  const navigate = useNavigate();
  const {
    isAuthenticated,
    role,
    name,
    login,
    register,
    logout,
    loginWithGoogle,
  } = useUser();

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    role: "user",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    useState(false);

  // Load Google API
  useEffect(() => {
    // Load the Google API script
    const loadGoogleScript = () => {
      // Check if script already exists
      if (document.querySelector("script#google-platform")) return;

      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.id = "google-platform";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);

      script.onload = () => {
        if (window.google) {
          initGoogleButton();
        }
      };
    };

    // Initialize Google button when modal is open
    if (showLoginModal) {
      loadGoogleScript();
    }
  }, [showLoginModal]);

  // Initialize Google Sign-In button
  const initGoogleButton = () => {
    if (!window.google || document.getElementById("g_id_onload")) return;

    window.google.accounts.id.initialize({
      client_id: "YOUR_GOOGLE_CLIENT_ID", // Replace with your Google Client ID
      callback: handleGoogleCallback,
      auto_select: false,
      cancel_on_tap_outside: true,
    });

    window.google.accounts.id.renderButton(
      document.getElementById("google-signin-button"),
      {
        theme: "filled_blue",
        size: "large",
        text: "signin_with",
        shape: "rectangular",
        width: "100%",
      },
    );
  };

  // Handle Google Sign-In response
  const handleGoogleCallback = async (response) => {
    if (response.credential) {
      try {
        // Send the ID token to your backend
        const result = await loginWithGoogle(response.credential);

        if (result.success) {
          toast.success(`Login berhasil! Anda masuk sebagai ${result.role}`, {
            position: "top-center",
            autoClose: 2000,
          });

          // Close the modal after successful login
          setShowLoginModal(false);

          // Role-based redirection
          if (result.role === "admin") {
            navigate("/admin");
          } else {
            navigate("/home");
          }
        } else {
          toast.error(result.error || "Google authentication failed", {
            position: "top-center",
            autoClose: 3000,
          });
        }
      } catch (error) {
        console.error("Google login error:", error);
        toast.error("Google login failed. Please try again.", {
          position: "top-center",
          autoClose: 3000,
        });
      }
    }
  };

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

  const handleLogout = () => {
    logout();

    toast.success("Logout successful", {
      position: "top-center",
      autoClose: 2000,
    });

    // Redirect to landing page
    navigate("/");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      if (isLogin) {
        // Login logic using context
        const result = await login(formData.email, formData.password);

        if (result.success) {
          toast.success(`Login berhasil! Anda masuk sebagai ${result.role}`, {
            position: "top-center",
            autoClose: 2000,
          });

          // Close the modal after successful login
          setShowLoginModal(false);

          // Role-based redirection
          if (result.role === "admin") {
            navigate("/admin");
          } else {
            navigate("/home");
          }
        } else {
          toast.error(result.error || "Email atau Password salah", {
            position: "top-center",
            autoClose: 3000,
          });
        }
      } else {
        // Registration logic using context
        if (formData.role === "admin") {
          toast.error("Admin tidak bisa melakukan registrasi.", {
            position: "top-center",
            autoClose: 3000,
          });
          return;
        }

        const result = await register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          password_confirmation: formData.password_confirmation,
          role: formData.role,
        });

        if (result.success) {
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
        } else {
          // Handle errors from registration
          if (typeof result.error === "object") {
            Object.values(result.error).forEach((errorArray) => {
              errorArray.forEach((errorMessage) => {
                toast.error(errorMessage, {
                  position: "top-center",
                  autoClose: 3000,
                });
              });
            });
          } else {
            toast.error(
              result.error || "Terjadi kesalahan, silakan coba lagi",
              {
                position: "top-center",
                autoClose: 3000,
              },
            );
          }
        }
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Terjadi kesalahan, silakan coba lagi", {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  return (
    <>
      <header className="sticky top-0 w-full bg-blue-900/95 backdrop-blur-sm text-white z-50 shadow-lg">
        <nav className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <GamepadIcon className="h-8 w-8" />
              <span className="ml-2 text-xl font-bold">GachaHub</span>
            </div>
            <div className="hidden md:flex space-x-1">
              {["beranda", "fitur", "tentang", "ulasan", "game", "faq"].map(
                (section) => (
                  <button
                    key={section}
                    onClick={() => scrollToSection(section)}
                    className={`px-4 py-2 rounded-full transition-all duration-300 ${
                      activeSection === section
                        ? "bg-blue-500 text-white"
                        : "hover:bg-blue-800 text-blue-200"
                    }`}
                  >
                    {section.charAt(0).toUpperCase() + section.slice(1)}
                  </button>
                ),
              )}
            </div>
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-blue-200">Hello, {name || "User"}</span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 px-6 py-2 rounded-full transition-all duration-300 transform hover:scale-105"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={toggleLoginModal}
                className="bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded-full transition-all duration-300 transform hover:scale-105"
              >
                Login
              </button>
            )}
          </div>
        </nav>
      </header>

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
              {isLogin ? "Login to GachaHub" : "Create New Account"}
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
                    className="w-full bg-blue-800 border border-blue-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="w-full bg-blue-800 border border-blue-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="w-full bg-blue-800 border border-blue-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      className="w-full bg-blue-800 border border-blue-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-600 rounded"
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
                    className="text-sm text-blue-400 hover:text-blue-300"
                  >
                    Forgot password?
                  </a>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
              >
                {isLogin ? "Sign In" : "Register"}
              </button>

              {/* Google Sign In Button */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gray-800 text-gray-400">
                    Or continue with
                  </span>
                </div>
              </div>

              <div
                id="google-signin-button"
                className="w-full flex justify-center"
              ></div>

              <div className="text-center text-sm text-gray-400 mt-4">
                {isLogin
                  ? "Don't have an account? "
                  : "Already have an account? "}
                <span
                  className="text-blue-400 hover:text-blue-300 font-medium cursor-pointer"
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
}

export default Header;
