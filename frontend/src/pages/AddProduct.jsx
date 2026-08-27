import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Sparkles, ArrowLeft } from 'lucide-react';
import productService from '../services/productService';
import categoryService from '../services/categoryService';
import ProductForm from '../components/products/ProductForm';
import { useToast } from '../context/ToastContext';
import { getApiErrorMessage } from '../services/api';

export const AddProduct = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const catData = await categoryService.getCategories();
        setCategories(catData || []);
      } catch (err) {
        console.error('Failed to load categories', err);
        showError('Could not load categories. Please refresh the page.');
      } finally {
        setInitialLoading(false);
      }
    };
    loadCategories();
  }, [showError]);

  const handleSubmit = async (formDataPayload) => {
    try {
      setLoading(true);
      const newProduct = await productService.createProduct(formDataPayload);
      showSuccess('Your listing has been published successfully!');
      navigate(`/products/${newProduct.id}`);
    } catch (err) {
      console.error('Create product error:', err);
      const msg = getApiErrorMessage(err);
      showError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-100">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Student Marketplace</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Sell an Item on Campus
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Fill out the details below to list your textbook, device, or supply for sale.
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
        {initialLoading ? (
          <div className="py-12 text-center text-slate-400 text-sm">
            Loading categories...
          </div>
        ) : (
          <ProductForm
            categories={categories}
            onSubmit={handleSubmit}
            loading={loading}
            onCancel={() => navigate(-1)}
            isEdit={false}
          />
        )}
      </div>
    </div>
  );
};

export default AddProduct;
