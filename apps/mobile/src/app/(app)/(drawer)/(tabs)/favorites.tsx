import { ActivityIndicator, FlatList, RefreshControl } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Text, View } from "react-native-ui-lib";

import { api } from "~/utils/api";

export default function FavoritesPage() {
  const insets = useSafeAreaInsets();
  const getAllFavoritesQuery = api.mobile.getAllFavorites.useQuery();
  return (
    <SafeAreaView flex-1 style={{ paddingTop: insets.top }}>
      {!getAllFavoritesQuery.data || getAllFavoritesQuery.isLoading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={getAllFavoritesQuery.data}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 20 }}
          ListEmptyComponent={() => (
            <Text center text70L>
              No favorites yet
            </Text>
          )}
          renderItem={({ item }) => {
            if (!item.word) return null;

            return (
              <View bg-$iconPrimary paddingH-20 paddingV-24 br40 marginV-4>
                <Text
                  $textDefaultLight
                  text50L
                  style={{ fontFamily: "Jua-Regular" }}
                >
                  {item.word.swardspeak_words.join(" / ")}
                </Text>
                <Text
                  $textDefaultLight
                  text
                  text60L
                  style={{ fontFamily: "Jua-Regular" }}
                >
                  {item.word.translated_words.join(" / ")}
                </Text>
              </View>
            );
          }}
          refreshControl={
            <RefreshControl
              refreshing={getAllFavoritesQuery.isRefetching}
              onRefresh={() => getAllFavoritesQuery.refetch()}
            />
          }
        />
      )}
    </SafeAreaView>
  );
}
