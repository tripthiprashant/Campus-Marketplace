import api from './api';

export const productService = {
  /**
   * Fetch products with query filters and pagination
   * @param {object} params { search, category, condition, min_price, max_price, ordering, page }
   */
  async getProducts(params = {}) {
    // Filter out undefined or empty params
    const cleanParams = {};
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        cleanParams[key] = val;
      }
    });

    const response = await api.get('/api/v1/products/', { params: cleanParams });
    return response.data; // { count, next, previous, results }
  },

  /**
   * Fetch a single product by ID
   * @param {number|string} id
   */
  async getProduct(id) {
    const response = await api.get(`/api/v1/products/${id}/`);
    return response.data;
  },

  /**
   * Create a new product listing
   * @param {FormData|object} productData
   */
  async createProduct(productData) {
    const isFormData = productData instanceof FormData;
    const response = await api.post('/api/v1/products/', productData, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
    });
    return response.data;
  },

  /**
   * Update an existing product listing
   * @param {number|string} id
   * @param {FormData|object} productData
   */
  async updateProduct(id, productData) {
    const isFormData = productData instanceof FormData;
    const response = await api.patch(`/api/v1/products/${id}/`, productData, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
    });
    return response.data;
  },

  /**
   * Delete a product listing
   * @param {number|string} id
   */
  async deleteProduct(id) {
    const response = await api.delete(`/api/v1/products/${id}/`);
    return response.data;
  },
};

export default productService;
