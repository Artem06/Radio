import { View, Text, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Screen } from '@/components/layout/Screen';
import { useRadio } from '@/hooks/useRadio';
import { useAlert } from '@/template';
import { SLEEP_TIMER_PRESETS } from '@/constants/config';
import { Colors, Typography, Spacing, Radius, Elevation } from '@/constants/theme';

export default function PlayerScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { showAlert } = useAlert();

  const {
    currentStation,
    status,
    currentTrack,
    isBuffering,
    volume,
    checkIsFavorite,
    toggleFavorite,
    togglePlayPause,
    setVolume,
    playNext,
    playPrevious,
    stations,
    sleepTimer,
    startSleepTimer,
    cancelSleepTimer,
  } = useRadio();

  if (!currentStation) {
    router.back();
    return null;
  }

  const isPlaying = status === 'playing';
  const isFavorite = checkIsFavorite(currentStation.id);

  const handleSleepTimer = () => {
    if (sleepTimer.isActive) {
      showAlert(
        'Таймер сна активен',
        `Воспроизведение остановится через ${sleepTimer.remainingMinutes} мин`,
        [
          { text: 'Отменить таймер', style: 'destructive', onPress: cancelSleepTimer },
          { text: 'OK', style: 'cancel' },
        ]
      );
    } else {
      showAlert('Таймер сна', 'Выберите время до остановки воспроизведения', [
        {
          text: `${SLEEP_TIMER_PRESETS[0]} мин`,
          onPress: () => startSleepTimer(SLEEP_TIMER_PRESETS[0]),
        },
        {
          text: `${SLEEP_TIMER_PRESETS[1]} мин`,
          onPress: () => startSleepTimer(SLEEP_TIMER_PRESETS[1]),
        },
        {
          text: `${SLEEP_TIMER_PRESETS[2]} мин`,
          onPress: () => startSleepTimer(SLEEP_TIMER_PRESETS[2]),
        },
        { text: 'Отмена', style: 'cancel' },
      ]);
    }
  };

  return (
    <Screen edges={['bottom']}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + Spacing.md }]}>
        <Pressable
          style={({ pressed }) => [styles.headerButton, pressed && styles.headerButtonPressed]}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-down" size={28} color={Colors.onSurface} />
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.headerButton, pressed && styles.headerButtonPressed]}
          onPress={handleSleepTimer}
        >
          <Ionicons
            name={sleepTimer.isActive ? 'timer' : 'timer-outline'}
            size={24}
            color={sleepTimer.isActive ? Colors.primary : Colors.onSurface}
          />
        </Pressable>
      </View>

      {/* Album Art */}
      <View style={styles.albumContainer}>
        <Image
          source={{ uri: currentStation.image_url }}
          style={styles.albumArt}
          contentFit="cover"
          transition={400}
        />
      </View>

      {/* Track Info */}
      <View style={styles.trackInfo}>
        <Text style={styles.stationName} numberOfLines={1}>
          {currentStation.name}
        </Text>
        <Text style={styles.trackName} numberOfLines={2}>
          {currentTrack}
        </Text>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        {/* Favorite */}
        <Pressable
          style={({ pressed }) => [styles.controlButton, pressed && styles.controlButtonPressed]}
          onPress={() => toggleFavorite(currentStation)}
        >
          <Ionicons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={32}
            color={isFavorite ? Colors.primary : Colors.onSurface}
          />
        </Pressable>

        {/* Previous */}
        <Pressable
          style={({ pressed }) => [styles.controlButton, pressed && styles.controlButtonPressed]}
          onPress={() => playPrevious(stations)}
        >
          <Ionicons name="play-skip-back" size={40} color={Colors.onSurface} />
        </Pressable>

        {/* Play/Pause */}
        <Pressable
          style={({ pressed }) => [
            styles.playButton,
            pressed && styles.playButtonPressed,
          ]}
          onPress={togglePlayPause}
        >
          {isBuffering ? (
            <ActivityIndicator size="large" color={Colors.onPrimary} />
          ) : (
            <Ionicons
              name={isPlaying ? 'pause' : 'play'}
              size={48}
              color={Colors.onPrimary}
            />
          )}
        </Pressable>

        {/* Next */}
        <Pressable
          style={({ pressed }) => [styles.controlButton, pressed && styles.controlButtonPressed]}
          onPress={() => playNext(stations)}
        >
          <Ionicons name="play-skip-forward" size={40} color={Colors.onSurface} />
        </Pressable>

        {/* Share (placeholder) */}
        <Pressable
          style={({ pressed }) => [styles.controlButton, pressed && styles.controlButtonPressed]}
          onPress={() => showAlert('Поделиться', 'Функция в разработке')}
        >
          <Ionicons name="share-outline" size={32} color={Colors.onSurface} />
        </Pressable>
      </View>

      {/* Volume */}
      <View style={styles.volumeContainer}>
        <Ionicons name="volume-low" size={24} color={Colors.onSurfaceVariant} />
        <Slider
          style={styles.volumeSlider}
          minimumValue={0}
          maximumValue={1}
          value={volume}
          onValueChange={setVolume}
          minimumTrackTintColor={Colors.primary}
          maximumTrackTintColor={Colors.surfaceVariant}
          thumbTintColor={Colors.primary}
        />
        <Ionicons name="volume-high" size={24} color={Colors.onSurfaceVariant} />
      </View>

      {/* Sleep Timer Indicator */}
      {sleepTimer.isActive && (
        <View style={styles.timerIndicator}>
          <Ionicons name="timer" size={16} color={Colors.primary} />
          <Text style={styles.timerText}>
            Таймер: {sleepTimer.remainingMinutes} мин
          </Text>
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
  },
  headerButton: {
    padding: Spacing.xs,
  },
  headerButtonPressed: {
    opacity: 0.6,
  },
  albumContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
    marginTop: Spacing.xl,
    marginBottom: Spacing.xl,
  },
  albumArt: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: Radius.xl,
    backgroundColor: Colors.surfaceContainer,
    ...Elevation.large,
  },
  trackInfo: {
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.xl,
  },
  stationName: {
    ...Typography.displayLarge,
    color: Colors.onSurface,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  trackName: {
    ...Typography.bodyLarge,
    color: Colors.textSubtle,
    textAlign: 'center',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  controlButton: {
    padding: Spacing.sm,
  },
  controlButtonPressed: {
    opacity: 0.6,
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Elevation.medium,
  },
  playButtonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.95 }],
  },
  volumeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.md,
  },
  volumeSlider: {
    flex: 1,
    marginHorizontal: Spacing.md,
  },
  timerIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surfaceVariant,
    borderRadius: Radius.md,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    marginHorizontal: Spacing.xl,
  },
  timerText: {
    ...Typography.bodyMedium,
    color: Colors.primary,
    marginLeft: Spacing.xs,
  },
});
