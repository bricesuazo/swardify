import { Link } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { Colors, Text, TouchableOpacity, View } from 'react-native-ui-lib';
import { api } from '~/utils/trpc';

export default function SearchPage() {
  const [search_word, setSearchWord] = useState('');
  const getAllWordsQuery = api.words.getAll.useQuery({ search_word });
  const insets = useSafeAreaInsets();
  return (
    <SafeAreaView>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="p-5 gap-y-8"
      >
        <View>
          <TextInput
            placeholder="Search word"
            style={{
              borderWidth: 2,
              borderColor: Colors.$iconPrimary,
              padding: 20,
              borderRadius: 999,
              fontSize: 16,
            }}
            onChangeText={setSearchWord}
            value={search_word}
          />
        </View>

        {getAllWordsQuery.isLoading || !getAllWordsQuery.data ? (
          <ActivityIndicator />
        ) : (
          <ScrollView keyboardDismissMode="interactive">
            <View className="gap-y-2" style={{ paddingBottom: insets.bottom }}>
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
