import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  RefreshControl,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Button,
  Colors,
  Dash,
  Text,
  TextField,
  View,
} from "react-native-ui-lib";
import * as Clipboard from "expo-clipboard";
import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";

import { api, RouterInputs } from "~/utils/api";

export default function Home() {
  const [input, setInput] = useState("");
  // const [debouncedInput, setDebouncedInput] = useDebounceValue(input, 2000);
  const [output, setOutput] = useState("");
  // const isKeyboardVisible = useStore((state) => state.isKeyboardVisible);
  // const setKeyboardVisible = useStore((state) => state.setKeyboardVisible);

  const inset = useSafeAreaInsets();
  const [type, setType] = useState<RouterInputs["mobile"]["translate"]["type"]>(
    "swardspeak-to-tagalog",
  );
  const [copied, setCopied] = useState(false);
  const getAllTranslationHistoriesQuery =
    api.mobile.getAllTranslationHistories.useQuery();
  const translateMutation = api.mobile.translate.useMutation({
    onError: (err) => {
      Alert.alert("Error", err.message);
    },
    onSuccess: async (res) => {
      setOutput(res ?? "");
      await getAllTranslationHistoriesQuery.refetch();
    },
  });

  // useInterval(
  //   () => {
  //     setCopied(false);
  //   },
  //   copied ? 2000 : null,
  // );

  // useEffect(() => {
  //   if (!debouncedInput || debouncedInput.length === 0) return;
  //   translateMutation.mutate({ type, input: debouncedInput });
  // }, [debouncedInput]);

  // useEffect(() => {
  //   setDebouncedInput(input);
  // }, [input]);

  return (
    <>
      <View flex-1>
        <View
          bg-$iconPrimary
          style={{
            // height: isKeyboardVisible ? "100%" : "auto",
            position: "relative",
            paddingTop: inset.top + 20,
          }}
        >
          <View paddingH-20 paddingV-40>
            <View
              br40
              style={{
                borderColor: "white",
                borderWidth: 2,
                overflow: "hidden",
              }}
            >
              <View paddingH-16 paddingV-20 style={{ position: "relative" }}>
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
                {input.length > 0 && (
                  <Button
                    label="Clear"
                    size={Button.sizes.xSmall}
                    bg-$iconPrimaryLight
                    style={{
                      position: "absolute",
                      top: 16,
                      right: 16,
                    }}
                    onPress={() => {
                      setInput("");

                      if (output.length > 0) {
                        setOutput("");
                      }
                    }}
                  />
                )}
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
                  {output.length > 0 && (
                    <Button
                      activeOpacity={1}
                      activeScale={0.75}
                      label={copied ? "Copied!" : "Copy"}
                      onPress={async () => {
                        setCopied(true);

                        await Clipboard.setStringAsync(output);
                      }}
                      size={Button.sizes.xSmall}
                      disabled={copied}
                    />
                  )}
                </View>
              </View>
            </View>
          </View>

          <View
            center
            row
            gap-8
            paddingH-20
            style={{
              position: "absolute",
              top: "50%",
              flex: 1,
              width: "100%",
              transform: [{ translateY: 32 }],
            }}
          >
            <Button
              label={
                translateMutation.isPending ? "Translating..." : "Translate"
              }
              labelStyle={{
                color: Colors.$iconPrimary,
                opacity:
                  translateMutation.isPending || input.length === 0 ? 0.25 : 1,
              }}
              activeOpacity={1}
              size={Button.sizes.large}
              activeBackgroundColor={Colors.$backgroundGeneralMedium}
              disabled={translateMutation.isPending || input.length === 0}
              disabledBackgroundColor="white"
              bg-white
              style={{
                borderWidth: 3,
                borderColor: Colors.$iconPrimary,
              }}
              onPress={() => translateMutation.mutate({ type, input })}
            />
            <Button
              round
              activeOpacity={1}
              activeBackgroundColor={Colors.$backgroundGeneralMedium}
              iconSource={() =>
                translateMutation.isPending ? (
                  <ActivityIndicator />
                ) : (
                  <Ionicons
                    name="swap-vertical"
                    size={20}
                    color={Colors.$iconPrimary}
                  />
                )
              }
              size={Button.sizes.large}
              disabled={translateMutation.isPending}
              disabledBackgroundColor="white"
              bg-white
              style={{
                borderWidth: 3,
                borderColor: Colors.$iconPrimary,
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
        </View>

        {getAllTranslationHistoriesQuery.isLoading ||
        !getAllTranslationHistoriesQuery.data ? (
          <View center padding-20>
            <ActivityIndicator />
          </View>
        ) : (
          // !isKeyboardVisible &&
          <FlashList
            data={getAllTranslationHistoriesQuery.data}
            keyExtractor={(item) => item.id}
            estimatedItemSize={100}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            keyboardDismissMode="interactive"
            contentContainerStyle={{ padding: 20 }}
            ListEmptyComponent={() => (
              <Text center>No translation history found</Text>
            )}
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
          />
        )}
      </View>

      {/* {isKeyboardVisible && (
        <Button
          icon
          round
          backgroundColor={Colors.white}
          style={{
            position: "absolute",
            bottom: 20,
            right: 20,
            width: 48,
            height: 48,
          }}
          onPress={() => Keyboard.dismiss()}
          iconSource={() => (
            <Ionicons
              name="chevron-down"
              size={20}
              color={Colors.$iconPrimary}
            />
          )}
        />
      )} */}
    </>
  );
}
