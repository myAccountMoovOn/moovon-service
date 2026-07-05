import { useEffect, useState } from 'react';
import { PaperProvider } from 'react-native-paper';
import { ThemeProvider, DefaultTheme } from '@react-navigation/native';
import { Slot, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import 'react-native-reanimated';
import { theme } from '../constants/theme';
import { useAuthStore } from '../store/authStore';

export const unstable_settings = {
  anchor: '(auth)',
};

// Prevent the splash screen from auto-hiding while we hydrate state
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const user = useAuthStore((state) => state.user);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Wait for Zustand to finish hydrating from AsyncStorage
    const unsubFinishHydration = useAuthStore.persist.onFinishHydration(() => setIsReady(true));
    
    // If it's already hydrated before the effect runs
    if (useAuthStore.persist.hasHydrated()) {
      setIsReady(true);
    }

    return () => {
      unsubFinishHydration();
    };
  }, []);

  useEffect(() => {
    if (!isReady) return;

    const inAuthGroup = segments[0] === '(auth)';
    
    if (user && inAuthGroup) {
      // User is signed in and trying to access an auth screen -> Redirect to app
      router.replace('/(app)');
    } else if (!user && !inAuthGroup) {
      // User is not signed in and trying to access an app screen -> Redirect to login
      router.replace('/(auth)/login');
    }

    // Now that routing is settled, hide the splash screen
    setTimeout(() => {
      SplashScreen.hideAsync();
    }, 100);

  }, [user, segments, isReady]);

  return (
    <PaperProvider theme={theme}>
      <ThemeProvider value={DefaultTheme}>
        <Slot />
        <StatusBar style="auto" />
      </ThemeProvider>
    </PaperProvider>
  );
}
