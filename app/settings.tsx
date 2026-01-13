import { View, Text, Pressable, StyleSheet, Alert } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/layout/Screen';
import { clearCache } from '@/services/storage';
import { useAlert } from '@/template';
import { Colors, Typography, Spacing, Radius } from '@/constants/theme';

export default function SettingsScreen() {
  const router = useRouter();
  const { showAlert } = useAlert();

  const handleClearCache = async () => {
    showAlert('Очистить кеш?', 'Все кешированные данные будут удалены', [
      { text: 'Отмена', style: 'cancel' },
      {
        text: 'Очистить',
        style: 'destructive',
        onPress: async () => {
          try {
            await clearCache();
            showAlert('Успешно', 'Кеш очищен');
          } catch (error) {
            showAlert('Ошибка', 'Не удалось очистить кеш');
          }
        },
      },
    ]);
  };

  return (
    <Screen edges={[]}>
      <Stack.Screen
        options={{
          title: 'Настройки',
          headerStyle: {
            backgroundColor: Colors.surface,
          },
          headerTintColor: Colors.onSurface,
          headerTitleStyle: {
            ...Typography.headlineMedium,
          },
        }}
      />

      <View style={styles.content}>
        {/* Cache Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Хранилище</Text>
          
          <Pressable
            style={({ pressed }) => [styles.item, pressed && styles.itemPressed]}
            onPress={handleClearCache}
          >
            <Ionicons name="trash-outline" size={24} color={Colors.error} />
            <View style={styles.itemContent}>
              <Text style={styles.itemTitle}>Очистить кеш</Text>
              <Text style={styles.itemDescription}>
                Удалить кешированные станции и обложки
              </Text>
            </View>
          </Pressable>
        </View>

        {/* App Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>О приложении</Text>
          
          <View style={styles.item}>
            <Ionicons name="information-circle-outline" size={24} color={Colors.onSurfaceVariant} />
            <View style={styles.itemContent}>
              <Text style={styles.itemTitle}>Версия</Text>
              <Text style={styles.itemDescription}>1.0.0</Text>
            </View>
          </View>

          <View style={styles.item}>
            <Ionicons name="mail-outline" size={24} color={Colors.onSurfaceVariant} />
            <View style={styles.itemContent}>
              <Text style={styles.itemTitle}>Контакты</Text>
              <Text style={styles.itemDescription}>support@radio.app</Text>
            </View>
          </View>
        </View>

        {/* API Configuration Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>API</Text>
          
          <View style={styles.infoBox}>
            <Ionicons name="server-outline" size={20} color={Colors.primary} />
            <Text style={styles.infoText}>
              Для подключения вашего API измените BASE_URL в файле constants/config.ts
            </Text>
          </View>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: Spacing.md,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    ...Typography.labelLarge,
    color: Colors.textSubtle,
    marginBottom: Spacing.md,
    marginLeft: Spacing.sm,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  itemPressed: {
    opacity: 0.7,
  },
  itemContent: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  itemTitle: {
    ...Typography.bodyLarge,
    color: Colors.onSurface,
    marginBottom: 2,
  },
  itemDescription: {
    ...Typography.bodySmall,
    color: Colors.textSubtle,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.surfaceVariant,
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
  },
  infoText: {
    ...Typography.bodyMedium,
    color: Colors.onSurfaceVariant,
    marginLeft: Spacing.sm,
    flex: 1,
  },
});
