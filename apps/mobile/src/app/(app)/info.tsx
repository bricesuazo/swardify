import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button, Colors, Text, View } from "react-native-ui-lib";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";

export default function InfoPage() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  return (
    <View
      flex-1
      style={{ paddingTop: Platform.OS === "android" ? insets.top : 0 }}
    >
      <View
        paddingV-8
        style={{
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <View height={40} width={40} center>
          {Platform.OS === "android" && (
            <Button
              link
              onPress={() =>
                router.canGoBack() ? router.back() : router.replace("/")
              }
              iconSource={() => (
                <Feather
                  name="chevron-left"
                  size={24}
                  color={Colors.$iconPrimary}
                />
              )}
              round
            />
          )}
        </View>
        <Text text60>Information</Text>
        <View height={40} width={40} center />
      </View>
    </View>
  );
}
