import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text, View } from 'react-native-ui-lib';

export default function Home() {
  const inset = useSafeAreaInsets();

  return (
    <View>
      <View bg-$iconPrimary style={{ paddingTop: inset.top }}>
        <Text white>Test</Text>
      </View>
    </View>
  );
}
