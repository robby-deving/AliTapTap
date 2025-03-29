import React, { useState, useRef } from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const InputField = ({ label, placeholder, value, onChangeText, secureTextEntry, toggleSecureEntry, showToggle, error,
}) => (
  <View className="mb-4">
    <Text className="text-base font-medium mb-1">{label}</Text>
    <View className="relative">
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        className={`w-full p-4 border rounded-lg bg-white ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
        placeholderTextColor="#A0A0A0"
      />
      {showToggle && (
        <TouchableOpacity onPress={toggleSecureEntry} className="absolute right-5 top-3">
          <Ionicons name={secureTextEntry ? 'eye-off' : 'eye'} size={22} color="gray"/>
        </TouchableOpacity>
      )}
    </View>
    {error && <Text className="text-red-500 text-sm mt-1">{error}</Text>}
  </View>
);

export default function ForgotPassword() {
  const router = useRouter();
  const windowHeight = Dimensions.get('window').height;

  // State for managing the UI steps
  const [step, setStep] = useState(1); // 1: Email input, 2: Pin code, 3: New password
  const [email, setEmail] = useState('');
  const [pinCode, setPinCode] = useState(['', '', '', '', '']); // Array for 5-digit pin code
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [newPasswordError, setNewPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  // Refs for each pin code input field
  const pinCodeRefs = useRef(pinCode.map(() => React.createRef())).current;

  // Temporary handlers to simulate navigation between steps (for UI testing)
  const goToStep2 = () => setStep(2);
  const goToStep3 = () => setStep(3);

  // Handle pin code input change and auto-focus
  const handlePinChange = (text, index) => {
    const newPinCode = [...pinCode];
    newPinCode[index] = text;
    setPinCode(newPinCode);

    // Auto-focus the next field if a digit is entered
    if (text.length === 1 && index < pinCode.length - 1) {
      pinCodeRefs[index + 1].current.focus();
    }

    // Move to the previous field if the current field is cleared (backspace)
    if (text.length === 0 && index > 0) {
      pinCodeRefs[index - 1].current.focus();
    }
  };

  // Handle key press for backspace to move to the previous field
  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && pinCode[index] === '' && index > 0) {
      pinCodeRefs[index - 1].current.focus();
    }
  };

  // Handle focus to clear the placeholder
  const handleFocus = (index) => {
    if (pinCode[index] === '') {
      const newPinCode = [...pinCode];
      newPinCode[index] = ''; // Ensure the field is empty when focused
      setPinCode(newPinCode);
    }
  };

  // Handle blur to restore the placeholder if the field is empty
  const handleBlur = (index) => {
    if (pinCode[index] === '') {
      const newPinCode = [...pinCode];
      newPinCode[index] = '';
      setPinCode(newPinCode);
    }
  };

  // Validate Step 3 fields and handle submission
  const handleSetNewPassword = () => {
    let hasError = false;
    setNewPasswordError('');
    setConfirmPasswordError('');

    // Check if fields are empty
    if (!newPassword) {
      setNewPasswordError('New Password is required');
      hasError = true;
    }
    if (!confirmPassword) {
      setConfirmPasswordError('Confirm Password is required');
      hasError = true;
    }

    // Check password length
    if (newPassword && newPassword.length < 8) {
      setNewPasswordError('Password must be at least 8 characters');
      hasError = true;
    }

    // Check if passwords match
    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      hasError = true;
    }

    // If no errors, proceed to login (simulated)
    if (!hasError) {
      router.push('/login');
    }
  };

  return (
    <View className="flex-1 bg-[#2C2C2C]">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{
            minHeight: windowHeight,
          }}
          keyboardShouldPersistTaps="handled"
          bounces={false}
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
            <View className="flex-1 justify-center px-8">
              <Image
                source={require('../assets/images/logo_b.png')}
                className="self-center mb-5 w-[88px] h-[125px]"
              />

              {step === 1 && (
                <>
                  <Text className="text-3xl font-semibold text-center mb-2">
                    Forgot Password?
                  </Text>
                  <Text className="text-gray-500 text-center mb-8">
                    No worries, we’ll send you reset instructions.
                  </Text>
                  <InputField
                    label="Email"
                    placeholder="Enter Email"
                    value={email}
                    onChangeText={setEmail}
                  />
                  <TouchableOpacity
                    className="bg-yellow-400 p-4 rounded-lg mt-6"
                    onPress={goToStep2}
                  >
                    <Text className="text-white text-center font-semibold">
                      Reset Password
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="mt-8 flex-row justify-center items-center"
                    onPress={() => router.push('/login')}
                  >
                    <Image
                      className="mr-2"
                      source={require('../assets/images/backBTN.png')}
                      style={{ width: 13, height: 13, tintColor: 'gray' }}
                    />
                    <Text className="text-gray-500 mr-1">Back to</Text>
                    <Text className="text-gray-500 font-semibold">Log In</Text>
                  </TouchableOpacity>
                </>
              )}

              {step === 2 && (
                <>
                  <Text className="text-3xl font-semibold text-center mb-2">
                    Enter Pin Code
                  </Text>
                  <Text className="text-gray-500 text-center mb-8">
                    We sent a code to{' '}
                    <Text className="text-400 font-bold">{email}</Text>
                  </Text>
                  <View className="flex-row justify-between mb-6">
                    {pinCode.map((digit, index) => (
                      <TextInput
                        key={index}
                        ref={pinCodeRefs[index]}
                        value={digit}
                        onChangeText={(text) => handlePinChange(text, index)}
                        onKeyPress={(e) => handleKeyPress(e, index)}
                        onFocus={() => handleFocus(index)}
                        onBlur={() => handleBlur(index)}
                        keyboardType="numeric"
                        maxLength={1}
                        className="border border-gray-300 rounded-lg bg-white p-4 w-14 text-center text-3xl"
                        placeholder="0"
                        placeholderTextColor="#A0A0A0"
                      />
                    ))}
                  </View>
                  <TouchableOpacity
                    className="bg-yellow-400 p-4 rounded-lg mt-6"
                    onPress={goToStep3}
                  >
                    <Text className="text-white text-center font-semibold">
                      Continue
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="mt-8 flex-row justify-center items-center"
                    onPress={() => router.push('/login')}
                  >
                    <Image
                      className="mr-2"
                      source={require('../assets/images/backBTN.png')}
                      style={{ width: 13, height: 13, tintColor: 'gray' }}
                    />
                    <Text className="text-gray-500 mr-1">Back to</Text>
                    <Text className="text-gray-500 font-semibold">Log In</Text>
                  </TouchableOpacity>
                </>
              )}

              {step === 3 && (
                <>
                  <Text className="text-3xl font-semibold text-center mb-2">
                    Set a New Password
                  </Text>
                  <Text className="text-gray-500 text-center mb-8">
                    Must be at least 8 characters.
                  </Text>
                  <InputField
                    label="New Password"
                    placeholder="Enter New Password"
                    value={newPassword}
                    onChangeText={(text) => {
                      setNewPassword(text);
                      setNewPasswordError(''); // Clear error on change
                    }}
                    secureTextEntry={!showPassword}
                    toggleSecureEntry={() => setShowPassword(!showPassword)}
                    showToggle={true}
                    error={newPasswordError}
                  />
                  <InputField
                    label="Confirm Password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChangeText={(text) => {
                      setConfirmPassword(text);
                      setConfirmPasswordError(''); // Clear error on change
                    }}
                    secureTextEntry={!showConfirmPassword}
                    toggleSecureEntry={() => setShowConfirmPassword(!showConfirmPassword)}
                    showToggle={true}
                    error={confirmPasswordError}
                  />
                  <TouchableOpacity
                    className="bg-yellow-400 p-4 rounded-lg mt-6"
                    onPress={handleSetNewPassword}
                  >
                    <Text className="text-white text-center font-semibold">
                      Reset Password
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="mt-8 flex-row justify-center items-center"
                    onPress={() => router.push('/login')}
                  >
                    <Image
                      className="mr-2"
                      source={require('../assets/images/backBTN.png')}
                      style={{ width: 13, height: 13, tintColor: 'gray' }}
                    />
                    <Text className="text-gray-500 mr-1">Back to</Text>
                    <Text className="text-gray-500 font-semibold">Log In</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </LinearGradient>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}