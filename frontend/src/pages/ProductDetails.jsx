import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  User,
  Clock,
  Tag,
  ShieldCheck,
  Edit,
  Trash2,
  Share2,
  ChevronRight,
  Sparkles,
  ShoppingBag,
  ArrowLeft,
} from 'lucide-react';
import productService from '../services/productService';
import categoryService from '../services/categoryService';
import requestService from '../services/requestService';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoriteContext';
import { useToast } from '../context/ToastContext';
import { formatPrice, formatDate } from '../utils/formatters';
import { ConditionBadge, StatusBadge } from '../components/common/Badge';
import { getImageUrl, getProductPlaceholder, getAvatarPlaceholder } from '../utils/imageHelper';
import ConfirmationModal from '../components/common/ConfirmationModal';
import PurchaseRequestModal from '../components/requests/PurchaseRequestModal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

export const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { isFavorited, toggleFavorite } = useFavorites();
  const { showSuccess, showError, showInfo } = useToast();

  const [product, setProduct] = useState(null);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modals state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [requestLoading, setRequestLoading] = useState(false);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await productService.getProduct(id);
      setProduct(data);

      if (data.category) {
        try {
          const catData = await categoryService.getCategory(data.category);
          setCategory(catData);
        } catch (catErr) {
          console.warn('Category detail not found', catErr);
        }
      }
    } catch (err) {
      console.error('Failed to load product details:', err);
      setError('Product not found or has been removed by the seller.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const isOwner = user && product && user.username === product.seller;
  const favorited = product ? isFavorited(product.id) : false;

  const handleDeleteListing = async () => {
    try {
      setDeleteLoading(true);
      await productService.deleteProduct(product.id);
      showSuccess('Listing deleted successfully.');
      navigate('/my-listings');
    } catch (err) {
      showError('Failed to delete listing. Please try again.');
    } finally {
      setDeleteLoading(false);
      setDeleteModalOpen(false);
    }
  };

  const handleSendPurchaseRequest = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/products/${id}` } } });
      return;
    }

    try {
      setRequestLoading(true);
      await requestService.createRequest(product.id);
      showSuccess('Purchase request sent to seller! Check My Listings > Sent Requests.');
      setRequestModalOpen(false);
    } catch (err) {
      showError('Unable to send request. You may already have a pending request for this item.');
    } finally {
      setRequestLoading(false);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showInfo('Product link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner size="lg" message="Loading product details..." />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <ErrorMessage
          title="Product not found"
          message={error || 'This listing does not exist or may have been deleted.'}
          onRetry={fetchProductDetails}
        />
        <div className="text-center mt-6">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to All Listings
          </Link>
        </div>
      </div>
    );
  }

  const imageUrl = getImageUrl(product.image, 'product');
  const isAvailable = product.is_available && product.status === 'AVAILABLE';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs font-medium text-slate-500 overflow-x-auto whitespace-nowrap">
        <Link to="/" className="hover:text-indigo-600">Home</Link>
        <ChevronRight className="w-3 h-3 text-slate-400 flex-shrink-0" />
        <Link to="/products" className="hover:text-indigo-600">Browse</Link>
        {category && (
          <>
            <ChevronRight className="w-3 h-3 text-slate-400 flex-shrink-0" />
            <Link to={`/products?category=${category.id}`} className="hover:text-indigo-600">
              {category.name}
            </Link>
          </>
        )}
        <ChevronRight className="w-3 h-3 text-slate-400 flex-shrink-0" />
        <span className="text-slate-800 font-semibold truncate max-w-xs">{product.title}</span>
      </nav>

      {/* Main Grid: Left Image / Right Info */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        
        {/* Left Column: Image Box */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-[4/3] w-full rounded-3xl overflow-hidden bg-slate-100 border border-slate-200/80 shadow-sm">
            <img
              src={imageUrl}
              alt={product.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = getProductPlaceholder();
              }}
            />

            {/* Badges on image */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              <ConditionBadge condition={product.condition} size="md" />
              {product.status && <StatusBadge status={product.status} size="md" />}
            </div>

            {/* Wishlist button */}
            <button
              onClick={() => toggleFavorite(product.id, product.title)}
              className={`absolute top-4 right-4 p-3 rounded-2xl backdrop-blur-md transition-all shadow-md ${
                favorited
                  ? 'bg-rose-500 text-white shadow-rose-200'
                  : 'bg-white/90 hover:bg-white text-slate-700 hover:text-rose-500'
              }`}
              aria-label={favorited ? 'Remove from wishlist' : 'Save to wishlist'}
            >
              <Heart className={`w-5 h-5 ${favorited ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Right Column: Details & Actions */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          <div className="space-y-5">
            
            {/* Category & Posted Date */}
            <div className="flex items-center justify-between text-xs text-slate-500">
              {category ? (
                <Link
                  to={`/products?category=${category.id}`}
                  className="inline-flex items-center gap-1 font-semibold text-indigo-600 hover:underline"
                >
                  <Tag className="w-3.5 h-3.5" />
                  {category.name}
                </Link>
              ) : (
                <span className="font-semibold text-slate-500">General Item</span>
              )}

              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                Posted {formatDate(product.created_at)}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
              {product.title}
            </h1>

            {/* Price Tag */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-extrabold text-indigo-600 tracking-tight">
                {formatPrice(product.price)}
              </span>
              <span className="text-xs text-slate-400">Fixed Campus Price</span>
            </div>

            {/* Seller Card */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                  {product.seller?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <span>{product.seller}</span>
                    <span className="text-[10px] px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded font-semibold">
                      Student
                    </span>
                  </h4>
                  <p className="text-xs text-slate-500">Verified Campus Seller</p>
                </div>
              </div>

              <button
                onClick={handleShare}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-200/60 transition-colors"
                title="Share link"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                Item Description
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line bg-white p-4 rounded-2xl border border-slate-100">
                {product.description}
              </p>
            </div>
          </div>

          {/* Action Buttons Section */}
          <div className="pt-6 border-t border-slate-200/80 space-y-3">
            {isOwner ? (
              /* Owner Actions */
              <div className="grid grid-cols-2 gap-3">
                <Link
                  to={`/edit-product/${product.id}`}
                  className="inline-flex items-center justify-center gap-2 py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-2xl shadow-sm transition-all"
                >
                  <Edit className="w-4 h-4" />
                  Edit Listing
                </Link>
                <button
                  onClick={() => setDeleteModalOpen(true)}
                  className="inline-flex items-center justify-center gap-2 py-3.5 px-4 bg-rose-50 hover:bg-rose-100 text-rose-700 text-sm font-bold rounded-2xl border border-rose-200 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Listing
                </button>
              </div>
            ) : isAuthenticated ? (
              /* Buyer Actions (Logged in) */
              isAvailable ? (
                <button
                  onClick={() => setRequestModalOpen(true)}
                  className="w-full inline-flex items-center justify-center gap-2 py-4 px-6 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white text-sm sm:text-base font-bold rounded-2xl shadow-md shadow-indigo-200 active:scale-[0.98] transition-all"
                >
                  <ShoppingBag className="w-5 h-5" />
                  Request to Buy / Contact Seller
                </button>
              ) : (
                <div className="p-4 rounded-2xl bg-slate-100 text-center">
                  <p className="text-sm font-bold text-slate-700">
                    This item is currently {product.status?.toLowerCase() || 'unavailable'}.
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    You can still add it to your wishlist to keep track.
                  </p>
                </div>
              )
            ) : (
              /* Unauthenticated Actions */
              <Link
                to="/login"
                state={{ from: { pathname: `/products/${id}` } }}
                className="w-full inline-flex items-center justify-center gap-2 py-4 px-6 bg-indigo-600 hover:bg-indigo-700 text-white text-sm sm:text-base font-bold rounded-2xl shadow-md shadow-indigo-200 transition-all"
              >
                Log In to Contact Seller & Buy
              </Link>
            )}

            {/* Safety Reminder */}
            <div className="flex items-center gap-2 text-xs text-slate-400 justify-center">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Safe campus meetup guaranteed. Pay only after inspecting.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteListing}
        loading={deleteLoading}
        title="Delete Listing"
        message={`Are you sure you want to delete "${product.title}"? This action cannot be reversed.`}
        confirmText="Delete"
        confirmVariant="danger"
      />

      {/* Purchase Request Modal */}
      <PurchaseRequestModal
        isOpen={requestModalOpen}
        onClose={() => setRequestModalOpen(false)}
        product={product}
        onConfirm={handleSendPurchaseRequest}
        loading={requestLoading}
      />
    </div>
  );
};

export default ProductDetails;
