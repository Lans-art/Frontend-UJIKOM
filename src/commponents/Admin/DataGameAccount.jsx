import React, { useState, useEffect } from "react";
import {
  Search,
  Edit2,
  Trash2,
  Plus,
  Eye,
  EyeOff,
  AlertTriangle,
} from "lucide-react";
import DetailAccount from "./components/DetailAccount";
import AccountFormModal from "./components/AccountFormModal";
import {
  getAccounts,
  createAccount,
  updateAccount,
  deleteAccount,
} from "../../services/accountservice";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function DataGameAccount() {
  const [showPassword, setShowPassword] = useState({});
  const [showDetailAccount, setShowDetailAccount] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [gameFilter, setGameFilter] = useState("All Games");
  const [serverFilter, setServerFilter] = useState("All Servers");
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);

  // Game-specific configurations
 const gameConfigs = {
   "Honkai Impact 3D": {
     levels: Array.from({ length: 80 }, (_, i) => `Captain ${i + 1}`), // Captain 1 sampai Captain 80
     features: [
       "Character SSS",
       "Weapon 5★",
       "Colab Character",
       "High Crystals",
     ],
     serverOptions: ["Asia", "Europe", "America", "TW/HK/MO"],
   },
   "Genshin Impact": {
     levels: Array.from({ length: 60 }, (_, i) => `AR ${i + 1}`), // AR 1 sampai AR 60
     features: [
       "Character 5★",
       "Weapon 5★",
       "Limited Character",
       "High Primogem",
     ],
     serverOptions: ["Asia", "Europe", "America", "TW/HK/MO"],
   },
   "Honkai Star Rail": {
     levels: Array.from({ length: 70 }, (_, i) => `Trailblaze ${i + 1}`), // Trailblaze 1 sampai Trailblaze 70
     features: [
       "Character 5★",
       "Light Cone 5★",
       "Colab Character",
       "High Stellar Jade",
     ],
     serverOptions: ["Asia", "Europe", "America", "TW/HK/MO"],
   },
   "Zenless Zone Zero": {
     levels: Array.from({ length: 60 }, (_, i) => `Agent ${i + 1}`), // Agent 1 sampai Agent 60
     features: [
       "Bangboo 5★",
       "Hollow 5★",
       "Limited Bangboo",
       "High Polychrome",
     ],
     serverOptions: ["Asia", "Europe", "America", "TW/HK/MO"],
   },
 };


  // Fetch accounts on component mount
  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAccounts();
      setAccounts(data);
    } catch (err) {
      console.error("Error fetching accounts:", err);
      setError("Failed to load accounts. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = (id) => {
    setShowPassword((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const openDetailAccount = (account) => {
    setSelectedAccount(account);
    setShowDetailAccount(true);
  };

  const openEditModal = (account) => {
    setSelectedAccount(account);
    setShowEditModal(true);
  };

  const openAddModal = () => {
    setSelectedAccount(null);
    setShowAddModal(true);
  };

  const closeModal = () => {
    setShowDetailAccount(false);
    setShowEditModal(false);
    setShowAddModal(false);
    setSelectedAccount(null);
  };

  const handleSaveAccount = async (savedAccount) => {
    setLoading(true);
    setError(null);
    
    

    try {
      // The account data is already saved by the form modal
      // Just refresh the accounts list
      await fetchAccounts();
      closeModal();

      // Show success notification
      toast.success(
        `Account ${savedAccount.id ? "updated" : "created"} successfully!`,
      );
    } catch (err) {
      console.error("Error retrieving updated accounts:", err);
      setError("Failed to refresh account list. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async (id) => {
    setLoading(true);
    setError(null);

    try {
      await deleteAccount(id);
      // Refresh the accounts list
      await fetchAccounts();
      setDeleteConfirmation(null);
      toast.success("Account deleted successfully!");
    } catch (err) {
      console.error("Error deleting account:", err);
      setError("Failed to delete account. Please try again.");
      toast.error("Failed to delete account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Filter accounts based on search and filters
  const filteredAccounts = accounts.filter((account) => {
    // Search term filter
    const matchesSearch =
      searchTerm === "" ||
      account.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.game.toLowerCase().includes(searchTerm.toLowerCase());

    // Game filter
    const matchesGame =
      gameFilter === "All Games" || account.game === gameFilter;

    // Server filter
    const matchesServer =
      serverFilter === "All Servers" || account.game_server === serverFilter;

    return matchesSearch && matchesGame && matchesServer;
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Game Account Management</h1>
        <ToastContainer />
        <button
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          onClick={openAddModal}
        >
          <Plus className="w-4 h-4 mr-2" />
          New Account
        </button>
      </div>

      {error && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex items-center">
          <AlertTriangle className="w-5 h-5 mr-2" />
          <span>{error}</span>
        </div>
      )}

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search accounts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <select
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={gameFilter}
                onChange={(e) => setGameFilter(e.target.value)}
              >
                <option>All Games</option>
                {Object.keys(gameConfigs).map((game) => (
                  <option key={game} value={game}>
                    {game}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <select
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={serverFilter}
                onChange={(e) => setServerFilter(e.target.value)}
              >
                <option>All Servers</option>
                <option>Asia</option>
                <option>Europe</option>
                <option>America</option>
                <option>TW/HK/MO</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="py-10 text-center text-gray-500">
            Loading accounts...
          </div>
        ) : filteredAccounts.length === 0 ? (
          <div className="py-10 text-center text-gray-500">
            No accounts found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Account Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created By
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Credentials
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Server
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAccounts.map((account) => (
                  <tr key={account.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div
                          className="aspect-[20/9] w-28 flex-shrink-0 cursor-pointer"
                          onClick={() => openDetailAccount(account)}
                        >
                          <img
                            className=" w-full h-full rounded-md object-cover"
                            src={
                              account.images && account.images.length > 0
                                ? account.images[0] 
                                : "/placeholder-account.png"
                            }
                            alt={account.title}
                          />
                        </div>
                        <div className="ml-4">
                          <div
                            className="text-sm font-medium text-gray-900 cursor-pointer hover:text-indigo-600"
                            onClick={() => openDetailAccount(account)}
                          >
                            {account.game}
                          </div>
                          <div className="text-sm text-gray-500">
                            {account.title}
                          </div>
                          <div className="text-xs text-gray-500">
                            Level: {account.level}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {account.admin ? account.admin.name : "Unknown"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {account.game_email || account.email}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-sm text-gray-500">
                          {showPassword[account.id]
                            ? account.game_password || account.password
                            : "••••••••"}
                        </div>
                        <button
                          onClick={() => togglePasswordVisibility(account.id)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          {showPassword[account.id] ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {account.game_server}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatPrice(account.discount || account.price)}
                      </div>
                      {account.discount && account.discount < account.price && (
                        <div className="text-xs text-gray-500 line-through">
                          {formatPrice(account.price)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {account.stock}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          account.stock > 0
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {account.stock > 0 ? "Available" : "Out of Stock"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <button
                          className="text-indigo-600 hover:text-indigo-900"
                          onClick={() => openEditModal(account)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-900"
                          onClick={() => setDeleteConfirmation(account)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="px-6 py-4 border-t">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Showing {filteredAccounts.length} of {accounts.length} entries
            </div>
            {/* Pagination can be added here later */}
          </div>
        </div>
      </div>

      {/* Detail Modal Component */}
      {showDetailAccount && selectedAccount && (
        <DetailAccount
          account={selectedAccount}
          showPassword={showPassword}
          togglePasswordVisibility={togglePasswordVisibility}
          formatPrice={formatPrice}
          onClose={closeModal}
        />
      )}

      {/* Edit Account Modal Component */}
      {showEditModal && (
        <AccountFormModal
          account={selectedAccount}
          gameConfigs={gameConfigs}
          onSave={handleSaveAccount}
          onClose={closeModal}
          title="Edit Game Account"
        />
      )}

      {/* Add Account Modal Component */}
      {showAddModal && (
        <AccountFormModal
          account={null}
          gameConfigs={gameConfigs}
          onSave={handleSaveAccount}
          onClose={closeModal}
          title="Add New Game Account"
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmation && (
        <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg max-w-md w-full mx-4 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Confirm Deletion
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Are you sure you want to delete the account "
              {deleteConfirmation.title}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeleteConfirmation(null)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteAccount(deleteConfirmation.id)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DataGameAccount;
