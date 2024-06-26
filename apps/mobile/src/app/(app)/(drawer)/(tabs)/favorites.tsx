import { ActivityIndicator, RefreshControl } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Button, Card, Colors, Text, View } from "react-native-ui-lib";
import { Link, router } from "expo-router";
import { AntDesign, FontAwesome5 } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";

import { api } from "~/utils/api";

export default function FavoritesPage() {
  const insets = useSafeAreaInsets();
  const utils = api.useUtils();
  const isLoggedInQuery = api.auth.isLoggedIn.useQuery();
  const getAllFavoritesQuery = api.mobile.getAllFavorites.useQuery(undefined, {
    enabled: isLoggedInQuery.data,
  });

  const toggleFavoriteMutation = api.mobile.toggleFavorite.useMutation({
    onMutate: ({ id }) => {
      utils.mobile.getAllFavorites.setData(undefined, (words) => {
        if (!words) return;

        return words.filter((word) => word.word_id !== id);
      });
    },
    onSuccess: () =>
      Promise.all([
        utils.mobile.getAllFavorites.invalidate(),
        utils.mobile.getAll.invalidate(),
      ]),
  });
  return (
    <SafeAreaView style={{ flex: 1, paddingTop: insets.top + 20 }}>
      {isLoggedInQuery.isLoading || getAllFavoritesQuery.isLoading ? (
        <ActivityIndicator />
      ) : !isLoggedInQuery.data ? (
        <View padding-20>
          <Text center text70 marginB-20>
            You need to sign in to view your favorites.
          </Text>
          <Card
            activeOpacity={1}
            activeScale={0.96}
            onPress={() => router.push("/(app)/auth")}
          >
            <Card.Section
              bg-$backgroundElevated
              padding-20
              content={[{ text: "Sign In", text70: true, $textDefault: true }]}
              contentStyle={{ alignItems: "center", margin: 0, padding: 0 }}
            />
          </Card>
        </View>
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
                bg-$iconPrimary
                paddingH-20
                paddingV-24
                br40
                marginV-4
                gap-20
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
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

                <View row gap-8 flex-1>
                  <Button
                    iconSource={() => (
                      <AntDesign
                        name="heart"
                        size={16}
                        color="white"
                        style={{ marginRight: 8 }}
                      />
                    )}
                    onPress={() =>
                      toggleFavoriteMutation.mutate({ id: item.word_id })
                    }
                    label="Remove to favorites"
                    outline
                    outlineColor={Colors.white}
                    size="medium"
                    flex-1
                  />
                  <Link href={`/(app)/${item.word_id}`} asChild>
                    <Button
                      iconOnRight
                      iconSource={() => (
                        <FontAwesome5
                          name="arrow-right"
                          size={16}
                          color="white"
                          style={{ marginLeft: 8 }}
                        />
                      )}
                      label="View word"
                      outline
                      outlineColor={Colors.white}
                      size="medium"
                    />
                  </Link>
                </View>
              </View>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}
