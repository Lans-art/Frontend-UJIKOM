import React, { useState, useEffect } from "react";
import { Shield, Info, ArrowLeft, CreditCard, Wallet } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Link, useLocation } from "react-router-dom";
import Header from "./ComponentHome/Header";

function Checkout() {
  const navigate = useNavigate();
  const [selectedPayment, setSelectedPayment] = useState(""); // Track selected payment method
  const [paymentCategory, setPaymentCategory] = useState("e-wallet"); // Track payment category: 'e-wallet' or 'bank'
  const [premiumService, setPremiumService] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [note, setNote] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Load checkoutItems instead of cartItems
    const storedCartItems =
      JSON.parse(localStorage.getItem("checkoutItems")) || [];
    const storedNote = localStorage.getItem("orderNote") || "";

    setCartItems(storedCartItems);
    setNote(storedNote);
    setIsLoading(false);

    if (storedCartItems.length === 0) {
      navigate("/cart");
    }

    // Initialize Midtrans snap if needed
    const script = document.createElement("script");
    script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
    script.setAttribute("data-client-key", "YOUR_MIDTRANS_CLIENT_KEY");
    document.body.appendChild(script);

    return () => {
      // Clean up script when component unmounts
      document.body.removeChild(script);
    };
  }, [navigate]);

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.discount || item.price;
      return total + price * item.quantity;
    }, 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const premiumFee = premiumService ? 5000 : 0;
    // Admin fee is now determined by the selected payment method, not a fixed value
    return subtotal + premiumFee;
  };

  const selectPaymentMethod = (method) => {
    setSelectedPayment(method);
  };

  const selectPaymentCategory = (category) => {
    setPaymentCategory(category);
    setSelectedPayment(""); // Reset selected payment when changing categories
  };

  const getPaymentOptions = () => {
    if (paymentCategory === "e-wallet") {
      return [
        { id: "dana", name: "DANA", fee: 0 },
        { id: "gopay", name: "GoPay", fee: 0 },
        { id: "ovo", name: "OVO", fee: 0 },
        { id: "shopeepay", name: "ShopeePay", fee: 0 },
      ];
    } else if (paymentCategory === "bank") {
      return [
        { id: "bca", name: "Bank BCA", fee: 4000 },
        { id: "bni", name: "Bank BNI", fee: 4000 },
        { id: "mandiri", name: "Bank Mandiri", fee: 4000 },
        { id: "bsi", name: "Bank Syariah Indonesia", fee: 4000 },
      ];
    } else if (paymentCategory === "qris") {
      return [{ id: "qris", name: "QRIS - QR CODE", fee: 800 }];
    }
    return [];
  };

  const getSelectedPaymentFee = () => {
    if (!selectedPayment) return 0;
    const selectedOption = getPaymentOptions().find(
      (opt) => opt.id === selectedPayment,
    );
    return selectedOption ? selectedOption.fee : 0;
  };

  const processPayment = () => {
    if (!selectedPayment) {
      alert("Silakan pilih metode pembayaran terlebih dahulu");
      return;
    }

    // Prepare transaction details for Midtrans
    const transactionDetails = {
      order_id: "ORDER-" + Date.now(),
      gross_amount: calculateTotal() + getSelectedPaymentFee(),
      item_details: cartItems.map((item) => ({
        id: item.id,
        price: item.discount || item.price,
        quantity: item.quantity,
        name: item.title || "Produk",
      })),
      customer_details: {
        first_name: "Customer", // Add user's name if available
        email: "customer@example.com", // Add user's email if available
        phone: "08123456789", // Add user's phone if available
      },
    };

    // If premium service is added
    if (premiumService) {
      transactionDetails.item_details.push({
        id: "premium-service",
        price: 5000,
        quantity: 1,
        name: "Layanan Premium",
      });
    }

    // Add payment fee if any
    const paymentFee = getSelectedPaymentFee();
    if (paymentFee > 0) {
      transactionDetails.item_details.push({
        id: "payment-fee",
        price: paymentFee,
        quantity: 1,
        name: "Biaya Pembayaran",
      });
    }

    // Integration with Midtrans
    window.snap.pay(getMidtransToken(transactionDetails), {
      onSuccess: function (result) {
        /* Handle success, save transaction to storage and redirect */
        saveTransactionToHistory(result);
        navigate("/notifikasi");
      },
      onPending: function (result) {
        /* Handle pending, save transaction with pending status */
        saveTransactionToHistory(result, "Menunggu Pembayaran");
        navigate("/notifikasi");
      },
      onError: function (result) {
        /* Handle error */
        alert("Pembayaran gagal: " + result.status_message);
      },
      onClose: function () {
        /* Handle customer closing the popup without finishing payment */
        alert("Pembayaran dibatalkan");
      },
    });
  };

  // Mock function to get Midtrans token - in real implementation, you'd get this from your backend
  const getMidtransToken = (transactionDetails) => {
    // This is just a mock - in a real app you would call your backend API
    // Your backend would then call Midtrans API to get a snap token
    console.log("Transaction details sent to backend:", transactionDetails);

    // Return a dummy token for demonstration
    return "dummy-midtrans-token";

    // In real implementation, this would be:
    // 1. Call your backend API with transaction details
    // 2. Backend calls Midtrans API to get a snap token
    // 3. Return that token to the frontend
  };

  const saveTransactionToHistory = (result, status = "Menunggu Dikirim") => {
    // Create a new purchase record to store in purchase history
    const newPurchase = cartItems.map((item) => ({
      id: Date.now() + Math.floor(Math.random() * 1000),
      date: new Date().toLocaleString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      status: status,
      transactionId: result?.transaction_id || "TRX-" + Date.now(),
      product: {
        name: item.title || "Produk",
        game: item.game || "Game",
        image: item.image || item.images?.[0] || "https://placehold.co/60x60",
        quantity: `${item.quantity} Akun`,
      },
      shipping: "Pengiriman INSTAN",
      paymentMethod: selectedPayment,
      features: ["Anti Hackback"],
      price: `Rp. ${(item.discount || item.price).toLocaleString("id-ID")}`,
    }));

    // Get existing purchases or initialize empty array
    const existingPurchases =
      JSON.parse(localStorage.getItem("purchaseHistory")) || [];

    // Add new purchases to history
    const updatedPurchases = [...existingPurchases, ...newPurchase];

    // Save to localStorage
    localStorage.setItem("purchaseHistory", JSON.stringify(updatedPurchases));

    // Clean up cart
    localStorage.removeItem("cartItems");
    localStorage.removeItem("orderNote");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {/* Modern Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate("/cart")}
            className="flex items-center text-gray-700 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span className="font-medium">Kembali ke Keranjang</span>
          </button>
          <div className="text-sm font-medium">
            <Link
              to="/cart"
              className={`text-gray-400 hover:text-blue-600 ${
                location.pathname === "/cart"
                  ? "text-blue-600 pointer-events-none"
                  : ""
              }`}
            >
              Keranjang
            </Link>
            <span className="mx-2 text-gray-300">/</span>
            <Link
              to="/cart/checkout"
              className={`text-gray-400 hover:text-blue-600 ${
                location.pathname === "/cart/checkout"
                  ? "text-blue-600 pointer-events-none"
                  : ""
              }`}
            >
              Checkout
            </Link>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content - Left Side */}
          <div className="lg:col-span-2 space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>

            {/* Products Summary */}
            <div className="bg-white rounded-xl p-6 shadow-sm space-y-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Ringkasan Produk
              </h2>
              <div className="divide-y divide-gray-100">
                {cartItems.map((item) => (
                  <div key={item.id} className="py-4 first:pt-0 last:pb-0">
                    <div className="flex items-start space-x-4">
                      <img
                        src={
                          item.image ||
                          item.images?.[0] ||
                          "/api/placeholder/76/76"
                        }
                        alt={item.title}
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-medium text-gray-900 truncate">
                          {item?.title || "Produk Tanpa Nama"}
                        </h3>
                        <p className="text-sm text-gray-500">{item.game}</p>
                        <div className="mt-2 flex items-center text-sm text-gray-700">
                          <span>Qty: {item.quantity}</span>
                          <span className="mx-2">•</span>
                          <span className="font-medium">
                            Rp{" "}
                            {(item.discount || item.price).toLocaleString(
                              "id-ID",
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {note && (
                <div className="mt-4 bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-blue-900 mb-2">
                    Catatan Pesanan:
                  </h3>
                  <p className="text-sm text-blue-800">{note}</p>
                </div>
              )}
            </div>

            {/* Payment Methods - Visual Separation */}
            <div className="bg-white rounded-xl p-6 shadow-sm space-y-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Metode Pembayaran
              </h2>

              {/* Payment Category Tabs */}
              <div className="flex border-b border-gray-200">
                <button
                  className={`px-4 py-2 font-medium text-sm flex items-center ${
                    paymentCategory === "e-wallet"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-600 hover:text-blue-600"
                  }`}
                  onClick={() => selectPaymentCategory("e-wallet")}
                >
                  <Wallet className="w-4 h-4 mr-2" />
                  E-Wallet
                </button>
                <button
                  className={`px-4 py-2 font-medium text-sm flex items-center ${
                    paymentCategory === "bank"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-600 hover:text-blue-600"
                  }`}
                  onClick={() => selectPaymentCategory("bank")}
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Bank Transfer
                </button>
                <button
                  className={`px-4 py-2 font-medium text-sm flex items-center ${
                    paymentCategory === "qris"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-600 hover:text-blue-600"
                  }`}
                  onClick={() => selectPaymentCategory("qris")}
                >
                  <Shield className="w-4 h-4 mr-2" />
                  QRIS
                </button>
              </div>

              {/* Payment Method Options */}
              <div className="grid grid-cols-2 gap-4">
                {getPaymentOptions().map((option) => (
                  <div
                    key={option.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedPayment === option.id
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 hover:border-blue-300"
                    }`}
                    onClick={() => selectPaymentMethod(option.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center mr-3
                          ${
                            option.id === "dana"
                              ? "bg-blue-100 text-blue-600"
                              : ""
                          }
                          ${
                            option.id === "gopay"
                              ? "bg-green-100 text-green-600"
                              : ""
                          }
                          ${
                            option.id === "ovo"
                              ? "bg-purple-100 text-purple-600"
                              : ""
                          }
                          ${
                            option.id === "shopeepay"
                              ? "bg-orange-100 text-orange-600"
                              : ""
                          }
                          ${
                            option.id === "bca"
                              ? "bg-blue-100 text-blue-800"
                              : ""
                          }
                          ${
                            option.id === "bni"
                              ? "bg-orange-100 text-orange-600"
                              : ""
                          }
                          ${
                            option.id === "mandiri"
                              ? "bg-yellow-100 text-yellow-600"
                              : ""
                          }
                          ${
                            option.id === "bsi"
                              ? "bg-green-100 text-green-600"
                              : ""
                          }
                          ${
                            option.id === "qris" ? "bg-gray-800 text-white" : ""
                          }
                        `}
                        >
                          <span className="font-bold text-sm">
                            {option.id === "dana" && "DANA"}
                            {option.id === "gopay" && "GPAY"}
                            {option.id === "ovo" && "OVO"}
                            {option.id === "shopeepay" && "SPay"}
                            {option.id === "bca" && "BCA"}
                            {option.id === "bni" && "BNI"}
                            {option.id === "mandiri" && "MDR"}
                            {option.id === "bsi" && "BSI"}
                            {option.id === "qris" && "QR"}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {option.name}
                          </h3>
                          {option.fee > 0 && (
                            <p className="text-xs text-gray-500">
                              Biaya: Rp {option.fee.toLocaleString("id-ID")}
                            </p>
                          )}
                          {option.fee === 0 && (
                            <p className="text-xs text-green-600">
                              Tanpa Biaya Admin
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="h-5 w-5 rounded-full border border-gray-300 flex items-center justify-center">
                        {selectedPayment === option.id && (
                          <div className="h-3 w-3 rounded-full bg-blue-600"></div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Payment Instructions */}
              {selectedPayment && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">
                    Informasi Pembayaran
                  </h3>
                  <p className="text-sm text-gray-700">
                    {["bca", "bni", "mandiri", "bsi"].includes(
                      selectedPayment,
                    ) &&
                      "Setelah menekan tombol 'Bayar Sekarang', Anda akan diarahkan ke halaman Midtrans untuk melakukan pembayaran melalui transfer bank."}
                    {["dana", "gopay", "ovo", "shopeepay"].includes(
                      selectedPayment,
                    ) &&
                      `Setelah menekan tombol 'Bayar Sekarang', Anda akan diarahkan ke halaman Midtrans untuk melakukan pembayaran melalui ${
                        selectedPayment === "dana"
                          ? "DANA"
                          : selectedPayment === "gopay"
                          ? "GoPay"
                          : selectedPayment === "ovo"
                          ? "OVO"
                          : "ShopeePay"
                      }.`}
                    {selectedPayment === "qris" &&
                      "Setelah menekan tombol 'Bayar Sekarang', Anda akan diarahkan ke halaman Midtrans untuk melakukan pembayaran melalui QRIS yang dapat dipindai dengan aplikasi e-wallet pilihan Anda."}
                  </p>
                  <div className="mt-2 flex items-center">
                    <img
                      src="/api/placeholder/80/32"
                      alt="Midtrans logo"
                      className="h-6"
                    />
                    <span className="ml-2 text-xs text-gray-500">
                      Powered by Midtrans
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary - Right Side */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24 space-y-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Ringkasan Pembayaran
              </h2>

              <div className="space-y-4">
                <div className="flex justify-between text-gray-600">
                  <span>Total Pesanan</span>
                  <span>Rp {calculateSubtotal().toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Layanan Premium</span>
                  <span>
                    Rp {(premiumService ? 5000 : 0).toLocaleString("id-ID")}
                  </span>
                </div>
                {selectedPayment && getSelectedPaymentFee() > 0 && (
                  <div className="flex justify-between text-gray-600">
                    <div className="flex items-center space-x-1">
                      <span>
                        Biaya{" "}
                        {paymentCategory === "bank" ? "Transfer" : "Pembayaran"}
                      </span>
                      <Info className="w-4 h-4" />
                    </div>
                    <span>
                      Rp {getSelectedPaymentFee().toLocaleString("id-ID")}
                    </span>
                  </div>
                )}
                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-900">
                      Total Pembayaran
                    </span>
                    <span className="text-xl font-bold text-blue-600">
                      Rp{" "}
                      {(
                        calculateTotal() + getSelectedPaymentFee()
                      ).toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={processPayment}
                disabled={!selectedPayment}
                className={`w-full py-4 rounded-xl font-semibold transition-colors ${
                  selectedPayment
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Bayar Sekarang
              </button>

              <div className="text-center space-y-2">
                <p className="text-sm text-gray-500">
                  Pembayaran Dijamin 100% Aman oleh
                </p>
                <div className="flex items-center justify-center space-x-1 text-blue-600">
                  <span className="font-medium">Trade Guard</span>
                  <Shield className="w-4 h-4" />
                </div>
              </div>
            </div>
            {/* Premium Service */}
            <div className="bg-white rounded-xl p-6 shadow-sm mt-8">
              <div className="flex items-start space-x-4">
                <input
                  type="checkbox"
                  checked={premiumService}
                  onChange={() => setPremiumService(!premiumService)}
                  className="mt-1 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Layanan Premium
                    </h3>
                    <span className="text-blue-600 font-medium">Rp 5.000</span>
                  </div>
                  <p className="mt-2 text-sm text-gray-600">
                    Dapatkan prioritas dalam penanganan komplain dan akses ke
                    event promosi eksklusif.
                    <button className="ml-1 text-blue-600 hover:text-blue-700 transition-colors">
                      Pelajari lebih lanjut
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Checkout;
