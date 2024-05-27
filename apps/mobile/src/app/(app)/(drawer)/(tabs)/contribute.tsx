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

import { api, RouterOutputs } from "~/utils/api";

export default function ContributePage() {
  const utils = api.useUtils();
  const insets = useSafeAreaInsets();
  const getContributionsQuery = api.mobile.getAllContributions.useQuery();
  const isLoggedInQuery = api.auth.isLoggedIn.useQuery();

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
          renderItem={({ item }) => <ContributionItem contribution={item} />}
          refreshControl={
            <RefreshControl
              refreshing={getContributionsQuery.isLoading}
              onRefresh={() =>
                Promise.all([
                  getContributionsQuery.refetch(),
                  utils.mobile.getContributionsCount.invalidate(),
                ])
              }
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

function ContributionItem({
  contribution,
}: {
  contribution: RouterOutputs["mobile"]["getAllContributions"][number];
}) {
  const isLoggedInQuery = api.auth.isLoggedIn.useQuery();
  const utils = api.useUtils();
  const deleteMyContributionMutation =
    api.mobile.deleteMyContribution.useMutation({
      onSuccess: () =>
        Promise.all([
          utils.mobile.getAllContributions.invalidate(),
          utils.mobile.getContributionsCount.invalidate(),
        ]),
    });
  const voteMutation = api.mobile.vote.useMutation({
    onSuccess: async () => await utils.mobile.getAllContributions.invalidate(),
  });
  return (
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
            {contribution.is_my_contributions
              ? "You"
              : contribution.user?.email ?? "Other"}
          </Text>
        </View>
        <View flex-1>
          <Text center text30BL>
            {contribution.vote_count}
          </Text>
        </View>
        <View flex-1 style={{ alignItems: "flex-end" }}>
          {isLoggedInQuery.data && contribution.is_my_contributions && (
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
                if (!contribution.is_my_contributions) return;

                deleteMyContributionMutation.mutate({ id: contribution.id });
              }}
              disabled={deleteMyContributionMutation.isPending}
            />
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
          {contribution.swardspeak_words.join(" / ")}
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
          {contribution.translated_words.join(" / ")}
        </Text>
      </View>

      <View row gap-8>
        <Button
          flex-1
          label="Upvote"
          outline={contribution.my_vote !== "upvote"}
          size={Button.sizes.medium}
          onPress={() =>
            isLoggedInQuery.data
              ? voteMutation.mutate({ id: contribution.id, vote: "upvote" })
              : router.push("/(app)/auth")
          }
          disabled={
            voteMutation.isPending && voteMutation.variables.vote === "upvote"
          }
          iconSource={() =>
            voteMutation.isPending &&
            voteMutation.variables.vote === "upvote" ? (
              <ActivityIndicator
                size={16}
                color={Colors.$iconPrimary}
                style={{ marginRight: 8 }}
              />
            ) : (
              <Feather
                name="arrow-up"
                size={16}
                color={
                  contribution.my_vote === "upvote"
                    ? "white"
                    : Colors.$iconPrimary
                }
                style={{ marginRight: 8 }}
              />
            )
          }
        />
        <Button
          flex-1
          label="Downvote"
          outline={contribution.my_vote !== "downvote"}
          size={Button.sizes.medium}
          onPress={() =>
            isLoggedInQuery.data
              ? voteMutation.mutate({ id: contribution.id, vote: "downvote" })
              : router.push("/(app)/auth")
          }
          disabled={
            voteMutation.isPending && voteMutation.variables.vote === "downvote"
          }
          iconSource={() =>
            voteMutation.isPending &&
            voteMutation.variables.vote === "downvote" ? (
              <ActivityIndicator
                size={16}
                color={Colors.$iconPrimary}
                style={{ marginRight: 8 }}
              />
            ) : (
              <Feather
                name="arrow-down"
                size={16}
                color={
                  contribution.my_vote === "downvote"
                    ? "white"
                    : Colors.$iconPrimary
                }
                style={{ marginRight: 8 }}
              />
            )
          }
        />
      </View>
    </View>
  );
}
