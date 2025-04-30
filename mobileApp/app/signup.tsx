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
  StyleSheet,
} from 'react-native';
import { useRouter } from "expo-router";
import TermsContent from "../components/TermsContent";
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons'; // For the eye icon
import Modal from 'react-native-modal';

LogBox.ignoreLogs(['VirtualizedLists should never be nested']);

// Custom InputField component
const InputField = ({ label, placeholder, value, onChangeText, secureTextEntry, toggleSecureEntry, showToggle }) => (
  <View style={styles.inputContainer}>
    <Text style={styles.inputLabel}>{label}</Text>
    <View style={styles.inputWrapper}>
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        style={styles.input}
        placeholderTextColor="#A0A0A0"
      />
      {showToggle && (
        <Pressable onPress={toggleSecureEntry} style={styles.eyeIcon}>
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
  const Base_Url = `https://api.alitaptap.me`;

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
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <LinearGradient 
          colors={['#FFE300', '#FFFFFF', '#FFFFFF', '#FFFFFF']} 
          style={styles.gradient}
        >
          <View style={styles.logoContainer}>
            <Image 
              source={require('../assets/images/logo_b.png')} 
              style={styles.logo}
            />
          </View>
          <Text style={styles.title}>Create an Account</Text>
          <ScrollView
            contentContainerStyle={{ 
              paddingBottom: 80, // Space for the fixed button
              paddingTop: 10, // Space for the logo and title
            }}
            keyboardShouldPersistTaps="handled"
            bounces={false}
          >
            <View style={{ paddingHorizontal: 28 }}>
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
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Gender</Text>
                <TouchableOpacity 
                  onPress={() => setIsGenderModalVisible(true)}
                  style={styles.genderButton}
                >
                  <Text style={gender ? styles.genderTextSelected : styles.genderText}>
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
                  <View style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                      <Text style={styles.modalTitle}>Select Gender</Text>
                    </View>
                    
                    {["Male", "Female", "Other"].map((item) => (
                      <TouchableOpacity
                        key={item}
                        style={[
                          styles.genderOption,
                          gender === item && styles.genderOptionSelected
                        ]}
                        onPress={() => {
                          setGender(item);
                          setIsGenderModalVisible(false);
                        }}
                      >
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Text style={[
                            styles.genderOptionText,
                            gender === item && styles.genderOptionTextSelected
                          ]}>
                            {item}
                          </Text>
                          {gender === item && (
                            <Ionicons name="checkmark" size={24} color="#EAB308" />
                          )}
                        </View>
                      </TouchableOpacity>
                    ))}
                    
                    <TouchableOpacity
                      style={{ padding: 16, backgroundColor: '#F3F4F6' }}
                      onPress={() => setIsGenderModalVisible(false)}
                    >
                      <Text style={{ textAlign: 'center', color: '#6B7280', fontWeight: '600' }}>Cancel</Text>
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
          <View style={styles.signupButton}>
            <TouchableOpacity 
              onPress={handleSignup}
            >
              <Text style={styles.signupButtonText}>
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>
            Already have an account?
            <TouchableOpacity onPress={() => router.push('/login')}>
              <Text style={styles.loginLink}> Log In</Text>
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
        <View style={styles.termsModal}>
          <View style={styles.termsContent}>
            <View style={styles.termsHeader}>
              <Text style={styles.termsTitle}>
                Terms and Conditions
              </Text>
              <Text style={styles.termsDate}>
                Last Updated: Feb 27, 2025
              </Text>
            </View>
            
            <ScrollView
              style={{ flexGrow: 1 }}
              showsVerticalScrollIndicator={true}
            >
              <TermsContent />
            </ScrollView>

            <View style={styles.termsButtonContainer}>
              <TouchableOpacity
                style={styles.termsDeclineButton}
                onPress={handleTermsDecline}
              >
                <Text style={styles.termsButtonText}>Decline</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.termsAcceptButton}
                onPress={handleTermsAccept}
              >
                <Text style={styles.termsButtonText}> Agree</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2C2C2C'
  },
  keyboardView: {
    flex: 1
  },
  gradient: {
    flex: 1,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: 'hidden'
  },
  logoContainer: {
    paddingTop: 80,
    alignItems: 'center'
  },
  logo: {
    width: 88,
    height: 125,
    alignSelf: 'center'
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20
  },
  inputContainer: {
    marginBottom: 16
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4
  },
  inputWrapper: {
    position: 'relative'
  },
  input: {
    width: '100%',
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    backgroundColor: 'white'
  },
  eyeIcon: {
    position: 'absolute',
    right: 12,
    top: 12
  },
  genderButton: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    backgroundColor: 'white',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  genderText: {
    color: '#9CA3AF'
  },
  genderTextSelected: {
    color: '#000000'
  },
  modalContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24
  },
  modalHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB'
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center'
  },
  genderOption: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6'
  },
  genderOptionSelected: {
    backgroundColor: '#FEF9C3'
  },
  genderOptionText: {
    fontSize: 18,
    color: '#374151'
  },
  genderOptionTextSelected: {
    color: '#EAB308',
    fontWeight: '600'
  },
  signupButton: {
    position: 'absolute',
    bottom: 20,
    left: 28,
    right: 28,
    backgroundColor: '#FACC15',
    padding: 20,
    borderRadius: 8
  },
  signupButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '600'
  },
  loginContainer: {
    width: '100%'
  },
  loginText: {
    textAlign: 'center',
    color: 'white',
    padding: 16,
    paddingBottom: 24
  },
  loginLink: {
    color: 'white',
    fontWeight: '600'
  },
  termsModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  termsContent: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    padding: 25,
    borderRadius: 20,
    width: '90%',
    maxHeight: '80%',
    elevation: 5
  },
  termsHeader: {
    width: '100%',
    alignItems: 'center'
  },
  termsTitle: {
    fontWeight: 'bold',
    fontSize: 24,
    borderBottomWidth: 4,
    borderBottomColor: '#FFE300',
    paddingBottom: 8
  },
  termsDate: {
    fontSize: 12,
    margin: 16,
    color: '#6B7280',
    textAlign: 'center'
  },
  termsButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20
  },
  termsDeclineButton: {
    backgroundColor: '#D1D5DB',
    padding: 16,
    borderRadius: 8,
    width: '47%',
    alignItems: 'center'
  },
  termsAcceptButton: {
    backgroundColor: '#FACC15',
    padding: 16,
    borderRadius: 8,
    width: '47%',
    alignItems: 'center'
  },
  termsButtonText: {
    color: 'white',
    fontWeight: '600'
  }
});