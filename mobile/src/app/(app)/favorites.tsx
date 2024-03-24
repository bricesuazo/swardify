import { Feather } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import {
  ActivityIndicator,
  FlatList,
  Platform,
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Button,
  Colors,
  Text,
  TouchableOpacity,
  View,
} from 'react-native-ui-lib';
import { api } from '~/utils/trpc';

export default function FavoritesPage() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const getAllFavoritesQuery = api.words.getAllFavorites.useQuery();
  return (
    <View
      flex-1
      style={{ paddingTop: Platform.OS === 'android' ? insets.top : 0 }}
    >
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

      {!getAllFavoritesQuery.data || getAllFavoritesQuery.isLoading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={getAllFavoritesQuery.data}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 20 }}
          ListEmptyComponent={() => (
            <Text center text70L>
              No favorites yet
            </Text>
          )}
          renderItem={({ item }) => {
            if (!item.word) return null;

            return (
              <Link
                key={item.id}
                href={`/${item.word_id}`}
                asChild
                onPress={() => (router.canGoBack() ? router.back() : undefined)}
              >
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
                    {item.word.swardspeak_words.join(' / ')}
                  </Text>
                  <Text
                    $textDefaultLight
                    text
                    text60L
                    style={{ fontFamily: 'Jua-Regular' }}
                  >
                    {item.word.translated_words.join(' / ')}
                  </Text>
                </TouchableOpacity>
              </Link>
            );
          }}
          refreshControl={
            <RefreshControl
              refreshing={getAllFavoritesQuery.isRefetching}
              onRefresh={() => getAllFavoritesQuery.refetch()}
            />
          }
        />
      )}
    </View>
  );
}
