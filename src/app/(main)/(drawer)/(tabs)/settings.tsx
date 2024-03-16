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

  return (
    <SafeAreaView
      style={{ paddingTop: insets.top + 20, paddingHorizontal: 20 }}
    >
      <Button
        label="Logout"
        onPress={async () => {
          await supabase.auth.signOut();
          await utils.auth.isLoggedIn.refetch();
        }}
      />
    </SafeAreaView>
  );
}
