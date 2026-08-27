import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';
import favoriteService from '../services/favoriteService';

const FavoriteContext = createContext(null);

export const FavoriteProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const { showSuccess, showError, showInfo } = useToast();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch favorites on login
  const fetchFavorites = useCallback(async () => {
    if (!isAuthenticated) {
      setFavorites([]);
      return;
    }

    try {
      setLoading(true);
      const data = await favoriteService.getFavorites();
      setFavorites(data || []);
    } catch (err) {
      console.warn('Could not fetch favorites:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  // Fast O(1) map of productId -> favoriteId
  const favoriteMap = useMemo(() => {
    const map = new Map();
    favorites.forEach((fav) => {
      // Backend returns { id, product, user, created_at } where product is the product ID
      map.set(fav.product, fav.id);
    });
    return map;
  }, [favorites]);

  const isFavorited = useCallback(
    (productId) => {
      if (!productId) return false;
      return favoriteMap.has(Number(productId)) || favoriteMap.has(String(productId));
    },
    [favoriteMap]
  );

  const getFavoriteId = useCallback(
    (productId) => {
      return favoriteMap.get(Number(productId)) || favoriteMap.get(String(productId)) || null;
    },
    [favoriteMap]
  );

  const toggleFavorite = async (productId, productTitle = 'Item') => {
    if (!isAuthenticated) {
      showInfo('Please log in to save items to your wishlist.');
      return false;
    }

    const numId = Number(productId);
    const existingFavId = getFavoriteId(numId);

    if (existingFavId) {
      // Remove from favorites (optimistic)
      const prevFavorites = [...favorites];
      setFavorites((prev) => prev.filter((fav) => fav.id !== existingFavId));

      try {
        await favoriteService.removeFavorite(existingFavId);
        showSuccess(`Removed "${productTitle}" from wishlist.`);
        return false;
      } catch (err) {
        setFavorites(prevFavorites); // Rollback
        showError('Failed to remove item from wishlist.');
        return true;
      }
    } else {
      // Add to favorites
      try {
        const newFav = await favoriteService.addFavorite(numId);
        setFavorites((prev) => [...prev, newFav]);
        showSuccess(`Saved "${productTitle}" to wishlist!`);
        return true;
      } catch (err) {
        showError('Failed to add item to wishlist.');
        return false;
      }
    }
  };

  const value = {
    favorites,
    loading,
    isFavorited,
    getFavoriteId,
    toggleFavorite,
    refreshFavorites: fetchFavorites,
  };

  return <FavoriteContext.Provider value={value}>{children}</FavoriteContext.Provider>;
};

export const useFavorites = () => {
  const context = useContext(FavoriteContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoriteProvider');
  }
  return context;
};
