// components/HomePageHeader.tsx
import React from "react";
import { View, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router"; // For navigation

export const HomePageHeader = () => {
  const router = useRouter();

  const handleProfilePress = () => {
    // Placeholder function for now
    console.log("Profile icon pressed");
  };

  const handleChatPress = () => {
    // Placeholder function for now
    console.log("Chat icon pressed");
  };

  return (
    <View style={{ width: "100%", height: 80, backgroundColor: "#1C1C1C", flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingTop: 40 }}>
      {/* Profile Icon */}
      <TouchableOpacity onPress={handleProfilePress}>
        <Ionicons name="person-circle-outline" size={24} color="white" />
      </TouchableOpacity>

      {/* Logo */}
      <Image source={require("../assets/images/logo.png")} style={{ width: 27.61, height: 38 }} resizeMode="contain" />

      {/* Chat Icon */}
      <TouchableOpacity onPress={handleChatPress}>
        <Ionicons name="chatbubble-ellipses-outline" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};
