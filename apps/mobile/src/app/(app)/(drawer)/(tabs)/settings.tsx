import { useState } from "react";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Button, Card, Text, TextField, View } from "react-native-ui-lib";
import { router } from "expo-router";

import { api } from "~/utils/api";

export default function SettingsPage() {
  const insets = useSafeAreaInsets();
  const isLoggedInQuery = api.auth.isLoggedIn.useQuery();
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
    <SafeAreaView
      style={{ paddingTop: insets.top + 20, paddingHorizontal: 20 }}
    >
      <Text center text60>
        Authentication
      </Text>
      {isLoggedInQuery.data ? (
        <View>
          <Text center text-70>
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
              changePasswordMutation.isPending || !oldPassword || !newPassword
            }
            onPress={() => {
              changePasswordMutation.mutate({
                old_password: oldPassword,
                new_password: newPassword,
              });
            }}
          />
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
            content={[{ text: "Sign In", text70: true, $textDefault: true }]}
            contentStyle={{ alignItems: "center", margin: 0, padding: 0 }}
          />
        </Card>
      )}
    </SafeAreaView>
  );
}
