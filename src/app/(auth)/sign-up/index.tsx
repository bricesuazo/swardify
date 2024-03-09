import { AntDesign } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { cssInterop } from 'nativewind';
import { createRef, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { supabase } from '~/trpc/supabase';
import { api } from '~/utils/trpc';

export default function SignUpPage() {
  const utils = api.useUtils();
  const ref_password = createRef<TextInput>();
  const [loadings, setLoadings] = useState({
    google: false,
    email: false,
  });
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  cssInterop(AntDesign, {
    className: {
      target: 'style',
    },
  });

  async function onSubmit() {
    setLoadings({ ...loadings, email: true });
    const { error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) Alert.alert(error.message);
    await utils.auth.isLoggedIn.refetch();
    setLoadings({ ...loadings, email: false });
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
    >
      <ScrollView className="flex-1" keyboardDismissMode="interactive">
        <View className="p-5">
          <Pressable
            className="gap-x-2 flex-row group disabled:bg-muted-foreground disabled:text-muted group mb-10 rounded-full justify-center items-center border-2 border-transparent bg-primary p-5 active:border-primary active:bg-transparent"
            onPress={() => {
              setLoadings({ ...loadings, google: true });
              setTimeout(() => {
                setLoadings({ ...loadings, google: false });
              }, 2000);
            }}
            disabled={loadings.google}
          >
            {loadings.google ? (
              <ActivityIndicator size={24} />
            ) : (
              <AntDesign
                name="google"
                size={24}
                className="group-disabled:text-muted group-active:text-primary text-white"
              />
            )}
            <Text className="group-disabled:text-muted text-center text-lg text-white group-active:text-primary">
              Sign in with Google
            </Text>
          </Pressable>

          <View className="gap-y-4">
            <TextInput
              // clearButtonMode="while-editing"
              keyboardType="email-address"
              textContentType="emailAddress"
              placeholder="Email address"
              placeholderTextColor="gray"
              className="h-20 rounded-full border-2 border-primary px-10 text-lg"
              onSubmitEditing={() => ref_password.current?.focus()}
              onChangeText={setEmail}
            />
            <TextInput
              ref={ref_password}
              secureTextEntry={true}
              placeholder="Password"
              placeholderTextColor="gray"
              className="h-20 rounded-full border-2 border-primary px-10 text-lg"
              onChangeText={setPassword}
              onSubmitEditing={onSubmit}
            />
            <Link
              href="/(auth)/sign-up/"
              className="text-center text-lg text-primary"
            >
              Don't have an account? Sign up
            </Link>
          </View>
        </View>
      </ScrollView>
      <View className="p-5">
        <Pressable
          className="group group disabled:bg-muted-foreground disabled:text-muted gap-x-2 flex-row justify-center items-center group rounded-full border-2 border-transparent bg-primary p-5 active:border-primary active:bg-transparent"
          onPress={onSubmit}
          disabled={loadings.email}
        >
          {loadings.email && <ActivityIndicator size={24} />}
          <Text className="roup-disabled:text-muted text-center text-lg text-white group-active:text-primary">
            {loadings.email ? 'Signing in...' : 'Sign in'}
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
