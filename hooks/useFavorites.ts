import { useState, useEffect, useCallback } from 'react';
import * as storageService from '@/services/storage';
import type { Station } from '@/types';

export function useFavorites() {
  const [favorites, setFavorites] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);

  /**
   * Load favorites from storage
   */
  const loadFavorites = useCallback(async () => {
    try {
      setLoading(true);
      const data = await storageService.getFavorites();
      setFavorites(data);
    } catch (error) {
      console.error('Failed to load favorites:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Check if station is favorite
   */
  const checkIsFavorite = useCallback(
    (stationId: string): boolean => {
      return favorites.some((fav) => fav.id === stationId);
    },
    [favorites]
  );

  /**
   * Toggle favorite status
   */
  const toggleFavorite = useCallback(
    async (station: Station) => {
      try {
        const isFav = checkIsFavorite(station.id);

        if (isFav) {
          await storageService.removeFavorite(station.id);
          setFavorites((prev) => prev.filter((fav) => fav.id !== station.id));
        } else {
          await storageService.addFavorite(station);
          setFavorites((prev) => [...prev, station]);
        }
      } catch (error) {
        console.error('Failed to toggle favorite:', error);
        throw error;
      }
    },
    [checkIsFavorite]
  );

  // Initial load
  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  return {
    favorites,
    loading,
    checkIsFavorite,
    toggleFavorite,
    refresh: loadFavorites,
  };
}
