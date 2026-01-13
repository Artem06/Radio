import { useState, useEffect, useCallback } from 'react';
import * as apiService from '@/services/api';
import * as storageService from '@/services/storage';
import type { Category, Station } from '@/types';

export function useRadioData() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  /**
   * Load data from API or cache
   */
  const loadData = useCallback(async (showRefreshIndicator = false) => {
    try {
      if (showRefreshIndicator) {
        setIsRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      // Try to fetch from API
      const [fetchedCategories, fetchedStations] = await Promise.all([
        apiService.fetchCategories(),
        apiService.fetchStations(),
      ]);

      setCategories(fetchedCategories);
      setStations(fetchedStations);

      // Cache the data
      await Promise.all([
        storageService.cacheCategories(fetchedCategories),
        storageService.cacheStations(fetchedStations),
      ]);
    } catch (err) {
      console.error('Failed to load data from API, using cache:', err);
      setError('Не удалось загрузить данные. Используется кеш.');

      // Load from cache as fallback
      const [cachedCategories, cachedStations] = await Promise.all([
        storageService.getCachedCategories(),
        storageService.getCachedStations(),
      ]);

      if (cachedCategories.length > 0 || cachedStations.length > 0) {
        setCategories(cachedCategories);
        setStations(cachedStations);
      } else {
        setError('Нет доступных данных. Проверьте подключение к интернету.');
      }
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  /**
   * Refresh data
   */
  const refresh = useCallback(() => {
    loadData(true);
  }, [loadData]);

  /**
   * Get stations by category
   */
  const getStationsByCategory = useCallback(
    (categoryId: string): Station[] => {
      return stations.filter((station) => station.category_id === categoryId);
    },
    [stations]
  );

  /**
   * Get popular stations
   */
  const getPopularStations = useCallback((): Station[] => {
    return stations.filter((station) => station.is_popular);
  }, [stations]);

  /**
   * Search stations
   */
  const searchStations = useCallback(
    (query: string): Station[] => {
      if (!query.trim()) {
        return [];
      }

      const lowerQuery = query.toLowerCase();
      return stations.filter((station) =>
        station.name.toLowerCase().includes(lowerQuery)
      );
    },
    [stations]
  );

  // Initial load
  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    categories,
    stations,
    loading,
    error,
    isRefreshing,
    refresh,
    getStationsByCategory,
    getPopularStations,
    searchStations,
  };
}
