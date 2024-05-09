import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Text } from "react-native-ui-lib";

export default function ContributePage() {
  const insets = useSafeAreaInsets();
  return (
    <SafeAreaView flex-1 style={{ paddingTop: insets.top + 20 }}>
      <Text>Contribute Page</Text>
    </SafeAreaView>
  );
}
