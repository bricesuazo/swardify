import { useCallback, useEffect } from "react";
import { AppState, Platform, StatusBar } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  Colors,
  ConnectionStatusBar,
  FloatingButton,
  LoaderScreen,
} from "react-native-ui-lib";
import * as Font from "expo-font";
import { Slot, usePathname, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { Feather } from "@expo/vector-icons";

import { useStore } from "~/store";
import { TRPCProvider } from "~/utils/api";
import { supabase } from "~/utils/supabase";

SplashScreen.preventAutoHideAsync();

AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

Colors.loadDesignTokens({ primaryColor: "#D300CB" });

export default function RootLayout() {
  const pathname = usePathname();
  const segments = useSegments();
  const setTopbarStyle = useStore((state) => state.setTopbarStyle);
  const setIsConnected = useStore((state) => state.setIsConnected);
  const isConnected = useStore((state) => state.isConnected);

  const [fontLoaded] = Font.useFonts({
    "Jua-Regular": require("../../assets/fonts/Jua-Regular.ttf"),
  });

  useEffect(() => {
    const theme = Colors.getScheme();

    if (pathname === "/favorites") {
      if (Platform.OS === "ios") {
        StatusBar.setBarStyle("light-content", true);
        return;
      }

      if (theme === "dark") {
        StatusBar.setBarStyle("light-content", true);
      } else {
        StatusBar.setBarStyle("dark-content", true);
      }
      return;
    }

    if (
      pathname === "/" ||
      pathname === "/auth" ||
      segments.find(
        (segment) => segment === "[word_id]" || segment === "[email]",
      )
    ) {
      StatusBar.setBarStyle("light-content", true);
      setTopbarStyle("light");
    } else {
      StatusBar.setBarStyle("dark-content", true);
      setTopbarStyle("dark");
    }
  }, [pathname, segments]);

  const onLayoutRootView = useCallback(async () => {
    if (fontLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontLoaded]);

  if (!fontLoaded) return <LoaderScreen />;
  return (
    <>
      <ConnectionStatusBar
        onConnectionChange={(isConnected) => setIsConnected(isConnected)}
      />
      <TRPCProvider>
        <SafeAreaProvider onLayout={onLayoutRootView}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <Slot />
            <FloatingButton
              visible={!isConnected}
              button={{
                label: "No connection",
                iconSource: () => (
                  <Feather
                    name="wifi-off"
                    size={20}
                    color={Colors.$iconPrimary}
                    style={{ marginRight: 12 }}
                  />
                ),
                outline: true,
                activeOpacity: 1,
              }}
              hideBackgroundOverlay
              bottomMargin={80}
            />
          </GestureHandlerRootView>
        </SafeAreaProvider>
      </TRPCProvider>
    </>
  );
}
