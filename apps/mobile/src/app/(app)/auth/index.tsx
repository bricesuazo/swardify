import { createRef, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Linking,
  Platform,
  ScrollView,
} from "react-native";
import {
  Button,
  Text,
  TextField,
  TextFieldRef,
  TouchableOpacity,
  View,
} from "react-native-ui-lib";
import { useRouter } from "expo-router";

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
      await utils.invalidate();

      if (router.canGoBack()) router.back();
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
      if (!data.session?.access_token) {
        router.push(`/auth/verify/${data.user.email}`);
      } else {
        if (router.canGoBack()) router.back();

        await utils.auth.isLoggedIn.refetch();
      }
    }
    setLoadings({ ...loadings, email: false });
  }

  useEffect(() => {
    setEmail("");
    setPassword("");
    setRepeatPassword("");
  }, [type]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView keyboardDismissMode="interactive">
        <View padding-20>
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
      <View padding-20 gap-20>
        <View
          center
          paddingH-20
          style={{ flexDirection: "row", flexWrap: "wrap" }}
        >
          <Text $textNeutral>By using SWARDify, you agree to our </Text>
          <TouchableOpacity
            onPress={() => Linking.openURL("https://swardify.kabsu.me/terms")}
          >
            <Text $textGeneral>Terms & Conditions</Text>
          </TouchableOpacity>
          <Text $textNeutral> and </Text>
          <TouchableOpacity
            onPress={() => Linking.openURL("https://swardify.kabsu.me/privacy")}
          >
            <Text $textGeneral>Privacy Policy</Text>
          </TouchableOpacity>
        </View>
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
