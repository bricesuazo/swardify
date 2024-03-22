import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Colors, Text, View } from 'react-native-ui-lib';

export default function InfoPage() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  return (
    <View style={{ paddingTop: Platform.OS === 'android' ? insets.top : 0 }}>
      {Platform.OS === 'android' && (
        <Button
          link
          style={{
            zIndex: 2,
            position: 'absolute',
            top: insets.top + 12,
          }}
          onPress={() =>
            router.canGoBack() ? router.back() : router.replace('/')
          }
          iconSource={() => (
            <Feather
              name="chevron-left"
              size={24}
              color={Colors.$iconPrimary}
            />
          )}
          round
        />
      )}
      <View padding-20>
        <Text center text50>
          Information
        </Text>
      </View>
    </View>
  );
}
