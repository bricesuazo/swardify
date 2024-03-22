import { DrawerActions } from '@react-navigation/native';
import { router, useNavigation } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { SafeAreaView, ScrollView } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Button, View } from 'react-native-ui-lib';
import { supabase } from '~/trpc/supabase';
import { api } from '~/utils/trpc';

export default function DrawerLayout() {
  const utils = api.useUtils();
  const isLoggedInQuery = api.auth.isLoggedIn.useQuery();
  const navigation = useNavigation();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          headerShown: false,
          swipeMinDistance: 10,
          swipeEdgeWidth: 1000,
        }}
        drawerContent={() => (
          <SafeAreaView style={{ flex: 1 }}>
            <ScrollView>
              <View paddingH-16>
                {isLoggedInQuery.data ? (
                  <Button
                    label="Log out"
                    onPress={async () => {
                      await supabase.auth.signOut();
                      await utils.auth.isLoggedIn.refetch();
                      navigation.dispatch(DrawerActions.closeDrawer());
                    }}
                  />
                ) : (
                  <Button
                    label="Sign in"
                    onPress={() => router.push('/(app)/auth')}
                  />
                )}
              </View>
            </ScrollView>
          </SafeAreaView>
        )}
      />
    </GestureHandlerRootView>
  );
}
