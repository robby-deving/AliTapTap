import React from "react";
import { Text, View, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function Index() {
  const router = useRouter();

  return (
    <View className="flex-1 relative bg-white">
      {/* Header */}
      <View className="bg-[#231F20] w-full p-4 flex flex-row items-center pt-20">
        <Image
          source={require("../assets/images/logo.png")}
          style={{ width: 27.61, height: 38 }}
          className="mx-auto"
        />
      </View>

      {/* Main Content */}
      <View className="flex-1 justify-center items-center p-10">
        <Text className="text-2xl font-semibold mb-10">
          Welcome to AliTapTap
        </Text>
        <TouchableOpacity
          className="bg-[#FDCB07] w-full p-4 rounded"
          onPress={() => router.push("/productcatalogue")} // Redirect to Product Catalogue
        >
          <Text className="text-white text-center text-xl font-semibold">
            Browse Products
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
