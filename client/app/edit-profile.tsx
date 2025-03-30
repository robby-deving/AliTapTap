import React, { useState , useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Image,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";
import { Header } from "../components/Header";
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Modal from "react-native-modal";
import { Ionicons } from "@expo/vector-icons";

// Add this interface at the top of the file, after the imports
interface User {
  _id: string;
  token: string;
  first_name: string;
  last_name: string;
  username: string;
  gender: string;
  phone: string;
  email: string;
}

// Reusing the same InputField component from SignupScreen
const InputField = ({ label, placeholder, value, onChangeText }) => (
  <View className="mb-4">
    <Text className="text-sm font-medium mb-1">{label}</Text>
    <View className="relative">
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        className="bw-full p-4 border border-gray-300 rounded-lg bg-white"
        placeholderTextColor="#A0A0A0"
      />
    </View>
  </View>
);

export default function EditProfile() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [gender, setGender] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isGenderModalVisible, setIsGenderModalVisible] = useState(false);
  const Base_Url = 'http://192.168.137.1:4000';

  useEffect(() => {
    const initializeUser = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        if (userData) {
          const parsedUserData = JSON.parse(userData);
          console.log('Parsed user data:', parsedUserData);
          
          setUser(parsedUserData);
          setFirstName(parsedUserData.first_name || '');
          setLastName(parsedUserData.last_name || '');
          setUsername(parsedUserData.username || '');
          setGender(parsedUserData.gender || '');
          setPhone(parsedUserData.phone_number || '');
          setEmail(parsedUserData.email || '');
        }
      } catch (err) {
        console.error('Error loading user data:', err);
        setError('Failed to load user data');
      }
    };

    initializeUser();
  }, []);

  const handleSave = async () => {
    if (!firstName || !lastName || !username || !gender || !phone || !email) {
      alert('Please fill in all fields');
      return;
    }

    if (!user || !user.token) {
      alert('User not authenticated');
      return;
    }

    try {
      const response = await fetch(`${Base_Url}/api/v1/users/update/${user._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          username,
          email,
          phone_number: phone,
          gender,
        }),
      });

      // Log the raw response for debugging
      const responseText = await response.text();
      console.log('Raw response:', responseText);
  
      if (!response.ok) {
        try {
          const errorData = JSON.parse(responseText);
          alert(errorData.message || 'Updating profile failed');
        } catch (parseError) {
          console.error('Error parsing error response:', parseError);
          alert(`Server error: ${responseText.substring(0, 100)}`);
        }
        return;
      }
  
      try {
        const data = JSON.parse(responseText);
        
        // Update the stored user data
        await AsyncStorage.setItem('userData', JSON.stringify({
          ...user,
          first_name: firstName,
          last_name: lastName,
          username,
          email,
          phone,
          gender,
        }));
        
        alert('Profile updated successfully!');
        router.push('/profile');
      } catch (parseError) {
        console.error('Error parsing success response:', parseError);
        alert('Server returned invalid data');
      }
    } catch (error) {
      console.error('Update error:', error);
      alert(`Network error: ${error.message}`);
    }
  };

  const handleCancel = () => {
    router.push("/profile");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <View className="flex-1 bg-white">
        {/* Header */}
        <Header />

        {/* Scrollable Content */}
        <ScrollView 
          className="flex-1" 
          showsVerticalScrollIndicator={false}
        >
          <View className="p-10 w-full items-center">
            <Text className="font-semibold text-3xl border-b-4 pb-2 border-[#FFE300]">
              Edit Profile
            </Text>

            <View className="w-full flex flex-col items-center mt-5">
              {/* Profile Icon */}
              <View className="my-8 items-center">
                <Image 
                  source={require('../assets/images/profile-icon.png')} 
                  style={{ width: 100, height: 100 }} 
                  className="self-center" 
                />
              </View>

              <View className="w-full">
                <InputField 
                  label='First Name' 
                  placeholder="Enter First Name"
                  value={firstName}
                  onChangeText={setFirstName}
                />
                <InputField 
                  label='Last Name' 
                  placeholder="Enter Last Name"
                  value={lastName}
                  onChangeText={setLastName}
                />
                <InputField 
                  label='Username' 
                  placeholder="Enter Username"
                  value={username}
                  onChangeText={setUsername}
                />
                <View className="mb-4">
                  <Text className="text-sm font-medium mb-1">Gender</Text>
                  <TouchableOpacity
                    className="w-full p-4 border border-gray-300 rounded-lg bg-white flex-row justify-between items-center"
                    onPress={() => setIsGenderModalVisible(true)}
                  >
                    <Text className={gender ? "text-black" : "text-gray-400"}>
                      {gender || "Select Gender"}
                    </Text>
                    <Ionicons name="chevron-down" size={20} color="#A0A0A0" />
                  </TouchableOpacity>
                </View>
                <Modal
                  isVisible={isGenderModalVisible}
                  onBackdropPress={() => setIsGenderModalVisible(false)}
                  backdropOpacity={0.5}
                  style={{ margin: 0, justifyContent: 'flex-end' }}
                >
                  <View className="bg-white rounded-t-3xl">
                    <View className="p-4 border-b border-gray-200">
                      <Text className="text-xl font-semibold text-center">Select Gender</Text>
                    </View>
                    
                    {["Male", "Female", "Other"].map((item) => (
                      <TouchableOpacity
                        key={item}
                        className={`p-4 border-b border-gray-100 ${gender === item ? 'bg-yellow-50' : ''}`}
                        onPress={() => {
                          setGender(item);
                          setIsGenderModalVisible(false);
                        }}
                      >
                        <View className="flex-row justify-between items-center">
                          <Text className={`text-lg ${gender === item ? 'text-yellow-500 font-semibold' : 'text-gray-700'}`}>
                            {item}
                          </Text>
                          {gender === item && (
                            <Ionicons name="checkmark" size={24} color="#EAB308" />
                          )}
                        </View>
                      </TouchableOpacity>
                    ))}
                    
                    <TouchableOpacity
                      className="p-4 bg-gray-50"
                      onPress={() => setIsGenderModalVisible(false)}
                    >
                      <Text className="text-center text-gray-500 font-semibold">Cancel</Text>
                    </TouchableOpacity>
                  </View>
                </Modal>
                <InputField 
                  label='Phone Number (optional)' 
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
              </View>

              {/* Buttons (non-fixed) */}
              <View className="w-full mt-6">
                <TouchableOpacity
                  className="bg-yellow-400 p-5 rounded-lg mb-4"
                  onPress={handleSave}
                >
                  <Text className="text-white text-center font-semibold">
                    Save Changes
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="border border-[#FFE300] p-5 rounded-lg"
                  onPress={handleCancel}
                >
                  <Text className="text-[#FFE300] text-center font-semibold">
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}