import { Text, TouchableOpacity, View } from "react-native";
import { api } from "~/utils/trpc";

const Home = () => {
  const firstPost = api.firstPost.useQuery();

  return (
    <View className="mt-20 flex-1 items-center justify-center bg-red-500">
      <Text className="text-3xl text-white">
        {JSON.stringify(firstPost.data)}
      </Text>
      <View className="native:mx-3 web:max-w-[400px]"></View>
      <TouchableOpacity className="rounded-lg bg-blue-500 p-4">
        <Text className="text-white">Testasd</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Home;
