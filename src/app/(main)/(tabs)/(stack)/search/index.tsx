import { Link } from 'expo-router';
import {
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

export default function SearchPage() {
  const insets = useSafeAreaInsets();
  return (
    <>
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

        <ScrollView keyboardDismissMode="interactive">
          <View className="gap-y-2" style={{ paddingBottom: insets.bottom }}>
            {Array.from({ length: 15 }).map((_, i) => (
              <Link key={i} href={`/(main)/(tabs)/(stack)/search/${i}`} asChild>
                <Pressable className="px-5 py-8 bg-primary rounded-xl">
                  <Text className="text-white text-lg">Link: {i}</Text>
                </Pressable>
              </Link>
            ))}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}
