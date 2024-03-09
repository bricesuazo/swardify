import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '~/trpc/supabase';
import { api } from '~/utils/trpc';

export default function SettingsPage() {
  const utils = api.useUtils();

  return (
    <SafeAreaView>
      <TouchableOpacity
        className="rounded-lg bg-blue-500 p-4"
        onPress={async () => {
          await supabase.auth.signOut();
          await utils.auth.isLoggedIn.refetch();
        }}
      >
        <Text className="text-white">Logout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
