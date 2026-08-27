import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ShoppingBag,
  Search,
  PlusCircle,
  Heart,
  User,
  LogOut,
  Package,
  Inbox,
  Menu,
  X,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useFavorites } from '../../context/FavoriteContext';
import { getImageUrl, getAvatarPlaceholder } from '../../utils/imageHelper';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { favorites } = useFavorites();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuRef = useRef(null);

  // Close menus on route change
  useEffect(() => {
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Click outside to close user menu
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/products');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const avatarUrl = user?.profile_image
    ? getImageUrl(user.profile_image, 'avatar')
    : getAvatarPlaceholder(user?.username);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 leading-none">
                Campus<span className="text-indigo-600">Market</span>
              </span>
              <span className="text-[10px] font-medium text-slate-500 tracking-wider uppercase mt-0.5">
                Student Exchange
              </span>
            </div>
          </Link>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="text"
                placeholder="Search textbooks, calculators, furniture..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </form>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 text-sm font-medium text-slate-600">
            <Link
              to="/"
              className={`px-3.5 py-2 rounded-xl hover:text-indigo-600 hover:bg-slate-50 transition-colors ${
                location.pathname === '/' ? 'text-indigo-600 font-semibold bg-indigo-50/50' : ''
              }`}
            >
              Home
            </Link>
            <Link
              to="/products"
              className={`px-3.5 py-2 rounded-xl hover:text-indigo-600 hover:bg-slate-50 transition-colors ${
                location.pathname === '/products' ? 'text-indigo-600 font-semibold bg-indigo-50/50' : ''
              }`}
            >
              Browse
            </Link>
          </nav>

          {/* Right Action Icons & Auth */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            
            {/* Sell Button */}
            <Link
              to="/add-product"
              className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white text-xs sm:text-sm font-semibold shadow-sm shadow-indigo-200 active:scale-[0.98] transition-all flex-shrink-0"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Sell Item</span>
            </Link>

            {/* Wishlist Link (if logged in or always with count) */}
            <Link
              to="/favorites"
              className="relative p-2 rounded-xl text-slate-600 hover:text-indigo-600 hover:bg-slate-50 transition-colors"
              title="Saved Items"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {favorites.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {favorites.length > 9 ? '9+' : favorites.length}
                </span>
              )}
            </Link>

            {/* User Dropdown / Login State */}
            {isAuthenticated && user ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setUserMenuOpen((prev) => !prev)}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  aria-expanded={userMenuOpen}
                  aria-label="User menu"
                >
                  <img
                    src={avatarUrl}
                    alt={user.username}
                    className="w-8 h-8 rounded-lg object-cover border border-slate-200"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = getAvatarPlaceholder(user.username);
                    }}
                  />
                  <span className="hidden sm:block text-xs font-semibold text-slate-800 max-w-[100px] truncate">
                    {user.username}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
                </button>

                {/* Dropdown Menu */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-fade-in divide-y divide-slate-100">
                    <div className="px-4 py-2.5">
                      <p className="text-xs font-semibold text-slate-900 truncate">{user.username}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                      {user.college && (
                        <p className="text-[10px] text-indigo-600 font-medium truncate mt-0.5">
                          🎓 {user.college}
                        </p>
                      )}
                    </div>

                    <div className="py-1">
                      <Link
                        to="/profile"
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-indigo-600"
                      >
                        <User className="w-4 h-4 text-slate-400" />
                        My Profile
                      </Link>
                      <Link
                        to="/my-listings"
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-indigo-600"
                      >
                        <Package className="w-4 h-4 text-slate-400" />
                        My Listings
                      </Link>
                      <Link
                        to="/my-listings?tab=received"
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-indigo-600"
                      >
                        <Inbox className="w-4 h-4 text-slate-400" />
                        Purchase Requests
                      </Link>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4 text-rose-500" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-indigo-600 hover:bg-slate-50 rounded-xl transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-2 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-sm transition-all"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-slate-100 animate-fade-in space-y-4">
            {/* Mobile Search */}
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </form>

            <nav className="flex flex-col gap-1 text-sm font-medium text-slate-700">
              <Link
                to="/"
                className="px-3.5 py-2.5 rounded-xl hover:bg-slate-50 hover:text-indigo-600 transition-colors"
              >
                Home
              </Link>
              <Link
                to="/products"
                className="px-3.5 py-2.5 rounded-xl hover:bg-slate-50 hover:text-indigo-600 transition-colors"
              >
                Browse All Products
              </Link>
              <Link
                to="/favorites"
                className="px-3.5 py-2.5 rounded-xl hover:bg-slate-50 hover:text-indigo-600 transition-colors flex items-center justify-between"
              >
                <span>Saved Wishlist</span>
                {favorites.length > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-xs font-bold">
                    {favorites.length}
                  </span>
                )}
              </Link>

              {isAuthenticated ? (
                <>
                  <div className="pt-2 border-t border-slate-100">
                    <p className="px-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                      Account
                    </p>
                    <Link
                      to="/profile"
                      className="px-3.5 py-2 rounded-xl hover:bg-slate-50 hover:text-indigo-600 flex items-center gap-2.5"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      My Profile
                    </Link>
                    <Link
                      to="/my-listings"
                      className="px-3.5 py-2 rounded-xl hover:bg-slate-50 hover:text-indigo-600 flex items-center gap-2.5"
                    >
                      <Package className="w-4 h-4 text-slate-400" />
                      My Listings
                    </Link>
                    <Link
                      to="/my-listings?tab=received"
                      className="px-3.5 py-2 rounded-xl hover:bg-slate-50 hover:text-indigo-600 flex items-center gap-2.5"
                    >
                      <Inbox className="w-4 h-4 text-slate-400" />
                      Purchase Requests
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3.5 py-2 rounded-xl text-rose-600 hover:bg-rose-50 flex items-center gap-2.5"
                    >
                      <LogOut className="w-4 h-4 text-rose-500" />
                      Sign Out
                    </button>
                  </div>
                </>
              ) : (
                <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
                  <Link
                    to="/login"
                    className="w-full text-center py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    className="w-full text-center py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
