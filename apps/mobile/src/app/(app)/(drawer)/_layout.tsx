import { ActivityIndicator, Alert, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button, Colors, Text, View } from "react-native-ui-lib";
import { router, useNavigation } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { Feather } from "@expo/vector-icons";
import { DrawerActions } from "@react-navigation/native";

import { api } from "~/utils/api";
import { supabase } from "~/utils/supabase";

export default function DrawerLayout() {
  const utils = api.useUtils();
  const isLoggedInQuery = api.auth.isLoggedIn.useQuery();
  const getContributionsCountQuery = api.mobile.getContributionsCount.useQuery(
    undefined,
    { enabled: !!isLoggedInQuery.data },
  );
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const CONTRIBUTIONS_LABEL = [
    {
      number: 0,
      label: "No contributions yet. :(",
    },
    {
      number: 1,
      label: "Just getting started! :)",
    },
    {
      number: 5,
      label: "You're on a roll! :D",
    },
    {
      number: 10,
      label: "You're doing great! :D",
    },
    {
      number: 25,
      label: "You're a hero! :')",
    },
  ];

  return (
    <Drawer
      screenOptions={{
        headerShown: false,
        swipeMinDistance: 10,
        swipeEdgeWidth: 1000,
      }}
      drawerContent={() => (
        <ScrollView style={{ paddingTop: insets.top + 20 }}>
          <View flex-1 paddingH-16 gap-20>
            <View
              padding-20
              gap-12
              style={{
                borderWidth: 2,
                borderColor: Colors.$iconPrimary,
                borderRadius: 20,
              }}
            >
              <Text center text70BL $textNeutral>
                No. of contributions
              </Text>
              {!isLoggedInQuery.data ? (
                <Text center text60BO>
                  Please sign in to see your contributions.
                </Text>
              ) : !getContributionsCountQuery.data ? (
                <ActivityIndicator />
              ) : (
                <>
                  <Text center text30BO>
                    {getContributionsCountQuery.data}
                  </Text>

                  <Text center text80 $textNeutral>
                    {CONTRIBUTIONS_LABEL.find(
                      (label) =>
                        getContributionsCountQuery.data <= label.number,
                    )?.label ?? "You're doing great! :D"}
                  </Text>
                </>
              )}

              <Button
                label="See all contributions"
                outline
                size={Button.sizes.small}
                onPress={() => router.push("/(app)/(drawer)/(tabs)/contribute")}
              />
            </View>
            {isLoggedInQuery.data ? (
              <Button
                label="Log out"
                iconSource={() => (
                  <Feather
                    name="log-out"
                    size={20}
                    color="white"
                    style={{ marginRight: 8 }}
                  />
                )}
                onPress={() =>
                  Alert.alert("Are you sure you want to log out?", "", [
                    {
                      text: "Cancel",
                      onPress: () => console.log("Cancel Pressed"),
                      style: "cancel",
                    },
                    {
                      text: "OK",
                      onPress: async () => {
                        await supabase.auth.signOut();
                        await utils.invalidate();

                        if (navigation.canGoBack())
                          navigation.dispatch(DrawerActions.closeDrawer());
                      },
                    },
                  ])
                }
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
