import { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { supabase } from '~/trpc/supabase';
import { Database } from '~/types/supabase';
import { api } from '~/utils/trpc';

export default function Home() {
  const utils = api.useUtils();
  const isLoggedInQuery = api.auth.isLoggedIn.useQuery();
  const firstPost = api.firstPost.useQuery();

  const [users, setUsers] = useState<
    Database['public']['Tables']['users']['Row'][]
  >([]);

  useEffect(() => {
    getUsers();
  }, []);

  async function getUsers() {
    const { data } = await supabase.from('users').select();
    setUsers(data ? data : []);
  }
  return (
    <View className="mt-20 flex-1 items-center justify-center">
      <Text>is logged in: {JSON.stringify(isLoggedInQuery.data)}</Text>
      <Text>server: {JSON.stringify(firstPost.data)}</Text>
      <Text>client: {JSON.stringify(users)}</Text>
      <View className="native:mx-3 web:max-w-[400px]"></View>
      <TouchableOpacity
        className="rounded-lg bg-blue-500 p-4"
        onPress={() => {
          firstPost.refetch();
          getUsers();
        }}
      >
        <Text className="text-white">Revalidate</Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="rounded-lg bg-blue-500 p-4"
        onPress={async () => {
          await supabase.auth.signOut();
          await utils.auth.isLoggedIn.refetch();
        }}
      >
        <Text className="text-white">Logout</Text>
      </TouchableOpacity>
    </View>
  );
}
