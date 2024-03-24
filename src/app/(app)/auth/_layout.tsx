import { MaterialIcons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { Redirect, Stack, useRouter } from 'expo-router';
import { StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, LoaderScreen, Text, View } from 'react-native-ui-lib';
import { api } from '~/utils/trpc';

export default function AuthLayout() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const isLoggedInQuery = api.auth.isLoggedIn.useQuery();

  if (isLoggedInQuery.isLoading || isLoggedInQuery.data === undefined)
    return <LoaderScreen />;

  if (isLoggedInQuery.data) return <Redirect href="/(app)/(drawer)/(tabs)/" />;

  return (
    <>
      <StatusBar animated barStyle="light-content" />
      <>
        <View
          bg-$iconPrimary
          padding-40
          center
          style={{
            position: 'relative',
            paddingTop: insets.top + 40,
            borderBottomStartRadius: 24,
            borderBottomEndRadius: 24,
          }}
        >
          {router.canGoBack() && (
            <Button
              onPress={() => router.back()}
              round
              iconSource={() => (
                <Feather
                  name="chevron-left"
                  size={24}
                  color="white"
                  // style={{ transform: 'translateX(-2px)' }}
                />
              )}
              style={{ position: 'absolute', top: insets.top + 8, left: 12 }}
            />
          )}
          <MaterialIcons name="translate" size={60} color="white" />
          <Text white text50>
            SWARDify
          </Text>
          <Text white>A Bidirectional Swardspeak and Tagalog Translator</Text>
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
