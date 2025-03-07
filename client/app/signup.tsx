import React, { useState } from 'react';
import { 
  Text,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from "expo-router";
import InputField from "../components/InputField";



export default function SignupScreen() {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
  
    const router = useRouter();
  
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
    <View className="h-full bg-[#2C2C2C]">
        <View className="w-full h-[95vh] justify-self-center pt-10 rounded-b-3xl bg-white ">
            <View className="flex-1 justify-center px-8 ">
                {/* Logo and Title */}
                <Image source={require('../assets/images/logo_b.png')} style={{ width: 85, height: 125 }} className="self-center" />
                <Text className="text-3xl font-semibold text-center mb-8">Create an Account</Text>

                <View>
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
                    onChangeText={setPassword} /*secureTextEntry*/ />
                    <InputField label='Confirm Password' placeholder="Confirm Password" value={confirmPassword} onChangeText={setConfirmPassword} /*secureTextEntry*/ />
                </View>

                {/* Sinup Button */}
                <TouchableOpacity className="bg-yellow-400 p-4 rounded-lg mt-6" onPress={handleSignup}>
                    <Text className="text-white text-center font-semibold">Sign Up</Text>
                </TouchableOpacity> 
                    
                    
            </View>
      </View>

      <View className=" bottom-0 w-full">
        {/* Sign-Up Link */}
        <Text className="text-center text-white p-4">
            Already have an account?
            <TouchableOpacity onPress={() => router.push('/login')}>
              <Text className="text-white font-semibold"> Log In</Text>
            </TouchableOpacity>
          </Text>
      </View>
    </View>
  );
}
