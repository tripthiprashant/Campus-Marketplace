import React, { useState, useEffect } from 'react';
import { Heart, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import productService from '../services/productService';
import categoryService from '../services/categoryService';
import { useFavorites } from '../context/FavoriteContext';
import ProductGrid from '../components/products/ProductGrid';
import LoadingSpinner from '../components/common/LoadingSpinner';

export const Favorites = () => {
  const { favorites, loading: favsLoading } = useFavorites();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWishlistProducts = async () => {
      try {
        setLoading(true);

        const [allProductsData, allCategoriesData] = await Promise.all([
          productService.getProducts(),
          categoryService.getCategories(),
        ]);

        const allItems = allProductsData.results || allProductsData || [];
        setCategories(allCategoriesData || []);

        // Filter products that match any product id in favorites
        const favProductIds = new Set(favorites.map((f) => f.product));
        const matched = allItems.filter((p) => favProductIds.has(p.id));

        setProducts(matched);
      } catch (err) {
        console.error('Failed to load wishlist items', err);
      } finally {
        setLoading(false);
      }
    };

    loadWishlistProducts();
  }, [favorites]);

  if (loading || favsLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner message="Loading saved wishlist..." />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-100">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <span>Saved Wishlist</span>
            <span className="text-sm font-semibold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-100">
              {favorites.length}
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Keep track of items you are interested in buying later.
          </p>
        </div>

        <Link
          to="/products"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-indigo-600 hover:text-indigo-700"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Browse More</span>
        </Link>
      </div>

      {/* Grid or Empty */}
      <ProductGrid
        products={products}
        categories={categories}
        loading={false}
        emptyTitle="Your wishlist is empty"
        emptyDescription="Explore campus listings and click the heart icon on any product to save it here."
        emptyActionText="Browse Campus Marketplace"
        emptyActionLink="/products"
      />
    </div>
  );
};

export default Favorites;
