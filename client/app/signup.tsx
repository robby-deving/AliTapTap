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
  LogBox,
  TextInput,
  Pressable,
} from 'react-native';
import { useRouter } from "expo-router";
import TermsContent from "../components/TermsContent";
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons'; // For the eye icon
import Modal from 'react-native-modal';

LogBox.ignoreLogs(['VirtualizedLists should never be nested']);

// Custom InputField component (assumed structure)
const InputField = ({ label, placeholder, value, onChangeText, secureTextEntry, toggleSecureEntry, showToggle }) => (
  <View className="mb-4">
    <Text className="text-sm font-medium mb-1">{label}</Text>
    <View className="relative">
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        className="bw-full p-4 border border-gray-300 rounded-lg bg-white"
        placeholderTextColor="#A0A0A0"
      />
      {showToggle && (
        <Pressable onPress={toggleSecureEntry} className="absolute right-3 top-3">
          <Ionicons name={secureTextEntry ? 'eye-off' : 'eye'} size={24} color="gray" />
        </Pressable>
      )}
    </View>
  </View>
);

export default function SignupScreen() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [gender, setGender] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const [isTermsModalVisible, setIsTermsModalVisible] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isGenderModalVisible, setIsGenderModalVisible] = useState(false);

  const router = useRouter();
  const windowHeight = Dimensions.get('window').height;
  const Base_Url = 'http://192.168.231.87:4000';

  const handleSignup = async () => {
    if (!isTermsAccepted) {
      setIsTermsModalVisible(true);
      return;
    }
    if (!firstName || !lastName || !username || !gender || !phone || !email || !password || !confirmPassword) {
      alert('Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }


    
    try {
      const response = await fetch(`${Base_Url}/api/v1/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          first_name: firstName,    // Changed to match server model
          last_name: lastName,      // Changed to match server model
          username,
          email,
          password,
          phone_number: phone,      // Changed to match server model
          gender,
          profile_picture: null,    // Added missing field
          isAdmin: false,           // Added missing field
          address: [],             // Added missing field
          payment_method: []        // Added missing field
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.message || 'Registration failed');
        return;
      }
  
      const data = await response.json();
      alert('Registration successful!');
      router.push('/login');
    } catch (error) {
      console.error('Registration error:', error);
      alert('An error occurred during registration');
    }
  };

  const handleTermsAccept = () => {
    setIsTermsAccepted(true);
    setIsTermsModalVisible(false);
  };

  const handleTermsDecline = () => {
    setIsTermsAccepted(false);
    setIsTermsModalVisible(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#2C2C2C' }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <LinearGradient 
          colors={['#FFE300', '#FFFFFF', '#FFFFFF', '#FFFFFF']} 
          style={{ 
            flex: 1,
            borderBottomLeftRadius: 30, 
            borderBottomRightRadius: 30, 
            overflow: 'hidden',
          }}
        >
         <View className="pt-20">
            <Image 
              source={require('../assets/images/logo_b.png')} 
              style={{ width: 88, height: 125 }} 
              className="self-center" 
            />
          </View>
          <Text className="text-3xl font-semibold text-center mb-5">
            Create an Account
          </Text>
          <ScrollView
            contentContainerStyle={{ 
              paddingBottom: 80, // Space for the fixed button
              paddingTop: 10, // Space for the logo and title
            }}
            keyboardShouldPersistTaps="handled"
            bounces={false}
          >
            <View className="px-8">
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
                  onPress={() => setIsGenderModalVisible(true)}
                  className="border border-gray-300 rounded-lg bg-white p-4 flex-row justify-between items-center"
                >
                  <Text className={gender ? "text-black" : "text-gray-400"}>
                    {gender || "Choose Gender"}
                  </Text>
                  <Ionicons name="chevron-down" size={20} color="gray" />
                </TouchableOpacity>

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
              </View>
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
                secureTextEntry={!showPassword}
                toggleSecureEntry={() => setShowPassword(!showPassword)}
                showToggle={true}
              />
              <InputField 
                label='Confirm Password' 
                placeholder="Confirm Password" 
                value={confirmPassword} 
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                toggleSecureEntry={() => setShowConfirmPassword(!showConfirmPassword)}
                showToggle={true}
              />
            </View>
          </ScrollView>

          {/* Fixed Sign Up Button */}
          <View style={{ 
            position: 'absolute', 
            bottom: 20, 
            left: 0, 
            right: 0, 
            paddingHorizontal: 28 
          }}>
            <TouchableOpacity 
              className="bg-yellow-400 p-5 rounded-lg"
              onPress={handleSignup}
            >
              <Text className="text-white text-center font-semibold">
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <View className="w-full">
          <Text className="text-center text-white p-4 pb-6">
            Already have an account?
            <TouchableOpacity onPress={() => router.push('/Logiin')}>
              <Text className="text-white font-semibold"> Log In</Text>
            </TouchableOpacity>
          </Text>
        </View>
      </KeyboardAvoidingView>

      {/* Terms and Conditions Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isTermsModalVisible}
        onRequestClose={() => setIsTermsModalVisible(false)}
      >
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}>
          <View style={{
            backgroundColor: 'white',
            marginHorizontal: 20,
            padding: 25,
            borderRadius: 20,
            width: '90%',
            maxHeight: '80%',
            elevation: 5,
          }}>
            <View className="w-full items-center">
              <Text className="font-bold text-3xl border-b-4 pb-2 border-[#FFE300]">
                Terms and Conditions
              </Text>
              <Text className="text-xs m-4 text-gray-600 text-center">
                Last Updated: Feb 27, 2025
              </Text>
            </View>
            
            <ScrollView
              style={{ flexGrow: 1 }}
              showsVerticalScrollIndicator={true}
            >
              <TermsContent />
            </ScrollView>

            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 20,
            }}>
              <TouchableOpacity
                className="bg-gray-300 p-4 rounded-lg w-[47%] items-center"
                onPress={handleTermsDecline}
              >
                <Text className="text-white font-semibold">Decline</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="bg-yellow-400 p-4 rounded-lg w-[47%] items-center"
                onPress={handleTermsAccept}
              >
                <Text className="text-white font-semibold"> Agree</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}