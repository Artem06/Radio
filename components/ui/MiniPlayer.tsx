import { View, Text, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, Radius, Elevation } from '@/constants/theme';
import type { Station } from '@/types';

interface MiniPlayerProps {
  station: Station;
  isPlaying: boolean;
  isBuffering: boolean;
  currentTrack: string;
  onPress: () => void;
  onTogglePlayPause: () => void;
}

export function MiniPlayer({
  station,
  isPlaying,
  isBuffering,
  currentTrack,
  onPress,
  onTogglePlayPause,
}: MiniPlayerProps) {
  const insets = useSafeAreaInsets();

  return (
    <Pressable
      style={[styles.container, { paddingBottom: insets.bottom || Spacing.sm }]}
      onPress={onPress}
    >
      <Image
        source={{ uri: station.image_url }}
        style={styles.image}
        contentFit="cover"
        transition={200}
      />

      <View style={styles.content}>
        <Text style={styles.stationName} numberOfLines={1}>
          {station.name}
        </Text>
        <Text style={styles.trackName} numberOfLines={1}>
          {currentTrack}
        </Text>
      </View>

      <Pressable
        style={({ pressed }) => [styles.playButton, pressed && styles.playButtonPressed]}
        onPress={(e) => {
          e.stopPropagation();
          onTogglePlayPause();
        }}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      >
        {isBuffering ? (
          <ActivityIndicator size="small" color={Colors.primary} />
        ) : (
          <Ionicons
            name={isPlaying ? 'pause' : 'play'}
            size={28}
            color={Colors.primary}
          />
        )}
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    ...Elevation.medium,
  },
  image: {
    width: 48,
    height: 48,
    borderRadius: Radius.sm,
    backgroundColor: Colors.surfaceContainer,
  },
  content: {
    flex: 1,
    marginLeft: Spacing.md,
    marginRight: Spacing.sm,
  },
  stationName: {
    ...Typography.labelLarge,
    color: Colors.onSurface,
    marginBottom: 2,
  },
  trackName: {
    ...Typography.bodySmall,
    color: Colors.textSubtle,
  },
  playButton: {
    padding: Spacing.xs,
  },
  playButtonPressed: {
    opacity: 0.6,
  },
});
