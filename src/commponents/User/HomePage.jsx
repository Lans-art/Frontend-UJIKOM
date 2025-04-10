import React, { useState, useEffect } from "react";
import Header from "./ComponentHome/Header";
import { motion } from "framer-motion";

function HomePage() {
  const [activeTab, setActiveTab] = useState("All");
  const [isExpanded, setIsExpanded] = useState({});
  const [visiblePosts, setVisiblePosts] = useState(5);
  const [posts, setPosts] = useState([]);

  // Fetch articles from localStorage on component mount
  useEffect(() => {
    fetch(`/api/articles`)
      .then((res) => res.json())
      .then((data) => {
        const formattedPosts = data.map((article) => ({
          id: article.id,
          admin: article.admin,
          game: article.game,
          avatarUrl: article.avatarUrl,
          timeAgo: article.timeAgo,
          imageUrl: article.imageUrl,
          title: article.title,
          content: article.content,
          likes: Math.floor(Math.random() * 100),
        }));
        setPosts(formattedPosts);
      })
      .catch((err) => {
        console.error("Failed to fetch articles:", err);
      });
  }, []);

  const loadMore = () => {
    setVisiblePosts((prev) => prev + 10);
  };

  const toggleExpand = (postId) => {
    setIsExpanded((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  const filteredPosts =
    activeTab === "All"
      ? posts
      : posts.filter((post) => post.game === activeTab);

  const gamesData = [
    {
      id: 1,
      name: "Honkai Star Rail",
      originalPrice: 100000,
      discountPrice: 80000,
      sales: 500,
      image: "/image/hsr.png",
    },
    {
      id: 2,
      name: "Genshin Impact",
      originalPrice: 120000,
      discountPrice: 90000,
      sales: 700,
      image: "/image/gi.png",
    },
    {
      id: 3,
      name: "Honkai Impact 3rd",
      originalPrice: 90000,
      discountPrice: 70000,
      sales: 300,
      image: "/image/hi3.png",
    },
    {
      id: 4,
      name: "Zenless Zone Zero",
      originalPrice: 110000,
      discountPrice: 85000,
      sales: 450,
      image: "/image/zzz.png",
    },
  ];

  // Get data for "Limited Time Deals"
  const limitedTimeDeals = gamesData.map((game) => ({
    id: game.id,
    name: `${game.name} Account`,
    originalPrice: game.originalPrice,
    discountPrice: game.discountPrice,
    image: game.image,
  }));

  // Get data for "Top Games"
  const topGames = gamesData.map((game) => ({
    id: game.id,
    name: game.name,
    sales: game.sales,
    image: game.image,
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-6 md:flex">
        {/* Left Sidebar - Game Categories */}
        <aside className="hidden md:block w-64 pr-8">
          <div className="sticky top-24">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              Game Categories
            </h2>
            <nav>
              <ul className="space-y-2">
                {["All", ...new Set(posts.map((post) => post.game))].map(
                  (game) => (
                    <li key={game}>
                      <button
                        onClick={() => setActiveTab(game)}
                        className={`w-full text-left px-4 py-2 rounded-lg flex items-center transition ${
                          activeTab === game
                            ? "bg-blue-100 text-blue-700 font-medium"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <span>{game}</span>
                      </button>
                    </li>
                  ),
                )}
              </ul>
            </nav>

            <div className="mt-6 text-xs text-gray-500">
              <p>© 2025 GameAccounts</p>
              <div className="flex flex-wrap mt-2">
                <a href="#" className="mr-2 hover:text-blue-600">
                  Syarat & Ketentuan
                </a>
                <a href="#" className="mr-2 hover:text-blue-600">
                  Kebijakan Privasi
                </a>
                <a href="#" className="mr-2 hover:text-blue-600">
                  Bantuan
                </a>
                <a href="#" className="hover:text-blue-600">
                  Kontak
                </a>
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile Post Categories Tabs */}
        <div
          className="md:hidden mb-4 overflow-x-auto whitespace-nowrap pb-2 flex gap-2 px-2 
                scroll-smooth snap-x snap-mandatory scrollbar-hide"
        >
          {["All", ...new Set(posts.map((post) => post.game))].map((game) => (
            <button
              key={game}
              onClick={() => setActiveTab(game)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all shadow-sm border 
        snap-start
        ${
          activeTab === game
            ? "bg-blue-600 text-white border-blue-600 shadow-md"
            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
        }`}
            >
              {game}
            </button>
          ))}
        </div>

        <div className="flex-1 max-w-2xl mx-auto">
          {posts.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Belum ada artikel
              </h3>
              <p className="text-gray-600">
                Buat artikel dari halaman admin untuk menampilkan konten di
                sini.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredPosts.slice(0, visiblePosts).map((post) => (
                <div
                  key={post.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden transition hover:shadow-xl"
                >
                  {/* Header */}
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={post.avatarUrl}
                        alt="Profile"
                        className="h-10 w-10 rounded-full object-cover border border-gray-300"
                      />
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {post.admin}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>{post.timeAgo}</span>
                          <span className="bg-gray-200 px-2 py-1 rounded-md text-gray-600">
                            {post.game}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Gambar */}
                  <div className="relative w-full aspect-[16/9]">
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="absolute top-0 left-0 w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/api/placeholder/300/200";
                      }}
                    />
                  </div>

                  {/* Konten */}
                  <div className="p-4">
                    <p className="text-gray-900 font-semibold text-lg">
                      {post.title}
                    </p>

                    {/* Framer Motion untuk animasi expand/collapse */}
                    <motion.div
                      initial={{ height: 45, overflow: "hidden" }}
                      animate={{ height: isExpanded[post.id] ? "auto" : 45 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="text-gray-700 text-sm leading-relaxed"
                    >
                      {post.content}
                    </motion.div>

                    <button
                      onClick={() => toggleExpand(post.id)}
                      className="text-blue-600 text-xs mt-1 font-medium hover:underline"
                    >
                      {isExpanded[post.id] ? "Sembunyikan" : "Selengkapnya"}
                    </button>

                    {/* Statistik */}
                    <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
                      <span>👍 {post.likes}</span>
                    </div>

                    {/* Hashtag */}
                    <div className="mt-2">
                      <span className="text-blue-600 text-xs font-medium">
                        #{post.game.replace(/\s+/g, "")}
                      </span>
                    </div>

                    {/* Tombol Ikuti */}
                    <div className="flex justify-end mt-3">
                      <button className="bg-blue-100 text-blue-600 px-4 py-1 rounded-full text-xs font-medium hover:bg-blue-200 transition">
                        Ikuti
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Tombol Selengkapnya */}
              {visiblePosts < filteredPosts.length && (
                <div className="text-center mt-4">
                  <button
                    onClick={loadMore}
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-300 transition"
                  >
                    Selengkapnya
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Sidebar - Recommended Accounts */}
        <aside className="hidden lg:block w-80 pl-8">
          <div className="sticky top-24">
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">
                Promo Terbatas
              </h2>
              <div className="space-y-4">
                {limitedTimeDeals.map((deal) => (
                  <div
                    key={deal.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={deal.image}
                        alt={deal.name}
                        className="h-12 w-12 rounded-lg object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/api/placeholder/48/48";
                        }}
                      />
                      <div>
                        <h3 className="font-medium text-gray-800">
                          {deal.name}
                        </h3>
                        <p className="text-xs text-gray-500">
                          <span className="line-through text-red-500">
                            Rp{deal.originalPrice.toLocaleString("id-ID")}
                          </span>{" "}
                          Rp{deal.discountPrice.toLocaleString("id-ID")}
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-blue-600 text-xs">
                      Hemat Rp
                      {(deal.originalPrice - deal.discountPrice).toLocaleString(
                        "id-ID",
                      )}
                      !
                    </span>
                  </div>
                ))}
                <button className="w-full text-blue-600 font-medium hover:text-blue-700 text-sm">
                  Lihat Semua Promo
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4">
              <h2 className="text-lg font-bold text-gray-800 mb-4">
                Game Terpopuler
              </h2>
              <div className="space-y-4">
                {topGames.map((game) => (
                  <div key={game.id} className="flex items-center space-x-3">
                    <div className="relative">
                      <img
                        src={game.image}
                        alt={game.name}
                        className="h-10 w-10 rounded-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/api/placeholder/40/40";
                        }}
                      />
                      <div className="absolute -top-1 -right-1 bg-blue-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold">
                        {game.id}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">{game.name}</h3>
                      <div className="flex items-center">
                        <span className="text-xs text-gray-500">
                          {game.sales.toLocaleString("id-ID")} penjualan
                        </span>
                        <span className="mx-1 text-gray-300">•</span>
                        <span className="text-xs text-gray-500">5.0 ★</span>
                      </div>
                    </div>
                  </div>
                ))}
                <button className="w-full text-blue-600 font-medium hover:text-blue-700 text-sm">
                  Lihat Semua Game
                </button>
              </div>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}

export default HomePage;
