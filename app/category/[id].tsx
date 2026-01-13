import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Screen } from '@/components/layout/Screen';
import { StationCard } from '@/components/ui/StationCard';
import { MiniPlayer } from '@/components/ui/MiniPlayer';
import { useRadio } from '@/hooks/useRadio';
import { Colors, Typography, Spacing } from '@/constants/theme';

export default function CategoryScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();

  const {
    categories,
    getStationsByCategory,
    checkIsFavorite,
    toggleFavorite,
    currentStation,
    status,
    isBuffering,
    currentTrack,
    playStation,
    togglePlayPause,
  } = useRadio();

  const category = categories.find((cat) => cat.id === id);
  const stations = getStationsByCategory(id!);
  const isPlaying = status === 'playing';
  const showMiniPlayer = currentStation !== null && status !== 'idle';

  return (
    <Screen edges={[]}>
      <Stack.Screen
        options={{
          title: category?.name || 'Категория',
          headerStyle: {
            backgroundColor: Colors.surface,
          },
          headerTintColor: Colors.onSurface,
          headerTitleStyle: {
            ...Typography.headlineMedium,
          },
        }}
      />

      <ScrollView
        style={styles.content}
        contentContainerStyle={[
          styles.contentContainer,
          showMiniPlayer && { paddingBottom: 80 },
        ]}
      >
        {stations.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Нет станций</Text>
            <Text style={styles.emptyMessage}>
              В этой категории пока нет доступных станций
            </Text>
          </View>
        ) : (
          <>
            <Text style={styles.stationCount}>
              {stations.length} {stations.length === 1 ? 'станция' : 'станций'}
            </Text>
            {stations.map((station) => (
              <StationCard
                key={station.id}
                station={station}
                isFavorite={checkIsFavorite(station.id)}
                isPlaying={currentStation?.id === station.id && isPlaying}
                onPress={() => playStation(station)}
                onToggleFavorite={() => toggleFavorite(station)}
              />
            ))}
          </>
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
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: Spacing.md,
  },
  stationCount: {
    ...Typography.bodyMedium,
    color: Colors.textSubtle,
    marginBottom: Spacing.md,
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
  },
  emptyMessage: {
    ...Typography.bodyMedium,
    color: Colors.textSubtle,
    textAlign: 'center',
    marginTop: Spacing.sm,
    paddingHorizontal: Spacing.xl,
  },
});
