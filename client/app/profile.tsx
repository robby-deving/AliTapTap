import React, { useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { Header } from "../components/Header";
import { Asset } from "expo-asset";

export default function Profile() {
  const [userEmail] = useState("archie@gmail.com"); // Simulated user email
  const [userName] = useState("Archie Onoya"); // Simulated user name

  const router = useRouter();

  const handleLogout = () => {
    // Add logout logic here (e.g., clear user session)
    router.push("/login"); // Redirect to login screen after logout
  };

  const handleOrders = () => {
    // Navigate to orders screen
    router.push("/orders");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <View className="flex-1 relative bg-white">
        {/* Header */}
        <Header />

        {/* Scrollable Content */}
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="p-10 w-full items-center">
            <Text className="font-semibold text-3xl border-b-4 pb-2 border-[#FFE300]">
              Profile
            </Text>

            <View className="w-full flex flex-col items-center mt-5">
              <View className="w-full my-12 items-center">
                {/* Profile Icon and Details */}
                <View className="justify-center px-8 pb-6 flex-1">
                    <Image 
                    source={require('../assets/images/profile-icon.png')} 
                    style={{ width:110, height: 110 }} 
                    className="self-center" 
                    />
                </View>
                <Text className="text-black font-semibold text-3xl">
                  {userName}
                </Text>
                <Text className="text-gray-500 text-l">{userEmail}</Text>
              </View>

              {/* My Orders Section */}
                <View className="w-full mb-4">
                    <TouchableOpacity
                        className="border border-gray-200 p-5 rounded-lg bg-white flex-row items-center justify-between" // Changed to justify-between for proper spacing
                        onPress={handleOrders}
                    >
                        <View className="flex-row items-center">
                        <Image
                            source={require('../assets/images/orders-icon.png')}
                            style={{ width: 25, height: 25 }}
                            className="self-center mx-2"
                        />
                        <Text className="text-black text-xl font-semibold">My Orders</Text>
                        </View>
                        <Image
                            source={require('../assets/images/arrow-right-icon.png')}
                            resizeMode="contain" // Ensures the image maintains its aspect ratio
                            style={{ width: 20, height: 20 }}
                            className="self-center ml-2" // Adjusted for spacing
                        />
                    </TouchableOpacity>
                </View>
            </View>
          </View>

          <View className="h-32" />
        </ScrollView>

        {/* Fixed Bottom Logout Button */}
        <View className="absolute bottom-0 w-full p-10 bg-white">
        <TouchableOpacity
            className="border border-[#FFE300] w-full p-4 rounded"
            onPress={handleLogout}
          >
            <Text className="text-[#FFE300] text-center text-l font-semibold">
              Logout
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}