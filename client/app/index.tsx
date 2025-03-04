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
        <Text className="text-2xl font-semibold mb-10">
          Welcome to AliTapTap
        </Text>
        <TouchableOpacity
          className="bg-[#FDCB07] w-full p-4 rounded"
          onPress={() => router.push("/shipping")} // Navigate to Shipping first
        >
          <Text className="text-white text-center text-xl font-semibold">
            Start Payment
          </Text>
        </TouchableOpacity>


        <TouchableOpacity
          className="bg-[#0759fd] w-full p-4 rounded"
          onPress={() => router.push("/login")} // Navigate to login
        >
          <Text className="text-white text-center text-xl font-semibold">
            Start Login
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
