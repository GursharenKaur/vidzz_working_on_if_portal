import axios from "axios"
import { useAuthStore } from "@/lib/store/auth"
import Cookies from 'js-cookie';

// Create Axios instance
export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  withCredentials: true,
})

// Add token interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from auth store
    const token = useAuthStore.getState().token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // For file uploads, let the browser set the Content-Type header with the boundary
    if (config.data instanceof FormData) {
      if (config.headers.delete) {
        config.headers.delete('Content-Type');
      } else {
        delete config.headers['Content-Type'];
      }
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Add error interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - logout user
      useAuthStore.getState().logout()
      window.location.href = "/login"
    }
    return Promise.reject(error)
  },
)

export default axiosInstance
