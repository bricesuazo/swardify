import { Ionicons } from '@expo/vector-icons';
import { RefreshControl, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Colors, Text, TextField, View } from 'react-native-ui-lib';

export default function Home() {
  const inset = useSafeAreaInsets();

  return (
    <View flex-1>
      <View
        bg-$iconPrimary
        style={{ position: 'relative', paddingTop: inset.top }}
      >
        <View paddingH-20 paddingV-40>
          <View
            br40
            style={{ borderColor: 'white', borderWidth: 2, overflow: 'hidden' }}
          >
            <View paddingH-16 paddingV-20>
              <Text white>Swardspeak</Text>
              <TextField
                white
                text50
                placeholder="Type swardspeak sentence"
                placeholderTextColor={Colors.$iconPrimaryLight}
                fieldStyle={{ paddingVertical: 16 }}
              />
            </View>
            <View
              paddingH-16
              paddingV-20
              bg-white
              style={{ position: 'relative' }}
            >
              <Text>Tagalog</Text>

              <TextField
                text50
                readOnly
                placeholder="Tagalog translation"
                placeholderTextColor={Colors.$iconPrimaryLight}
                fieldStyle={{ paddingVertical: 16 }}
              />

              <Button
                label="Copy"
                size={Button.sizes.xSmall}
                style={{ position: 'absolute', top: 16, right: 12 }}
              />
            </View>
          </View>
        </View>
        <Button
          round
          iconSource={() => (
            <Ionicons
              name="swap-vertical"
              size={24}
              color={Colors.$iconPrimary}
            />
          )}
          bg-white
          style={{
            width: 52,
            height: 52,
            position: 'absolute',
            borderWidth: 4,
            borderColor: Colors.$iconPrimary,
            top: '50%',
            left: '50%',
            transform: [{ translateX: -28 }, { translateY: 16 }],
          }}
        />
      </View>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={() => {}} />
        }
      >
        <View padding-20>
          <Text center text60>
            History
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
