import React, { useState, useEffect } from "react";
import { ShoppingCart, Heart, ChevronRight, Star, Filter } from "lucide-react";
import Header from "./ComponentHome/Header";
import { Link } from "react-router-dom";
import allAccounts from "../DataCobaan/account";

function AccountGames() {
  // Sample data for available games with their IDs
  const purchaseAccounts = [
    { id: "Genshin Impact", name: "Genshin Impact" },
    { id: "Honkai Star Rail", name: "Honkai Star Rail" },
    { id: "Honkai Impact", name: "Honkai Impact" },
    { id: "Zenless Zone Zero", name: "Zenless Zone Zero" },
  ];

  const [sortMethod, setSortMethod] = useState("terbaru");
  const handleSortChange = (e) => {
    setSortMethod(e.target.value);
  };

  const getSortedAccounts = () => {
    let sorted = [...filteredAccounts];

    switch (sortMethod) {
      case "termurah":
        return sorted.sort((a, b) => {
          // Use discounted price if available
          const priceA = a.discount || a.price;
          const priceB = b.discount || b.price;
          return priceA - priceB;
        });
      case "termahal":
        return sorted.sort((a, b) => {
          // Use discounted price if available
          const priceA = a.discount || a.price;
          const priceB = b.discount || b.price;
          return priceB - priceA;
        });
      case "rating":
        return sorted.sort((a, b) => b.rating - a.rating);
      case "terbaru":
      default:
        // Assuming newer accounts are at the beginning of the array
        // If you have a date field, you should use that instead
        return sorted;
    }
  };
 

  // State for selected game type
  const [selectedGame, setSelectedGame] = useState("all");
  // State for filtered accounts
  const [filteredAccounts, setFilteredAccounts] = useState(allAccounts);

  // Filter accounts when selectedGame changes
  useEffect(() => {
    if (selectedGame === "all") {
      setFilteredAccounts(allAccounts);
    } else {
      setFilteredAccounts(
        allAccounts.filter((account) => account.game === selectedGame),
      );
    }
  }, [selectedGame]);

  // Handle filtering from dropdown
  const handleDropdownChange = (e) => {
    setSelectedGame(e.target.value);
  };

  // Handle filtering from sidebar links
  const handleSidebarClick = (gameName) => {
    setSelectedGame(gameName);
  };

  return (
    <>
      <div className=" bg-gray-50 min-h-screen">
        <Header />
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold my-8">Akun Game</h1>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar using aside element */}
            <aside className="hidden md:block w-64 pr-8">
              <div className="sticky top-20">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Pilih Game
                  </label>
                  <ul className="space-y-2">
                    <li>
                      <button
                        onClick={() => handleSidebarClick("all")}
                        className={`w-full text-left px-4 py-2 rounded-lg flex items-center ${
                          selectedGame === "all"
                            ? "bg-blue-100 text-blue-700 font-medium"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        Semua Game
                      </button>
                    </li>
                    {purchaseAccounts.map((account) => (
                      <li key={account.id}>
                        <button
                          onClick={() => handleSidebarClick(account.name)}
                          className={`w-full text-left px-4 py-2 rounded-lg flex items-center ${
                            selectedGame === account.name
                              ? "bg-blue-100 text-blue-700 font-medium"
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          {account.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 text-xs text-gray-500">
                  <p>© 2025 GameAccounts</p>
                  <div className="flex flex-wrap mt-2">
                    <a href="#" className="mr-2 hover:text-indigo-600">
                      Syarat & Ketentuan
                    </a>
                    <a href="#" className="mr-2 hover:text-indigo-600">
                      Kebijakan Privasi
                    </a>
                    <a href="#" className="mr-2 hover:text-indigo-600">
                      Bantuan
                    </a>
                    <a href="#" className="hover:text-indigo-600">
                      Kontak
                    </a>
                  </div>
                </div>
              </div>
            </aside>

            {/* Mobile Game Categories Tabs */}
            <div className="md:hidden mb-4 overflow-x-auto whitespace-nowrap pb-2">
              {purchaseAccounts.map((account) => (
                <button
                  key={account.id}
                  onClick={() => handleSidebarClick(account.name)}
                  className={`px-4 py-2 mr-2 rounded-full ${
                    selectedGame === account.id
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {account.name}
                </button>
              ))}
            </div>

            {/* Main content using main element */}
            <main className="lg:w-3/4">
              {/* Mobile dropdown filter (visible only on smaller screens) */}
              <div className="block lg:hidden mb-6">
                <select
                  className="w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  value={selectedGame}
                  onChange={handleDropdownChange}
                >
                  <option value="all">Semua Game</option>
                  {purchaseAccounts.map((account) => (
                    <option key={account.id} value={account.name}>
                      {account.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Display count of accounts */}
              <div className="mb-6 text-gray-600 flex items-center justify-between">
                <div>
                  Menampilkan {filteredAccounts.length} akun{" "}
                  {selectedGame !== "all" ? selectedGame : ""}
                </div>
                <div className="hidden lg:block">
                  <select
                    className="bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm"
                    value={sortMethod}
                    onChange={handleSortChange}
                  >
                    <option value="terbaru">Terbaru</option>
                    <option value="termurah">Harga Terendah</option>
                    <option value="termahal">Harga Tertinggi</option>
                    <option value="rating">Rating Tertinggi</option>
                  </select>
                </div>
              </div>

              {/* Grid of accounts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {getSortedAccounts().map((account, index) => (
                  <Link
                    key={index}
                    to={`/product/${account.id}`} // Tambahkan tautan ke detail produk
                    className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow"
                  >
                    <div className="h-48 overflow-hidden relative group">
                      <img
                        src={account.image}
                        alt={account.game}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/70 bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <button className="bg-white text-blue-600 rounded-full p-2">
                          <ShoppingCart className="h-5 w-5" />
                        </button>
                      </div>
                      {account.discount && (
                        <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                          PROMO
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <div className="text-sm font-semibold text-blue-600">
                          {account.game}
                        </div>
                        <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          {account.level}
                        </div>
                      </div>
                      <h3 className="font-semibold text-lg mb-2">
                      {account.title}
                      </h3>
                      
                      <div className="mb-3">
                        <ul className="text-xs text-gray-600">
                          {account.features.slice(0, 3).map((feature, i) => (
                            <li key={i} className="flex items-center mb-1">
                              <div className="h-1 w-1 bg-blue-500 rounded-full mr-2"></div>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <div>
                          {account.discount ? (
                            <div className="flex items-center">
                              <span className="text-gray-400 line-through text-sm mr-2">
                                Rp {account.price.toLocaleString("id-ID")}
                              </span>
                              <span className="font-bold text-lg text-blue-600">
                                Rp {account.discount.toLocaleString("id-ID")}
                              </span>
                            </div>
                          ) : (
                            <span className="font-bold text-lg text-blue-600">
                              Rp {account.price.toLocaleString("id-ID")}
                            </span>
                          )}
                        </div>
                        <button className="bg-blue-100 hover:bg-blue-200 text-blue-600 p-2 rounded-full transition-colors">
                          <ShoppingCart className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Empty state when no accounts match filter */}
              {filteredAccounts.length === 0 && (
                <div className="text-center py-16 bg-white rounded-xl shadow-md">
                  <div className="text-blue-600 text-6xl mb-4">😢</div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    Tidak Ada Akun Ditemukan
                  </h3>
                  <p className="text-gray-600">
                    Belum ada akun {selectedGame} yang tersedia saat ini.
                  </p>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </>
  );
}

export default AccountGames;
