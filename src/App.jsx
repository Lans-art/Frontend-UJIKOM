import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UserProvider } from "./context/UserContext"; // ✅ Tambahkan ini

import LandingPage from "./commponents/LandingPage";

/* Halaman Admin */
import AdminPage from "./commponents/Admin/AdminPage";
import Dashboard from "./commponents/Admin/Dashboard";
import Chat from "./commponents/Admin/Chat";
import DataGameAccount from "./commponents/Admin/DataGameAccount";
import ConfirmAccounts from "./commponents/Admin/ConfirmAccounts";
import DataArticle from "./commponents/Admin/DataArticle";
import History from "./commponents/Admin/History";
import AdminProfile from "./commponents/Admin/Profile";

/* Halaman User */
import HomePage from "./commponents/User/HomePage";
import AccountGames from "./commponents/User/AccountGames";
import ProductDetail from "./commponents/User/ProductDetail";
import Cart from "./commponents/User/Cart";
import Checkout from "./commponents/User/Checkout";
import Notifikasi from "./commponents/User/Notifikasi";
import UserProfile from "./commponents/User/Profile";

/* Protected Route */
import ProtectedRoute from "./context/ProtectedRoute";


const App = () => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        {" "}
        {/* ✅ Bungkus seluruh aplikasi di sini */}
        <Routes>
          <Route path="/" element={<LandingPage />} />

          {/* Proteksi halaman admin */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminPage />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="chat" element={<Chat />} />
              <Route path="dataartikel" element={<DataArticle />} />
              <Route path="dataaccount" element={<DataGameAccount />} />
              <Route path="confirmaccount" element={<ConfirmAccounts />} />
              <Route path="history" element={<History />} />
              <Route path="admin/profile" element={<AdminProfile />} />
            </Route>

          {/* Proteksi halaman user */}
          <Route
            path="/home"
            element={
              <ProtectedRoute allowedRoles={["user"]}>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/accountgames"
            element={
              <ProtectedRoute allowedRoles={["user"]}>
                <AccountGames />
              </ProtectedRoute>
            }
          />
          <Route
            path="/product/:id"
            element={
              <ProtectedRoute allowedRoles={["user"]}>
                <ProductDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRoute allowedRoles={["user"]}>
                <Cart />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cart/checkout"
            element={
              <ProtectedRoute allowedRoles={["user"]}>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifikasi"
            element={
              <ProtectedRoute allowedRoles={["user"]}>
                <Notifikasi />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute allowedRoles={["user"]}>
                <UserProfile />
              </ProtectedRoute>
            }
          />
        </Routes>
      </UserProvider>
    </QueryClientProvider>
  );
};

export default App;
