import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Colors, Text, TextField, View } from 'react-native-ui-lib';
import { useInterval } from '~/lib/useInterval';
import { api } from '~/utils/trpc';

export default function Home() {
  const inset = useSafeAreaInsets();
  const [copied, setCopied] = useState(false);
  const [tagalog, setTagalog] = useState('');
  const [swardspeak, setSwardspeak] = useState('');
  const getAllTranslationHistoriesQuery =
    api.words.getAllTranslationHistories.useQuery();

  useInterval(
    () => {
      setCopied(false);
    },
    copied ? 2000 : null,
  );

  return (
    <View flex-1>
      <View
        bg-$iconPrimary
        style={{ position: 'relative', paddingTop: inset.top + 20 }}
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
                fieldStyle={{ height: 60 }}
                value={swardspeak}
                onChangeText={setSwardspeak}
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
                fieldStyle={{ height: 60 }}
                value={tagalog}
                onChangeText={setTagalog}
              />

              <Button
                label={copied ? 'Copied!' : 'Copy'}
                onPress={() => setCopied(true)}
                size={Button.sizes.xSmall}
                disabled={copied}
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
            transform: [{ translateX: -24 }, { translateY: 32 }],
          }}
        />
      </View>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={getAllTranslationHistoriesQuery.isRefetching}
            onRefresh={getAllTranslationHistoriesQuery.refetch}
          />
        }
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        <View padding-20>
          <Text center text60 $textNeutralHeavy marginB-20>
            History
          </Text>

          {getAllTranslationHistoriesQuery.isLoading ||
          !getAllTranslationHistoriesQuery.data ? (
            <View center>
              <ActivityIndicator />
            </View>
          ) : getAllTranslationHistoriesQuery.data.length === 0 ? (
            <Text center>No translation history found</Text>
          ) : (
            getAllTranslationHistoriesQuery.data.map((translationHistory) => (
              <View
                key={translationHistory.id}
                paddingH-20
                paddingV-24
                br40
                marginB-12
                style={{
                  borderWidth: 2,
                  borderColor: Colors.$textNeutralLight,
                }}
              >
                <Text text70>{translationHistory.swardspeak}</Text>
                <Text text>{translationHistory.tagalog}</Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}
