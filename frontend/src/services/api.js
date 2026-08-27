import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Accept': 'application/json',
  },
});

// Request Interceptor: Attach JWT Access Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('cm_access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Auto Refresh JWT on 401
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if error is 401, not already retried, and not a login/refresh request
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/token/refresh/') &&
      !originalRequest.url?.includes('/users/login/')
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('cm_refresh_token');

      if (!refreshToken) {
        isRefreshing = false;
        localStorage.removeItem('cm_access_token');
        localStorage.removeItem('cm_refresh_token');
        localStorage.removeItem('cm_user');
        window.dispatchEvent(new Event('auth:logout'));
        return Promise.reject(error);
      }

      try {
        const response = await axios.post(`${API_BASE_URL}/api/v1/users/token/refresh/`, {
          refresh: refreshToken,
        });

        const { access } = response.data;
        localStorage.setItem('cm_access_token', access);
        api.defaults.headers.common.Authorization = `Bearer ${access}`;
        processQueue(null, access);

        originalRequest.headers.Authorization = `Bearer ${access}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.removeItem('cm_access_token');
        localStorage.removeItem('cm_refresh_token');
        localStorage.removeItem('cm_user');
        window.dispatchEvent(new Event('auth:logout'));
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

/**
 * Standardize DRF error response into a human-friendly string or object
 * @param {any} error
 * @returns {string}
 */
export const getApiErrorMessage = (error) => {
  if (!error) return 'An unexpected error occurred. Please try again.';
  
  if (error.response?.data) {
    const data = error.response.data;

    // Handle { detail: "..." }
    if (typeof data.detail === 'string') {
      return data.detail;
    }

    // Handle { message: "..." }
    if (typeof data.message === 'string') {
      return data.message;
    }

    // Handle { non_field_errors: ["..."] }
    if (Array.isArray(data.non_field_errors) && data.non_field_errors.length > 0) {
      return data.non_field_errors[0];
    }

    // Handle field specific errors { username: ["..."], email: ["..."] }
    if (typeof data === 'object') {
      const messages = [];
      for (const [key, value] of Object.entries(data)) {
        const fieldName = key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' ');
        if (Array.isArray(value)) {
          messages.push(`${fieldName}: ${value.join(' ')}`);
        } else if (typeof value === 'string') {
          messages.push(`${fieldName}: ${value}`);
        }
      }
      if (messages.length > 0) {
        return messages.join(' | ');
      }
    }
  }

  if (error.message) {
    if (error.message === 'Network Error') {
      return 'Unable to connect to the server. Please check your internet connection or if the backend server is running.';
    }
    return error.message;
  }

  return 'Something went wrong. Please try again.';
};

export default api;
