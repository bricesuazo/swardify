import { Text, TouchableOpacity, View } from "react-native";
import { api } from "@/utils/trpc";

const Home = () => {
  const firstPost = api.firstPost.useQuery();

  return (
    <View className="mt-20 bg-red-500 flex-1 justify-center items-center">
      <Text className="text-white text-3xl">{firstPost.data?.title}</Text>
      <View className="web:max-w-[400px] native:mx-3">
        <Text className="text-white text-md">{firstPost.data?.content}</Text>
      </View>

      <TouchableOpacity className="p-4 bg-blue-500 rounded-lg">
        <Text className="text-white">Test</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Home;
