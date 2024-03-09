import { MaterialIcons } from '@expo/vector-icons';
import { Redirect, Stack } from 'expo-router';
import { ActivityIndicator, StatusBar, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { api } from '~/utils/trpc';

export default function AuthLayout() {
  const insets = useSafeAreaInsets();
  const isLoggedInQuery = api.auth.isLoggedIn.useQuery();

  if (isLoggedInQuery.isLoading || isLoggedInQuery.data === undefined)
    return <ActivityIndicator />;

  if (isLoggedInQuery.data) return <Redirect href="/(main)/(tabs)/" />;

  return (
    <>
      <StatusBar animated barStyle="light-content" />
      <>
        <View
          className="bg-primary items-center rounded-b-3xl p-10"
          style={{ paddingTop: insets.top + 40 }}
        >
          <MaterialIcons name="translate" size={60} color="white" />
          <Text className="text-2xl font-semibold text-white">SWARDify</Text>
          <Text className="text-center text-muted text-balance">
            A Bidirectional Swardspeak and Tagalog Translator
          </Text>
        </View>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />
      </>
    </>
  );
}
