import { useFonts } from 'expo-font';
import { Slot, usePathname, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { AppState, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Colors } from 'react-native-ui-lib';
import Providers from '~/providers';
import { useStore } from '~/store';
import { supabase } from '~/trpc/supabase';

import '../global.css';

AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

Colors.loadDesignTokens({ primaryColor: '#D300CB' });

export default function RootLayout() {
  const pathname = usePathname();
  const segments = useSegments();
  const setTopbarStyle = useStore((state) => state.setTopbarStyle);

  useFonts({
    'Jua-Regular': require('../../assets/fonts/Jua-Regular.ttf'),
  });

  useEffect(() => {
    if (
      pathname === '/' ||
      pathname === '/auth' ||
      segments.find((segment) => segment === '[word_id]')
    ) {
      StatusBar.setBarStyle('light-content', true);
      setTopbarStyle('light');
    } else {
      StatusBar.setBarStyle('dark-content', true);
      setTopbarStyle('dark');
    }
  }, [pathname, segments]);

  return (
    <Providers>
      <SafeAreaProvider>
        <Slot />
      </SafeAreaProvider>
    </Providers>
  );
}
