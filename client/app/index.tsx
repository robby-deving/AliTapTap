import React, { useEffect, useRef } from "react";
import { Text, View, TouchableOpacity, Image, Animated } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from 'expo-linear-gradient';

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

    // Check internet connection and navigate after animation
    const checkConnectionAndNavigate = async () => {
      try {
        const response = await fetch('https://www.google.com');
        if (response.ok) {
          // Wait for 2 seconds to show splash screen
          setTimeout(() => {
            // more security logic here check if user is logged in or not maybe check if token is still valid, if yes redirect to product if not to login
            router.replace('/productcatalogue');
          }, 1000);
        }
      } catch (error) {
        // Show error message if no internet
        alert('Please check your internet connection');
      }
    };

    // Start checking after logo animation
    setTimeout(checkConnectionAndNavigate, 1000);
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