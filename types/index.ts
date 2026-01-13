// API Response Types
export interface Category {
  id: string;
  name: string;
  image_url?: string;
}

export interface Station {
  id: string;
  name: string;
  stream_url: string;
  category_id: string;
  image_url: string;
  is_popular: boolean;
  description?: string;
}

export interface StationWithCategory extends Station {
  category?: Category;
}

// Player State
export type PlaybackStatus = 'idle' | 'loading' | 'playing' | 'paused' | 'error';

export interface PlayerState {
  currentStation: Station | null;
  status: PlaybackStatus;
  currentTrack: string;
  isBuffering: boolean;
  error: string | null;
}

// Sleep Timer
export interface SleepTimer {
  isActive: boolean;
  remainingMinutes: number;
  endTime: number | null;
}
