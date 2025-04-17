import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAccountById } from "../../services/accountservice";
import axiosInstance, { endpoints } from "../../../axios";
import {
  ArrowLeft,
  MessageSquare,
  ShieldCheck,
  Minus,
  Plus,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  Heart,
  Share2,
  Info,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { formatPrice } from "../format";
import { useUser } from "../../context/UserContext"; // Updated to use UserContext
import ChatModal from "./Components/ChatModal"; // Import the ChatModal component

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [account, setAccount] = useState(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showChatModal, setShowChatModal] = useState(false);
  const { isAuthenticated } = useUser(); // Get authentication status from UserContext

  useEffect(() => {
    // Reset states when ID changes
    setQuantity(1);
    setIsImageLoaded(false);
    setCurrentImageIndex(0);
    setLoading(true);
    setError(null);

    const fetchAccountData = async () => {
      try {
        console.log("Fetching account with ID:", id);
        const data = await getAccountById(id);
        console.log("Received account data:", data);
        setAccount(data);
      } catch (err) {
        console.error("Error fetching account:", err);
        setError("Failed to load account data");
        toast.error("Failed to load account details");
      } finally {
        setLoading(false);
      }
    };

    fetchAccountData();
  }, [id]);

  // Handle chat button click
  const handleChatButtonClick = () => {
    if (!isAuthenticated) {
      toast.error("Anda harus login untuk mengirim pesan");
      navigate("/login", { state: { from: `/product/${id}` } });
      return;
    }
    setShowChatModal(true);
  };

  // Updated to use the API instead of localStorage
  // Updated addItem function
  const addItem = async (item, qty) => {
    try {
      // Check if user is authenticated
      if (!isAuthenticated) {
        toast.error("Anda harus login untuk menambahkan item ke keranjang");
        navigate("/login", { state: { from: `/product/${id}` } });
        return;
      }

      // Calculate the correct price (discount or regular)
      const priceToUse = item.discount || item.price;

      // Call the cart API endpoint to add item
      await axiosInstance.post(endpoints.cart.cart, {
        sellaccount_id: item.id,
        quantity: qty,
        price: priceToUse, // Send the price to use
      });

      // Dispatch event for any cart component that's listening
      window.dispatchEvent(
        new CustomEvent("add-to-cart", { detail: { item, quantity: qty } }),
      );

      toast.success(`${item.title} ditambahkan ke keranjang!`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
    } catch (err) {
      console.error("Failed to add item to cart:", err);
      toast.error("Gagal menambahkan item ke keranjang");
    }
  };

  // Updated proceedToCheckout function
  const proceedToCheckout = async (item, qty) => {
    try {
      // Check if user is authenticated
      if (!isAuthenticated) {
        toast.error("Anda harus login untuk melanjutkan ke checkout");
        navigate("/login", { state: { from: `/product/${id}` } });
        return;
      }

      // Calculate the correct price (discount or regular)
      const priceToUse = item.discount || item.price;

      // First add the item to cart
      await axiosInstance.post(endpoints.cart.cart, {
        sellaccount_id: item.id,
        quantity: qty,
        price: item.price,
        discount_price: item.discount || null,
      });

      // Create a checkout item format matching what checkout expects
      const checkoutItem = {
        id: Date.now(), // temporary ID for checkout
        quantity: qty,
        sellaccount: {
          ...item,
          discount_price: item.discount || null,
          price: item.price,
        },
      };

      // Store just this item in session storage for checkout
      sessionStorage.setItem("checkoutItems", JSON.stringify([checkoutItem]));

      // Navigate to checkout
      navigate("/cart/checkout");
    } catch (err) {
      console.error("Failed to proceed to checkout:", err);
      toast.error("Gagal melanjutkan ke checkout");
    }
  };

  const handleQuantityChange = (delta) => {
    setQuantity((prev) => {
      const newQuantity = prev + delta;
      return newQuantity >= 1 && newQuantity <= account.stock
        ? newQuantity
        : prev;
    });
  };

  const handleImageNavigation = (direction) => {
    setIsImageLoaded(false);
    const images = account.images || [account.image];
    if (direction === "next") {
      setCurrentImageIndex((prev) =>
        prev === images.length - 1 ? 0 : prev + 1,
      );
    } else {
      setCurrentImageIndex((prev) =>
        prev === 0 ? images.length - 1 : prev - 1,
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!account) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-medium text-gray-700">
            Akun tidak ditemukan
          </h2>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }

  const images = account?.images || [account?.image];
  const sellerId = account?.admin?.id;
  const sellerName = account?.admin?.name || "Admin Store";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Modern Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-700 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span className="font-medium">Kembali</span>
            </button>
            <div className="text-sm font-medium">
              <span className="text-gray-400">Akun</span>
              <span className="mx-2 text-gray-300">/</span>
              <span className="text-blue-600">Detail Produk</span>
            </div>
          </div>
        </div>
      </nav>

      <ToastContainer />

      {/* Chat Modal */}
      <ChatModal
        isOpen={showChatModal}
        onClose={() => setShowChatModal(false)}
        account={account}
        receiverId={sellerId}
        receiverName={sellerName}
      />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-wrap gap-4">
          {/* Image Gallery Section */}
          <div className="space-y-6 w-[calc(50%-0.5rem)]">
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
              <div className="relative spect-[19.5/9]a">
                <img
                  src={images[currentImageIndex]}
                  alt={account.title}
                  className={`w-full h-full object-cover transition-opacity duration-300 ${
                    isImageLoaded ? "opacity-100" : "opacity-0"
                  }`}
                  onLoad={() => setIsImageLoaded(true)}
                />

                {!isImageLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                    <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}

                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => handleImageNavigation("prev")}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10  bg-white/80 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                    >
                      <ChevronLeft className="w-6 h-6 text-gray-700" />
                    </button>
                    <button
                      onClick={() => handleImageNavigation("next")}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                    >
                      <ChevronRight className="w-6 h-6 text-gray-700" />
                    </button>
                  </>
                )}
              </div>

              {images.length > 1 && (
                <div className="p-4 grid grid-cols-5 gap-2 bg-gray-50">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setIsImageLoaded(false);
                        setCurrentImageIndex(index);
                      }}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                        currentImageIndex === index
                          ? "border-blue-600"
                          : "border-transparent"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Game Details Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <h3 className="text-sm text-gray-500 mb-1">Level Akun</h3>
                <p className="text-lg font-semibold text-gray-900">
                  {account.details?.level || account.level}
                </p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <h3 className="text-sm text-gray-500 mb-1">Server</h3>
                <p className="text-lg font-semibold text-gray-900">
                  {account.details?.game_server || account.game_server}
                </p>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="text-sm text-gray-500 mb-1">Store</h3>
              <p className="text-lg font-semibold text-gray-900">
                {account.admin?.name || "Official Store"}
              </p>
            </div>
          </div>

          {/* Product Information Section */}
          <div className="space-y-6 w-[calc(50%-0.5rem)]">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div className="space-y-2">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {account.title}
                  </h1>
                  <p className="text-lg text-purple-600 font-medium">
                    {account.game}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                    <Heart className="w-6 h-6" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-blue-500 transition-colors">
                    <Share2 className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Price */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center space-x-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
                    Anti Hackback
                  </span>
                  {account.stock <= 5 && (
                    <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm font-medium">
                      Stok Terbatas
                    </span>
                  )}
                </div>
                <div className="flex items-baseline space-x-2">
                  {account.discount && account.discount !== account.price && (
                    <span className="text-lg text-gray-500 line-through">
                      {formatPrice(account.price)}
                    </span>
                  )}
                  <span className="text-3xl font-bold text-blue-600">
                    {formatPrice(account.discount || account.price)}
                  </span>
                </div>
              </div>

              {/* Features */}
              {account.features && account.features.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Fitur Akun
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {account.features.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-2 text-gray-700"
                      >
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Purchase Section */}
              <div className="space-y-4 ">
                <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl">
                  <div>
                    <span className="text-gray-600">Stok Tersedia:</span>
                    <span
                      className={`ml-2 font-medium ${
                        account.stock <= 5 ? "text-red-600" : "text-gray-900"
                      }`}
                    >
                      {account.stock}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      className="w-8 h-8 flex items-center justify-center bg-white rounded-lg border border-gray-200 hover:border-blue-500 transition-colors"
                      disabled={quantity <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center font-medium">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      className="w-8 h-8 flex items-center justify-center bg-white rounded-lg border border-gray-200 hover:border-blue-500 transition-colors"
                      disabled={quantity >= account.stock}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between bg-blue-50 p-4 rounded-xl">
                  <span className="text-gray-700">Total</span>
                  <span className="text-xl font-bold text-blue-600">
                    Rp{" "}
                    {(
                      (account.discount || account.price) * quantity
                    ).toLocaleString("id-ID")}
                  </span>
                </div>

                <div className="flex items-center space-x-4">
                  <button
                    onClick={handleChatButtonClick}
                    className="p-4 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    <MessageSquare className="w-6 h-6 text-gray-600" />
                  </button>
                  <button
                    onClick={() => addItem(account, quantity)}
                    disabled={account?.stock === 0}
                    className={`flex-1 py-4 rounded-xl font-semibold flex items-center justify-center space-x-2 transition-colors ${
                      account?.stock === 0
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50"
                    }`}
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>Tambah ke Troli</span>
                  </button>

                  <button
                    onClick={() => proceedToCheckout(account, quantity)}
                    disabled={account?.stock === 0}
                    className={`flex-1 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors ${
                      account?.stock === 0
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    Beli Sekarang
                  </button>
                </div>

                <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 pt-4">
                  <ShieldCheck className="w-4 h-4 text-blue-500" />
                  <span>Pembayaran Aman & Terjamin oleh</span>
                  <span className="text-blue-600 font-medium">Trade Guard</span>
                </div>
              </div>
            </div>

            {/* Trading Instructions */}
          </div>

          <div className="bg-white h-auto rounded-2xl p-6 shadow-sm w-full">
            <div className="flex items-center space-x-2 mb-4">
              <Info className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                Panduan Trading
              </h2>
            </div>
            <ol className="space-y-3">
              {[
                `Pilih akun ${account.game} yang tersedia dan lakukan pembelian.`,
                "Selesaikan pembayaran sesuai dengan instruksi.",
                `Tunggu hingga admin mengirimkan informasi login akun ${account.game}.`,
                "Pastikan detail akun sesuai dengan deskripsi yang diberikan.",
              ].map((step, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </span>
                  <span className="text-gray-600">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetail;
