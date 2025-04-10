import axios from "axios";
import Cookies from "js-cookie"; // Config
export const HOST_API = import.meta.env.VITE_HOST_API;

// ----------------------------------------------------------------------

const axiosInstance = axios.create({
  baseURL: HOST_API,
  withCredentials: true, // kalau kamu pakai cookie, ini tetap true
});

// REQUEST INTERCEPTOR: Tambahkan Authorization token
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

// const refreshToken = () => true;

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
  crudArticle: {
    create: "/api/article",
  },
  manageUser: {
    getUser: "api/users",
  },
};
