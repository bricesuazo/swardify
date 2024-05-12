import { ActivityIndicator } from "react-native";
import { RefreshControl } from "react-native-gesture-handler";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import {
  Colors,
  Dash,
  Text,
  TouchableOpacity,
  View,
} from "react-native-ui-lib";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";

import { api } from "~/utils/api";

export default function ContributePage() {
  const insets = useSafeAreaInsets();
  const getContributionsQuery = api.mobile.getAllContributions.useQuery();
  const isLoggedInQuery = api.auth.isLoggedIn.useQuery();
  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingTop: insets.top + 20,
        position: "relative",
      }}
    >
      {getContributionsQuery.isLoading || !getContributionsQuery.data ? (
        <View center padding-20>
          <ActivityIndicator />
        </View>
      ) : (
        <FlashList
          data={getContributionsQuery.data}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={() => (
            <View padding-20>
              <Text center>No contributions yet.</Text>
            </View>
          )}
          ListHeaderComponent={() => (
            <View marginB-20>
              <TouchableOpacity
                activeOpacity={1}
                activeScale={0.96}
                onPress={() =>
                  router.push(
                    isLoggedInQuery.data
                      ? "/(app)/contribute.new"
                      : "/(app)/auth",
                  )
                }
              >
                <View padding-20 center row gap-8 bg-$iconPrimary br60>
                  <Feather name="plus" size={28} color="white" />
                  <Text white text60>
                    {isLoggedInQuery.data
                      ? "Contribute"
                      : "Sign in to contribute"}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
          renderItem={({ item }) => (
            <View
              paddingH-20
              paddingV-24
              br40
              marginB-12
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                borderWidth: 2,
                columnGap: 8,
                borderColor: Colors.$textNeutralLight,
              }}
            >
              <Text text70 flex-1 style={{ fontFamily: "Jua-Regular" }}>
                {item.swardspeak_words.join(" / ")}
              </Text>
              <Dash vertical length={40} />
              <Text
                text70
                flex-1
                style={{
                  textAlign: "right",
                  fontFamily: "Jua-Regular",
                }}
              >
                {item.translated_words.join(" / ")}
              </Text>
            </View>
          )}
          refreshControl={
            <RefreshControl
              refreshing={getContributionsQuery.isLoading}
              onRefresh={() => getContributionsQuery.refetch()}
            />
          }
          estimatedItemSize={100}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          keyboardDismissMode="interactive"
          contentContainerStyle={{ paddingHorizontal: 20 }}
        />
      )}
    </SafeAreaView>
  );
}
