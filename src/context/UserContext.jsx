// src/context/UserContext.js
import React, { createContext, useState, useEffect, useContext } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import axiosInstance, { endpoints } from "../../axios";

// Create context
const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState({
    token: null,
    role: null,
    name: null,
    email: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Initialize user data from cookies
  useEffect(() => {
    const token = Cookies.get("token");
    const role = Cookies.get("role");
    const name = Cookies.get("name");

    console.log(token, role, name);

    if (token && role) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // Jangan langsung set userData lengkap, biarkan fetchUserData yang atur
      setUserData((prev) => ({
        ...prev,
        token,
        role,
        name,
        isAuthenticated: true,
      }));

      fetchUserData(token);
    } else {
      setUserData({
        token: null,
        role: null,
        name: null,
        email: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  }, []);

  // Function to fetch additional user data from the backend
  const fetchUserData = async () => {
    try {
      const response = await axiosInstance.get(endpoints.manageUser.getUser);

      // Update user data with additional information
      setUserData((prevState) => ({
        ...prevState,
        name: response.data.name || prevState.name,
        email: response.data.email || prevState.email,
        isLoading: false,
      }));

      // Store additional data in cookies if needed
      if (response.data.name && !Cookies.get("name")) {
        Cookies.set("name", response.data.name, { expires: 1 });
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      // Handle token expiration or other auth errors
      if (error.response?.status === 401) {
        handleLogout();
      }
    }
  };

  // Login function
  const login = async (email, password) => {
    try {
      const response = await axiosInstance.post(endpoints.auth.login, {
        email,
        password,
      });

      const { token, name, user } = response.data;
      const role = user.role;
      console.log(token);

      // Store data in cookies
      if (typeof role !== "undefined" && role !== null) {
        Cookies.set("role", role, { expires: 1 });
      }
      console.log("Login success - role:", role);

      Cookies.set("token", token, { expires: 1 });
      if (name || user?.name) {
        Cookies.set("name", name || user.name, { expires: 1 });
      }

      // Set auth header
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // Update context state
      setUserData({
        token,
        role,
        name: name || user?.name,
        email: user?.email,
        isAuthenticated: true,
        isLoading: false,
      });

      return { success: true, role };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Login failed",
      };
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      const response = await axiosInstance.post(
        endpoints.auth.register,
        userData,
      );

      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.errors ||
          error.response?.data?.message ||
          "Registration failed",
      };
    }
  };

  // Logout function
  const handleLogout = () => {
    // Remove auth header
    delete axios.defaults.headers.common["Authorization"];

    // Remove cookies
    Cookies.remove("token");
    Cookies.remove("role");
    Cookies.remove("name");

    // Reset context state
    setUserData({
      token: null,
      role: null,
      name: null,
      email: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  // Value object to be provided to consumers
  const value = {
    ...userData,
    login,
    register,
    logout: handleLogout,
    refreshUserData: () => fetchUserData(userData.token),
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

// Custom hook for using the context
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === null) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

// In UserContext.js
const loginWithGoogle = async (idToken) => {
  try {
    // Send the token to your backend
    const response = await fetch("/api/auth/google", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id_token: idToken }),
    });

    const data = await response.json();

    if (response.ok) {
      // Update authentication state
      setIsAuthenticated(true);
      setRole(data.role);
      setName(data.name);
      return { success: true, role: data.role };
    } else {
      return { success: false, error: data.message };
    }
  } catch (error) {
    console.error("Google login error:", error);
    return { success: false, error: "Google authentication failed" };
  }
};

// Include in the context value
const value = {
  // ...existing values
  loginWithGoogle,
};

export default UserContext;
