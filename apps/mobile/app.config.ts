import type { ConfigContext, ExpoConfig } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "Swardify",
  slug: "swardify",
  scheme: "com.bricesuazo.swardify",
  version: "0.0.2",
  orientation: "portrait",
  primaryColor: "#D300CB",
  userInterfaceStyle: "automatic",
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#D300CB",
  },
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    supportsTablet: true,
    icon: "./assets/icon.png",
  },
  android: {
    package: "com.bricesuazo.swardify",
    versionCode: 2,
    adaptiveIcon: {
      backgroundColor: "#D300CB",
      foregroundImage: "./assets/icon-foreground.png",
      monochromeImage: "./assets/icon-foreground.png",
    },
  },
  extra: {
    eas: {
      projectId: "ea7d1bbc-f1d8-4595-bb54-d7fb618bb5c2",
    },
  },
  experiments: {
    tsconfigPaths: true,
    typedRoutes: true,
  },
  plugins: [
    "expo-router",
    "expo-secure-store",
    [
      "expo-font",
      {
        fonts: ["./assets/fonts/Jua-Regular.ttf"],
      },
    ],
  ],
});
