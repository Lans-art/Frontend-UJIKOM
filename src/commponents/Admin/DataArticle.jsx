import React, { useState, useEffect } from "react";
import {
  Search,
  Edit2,
  Trash2,
  Plus,
  ChevronLeft,
  ChevronRight,
  Upload,
  X,
} from "lucide-react";
import axiosInstance from "../../../axios";
import { useUser } from "../../context/UserContext";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

// Games list for filter dropdown
const games = [
  "All Games",
  "Honkai Impact 3rd",
  "Genshin Impact",
  "Honkai Star Rail",
  "Zenless Zone Zero",
];
const statuses = ["All Statuses", "published", "draft"];

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

// Modal Component
function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      ></div>
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-3xl mx-4 z-10">
        {children}
      </div>
    </div>
  );
}

function NewArticleModal({ isOpen, onClose, onSave }) {
  const [newArticle, setNewArticle] = useState({
    title: "",
    game: "",
    content: "",
    status: "draft",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("/api/placeholder/300/200");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    // Reset form when modal is opened
    if (isOpen) {
      setNewArticle({
        title: "",
        game: "",
        content: "",
        status: "draft",
      });
      setSelectedFile(null);
      setPreviewUrl("/api/placeholder/300/200");
    }
  }, [isOpen]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      // Create a preview URL
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result);
      };
      fileReader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewArticle({
      ...newArticle,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !newArticle.title ||
      !newArticle.game ||
      !newArticle.content ||
      !selectedFile
    ) {
      toast.error("Please fill all required fields and select an image");
      return;
    }

    try {
      setUploading(true);

      // Create FormData object to handle file upload
      const formData = new FormData();
      formData.append("title", newArticle.title);
      formData.append("game", newArticle.game);
      formData.append("content", newArticle.content);
      formData.append("status", newArticle.status);

      // Append the image file
      if (selectedFile) {
        formData.append("image", selectedFile);
      }

      await onSave(formData);
    } catch (err) {
      console.error("Failed to create article:", err);
      toast.error(
        err.response?.data?.message ||
          "Failed to create article. Please try again.",
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex justify-between items-center border-b p-4">
        <h2 className="text-xl font-semibold">Buat Article Baru</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      <form onSubmit={handleSubmit} className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Judul <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={newArticle.title}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Game <span className="text-red-500">*</span>
            </label>
            <select
              name="game"
              value={newArticle.game}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
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

        {/* Image Upload and Preview */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Gambar Article <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <div className="flex items-center">
                <label className="w-full flex items-center justify-center p-2 border-2 border-dashed border-gray-300 rounded-md hover:border-indigo-500 cursor-pointer bg-gray-50">
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-6 w-6 text-gray-400" />
                    <div className="text-sm text-gray-600">
                      <span className="font-medium text-indigo-600 hover:text-indigo-500">
                        Pilih file gambar
                      </span>{" "}
                      atau drag & drop
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF sampai 10MB
                    </p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    required
                  />
                </label>
              </div>
              {selectedFile && (
                <p className="text-xs text-gray-500 mt-1">
                  File terpilih: {selectedFile.name}
                </p>
              )}
            </div>
            <div className="flex justify-center items-center">
              <div className="h-24 w-36 bg-gray-100 rounded overflow-hidden">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Konten <span className="text-red-500">*</span>
          </label>
          <textarea
            name="content"
            value={newArticle.content}
            onChange={handleInputChange}
            rows="4"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          ></textarea>
        </div>

        <div className="flex justify-end space-x-3 pt-3 border-t">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          >
            Batal
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center"
            disabled={
              !newArticle.title ||
              !newArticle.game ||
              !newArticle.content ||
              !selectedFile ||
              uploading
            }
          >
            {uploading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Uploading...
              </>
            ) : (
              "Simpan Article"
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function DataArticle() {
  // State for articles and search/filter
  const { token } = useUser(); // get token from context
  const [articles, setArticles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGame, setSelectedGame] = useState("All Games");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [modalOpen, setModalOpen] = useState(false);
  const [useSlider, setUseSlider] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Configure axios instance with auth token
  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;
    }
  }, []);

  // Load articles from API on component mount
  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/api/articles");
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
          article.status.toLowerCase() === selectedStatus.toLowerCase();

        return matchesSearch && matchesGame && matchesStatus;
      })
    : [];

  const handleCreateArticle = async (formData) => {
    try {
      // Send the formData to create article endpoint
      const response = await axiosInstance.post("/api/articles", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Add the new article to the articles state
      setArticles([response.data, ...articles]);

      // Close modal
      setModalOpen(false);

      toast.success("Article berhasil disimpan!");
      return response.data;
    } catch (err) {
      console.error("Failed to create article:", err);
      throw err;
    }
  };

  // Delete article
  const handleDeleteArticle = async (id) => {
    if (window.confirm("Anda yakin ingin menghapus article ini?")) {
      try {
        await axiosInstance.delete(`/api/articles/${id}`);
        setArticles(articles.filter((article) => article.id !== id));
        toast.success("Article berhasil dihapus!");
      } catch (err) {
        console.error("Failed to delete article:", err);
        toast.error("Failed to delete article. Please try again.");
      }
    }
  };

  // Toggle article status between Published and Draft
  const handleToggleStatus = async (id) => {
    try {
      const response = await axiosInstance.put(
        `/api/articles/toggle-status/${id}`,
      );

      const updatedArticles = articles.map((article) => {
        if (article.id === id) {
          return { ...article, status: response.data.status };
        }
        return article;
      });

      setArticles(updatedArticles);
      toast.success(
        `Status article berhasil diubah menjadi ${response.data.status}`,
      );
    } catch (err) {
      console.error("Failed to toggle article status:", err);
      toast.error("Failed to update article status. Please try again.");
    }
  };

  return (
    <div className="bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Manajemen Article</h1>
        <div className="flex space-x-4">
          <button
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            onClick={() => setModalOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Article Baru
          </button>
        </div>
      </div>

      {/* New Article Modal */}
      <NewArticleModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleCreateArticle}
      />

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
              {loading ? (
                // Show loading state inside the table
                <tr>
                  <td colSpan="6" className="px-6 py-12">
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <svg
                        className="animate-spin h-8 w-8 text-indigo-500 mb-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <p className="text-sm font-medium">Loading articles...</p>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                // Show error state inside the table
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center">
                    <div className="flex flex-col items-center justify-center text-red-500">
                      <svg
                        className="h-8 w-8 mb-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                      </svg>
                      <p className="font-medium text-sm">{error}</p>
                      <button
                        onClick={fetchArticles}
                        className="mt-3 px-4 py-2 bg-indigo-600 text-white text-xs rounded-md hover:bg-indigo-700"
                      >
                        Coba Lagi
                      </button>
                    </div>
                  </td>
                </tr>
              ) : filteredArticles.length > 0 ? (
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
                          article.status.toLowerCase() === "published"
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
                            article.status.toLowerCase() === "published"
                              ? "text-yellow-600"
                              : "text-green-600"
                          }`}
                          title={
                            article.status.toLowerCase() === "published"
                              ? "Set to draft"
                              : "publish"
                          }
                        >
                          {article.status.toLowerCase() === "published" ? (
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
