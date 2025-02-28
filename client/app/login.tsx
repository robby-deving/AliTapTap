import React, { useState } from 'react';
import { 
  Text,
  View,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Modal,
  TextInput,
  } from 'react-native';
import { useRouter } from "expo-router";
import InputField from "../components/InputField";
import StepperComponent from '../components/StepperComponent';

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

  return (
    <View className="flex-1 justify-center items-center " style={{ backgroundImage: 'linear-gradient(180deg, #FFE301 0%, #FFF 30%)' }}>
      <View className="w-full px-8">
        {/* Logo and Title */}
        <Image source={require('../assets/images/logo_b.png')} style={{ width: 105, height: 150 }} className="self-center" />
        <Text className="text-5xl font-semibold text-center mt-2 mb-10">AliTapTap</Text>

        {/* Email Input */}
        <InputField
          label='Email'
          placeholder="Enter Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        {/* Password Input */}
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

        <TouchableOpacity className="border border-gray-300 p-4 rounded-lg mt-4 flex-row justify-center items-center">
          
          <Text className="text-gray-500">Sign in with Google</Text>
        </TouchableOpacity>

        {/* Sign-Up Link */}
        <Text className="text-center text-gray-500 mt-8">
          Don’t have an account? <Text className="text-blue-500">Sign Up</Text>
        </Text>
      </View>
    </View>
  );
}
