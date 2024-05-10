import { ActivityIndicator, RefreshControl } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Text, View } from "react-native-ui-lib";
import { FlashList } from "@shopify/flash-list";

import { api } from "~/utils/api";

export default function FavoritesPage() {
  const insets = useSafeAreaInsets();
  const getAllFavoritesQuery = api.mobile.getAllFavorites.useQuery();
  return (
    <SafeAreaView style={{ flex: 1, paddingTop: insets.top + 20 }}>
      {!getAllFavoritesQuery.data || getAllFavoritesQuery.isLoading ? (
        <ActivityIndicator />
      ) : (
        <FlashList
          data={getAllFavoritesQuery.data}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 20 }}
          estimatedItemSize={100}
          ListEmptyComponent={() => (
            <Text center text70L>
              No favorites yet
            </Text>
          )}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={getAllFavoritesQuery.isRefetching}
              onRefresh={() => getAllFavoritesQuery.refetch()}
            />
          }
          renderItem={({ item }) => {
            if (!item.word) return null;

            return (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
                bg-$iconPrimary
                paddingH-20
                paddingV-24
                br40
                marginV-4
              >
                <Text
                  $textDefaultLight
                  text60L
                  flex-1
                  style={{ fontFamily: "Jua-Regular" }}
                >
                  {item.word.swardspeak_words.join(" / ")}
                </Text>
                <Text
                  $textDefaultLight
                  text
                  text60L
                  flex-1
                  style={{ fontFamily: "Jua-Regular", textAlign: "right" }}
                >
                  {item.word.translated_words.join(" / ")}
                </Text>
              </View>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}
