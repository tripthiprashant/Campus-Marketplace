import api from './api';

export const authService = {
  /**
   * Register a new user
   * @param {FormData|object} userData
   */
  async register(userData) {
    const isFormData = userData instanceof FormData;
    const response = await api.post('/api/v1/users/register/', userData, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
    });
    return response.data;
  },

  /**
   * Log in user and receive JWT pair
   * @param {{ username: string, password: string }} credentials
   */
  async login(credentials) {
    const response = await api.post('/api/v1/users/login/', credentials);
    return response.data; // { access, refresh }
  },

  /**
   * Get authenticated user's profile
   */
  async getProfile() {
    const response = await api.get('/api/v1/users/profile/');
    return response.data; // { username, email, college, phone, profile_image }
  },

  /**
   * Update user profile
   * @param {FormData|object} profileData
   */
  async updateProfile(profileData) {
    const isFormData = profileData instanceof FormData;
    const response = await api.patch('/api/v1/users/profile/', profileData, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
    });
    return response.data;
  },

  /**
   * Refresh JWT token manually if needed
   * @param {string} refreshToken
   */
  async refreshToken(refreshToken) {
    const response = await api.post('/api/v1/users/token/refresh/', {
      refresh: refreshToken,
    });
    return response.data;
  },
};

export default authService;
