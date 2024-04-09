import { LoaderScreen } from "react-native-ui-lib";
import { Stack } from "expo-router";

import { api } from "~/utils/api";

export default function AppLayout() {
  const isLoggedInQuery = api.auth.isLoggedIn.useQuery();

  if (isLoggedInQuery.isLoading || isLoggedInQuery.data === undefined)
    return <LoaderScreen />;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="[word_id]" />
      <Stack.Screen
        name="favorites"
        options={{
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="auth"
        options={{
          presentation: "modal",
        }}
      />
    </Stack>
  );
}
