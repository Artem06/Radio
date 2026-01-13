import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AlertProvider } from '@/template';
import { RadioProvider } from '@/contexts/RadioContext';
import { Colors } from '@/constants/theme';

export default function RootLayout() {
  return (
    <AlertProvider>
      <SafeAreaProvider>
        <RadioProvider>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: Colors.background },
              animation: 'fade',
            }}
          >
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="player"
              options={{
                presentation: 'modal',
                animation: 'slide_from_bottom',
              }}
            />
            <Stack.Screen name="category/[id]" options={{ headerShown: true }} />
            <Stack.Screen name="settings" options={{ headerShown: true }} />
          </Stack>
        </RadioProvider>
      </SafeAreaProvider>
    </AlertProvider>
  );
}
