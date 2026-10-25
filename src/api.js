import axios from "axios";

// All API calls go to Spring Boot backend on port 8081
const api = axios.create({
  baseURL: "http://localhost:5643",
});

// Attach JWT token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
