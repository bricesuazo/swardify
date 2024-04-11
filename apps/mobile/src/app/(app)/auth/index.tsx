import { createRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Button, TextField, TextFieldRef, View } from "react-native-ui-lib";
import { useRouter } from "expo-router";
import { AntDesign } from "@expo/vector-icons";

import { api } from "~/utils/api";
import { supabase } from "~/utils/supabase";

export default function AuthPage() {
  const router = useRouter();
  const utils = api.useUtils();
  const [type, setType] = useState<"sign-in" | "sign-up">("sign-up");
  const ref_password = createRef<TextFieldRef>();
  const ref_repeat_password = createRef<TextFieldRef>();
  const [loadings, setLoadings] = useState({
    google: false,
    email: false,
  });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  async function onSubmit() {
    setLoadings({ ...loadings, email: true });
    if (type === "sign-in") {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setLoadings({ ...loadings, email: false });
        return Alert.alert(error.message);
      }

      if (router.canGoBack()) router.back();

      await utils.auth.isLoggedIn.refetch();
    } else if (type === "sign-up") {
      if (password !== repeatPassword) {
        setLoadings({ ...loadings, email: false });
        return Alert.alert("Passwords do not match");
      }

      const { data, error } = await supabase.auth.signUp({ email, password });

      if (error) {
        setLoadings({ ...loadings, email: false });
        return Alert.alert(error.message);
      }
      if (!data.user?.email) {
        setLoadings({ ...loadings, email: false });
        return Alert.alert("An error occurred");
      }

      // data.session?.access_token is working or data.session
      if (!data.session) {
        router.push(`/auth/verify/${data.user.email}`);
      } else {
        if (router.canGoBack()) {
          router.back();
        } else {
          await utils.auth.isLoggedIn.refetch();
        }
      }
    }
    setLoadings({ ...loadings, email: false });
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView keyboardDismissMode="interactive">
        <View padding-20>
          {/* <Button
            iconSource={() =>
              loadings.google ? (
                <ActivityIndicator size={24} style={{ marginRight: 8 }} />
              ) : (
                <AntDesign
                  name="google"
                  color="white"
                  size={24}
                  style={{ marginRight: 8 }}
                />
              )
            }
            onPress={() => {
              setLoadings({ ...loadings, google: true });
              setTimeout(() => {
                setLoadings({ ...loadings, google: false });
              }, 2000);
            }}
            label={
              {
                "sign-in": "Sign in with Google",
                "sign-up": "Create account with Google",
              }[type]
            }
            disabled={loadings.google}
            style={{ marginBottom: 20 }}
          /> */}

          <TextField
            placeholder="Email address"
            keyboardType="email-address"
            textContentType="emailAddress"
            floatingPlaceholder
            value={email}
            onChangeText={setEmail}
            enableErrors
            validate={["required", "email"]}
            validationMessage={[
              "Email address is required",
              "Email is invalid",
            ]}
            validateOnBlur
            validateOnChange
            showCharCounter
            onSubmitEditing={() => ref_password.current?.focus()}
            floatOnFocus
            style={{ fontSize: 20 }}
          />

          <TextField
            ref={ref_password}
            placeholder="Password"
            textContentType="password"
            floatingPlaceholder
            value={password}
            onChangeText={setPassword}
            enableErrors
            validate={["required", (value: string) => value.length >= 6]}
            validationMessage={[
              "Password is required",
              "Password is too short",
            ]}
            validateOnBlur
            validateOnChange
            showCharCounter
            onSubmitEditing={() => {
              if (type === "sign-up") {
                ref_repeat_password.current?.focus();
              } else {
                onSubmit();
              }
            }}
            floatOnFocus
            style={{ fontSize: 20 }}
            secureTextEntry={true}
          />

          {type === "sign-up" && (
            <TextField
              ref={ref_repeat_password}
              placeholder="Repeat password"
              textContentType="password"
              floatingPlaceholder
              value={repeatPassword}
              onChangeText={setRepeatPassword}
              enableErrors
              validate={[
                "required",
                (value: string) => value.length >= 6,
                (value: string) => value === password,
              ]}
              validationMessage={[
                "Password is required",
                "Password is too short",
                "Passwords do not match",
              ]}
              validateOnBlur
              validateOnChange
              showCharCounter
              onSubmitEditing={() => {
                if (type === "sign-up") {
                  onSubmit();
                }
              }}
              floatOnFocus
              style={{ fontSize: 20 }}
              secureTextEntry={true}
            />
          )}

          <View style={{ padding: 8 }}>
            <Button
              link
              onPress={() =>
                setType(type === "sign-in" ? "sign-up" : "sign-in")
              }
              label={
                {
                  "sign-in": "Don't have an account? Create account.",
                  "sign-up": "Already have an account? Sign in.",
                }[type]
              }
            />
          </View>
        </View>
      </ScrollView>
      <View padding-20>
        <Button
          iconSource={
            loadings.email
              ? () => <ActivityIndicator size={24} style={{ marginRight: 8 }} />
              : null
          }
          label={
            loadings.email
              ? {
                  "sign-in": "Signing in...",
                  "sign-up": "Creating account...",
                }[type]
              : {
                  "sign-in": "Sign in",
                  "sign-up": "Create account",
                }[type]
          }
          disabled={loadings.email}
          onPress={onSubmit}
        />
      </View>
    </KeyboardAvoidingView>
  );
}
