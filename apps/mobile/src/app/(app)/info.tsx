import { Linking, Platform, ScrollView } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button, Colors, Text, View } from "react-native-ui-lib";
import { Image } from "expo-image";
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

      <ScrollView>
        <View paddingH-20 style={{ gap: 40 }}>
          <View style={{ gap: 4 }}>
            <View center marginT-8 marginB-20>
              <Image
                source={{
                  uri: "https://raw.githubusercontent.com/bricesuazo/swardify/main/apps/mobile/assets/icon.png",
                }}
                style={{
                  aspectRatio: 1,
                  width: 80,
                  borderRadius: 100,
                }}
              />
            </View>
            <Text center text40H>
              Swardify
            </Text>
            <Text center text70>
              A Bidirectional Swardspeak and Tagalog Translator
            </Text>
          </View>
          <View style={{ gap: 20 }}>
            <Text center text80>
              **This application is for our undergraduate thesis.**
            </Text>
            <Text center text80H>
              Meet the developers:
            </Text>
            <View style={{ gap: 8 }}>
              {[
                {
                  id: 0,
                  name: "Jasmine Franchette Amurao",
                  imageUri:
                    "https://raw.githubusercontent.com/bricesuazo/swardify/main/apps/mobile/assets/devs/jasmine.png",
                  email: "jasminefranchette.amurao@cvsu.edu.ph",
                },
                {
                  id: 1,
                  name: "Lourielene Baldomero",
                  imageUri:
                    "https://raw.githubusercontent.com/bricesuazo/swardify/main/apps/mobile/assets/devs/lourielene.png",
                  email: "lourielene.baldomero@cvsu.edu.ph",
                },

                {
                  id: 2,
                  name: "Rey Anthony De Luna",
                  imageUri:
                    "https://raw.githubusercontent.com/bricesuazo/swardify/main/apps/mobile/assets/devs/rey.png",
                  email: "reyanthony.deluna@cvsu.edu.ph",
                },
                {
                  id: 3,
                  name: "Brice Brine Suazo",
                  imageUri:
                    "https://raw.githubusercontent.com/bricesuazo/swardify/main/apps/mobile/assets/devs/brice.png",
                  email: "bricebrine.suazo@cvsu.edu.ph",
                },
              ].map((developer) => (
                <View
                  key={developer.id}
                  padding-20
                  br40
                  style={{
                    alignItems: "center",
                    flexDirection: "row",
                    borderColor: Colors.$iconPrimary,
                    borderWidth: 1,
                    gap: 16,
                  }}
                >
                  <Image
                    source={{ uri: developer.imageUri }}
                    style={{
                      aspectRatio: 1,
                      width: 60,
                      borderRadius: 100,
                    }}
                  />
                  <View>
                    <Text text70BL>{developer.name}</Text>
                    <TouchableOpacity
                      onPress={() =>
                        Linking.openURL(`mailto:${developer.email}`)
                      }
                    >
                      <Text
                        text80L
                        style={{
                          color: Colors.$iconPrimary,
                          textDecorationLine: "underline",
                        }}
                      >
                        {developer.email}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
