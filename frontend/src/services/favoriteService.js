import api from './api';

export const favoriteService = {
  /**
   * Fetch authenticated user's favorites
   */
  async getFavorites() {
    const response = await api.get('/api/v1/favorites/');
    if (response.data && Array.isArray(response.data.results)) {
      return response.data.results;
    }
    if (Array.isArray(response.data)) {
      return response.data;
    }
    return [];
  },

  /**
   * Add a product to favorites
   * @param {number|string} productId
   */
  async addFavorite(productId) {
    const response = await api.post('/api/v1/favorites/', {
      product: productId,
    });
    return response.data; // { id, user, product, created_at }
  },

  /**
   * Remove a product from favorites by favorite ID
   * @param {number|string} favoriteId
   */
  async removeFavorite(favoriteId) {
    const response = await api.delete(`/api/v1/favorites/${favoriteId}/`);
    return response.data;
  },
};

export default favoriteService;
