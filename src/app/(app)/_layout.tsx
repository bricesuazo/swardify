import { Redirect, Stack } from 'expo-router';
import { LoaderScreen } from 'react-native-ui-lib';
import { api } from '~/utils/trpc';

export default function AppLayout() {
  const isLoggedInQuery = api.auth.isLoggedIn.useQuery();

  if (isLoggedInQuery.isLoading || isLoggedInQuery.data === undefined)
    return <LoaderScreen />;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="info"
        options={{
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="auth"
        options={{
          presentation: 'modal',
        }}
      />
    </Stack>
  );
}
