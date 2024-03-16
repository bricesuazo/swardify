import { Link } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
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
        className="gap-y-8"
        style={{ flex: 1 }}
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
          <ScrollView
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
          >
            <View
              paddingH-20
              className="gap-y-2"
              style={{ paddingBottom: insets.bottom }}
            >
              {getAllWordsQuery.data.length === 0 ? (
                <Text center>No words found</Text>
              ) : (
                getAllWordsQuery.data.map((word) => (
                  <Link key={word.id} href={`/(main)/${word.id}`} asChild>
                    <TouchableOpacity
                      activeOpacity={0.5}
                      bg-$iconPrimary
                      paddingH-20
                      paddingV-24
                      br40
                    >
                      <Text $textDefaultLight text70>
                        {word.swardspeak_words.join(' - ')}
                      </Text>
                      <Text $textDefaultLight text>
                        {word.translated_words.join(' - ')}
                      </Text>
                    </TouchableOpacity>
                  </Link>
                ))
              )}
            </View>
          </ScrollView>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
