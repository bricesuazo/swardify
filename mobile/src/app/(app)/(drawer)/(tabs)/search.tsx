import { Link } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  ScrollView,
  TextInput,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { Colors, Text, TouchableOpacity, View } from 'react-native-ui-lib';
import { useDebounceValue } from '~/lib/useDebounceValue';
import { api } from '~/utils/trpc';

export default function SearchPage() {
  const [search_word, setSearchWord] = useState('');

  const [debouncedValue, setDebouncedValue] = useDebounceValue(
    search_word,
    500,
  );
  const getAllWordsQuery = api.words.getAll.useQuery({
    search_word: debouncedValue,
  });
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={{ flex: 1, paddingTop: insets.top + 20 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{
          flex: 1,
          rowGap: 32,
        }}
      >
        <View paddingH-20>
          <TextInput
            placeholder="Search word"
            style={{
              borderWidth: 2,
              borderColor: Colors.$iconPrimary,
              padding: 20,
              borderRadius: 999,
              fontSize: 16,
            }}
            placeholderTextColor={Colors.$iconPrimaryLight}
            onChangeText={(text) => {
              setSearchWord(text);
              setDebouncedValue(text);
            }}
            value={search_word}
          />
        </View>

        {getAllWordsQuery.isLoading || !getAllWordsQuery.data ? (
          <ActivityIndicator />
        ) : (
          <FlatList
            keyboardDismissMode="interactive"
            refreshControl={
              <RefreshControl
                refreshing={getAllWordsQuery.isRefetching}
                onRefresh={() => getAllWordsQuery.refetch()}
              />
            }
            style={{ flex: 1 }}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ padding: 20 }}
            ListEmptyComponent={() => (
              <Text center style={{ fontFamily: 'Jua-Regular' }}>
                No words found
              </Text>
            )}
            data={getAllWordsQuery.data}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Link key={item.id} href={`/${item.id}`} asChild>
                <TouchableOpacity
                  activeOpacity={0.5}
                  bg-$iconPrimary
                  paddingH-20
                  paddingV-24
                  br40
                >
                  <Text
                    $textDefaultLight
                    text50L
                    style={{ fontFamily: 'Jua-Regular' }}
                  >
                    {item.swardspeak_words.join(' / ')}
                  </Text>
                  <Text
                    $textDefaultLight
                    text
                    text60L
                    style={{ fontFamily: 'Jua-Regular' }}
                  >
                    {item.translated_words.join(' / ')}
                  </Text>
                </TouchableOpacity>
              </Link>
            )}
          />
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
