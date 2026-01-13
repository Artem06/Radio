// API Configuration
export const API_CONFIG = {
  // Base URL for admin panel API
  // Change this to your actual API endpoint
  BASE_URL: 'http://photo.24lumo-media.ru/api/',
  // API endpoints
  ENDPOINTS: {
    CATEGORIES: '/categories',
    STATIONS: '/stations',
    STATIONS_BY_CATEGORY: '/stations?category_id=',
  },
  
  // Request timeout
  TIMEOUT: 10000,
};

// Sleep timer presets (in minutes)
export const SLEEP_TIMER_PRESETS = [15, 30, 60];

// Local storage keys
export const STORAGE_KEYS = {
  FAVORITES: '@radio_favorites',
  CACHED_STATIONS: '@radio_cached_stations',
  CACHED_CATEGORIES: '@radio_cached_categories',
  THEME: '@radio_theme',
};

// Player configuration
export const PLAYER_CONFIG = {
  // Update interval for metadata (in ms)
  METADATA_UPDATE_INTERVAL: 5000,
  
  // Buffer configuration
  BUFFER_FOR_PLAYBACK_MS: 2500,
  BUFFER_FOR_PLAYBACK_AFTER_REBUFFER_MS: 5000,
};
