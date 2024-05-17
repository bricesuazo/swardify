import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  TextInput,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button, Colors, Text, View } from "react-native-ui-lib";
import { Link } from "expo-router";
import { AntDesign, FontAwesome5 } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";

import { useDebounceValue } from "~/lib/useDebounceValue";
import { api } from "~/utils/api";

export default function SearchPage() {
  const [search_word, setSearchWord] = useState("");
  const utils = api.useUtils();

  const [debouncedValue, setDebouncedValue] = useDebounceValue(
    search_word,
    500,
  );
  const getAllWordsQuery = api.mobile.getAll.useQuery({
    search_word: debouncedValue,
  });
  const insets = useSafeAreaInsets();
  const isLoggedInQuery = api.auth.isLoggedIn.useQuery();

  const toggleFavoriteMutation = api.mobile.toggleFavorite.useMutation({
    onMutate: ({ id }) => {
      utils.mobile.getAll.setData({ search_word: debouncedValue }, (words) => {
        if (!words) return;

        return words.map((word) => {
          if (word.id === id) {
            return {
              ...word,
              is_favorite: !word.is_favorite,
            };
          }
          return word;
        });
      });
    },
    onSuccess: async () => await utils.mobile.getAllFavorites.refetch(),
  });

  return (
    <View flex-1 style={{ paddingTop: insets.top + 60 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{
          flex: 1,
          rowGap: 20,
        }}
      >
        <View paddingH-20>
          <TextInput
            placeholder="Search word"
            style={{
              borderWidth: 2,
              borderColor: Colors.$iconPrimary,
              padding: 20,
              borderRadius: 999,
              fontSize: 16,
            }}
            placeholderTextColor={Colors.$iconPrimaryLight}
            onChangeText={(text) => {
              setSearchWord(text);
              setDebouncedValue(text);
            }}
            value={search_word}
          />
        </View>

        {getAllWordsQuery.isLoading || !getAllWordsQuery.data ? (
          <ActivityIndicator />
        ) : (
          <FlashList
            keyboardDismissMode="interactive"
            refreshControl={
              <RefreshControl
                refreshing={getAllWordsQuery.isLoading}
                onRefresh={() => getAllWordsQuery.refetch()}
              />
            }
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
            estimatedItemSize={100}
            ListEmptyComponent={() => (
              <Text center style={{ fontFamily: "Jua-Regular" }}>
                No words found
              </Text>
            )}
            data={getAllWordsQuery.data}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View
                style={{ gap: 16 }}
                bg-$iconPrimary
                paddingH-20
                paddingV-24
                br40
                marginV-4
              >
                <View style={{ flexDirection: "row" }}>
                  <Text
                    $textDefaultLight
                    text50L
                    flex-1
                    style={{ fontFamily: "Jua-Regular" }}
                  >
                    {item.swardspeak_words.join(" / ")}
                  </Text>

                  <Text
                    $textDefaultLight
                    text50L
                    flex-1
                    style={{ fontFamily: "Jua-Regular", textAlign: "right" }}
                  >
                    {item.translated_words.join(" / ")}
                  </Text>
                </View>

                <View row gap-8>
                  {isLoggedInQuery.data ? (
                    <Button
                      iconSource={() => (
                        <AntDesign
                          name={item.is_favorite ? "heart" : "hearto"}
                          size={16}
                          color="white"
                          style={{ marginRight: 8 }}
                        />
                      )}
                      onPress={() =>
                        toggleFavoriteMutation.mutate({ id: item.id })
                      }
                      label={
                        item.is_favorite
                          ? "Remove to favorites"
                          : "Add to favorites"
                      }
                      outline
                      outlineColor={Colors.white}
                      size="medium"
                      flex-1
                    />
                  ) : (
                    <Link href="/(app)/auth" asChild>
                      <Button
                        iconSource={() => (
                          <AntDesign
                            name="hearto"
                            size={16}
                            color="white"
                            style={{ marginRight: 8 }}
                          />
                        )}
                        label="Add to favorites"
                        outline
                        outlineColor={Colors.white}
                        size="medium"
                        flex-1
                      />
                    </Link>
                  )}
                  <Link href={`/(app)/${item.id}`} asChild>
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
            )}
          />
        )}
      </KeyboardAvoidingView>
    </View>
  );
}
