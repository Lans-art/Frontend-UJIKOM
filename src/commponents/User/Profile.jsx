import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Shield,
  Mail,
  Phone,
  Calendar,
  Bell,
  ShoppingCart,
  Heart,
  Ticket,
  Settings,
  LogOut,
  MessageCircle,
  Gift,
  Crown,
  CheckCircle2,
  AlertCircle,
  Clock,
  Download,
  Star,
  Moon,
  Sun,
  ChevronRight,
  Lock,
  Smartphone,
  History,
  ArrowLeft,
  User,
} from "lucide-react";
import { useUser } from "../../context/UserContext";

function Profile() {
  const navigate = useNavigate();
  const { name, email, logout, refreshUserData, isLoading, token } = useUser();

  const [activeTab, setActiveTab] = useState("profile");
  const tabRefs = useRef({});
  const [indicatorStyle, setIndicatorStyle] = useState({
    left: 0,
    width: 0,
    transition: "none",
  });

  // Using user data from context or fallback values
  const displayName = name || "GamerPro123";
  const userEmail = email || "gamer123@example.com";

  const joinDate = new Date("2023-01-15");
  const lastLogin = new Date("2024-03-15T14:30:00");

  const transactions = [
    {
      id: 1,
      game: "Mobile Legends",
      level: 75,
      price: 1200000,
      status: "success",
      date: new Date("2024-03-10"),
      details: "All Heroes Unlocked, 50 Skins",
    },
    {
      id: 2,
      game: "Genshin Impact",
      level: 55,
      price: 2500000,
      status: "pending",
      date: new Date("2024-03-14"),
      details: "AR 55, Limited Characters",
    },
  ];

  const cartItems = [
    {
      id: 1,
      game: "PUBG Mobile Account",
      level: 70,
      price: 1500000,
      details: "Royal Pass",
    },
  ];

  const handleBack = () => {
    navigate("/home");
  };

  const handleLogout = () => {
    logout();
    navigate("/home");
  };

  // Update the indicator position when activeTab changes
  useEffect(() => {
    if (tabRefs.current[activeTab]) {
      const tabElement = tabRefs.current[activeTab];
      const tabRect = tabElement.getBoundingClientRect();
      const navElement = tabElement.parentElement;
      const navRect = navElement.getBoundingClientRect();

      setIndicatorStyle({
        left: tabRect.left - navRect.left,
        width: tabRect.width,
        transition: "all 0.3s ease",
      });
    }
  }, [activeTab]);

  // Initialize indicator position on first render
  useEffect(() => {
    // Use a short timeout to ensure the DOM is fully rendered
    const timer = setTimeout(() => {
      if (tabRefs.current[activeTab]) {
        const tabElement = tabRefs.current[activeTab];
        const tabRect = tabElement.getBoundingClientRect();
        const navElement = tabElement.parentElement;
        const navRect = navElement.getBoundingClientRect();

        setIndicatorStyle({
          left: tabRect.left - navRect.left,
          width: tabRect.width,
          transition: "none", // No transition on initial render
        });
      }
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  const handleChangeTab = (tabId) => {
    setActiveTab(tabId);
  };

  const renderStatus = (status) => {
    switch (status) {
      case "success":
        return (
          <span className="flex items-center text-green-600">
            <CheckCircle2 className="w-4 h-4 mr-1" />
            Success
          </span>
        );
      case "pending":
        return (
          <span className="flex items-center text-yellow-600">
            <Clock className="w-4 h-4 mr-1" />
            Pending
          </span>
        );
      default:
        return (
          <span className="flex items-center text-red-600">
            <AlertCircle className="w-4 h-4 mr-1" />
            Failed
          </span>
        );
    }
  };

  // If data is still loading, show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-48">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBack}
                className="bg-white/10 hover:bg-white/20 text-white rounded-full p-2"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div className="relative">
                <img
                  className="h-24 w-24 rounded-full border-4 border-white"
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${displayName}`}
                  alt="Profile"
                />
                <span className="absolute bottom-0 right-0 h-6 w-6 rounded-full bg-green-400 border-2 border-white"></span>
              </div>
              <div className="text-white">
                <h1 className="text-2xl font-bold">{displayName}</h1>
                <div className="flex items-center mt-1">
                  <Crown className="w-5 h-5 text-yellow-400 mr-2" />
                  <span>Pelanggan</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-white/10 hover:bg-white/20 text-white rounded-full p-2">
                <Bell className="w-6 h-6" />
              </button>
              <button className="bg-white/10 hover:bg-white/20 text-white rounded-full p-2">
                <ShoppingCart className="w-6 h-6" />
              </button>
              <button
                onClick={handleLogout}
                className="bg-white/10 hover:bg-white/20 text-white rounded-full p-2"
              >
                <LogOut className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="bg-white rounded-lg shadow">
          {/* Navigation */}
          <div className="border-b relative">
            <nav
              className="flex space-x-8 px-6 overflow-x-auto"
              aria-label="Tabs"
            >
              {[
                { id: "profile", name: "Profile", icon: Shield },
                { id: "transactions", name: "Transactions", icon: History },
                { id: "cart", name: "Cart", icon: ShoppingCart },
                { id: "settings", name: "Settings", icon: Settings },
              ].map((tab) => (
                <button
                  key={tab.id}
                  ref={(el) => (tabRefs.current[tab.id] = el)}
                  onClick={() => handleChangeTab(tab.id)}
                  className={`
                    flex items-center px-3 py-4 text-sm font-medium whitespace-nowrap
                    ${
                      activeTab === tab.id
                        ? "text-blue-600"
                        : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }
                  `}
                >
                  <tab.icon className="w-5 h-5 mr-2" />
                  {tab.name}
                </button>
              ))}
              {/* Animated indicator */}
              <div
                className="absolute bottom-0 h-0.5 bg-blue-500 transition-all duration-300"
                style={{
                  left: `${indicatorStyle.left}px`,
                  width: `${indicatorStyle.width}px`,
                  transition: indicatorStyle.transition,
                }}
              ></div>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "profile" && (
              <div className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Personal Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center space-x-3">
                      <User className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Nama</p>
                        <p className="text-gray-900">{displayName}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="text-gray-900">{userEmail}</p>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                          Verified
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">
                          Akun Telah Dibuat
                        </p>
                        <p className="text-gray-900">
                          {joinDate.toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Crown className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-gray-900">Pelanggan</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Transactions */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Recent Transactions
                  </h2>
                  <div className="space-y-4">
                    {transactions.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="bg-gray-50 rounded-lg p-4"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-gray-900">
                              {transaction.game}
                            </h3>
                            <p className="text-sm text-gray-500">
                              Level {transaction.level}
                            </p>
                            <p className="text-sm text-gray-500">
                              {transaction.details}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-gray-900">
                              Rp {transaction.price.toLocaleString()}
                            </p>
                            <p className="text-sm text-gray-500">
                              {transaction.date.toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </p>
                            {renderStatus(transaction.status)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "transactions" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Transaction History
                  </h2>
                  <button className="text-blue-600 hover:text-blue-700 font-medium">
                    Download History
                  </button>
                </div>
                <div className="space-y-4">
                  {transactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="bg-gray-50 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {transaction.game}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Level {transaction.level}
                          </p>
                          <p className="text-sm text-gray-500">
                            {transaction.details}
                          </p>
                          {transaction.status === "success" && (
                            <button className="mt-2 inline-flex items-center text-blue-600 hover:text-blue-700">
                              <Download className="w-4 h-4 mr-1" />
                              Download Details
                            </button>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">
                            Rp {transaction.price.toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-500">
                            {transaction.date.toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                          {renderStatus(transaction.status)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "cart" && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Cart</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="border rounded-lg p-4">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {item.game}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Level {item.level} • {item.details}
                          </p>
                          <div className="flex items-center mt-2">
                            <Star className="w-4 h-4 text-yellow-400" />
                            <Star className="w-4 h-4 text-yellow-400" />
                            <Star className="w-4 h-4 text-yellow-400" />
                            <Star className="w-4 h-4 text-yellow-400" />
                            <Star className="w-4 h-4 text-gray-300" />
                          </div>
                        </div>
                        <p className="font-medium text-gray-900">
                          Rp {item.price.toLocaleString()}
                        </p>
                      </div>
                      <button className="mt-4 w-full bg-blue-600 text-white rounded-md py-2 hover:bg-blue-700">
                        Add to Cart
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "settings" && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Settings
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Bell className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">
                          Notifications
                        </p>
                        <p className="text-sm text-gray-500">
                          Manage notification preferences
                        </p>
                      </div>
                    </div>
                    <button className="text-blue-600 hover:text-blue-700 font-medium">
                      Configure
                    </button>
                  </div>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Security Settings
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Lock className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">Password</p>
                        <p className="text-sm text-gray-500">
                          Last changed 3 months ago
                        </p>
                      </div>
                    </div>
                    <button className="text-blue-600 hover:text-blue-700 font-medium">
                      Change
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Smartphone className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">
                          Setting Akun
                        </p>
                        <p className="text-sm text-gray-500">Ubah Akun</p>
                      </div>
                    </div>
                    <button className="text-blue-600 hover:text-blue-700 font-medium">
                      Configure
                    </button>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Recent Login Activity
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">
                            Last Login
                          </p>
                          <p className="text-sm text-gray-500">
                            {lastLogin.toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                          <p className="text-sm text-gray-500">
                            Jakarta, Indonesia
                          </p>
                        </div>
                        <History className="w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
