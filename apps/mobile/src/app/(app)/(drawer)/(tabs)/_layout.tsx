import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button, Colors, View } from "react-native-ui-lib";
import { Link, Tabs, useNavigation } from "expo-router";
import { AntDesign, Feather, MaterialIcons } from "@expo/vector-icons";
import { DrawerActions } from "@react-navigation/native";

import { useStore } from "~/store";
import { api } from "~/utils/api";

export default function TabLayout() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const topbarStyle = useStore((state) => state.topbarStyle);
  const isLoggedInQuery = api.auth.isLoggedIn.useQuery();

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: Colors.$iconPrimary,
        }}
      >
        <Tabs.Screen
          name="search"
          options={{
            title: "Search",
            tabBarIcon: ({ color, size }) => (
              <AntDesign name="search1" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="index"
          options={{
            title: "Translate",
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="translate" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: "Settings",
            tabBarIcon: ({ color, size }) => (
              <AntDesign name="setting" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
      <View
        style={{
          paddingTop: insets.top,
          position: "absolute",
          top: 0,
        }}
      >
        <View
          style={{
            height: 60,
            paddingHorizontal: 20,
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
            alignItems: "center",
          }}
        >
          <Button
            onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
            iconSource={() => (
              <Feather
                name="menu"
                size={24}
                color={topbarStyle === "light" ? "white" : "black"}
              />
            )}
            bg-transparent
          />

          <MaterialIcons
            name="translate"
            size={32}
            color={topbarStyle === "light" ? "white" : Colors.$iconPrimary}
          />

          <Link
            href={isLoggedInQuery.data ? "/favorites" : "/(app)/auth"}
            asChild
            push
          >
            <Button
              iconSource={() => (
                <Feather
                  name="heart"
                  size={24}
                  color={topbarStyle === "light" ? "white" : "black"}
                />
              )}
              bg-transparent
            />
          </Link>
        </View>
      </View>
    </>
  );
}