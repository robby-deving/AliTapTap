import React from "react";
import { Text, View, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function Index() {
  const router = useRouter();

  return (
    <View className="flex-1 relative bg-white">
      <View className="bg-[#231F20] w-full p-4 flex flex-row items-center pt-20">
        <Image
          source={require("../assets/images/logo.png")}
          style={{ width: 27.61, height: 38 }}
          className="mx-auto"
        />
      </View>

      <View className="flex-1 justify-center items-center p-10">
        <Text className="text-2xl font-semibold mb-10">Welcome to AliTapTap</Text>

        <TouchableOpacity 
          className="bg-[#FDCB07] w-full p-4 rounded mb-4"
          onPress={() => router.push('/edit')}
        >
          <Text className="text-white text-center text-xl font-semibold">
            Start Payment
          </Text>
        </TouchableOpacity>

        {/* Go to Chat Button */}
        <TouchableOpacity
          className="bg-[#007AFF] w-full p-4 rounded mb-4"
          onPress={() => router.push("/chat")}
        >
          <Text className="text-white text-center text-xl font-semibold">
            Go to Chat
          </Text>
        </TouchableOpacity>

        {/* Review Design Button */}
        <TouchableOpacity
          className="bg-[#34C759] w-full p-4 rounded"
          onPress={() => router.push("/reviewDesign")}
        >
          <Text className="text-white text-center text-xl font-semibold">
            Review Design
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
