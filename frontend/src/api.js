import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api", // Ganti dengan URL backend Laravel Anda
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor untuk menambahkan token jika ada
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
