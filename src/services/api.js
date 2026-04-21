import axios from "axios";

const BACKEND_PROTOCOL = process.env.REACT_APP_BACKEND_PROTOCOL || "http";
const BACKEND_HOST = process.env.REACT_APP_BACKEND_HOST || "localhost";
const BACKEND_PORT = process.env.REACT_APP_BACKEND_PORT || "3000";
const API_BASE_URL = 
  process.env.REACT_APP_API_URL ||  //take from .env file, dynamic backend url
  `${BACKEND_PROTOCOL}://${BACKEND_HOST}${BACKEND_PORT ? `:${BACKEND_PORT}` : ""}`;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add interceptor for auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authService = {
  login: (credentials) => api.post("/api/login", credentials),
  register: (userData) => api.post("/api/register", userData),
  verifyToken: () => api.post("/api/auth/verify"),
  updateProfile: (userData) => api.put("/api/user/profile", userData),
};

export const simulationService = {
  getAll: () => api.get("/api/simulations"),
  getById: (id) => api.get(`/api/simulations/${id}`),
  create: (data) => api.post("/api/simulations", data),
  delete: (id) => api.get(`/api/simulations/${id}`),
};

export default api;
