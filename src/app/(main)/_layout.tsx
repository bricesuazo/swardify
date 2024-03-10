import { Redirect, Stack } from 'expo-router';
import { ActivityIndicator } from 'react-native';
import { api } from '~/utils/trpc';

export default function MainLayout() {
  const isLoggedInQuery = api.auth.isLoggedIn.useQuery();

  if (isLoggedInQuery.isLoading || isLoggedInQuery.data === undefined)
    return <ActivityIndicator />;

  if (!isLoggedInQuery.data) return <Redirect href="/(auth)/auth" />;

  return <Stack screenOptions={{ headerShown: false }} />;
}
