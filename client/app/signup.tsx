import React, { useState } from 'react';
import { 
  Text,
  View,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useRouter } from "expo-router";
import InputField from "../components/InputField";
import { LinearGradient } from 'expo-linear-gradient';

export default function SignupScreen() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const router = useRouter();
  const windowHeight = Dimensions.get('window').height;

  const handleSignup = () => {
    if (!name || !phone || !email || !password || !confirmPassword) {
      alert('Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    console.log('Signing up with:', { name, phone, email, password });
  };

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
          bounces={false} // Prevents extra bouncing that might show white space
        >
          <View className="w-full h-[95vh] justify-self-center rounded-b-3xl">
            <LinearGradient colors={['#FFE300', '#FFFFFF','#FFFFFF', '#FFFFFF']} style={{ flex: 1, borderBottomLeftRadius: 30, borderBottomRightRadius: 30, overflow: 'hidden' }}>
              <View className="justify-center px-8 pt-10 flex-1">
                <Image 
                  source={require('../assets/images/logo_b.png')} 
                  style={{ width: 88, height: 125 }} 
                  className="self-center" 
                />
                <Text className="text-3xl font-semibold text-center mb-8">
                  Create an Account
                </Text>

                <InputField 
                  label='Name' 
                  placeholder="Enter Name"
                  value={name}
                  onChangeText={setName}
                />
                <InputField 
                  label='Phone Number' 
                  placeholder="Enter Phone Number" 
                  value={phone} 
                  onChangeText={setPhone}
                />
                <InputField 
                  label='Email' 
                  placeholder="Enter Email" 
                  value={email} 
                  onChangeText={setEmail}
                  
                />
                <InputField 
                  label='Password' 
                  placeholder="Enter Password" 
                  value={password} 
                  onChangeText={setPassword}
                  
                />
                <InputField 
                  label='Confirm Password' 
                  placeholder="Confirm Password" 
                  value={confirmPassword} 
                  onChangeText={setConfirmPassword}
                  
                />

                <TouchableOpacity 
                  className="bg-yellow-400 p-4 rounded-lg mt-6" 
                  onPress={handleSignup}
                >
                  <Text className="text-white text-center font-semibold">
                    Sign Up
                  </Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </View>

          <View className="w-full">
            <Text className="text-center text-white p-4">
              Already have an account?
              <TouchableOpacity onPress={() => router.push('/Logiin')}>
                <Text className="text-white font-semibold"> Log In</Text>
              </TouchableOpacity>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}