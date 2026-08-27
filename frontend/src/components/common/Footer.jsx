import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ShieldCheck, HeartHandshake, Zap, Sparkles } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200/80 mt-20">
      {/* Top Banner / Value Props */}
      <div className="border-b border-slate-100 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 flex-shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">Verified Campus Community</h4>
                <p className="text-xs text-slate-500 mt-0.5">Trade directly with fellow students from your college.</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">Zero Commission Fees</h4>
                <p className="text-xs text-slate-500 mt-0.5">Keep 100% of your earnings when selling your items.</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 flex-shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">Instant Meet & Exchange</h4>
                <p className="text-xs text-slate-500 mt-0.5">No shipping delays — meet safely on campus or dorms.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-slate-900">
                Campus<span className="text-indigo-600">Market</span>
              </span>
            </Link>
            <p className="text-sm text-slate-500 max-w-sm leading-relaxed">
              Buy. Sell. Connect. Within Your Campus. The dedicated student marketplace for affordable textbooks, electronics, calculators, dorm supplies, and study notes.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-lg w-fit border border-indigo-100">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Built for students, by students</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-500">
              <li>
                <Link to="/products" className="hover:text-indigo-600 transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/products?ordering=-created_at" className="hover:text-indigo-600 transition-colors">
                  Newest Listings
                </Link>
              </li>
              <li>
                <Link to="/add-product" className="hover:text-indigo-600 transition-colors">
                  Sell an Item
                </Link>
              </li>
              <li>
                <Link to="/favorites" className="hover:text-indigo-600 transition-colors">
                  Saved Wishlist
                </Link>
              </li>
            </ul>
          </div>

          {/* Safety & Guidelines */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">
              Safety & Rules
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-500">
              <li className="text-xs leading-relaxed">
                Meet in public campus areas (Library, Student Center, Cafeteria).
              </li>
              <li className="text-xs leading-relaxed">
                Inspect items before finalizing payment with the seller.
              </li>
              <li className="text-xs leading-relaxed">
                Report suspicious listings to campus admins.
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-12 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Campus Marketplace. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Safe Campus Trading Community
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
