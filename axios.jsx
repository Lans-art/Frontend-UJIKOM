import axios from "axios";
import Cookies from "js-cookie"; // Config
export const HOST_API = import.meta.env.VITE_HOST_API;

// ----------------------------------------------------------------------

const axiosInstance = axios.create({
  baseURL: HOST_API,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// REQUEST INTERCEPTOR: Add Authorization token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (res) => res,
  (error) =>
    Promise.reject(
      (error.response && error.response.data) || "Something went wrong",
    ),
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  const res = await axiosInstance.get(url, { ...config });

  return res.data;
};

// ----------------------------------------------------------------------

export const endpoints = {
  auth: {
    me: "/api/auth/me",
    login: "/api/login",
    register: "/api/register",
    logout: "/api/logout",
  },
  detail: {
    detailAccount: "/api/sellaccount",
  },
  cart: {
    cart: "/api/cart",
  },
  crudArticle: {
    list: "/api/articles",
    articles: "/api/articles",
    update: (id) => `/api/articles/${id}`,
    delete: (id) => `/api/articles/${id}`,
    articleToggleStatus: (id) => `/api/articles/toggle-status/${id}`,
  },
  
  chat: {
    base: "/chats", // Base endpoint
    // This function generates the endpoint for getting messages between a user and seller for a specific product
    getMessages: (accountId, receiverId) => `/chats/${accountId}/${receiverId}`,
    send: "/chats",
    updateStatus: (id) => `/chats/${id}/status`,
  },

  crudAcccount: {
    list: "/api/sellaccount",
    detail: (id) => `/api/sellaccount/${id}`,
    create: "/api/sellaccount",
    update: (id) => `/api/sellaccount/${id}`,
    delete: (id) => `/api/sellaccount/${id}`,
  },
  manageUser: {
    getUser: "/api/user",
  },
};
