import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Elevation } from '@/constants/theme';
import type { Station } from '@/types';

interface StationCardProps {
  station: Station;
  isFavorite: boolean;
  isPlaying: boolean;
  onPress: () => void;
  onToggleFavorite: () => void;
}

export function StationCard({
  station,
  isFavorite,
  isPlaying,
  onPress,
  onToggleFavorite,
}: StationCardProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed,
        isPlaying && styles.playing,
      ]}
      onPress={onPress}
    >
      <Image
        source={{ uri: station.image_url }}
        style={styles.image}
        contentFit="cover"
        transition={200}
      />
      
      {isPlaying && (
        <View style={styles.playingIndicator}>
          <Ionicons name="radio" size={16} color={Colors.primary} />
        </View>
      )}

      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>
          {station.name}
        </Text>
        {station.description && (
          <Text style={styles.description} numberOfLines={1}>
            {station.description}
          </Text>
        )}
      </View>

      <Pressable
        style={({ pressed }) => [
          styles.favoriteButton,
          pressed && styles.favoritePressed,
        ]}
        onPress={(e) => {
          e.stopPropagation();
          onToggleFavorite();
        }}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      >
        <Ionicons
          name={isFavorite ? 'heart' : 'heart-outline'}
          size={24}
          color={isFavorite ? Colors.primary : Colors.onSurfaceVariant}
        />
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing.sm,
    marginBottom: Spacing.sm,
    ...Elevation.small,
  },
  pressed: {
    opacity: 0.7,
  },
  playing: {
    backgroundColor: Colors.surfaceVariant,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: Radius.sm,
    backgroundColor: Colors.surfaceContainer,
  },
  playingIndicator: {
    position: 'absolute',
    top: Spacing.sm + 4,
    left: Spacing.sm + 4,
    backgroundColor: Colors.background,
    borderRadius: Radius.sm,
    padding: 4,
  },
  content: {
    flex: 1,
    marginLeft: Spacing.md,
    marginRight: Spacing.sm,
  },
  name: {
    ...Typography.bodyLarge,
    color: Colors.onSurface,
    marginBottom: 2,
  },
  description: {
    ...Typography.bodySmall,
    color: Colors.textSubtle,
  },
  favoriteButton: {
    padding: Spacing.xs,
  },
  favoritePressed: {
    opacity: 0.6,
  },
});
