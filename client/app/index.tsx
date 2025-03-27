import React, { useEffect, useRef } from "react";
import { Text, View, TouchableOpacity, Image, Animated } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Index() {
  const router = useRouter();
  const logoPosition = useRef(new Animated.Value(500)).current;
  
  useEffect(() => {
    // Animate logo
    Animated.spring(logoPosition, {
      toValue: 0,
      useNativeDriver: true,
      tension: 10,
      friction: 8
    }).start();

    const checkAndNavigate = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        
        if (token) {
          router.replace("/productcatalogue");
        } else {
          router.replace("/login");
        }
      } catch (error) {
        console.error("Navigation error:", error);
        router.replace("/login");
      }
    };

    // Start checking after logo animation
    setTimeout(checkAndNavigate, 1000);
  }, []);
  return (
    <View className="flex-1 relative">
      <LinearGradient
        colors={['#FFE300', '#FFFFFF','#FFFFFF']}
        style={{ flex: 1 }}
      >
        {/* Main Content */}
        <View className="flex-1 justify-center items-center p-10">
          <Animated.Image
            source={require('../assets/images/logoBlack.png')}
            style={[
              {
                width: 200,
                height: 200,
                marginBottom: 20,
                transform: [{ translateY: logoPosition }]
              }
            ]}
            resizeMode="contain"
          />
          
        </View>
      </LinearGradient>
    </View>
  );
}