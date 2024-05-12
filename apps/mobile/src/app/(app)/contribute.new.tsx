import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button, Colors, Text, TextField, View } from "react-native-ui-lib";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";

import { api } from "~/utils/api";

export default function CreateContribution() {
  const utils = api.useUtils();
  const isLoggedInQuery = api.auth.isLoggedIn.useQuery();
  const insets = useSafeAreaInsets();
  const [states, setStates] = useState<{
    swardspeak_words: string[];
    translated_words: string[];
  }>({
    swardspeak_words: [""],
    translated_words: [""],
  });
  const contributeMutation = api.mobile.contribute.useMutation({
    onError: (err) => {
      Alert.alert("Error", err.message);
    },
    onSuccess: async () => {
      await utils.mobile.getAllContributions.invalidate();

      if (router.canGoBack()) {
        router.back();
      } else {
        router.push("/(app)/contribute");
      }
    },
  });

  if (!isLoggedInQuery.data) return router.push("/contribute");
  return (
    <View
      flex-1
      style={{ paddingTop: Platform.OS === "android" ? insets.top : 0 }}
    >
      <View
        paddingV-8
        style={{
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <View height={40} width={40} center>
          {Platform.OS === "android" && (
            <Button
              link
              onPress={() =>
                router.canGoBack() ? router.back() : router.replace("/")
              }
              iconSource={() => (
                <Feather
                  name="chevron-left"
                  size={24}
                  color={Colors.$iconPrimary}
                />
              )}
              round
            />
          )}
        </View>
        <Text text60>Contribute</Text>
        <View height={40} width={40} center />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView keyboardDismissMode="interactive">
          <View padding-20 gap-40>
            <View flex-1 gap-8>
              <Text>Swardspeak Words</Text>
              <View gap-4>
                {states.swardspeak_words.map((word, index) => (
                  <View row gap-8 flex-1 key={index}>
                    <TextField
                      placeholder="Swardspeak word"
                      value={word}
                      onChangeText={(text) =>
                        setStates((prev) => {
                          const newWords = [...prev.swardspeak_words];
                          newWords[index] = text;
                          return { ...prev, swardspeak_words: newWords };
                        })
                      }
                      enableErrors
                      validate={["required"]}
                      validationMessage={["This is required"]}
                      fieldStyle={{
                        borderColor: Colors.$iconDisabled,
                        borderWidth: 2,
                        paddingHorizontal: 12,
                        paddingVertical: 8,
                        borderRadius: 12,
                      }}
                      containerStyle={{ flex: 1 }}
                      validateOnBlur
                      validateOnChange
                      showCharCounter
                      style={{ fontSize: 16 }}
                    />
                    {index !== 0 && (
                      <Button
                        iconSource={() => (
                          <Feather name="trash" size={20} color="white" />
                        )}
                        round
                        style={{ width: 48, height: 48 }}
                        onPress={() =>
                          setStates((prev) => ({
                            ...prev,
                            swardspeak_words: prev.swardspeak_words.filter(
                              (_, i) => i !== index,
                            ),
                          }))
                        }
                      />
                    )}
                  </View>
                ))}
              </View>
              <Button
                label="Add more related swardspeak word"
                size={Button.sizes.small}
                outline
                disabled={states.swardspeak_words.some((word) => !word)}
                onPress={() =>
                  setStates((prev) => ({
                    ...prev,
                    swardspeak_words: [...prev.swardspeak_words, ""],
                  }))
                }
              />
            </View>
            <View flex-1 gap-8>
              <Text>Translated Words</Text>
              <View gap-4>
                {states.translated_words.map((word, index) => (
                  <View row gap-8 flex-1 key={index}>
                    <TextField
                      placeholder="Translated word"
                      value={word}
                      onChangeText={(text) =>
                        setStates((prev) => {
                          const newWords = [...prev.translated_words];
                          newWords[index] = text;
                          return { ...prev, translated_words: newWords };
                        })
                      }
                      enableErrors
                      validate={["required"]}
                      validationMessage={["This is required"]}
                      fieldStyle={{
                        borderColor: Colors.$iconDisabled,
                        borderWidth: 2,
                        paddingHorizontal: 12,
                        paddingVertical: 8,
                        borderRadius: 12,
                      }}
                      containerStyle={{ flex: 1 }}
                      validateOnBlur
                      validateOnChange
                      showCharCounter
                      style={{ fontSize: 16 }}
                    />
                    {index !== 0 && (
                      <Button
                        iconSource={() => (
                          <Feather name="trash" size={20} color="white" />
                        )}
                        round
                        style={{ width: 48, height: 48 }}
                        onPress={() =>
                          setStates((prev) => ({
                            ...prev,
                            translated_words: prev.translated_words.filter(
                              (_, i) => i !== index,
                            ),
                          }))
                        }
                      />
                    )}
                  </View>
                ))}
              </View>
              <Button
                label="Add more related translated word"
                size={Button.sizes.small}
                outline
                disabled={states.translated_words.some((word) => !word)}
                onPress={() =>
                  setStates((prev) => ({
                    ...prev,
                    translated_words: [...prev.translated_words, ""],
                  }))
                }
              />
            </View>
          </View>
        </ScrollView>
        <View padding-20>
          <Button
            iconSource={
              contributeMutation.isPending
                ? () => (
                    <ActivityIndicator size={24} style={{ marginRight: 8 }} />
                  )
                : null
            }
            label={
              contributeMutation.isPending ? "Contributing..." : "Contribute"
            }
            disabled={
              contributeMutation.isPending ||
              states.swardspeak_words.some((word) => !word) ||
              states.translated_words.some((word) => !word)
            }
            onPress={() =>
              contributeMutation.mutate({
                swardspeak_words: states.swardspeak_words,
                translated_words: states.translated_words,
              })
            }
          />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
