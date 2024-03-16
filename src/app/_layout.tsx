import { Slot, usePathname, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { AppState, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Colors } from 'react-native-ui-lib';
import Providers from '~/providers';
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
  useEffect(() => {
    if (
      pathname === '/' ||
      segments.find((segment) => segment === '[word_id]')
    ) {
      StatusBar.setBarStyle('light-content');
    } else {
      StatusBar.setBarStyle('dark-content');
    }
  }, [pathname]);
  return (
    <Providers>
      <SafeAreaProvider>
        <Slot />
      </SafeAreaProvider>
    </Providers>
  );
}
