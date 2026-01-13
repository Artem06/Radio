import { useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Screen } from '@/components/layout/Screen';
import { StationCard } from '@/components/ui/StationCard';
import { MiniPlayer } from '@/components/ui/MiniPlayer';
import { useRadio } from '@/hooks/useRadio';
import { Colors, Typography, Spacing, Radius } from '@/constants/theme';

export default function SearchScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');

  const {
    searchStations,
    checkIsFavorite,
    toggleFavorite,
    currentStation,
    status,
    isBuffering,
    currentTrack,
    playStation,
    togglePlayPause,
  } = useRadio();

  const results = searchStations(query);
  const isPlaying = status === 'playing';
  const showMiniPlayer = currentStation !== null && status !== 'idle';

  return (
    <Screen edges={[]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + Spacing.md }]}>
        <Text style={styles.title}>Поиск</Text>
      </View>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color={Colors.onSurfaceVariant}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Название станции..."
          placeholderTextColor={Colors.textSubtle}
          value={query}
          onChangeText={setQuery}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
        />
        {query.length > 0 && (
          <Ionicons
            name="close-circle"
            size={20}
            color={Colors.onSurfaceVariant}
            style={styles.clearIcon}
            onPress={() => setQuery('')}
          />
        )}
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={[
          styles.contentContainer,
          showMiniPlayer && { paddingBottom: 80 },
        ]}
      >
        {query.trim() === '' ? (
          <View style={styles.emptyState}>
            <Ionicons name="search" size={64} color={Colors.onSurfaceVariant} />
            <Text style={styles.emptyTitle}>Введите название станции</Text>
            <Text style={styles.emptyMessage}>
              Поиск по всем доступным радиостанциям
            </Text>
          </View>
        ) : results.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="radio-outline" size={64} color={Colors.onSurfaceVariant} />
            <Text style={styles.emptyTitle}>Ничего не найдено</Text>
            <Text style={styles.emptyMessage}>
              Попробуйте изменить поисковый запрос
            </Text>
          </View>
        ) : (
          <>
            <Text style={styles.resultsCount}>
              Найдено: {results.length} {results.length === 1 ? 'станция' : 'станций'}
            </Text>
            {results.map((station) => (
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
  },
  searchIcon: {
    marginRight: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    ...Typography.bodyLarge,
    color: Colors.onSurface,
    paddingVertical: Spacing.md,
  },
  clearIcon: {
    marginLeft: Spacing.sm,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: Spacing.md,
  },
  resultsCount: {
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
