import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '@/constants/config';
import type { Station, Category } from '@/types';

/**
 * Favorites Management
 */
export async function getFavorites(): Promise<Station[]> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.FAVORITES);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to get favorites:', error);
    return [];
  }
}

export async function addFavorite(station: Station): Promise<void> {
  try {
    const favorites = await getFavorites();
    const exists = favorites.find((fav) => fav.id === station.id);
    
    if (!exists) {
      favorites.push(station);
      await AsyncStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
    }
  } catch (error) {
    console.error('Failed to add favorite:', error);
    throw error;
  }
}

export async function removeFavorite(stationId: string): Promise<void> {
  try {
    const favorites = await getFavorites();
    const filtered = favorites.filter((fav) => fav.id !== stationId);
    await AsyncStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(filtered));
  } catch (error) {
    console.error('Failed to remove favorite:', error);
    throw error;
  }
}

export async function isFavorite(stationId: string): Promise<boolean> {
  try {
    const favorites = await getFavorites();
    return favorites.some((fav) => fav.id === stationId);
  } catch (error) {
    console.error('Failed to check favorite status:', error);
    return false;
  }
}

/**
 * Cache Management
 */
export async function cacheStations(stations: Station[]): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.CACHED_STATIONS, JSON.stringify(stations));
  } catch (error) {
    console.error('Failed to cache stations:', error);
  }
}

export async function getCachedStations(): Promise<Station[]> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.CACHED_STATIONS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to get cached stations:', error);
    return [];
  }
}

export async function cacheCategories(categories: Category[]): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.CACHED_CATEGORIES, JSON.stringify(categories));
  } catch (error) {
    console.error('Failed to cache categories:', error);
  }
}

export async function getCachedCategories(): Promise<Category[]> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.CACHED_CATEGORIES);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to get cached categories:', error);
    return [];
  }
}

export async function clearCache(): Promise<void> {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.CACHED_STATIONS,
      STORAGE_KEYS.CACHED_CATEGORIES,
    ]);
  } catch (error) {
    console.error('Failed to clear cache:', error);
    throw error;
  }
}
