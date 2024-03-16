import { MaterialIcons } from '@expo/vector-icons';
import { Redirect, Stack } from 'expo-router';
import { StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LoaderScreen, Text, View } from 'react-native-ui-lib';
import { api } from '~/utils/trpc';

export default function AuthLayout() {
  const insets = useSafeAreaInsets();
  const isLoggedInQuery = api.auth.isLoggedIn.useQuery();

  if (isLoggedInQuery.isLoading || isLoggedInQuery.data === undefined)
    return <LoaderScreen />;

  if (isLoggedInQuery.data) return <Redirect href="/(main)/(tabs)/" />;

  return (
    <>
      <StatusBar animated barStyle="light-content" />
      <>
        <View
          bg-$iconPrimary
          padding-40
          center
          style={{
            paddingTop: insets.top + 40,
            borderBottomStartRadius: 24,
            borderBottomEndRadius: 24,
          }}
        >
          <MaterialIcons name="translate" size={60} color="white" />
          <Text className="font-semibold" white text50>
            SWARDify
          </Text>
          <Text className="text-balance" white>
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
