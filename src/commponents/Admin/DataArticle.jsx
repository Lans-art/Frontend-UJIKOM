import React, { useState, useEffect } from "react";
import {
  Search,
  Edit2,
  Trash2,
  Plus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import axios from "axios"; // Make sure to install axios
import { useUser } from "../../context/UserContext";
import { endpoints } from "../../../axios";




// Games list for filter dropdown
const games = [
  "All Games",
  "Zenless Zone Zero",
  "Honkai Star Rail",
  "Genshin Impact",
];
const statuses = ["All Statuses", "Published", "Draft"];


function ImageSlider({ imageUrl }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const images = [
    imageUrl,
    "/api/placeholder/300/180",
    "/api/placeholder/300/220",
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <div className="relative w-24 h-16 group">
      <img
        src={images[currentSlide]}
        alt="Article image"
        className="w-full h-full object-cover rounded"
      />
      <button
        onClick={prevSlide}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-30 text-white p-1 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <ChevronLeft className="w-3 h-3" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-30 text-white p-1 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <ChevronRight className="w-3 h-3" />
      </button>
    </div>
  );
}

function DataArticle() {
  // State for articles and search/filter
  const { token } = useUser(); // ambil token dari context

  const [articles, setArticles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGame, setSelectedGame] = useState("All Games");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [showNewArticleForm, setShowNewArticleForm] = useState(false);
  const [ newArticle, setNewArticle] = useState({
    title: "",
    game: "",
    content: "",
    imageUrl: "/api/placeholder/300/200", // Default image URL
    status: "Draft",
  });
  const [useSlider, setUseSlider] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load articles from API on component mount
  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/article");
      setArticles(response.data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch articles:", err);
      setError("Failed to load articles. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const filteredArticles = Array.isArray(articles)
    ? articles.filter((article) => {
        const matchesSearch =
          (article.title || "")
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          (article.content || "")
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          (article.admin || "")
            .toLowerCase()
            .includes(searchTerm.toLowerCase());


        const matchesGame =
          selectedGame === "All Games" || article.game === selectedGame;
        const matchesStatus =
          selectedStatus === "All Statuses" ||
          article.status === selectedStatus;

        return matchesSearch && matchesGame && matchesStatus;
      })
    : [];

  const handleCreateArticle = async () => {
    try {
      const response = await axios.post(
       (endpoints.crudArticle.create),
        newArticle,
        // {
        //   headers: {
        //     Authorization: `Bearer ${token}`,
        //     "Content-Type": "application/json",
        //   },
        // },
      );

      setArticles([response.data, ...articles]);
      setShowNewArticleForm(false);
      setNewArticle({
        title: "",
        game: "",
        content: "",
        imageUrl: "/api/placeholder/300/200",
        status: "Draft",
      });

      alert("Article berhasil disimpan!");
    } catch (err) {
      console.error("Failed to create article:", err);
      alert("Failed to create article. Please try again.");
    }
  };

  // Handle input changes in the new article form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewArticle({
      ...newArticle,
      [name]: value,
    });
  };

  // Preview the selected image
  const [previewImage, setPreviewImage] = useState(null);

  const handleImageChange = (e) => {
    const { value } = e.target;

    // Update the image URL in the form state
    setNewArticle({
      ...newArticle,
      imageUrl: value || "/api/placeholder/300/200", // Use default if empty
    });

    // Update preview
    setPreviewImage(value || "/api/placeholder/300/200");
  };

  // Delete article
  const handleDeleteArticle = async (id) => {
    if (window.confirm("Anda yakin ingin menghapus article ini?")) {
      try {
        await axios.delete(`/api/article/${id}`);
        setArticles(articles.filter((article) => article.id !== id));
        alert("Article berhasil dihapus!");
      } catch (err) {
        console.error("Failed to delete article:", err);
        alert("Failed to delete article. Please try again.");
      }
    }
  };

  // Toggle article status between Published and Draft
  const handleToggleStatus = async (id) => {
    try {
      const response = await axios.put(`/api/article/toggle-status/${id}`);

      const updatedArticles = articles.map((article) => {
        if (article.id === id) {
          return { ...article, status: response.data.status };
        }
        return article;
      });

      setArticles(updatedArticles);
    } catch (err) {
      console.error("Failed to toggle article status:", err);
      alert("Failed to update article status. Please try again.");
    }
  };

  if (loading)
    return <div className="text-center p-8">Loading articles...</div>;
  if (error) return <div className="text-center p-8 text-red-500">{error}</div>;

  return (
    <div className="bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Manajemen Article</h1>
        <div className="flex space-x-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="sliderToggle"
              checked={useSlider}
              onChange={() => setUseSlider(!useSlider)}
              className="mr-2"
            />
            <label htmlFor="sliderToggle" className="text-sm">
              Gunakan Slider
            </label>
          </div>
          <button
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            onClick={() => setShowNewArticleForm(!showNewArticleForm)}
          >
            <Plus className="w-4 h-4 mr-2" />
            {showNewArticleForm ? "Batal" : "Article Baru"}
          </button>
        </div>
      </div>

      {showNewArticleForm && (
        <div className="bg-white rounded-lg shadow mb-8 p-6">
          <h2 className="text-xl font-semibold mb-4">Buat Article Baru</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Judul
              </label>
              <input
                type="text"
                name="title"
                value={newArticle.title}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Game
              </label>
              <select
                name="game"
                value={newArticle.game}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Pilih Game</option>
                {games.slice(1).map((game) => (
                  <option key={game} value={game}>
                    {game}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                name="status"
                value={newArticle.status}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {statuses.slice(1).map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Image Content Input and Preview */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gambar Article
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <input
                  type="text"
                  name="imageUrl"
                  placeholder="Masukkan URL gambar atau gunakan default"
                  value={
                    newArticle.imageUrl === "/api/placeholder/300/200"
                      ? ""
                      : newArticle.imageUrl
                  }
                  onChange={handleImageChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Kosongkan untuk menggunakan gambar default
                </p>
              </div>
              <div className="flex justify-center items-center">
                <div className="h-24 w-36 bg-gray-100 rounded overflow-hidden">
                  <img
                    src={previewImage || newArticle.imageUrl}
                    alt="Preview"
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/api/placeholder/300/200";
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Konten
            </label>
            <textarea
              name="content"
              value={newArticle.content}
              onChange={handleInputChange}
              rows="4"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            ></textarea>
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleCreateArticle}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              disabled={
                !newArticle.title || !newArticle.game || !newArticle.content
              }
            >
              Simpan Article
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Cari article..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <select
                value={selectedGame}
                onChange={(e) => setSelectedGame(e.target.value)}
                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {games.map((game) => (
                  <option key={game} value={game}>
                    {game}
                  </option>
                ))}
              </select>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Article
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Admin
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Game
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Tanggal
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredArticles.length > 0 ? (
                filteredArticles.map((article) => (
                  <tr key={article.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {useSlider ? (
                          <ImageSlider imageUrl={article.imageUrl} />
                        ) : (
                          <img
                            className="h-16 w-24 object-cover rounded"
                            src={article.imageUrl}
                            alt=""
                          />
                        )}
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {article.title}
                          </div>
                          <div className="text-sm text-gray-500 line-clamp-2">
                            {article.content.substring(0, 100)}
                            {article.content.length > 100 ? "..." : ""}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          className="h-8 w-8 rounded-full"
                          src={article.avatarUrl}
                          alt=""
                        />
                        <div className="ml-3">
                          <div className="flex items-center text-sm font-medium text-gray-900">
                            {article.admin}
                            {article.verified && (
                              <span className="ml-1 text-blue-500">✓</span>
                            )}
                          </div>
                          <div className="text-sm text-gray-500">
                            {article.timeAgo}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">
                        {article.game}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          article.status === "Published"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {article.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {article.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleToggleStatus(article.id)}
                          className={`p-1 rounded hover:bg-gray-100 ${
                            article.status === "Published"
                              ? "text-yellow-600"
                              : "text-green-600"
                          }`}
                          title={
                            article.status === "Published"
                              ? "Set to Draft"
                              : "Publish"
                          }
                        >
                          {article.status === "Published" ? (
                            <span>↓</span>
                          ) : (
                            <span>↑</span>
                          )}
                        </button>
                        <a
                          href={`/article/${article.id}/edit`}
                          className="p-1 rounded text-blue-600 hover:bg-gray-100"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </a>
                        <button
                          onClick={() => handleDeleteArticle(article.id)}
                          className="p-1 rounded text-red-600 hover:bg-gray-100"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    Tidak ada article yang ditemukan
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 sm:px-6">
          <div className="text-sm text-gray-700">
            Menampilkan {filteredArticles.length} dari {articles.length} article
          </div>
        </div>
      </div>
    </div>
  );
}

export default DataArticle;
