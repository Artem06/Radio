import { useState, useCallback, useEffect, useRef } from 'react';
import type { SleepTimer } from '@/types';

export function useSleepTimer(onTimerEnd: () => void) {
  const [timer, setTimer] = useState<SleepTimer>({
    isActive: false,
    remainingMinutes: 0,
    endTime: null,
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Start sleep timer
   */
  const startTimer = useCallback((minutes: number) => {
    const endTime = Date.now() + minutes * 60 * 1000;

    setTimer({
      isActive: true,
      remainingMinutes: minutes,
      endTime,
    });
  }, []);

  /**
   * Cancel sleep timer
   */
  const cancelTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    setTimer({
      isActive: false,
      remainingMinutes: 0,
      endTime: null,
    });
  }, []);

  /**
   * Update timer every second
   */
  useEffect(() => {
    if (!timer.isActive || !timer.endTime) {
      return;
    }

    intervalRef.current = setInterval(() => {
      const remaining = Math.max(0, timer.endTime! - Date.now());
      const remainingMinutes = Math.ceil(remaining / 1000 / 60);

      if (remaining <= 0) {
        cancelTimer();
        onTimerEnd();
      } else {
        setTimer((prev) => ({
          ...prev,
          remainingMinutes,
        }));
      }
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timer.isActive, timer.endTime, onTimerEnd, cancelTimer]);

  return {
    timer,
    startTimer,
    cancelTimer,
  };
}
