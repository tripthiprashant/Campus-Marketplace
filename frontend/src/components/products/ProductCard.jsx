import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, User, Clock, Check } from 'lucide-react';
import { formatPrice, formatDate } from '../../utils/formatters';
import { ConditionBadge, StatusBadge } from '../common/Badge';
import { getImageUrl, getProductPlaceholder } from '../../utils/imageHelper';
import { useFavorites } from '../../context/FavoriteContext';

export const ProductCard = ({ product, categoryName }) => {
  const { isFavorited, toggleFavorite } = useFavorites();

  if (!product) return null;

  const favorited = isFavorited(product.id);
  const imageUrl = getImageUrl(product.image, 'product');

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(product.id, product.title);
  };

  const isSold = product.status === 'SOLD';
  const isReserved = product.status === 'RESERVED';

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200/80 hover:border-indigo-200 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden">
      {/* Product Image Container */}
      <Link to={`/products/${product.id}`} className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100 block">
        <img
          src={imageUrl}
          alt={product.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = getProductPlaceholder();
          }}
        />

        {/* Status / Condition Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          <ConditionBadge condition={product.condition} />
          {isSold && (
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-600 text-white shadow-sm">
              SOLD
            </span>
          )}
          {isReserved && (
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-500 text-white shadow-sm">
              RESERVED
            </span>
          )}
        </div>

        {/* Favorite Heart Button */}
        <button
          onClick={handleFavoriteClick}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all z-10 ${
            favorited
              ? 'bg-rose-500 text-white shadow-sm'
              : 'bg-white/80 hover:bg-white text-slate-600 hover:text-rose-500 shadow-sm'
          }`}
          aria-label={favorited ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart className={`w-4 h-4 ${favorited ? 'fill-current' : ''}`} />
        </button>

        {/* Overlay if item is unavailable */}
        {!product.is_available && (
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center">
            <span className="px-3 py-1 bg-slate-900/90 text-white text-xs font-bold rounded-lg tracking-wider uppercase">
              Unavailable
            </span>
          </div>
        )}
      </Link>

      {/* Product Details */}
      <div className="p-4 flex flex-col flex-1">
        {/* Category & Date */}
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
          <span className="font-medium text-indigo-600 truncate max-w-[60%]">
            {categoryName || 'General Item'}
          </span>
          <span className="flex items-center gap-1 flex-shrink-0">
            <Clock className="w-3 h-3" />
            {formatDate(product.created_at)}
          </span>
        </div>

        {/* Title */}
        <Link to={`/products/${product.id}`} className="block group-hover:text-indigo-600 transition-colors">
          <h3 className="font-semibold text-slate-900 text-sm sm:text-base leading-snug line-clamp-2" title={product.title}>
            {product.title}
          </h3>
        </Link>

        {/* Description snippet */}
        {product.description && (
          <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        )}

        {/* Price & Seller Info */}
        <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              {formatPrice(product.price)}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-500" title={`Listed by ${product.seller}`}>
            <User className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-medium truncate max-w-[80px] sm:max-w-[100px]">
              {product.seller}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
