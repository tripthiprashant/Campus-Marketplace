import api from './api';

export const categoryService = {
  /**
   * Fetch categories list
   * Returns array of categories
   */
  async getCategories() {
    const response = await api.get('/api/v1/categories/');
    // Handle both DRF paginated response { results: [...] } and plain array [...]
    if (response.data && Array.isArray(response.data.results)) {
      return response.data.results;
    }
    if (Array.isArray(response.data)) {
      return response.data;
    }
    return [];
  },

  /**
   * Fetch single category by ID
   * @param {number|string} id
   */
  async getCategory(id) {
    const response = await api.get(`/api/v1/categories/${id}/`);
    return response.data;
  },
};

export default categoryService;
