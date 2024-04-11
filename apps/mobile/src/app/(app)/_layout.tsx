import { Stack } from "expo-router";

export default function AppLayout() {
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
