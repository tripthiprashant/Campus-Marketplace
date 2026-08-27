import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, X, RotateCcw } from 'lucide-react';
import productService from '../services/productService';
import categoryService from '../services/categoryService';
import ProductGrid from '../components/products/ProductGrid';
import FilterDrawer from '../components/products/FilterDrawer';
import SearchBar from '../components/products/SearchBar';
import Pagination from '../components/common/Pagination';
import ErrorMessage from '../components/common/ErrorMessage';
import { CONDITION_CONFIG } from '../utils/formatters';

export const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Extract filter state from URL search params
  const searchQuery = searchParams.get('search') || '';
  const categoryParam = searchParams.get('category') || '';
  const conditionParam = searchParams.get('condition') || '';
  const minPriceParam = searchParams.get('min_price') || '';
  const maxPriceParam = searchParams.get('max_price') || '';
  const orderingParam = searchParams.get('ordering') || '-created_at';
  const pageParam = parseInt(searchParams.get('page') || '1', 10);

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Fetch categories once
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const catData = await categoryService.getCategories();
        setCategories(catData || []);
      } catch (err) {
        console.warn('Could not load categories:', err);
      }
    };
    loadCategories();
  }, []);

  // Fetch filtered products
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        search: searchQuery,
        category: categoryParam,
        condition: conditionParam,
        min_price: minPriceParam,
        max_price: maxPriceParam,
        ordering: orderingParam,
        page: pageParam,
      };

      const data = await productService.getProducts(params);

      if (data && Array.isArray(data.results)) {
        setProducts(data.results);
        setTotalCount(data.count || 0);
      } else if (Array.isArray(data)) {
        setProducts(data);
        setTotalCount(data.length);
      } else {
        setProducts([]);
        setTotalCount(0);
      }
    } catch (err) {
      console.error('Products fetch error:', err);
      setError('Unable to load listings. Please check if your backend server is online.');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, categoryParam, conditionParam, minPriceParam, maxPriceParam, orderingParam, pageParam]);

  useEffect(() => {
    fetchProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [fetchProducts]);

  // Update URL params helper
  const updateParams = (newParams) => {
    const updated = new URLSearchParams(searchParams);
    
    Object.entries(newParams).forEach(([key, val]) => {
      if (val === undefined || val === null || val === '') {
        updated.delete(key);
      } else {
        updated.set(key, val);
      }
    });

    // Reset to page 1 whenever filters other than page change
    if (!('page' in newParams)) {
      updated.delete('page');
    }

    setSearchParams(updated);
  };

  const handleResetFilters = () => {
    setSearchParams({});
  };

  const handleSearch = (term) => {
    updateParams({ search: term });
  };

  const handleCategorySelect = (catId) => {
    updateParams({ category: catId });
  };

  const handleConditionSelect = (condition) => {
    updateParams({ condition: condition });
  };

  const handleMinPriceChange = (price) => {
    updateParams({ min_price: price });
  };

  const handleMaxPriceChange = (price) => {
    updateParams({ max_price: price });
  };

  const handleOrderingChange = (order) => {
    updateParams({ ordering: order });
  };

  const handlePageChange = (newPage) => {
    updateParams({ page: newPage.toString() });
  };

  // Find active category label
  const activeCategory = categories.find((c) => c.id.toString() === categoryParam);

  const hasActiveFilters = !!(
    searchQuery ||
    categoryParam ||
    conditionParam ||
    minPriceParam ||
    maxPriceParam ||
    (orderingParam && orderingParam !== '-created_at')
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Browse Campus Listings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {loading ? 'Searching available items...' : `${totalCount} verified items available`}
          </p>
        </div>

        <div className="w-full md:w-96">
          <SearchBar initialValue={searchQuery} onSearch={handleSearch} />
        </div>
      </div>

      {/* Mobile Filter Toggle & Quick Info */}
      <div className="flex lg:hidden items-center justify-between gap-3 pt-2">
        <button
          onClick={() => setMobileFiltersOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50"
        >
          <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
          <span>Filters & Sort</span>
          {hasActiveFilters && (
            <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
          )}
        </button>

        {hasActiveFilters && (
          <button
            onClick={handleResetFilters}
            className="text-xs text-slate-500 hover:text-rose-600 font-semibold flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            Clear
          </button>
        )}
      </div>

      {/* Active Filter Chips */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 flex-wrap pt-1">
          <span className="text-xs font-semibold text-slate-400">Active filters:</span>

          {searchQuery && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium border border-indigo-200">
              Search: "{searchQuery}"
              <button onClick={() => updateParams({ search: '' })}>
                <X className="w-3 h-3 ml-1 hover:text-indigo-900" />
              </button>
            </span>
          )}

          {activeCategory && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium border border-indigo-200">
              Category: {activeCategory.name}
              <button onClick={() => updateParams({ category: '' })}>
                <X className="w-3 h-3 ml-1 hover:text-indigo-900" />
              </button>
            </span>
          )}

          {conditionParam && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium border border-indigo-200">
              Condition: {CONDITION_CONFIG[conditionParam]?.label || conditionParam}
              <button onClick={() => updateParams({ condition: '' })}>
                <X className="w-3 h-3 ml-1 hover:text-indigo-900" />
              </button>
            </span>
          )}

          {(minPriceParam || maxPriceParam) && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium border border-indigo-200">
              Price: ₹{minPriceParam || '0'} - ₹{maxPriceParam || '∞'}
              <button onClick={() => updateParams({ min_price: '', max_price: '' })}>
                <X className="w-3 h-3 ml-1 hover:text-indigo-900" />
              </button>
            </span>
          )}

          <button
            onClick={handleResetFilters}
            className="text-xs text-rose-600 hover:text-rose-700 font-semibold ml-2 hover:underline"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Main Content Layout (Sidebar + Product Grid) */}
      <div className="flex items-start gap-8">
        {/* Filter Drawer / Sidebar */}
        <FilterDrawer
          isOpen={mobileFiltersOpen}
          onClose={() => setMobileFiltersOpen(false)}
          categories={categories}
          selectedCategory={categoryParam}
          onSelectCategory={handleCategorySelect}
          selectedCondition={conditionParam}
          onSelectCondition={handleConditionSelect}
          minPrice={minPriceParam}
          maxPrice={maxPriceParam}
          onMinPriceChange={handleMinPriceChange}
          onMaxPriceChange={handleMaxPriceChange}
          ordering={orderingParam}
          onOrderingChange={handleOrderingChange}
          onResetFilters={handleResetFilters}
          totalResults={totalCount}
        />

        {/* Product Grid & Pagination Area */}
        <div className="flex-1 w-full space-y-6">
          {error ? (
            <ErrorMessage message={error} onRetry={fetchProducts} />
          ) : (
            <>
              <ProductGrid
                products={products}
                categories={categories}
                loading={loading}
                emptyTitle="No listings match your search"
                emptyDescription="Try clearing your filters or searching with different keywords."
                emptyActionText="Clear All Filters"
                onEmptyActionClick={handleResetFilters}
              />

              {/* Pagination */}
              {!loading && totalCount > 10 && (
                <Pagination
                  currentPage={pageParam}
                  totalCount={totalCount}
                  pageSize={10}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
