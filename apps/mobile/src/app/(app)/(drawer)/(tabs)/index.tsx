import { useEffect, useState } from "react";
import { ActivityIndicator, RefreshControl } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Button,
  Colors,
  Dash,
  Text,
  TextField,
  View,
} from "react-native-ui-lib";
import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";

import { useDebounceValue } from "~/lib/useDebounceValue";
import { useInterval } from "~/lib/useInterval";
import { api, RouterInputs } from "~/utils/api";

export default function Home() {
  const [input, setInput] = useState("");
  const [debouncedInput, setDebouncedInput] = useDebounceValue(input, 1000);
  const [output, setOutput] = useState("");

  const inset = useSafeAreaInsets();
  const [type, setType] = useState<RouterInputs["mobile"]["translate"]["type"]>(
    "swardspeak-to-tagalog",
  );
  const [copied, setCopied] = useState(false);
  const getAllTranslationHistoriesQuery =
    api.mobile.getAllTranslationHistories.useQuery();
  const translateMutation = api.mobile.translate.useMutation({
    onSuccess: async (res) => {
      setOutput(res ?? "");
      await getAllTranslationHistoriesQuery.refetch();
    },
  });

  useInterval(
    () => {
      setCopied(false);
    },
    copied ? 2000 : null,
  );

  useEffect(() => {
    if (!debouncedInput || debouncedInput.length === 0) return;
    translateMutation.mutate({ type, input: debouncedInput });
  }, [debouncedInput]);

  useEffect(() => {
    setDebouncedInput(input);
  }, [input]);

  return (
    <View flex-1>
      <View
        bg-$iconPrimary
        style={{ position: "relative", paddingTop: inset.top + 20 }}
      >
        <View paddingH-20 paddingV-40>
          <View
            br40
            style={{ borderColor: "white", borderWidth: 2, overflow: "hidden" }}
          >
            <View paddingH-16 paddingV-20>
              <Text white style={{ fontFamily: "Jua-Regular" }}>
                {type === "swardspeak-to-tagalog" ? "Swardspeak" : "Tagalog"}
              </Text>
              <TextField
                white
                text50
                placeholder={`Type ${
                  type === "swardspeak-to-tagalog" ? "swardspeak" : "tagalog"
                } sentence`}
                placeholderTextColor={Colors.$iconPrimaryLight}
                fieldStyle={{ height: 60 }}
                value={input}
                onChangeText={setInput}
              />
            </View>
            <View
              paddingH-16
              paddingV-20
              bg-white
              style={{ position: "relative" }}
            >
              <Text style={{ fontFamily: "Jua-Regular" }}>
                {type === "swardspeak-to-tagalog" ? "Tagalog" : "Swardspeak"}
              </Text>

              <TextField
                text50
                readOnly
                value={output}
                placeholder={
                  type === "swardspeak-to-tagalog"
                    ? "Tagalog translation"
                    : "Swardspeak translation"
                }
                placeholderTextColor={Colors.$iconDisabled}
                fieldStyle={{ height: 60 }}
                onChangeText={setOutput}
              />

              <View style={{ position: "absolute", top: 16, right: 12 }}>
                {translateMutation.isPending ? (
                  <View paddingH-20 paddingV-4>
                    <ActivityIndicator />
                  </View>
                ) : (
                  <Button
                    label={copied ? "Copied!" : "Copy"}
                    onPress={() => setCopied(true)}
                    size={Button.sizes.xSmall}
                    disabled={copied}
                  />
                )}
              </View>
            </View>
          </View>
        </View>
        <Button
          round
          iconSource={() => (
            <Ionicons
              name="swap-vertical"
              size={24}
              color={Colors.$iconPrimary}
            />
          )}
          bg-white
          style={{
            width: 52,
            height: 52,
            position: "absolute",
            borderWidth: 4,
            borderColor: Colors.$iconPrimary,
            top: "50%",
            left: "50%",
            transform: [{ translateX: -24 }, { translateY: 32 }],
          }}
          onPress={() => {
            setInput("");
            setOutput("");
            setType(
              type === "swardspeak-to-tagalog"
                ? "tagalog-to-swardspeak"
                : "swardspeak-to-tagalog",
            );
          }}
        />
      </View>

      {getAllTranslationHistoriesQuery.isLoading ||
      !getAllTranslationHistoriesQuery.data ? (
        <View center padding-20>
          <ActivityIndicator />
        </View>
      ) : (
        <FlashList
          data={getAllTranslationHistoriesQuery.data}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={() => (
            <>
              <Text
                center
                text60L
                $textNeutralHeavy
                marginB-20
                style={{ fontFamily: "Jua-Regular" }}
              >
                History
              </Text>

              <View
                marginB-16
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text text70L style={{ fontFamily: "Jua-Regular" }}>
                  Swardspeak
                </Text>
                <Text text70L style={{ fontFamily: "Jua-Regular" }}>
                  Tagalog
                </Text>
              </View>
            </>
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
              <Text text60L flex-1 style={{ fontFamily: "Jua-Regular" }}>
                {item.swardspeak}
              </Text>
              <Dash vertical length={40} />
              <Text
                text60L
                flex-1
                style={{
                  textAlign: "right",
                  fontFamily: "Jua-Regular",
                }}
              >
                {item.tagalog}
              </Text>
            </View>
          )}
          refreshControl={
            <RefreshControl
              refreshing={getAllTranslationHistoriesQuery.isLoading}
              onRefresh={() => getAllTranslationHistoriesQuery.refetch()}
            />
          }
          estimatedItemSize={100}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => (
            <Text center>No translation history found</Text>
          )}
          keyboardDismissMode="interactive"
          contentContainerStyle={{ padding: 20 }}
        />
      )}
    </View>
  );
}
