import React, { useState, useEffect } from 'react';
import { 
    Text,
    View,
    Image,
    TouchableOpacity,
    KeyboardAvoidingView,
    Alert,
    ActivityIndicator,
    AppState,
    AppStateStatus,
    ScrollView,
    Dimensions,
    Platform,
} from 'react-native';
import { useRouter } from "expo-router";
import InputField from "../components/InputField";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from 'expo-linear-gradient';

export default function Index() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [checkingAuth, setCheckingAuth] = useState(true);
    const windowHeight = Dimensions.get('window').height;

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

    useEffect(() => {
      const handleAppClose = async (nextAppState: AppStateStatus) => {
        if (nextAppState === "inactive" || nextAppState === "background") {
          await AsyncStorage.removeItem("token");
          setIsAuthenticated(false);
        }
      };
    
      const appStateListener = AppState.addEventListener("change", handleAppClose);
      return () => appStateListener.remove();
    }, []);

    const handleLogin = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://192.168.0.103:4000/api/v1/auth/login", {
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
    
        const { data: userData } = data;
        if (!userData?.token || !userData?._id) throw new Error("Invalid response from server");
    
        if (userData.isAdmin) {
          Alert.alert("Access Denied", "Admin accounts are not allowed to log in.");
          return;
        }
    
        await AsyncStorage.setItem("userData", JSON.stringify(userData));
    
        setIsAuthenticated(true);
        Alert.alert("Login Successful", "You can now access the app.");
      } catch (error) {
        console.error("❌ Login Error:", error);
        Alert.alert("Login Failed", error instanceof Error ? error.message : "An unexpected error occurred.");
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
      <View style={{ flex: 1, backgroundColor: '#2C2C2C' }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={{ 
              minHeight: windowHeight, // Ensure content takes full height
            }}
            keyboardShouldPersistTaps="handled"
            bounces={false}
          >
            {!isAuthenticated && (
              <View className="w-full h-[95vh] justify-self-center rounded-b-3xl">
                <LinearGradient 
                  colors={['#FFE300', '#FFFFFF', '#FFFFFF', '#FFFFFF']} 
                  style={{ 
                    flex: 1, 
                    borderBottomLeftRadius: 30, 
                    borderBottomRightRadius: 30, 
                    overflow: 'hidden' 
                  }}
                >
                  <View className="flex-1 justify-center px-8">
                    <Image 
                      source={require('../assets/images/logo_b.png')} 
                      style={{ width: 105, height: 150 }} 
                      className="self-center" 
                    />
                    <Text className="text-5xl font-semibold text-center mt-2 mb-10">
                      AliTapTap
                    </Text>

                    <InputField 
                      label='Email' 
                      placeholder="Enter Email" 
                      value={email} 
                      onChangeText={setEmail} 
                      keyboardType="email-address"
                    />
                    <InputField 
                      label='Password' 
                      placeholder="Enter Password" 
                      value={password} 
                      onChangeText={setPassword} 
                      secureTextEntry
                    />

                    <TouchableOpacity className="self-end mt-4">
                      <Text className="text-gray-500">Forgot Password?</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                      className="bg-yellow-400 p-4 rounded-lg mt-10" 
                      onPress={handleLogin} 
                      disabled={loading}
                    >
                      <Text className="text-white text-center font-semibold">
                        {loading ? "Logging in..." : "Login"}
                      </Text>
                    </TouchableOpacity>

                    <View className="flex-row items-center mt-6">
                      <View className="flex-1 h-px bg-gray-300" />
                      <Text className="text-gray-400 mx-4">or</Text>
                      <View className="flex-1 h-px bg-gray-300" />
                    </View>

                    <TouchableOpacity className="border border-gray-300 p-4 rounded-lg mt-6 flex-row justify-center items-center">
                      <Image 
                        source={require('../assets/images/google-icon.png')} 
                        className="w-5 h-5 mr-2" 
                      />
                      <Text className="text-gray-500">Sign in with Google</Text>
                    </TouchableOpacity>
                  </View>
                </LinearGradient>
              </View>
            )}

            <View className="w-full">
              <Text className="text-center text-white p-4">
                Don’t have an account?
                <TouchableOpacity onPress={() => router.push("/signup")}>
                  <Text className="text-white font-semibold"> Sign Up</Text>
                </TouchableOpacity>
              </Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    );
}