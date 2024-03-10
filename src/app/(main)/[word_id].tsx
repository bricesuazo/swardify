import { useLocalSearchParams } from 'expo-router';
import { Text } from 'react-native';

export default function WordPage() {
  const { word_id } = useLocalSearchParams();

  return <Text>Blog post: {word_id}</Text>;
}
