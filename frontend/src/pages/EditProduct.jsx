import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Edit, ArrowLeft } from 'lucide-react';
import productService from '../services/productService';
import categoryService from '../services/categoryService';
import ProductForm from '../components/products/ProductForm';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { getApiErrorMessage } from '../services/api';

export const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();

  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setInitialLoading(true);
        setError(null);

        const [productData, categoriesData] = await Promise.all([
          productService.getProduct(id),
          categoryService.getCategories(),
        ]);

        // Security check: only the seller can edit
        if (user && productData.seller !== user.username) {
          setError('You do not have permission to edit this listing.');
          return;
        }

        setProduct(productData);
        setCategories(categoriesData || []);
      } catch (err) {
        console.error('Failed to load edit product data', err);
        setError('Unable to load listing details.');
      } finally {
        setInitialLoading(false);
      }
    };

    loadData();
  }, [id, user]);

  const handleSubmit = async (formDataPayload) => {
    try {
      setLoading(true);
      await productService.updateProduct(id, formDataPayload);
      showSuccess('Listing updated successfully!');
      navigate(`/products/${id}`);
    } catch (err) {
      console.error('Update product error:', err);
      const msg = getApiErrorMessage(err);
      showError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner message="Loading listing details..." />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <ErrorMessage
          title="Cannot Edit Listing"
          message={error || 'Listing not found.'}
        />
        <div className="text-center mt-6">
          <button
            onClick={() => navigate('/my-listings')}
            className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to My Listings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-100">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-2">
            <Edit className="w-3.5 h-3.5" />
            <span>Update Listing</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Edit: {product.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Update pricing, description, availability, or photos.
          </p>
        </div>

        <button
          onClick={() => navigate(-1)}
          className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
        <ProductForm
          initialData={product}
          categories={categories}
          onSubmit={handleSubmit}
          loading={loading}
          onCancel={() => navigate(`/products/${id}`)}
          isEdit={true}
        />
      </div>
    </div>
  );
};

export default EditProduct;
