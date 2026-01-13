import { Audio } from 'expo-av';
import type { Station } from '@/types';

let soundInstance: Audio.Sound | null = null;

/**
 * Initialize audio mode for background playback
 */
export async function initializeAudioMode(): Promise<void> {
  try {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
      shouldDuckAndroid: true,
    });
  } catch (error) {
    console.error('Failed to set audio mode:', error);
    throw error;
  }
}

/**
 * Play a radio station
 */
export async function playStation(station: Station): Promise<Audio.Sound> {
  try {
    // Unload previous sound if exists
    if (soundInstance) {
      await soundInstance.unloadAsync();
      soundInstance = null;
    }

    // Create new sound instance
    const { sound } = await Audio.Sound.createAsync(
      { uri: station.stream_url },
      { shouldPlay: true, isLooping: false },
      null,
      true // Download first (streaming)
    );

    soundInstance = sound;
    return sound;
  } catch (error) {
    console.error('Failed to play station:', error);
    throw error;
  }
}

/**
 * Pause playback
 */
export async function pausePlayback(): Promise<void> {
  try {
    if (soundInstance) {
      await soundInstance.pauseAsync();
    }
  } catch (error) {
    console.error('Failed to pause playback:', error);
    throw error;
  }
}

/**
 * Resume playback
 */
export async function resumePlayback(): Promise<void> {
  try {
    if (soundInstance) {
      await soundInstance.playAsync();
    }
  } catch (error) {
    console.error('Failed to resume playback:', error);
    throw error;
  }
}

/**
 * Stop playback and cleanup
 */
export async function stopPlayback(): Promise<void> {
  try {
    if (soundInstance) {
      await soundInstance.stopAsync();
      await soundInstance.unloadAsync();
      soundInstance = null;
    }
  } catch (error) {
    console.error('Failed to stop playback:', error);
    throw error;
  }
}

/**
 * Get current sound instance
 */
export function getSoundInstance(): Audio.Sound | null {
  return soundInstance;
}

/**
 * Set volume (0.0 to 1.0)
 */
export async function setVolume(volume: number): Promise<void> {
  try {
    if (soundInstance) {
      await soundInstance.setVolumeAsync(Math.max(0, Math.min(1, volume)));
    }
  } catch (error) {
    console.error('Failed to set volume:', error);
    throw error;
  }
}
