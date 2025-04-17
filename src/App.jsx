import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UserProvider } from "./context/UserContext"; // ✅ Tambahkan ini

import LandingPage from "./commponents/LandingPage";

/* Halaman Admin */
import AdminPage from "./commponents/Admin/AdminPage";
import Dashboard from "./commponents/Admin/Dashboard";
import DataGameAccount from "./commponents/Admin/DataGameAccount";
import ConfirmAccounts from "./commponents/Admin/ConfirmAccounts";
import DataArticle from "./commponents/Admin/DataArticle";
import History from "./commponents/Admin/History";
import AdminProfile from "./commponents/Admin/Profile";

/* Halaman User */
import UserLayout from "./commponents/User/UserLayout";
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
          {/* Admin routes - corrected */}
          <Route
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminPage />
              </ProtectedRoute>
            }
          >
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/admin/dataartikel" element={<DataArticle />} />
            <Route path="/admin/dataaccount" element={<DataGameAccount />} />
            <Route path="/admin/confirmaccount" element={<ConfirmAccounts />} />
            <Route path="/admin/history" element={<History />} />
          </Route>
          <Route
            path="/profil"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminProfile />
              </ProtectedRoute>
            }
          />

          {/* Proteksi halaman user */}
          <Route
            element={
              <ProtectedRoute allowedRoles={["user"]}>
                <UserLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/home" element={<HomePage />} />
            <Route path="/accountgames" element={<AccountGames />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/cart/checkout" element={<Checkout />} />
            <Route path="/notifikasi" element={<Notifikasi />} />
          </Route>
          <Route
            path="/product/:id"
            element={
              <ProtectedRoute allowedRoles={["user"]}>
                <ProductDetail />
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
