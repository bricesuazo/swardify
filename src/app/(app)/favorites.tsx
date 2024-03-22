import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Colors, Text, View } from 'react-native-ui-lib';

export default function FavoritesPage() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  return (
    <View style={{ paddingTop: Platform.OS === 'android' ? insets.top : 0 }}>
      <View
        paddingV-8
        style={{
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <View height={40} width={40} center>
          {Platform.OS === 'android' && (
            <Button
              link
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
        </View>
        <Text text60>Favorites</Text>
        <View height={40} width={40} center />
      </View>
    </View>
  );
}
