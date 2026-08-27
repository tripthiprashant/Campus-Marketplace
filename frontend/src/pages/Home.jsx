import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Search,
  PlusCircle,
  ArrowRight,
  ShieldCheck,
  Zap,
  Users,
  Sparkles,
  Layers,
  BookOpen,
} from 'lucide-react';
import productService from '../services/productService';
import categoryService from '../services/categoryService';
import ProductGrid from '../components/products/ProductGrid';
import CategoryCard from '../components/products/CategoryCard';
import ErrorMessage from '../components/common/ErrorMessage';
import { useAuth } from '../context/AuthContext';

export const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [heroSearch, setHeroSearch] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [productsData, categoriesData] = await Promise.all([
        productService.getProducts({ ordering: '-created_at' }),
        categoryService.getCategories(),
      ]);

      const items = productsData.results || productsData || [];
      setProducts(items.slice(0, 8)); // Top 8 recent listings
      setCategories(categoriesData || []);
    } catch (err) {
      console.error('Home page fetch error:', err);
      setError('Unable to load latest campus listings. Please make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      navigate(`/products?search=${encodeURIComponent(heroSearch.trim())}`);
    } else {
      navigate('/products');
    }
  };

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-12 sm:pt-16 sm:pb-20 bg-gradient-to-b from-indigo-50/70 via-white to-slate-50 rounded-3xl border border-indigo-100/60 shadow-sm mt-4">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-64 bg-gradient-to-r from-indigo-300/20 via-purple-300/20 to-blue-300/20 blur-3xl rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-indigo-200/80 text-indigo-700 text-xs font-semibold shadow-sm mb-6 animate-fade-in">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>The #1 Peer-to-Peer College Exchange</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15] mb-5">
            Your Campus. <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 bg-clip-text text-transparent">
              Your Marketplace.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed mb-8">
            Buy and sell used textbooks, calculators, dorm furniture, electronics, and study essentials directly with students from your campus.
          </p>

          {/* Hero Search Box */}
          <form onSubmit={handleHeroSearch} className="max-w-2xl mx-auto mb-8">
            <div className="relative flex items-center bg-white rounded-2xl p-1.5 shadow-lg shadow-indigo-100 border border-slate-200/80 focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/10 transition-all">
              <Search className="w-5 h-5 text-slate-400 ml-3 flex-shrink-0" />
              <input
                type="text"
                value={heroSearch}
                onChange={(e) => setHeroSearch(e.target.value)}
                placeholder="What are you looking for today? (e.g. Physics HC Verma, iPad, Lab Coat)"
                className="w-full px-3 py-2.5 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 bg-transparent border-none focus:outline-none focus:ring-0"
              />
              <button
                type="submit"
                className="px-5 py-2.5 sm:py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-indigo-200 transition-all flex-shrink-0"
              >
                Search
              </button>
            </div>
          </form>

          {/* Quick CTA Actions */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold shadow-sm active:scale-95 transition-all"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Browse Products</span>
            </Link>
            <Link
              to={isAuthenticated ? "/add-product" : "/login"}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-800 text-sm font-semibold border border-slate-200/80 shadow-sm active:scale-95 transition-all"
            >
              <PlusCircle className="w-4 h-4 text-indigo-600" />
              <span>Sell an Item</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Explore by Category
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Find exactly what you need for this semester
              </p>
            </div>
            <Link
              to="/products"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-indigo-600 hover:text-indigo-700 group"
            >
              <span>View All</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-5">
            {categories.map((cat) => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </div>
        </section>
      )}

      {/* Featured / Recent Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Recently Listed on Campus
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Fresh items posted by fellow campus members
            </p>
          </div>
          <Link
            to="/products?ordering=-created_at"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-indigo-600 hover:text-indigo-700 group"
          >
            <span>See More</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {error ? (
          <ErrorMessage message={error} onRetry={fetchData} />
        ) : (
          <ProductGrid
            products={products}
            categories={categories}
            loading={loading}
            emptyTitle="No listings posted yet"
            emptyDescription="Be the first student to post an item for sale in your campus!"
            emptyActionText="Sell Your First Item"
            emptyActionLink="/add-product"
          />
        )}
      </section>

      {/* How It Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-tr from-slate-900 to-indigo-950 text-white rounded-3xl p-8 sm:p-14 shadow-xl relative overflow-hidden">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">
              Simple & Safe
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-2">
              How Campus Marketplace Works
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm mt-2">
              Exchange items with students in 3 straightforward steps without delivery fees or intermediaries.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-400 font-extrabold text-lg flex items-center justify-center mb-4">
                1
              </div>
              <h3 className="text-base font-bold text-white mb-2">Find an Item</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Search verified student listings for affordable textbooks, lab coats, gadgets, or dorm essentials.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-400 font-extrabold text-lg flex items-center justify-center mb-4">
                2
              </div>
              <h3 className="text-base font-bold text-white mb-2">Send Purchase Request</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Connect with the seller to reserve the item and agree on a convenient spot on campus to meet up.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-400 font-extrabold text-lg flex items-center justify-center mb-4">
                3
              </div>
              <h3 className="text-base font-bold text-white mb-2">Meet & Trade Safely</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Inspect the product in person at the campus library or student union, pay directly, and finish the deal.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Call to Action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 text-white rounded-3xl p-8 sm:p-12 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Have textbooks or gear you don't use?
            </h3>
            <p className="text-indigo-100 text-sm max-w-xl">
              Turn your unused college supplies into extra cash and help junior students save money.
            </p>
          </div>
          <Link
            to={isAuthenticated ? "/add-product" : "/login"}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-white text-indigo-700 hover:bg-indigo-50 text-sm font-bold shadow-md active:scale-95 transition-all flex-shrink-0"
          >
            <PlusCircle className="w-5 h-5" />
            <span>List Your Item Now</span>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
