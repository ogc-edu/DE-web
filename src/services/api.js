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
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authService = {
  login: (credentials) => api.post("/api/v1/login", credentials),
  register: (userData) => api.post("/api/v1/register", userData),
  verifyToken: () => api.post("/api/v1/verify"),
  getProfile: () => api.get("/api/v1/user/profile"),
  updateProfile: (userData) => api.patch("/api/v1/user/profile", userData),
  changePassword: (data) => api.patch("/api/v1/user/password", data),
};

export const simulationService = {
  getAll: async () => {
    const response = await api.get("/api/v1/simulation/get");
    // Backend wraps the list in { simulations, simulationCount }
    return { ...response, data: response.data.simulations };
  },
  getById: (id) => api.get(`/api/v1/simulation/get/${id}`),
  create: (data) => api.post("/api/v1/simulation/create", data),
  delete: (id) => api.delete(`/api/v1/simulation/delete/${id}`),
};

export default api;
