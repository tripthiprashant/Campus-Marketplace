import React, { useState, useEffect, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader2, DollarSign, Tag, Check } from 'lucide-react';
import { CONDITION_CONFIG } from '../../utils/formatters';
import { getImageUrl } from '../../utils/imageHelper';

export const ProductForm = ({
  initialData = {},
  categories = [],
  onSubmit,
  isEdit = false,
  loading = false,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    title: initialData.title || '',
    description: initialData.description || '',
    price: initialData.price || '',
    category: initialData.category || '',
    condition: initialData.condition || 'good',
    is_available: initialData.is_available !== undefined ? initialData.is_available : true,
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(
    initialData.image ? getImageUrl(initialData.image, 'product') : null
  );
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (initialData.id) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        price: initialData.price || '',
        category: initialData.category || '',
        condition: initialData.condition || 'good',
        is_available: initialData.is_available !== undefined ? initialData.is_available : true,
      });
      if (initialData.image) {
        setImagePreview(getImageUrl(initialData.image, 'product'));
      }
    }
  }, [initialData]);

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Please enter a valid price (e.g. 250)';
    }
    if (!formData.category) newErrors.category = 'Please select a category';
    if (!formData.condition) newErrors.condition = 'Please choose the condition';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, image: 'Image must be smaller than 5MB' }));
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setErrors((prev) => ({ ...prev, image: '' }));
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Build FormData payload
    const payload = new FormData();
    payload.append('title', formData.title.trim());
    payload.append('description', formData.description.trim());
    payload.append('price', parseFloat(formData.price).toFixed(2));
    payload.append('category', formData.category);
    payload.append('condition', formData.condition);
    payload.append('is_available', formData.is_available);

    if (imageFile) {
      payload.append('image', imageFile);
    }

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title Field */}
      <div>
        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
          Item Title <span className="text-rose-500">*</span>
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g. Engineering Mechanics Textbook (8th Edition), Scientific Calculator"
          className={`w-full text-sm bg-slate-50 border rounded-xl px-4 py-3 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
            errors.title
              ? 'border-rose-300 focus:ring-rose-200 focus:border-rose-500'
              : 'border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-500'
          }`}
        />
        {errors.title && <p className="text-xs text-rose-600 mt-1.5">{errors.title}</p>}
      </div>

      {/* Category & Price Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Category Dropdown */}
        <div>
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
            Category <span className="text-rose-500">*</span>
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={`w-full text-sm bg-slate-50 border rounded-xl px-4 py-3 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
              errors.category
                ? 'border-rose-300 focus:ring-rose-200 focus:border-rose-500'
                : 'border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-500'
            }`}
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          {errors.category && <p className="text-xs text-rose-600 mt-1.5">{errors.category}</p>}
        </div>

        {/* Price Input */}
        <div>
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
            Price (₹) <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-sm">
              ₹
            </span>
            <input
              type="number"
              step="1"
              min="0"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="e.g. 450"
              className={`w-full pl-9 pr-4 py-3 text-sm bg-slate-50 border rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                errors.price
                  ? 'border-rose-300 focus:ring-rose-200 focus:border-rose-500'
                  : 'border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-500'
              }`}
            />
          </div>
          {errors.price && <p className="text-xs text-rose-600 mt-1.5">{errors.price}</p>}
        </div>
      </div>

      {/* Condition Selector */}
      <div>
        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5">
          Item Condition <span className="text-rose-500">*</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {Object.entries(CONDITION_CONFIG).map(([key, config]) => {
            const isSelected = formData.condition === key;
            return (
              <button
                type="button"
                key={key}
                onClick={() => setFormData((prev) => ({ ...prev, condition: key }))}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-medium transition-all ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/70 text-indigo-700 font-bold shadow-sm'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${config.dot}`}></span>
                  <span>{config.label}</span>
                </div>
              </button>
            );
          })}
        </div>
        {errors.condition && <p className="text-xs text-rose-600 mt-1.5">{errors.condition}</p>}
      </div>

      {/* Description Field */}
      <div>
        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
          Description <span className="text-rose-500">*</span>
        </label>
        <textarea
          name="description"
          rows="4"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe condition, edition, accessories included, reason for selling, campus meet-up spot..."
          className={`w-full text-sm bg-slate-50 border rounded-xl px-4 py-3 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 transition-all leading-relaxed ${
            errors.description
              ? 'border-rose-300 focus:ring-rose-200 focus:border-rose-500'
              : 'border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-500'
          }`}
        />
        {errors.description && (
          <p className="text-xs text-rose-600 mt-1.5">{errors.description}</p>
        )}
      </div>

      {/* Image Upload Field */}
      <div>
        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
          Product Photo
        </label>
        
        {imagePreview ? (
          <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 group">
            <img
              src={imagePreview}
              alt="Listing preview"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-white text-slate-900 text-xs font-bold rounded-xl shadow hover:bg-slate-50 transition-all"
              >
                Change Photo
              </button>
              <button
                type="button"
                onClick={handleRemoveImage}
                className="px-4 py-2 bg-rose-600 text-white text-xs font-bold rounded-xl shadow hover:bg-rose-700 transition-all"
              >
                Remove
              </button>
            </div>
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-300 hover:border-indigo-500 rounded-2xl p-8 text-center cursor-pointer bg-slate-50/50 hover:bg-indigo-50/30 transition-all group"
          >
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
              <Upload className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-slate-700">Click to upload product image</p>
            <p className="text-xs text-slate-400 mt-1">PNG, JPG, WebP up to 5MB</p>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />
        {errors.image && <p className="text-xs text-rose-600 mt-1.5">{errors.image}</p>}
      </div>

      {/* Availability toggle (only for edit) */}
      {isEdit && (
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-slate-900">Listing Availability</h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Turn off if you want to temporarily hide this item from search.
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="is_available"
              checked={formData.is_available}
              onChange={handleChange}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
          </label>
        </div>
      )}

      {/* Action Buttons */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-md shadow-indigo-200 active:scale-[0.98] transition-all disabled:opacity-50"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {isEdit ? 'Update Listing' : 'Publish Listing'}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
