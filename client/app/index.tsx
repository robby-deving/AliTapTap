import React, { useState, useEffect } from "react";
import { AppState, Text, View, TextInput, TouchableOpacity, Alert, ActivityIndicator, AppStateStatus } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Index() {
  const router = useRouter();
 return (
  <View className="flex-1 justify-center items-center">
  <TouchableOpacity
          className="bg-[#7607fd] w-full p-4 rounded"
          onPress={() => router.push('/login')} // Navigate to login
        >
          <Text className="text-white text-center text-xl font-semibold">
            LATEST Login & Signup
          </Text>
  </TouchableOpacity>
  </View>
 )
}
