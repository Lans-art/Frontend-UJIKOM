import React, { useState } from "react";
import {
  ArrowLeft,
  Search,
  ChevronDown,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";

const tabs = ["Menunggu Konfirmasi", "Dikonfirmasi", "Ditolak", "Semua"];

function ConfirmAccounts() {
  const [activeTab, setActiveTab] = useState("Menunggu Konfirmasi");
  const [searchQuery, setSearchQuery] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  // Sample data - replace with your actual data
  const orders = [
    {
      id: 1,
      status: "Menunggu Konfirmasi",
      date: "12 Maret 2025",
      product: {
        name: "Diamond Mobile Legends",
        game: "Mobile Legends",
        quantity: "100 Diamond",
        image: "/api/placeholder/100/100",
      },
      customer: {
        name: "John Doe",
        email: "john@example.com",
        id: "USR123",
      },
      price: "Rp 50.000",
      paymentMethod: "Bank Transfer",
      paymentProof:
        "https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=500",
    },
  ];

  const handleConfirmOrder = (order) => {
    setSelectedOrder(order);
    setShowConfirmModal(true);
  };

  const handleRejectOrder = (order) => {
    setSelectedOrder(order);
    setShowRejectModal(true);
  };

  const confirmOrder = () => {
    // Handle order confirmation logic here
    setShowConfirmModal(false);
  };

  const rejectOrder = () => {
    // Handle order rejection logic here
    setShowRejectModal(false);
    setRejectReason("");
  };

  const filteredOrders = orders.filter((order) => {
    const matchesTab = activeTab === "Semua" || order.status === activeTab;
    const matchesSearch =
      order.product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => window.history.back()}
                className="text-gray-500 hover:text-gray-700"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h1 className="ml-4 text-xl font-semibold text-gray-900">
                Konfirmasi Pesanan
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">Admin Panel</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="flex border-b">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`px-6 py-4 text-sm font-medium ${
                  activeTab === tab
                    ? "border-b-2 border-indigo-500 text-indigo-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 flex gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari berdasarkan nama produk, pelanggan, atau ID"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 flex items-center gap-2 hover:bg-gray-50">
            Filter
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-lg shadow overflow-hidden"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-sm text-gray-500">
                      Order ID: #{order.id}
                    </span>
                    <h3 className="text-lg font-medium text-gray-900 mt-1">
                      {order.product.name}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        order.status === "Menunggu Konfirmasi"
                          ? "bg-yellow-100 text-yellow-800"
                          : order.status === "Dikonfirmasi"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                      Detail Pesanan
                    </h4>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">
                        Game: {order.product.game}
                      </p>
                      <p className="text-sm text-gray-600">
                        Quantity: {order.product.quantity}
                      </p>
                      <p className="text-sm text-gray-600">
                        Harga: {order.price}
                      </p>
                      <p className="text-sm text-gray-600">
                        Metode Pembayaran: {order.paymentMethod}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                      Detail Pelanggan
                    </h4>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">
                        Nama: {order.customer.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        Email: {order.customer.email}
                      </p>
                      <p className="text-sm text-gray-600">
                        ID: {order.customer.id}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">
                    Bukti Pembayaran
                  </h4>
                  <img
                    src={order.paymentProof}
                    alt="Payment Proof"
                    className="w-full max-w-md rounded-lg"
                  />
                </div>

                {order.status === "Menunggu Konfirmasi" && (
                  <div className="mt-6 flex gap-4">
                    <button
                      onClick={() => handleConfirmOrder(order)}
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-5 h-5" />
                      Konfirmasi Pesanan
                    </button>
                    <button
                      onClick={() => handleRejectOrder(order)}
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center gap-2"
                    >
                      <XCircle className="w-5 h-5" />
                      Tolak Pesanan
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Confirmation Modal */}
        {showConfirmModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="w-6 h-6 text-green-500" />
                <h3 className="text-lg font-medium text-gray-900">
                  Konfirmasi Pesanan
                </h3>
              </div>
              <p className="text-gray-600 mb-6">
                Apakah Anda yakin ingin mengkonfirmasi pesanan ini? Pesanan akan
                diproses dan pelanggan akan diberitahu.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  onClick={confirmOrder}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Konfirmasi
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Rejection Modal */}
        {showRejectModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="w-6 h-6 text-red-500" />
                <h3 className="text-lg font-medium text-gray-900">
                  Tolak Pesanan
                </h3>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alasan Penolakan
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  rows={4}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Berikan alasan penolakan pesanan..."
                />
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowRejectModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  onClick={rejectOrder}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  disabled={!rejectReason.trim()}
                >
                  Tolak Pesanan
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ConfirmAccounts;
