import { useState } from "react";
import { KeyboardAvoidingView, Platform } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import {
  Button,
  Card,
  Colors,
  Picker,
  Text,
  TextField,
  View,
} from "react-native-ui-lib";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";

import { api } from "~/utils/api";

export default function SettingsPage() {
  const insets = useSafeAreaInsets();
  const utils = api.useUtils();
  const isLoggedInQuery = api.auth.isLoggedIn.useQuery();
  const getSessionQuery = api.auth.getSession.useQuery();
  const getUserQuery = api.auth.getUser.useQuery(undefined, {
    enabled: isLoggedInQuery.data,
  });
  const changeSexMutation = api.auth.changeSex.useMutation({
    onMutate: ({ sex }) =>
      utils.auth.getUser.setData(undefined, (user) => {
        if (!user) return;

        return { ...user, sex };
      }),
    onSuccess: () => getUserQuery.refetch(),
  });
  const changePronounsMutation = api.auth.changePronouns.useMutation({
    onMutate: ({ pronouns }) =>
      utils.auth.getUser.setData(undefined, (user) => {
        if (!user) return;

        return { ...user, pronouns };
      }),
    onSuccess: () => getUserQuery.refetch(),
  });
  const changePasswordMutation = api.auth.changePassword.useMutation({
    onSuccess: () => {
      setNewPassword("");
      setOldPassword("");
      alert("Password changed successfully");
    },
    onError: (error) => {
      alert(error.message);
    },
  });
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  return (
    <View flex-1 style={{ paddingTop: insets.top + 60 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          keyboardDismissMode="interactive"
          style={{ flex: 1, paddingHorizontal: 20 }}
        >
          <Text center text60 marginV-20>
            Authentication
          </Text>
          {isLoggedInQuery.data ? (
            <View gap-40>
              <View>
                <Text center text-70 $textNeutral>
                  Email Address
                </Text>
                <TextField
                  readOnly
                  value={getSessionQuery.data?.email ?? "None"}
                  fieldStyle={{
                    borderColor: Colors.$iconDisabled,
                    borderWidth: 2,
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    borderRadius: 12,
                  }}
                  color={Colors.$textNeutral}
                  style={{ fontSize: 16 }}
                />
              </View>
              <View>
                <Picker
                  label="Sex"
                  placeholder="Select your sex"
                  value={getUserQuery.data?.sex ?? ""}
                  onChange={(sex) =>
                    changeSexMutation.mutate({
                      sex: !sex ? "m" : (sex as "m" | "f"),
                    })
                  }
                  useWheelPicker
                  topBarProps={{
                    doneLabel: "Done",
                    cancelLabel: "Cancel",
                    titleStyle: { flex: 1, textAlign: "center" },
                    containerStyle: { padding: 20 },
                  }}
                  trailingAccessory={<Feather name="chevron-down" size={20} />}
                >
                  <Picker.Item value="f" label="Female" />
                  <Picker.Item value="m" label="Male" />
                </Picker>
              </View>
              <View>
                <Picker
                  label="Pronouns"
                  placeholder="What are your pronouns?"
                  value={getUserQuery.data?.pronouns ?? []}
                  onChange={(pronouns) => {
                    if (
                      !pronouns ||
                      JSON.stringify(pronouns) ===
                        JSON.stringify(getUserQuery.data?.pronouns)
                    )
                      return;

                    changePronounsMutation.mutate({
                      pronouns: pronouns as string[],
                    });
                  }}
                  mode={Picker.modes.MULTI}
                  topBarProps={{
                    doneLabel: "Done",
                    titleStyle: { flex: 1, textAlign: "center" },
                    containerStyle: { padding: 8 },
                  }}
                  trailingAccessory={<Feather name="chevron-down" size={20} />}
                  useSafeArea
                >
                  {[
                    "he",
                    "him",
                    "his",
                    "himself",
                    "she",
                    "her",
                    "hers",
                    "herself",
                    "they",
                    "them",
                    "theirs",
                    "themself",
                    "ze",
                    "zir",
                    "zirs",
                    "zirself",
                    "mx",
                  ].map((pronoun, index) => (
                    <Picker.Item
                      key={index}
                      value={pronoun}
                      label={pronoun.charAt(0).toUpperCase() + pronoun.slice(1)}
                    />
                  ))}
                </Picker>
              </View>
              <View>
                <Text center text-70 $textNeutral>
                  Change password
                </Text>
                <TextField
                  placeholder="Old password"
                  textContentType="password"
                  floatingPlaceholder
                  value={oldPassword}
                  onChangeText={setOldPassword}
                  enableErrors
                  validate={["required", (value: string) => value.length >= 6]}
                  validationMessage={[
                    "Password is required",
                    "Password is too short",
                  ]}
                  validateOnBlur
                  validateOnChange
                  showCharCounter
                  floatOnFocus
                  style={{ fontSize: 20 }}
                  secureTextEntry={true}
                />
                <TextField
                  placeholder="New password"
                  textContentType="password"
                  floatingPlaceholder
                  value={newPassword}
                  onChangeText={setNewPassword}
                  enableErrors
                  validate={[
                    "required",
                    (value: string) => value.length >= 6,
                    (value: string) => value !== oldPassword,
                  ]}
                  validationMessage={[
                    "Password is required",
                    "Password is too short",
                    "New password must be different from the old password",
                  ]}
                  validateOnBlur
                  validateOnChange
                  showCharCounter
                  floatOnFocus
                  style={{ fontSize: 20 }}
                  secureTextEntry={true}
                />

                <Button
                  label="Change password"
                  disabled={
                    changePasswordMutation.isPending ||
                    !oldPassword ||
                    !newPassword
                  }
                  onPress={() => {
                    changePasswordMutation.mutate({
                      old_password: oldPassword,
                      new_password: newPassword,
                    });
                  }}
                />
              </View>
              <View height={80} />
            </View>
          ) : (
            <Card
              activeOpacity={1}
              activeScale={0.96}
              onPress={() => router.push("/(app)/auth")}
            >
              <Card.Section
                bg-$backgroundElevated
                padding-20
                content={[
                  { text: "Sign In", text70: true, $textDefault: true },
                ]}
                contentStyle={{ alignItems: "center", margin: 0, padding: 0 }}
              />
            </Card>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
