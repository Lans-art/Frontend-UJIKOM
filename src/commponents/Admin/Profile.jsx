import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Shield,
  Mail,
  Phone,
  Calendar,
  Bell,
  Settings,
  LogOut,
  CheckCircle2,
  AlertCircle,
  Clock,
  Lock,
  Smartphone,
  BarChart3,
  ArrowLeft,
  ShieldAlert,
  Store,
  Wallet,
  MessageSquare,
  User,
} from "lucide-react";
import axiosInstance from "../../../axios"; // Assuming this is your axios instance
import { useUser } from "../../context/UserContext"; // Import your user context

const Profile = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [salesStats, setSalesStats] = useState({
    daily: 0,
    weekly: 0,
    monthly: 0,
    revenue: 0,
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [nickname, setNickname] = useState("");

  const { logout, refreshUserData } = useUser();

  // Fetch profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get('/api/profile');
        setProfileData(response.data);
        setNickname(response.data.name);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching profile data:", err);
        setError("Failed to load profile data. Please try again later.");
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  // Fetch recent actions
  

  // Fetch sales statistics
  useEffect(() => {
    // This would be replaced with an actual API call
    // Example: const fetchSalesStats = async () => { ... }
    
    // For now, using dummy data until you implement the endpoint
    setSalesStats({
      daily: 15,
      weekly: 89,
      monthly: 342,
      revenue: 45000000,
    });
  }, []);

  

 

  const handleBack = () => {
    navigate("/admin");
  };


  const handleLogout = () => {
    logout();
    // Redirect to login page
    window.location.href = "/";
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-700">Loading profile data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
          <p className="mt-4 text-gray-700">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 h-48">
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
                  className="h-24 w-24 rounded-full border-4 border-white object-cover"
                  src={profileData?.avatar || "/api/placeholder/100/100"}
                  alt="Admin Profile"
                />
                <span className="absolute bottom-0 right-0 h-6 w-6 rounded-full bg-green-400 border-2 border-white"></span>
              </div>
              <div className="text-white">
                <h1 className="text-2xl font-bold">
                  {profileData?.name || "Admin"}
                </h1>
                <div className="flex items-center mt-1">
                  <ShieldAlert className="w-5 h-5 text-yellow-400 mr-2" />
                  <span>{profileData?.role || "Admin"}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-white/10 hover:bg-white/20 text-white rounded-full p-2">
                <Bell className="w-6 h-6" />
              </button>
              <button className="bg-white/10 hover:bg-white/20 text-white rounded-full p-2">
                <MessageSquare className="w-6 h-6" />
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
          <div className="border-b">
            <nav
              className="flex space-x-8 px-6 overflow-x-auto"
              aria-label="Tabs"
            >
              {[
                { id: "profile", name: "Profile", icon: Shield },
                { id: "accounts", name: "Game Accounts", icon: Store },
                { id: "transactions", name: "Transactions", icon: Wallet },
                { id: "reports", name: "Reports", icon: BarChart3 },
                { id: "settings", name: "Settings", icon: Settings },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center px-3 py-4 text-sm font-medium border-b-2 whitespace-nowrap
                    ${
                      activeTab === tab.id
                        ? "border-indigo-500 text-indigo-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }
                  `}
                >
                  <tab.icon className="w-5 h-5 mr-2" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "profile" && (
              <div className="space-y-6">
                {/* Admin Information */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Admin Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center space-x-3">
                      <User className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Nama</p>
                        <p className="text-gray-900">
                          {profileData?.name || "loading..."}
                        </p>
                        
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="text-gray-900">
                          {profileData?.email || "loading..."}
                        </p>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                          Verified
                        </span>
                      </div>
                    </div>



                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Akun Telah Dibuat</p>
                        <p className="text-gray-900">
                          {profileData?.created_at
                            ? new Date(
                                profileData.created_at,
                              ).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })
                            : "Loading..."}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <ShieldAlert className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Role</p>
                        <p className="text-gray-900">
                          {profileData?.role || "Admin"}
                        </p>
                        <p className="text-sm text-gray-500">
                          {profileData?.role === "admin"
                            ? "System Access"
                            : profileData?.role === "super_admin"
                            ? "Full System Access"
                            : "Limited Access"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Quick Statistics
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500">Daily Sales</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {salesStats.daily}
                          </p>
                        </div>
                        <BarChart3 className="w-8 h-8 text-indigo-500" />
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500">Weekly Sales</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {salesStats.weekly}
                          </p>
                        </div>
                        <BarChart3 className="w-8 h-8 text-indigo-500" />
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500">Monthly Sales</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {salesStats.monthly}
                          </p>
                        </div>
                        <BarChart3 className="w-8 h-8 text-indigo-500" />
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500">Revenue (IDR)</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {salesStats.revenue.toLocaleString()}
                          </p>
                        </div>
                        <Wallet className="w-8 h-8 text-indigo-500" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "accounts" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Game Accounts Management
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          Mobile Legends
                        </h3>
                        <p className="text-sm text-gray-500">
                          10 accounts in stock
                        </p>
                        <p className="text-sm text-gray-500">
                          5 pending verification
                        </p>
                      </div>
                      <Store className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="mt-4 flex space-x-2">
                      <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                        Manage
                      </button>
                      <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                        Add Stock
                      </button>
                    </div>
                  </div>
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          Genshin Impact
                        </h3>
                        <p className="text-sm text-gray-500">
                          15 accounts in stock
                        </p>
                        <p className="text-sm text-gray-500">
                          2 pending verification
                        </p>
                      </div>
                      <Store className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="mt-4 flex space-x-2">
                      <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                        Manage
                      </button>
                      <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                        Add Stock
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "transactions" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Transaction Management
                  </h2>
                  <div className="flex space-x-2">
                    <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
                      Export Report
                    </button>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          Mobile Legends Account #1234
                        </h3>
                        <p className="text-sm text-gray-500">
                          Buyer: user123@email.com
                        </p>
                        <p className="text-sm text-gray-500">
                          Payment Method: Bank Transfer
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">
                          Rp 1,200,000
                        </p>
                        <p className="text-sm text-gray-500">March 15, 2024</p>
                        {renderStatus("pending")}
                      </div>
                    </div>
                    <div className="mt-4 flex space-x-2">
                      <button className="text-green-600 hover:text-green-700 text-sm font-medium">
                        Verify Payment
                      </button>
                      <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "reports" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Reports & Analytics
                  </h2>
                  <div className="flex space-x-2">
                    <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
                      Download Report
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-4">
                      Top Selling Games
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span>Mobile Legends</span>
                        <span className="font-medium">45 sales</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Genshin Impact</span>
                        <span className="font-medium">32 sales</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-4">
                      Revenue by Game
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span>Mobile Legends</span>
                        <span className="font-medium">Rp 54,000,000</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Genshin Impact</span>
                        <span className="font-medium">Rp 48,000,000</span>
                      </div>
                    </div>
                  </div>
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
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
