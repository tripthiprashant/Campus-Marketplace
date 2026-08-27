import React, { useEffect } from 'react';
import { ShoppingBag, X, Loader2, ShieldCheck, User } from 'lucide-react';
import { formatPrice } from '../../utils/formatters';
import { getImageUrl, getProductPlaceholder } from '../../utils/imageHelper';

export const PurchaseRequestModal = ({
  isOpen,
  onClose,
  product,
  onConfirm,
  loading = false,
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && !loading) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, loading, onClose]);

  if (!isOpen || !product) return null;

  const imageUrl = getImageUrl(product.image, 'product');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
        onClick={loading ? undefined : onClose}
      />

      {/* Modal Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        className="relative bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 z-10 animate-fade-in"
      >
        <button
          onClick={onClose}
          disabled={loading}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100 transition-colors disabled:opacity-50"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center sm:text-left mb-6">
          <div className="inline-flex p-3 rounded-2xl bg-indigo-50 text-indigo-600 mb-3">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-extrabold text-slate-900">
            Request to Buy this Item
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            Send a purchase request to connect with the student seller.
          </p>
        </div>

        {/* Product preview box */}
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 mb-6">
          <img
            src={imageUrl}
            alt={product.title}
            className="w-16 h-16 rounded-xl object-cover border border-slate-200 bg-white flex-shrink-0"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = getProductPlaceholder();
            }}
          />
          <div className="min-w-0 flex-1">
            <h4 className="text-sm font-bold text-slate-900 truncate">
              {product.title}
            </h4>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-base font-extrabold text-indigo-600">
                {formatPrice(product.price)}
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-slate-500 flex items-center gap-1 truncate">
                <User className="w-3 h-3 text-slate-400" />
                {product.seller}
              </span>
            </div>
          </div>
        </div>

        {/* Safety banner */}
        <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex items-start gap-3 mb-6">
          <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-emerald-800 leading-relaxed">
            The seller will receive your request and contact details to coordinate a campus meetup. Never transfer funds before inspecting the item in person.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-md shadow-indigo-200 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Confirm Purchase Request
          </button>
        </div>
      </div>
    </div>
  );
};

export default PurchaseRequestModal;
