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
import Header from "./Components/Header";
import axiosInstance, { endpoints } from "../../../axios";

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [animatingItem, setAnimatingItem] = useState(null);
  const [note, setNote] = useState("");
  const location = useLocation();
  const [checkedItems, setCheckedItems] = useState({});
  const [selectAll, setSelectAll] = useState(false);
  const dispatchCartUpdateEvent = () => {
    // Create and dispatch a custom event that Header will listen for
    const event = new CustomEvent("cart-updated", {
      detail: { timestamp: new Date().getTime() },
    });
    window.dispatchEvent(event);
  };

  // Fetch cart items from Laravel backend
  const fetchCartItems = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(endpoints.cart.cart);
      const items = response.data;

      // Transform data untuk memastikan konsistensi field dan pilih harga yang benar
      const transformedItems = items.map((item) => {
        if (item.sellaccount) {
          const sell = item.sellaccount;

          // Jika hanya ada "discount", ubah jadi "discount_price"
          if (sell.discount && !sell.discount_price) {
            sell.discount_price = sell.discount;
          }

          // Tambahkan field baru "final_price" untuk memudahkan di UI
          sell.final_price = sell.discount_price ?? sell.price;
        }

        return item;
      });

      console.log("Cart data from API:", transformedItems);
      setCartItems(transformedItems);

      // (Opsional) Inisialisasi checked items
      const initialCheckedState = {};
      transformedItems.forEach((item) => {
        initialCheckedState[item.id] = false;
      });
      setCheckedItems(initialCheckedState);

      setIsLoading(false);
    } catch (error) {
      console.error("Failed to fetch cart items:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCartItems();

    window.addEventListener("add-to-cart", handleAddToCartEvent);
    return () =>
      window.removeEventListener("add-to-cart", handleAddToCartEvent);
  }, []);

  const handleAddToCartEvent = async (event) => {
    const { item, quantity } = event.detail;
    await addItemToCart(item, quantity);
    setAnimatingItem(item.id);
    setTimeout(() => setAnimatingItem(null), 1000);
  };

  const addItemToCart = async (item, quantity) => {
    try {
      await axiosInstance.post(endpoints.cart.cart, {
        sellaccount_id: item.id,
        quantity: quantity,
      });

      // Refresh cart data
      fetchCartItems();
    } catch (error) {
      console.error("Failed to add item to cart:", error);
    }
  };

  const removeItem = async (itemId) => {
    try {
      await axiosInstance.delete(`${endpoints.cart.cart}/${itemId}`);

      // Update local state
      setCartItems((prevItems) => {
        const newItems = prevItems.filter((item) => item.id !== itemId);

        // Also remove from checkedItems
        setCheckedItems((prev) => {
          const newChecked = { ...prev };
          delete newChecked[itemId];
          return newChecked;
        });

        return newItems;
      });

      // Dispatch event to update cart count in header
      dispatchCartUpdateEvent();
    } catch (error) {
      console.error("Failed to remove item from cart:", error);
    }
  };

  const updateQuantity = async (itemId, delta) => {
    const item = cartItems.find((item) => item.id === itemId);
    if (!item) return;

    const newQuantity = item.quantity + delta;
    if (newQuantity <= 0) return;

    try {
      // Make sure to send the price information when updating quantity
      const priceToUse =
        item.sellaccount.discount_price || item.sellaccount.price;

      await axiosInstance.put(`${endpoints.cart.cart}/${itemId}`, {
        quantity: newQuantity,
        price: priceToUse,
      });

      // Update local state for immediate feedback
      setCartItems((prevItems) => {
        return prevItems.map((item) => {
          if (item.id === itemId) {
            return { ...item, quantity: newQuantity };
          }
          return item;
        });
      });
    } catch (error) {
      console.error("Failed to update item quantity:", error);
    }
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
      // Make sure we access sellaccount safely
      if (!item.sellaccount) return total;

      const price = item.sellaccount.discount_price || item.sellaccount.price;
      return total + price * item.quantity;
    }, 0);
  };

  const proceedToCheckout = () => {
    const checkedItemsArray = getCheckedItems();

    if (checkedItemsArray.length === 0) {
      alert("Silakan pilih setidaknya satu produk untuk dibeli");
      return;
    }

    // Store checked items in session storage for checkout page
    sessionStorage.setItem("checkoutItems", JSON.stringify(checkedItemsArray));
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

  const clearCart = async () => {
    try {
      // Remove all items from cart
      const deletePromises = cartItems.map((item) =>
        axiosInstance.delete(`${endpoints.cart.cart}/${item.id}`),
      );

      await Promise.all(deletePromises);

      // Update local state
      setCartItems([]);
      setCheckedItems({});
    } catch (error) {
      console.error("Failed to clear cart:", error);
    }
  };

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
                location.pathname === "/cart" ||
                location.pathname === "/keranjang"
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
                  onClick={clearCart}
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
                {cartItems.map((item) => {
                  // Check if sellaccount exists before rendering
                  if (!item.sellaccount) {
                    console.error("Missing sellaccount data for item:", item);
                    return null;
                  }

                  const sellaccount = item.sellaccount;
                  return (
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
                            sellaccount.image ||
                            (sellaccount.images && sellaccount.images[0]) ||
                            "/api/placeholder/76/76"
                          }
                          alt={sellaccount.title}
                          className="w-20 h-20 rounded-lg object-cover"
                        />

                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3
                                className="font-medium text-gray-900 hover:text-blue-600 cursor-pointer"
                                onClick={() =>
                                  sellaccount?.id &&
                                  navigate(`/product/${sellaccount.id}`)
                                }
                              >
                                {sellaccount?.title || "Produk Tanpa Nama"}
                              </h3>
                              <p className="text-gray-500 text-sm mt-1">
                                {sellaccount.game}
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
                                {(
                                  sellaccount.discount || sellaccount.price
                                ).toLocaleString("id-ID")}
                              </span>
                              {sellaccount.discount && (
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm text-gray-500 line-through">
                                    Rp{" "}
                                    {sellaccount.price.toLocaleString("id-ID")}
                                  </span>
                                  <span className="text-sm text-green-600">
                                    -
                                    {Math.round(
                                      ((sellaccount.price -
                                        sellaccount.discount) /
                                        sellaccount.price) *
                                        100,
                                    )}
                                    %
                                  </span>
                                </div>
                              )}
                            </div>

                            <div className="flex items-center space-x-4">
                              <span className="text-red-500 border border-red-500 rounded px-2 py-1 text-sm">
                                Stok: {sellaccount.stock}
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
                                  disabled={
                                    item.quantity >= (sellaccount.stock || 99)
                                  }
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
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
