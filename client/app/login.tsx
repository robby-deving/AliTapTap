import React, { useState } from 'react';
import { 
  Text,
  View,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
import { useRouter } from "expo-router";
import InputField from "../components/InputField";
import { ScrollView } from 'react-native-gesture-handler';



export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (!email || !password) {
      alert('Please enter email and password');
      return;
    }
    console.log('Logging in with:', { email, password });
  };

  const router = useRouter();

  return (
    <View className="h-full bg-[#2C2C2C]">
      <View className="w-full h-[95vh] justify-self-center pt-10 rounded-b-3xl bg-white ">
        <View className="flex-1 justify-center px-8 ">
          
              {/* Logo and Title */}
              <Image source={require('../assets/images/logo_b.png')} style={{ width: 105, height: 150 }} className="self-center" />
              <Text className="text-5xl font-semibold text-center mt-2 mb-10">AliTapTap</Text>

              <View>
              {/* Email Input */}
              <InputField
                label='Email'
                placeholder="Enter Email"
                value={email}
                onChangeText={setEmail}
                /*keyboardType="email-address"*/
              />
              {/* Password Input */}
              <InputField
                label='Password'
                placeholder="Enter Password"
                value={password}
                onChangeText={setPassword}
                /*secureTextEntry*/
                />
              </View>
            
              <TouchableOpacity className="self-end mt-4">
                <Text className="text-gray-500">Forgot Password?</Text>
              </TouchableOpacity>

              {/* Login Button */}
              <TouchableOpacity className="bg-yellow-400 p-4 rounded-lg mt-10" onPress={handleLogin}>
                <Text className="text-white text-center font-semibold">Login</Text>
              </TouchableOpacity>

              {/* Google Sign-In */}
              <View className="flex-row items-center mt-6">
                <View className="flex-1 h-px bg-gray-300" />
                <Text className="text-gray-400 mx-4">or</Text>
                <View className="flex-1 h-px bg-gray-300" />
              </View>

              <TouchableOpacity className="border border-gray-300 p-4 rounded-lg mt-6 flex-row justify-center items-center">
                <Image source={require('../assets/images/google-icon.png')} className="w-5 h-5 mr-2" />
                <Text className="text-gray-500">Sign in with Google</Text>
              </TouchableOpacity>
          </View>
        </View>

        <KeyboardAvoidingView className=" bottom-0 h-12 w-full">
          {/* Sign-Up Link */}
          <Text className="text-center text-white p-4">
            Don’t have an account?
            <TouchableOpacity
            onPress={() => router.push("/signup")} // Navigate to login
            >
              <Text className="text-white font-semibold"> Sign Up</Text>
            </TouchableOpacity>
          </Text>
        </KeyboardAvoidingView>
    </View>
  );
}
