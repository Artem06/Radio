import { createContext, ReactNode, useState } from 'react';
import { useRadioData } from '@/hooks/useRadioData';
import { useFavorites } from '@/hooks/useFavorites';
import { usePlayer } from '@/hooks/usePlayer';
import { useSleepTimer } from '@/hooks/useSleepTimer';
import type { Category, Station } from '@/types';

interface RadioContextType {
  // Data
  categories: Category[];
  stations: Station[];
  loading: boolean;
  error: string | null;
  isRefreshing: boolean;
  refresh: () => void;
  getStationsByCategory: (categoryId: string) => Station[];
  getPopularStations: () => Station[];
  searchStations: (query: string) => Station[];
  
  // Favorites
  favorites: Station[];
  favoritesLoading: boolean;
  checkIsFavorite: (stationId: string) => boolean;
  toggleFavorite: (station: Station) => Promise<void>;
  refreshFavorites: () => void;
  
  // Player
  currentStation: Station | null;
  status: 'idle' | 'loading' | 'playing' | 'paused' | 'error';
  currentTrack: string;
  isBuffering: boolean;
  playerError: string | null;
  volume: number;
  playStation: (station: Station) => Promise<void>;
  togglePlayPause: () => Promise<void>;
  stopPlayback: () => Promise<void>;
  setVolume: (volume: number) => Promise<void>;
  playNext: (stationList: Station[]) => Promise<void>;
  playPrevious: (stationList: Station[]) => Promise<void>;
  
  // Sleep Timer
  sleepTimer: {
    isActive: boolean;
    remainingMinutes: number;
    endTime: number | null;
  };
  startSleepTimer: (minutes: number) => void;
  cancelSleepTimer: () => void;
}

export const RadioContext = createContext<RadioContextType | undefined>(undefined);

export function RadioProvider({ children }: { children: ReactNode }) {
  // Data management
  const {
    categories,
    stations,
    loading,
    error,
    isRefreshing,
    refresh,
    getStationsByCategory,
    getPopularStations,
    searchStations,
  } = useRadioData();

  // Favorites management
  const {
    favorites,
    loading: favoritesLoading,
    checkIsFavorite,
    toggleFavorite,
    refresh: refreshFavorites,
  } = useFavorites();

  // Player management
  const {
    currentStation,
    status,
    currentTrack,
    isBuffering,
    error: playerError,
    volume,
    playStation,
    togglePlayPause,
    stop,
    setVolume,
    playNext,
    playPrevious,
  } = usePlayer();

  // Sleep timer
  const { timer: sleepTimer, startTimer, cancelTimer } = useSleepTimer(async () => {
    await stop();
  });

  return (
    <RadioContext.Provider
      value={{
        // Data
        categories,
        stations,
        loading,
        error,
        isRefreshing,
        refresh,
        getStationsByCategory,
        getPopularStations,
        searchStations,
        
        // Favorites
        favorites,
        favoritesLoading,
        checkIsFavorite,
        toggleFavorite,
        refreshFavorites,
        
        // Player
        currentStation,
        status,
        currentTrack,
        isBuffering,
        playerError,
        volume,
        playStation,
        togglePlayPause,
        stopPlayback: stop,
        setVolume,
        playNext,
        playPrevious,
        
        // Sleep Timer
        sleepTimer,
        startSleepTimer: startTimer,
        cancelSleepTimer: cancelTimer,
      }}
    >
      {children}
    </RadioContext.Provider>
  );
}
