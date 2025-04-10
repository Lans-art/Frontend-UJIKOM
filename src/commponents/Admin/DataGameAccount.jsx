import React, { useState } from "react";
import {
  Search,
  Edit2,
  Trash2,
  Plus,
  Eye,
  EyeOff,
  X,
  ChevronRight,
} from "lucide-react";
import DetailAccount from "./components/DetailAccount";
import AccountFormModal from "./components/AccountFormModal";

function DataGameAccount() {
  const [showPassword, setShowPassword] = useState({});
  const [showDetailAccount, setShowDetailAccount] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);

  // Game-specific configurations
  const gameConfigs = {
    "Genshin Impact": {
      levels: ["AR 10", "AR 20", "AR 30", "AR 40", "AR 50", "AR 55", "AR 60"],
      features: [
        "Character 5★",
        "Weapon 5★",
        "Limited Character",
        "High Primogem",
      ],
      serverOptions: ["Asia", "Europe", "America", "TW/HK/MO"],
    },
    "Honkai Star Rail": {
      levels: [
        "Trailblaze 1",
        "Trailblaze 2",
        "Trailblaze 3",
        "Trailblaze 4",
        "Trailblaze 5",
        "Trailblaze 6",
      ],
      features: [
        "Character 5★",
        "Light Cone 5★",
        "Limited Character",
        "High Stellar Jade",
      ],
      serverOptions: ["Asia", "Europe", "America", "TW/HK/MO"],
    },
    "Zenless Zone Zero": {
      levels: ["Agent 1", "Agent 2", "Agent 3", "Agent 4", "Agent 5"],
      features: [
        "Bangboo 5★",
        "Hollow 5★",
        "Limited Bangboo",
        "High Polychrome",
      ],
      serverOptions: ["Asia", "Europe", "America", "TW/HK/MO"],
    },
  };

  const accounts = [
    {
      id: 1,
      game: "Genshin Impact",
      image:
        "https://imgop.itemku.com/?url=https%3A%2F%2Fd1x91p7vw3vuq8.cloudfront.net%2Fitemku-upload%2F20231112%2Fjlkqw6j2ltmu54zm0jz9o_thumbnail.jpg&w=1033&q=10",
      images: [
        "https://imgop.itemku.com/?url=https%3A%2F%2Fd1x91p7vw3vuq8.cloudfront.net%2Fitemku-upload%2F20231112%2Fjlkqw6j2ltmu54zm0jz9o_thumbnail.jpg&w=1033&q=10",
        "https://imgop.itemku.com/?url=https%3A%2F%2Fd1x91p7vw3vuq8.cloudfront.net%2Fitemku-upload%2F20231112%2Fjlkqw6j2ltmu54zm0jz9o_thumbnail.jpg&w=1033&q=10",
        "https://imgop.itemku.com/?url=https%3A%2F%2Fd1x91p7vw3vuq8.cloudfront.net%2Fitemku-upload%2F20231112%2Fjlkqw6j2ltmu54zm0jz9o_thumbnail.jpg&w=1033&q=10",
      ],
      stock: 10,
      server: "Asia",
      title: "Furina",
      price: 2500000,
      discount: 1999000,
      level: "AR 60",
      features: ["30+ Karakter 5★", "Senjata Langka", "Primogem Tinggi"],
      email: "account1@domain.com",
      password: "securepass123",
      status: "Available",
    },
  ];

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

  const handleSaveAccount = (formData) => {
    // Here you would typically save the data to your backend
    console.log("Saving account data:", formData);
    closeModal();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Game Account Management</h1>
        <button
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          onClick={openAddModal}
        >
          <Plus className="w-4 h-4 mr-2" />
          New Account
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search accounts..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <select className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option>All Games</option>
                <option>Genshin Impact</option>
                <option>Honkai Impact</option>
                <option>Honkai Star Rail</option>
                <option>Zenless Zone Zero</option>
              </select>
            </div>
            <div>
              <select className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option>All Servers</option>
                <option>Asia</option>
                <option>Europe</option>
                <option>America</option>
                <option>TW/HK/MO</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Account Details
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
              {accounts.map((account) => (
                <tr key={account.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div
                        className="h-14 w-14 flex-shrink-0 cursor-pointer"
                        onClick={() => openDetailAccount(account)}
                      >
                        <img
                          className="h-14 w-14 rounded-md object-cover"
                          src={account.image}
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
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{account.email}</div>
                    <div className="flex items-center gap-2">
                      <div className="text-sm text-gray-500">
                        {showPassword[account.id]
                          ? account.password
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
                      {account.server}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatPrice(account.discount)}
                    </div>
                    {account.discount < account.price && (
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
                      <button className="text-red-600 hover:text-red-900">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Showing 1 to 10 of 20 entries
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-1 border border-gray-300 rounded-md text-sm">
                Previous
              </button>
              <button className="px-3 py-1 border border-gray-300 rounded-md text-sm bg-indigo-600 text-white">
                1
              </button>
              <button className="px-3 py-1 border border-gray-300 rounded-md text-sm">
                2
              </button>
              <button className="px-3 py-1 border border-gray-300 rounded-md text-sm">
                Next
              </button>
            </div>
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
    </div>
  );
}

export default DataGameAccount;
