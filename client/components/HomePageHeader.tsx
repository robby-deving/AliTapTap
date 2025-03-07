// components/HomePageHeader.tsx
import React from "react";
import { View, TouchableOpacity, Image, SafeAreaView } from "react-native";
import { useRouter } from "expo-router";
import Svg, { Path } from 'react-native-svg';

const ChatIcon = () => (
  <Svg width="22" height="22" viewBox="0 0 22 22" fill="none">
    <Path 
      d="M11.0015 21C13.2203 20.9997 15.3759 20.2614 17.1291 18.9015C18.8823 17.5416 20.1334 15.6372 20.6855 13.4882C21.2376 11.3392 21.0593 9.06759 20.1786 7.03105C19.298 4.9945 17.7651 3.30867 15.8212 2.23895C13.8773 1.16923 11.6328 0.776386 9.44116 1.12226C7.24949 1.46814 5.23509 2.53309 3.7151 4.14946C2.1951 5.76583 1.25584 7.84181 1.04518 10.0506C0.834527 12.2593 1.36444 14.4754 2.55149 16.35L1.00149 21L5.65149 19.45C7.25102 20.4652 9.107 21.0029 11.0015 21Z"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const ProfileIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path 
      d="M12 1C5.9247 1 1 5.9247 1 12C1 18.0753 5.9247 23 12 23C18.0753 23 23 18.0753 23 12C23 5.9247 18.0753 1 12 1Z" 
      stroke="white" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <Path 
      d="M3.49805 18.9806C3.49805 18.9806 5.94995 15.85 11.9999 15.85C18.0499 15.85 20.5029 18.9806 20.5029 18.9806M11.9999 12C12.8752 12 13.7145 11.6523 14.3334 11.0335C14.9523 10.4146 15.2999 9.57522 15.2999 8.7C15.2999 7.82479 14.9523 6.98542 14.3334 6.36655C13.7145 5.74768 12.8752 5.4 11.9999 5.4C11.1247 5.4 10.2854 5.74768 9.66649 6.36655C9.04762 6.98542 8.69995 7.82479 8.69995 8.7C8.69995 9.57522 9.04762 10.4146 9.66649 11.0335C10.2854 11.6523 11.1247 12 11.9999 12Z" 
      stroke="white" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </Svg>
);

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
    <SafeAreaView style={{ backgroundColor: "#231F20" }}>
      <View style={{ width: "100%",  backgroundColor: "#231F20", flexDirection: "row", alignItems: "center", justifyContent: "space-between"}} className="p-5 ">
        {/* Profile Icon */}
        <TouchableOpacity onPress={handleProfilePress}>
          <ProfileIcon />
        </TouchableOpacity>

        {/* Logo */}
        <Image source={require("../assets/images/logo.png")} style={{ width: 27.61, height: 38 }} resizeMode="contain" />

        {/* Chat Icon */}
        <TouchableOpacity onPress={handleChatPress}>
          <ChatIcon />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
