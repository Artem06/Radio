import { View, Text, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Screen } from '@/components/layout/Screen';
import { StationCard } from '@/components/ui/StationCard';
import { MiniPlayer } from '@/components/ui/MiniPlayer';
import { useRadio } from '@/hooks/useRadio';
import { Colors, Typography, Spacing } from '@/constants/theme';

export default function FavoritesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    favorites,
    favoritesLoading,
    refreshFavorites,
    checkIsFavorite,
    toggleFavorite,
    currentStation,
    status,
    isBuffering,
    currentTrack,
    playStation,
    togglePlayPause,
  } = useRadio();

  const isPlaying = status === 'playing';
  const showMiniPlayer = currentStation !== null && status !== 'idle';

  return (
    <Screen edges={[]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + Spacing.md }]}>
        <Text style={styles.title}>Избранное</Text>
        <Text style={styles.subtitle}>
          {favorites.length} {favorites.length === 1 ? 'станция' : 'станций'}
        </Text>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={[
          styles.contentContainer,
          showMiniPlayer && { paddingBottom: 80 },
        ]}
        refreshControl={
          <RefreshControl
            refreshing={favoritesLoading}
            onRefresh={refreshFavorites}
            tintColor={Colors.primary}
            colors={[Colors.primary]}
          />
        }
      >
        {favorites.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="heart-outline" size={64} color={Colors.onSurfaceVariant} />
            <Text style={styles.emptyTitle}>Нет избранных станций</Text>
            <Text style={styles.emptyMessage}>
              Добавьте станции в избранное, чтобы быстро находить их здесь
            </Text>
          </View>
        ) : (
          favorites.map((station) => (
            <StationCard
              key={station.id}
              station={station}
              isFavorite={checkIsFavorite(station.id)}
              isPlaying={currentStation?.id === station.id && isPlaying}
              onPress={() => playStation(station)}
              onToggleFavorite={() => toggleFavorite(station)}
            />
          ))
        )}
      </ScrollView>

      {/* Mini Player */}
      {showMiniPlayer && currentStation && (
        <MiniPlayer
          station={currentStation}
          isPlaying={isPlaying}
          isBuffering={isBuffering}
          currentTrack={currentTrack}
          onPress={() => router.push('/player')}
          onTogglePlayPause={togglePlayPause}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    ...Typography.displayMedium,
    color: Colors.onBackground,
  },
  subtitle: {
    ...Typography.bodyMedium,
    color: Colors.textSubtle,
    marginTop: 4,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: Spacing.md,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxl * 2,
  },
  emptyTitle: {
    ...Typography.headlineMedium,
    color: Colors.onSurface,
    marginTop: Spacing.lg,
  },
  emptyMessage: {
    ...Typography.bodyMedium,
    color: Colors.textSubtle,
    textAlign: 'center',
    marginTop: Spacing.sm,
    paddingHorizontal: Spacing.xl,
  },
});
