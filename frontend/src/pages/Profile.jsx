import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  Mail,
  GraduationCap,
  Phone,
  Camera,
  Package,
  Heart,
  Inbox,
  Loader2,
  CheckCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { getImageUrl, getAvatarPlaceholder } from '../utils/imageHelper';
import { getApiErrorMessage } from '../services/api';

export const Profile = () => {
  const { user, updateProfile, refreshProfile } = useAuth();
  const { showSuccess, showError } = useToast();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    college: '',
    phone: '',
  });

  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        college: user.college || '',
        phone: user.phone || '',
      });
      if (user.profile_image) {
        setAvatarPreview(getImageUrl(user.profile_image, 'avatar'));
      }
    }
  }, [user]);

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showError('Avatar image must be smaller than 5MB');
        return;
      }
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const payload = new FormData();
      if (formData.email) payload.append('email', formData.email.trim());
      if (formData.college) payload.append('college', formData.college.trim());
      if (formData.phone) payload.append('phone', formData.phone.trim());

      if (avatarFile) {
        payload.append('profile_image', avatarFile);
      }

      await updateProfile(payload);
      showSuccess('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      console.error('Update profile error:', err);
      showError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const avatarUrl = avatarPreview || (user?.profile_image
    ? getImageUrl(user.profile_image, 'avatar')
    : getAvatarPlaceholder(user?.username));

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fade-in">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Student Profile
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Manage your campus identity, contact information, and listings.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Column: Avatar & Summary Card */}
        <div className="md:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 text-center shadow-sm relative">
            <div className="relative inline-block mb-4">
              <img
                src={avatarUrl}
                alt={user?.username}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-4 border-slate-50 shadow-md mx-auto bg-slate-100"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = getAvatarPlaceholder(user?.username);
                }}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md transition-all"
                title="Change profile photo"
              >
                <Camera className="w-4 h-4" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>

            <h2 className="text-xl font-bold text-slate-900">{user?.username}</h2>
            <p className="text-xs text-slate-500 mt-0.5">{user?.email}</p>

            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-center gap-2">
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-100">
                <GraduationCap className="w-3.5 h-3.5" />
                {user?.college || 'Campus Member'}
              </span>
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-4 shadow-sm space-y-1">
            <Link
              to="/my-listings"
              className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Package className="w-4 h-4 text-indigo-600" />
                <span>My Listings</span>
              </div>
              <span className="text-slate-400">→</span>
            </Link>

            <Link
              to="/my-listings?tab=received"
              className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Inbox className="w-4 h-4 text-indigo-600" />
                <span>Purchase Requests</span>
              </div>
              <span className="text-slate-400">→</span>
            </Link>

            <Link
              to="/favorites"
              className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Heart className="w-4 h-4 text-rose-500" />
                <span>Saved Wishlist</span>
              </div>
              <span className="text-slate-400">→</span>
            </Link>
          </div>
        </div>

        {/* Right Column: Edit Profile Form */}
        <div className="md:col-span-7">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Account Details</h3>
              {avatarFile && (
                <span className="text-xs font-semibold text-indigo-600 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  New photo selected
                </span>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username (Read Only) */}
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Username
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    disabled
                    value={formData.username}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-medium text-slate-500 cursor-not-allowed"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Username cannot be changed.</p>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="student@university.edu"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* College */}
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  College / University
                </label>
                <div className="relative">
                  <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={formData.college}
                    onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                    placeholder="e.g. Stanford University, IIT Delhi, MIT"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Phone Number (Optional)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. +91 9876543210"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-200 active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
