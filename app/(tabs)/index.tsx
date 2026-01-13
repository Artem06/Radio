import { View, Text, ScrollView, StyleSheet, RefreshControl, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Screen } from '@/components/layout/Screen';
import { StationCard } from '@/components/ui/StationCard';
import { CategoryCard } from '@/components/ui/CategoryCard';
import { MiniPlayer } from '@/components/ui/MiniPlayer';
import { useRadio } from '@/hooks/useRadio';
import { Colors, Typography, Spacing } from '@/constants/theme';

export default function CatalogScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    categories,
    loading,
    isRefreshing,
    refresh,
    getPopularStations,
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

  const popularStations = getPopularStations();
  const isPlaying = status === 'playing';
  const showMiniPlayer = currentStation !== null && status !== 'idle';

  return (
    <Screen edges={[]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + Spacing.md }]}>
        <View>
          <Text style={styles.greeting}>Радио</Text>
          <Text style={styles.subtitle}>Онлайн станции</Text>
        </View>
        <Pressable
          style={({ pressed }) => [styles.settingsButton, pressed && styles.settingsPressed]}
          onPress={() => router.push('/settings')}
        >
          <Ionicons name="settings-outline" size={24} color={Colors.onSurface} />
        </Pressable>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={[
          styles.contentContainer,
          showMiniPlayer && { paddingBottom: 80 },
        ]}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refresh}
            tintColor={Colors.primary}
            colors={[Colors.primary]}
          />
        }
      >
        {/* Popular Stations */}
        {popularStations.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Популярные</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
            >
              {popularStations.map((station) => (
                <View key={station.id} style={styles.popularCard}>
                  <StationCard
                    station={station}
                    isFavorite={checkIsFavorite(station.id)}
                    isPlaying={currentStation?.id === station.id && isPlaying}
                    onPress={() => playStation(station)}
                    onToggleFavorite={() => toggleFavorite(station)}
                  />
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Категории</Text>
          {categories.map((category) => {
            const stationCount = getStationsByCategory(category.id).length;
            return (
              <CategoryCard
                key={category.id}
                category={category}
                stationCount={stationCount}
                onPress={() => router.push(`/category/${category.id}`)}
              />
            );
          })}
        </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  greeting: {
    ...Typography.displayMedium,
    color: Colors.onBackground,
  },
  subtitle: {
    ...Typography.bodyMedium,
    color: Colors.textSubtle,
    marginTop: 4,
  },
  settingsButton: {
    padding: Spacing.xs,
  },
  settingsPressed: {
    opacity: 0.6,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: Spacing.md,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    ...Typography.headlineMedium,
    color: Colors.onSurface,
    marginBottom: Spacing.md,
  },
  horizontalList: {
    paddingRight: Spacing.md,
  },
  popularCard: {
    width: 300,
    marginRight: Spacing.md,
  },
});
