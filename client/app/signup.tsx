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
  Modal,
  LogBox,
} from 'react-native';
import { useRouter } from "expo-router";
import InputField from "../components/InputField";
import TermsContent from "../components/TermsContent";
import { LinearGradient } from 'expo-linear-gradient';

LogBox.ignoreLogs(['VirtualizedLists should never be nested']);

export default function SignupScreen() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const [isTermsModalVisible, setIsTermsModalVisible] = useState(false);

  const router = useRouter();
  const windowHeight = Dimensions.get('window').height;

  const handleSignup = () => {
    if (!isTermsAccepted) {
      setIsTermsModalVisible(true);
      return;
    }
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
        <ScrollView
          contentContainerStyle={{ 
            minHeight: windowHeight
          }}
          keyboardShouldPersistTaps="handled"
          bounces={false}
        >
          <View className="w-full h-[95vh] justify-self-center rounded-b-3xl">
            <LinearGradient colors={['#FFE300', '#FFFFFF', '#FFFFFF', '#FFFFFF']} style={{ flex: 1, borderBottomLeftRadius: 30, borderBottomRightRadius: 30, overflow: 'hidden' }}>
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