import { AntDesign } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { DrawerActions } from '@react-navigation/native';
import { Link, Tabs, useNavigation } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Colors, View } from 'react-native-ui-lib';
import { useStore } from '~/store';

export default function TabLayout() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const topbarStyle = useStore((state) => state.topbarStyle);

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: Colors.$iconPrimary,
        }}
      >
        <Tabs.Screen
          name="search"
          options={{
            title: 'Search',
            tabBarIcon: ({ color, size }) => (
              <AntDesign name="search1" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="index"
          options={{
            title: 'Translate',
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="translate" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Settings',
            tabBarIcon: ({ color, size }) => (
              <AntDesign name="setting" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
      <View
        style={{
          paddingTop: insets.top,
          position: 'absolute',
          top: 0,
        }}
      >
        <View
          style={{
            height: 60,
            paddingHorizontal: 20,
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
            alignItems: 'center',
          }}
        >
          <Button
            onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
            iconSource={() => (
              <Feather
                name="menu"
                size={24}
                color={topbarStyle === 'light' ? 'white' : 'black'}
              />
            )}
            bg-transparent
          />

          <MaterialIcons
            name="translate"
            size={32}
            color={topbarStyle === 'light' ? 'white' : Colors.$iconPrimary}
          />
          <Link href="/(main)/info" asChild>
            <Button
              iconSource={() => (
                <Feather
                  name="info"
                  size={24}
                  color={topbarStyle === 'light' ? 'white' : 'black'}
                />
              )}
              bg-transparent
            />
          </Link>
        </View>
      </View>
    </>
  );
}