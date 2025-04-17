import React, { useState, useEffect } from "react";
import { ShoppingCart, Gamepad2 } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { getPublicAccounts } from "../../services/accountservice";
import { toast } from "react-toastify";

// Import or define the formatPrice function
export function formatPrice(price) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(price);
}

function AccountGames() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Available games with their IDs
  const purchaseAccounts = [
    { id: "genshin-impact", name: "Genshin Impact" },
    { id: "honkai-star-rail", name: "Honkai Star Rail" },
    { id: "honkai-impact", name: "Honkai Impact" },
    { id: "zenless-zone-zero", name: "Zenless Zone Zero" },
  ];

  const [sortMethod, setSortMethod] = useState(
    searchParams.get("sort") || "terbaru",
  );
  const [accounts, setAccounts] = useState([]);
  const [filteredAccounts, setFilteredAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedGame, setSelectedGame] = useState(
    searchParams.get("game") || "all",
  );

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedGame !== "all") {
      params.set("game", selectedGame);
    }
    if (sortMethod !== "terbaru") {
      params.set("sort", sortMethod);
    }
    setSearchParams(params, { replace: true });
  }, [selectedGame, sortMethod, setSearchParams]);

  // Fetch accounts on component mount
  useEffect(() => {
    fetchAccounts();
  }, []);

  // Fetch all accounts
  const fetchAccounts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPublicAccounts();
      setAccounts(data);
      filterAccounts(data, selectedGame);
    } catch (err) {
      console.error("Error fetching accounts:", err);
      setError("Failed to load accounts. Please try again.");
      toast.error("Failed to load accounts. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Filter accounts based on selected game
  const filterAccounts = (accountsData, game) => {
    if (!accountsData) return;

    if (game === "all") {
      setFilteredAccounts(accountsData);
    } else {
      // Convert the game name with spaces to lowercase without spaces for comparison
      const normalizedGame = game.toLowerCase().replace(/\s+/g, "");
      setFilteredAccounts(
        accountsData.filter((account) => {
          // Convert account game name to same format for comparison
          const accountGame = account.game?.toLowerCase().replace(/\s+/g, "");
          return accountGame === normalizedGame || account.game === game;
        }),
      );
    }
  };

  // Re-filter accounts when selectedGame changes
  useEffect(() => {
    filterAccounts(accounts, selectedGame);
  }, [selectedGame, accounts]);

  const handleSortChange = (e) => {
    setSortMethod(e.target.value);
  };

  // Get sorted accounts based on sort method
  const getSortedAccounts = () => {
    if (!filteredAccounts || filteredAccounts.length === 0) return [];

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
        return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case "terbaru":
      default:
        // If you have a createdAt field, you can use that
        return sorted.sort(
          (a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0),
        );
    }
  };

  // Handle dropdown filter change
  const handleDropdownChange = (e) => {
    setSelectedGame(e.target.value);
  };

  // Handle sidebar filter click
  const handleSidebarClick = (gameName) => {
    setSelectedGame(gameName);
  };

  // Handle add to cart
  const handleAddToCart = (account, event) => {
    event.preventDefault(); // Prevent navigation
    event.stopPropagation(); // Stop event bubbling

    // Create and dispatch a custom event
    const addToCartEvent = new CustomEvent("add-to-cart", {
      detail: { item: account, quantity: 1 },
    });
    window.dispatchEvent(addToCartEvent);

    toast.success(`${account.title} added to cart!`);
  };

  return (
    <>
      <div className="bg-gray-50 min-h-screen">
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
                    <a href="/terms" className="mr-2 hover:text-indigo-600">
                      Syarat & Ketentuan
                    </a>
                    <a href="/privacy" className="mr-2 hover:text-indigo-600">
                      Kebijakan Privasi
                    </a>
                    <a href="/help" className="mr-2 hover:text-indigo-600">
                      Bantuan
                    </a>
                    <a href="/contact" className="hover:text-indigo-600">
                      Kontak
                    </a>
                  </div>
                </div>
              </div>
            </aside>

            {/* Mobile Game Categories Tabs */}
            <div className="md:hidden mb-4 overflow-x-auto whitespace-nowrap pb-2">
              <button
                onClick={() => handleSidebarClick("all")}
                className={`px-4 py-2 mr-2 rounded-full ${
                  selectedGame === "all"
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                Semua
              </button>
              {purchaseAccounts.map((account) => (
                <button
                  key={account.id}
                  onClick={() => handleSidebarClick(account.name)}
                  className={`px-4 py-2 mr-2 rounded-full ${
                    selectedGame === account.name
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
                  {loading ? (
                    "Loading..."
                  ) : (
                    <>
                      Menampilkan {filteredAccounts.length} akun{" "}
                      {selectedGame !== "all" ? selectedGame : ""}
                    </>
                  )}
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

              {/* Loading state */}
              {loading && (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
                  <p className="mt-2 text-gray-600">Loading accounts...</p>
                </div>
              )}

              {/* Error state */}
              {error && !loading && (
                <div className="text-center py-12 bg-red-50 rounded-xl shadow-md">
                  <div className="text-red-600 text-6xl mb-4">⚠️</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    Oops! Something went wrong
                  </h3>
                  <p className="text-gray-600">{error}</p>
                  <button
                    onClick={fetchAccounts}
                    className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    Try Again
                  </button>
                </div>
              )}

              {/* Grid of accounts */}
              {!loading && !error && (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {getSortedAccounts().map((account) => (
                    <Link
                      key={account.id}
                      to={`/product/${account.id}`}
                      className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 flex flex-col h-full transform hover:-translate-y-1"
                    >
                      <div className="h-52 overflow-hidden relative">
                        <img
                          src={
                            account.images && account.images.length > 0
                              ? account.images[0]
                              : "/placeholder-account.png"
                          }
                          alt={`${account.game} account`}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                        />

                        {/* Badges overlay */}
                        <div className="absolute top-0 left-0 w-full p-3 flex justify-between">
                          <div className="flex gap-2">
                            {account.discount &&
                              account.discount < account.price && (
                                <div className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                                  PROMO
                                </div>
                              )}
                            {account.stock <= 0 && (
                              <div className="bg-gray-800 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                                SOLD OUT
                              </div>
                            )}
                          </div>
                          <div className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                            {account.level}
                          </div>
                        </div>

                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end justify-center">
                          <div className="w-full py-3 px-4 text-white">
                            <span className="inline-flex items-center gap-1 text-sm font-medium">
                              <Gamepad2 className="w-4 h-4" />
                              View Details
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="p-5 flex-grow flex flex-col">
                        {/* Game tag and store badge */}
                        <div className="flex justify-between items-center mb-3">
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                            {account.game}
                          </span>
                          <div className="text-xs font-medium text-gray-600 flex items-center gap-1">
                            <span>by</span>
                            <span className="font-semibold text-gray-800">
                              {account.admin.name}
                            </span>
                          </div>
                        </div>

                        {/* Title */}
                        <h3 className="font-bold text-gray-800 text-lg mb-3 line-clamp-2">
                          {account.title}
                        </h3>

                        {/* Features */}
                        <div className="mb-4 flex-grow">
                          {Array.isArray(account.features) &&
                          account.features.length > 0 ? (
                            <ul className="space-y-2">
                              {account.features
                                .slice(0, 3)
                                .map((feature, i) => (
                                  <li
                                    key={i}
                                    className="flex items-center text-sm text-gray-600"
                                  >
                                    <div className="h-2 w-2 bg-blue-500 rounded-full mr-2 flex-shrink-0"></div>
                                    <span className="line-clamp-1">
                                      {feature}
                                    </span>
                                  </li>
                                ))}
                            </ul>
                          ) : (
                            <p className="text-sm text-gray-500 italic">
                              No features listed
                            </p>
                          )}
                        </div>

                        {/* Price and cart button */}
                        <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
                          <div>
                            {account.discount &&
                            account.discount < account.price ? (
                              <div className="flex flex-col">
                                <span className="text-gray-400 line-through text-xs">
                                  {formatPrice(account.price)}
                                </span>
                                <span className="font-bold text-lg text-blue-600">
                                  {formatPrice(account.discount)}
                                </span>
                              </div>
                            ) : (
                              <span className="font-bold text-lg text-blue-600">
                                {formatPrice(account.price)}
                              </span>
                            )}
                          </div>

                          <button
                            className={`rounded-full p-2 transition-colors flex items-center gap-2 ${
                              account.stock <= 0
                                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700 text-white"
                            }`}
                            onClick={(e) => handleAddToCart(account, e)}
                            disabled={account.stock <= 0}
                          >
                            <ShoppingCart className="h-5 w-5" />
                            <span className="text-sm font-medium mr-1">
                              Add
                            </span>
                          </button>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* Empty state when no accounts match filter */}
              {!loading && !error && filteredAccounts.length === 0 && (
                <div className="text-center py-16 bg-white rounded-xl shadow-md">
                  <div className="text-blue-600 text-6xl mb-4">😢</div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    Tidak Ada Akun Ditemukan
                  </h3>
                  <p className="text-gray-600">
                    Belum ada akun {selectedGame !== "all" ? selectedGame : ""}{" "}
                    yang tersedia saat ini.
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
