import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  TextInput,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Colors, Text, TouchableOpacity, View } from "react-native-ui-lib";
import { Link } from "expo-router";
import { FlashList } from "@shopify/flash-list";

import { useDebounceValue } from "~/lib/useDebounceValue";
import { api } from "~/utils/api";

export default function SearchPage() {
  const [search_word, setSearchWord] = useState("");

  const [debouncedValue, setDebouncedValue] = useDebounceValue(
    search_word,
    500,
  );
  const getAllWordsQuery = api.mobile.getAll.useQuery({
    search_word: debouncedValue,
  });
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={{ flex: 1, paddingTop: insets.top + 20 }}>
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
                refreshing={getAllWordsQuery.isRefetching}
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
              <Link key={item.id} href={`/${item.id}`} asChild>
                <TouchableOpacity
                  activeOpacity={0.5}
                  bg-$iconPrimary
                  paddingH-20
                  paddingV-24
                  br40
                  marginV-4
                >
                  <Text
                    $textDefaultLight
                    text50L
                    style={{ fontFamily: "Jua-Regular" }}
                  >
                    {item.swardspeak_words.join(" / ")}
                  </Text>
                  <Text
                    $textDefaultLight
                    text
                    text60L
                    style={{ fontFamily: "Jua-Regular" }}
                  >
                    {item.translated_words.join(" / ")}
                  </Text>
                </TouchableOpacity>
              </Link>
            )}
          />
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
