import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Elevation } from '@/constants/theme';
import type { Category } from '@/types';

interface CategoryCardProps {
  category: Category;
  stationCount: number;
  onPress: () => void;
}

export function CategoryCard({ category, stationCount, onPress }: CategoryCardProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      onPress={onPress}
    >
      {category.image_url ? (
        <Image
          source={{ uri: category.image_url }}
          style={styles.image}
          contentFit="cover"
          transition={200}
        />
      ) : (
        <View style={styles.placeholderImage}>
          <Ionicons name="radio" size={32} color={Colors.primary} />
        </View>
      )}

      <View style={styles.content}>
        <Text style={styles.name}>{category.name}</Text>
        <Text style={styles.count}>
          {stationCount} {stationCount === 1 ? 'станция' : 'станций'}
        </Text>
      </View>

      <Ionicons name="chevron-forward" size={24} color={Colors.onSurfaceVariant} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Elevation.small,
  },
  pressed: {
    opacity: 0.7,
  },
  image: {
    width: 64,
    height: 64,
    borderRadius: Radius.md,
    backgroundColor: Colors.surfaceContainer,
  },
  placeholderImage: {
    width: 64,
    height: 64,
    borderRadius: Radius.md,
    backgroundColor: Colors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  name: {
    ...Typography.headlineSmall,
    color: Colors.onSurface,
    marginBottom: 4,
  },
  count: {
    ...Typography.bodyMedium,
    color: Colors.textSubtle,
  },
});
