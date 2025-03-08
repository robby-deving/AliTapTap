import React, { useState, useEffect } from "react";
import { AppState, Text, View, TextInput, TouchableOpacity, Alert, ActivityIndicator, AppStateStatus } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Index() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // ✅ Load authentication token on app starts
  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        setIsAuthenticated(true);
      }
      setCheckingAuth(false);
    };
    checkAuth();
  }, []);

  // ✅ Listen for app state changes (log out on close)
  useEffect(() => {
    const handleAppClose = async (nextAppState: AppStateStatus) => {
      if (nextAppState === "inactive" || nextAppState === "background") {
        await AsyncStorage.removeItem("token"); // Clear token on app close
        setIsAuthenticated(false);
      }
    };
  
    const appStateListener = AppState.addEventListener("change", handleAppClose);
    return () => appStateListener.remove();
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://192.168.137.1:4000/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
  
      const text = await response.text();
      console.log("🔍 Raw Server Response:", text);
  
      let data;
      try {
        data = JSON.parse(text);
      } catch (err) {
        throw new Error("Invalid JSON response from server");
      }
  
      if (!response.ok) throw new Error(data.message || "Login failed");
  
      const { data: userData } = data; // Extract `data` object
      if (!userData?.token || !userData?._id) throw new Error("Invalid response from server");
  
      // ✅ Prevent admin login
      if (userData.isAdmin) {
        Alert.alert("Access Denied", "Admin accounts are not allowed to log in.");
        return;
      }
  
      // ✅ Store user data in AsyncStorage
      await AsyncStorage.setItem("userData", JSON.stringify(userData));
  
      setIsAuthenticated(true);
      Alert.alert("Login Successful", "You can now access the chat and shipping.");
    } catch (error) {
      console.error("❌ Login Error:", error);
  
      if (error instanceof Error) {
        Alert.alert("Login Failed", error.message);
      } else {
        Alert.alert("Login Failed", "An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };  

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    setIsAuthenticated(false);
    Alert.alert("Logged Out", "You have been logged out.");
    router.replace("/");
  };

  if (checkingAuth) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#FDCB07" />
      </View>
    );
  }

  return (
    <View className="flex-1 justify-center items-center p-10 bg-white">
      <Text className="text-2xl font-semibold mb-10">Welcome to AliTapTap</Text>

      {/* Buttons */}
      <TouchableOpacity className="bg-[#FDCB07] w-full p-4 rounded mb-4" onPress={() => router.push("/edit")}>
        <Text className="text-white text-center text-xl font-semibold">Start Payment</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className={`w-full p-4 rounded mb-4 ${isAuthenticated ? "bg-[#007AFF]" : "bg-gray-400"}`}
        onPress={() => isAuthenticated ? router.push("/chat") : Alert.alert("Access Denied", "Please log in first.")}
      >
        <Text className="text-white text-center text-xl font-semibold">Go to Chat</Text>
      </TouchableOpacity>

      <TouchableOpacity className="bg-[#34C759] w-full p-4 rounded" onPress={() => router.push("/reviewDesign")}>
        <Text className="text-white text-center text-xl font-semibold">Review Design</Text>
      </TouchableOpacity>

      <TouchableOpacity className={`w-full p-4 rounded mt-4 ${isAuthenticated ? "bg-[#FF9500]" : "bg-gray-400"}`} onPress={() => isAuthenticated ? router.push("/shipping") : Alert.alert("Access Denied", "Please log in first.")}>
        <Text className="text-white text-center text-xl font-semibold">Go to Shipping</Text>
      </TouchableOpacity>

      {/* Logout Button */}
      {isAuthenticated && (
        <TouchableOpacity className="bg-red-500 w-full p-4 rounded mt-4" onPress={handleLogout}>
          <Text className="text-white text-center text-xl font-semibold">Logout</Text>
        </TouchableOpacity>
      )}

      {/* Login Form */}
      {!isAuthenticated && (
        <View className="mt-10 w-full">
          <Text className="text-2xl font-semibold mb-5">Login</Text>

          <TextInput
            className="border border-gray-300 w-full p-4 rounded mb-4"
            placeholder="Email"
            onChangeText={setEmail}
            value={email}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            className="border border-gray-300 w-full p-4 rounded mb-4"
            placeholder="Password"
            onChangeText={setPassword}
            value={password}
            secureTextEntry
          />

          <TouchableOpacity className="bg-[#FDCB07] w-full p-4 rounded" onPress={handleLogin} disabled={loading}>
            <Text className="text-white text-center text-xl font-semibold">{loading ? "Logging in..." : "Login"}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
