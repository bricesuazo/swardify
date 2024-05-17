import { ActivityIndicator, RefreshControl, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Button,
  Colors,
  FloatingButton,
  LoaderScreen,
  Text,
  View,
} from "react-native-ui-lib";
import { router, useGlobalSearchParams } from "expo-router";
import { Feather } from "@expo/vector-icons";

import { api } from "~/utils/api";

export default function WordPage() {
  const utils = api.useUtils();
  const insets = useSafeAreaInsets();
  const { word_id } = useGlobalSearchParams<{ word_id: string }>();
  const isLoggedInQuery = api.auth.isLoggedIn.useQuery();
  const getFavoriteStateQuery = api.mobile.getFavoriteState.useQuery(
    {
      id: word_id,
    },
    {
      enabled: !!isLoggedInQuery.data,
    },
  );
  const toggleFavoriteMutation = api.mobile.toggleFavorite.useMutation({
    onSuccess: () =>
      Promise.all([
        getFavoriteStateQuery.refetch(),
        utils.mobile.getAllFavorites.refetch(),
      ]),
  });

  const getWordQuery = api.mobile.get.useQuery(
    { id: word_id },
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    },
  );

  const isLoading =
    isLoggedInQuery.isLoading ||
    getFavoriteStateQuery.isLoading ||
    toggleFavoriteMutation.isPending;

  if (getWordQuery.isLoading || !getWordQuery.data) return <LoaderScreen />;

  return (
    <>
      <Button
        style={{
          zIndex: 2,
          position: "absolute",
          top: insets.top + 8,
        }}
        onPress={() => router.back()}
        iconSource={() => (
          <Feather
            name="chevron-left"
            size={24}
            color="white"
            // style={{ transform: 'translateX(-2px)' }}
          />
        )}
        round
      />
      <View
        bg-$textPrimary
        style={{ paddingTop: insets.top + 60, paddingBottom: 40 }}
      >
        <Text white text40L center style={{ fontFamily: "Jua-Regular" }}>
          {getWordQuery.data.swardspeak_words.join(" / ")}
        </Text>
        <Text white text60L center style={{ fontFamily: "Jua-Regular" }}>
          {getWordQuery.data.translated_words.join(" / ")}
        </Text>
      </View>

      <ScrollView
        keyboardDismissMode="interactive"
        refreshControl={
          <RefreshControl
            refreshing={
              getWordQuery.isRefetching ||
              isLoggedInQuery.isRefetching ||
              getFavoriteStateQuery.isRefetching
            }
            onRefresh={async () =>
              await Promise.all([
                getWordQuery.refetch(),
                isLoggedInQuery.refetch(),
                getFavoriteStateQuery.refetch(),
              ])
            }
          />
        }
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        <View padding-20 gap-20>
          {getWordQuery.data.part_of_speech && (
            <View row>
              <View
                style={{
                  borderWidth: 2,
                  borderColor: Colors.$iconPrimary,
                  borderRadius: 60,
                  paddingHorizontal: 12,
                  paddingVertical: 4,
                }}
              >
                <Text
                  text70
                  $iconPrimary
                  style={{
                    fontFamily: "Jua-Regular",
                  }}
                >
                  {getWordQuery.data.part_of_speech}
                </Text>
              </View>
            </View>
          )}

          <View>
            <Text>Definition</Text>
            <Text text70BL>
              {getWordQuery.data.definition
                ? getWordQuery.data.definition
                : "No definitions yet..."}
            </Text>
          </View>

          {getWordQuery.data.examples && (
            <View>
              <Text>Examples</Text>
              <View gap-20>
                {getWordQuery.data.examples.length === 0 ? (
                  <Text text70BL>No examples yet...</Text>
                ) : (
                  getWordQuery.data.examples.map((example) => (
                    <Text text70BL>- {example}</Text>
                  ))
                )}
              </View>
            </View>
          )}
        </View>
      </ScrollView>
      <FloatingButton
        visible
        bottomMargin={40}
        button={{
          disabled: isLoading,
          iconSource: isLoading
            ? () => <ActivityIndicator size={24} />
            : undefined,
          label: isLoading
            ? undefined
            : !getFavoriteStateQuery.data || !isLoggedInQuery.data
              ? "Add to favorite"
              : "Remove from favorite",
          onPress: () =>
            !isLoggedInQuery.data
              ? router.push("/(app)/auth")
              : toggleFavoriteMutation.mutate({ id: word_id }),
        }}
      />
    </>
  );
}
