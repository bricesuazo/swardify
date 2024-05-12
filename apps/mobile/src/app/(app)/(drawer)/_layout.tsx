import { ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button, View } from "react-native-ui-lib";
import { router, useNavigation } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { DrawerActions } from "@react-navigation/native";

import { api } from "~/utils/api";
import { supabase } from "~/utils/supabase";

export default function DrawerLayout() {
  const utils = api.useUtils();
  const isLoggedInQuery = api.auth.isLoggedIn.useQuery();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  return (
    <Drawer
      screenOptions={{
        headerShown: false,
        swipeMinDistance: 10,
        swipeEdgeWidth: 1000,
      }}
      drawerContent={() => (
        <ScrollView style={{ paddingTop: insets.top + 20 }}>
          <View paddingH-16>
            {isLoggedInQuery.data ? (
              <Button
                label="Log out"
                onPress={async () => {
                  await supabase.auth.signOut();
                  await utils.invalidate();

                  if (navigation.canGoBack())
                    navigation.dispatch(DrawerActions.closeDrawer());
                }}
              />
            ) : (
              <Button
                label="Sign in"
                onPress={() => router.push("/(app)/auth")}
              />
            )}
          </View>
        </ScrollView>
      )}
    />
  );
}
