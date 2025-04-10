import React, { useState, useEffect } from "react";
import Header from "./ComponentHome/Header";
import { ArrowLeft, Calendar, ChevronDown, Search, Truck, X, AlertCircle, CreditCard } from "lucide-react";

const tabs = [
  "Semua",
  "Menunggu Dikirim",
  "Selesai",
  "Pembatalan Pesanan",
  "Dana Dikembalikan",
];

function Notifikasi() {
  const [activeTab, setActiveTab] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [purchases, setPurchases] = useState([]);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [currentPurchase, setCurrentPurchase] = useState(null);
  const [cancelSuccess, setCancelSuccess] = useState(false);
  const [refundSuccess, setRefundSuccess] = useState(false);
  const [selectedRefundMethod, setSelectedRefundMethod] = useState("");

  const defaultPurchases = [
    {
      id: 1,
      status: "Menunggu Dikirim",
      date: "12 Maret 2025",
      product: {
        name: "Diamond Mobile Legends",
        game: "Mobile Legends",
        quantity: "100 Diamond",
        image: "/api/placeholder/100/100"
      },
      shipping: "Pengiriman Instan",
      features: ["Promo", "Cashback"],
      price: "Rp 50.000"
    }
  ];

  const refundMethods = [
    {
      id: "wallet",
      name: "E-Wallet",
      description: "Dana dikembalikan ke e-wallet Anda dalam 1x24 jam"
    },
    {
      id: "bank",
      name: "Transfer Bank",
      description: "Dana dikembalikan ke rekening bank Anda dalam 2-3 hari kerja"
    },
    {
      id: "credit",
      name: "Kredit Akun",
      description: "Dana dikembalikan sebagai kredit untuk pembelian berikutnya"
    }
  ];

  useEffect(() => {
    const storedPurchases = JSON.parse(
      localStorage.getItem("purchaseHistory") || "[]",
    );
    setPurchases(
      storedPurchases.length > 0 ? storedPurchases : defaultPurchases,
    );
  }, []);

  useEffect(() => {
    if (purchases.length > 0) {
      localStorage.setItem("purchaseHistory", JSON.stringify(purchases));
    }
  }, [purchases]);

  const filteredPurchases = purchases.filter((purchase) => {
    const matchesTab = activeTab === "Semua" || purchase.status === activeTab;
    const matchesSearch = purchase.product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleCancelOrder = (purchase) => {
    setCurrentPurchase(purchase);
    setShowCancelModal(true);
  };

  const confirmCancelOrder = () => {
    if (!cancelReason.trim()) {
      return; // Prevent submission without reason
    }

    const updatedPurchases = purchases.map((purchase) => {
      if (purchase.id === currentPurchase.id) {
        return {
          ...purchase,
          status: "Pembatalan Pesanan",
          cancelReason: cancelReason,
          cancelDate: new Date().toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          }),
          needsRefund: true
        };
      }
      return purchase;
    });

    setPurchases(updatedPurchases);
    setShowCancelModal(false);
    setCancelReason("");
    setCancelSuccess(true);
    
    // Show refund modal after cancellation
    setTimeout(() => {
      setCancelSuccess(false);
      setShowRefundModal(true);
    }, 1500);
  };

  const processRefund = () => {
    if (!selectedRefundMethod) {
      return; // Prevent submission without refund method
    }

    const updatedPurchases = purchases.map((purchase) => {
      if (purchase.id === currentPurchase.id) {
        return {
          ...purchase,
          status: "Dana Dikembalikan",
          refundMethod: selectedRefundMethod,
          refundDate: new Date().toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          }),
          needsRefund: false,
          refundStatus: "Sedang Diproses",
          estimatedRefundDate: getEstimatedRefundDate(selectedRefundMethod)
        };
      }
      return purchase;
    });

    setPurchases(updatedPurchases);
    setShowRefundModal(false);
    setSelectedRefundMethod("");
    setRefundSuccess(true);
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      setRefundSuccess(false);
    }, 3000);
  };

  const getEstimatedRefundDate = (method) => {
    const today = new Date();
    let estimatedDate = new Date();
    
    if (method === "wallet") {
      estimatedDate.setDate(today.getDate() + 1);
    } else if (method === "bank") {
      estimatedDate.setDate(today.getDate() + 3);
    } else {
      estimatedDate = today;
    }
    
    return estimatedDate.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const canCancel = (status) => {
    return status === "Menunggu Dikirim";
  };

  const canRequestRefund = (purchase) => {
    return purchase.status === "Pembatalan Pesanan" && purchase.needsRefund;
  };

  const cancelReasons = [
    "Ingin mengubah pesanan",
    "Menemukan harga lebih murah",
    "Salah pilih produk",
    "Berubah pikiran",
    "Lainnya"
  ];

  const handleRefundRequest = (purchase) => {
    setCurrentPurchase(purchase);
    setShowRefundModal(true);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        {/* Success Messages */}
        {cancelSuccess && (
          <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded z-50 flex items-center shadow-lg">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">Pesanan berhasil dibatalkan</p>
            </div>
          </div>
        )}

        {refundSuccess && (
          <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded z-50 flex items-center shadow-lg">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">Permintaan pengembalian dana sedang diproses</p>
            </div>
          </div>
        )}

        {/* Cancel Order Modal */}
        {showCancelModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-xl max-w-md w-full shadow-xl">
              <div className="p-5 border-b flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Batalkan Pesanan</h3>
                <button 
                  onClick={() => setShowCancelModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-5">
                <div className="flex gap-4 mb-5 pb-5 border-b">
                  <img
                    src={currentPurchase?.product.image}
                    alt={currentPurchase?.product.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div>
                    <h4 className="font-medium">{currentPurchase?.product.name}</h4>
                    <p className="text-sm text-gray-600">{currentPurchase?.product.game}</p>
                    <p className="text-sm text-gray-600">{currentPurchase?.product.quantity}</p>
                  </div>
                </div>
                
                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alasan Pembatalan
                  </label>
                  <div className="space-y-2">
                    {cancelReasons.map((reason, index) => (
                      <div 
                        key={index}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          cancelReason === reason ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setCancelReason(reason)}
                      >
                        <div className="flex items-center">
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            cancelReason === reason ? 'border-orange-500' : 'border-gray-400'
                          }`}>
                            {cancelReason === reason && <div className="w-2 h-2 rounded-full bg-orange-500"></div>}
                          </div>
                          <span className="ml-3 text-sm">{reason}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {cancelReason === "Lainnya" && (
                  <div className="mb-5">
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      rows="3"
                      placeholder="Berikan alasan lain..."
                      onChange={(e) => setCancelReason(e.target.value)}
                    ></textarea>
                  </div>
                )}

                <div className="p-3 bg-blue-50 rounded-lg mb-5">
                  <p className="text-sm text-blue-700">
                    <span className="font-medium">Catatan:</span> Setelah pembatalan, Anda akan diminta untuk memilih metode pengembalian dana.
                  </p>
                </div>

                <div className="flex gap-3 mt-5">
                  <button
                    className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                    onClick={() => setShowCancelModal(false)}
                  >
                    Kembali
                  </button>
                  <button
                    className={`flex-1 px-4 py-2.5 rounded-xl font-medium transition-colors ${
                      cancelReason ? 'bg-orange-500 text-white hover:bg-orange-600' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                    onClick={confirmCancelOrder}
                    disabled={!cancelReason}
                  >
                    Batalkan Pesanan
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Refund Modal */}
        {showRefundModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-xl max-w-md w-full shadow-xl">
              <div className="p-5 border-b flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Pengembalian Dana</h3>
                <button 
                  onClick={() => setShowRefundModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-5">
                <div className="flex gap-4 mb-5 pb-5 border-b">
                  <img
                    src={currentPurchase?.product.image}
                    alt={currentPurchase?.product.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div>
                    <h4 className="font-medium">{currentPurchase?.product.name}</h4>
                    <p className="text-sm text-gray-600">{currentPurchase?.product.game}</p>
                    <p className="text-orange-500 font-medium">{currentPurchase?.price}</p>
                  </div>
                </div>
                
                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pilih Metode Pengembalian Dana
                  </label>
                  <div className="space-y-3">
                    {refundMethods.map((method) => (
                      <div 
                        key={method.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedRefundMethod === method.id ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedRefundMethod(method.id)}
                      >
                        <div className="flex items-center">
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            selectedRefundMethod === method.id ? 'border-orange-500' : 'border-gray-400'
                          }`}>
                            {selectedRefundMethod === method.id && <div className="w-2 h-2 rounded-full bg-orange-500"></div>}
                          </div>
                          <div className="ml-3">
                            <span className="text-sm font-medium">{method.name}</span>
                            <p className="text-xs text-gray-500 mt-1">{method.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 mt-5">
                  <button
                    className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                    onClick={() => setShowRefundModal(false)}
                  >
                    Nanti Saja
                  </button>
                  <button
                    className={`flex-1 px-4 py-2.5 rounded-xl font-medium transition-colors ${
                      selectedRefundMethod ? 'bg-orange-500 text-white hover:bg-orange-600' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                    onClick={processRefund}
                    disabled={!selectedRefundMethod}
                  >
                    Proses Pengembalian
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="bg-white rounded-t-xl shadow-sm mt-4">
          <div className="flex items-center gap-4 p-4 border-b">
            <button
              className="text-gray-700 hover:text-gray-900 transition-colors duration-200"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-semibold text-gray-900">
              Riwayat Pembelian
            </h1>
            <button className="ml-auto text-gray-700 hover:text-gray-900 transition-colors duration-200">
              <Calendar className="w-6 h-6" />
            </button>
          </div>

          {/* Tabs */}
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex whitespace-nowrap px-4 gap-6">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  className={`py-4 px-1 relative transition-colors duration-200 ${
                    activeTab === tab
                      ? "text-indigo-600 font-medium"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mt-4 space-y-4">
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari nama produk"
              className="w-full px-4 py-3 pl-10 bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-3">
            <button className="px-4 py-2.5 bg-white rounded-xl border border-gray-200 text-sm font-medium flex items-center gap-2 hover:bg-gray-50 transition-colors duration-200">
              Game
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Purchase History */}
        <div className="mt-4 space-y-4 pb-8">
          {filteredPurchases.length > 0 ? (
            filteredPurchases.map((purchase) => (
              <div
                key={purchase.id}
                className="bg-white rounded-xl shadow-sm overflow-hidden transition-transform duration-200 hover:scale-[1.02]"
              >
                {/* Status Header */}
                <div
                  className={`p-4 ${
                    purchase.status === "Selesai"
                      ? "bg-green-50 text-green-700"
                      : purchase.status === "Pembatalan Pesanan"
                      ? "bg-red-50 text-red-700"
                      : purchase.status === "Dana Dikembalikan"
                      ? "bg-yellow-50 text-yellow-700"
                      : "bg-blue-50 text-blue-700"
                  } text-sm font-medium`}
                >
                  {purchase.status}
                </div>

                {/* Purchase Details */}
                <div className="p-4">
                  <div className="text-sm text-gray-500 mb-4 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {purchase.date}
                  </div>

                  <div className="flex gap-4">
                    <img
                      src={purchase.product.image}
                      alt={purchase.product.name}
                      className="w-24 h-24 rounded-xl object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-lg mb-1">
                        {purchase.product.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {purchase.product.game}
                      </p>
                      <p className="text-sm text-gray-600">
                        {purchase.product.quantity}
                      </p>
                    </div>
                  </div>

                  {/* Cancellation Reason (if cancelled) */}
                  {purchase.status === "Pembatalan Pesanan" && purchase.cancelReason && (
                    <div className="mt-3 p-3 bg-red-50 rounded-lg flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-red-700">Alasan Pembatalan:</p>
                        <p className="text-sm text-red-600">{purchase.cancelReason}</p>
                        <p className="text-xs text-gray-500 mt-1">Dibatalkan pada {purchase.cancelDate}</p>
                      </div>
                    </div>
                  )}

                  {/* Refund Info (if refunded) */}
                  {purchase.status === "Dana Dikembalikan" && (
                    <div className="mt-3 p-3 bg-yellow-50 rounded-lg flex items-start gap-2">
                      <CreditCard className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-yellow-700">Status Pengembalian Dana:</p>
                        <p className="text-sm text-yellow-600">{purchase.refundStatus}</p>
                        <p className="text-xs text-gray-500 mt-1">Metode: {refundMethods.find(m => m.id === purchase.refundMethod)?.name}</p>
                        <p className="text-xs text-gray-500">Estimasi selesai: {purchase.estimatedRefundDate}</p>
                      </div>
                    </div>
                  )}

                  {/* Shipping & Features */}
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Truck className="w-5 h-5 text-green-600" />
                      {purchase.shipping}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {purchase.features.map((feature, index) => (
                        <span
                          key={index}
                          className="px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-sm font-medium"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Price & Action */}
                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <div className="text-sm text-gray-500">
                        Total Pembelian
                      </div>
                      <div className="text-orange-500 font-semibold text-lg">
                        {purchase.price}
                      </div>
                    </div>
                    <div className="flex gap-3">
                      {canCancel(purchase.status) && (
                        <button 
                          className="px-6 py-2.5 border-2 border-red-500 text-red-500 rounded-xl font-medium hover:bg-red-50 transition-colors duration-200"
                          onClick={() => handleCancelOrder(purchase)}
                        >
                          Batalkan
                        </button>
                      )}
                      {canRequestRefund(purchase) && (
                        <button 
                          className="px-6 py-2.5 border-2 border-yellow-500 text-yellow-500 rounded-xl font-medium hover:bg-yellow-50 transition-colors duration-200"
                          onClick={() => handleRefundRequest(purchase)}
                        >
                          Kembalikan Dana
                        </button>
                      )}
                      <button className="px-6 py-2.5 border-2 border-orange-500 text-orange-500 rounded-xl font-medium hover:bg-orange-50 transition-colors duration-200">
                        Beli Lagi
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-xl p-8 text-center shadow-sm">
              <div className="max-w-sm mx-auto">
                <Search className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Belum ada pembelian
                </h3>
                <p className="text-gray-500 mb-6">
                  Riwayat pembelian Anda akan muncul di sini
                </p>
                <button className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors duration-200">
                  Cari Produk
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Notifikasi;