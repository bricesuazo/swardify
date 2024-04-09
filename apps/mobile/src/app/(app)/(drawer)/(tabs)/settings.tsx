import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Button } from "react-native-ui-lib";
import { Link, router } from "expo-router";

import { api } from "~/utils/api";
import { supabase } from "~/utils/supabase";

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
          label="Log out"
          onPress={async () => {
            await supabase.auth.signOut();
            await Promise.all([
              utils.auth.isLoggedIn.refetch(),
              utils.invalidate(),
            ]);
            router.navigate("/(app)/(drawer)/(tabs)/");
          }}
        />
      ) : (
        <Link asChild href="/(app)/auth">
          <Button label="Sign in" />
        </Link>
      )}
    </SafeAreaView>
  );
}
