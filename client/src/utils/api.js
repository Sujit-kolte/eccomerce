import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Auth API calls
export const authAPI = {
  register: (data) => apiClient.post("/auth/register", data),
  login: (data) => apiClient.post("/auth/login", data),
  getProfile: () => apiClient.get("/auth/profile"),
};

// Product API calls
export const productAPI = {
  getAll: (params) => apiClient.get("/products", { params }),
  getById: (id) => apiClient.get(`/products/${id}`),
  getRecommendations: (productId, limit = 5) =>
    apiClient.get(`/products/${productId}/recommendations`, {
      params: { limit },
    }),
  getCategories: () => apiClient.get("/products/categories"),
  create: (data) => apiClient.post("/products", data),
  update: (id, data) => apiClient.put(`/products/${id}`, data),
  delete: (id) => apiClient.delete(`/products/${id}`),
};

// Payment API calls
export const paymentAPI = {
  createPaymentIntent: (data) =>
    apiClient.post("/payments/create-payment-intent", data),
  confirmPayment: (data) => apiClient.post("/payments/confirm-payment", data),
  createOrder: (data) => apiClient.post("/payments/orders", data),
  getUserOrders: () => apiClient.get("/payments/orders/user"),
  getAllOrders: () => apiClient.get("/payments/orders"),
  updateOrderDelivery: (orderId) =>
    apiClient.put(`/payments/orders/${orderId}/deliver`),
};

export default apiClient;
