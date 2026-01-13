import { useState, useCallback, useEffect, useRef } from 'react';
import * as playerService from '@/services/player';
import type { Station, PlaybackStatus } from '@/types';
import { Audio } from 'expo-av';

export function usePlayer() {
  const [currentStation, setCurrentStation] = useState<Station | null>(null);
  const [status, setStatus] = useState<PlaybackStatus>('idle');
  const [currentTrack, setCurrentTrack] = useState('');
  const [isBuffering, setIsBuffering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [volume, setVolumeState] = useState(1.0);
  
  const soundRef = useRef<Audio.Sound | null>(null);

  /**
   * Initialize audio mode
   */
  useEffect(() => {
    playerService.initializeAudioMode();

    return () => {
      // Cleanup on unmount
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  /**
   * Play a station
   */
  const playStation = useCallback(async (station: Station) => {
    try {
      setStatus('loading');
      setError(null);
      setIsBuffering(true);

      const sound = await playerService.playStation(station);
      soundRef.current = sound;

      // Listen to playback status
      sound.setOnPlaybackStatusUpdate((playbackStatus) => {
        if (!playbackStatus.isLoaded) {
          if (playbackStatus.error) {
            setError(`Ошибка воспроизведения: ${playbackStatus.error}`);
            setStatus('error');
          }
          return;
        }

        setIsBuffering(playbackStatus.isBuffering);

        if (playbackStatus.isPlaying) {
          setStatus('playing');
        } else {
          setStatus('paused');
        }
      });

      setCurrentStation(station);
      setCurrentTrack(station.name); // In real scenario, this would be updated from metadata
      setStatus('playing');
    } catch (err) {
      console.error('Failed to play station:', err);
      setError('Не удалось воспроизвести станцию');
      setStatus('error');
    } finally {
      setIsBuffering(false);
    }
  }, []);

  /**
   * Toggle play/pause
   */
  const togglePlayPause = useCallback(async () => {
    try {
      if (status === 'playing') {
        await playerService.pausePlayback();
        setStatus('paused');
      } else if (status === 'paused') {
        await playerService.resumePlayback();
        setStatus('playing');
      }
    } catch (err) {
      console.error('Failed to toggle play/pause:', err);
      setError('Ошибка управления воспроизведением');
    }
  }, [status]);

  /**
   * Stop playback
   */
  const stop = useCallback(async () => {
    try {
      await playerService.stopPlayback();
      setCurrentStation(null);
      setStatus('idle');
      setCurrentTrack('');
      soundRef.current = null;
    } catch (err) {
      console.error('Failed to stop playback:', err);
    }
  }, []);

  /**
   * Set volume
   */
  const setVolume = useCallback(async (newVolume: number) => {
    try {
      await playerService.setVolume(newVolume);
      setVolumeState(newVolume);
    } catch (err) {
      console.error('Failed to set volume:', err);
    }
  }, []);

  /**
   * Play next/previous station (from a station list)
   */
  const playNext = useCallback(
    async (stationList: Station[]) => {
      if (!currentStation || stationList.length === 0) return;

      const currentIndex = stationList.findIndex((s) => s.id === currentStation.id);
      const nextIndex = (currentIndex + 1) % stationList.length;
      await playStation(stationList[nextIndex]);
    },
    [currentStation, playStation]
  );

  const playPrevious = useCallback(
    async (stationList: Station[]) => {
      if (!currentStation || stationList.length === 0) return;

      const currentIndex = stationList.findIndex((s) => s.id === currentStation.id);
      const prevIndex = currentIndex === 0 ? stationList.length - 1 : currentIndex - 1;
      await playStation(stationList[prevIndex]);
    },
    [currentStation, playStation]
  );

  return {
    currentStation,
    status,
    currentTrack,
    isBuffering,
    error,
    volume,
    playStation,
    togglePlayPause,
    stop,
    setVolume,
    playNext,
    playPrevious,
  };
}
