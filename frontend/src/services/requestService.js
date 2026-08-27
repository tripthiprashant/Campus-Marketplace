import api from './api';

export const requestService = {
  /**
   * Fetch all purchase requests related to current user (as buyer or seller)
   */
  async getRequests() {
    const response = await api.get('/api/v1/requests/');
    if (response.data && Array.isArray(response.data.results)) {
      return response.data.results;
    }
    if (Array.isArray(response.data)) {
      return response.data;
    }
    return [];
  },

  /**
   * Create a purchase request for a product
   * @param {number|string} productId
   */
  async createRequest(productId) {
    const response = await api.post('/api/v1/requests/', {
      product: productId,
    });
    return response.data;
  },

  /**
   * Accept a purchase request (Seller only)
   * @param {number|string} requestId
   */
  async acceptRequest(requestId) {
    const response = await api.post(`/api/v1/requests/${requestId}/accept/`);
    return response.data;
  },

  /**
   * Reject a purchase request (Seller only)
   * @param {number|string} requestId
   */
  async rejectRequest(requestId) {
    const response = await api.post(`/api/v1/requests/${requestId}/reject/`);
    return response.data;
  },

  /**
   * Cancel a purchase request (Buyer only)
   * @param {number|string} requestId
   */
  async cancelRequest(requestId) {
    const response = await api.post(`/api/v1/requests/${requestId}/cancel/`);
    return response.data;
  },

  /**
   * Complete transaction (Seller only)
   * @param {number|string} requestId
   */
  async completeRequest(requestId) {
    const response = await api.post(`/api/v1/requests/${requestId}/complete/`);
    return response.data;
  },
};

export default requestService;
