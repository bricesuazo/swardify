import { FontAwesome } from '@expo/vector-icons';
import { useGlobalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  View as RNView,
  ScrollView,
} from 'react-native';
import { OtpInput } from 'react-native-otp-entry';
import { Button, Colors, Text, View } from 'react-native-ui-lib';
import { supabase } from '~/trpc/supabase';
import { api } from '~/utils/trpc';

export default function VerifyCode() {
  const utils = api.useUtils();
  const router = useRouter();
  const { email } = useGlobalSearchParams();
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState('');

  if (!email) return router.push('/(app)/auth');

  async function onSubmit(code: string) {
    if (typeof email !== 'string') return;

    setLoading(true);

    const { error } = await supabase.auth.verifyOtp({
      type: 'signup',
      email,
      token: code,
    });

    if (error) {
      setLoading(false);
      return Alert.alert(error.message);
    }

    await utils.auth.isLoggedIn.refetch();

    setLoading(false);
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View flex-1>
        <ScrollView keyboardDismissMode="interactive">
          <View flex-1 padding-20 gap-40>
            <View center>
              <View bg-$iconPrimary br100 center padding-16>
                {loading ? (
                  <ActivityIndicator size={24} color="white" />
                ) : (
                  <FontAwesome name="check" size={24} color="white" />
                )}
              </View>
            </View>
            <View>
              <Text center text50>
                We have sent a 6-digit code to{' '}
                <Text color={Colors.$iconPrimary}>{email}</Text>
              </Text>
            </View>
            <View paddingH-20>
              <OtpInput
                numberOfDigits={6}
                focusColor={Colors.$iconPrimary}
                focusStickBlinkingDuration={500}
                autoFocus
                onTextChange={setToken}
                onFilled={onSubmit}
              />
            </View>
          </View>
        </ScrollView>
        <View padding-20>
          <Button
            label="Verify code"
            disabled={loading}
            iconSource={
              loading
                ? () => (
                    <ActivityIndicator size={24} style={{ marginRight: 8 }} />
                  )
                : null
            }
            onPress={() => onSubmit(token)}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
