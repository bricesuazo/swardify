import { Link } from 'expo-router';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { Button } from 'react-native-ui-lib';
import { supabase } from '~/trpc/supabase';
import { api } from '~/utils/trpc';

export default function SettingsPage() {
  const utils = api.useUtils();
  const insets = useSafeAreaInsets();
  const isLoggedInQuery = api.auth.isLoggedIn.useQuery();

  return (
    <SafeAreaView
      style={{ paddingTop: insets.top + 20, paddingHorizontal: 20 }}
    >
      {isLoggedInQuery.data ? (
        <Button
          label="Logout"
          onPress={async () => {
            await supabase.auth.signOut();
            await utils.auth.isLoggedIn.refetch();
          }}
        />
      ) : (
        <Link asChild href="/(app)/auth">
          <Button
            label="Sign in"
            onPress={async () => {
              await supabase.auth.signOut();
              await utils.auth.isLoggedIn.refetch();
            }}
          />
        </Link>
      )}
    </SafeAreaView>
  );
}
