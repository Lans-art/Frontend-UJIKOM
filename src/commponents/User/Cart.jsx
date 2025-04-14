import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  ShoppingCart,
  Trash2,
  Minus,
  Plus,
  ShieldCheck,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Header from "./ComponentHome/Header";

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [animatingItem, setAnimatingItem] = useState(null);
  const [note, setNote] = useState("");
  const location = useLocation();
  const [checkedItems, setCheckedItems] = useState({});
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      const mockCartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
      setCartItems(mockCartItems);

      // Initialize checkedItems state with all items unchecked
      const initialCheckedState = {};
      mockCartItems.forEach((item) => {
        initialCheckedState[item.id] = false;
      });
      setCheckedItems(initialCheckedState);

      setIsLoading(false);
    }, 500);

    window.addEventListener("add-to-cart", handleAddToCartEvent);
    return () =>
      window.removeEventListener("add-to-cart", handleAddToCartEvent);
  }, []);

  const handleAddToCartEvent = (event) => {
    const { item, quantity } = event.detail;
    addItemToCart(item, quantity);
    setAnimatingItem(item.id);
    setTimeout(() => setAnimatingItem(null), 1000);
  };

  const addItemToCart = (item, quantity) => {
    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (cartItem) => cartItem.id === item.id,
      );
      let newItems;

      if (existingItemIndex >= 0) {
        newItems = [...prevItems];
        newItems[existingItemIndex].quantity += quantity;
      } else {
        newItems = [...prevItems, { ...item, quantity }];
        // Add the new item to checkedItems (unchecked by default)
        setCheckedItems((prev) => ({
          ...prev,
          [item.id]: false,
        }));
      }

      localStorage.setItem("cartItems", JSON.stringify(newItems));
      return newItems;
    });
  };

  const removeItem = (itemId) => {
    setCartItems((prevItems) => {
      const newItems = prevItems.filter((item) => item.id !== itemId);
      localStorage.setItem("cartItems", JSON.stringify(newItems));

      // Also remove from checkedItems
      setCheckedItems((prev) => {
        const newChecked = { ...prev };
        delete newChecked[itemId];
        return newChecked;
      });

      return newItems;
    });
  };

  const updateQuantity = (itemId, delta) => {
    setCartItems((prevItems) => {
      const newItems = prevItems.map((item) => {
        if (item.id === itemId) {
          const newQuantity = item.quantity + delta;
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
        }
        return item;
      });
      localStorage.setItem("cartItems", JSON.stringify(newItems));
      return newItems;
    });
  };

  const toggleItemCheck = (itemId) => {
    setCheckedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const toggleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);

    // Update all items to match the selectAll state
    const newCheckedItems = {};
    cartItems.forEach((item) => {
      newCheckedItems[item.id] = newSelectAll;
    });
    setCheckedItems(newCheckedItems);
  };

  const getCheckedItems = () => {
    return cartItems.filter((item) => checkedItems[item.id]);
  };

  const calculateSubtotal = () => {
    const checked = getCheckedItems();
    return checked.reduce((total, item) => {
      const price = item.discount || item.price;
      return total + price * item.quantity;
    }, 0);
  };

  const proceedToCheckout = () => {
    const checkedItemsArray = getCheckedItems();

    if (checkedItemsArray.length === 0) {
      alert("Silakan pilih setidaknya satu produk untuk dibeli");
      return;
    }

    // Save only checked items for checkout
    localStorage.setItem("checkoutItems", JSON.stringify(checkedItemsArray));

    navigate("/cart/checkout");
  };

  // Check if all items are selected to update selectAll state
  useEffect(() => {
    if (cartItems.length === 0) {
      setSelectAll(false);
      return;
    }

    const allChecked = cartItems.every((item) => checkedItems[item.id]);
    setSelectAll(allChecked);
  }, [checkedItems, cartItems]);

  if (isLoading) {
    return (
      <>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {/* Modern Navigation */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate("/accountgames")}
            className="flex items-center text-gray-700 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span className="font-medium">Kembali</span>
          </button>
          <div className="text-sm font-medium">
            <Link
              to="/keranjang"
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

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">
                Keranjang Belanja
              </h1>
              <span className="text-sm text-gray-500">
                {cartItems.length} Produk
              </span>
            </div>

            {/* Select All & Clear Cart */}
            {cartItems.length > 0 && (
              <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={toggleSelectAll}
                    className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-700 font-medium">Pilih Semua</span>
                </div>
                <button
                  onClick={() => {
                    setCartItems([]);
                    setCheckedItems({});
                    localStorage.removeItem("cartItems");
                  }}
                  className="text-red-500 hover:text-red-600 font-medium transition-colors"
                >
                  Hapus Semua
                </button>
              </div>
            )}

            {/* Cart Items */}
            {cartItems.length === 0 ? (
              <div className="bg-white rounded-xl p-8 text-center shadow-sm">
                <div className="w-24 h-24 mx-auto mb-6 text-gray-300">
                  <ShoppingCart className="w-full h-full" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Keranjang Anda Kosong
                </h3>
                <p className="text-gray-500 mb-6">
                  Mulai belanja dan temukan produk yang Anda inginkan
                </p>
                <button
                  onClick={() => navigate("/accountgames")}
                  className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Mulai Belanja
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className={`bg-white rounded-xl p-4 shadow-sm transition-all duration-300 ${
                      animatingItem === item.id ? "scale-105" : ""
                    }`}
                  >
                    <div className="flex items-start space-x-4">
                      <input
                        type="checkbox"
                        checked={checkedItems[item.id] || false}
                        onChange={() => toggleItemCheck(item.id)}
                        className="mt-2 w-5 h-5 rounded text-blue-600 focus:ring-blue-500"
                      />

                      <img
                        src={
                          item.image ||
                          item.images?.[0] ||
                          "/api/placeholder/76/76"
                        }
                        alt={item.title}
                        className="w-20 h-20 rounded-lg object-cover"
                      />

                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3
                              className="font-medium text-gray-900 hover:text-blue-600 cursor-pointer"
                              onClick={() =>
                                item?.id && navigate(`/product/${item.id}`)
                              }
                            >
                              {item?.title || "Produk Tanpa Nama"}
                            </h3>
                            <p className="text-gray-500 text-sm mt-1">
                              {item.game}
                            </p>
                          </div>
                          <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
                            Anti Hackback
                          </span>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                          <div className="space-y-1">
                            <span className="text-lg font-bold text-gray-900">
                              Rp{" "}
                              {(item.discount || item.price).toLocaleString(
                                "id-ID",
                              )}
                            </span>
                            {item.discount && (
                              <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-500 line-through">
                                  Rp {item.price.toLocaleString("id-ID")}
                                </span>
                                <span className="text-sm text-green-600">
                                  -
                                  {Math.round(
                                    ((item.price - item.discount) /
                                      item.price) *
                                      100,
                                  )}
                                  %
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center space-x-4">
                            <span className="text-red-500 border border-red-500 rounded px-2 py-1 text-sm">
                              Stok: {item.stock}
                            </span>

                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>

                            <div className="flex items-center border rounded-lg bg-gray-50">
                              <button
                                onClick={() => updateQuantity(item.id, -1)}
                                className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-blue-600 disabled:opacity-50"
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="w-12 text-center font-medium">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, 1)}
                                className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-blue-600 disabled:opacity-50"
                                disabled={item.quantity >= (item.stock || 99)}
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Order Note */}
            {cartItems.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Catatan Pesanan
                </h2>
                <textarea
                  placeholder="Tambahkan catatan untuk penjual (Opsional)"
                  className="w-full border border-gray-200 rounded-lg p-4 h-24 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                ></textarea>
              </div>
            )}
          </div>

          {/* Order Summary */}
          {cartItems.length > 0 && (
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Ringkasan Pesanan
                </h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Total Produk</span>
                    <span>{getCheckedItems().length} item</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-900">
                        Total Pembayaran
                      </span>
                      <span className="text-xl font-bold text-blue-600">
                        Rp {calculateSubtotal().toLocaleString("id-ID")}
                      </span>
                    </div>
                  </div>
                </div>

                {calculateSubtotal() > 10000000 && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
                    Maksimal pembelian Rp 10.000.000
                  </div>
                )}

                <button
                  onClick={proceedToCheckout}
                  className="w-full bg-blue-600 text-white rounded-lg py-4 font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                  disabled={
                    getCheckedItems().length === 0 ||
                    calculateSubtotal() > 10000000
                  }
                >
                  Lanjutkan ke Pembayaran
                </button>

                <div className="mt-4 flex items-center justify-center text-sm text-gray-500">
                  <ShieldCheck className="w-4 h-4 mr-2" />
                  Pembayaran Aman & Terenkripsi
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Cart;
