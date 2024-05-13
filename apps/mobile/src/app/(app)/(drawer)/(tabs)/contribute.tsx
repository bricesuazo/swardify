import { ActivityIndicator } from "react-native";
import { RefreshControl } from "react-native-gesture-handler";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import {
  Button,
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
  const utils = api.useUtils();
  const insets = useSafeAreaInsets();
  const getContributionsQuery = api.mobile.getAllContributions.useQuery();
  const isLoggedInQuery = api.auth.isLoggedIn.useQuery();
  const deleteMyContributionMutation =
    api.mobile.deleteMyContribution.useMutation({
      onSuccess: async () =>
        await utils.mobile.getAllContributions.invalidate(),
    });
  const voteMutation = api.mobile.vote.useMutation({
    onSuccess: async () => await utils.mobile.getAllContributions.invalidate(),
  });

  return (
    <View flex-1 style={{ paddingTop: insets.top + 60, position: "relative" }}>
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
              marginB-12
              paddingH-16
              paddingV-20
              br40
              gap-8
              style={{
                justifyContent: "space-between",
                borderWidth: 2,
                columnGap: 8,
                borderColor: Colors.$textNeutralLight,
              }}
            >
              <View row centerV style={{ justifyContent: "space-between" }}>
                <View flex-1>
                  <Text numberOfLines={1}>
                    {item.is_my_contributions
                      ? "You"
                      : item.user?.email ?? "Other"}
                  </Text>
                </View>
                <View flex-1>
                  <Text center text30BL>
                    {item.vote_count}
                  </Text>
                </View>
                <View flex-1 style={{ alignItems: "flex-end" }}>
                  {isLoggedInQuery.data ? (
                    item.is_my_contributions && (
                      <Button
                        label={
                          !deleteMyContributionMutation.isPending
                            ? "Delete"
                            : "Deleting..."
                        }
                        size={Button.sizes.xSmall}
                        outline
                        color={Colors.$iconDanger}
                        outlineColor={Colors.$iconDanger}
                        onPress={() => {
                          if (!item.is_my_contributions) return;

                          deleteMyContributionMutation.mutate({ id: item.id });
                        }}
                        disabled={deleteMyContributionMutation.isPending}
                      />
                    )
                  ) : (
                    <Text text80BL $iconDanger>
                      Signed out
                    </Text>
                  )}
                </View>
              </View>

              <View
                row
                style={{
                  justifyContent: "space-between",
                  columnGap: 8,
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

              <View row gap-8>
                <Button
                  flex-1
                  label="Upvote"
                  outline={item.my_vote !== "upvote"}
                  size={Button.sizes.medium}
                  onPress={() =>
                    isLoggedInQuery.data
                      ? voteMutation.mutate({ id: item.id, vote: "upvote" })
                      : router.push("/(app)/auth")
                  }
                  disabled={voteMutation.isPending}
                  iconSource={() => (
                    <Feather
                      name="arrow-up"
                      size={16}
                      color={
                        item.my_vote === "upvote"
                          ? "white"
                          : Colors.$iconPrimary
                      }
                      style={{ marginRight: 8 }}
                    />
                  )}
                />
                <Button
                  flex-1
                  label="Downvote"
                  outline={item.my_vote !== "downvote"}
                  size={Button.sizes.medium}
                  onPress={() =>
                    isLoggedInQuery.data
                      ? voteMutation.mutate({ id: item.id, vote: "downvote" })
                      : router.push("/(app)/auth")
                  }
                  disabled={voteMutation.isPending}
                  iconSource={() => (
                    <Feather
                      name="arrow-down"
                      size={16}
                      color={
                        item.my_vote === "downvote"
                          ? "white"
                          : Colors.$iconPrimary
                      }
                      style={{ marginRight: 8 }}
                    />
                  )}
                />
              </View>
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
    </View>
  );
}
