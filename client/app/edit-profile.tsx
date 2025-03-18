import React, { useState } from "react";
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
  
  const [firstName, setFirstName] = useState("Archie");
  const [lastName, setLastName] = useState("Onoya");
  const [username, setUsername] = useState("archie123");
  const [gender, setGender] = useState("Male");
  const [phone, setPhone] = useState("09123456789");
  const [email, setEmail] = useState("archie@gmail.com");

  const handleSave = () => {
    // Basic validation
    if (!firstName || !lastName || !username || !gender || !email) {
      alert("Please fill in all required fields");
      return;
    }
    // Here you would typically save the changes to your backend
    console.log("Saving profile:", { firstName, lastName, username, gender, phone, email });
    router.push("/profile");
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
                  <View className="border text-base border-gray-300 rounded-lg bg-white">
                    <Picker
                      selectedValue={gender}
                      onValueChange={(itemValue) => setGender(itemValue)}
                      style={{ height: 45 }}
                    >
                      <Picker.Item label="Choose Gender" value="" />
                      <Picker.Item label="Male" value="Male" />
                      <Picker.Item label="Female" value="Female" />
                      <Picker.Item label="Other" value="Other" />
                    </Picker>
                  </View>
                </View>
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