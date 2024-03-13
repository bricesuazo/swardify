import { Link } from 'expo-router';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { Button } from 'react-native-ui-lib';
import { api } from '~/utils/trpc';

export default function SearchPage() {
  const getAllWordsQuery = api.words.getAll.useQuery();
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
            className="p-5 border-2 rounded-full border-primary text-lg"
          />
        </View>
        <Button
          label={getAllWordsQuery.isRefetching ? 'Refreshing...' : 'Refresh'}
          onPress={() => getAllWordsQuery.refetch()}
          disabled={getAllWordsQuery.isRefetching}
        />
        {getAllWordsQuery.isLoading || !getAllWordsQuery.data ? (
          <ActivityIndicator />
        ) : (
          <ScrollView keyboardDismissMode="interactive">
            <View className="gap-y-2" style={{ paddingBottom: insets.bottom }}>
              {getAllWordsQuery.data.map((word) => (
                <Link key={word.id} href={`/(main)/${word.id}`} asChild>
                  <Pressable className="px-5 py-6 bg-primary rounded-xl">
                    <Text className="text-white text-lg">
                      {word.swardspeak_words.join(' - ')}
                    </Text>
                    <Text className="text-muted">
                      {word.translated_words.join(' - ')}
                    </Text>
                  </Pressable>
                </Link>
              ))}
            </View>
          </ScrollView>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
