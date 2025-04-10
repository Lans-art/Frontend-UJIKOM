import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiLogOut,
  FiCamera,
  FiEdit2,
  FiShoppingCart,
  FiClock,
} from "react-icons/fi";
import { useUser } from "../../context/UserContext";
import axios from "axios";

function Profile() {
  const navigate = useNavigate();
  const { name, email, logout, refreshUserData, isLoading, token } = useUser();

  const [profile, setProfile] = useState({
    name: name || "User",
    email: email || "No email provided",
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name || "User"}`,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  // Dummy data - in a real app, you would fetch these from your API
  const [transactions] = useState([
    {
      id: 1,
      game: "Cyberpunk 2077",
      amount: 59.99,
      date: "2024-02-15",
      status: "completed",
      image: "https://picsum.photos/seed/cyber/100/100",
    },
    {
      id: 2,
      game: "Elden Ring",
      amount: 49.99,
      date: "2024-02-10",
      status: "completed",
      image: "https://picsum.photos/seed/elden/100/100",
    },
  ]);

  const [cartItems] = useState([
    {
      id: 1,
      game: "Red Dead Redemption 2",
      price: 39.99,
      image: "https://picsum.photos/seed/rdr2/100/100",
    },
    {
      id: 2,
      game: "God of War Ragnarök",
      price: 49.99,
      image: "https://picsum.photos/seed/gow/100/100",
    },
  ]);

  const handleBack = () => {
    navigate("/home");
  };

  const handleLogout = () => {
    logout();
    navigate("/home");
  };

  const handleAvatarChange = () => {
    const newSeed = Math.random().toString(36).substring(7);
    setProfile((prev) => ({
      ...prev,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newSeed}`,
    }));
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    try {
      // Example of how to update profile data with your backend
      const response = await axios.put(
        "http://localhost:8000/api/user/profile",
        {
          name: profile.name,
          email: profile.email,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // If successful, refresh user data from context
      if (response.status === 200) {
        refreshUserData();
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      // In a production app, you'd want to show an error message to the user
    }
  };

  const handleRemoveFromCart = (id) => {
    // In a real app, you would call an API to remove the item
    console.log("Remove item from cart:", id);
  };

  // If data is still loading, show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  const renderProfile = () => (
    <div className="flex flex-col items-center max-w-lg mx-auto">
      <div className="relative">
        <img
          src={profile.avatar}
          alt="Profile"
          className="w-40 h-40 md:w-48 md:h-48 rounded-full border-4 border-white shadow-lg"
        />
        <button
          onClick={handleAvatarChange}
          className="absolute bottom-2 right-2 bg-blue-500 p-3 rounded-full text-white hover:bg-blue-600 transition-colors shadow-lg"
        >
          <FiCamera className="w-6 h-6" />
        </button>
      </div>

      {isEditing ? (
        <form onSubmit={handleProfileUpdate} className="mt-8 w-full">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) =>
                  setProfile((prev) => ({ ...prev, name: e.target.value }))
                }
                className="mt-2 block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) =>
                  setProfile((prev) => ({ ...prev, email: e.target.value }))
                }
                className="mt-2 block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-lg"
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-6 py-3 text-lg border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 text-lg bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="mt-8 text-center w-full">
          <h2 className="text-3xl font-bold text-gray-900">{profile.name}</h2>
          <p className="text-xl text-gray-500 mt-2">{profile.email}</p>
          <button
            onClick={() => setIsEditing(true)}
            className="mt-6 flex items-center mx-auto px-6 py-3 text-lg border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <FiEdit2 className="w-5 h-5 mr-2" />
            Edit Profile
          </button>
        </div>
      )}
    </div>
  );

  const renderTransactions = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Transaction History</h2>
      {transactions.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">No transactions found</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex flex-col md:flex-row md:items-center gap-4 bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <img
                src={transaction.image}
                alt={transaction.game}
                className="w-24 h-24 rounded-xl object-cover"
              />
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900">
                  {transaction.game}
                </h3>
                <p className="text-gray-500 mt-1">
                  {new Date(transaction.date).toLocaleDateString()}
                </p>
              </div>
              <div className="flex flex-row md:flex-col items-center md:items-end gap-2 md:gap-1">
                <p className="text-xl font-bold text-gray-900">
                  ${transaction.amount}
                </p>
                <span className="px-3 py-1 text-sm rounded-full bg-green-100 text-green-800 font-medium">
                  {transaction.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderCart = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Shopping Cart</h2>
      {cartItems.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">Your cart is empty</p>
          <button
            onClick={() => navigate("/home")}
            className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <>
          <div className="grid gap-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex flex-col md:flex-row md:items-center gap-4 bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <img
                  src={item.image}
                  alt={item.game}
                  className="w-24 h-24 rounded-xl object-cover"
                />
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {item.game}
                  </h3>
                  <p className="text-2xl font-bold text-blue-600 mt-2">
                    ${item.price}
                  </p>
                </div>
                <button
                  onClick={() => handleRemoveFromCart(item.id)}
                  className="px-6 py-3 text-red-600 border-2 border-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <div className="mt-8 space-y-4">
            <div className="flex justify-between items-center bg-gray-50 p-6 rounded-xl">
              <div className="text-xl text-gray-700">Total:</div>
              <div className="text-3xl font-bold text-gray-900">
                $
                {cartItems
                  .reduce((sum, item) => sum + item.price, 0)
                  .toFixed(2)}
              </div>
            </div>
            <button className="w-full py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-xl font-semibold">
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button
              onClick={handleBack}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <FiArrowLeft className="w-6 h-6 mr-2" />
              <span className="text-lg">Back to Home</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center text-red-600 hover:text-red-700"
            >
              <FiLogOut className="w-6 h-6 mr-2" />
              <span className="text-lg">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex space-x-2 bg-white p-2 rounded-xl shadow-sm mb-8 sticky top-20 z-10">
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex-1 flex items-center justify-center px-4 py-3 rounded-lg text-lg font-medium transition-colors ${
              activeTab === "profile"
                ? "bg-blue-500 text-white shadow-sm"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <FiEdit2 className="w-5 h-5 mr-2" />
            Profile
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`flex-1 flex items-center justify-center px-4 py-3 rounded-lg text-lg font-medium transition-colors ${
              activeTab === "history"
                ? "bg-blue-500 text-white shadow-sm"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <FiClock className="w-5 h-5 mr-2" />
            History
          </button>
          <button
            onClick={() => setActiveTab("cart")}
            className={`flex-1 flex items-center justify-center px-4 py-3 rounded-lg text-lg font-medium transition-colors ${
              activeTab === "cart"
                ? "bg-blue-500 text-white shadow-sm"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <FiShoppingCart className="w-5 h-5 mr-2" />
            Cart ({cartItems.length})
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
          {activeTab === "profile" && renderProfile()}
          {activeTab === "history" && renderTransactions()}
          {activeTab === "cart" && renderCart()}
        </div>
      </main>
    </div>
  );
}

export default Profile;
