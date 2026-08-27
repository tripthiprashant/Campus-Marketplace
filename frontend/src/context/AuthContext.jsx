import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('cm_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(true);

  // Initialize and verify user profile if access token is in localStorage
  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem('cm_access_token');
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const profile = await authService.getProfile();
      setUser(profile);
      localStorage.setItem('cm_user', JSON.stringify(profile));
    } catch (err) {
      console.warn('Session check failed or expired:', err?.response?.status);
      // If refresh token exists, api interceptor might refresh, otherwise clear
      if (err?.response?.status === 401) {
        localStorage.removeItem('cm_access_token');
        localStorage.removeItem('cm_refresh_token');
        localStorage.removeItem('cm_user');
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();

    // Listen for custom logout event dispatched by Axios interceptor on token expiry
    const handleForceLogout = () => {
      setUser(null);
    };

    window.addEventListener('auth:logout', handleForceLogout);
    return () => window.removeEventListener('auth:logout', handleForceLogout);
  }, [checkAuth]);

  /**
   * Log in user with credentials
   */
  const login = async (username, password) => {
    setLoading(true);
    try {
      const tokenData = await authService.login({ username, password });
      localStorage.setItem('cm_access_token', tokenData.access);
      localStorage.setItem('cm_refresh_token', tokenData.refresh);

      const profile = await authService.getProfile();
      setUser(profile);
      localStorage.setItem('cm_user', JSON.stringify(profile));
      return profile;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Register a new user
   */
  const register = async (userData) => {
    setLoading(true);
    try {
      const newUser = await authService.register(userData);
      return newUser;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Log out user and clear storage
   */
  const logout = () => {
    localStorage.removeItem('cm_access_token');
    localStorage.removeItem('cm_refresh_token');
    localStorage.removeItem('cm_user');
    setUser(null);
  };

  /**
   * Update user profile data
   */
  const updateProfile = async (profileData) => {
    const updated = await authService.updateProfile(profileData);
    setUser(updated);
    localStorage.setItem('cm_user', JSON.stringify(updated));
    return updated;
  };

  /**
   * Refresh profile from backend
   */
  const refreshProfile = async () => {
    if (!localStorage.getItem('cm_access_token')) return;
    try {
      const profile = await authService.getProfile();
      setUser(profile);
      localStorage.setItem('cm_user', JSON.stringify(profile));
    } catch (e) {
      console.error('Failed to refresh user profile', e);
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
