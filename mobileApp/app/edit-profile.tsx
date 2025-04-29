import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Image,
  TextInput,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { Header } from "../components/Header";
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Modal from "react-native-modal";
import { Ionicons } from "@expo/vector-icons";

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

// Reusing the same InputField component with StyleSheet
const InputField = ({ label, placeholder, value, onChangeText }) => (
  <View style={styles.inputContainer}>
    <Text style={styles.inputLabel}>{label}</Text>
    <View style={styles.inputWrapper}>
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        style={styles.input}
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
  const Base_Url = `https://api.alitaptap.me`;

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
      style={styles.container}
    >
      <View style={styles.mainContainer}>
        <Header />

        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.contentContainer}>
            <Text style={styles.title}>
              Edit Profile
            </Text>

            <View style={styles.profileSection}>
              <View style={styles.profileImageContainer}>
                <Image 
                  source={require('../assets/images/profile-icon.png')} 
                  style={styles.profileImage}
                />
              </View>

              <View style={styles.formContainer}>
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
                    style={styles.genderButton}
                    onPress={() => setIsGenderModalVisible(true)}
                  >
                    <Text style={gender ? styles.genderText : styles.genderPlaceholder}>
                      {gender || "Select Gender"}
                    </Text>
                    <Ionicons name="chevron-down" size={20} color="#A0A0A0" />
                  </TouchableOpacity>
                </View>

                <Modal
                  isVisible={isGenderModalVisible}
                  onBackdropPress={() => setIsGenderModalVisible(false)}
                  backdropOpacity={0.5}
                  style={styles.modal}
                >
                  <View style={styles.modalContent}>
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
                        <View style={styles.genderOptionContent}>
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
                      style={styles.modalCancelButton}
                      onPress={() => setIsGenderModalVisible(false)}
                    >
                      <Text style={styles.modalCancelText}>Cancel</Text>
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

                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={styles.saveButton}
                    onPress={handleSave}
                  >
                    <Text style={styles.saveButtonText}>
                      Save Changes
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={handleCancel}
                  >
                    <Text style={styles.cancelButtonText}>
                      Cancel
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  mainContainer: {
    flex: 1,
    backgroundColor: 'white'
  },
  scrollView: {
    flex: 1
  },
  contentContainer: {
    padding: 40,
    width: '100%',
    alignItems: 'center'
  },
  title: {
    fontWeight: '600',
    fontSize: 30,
    borderBottomWidth: 4,
    borderBottomColor: '#FFE300',
    paddingBottom: 8
  },
  profileSection: {
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 20
  },
  profileImageContainer: {
    marginVertical: 32,
    alignItems: 'center'
  },
  profileImage: {
    width: 100,
    height: 100,
    alignSelf: 'center'
  },
  formContainer: {
    width: '100%'
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
  genderButton: {
    width: '100%',
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  genderText: {
    color: 'black'
  },
  genderPlaceholder: {
    color: '#A0A0A0'
  },
  modal: {
    margin: 0,
    justifyContent: 'flex-end'
  },
  modalContent: {
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
  genderOptionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  genderOptionText: {
    fontSize: 18,
    color: '#374151'
  },
  genderOptionTextSelected: {
    color: '#EAB308',
    fontWeight: '600'
  },
  modalCancelButton: {
    padding: 16,
    backgroundColor: '#F9FAFB'
  },
  modalCancelText: {
    textAlign: 'center',
    color: '#6B7280',
    fontWeight: '600'
  },
  buttonContainer: {
    width: '100%',
    marginTop: 24
  },
  saveButton: {
    backgroundColor: '#FACC15',
    padding: 20,
    borderRadius: 8,
    marginBottom: 16
  },
  saveButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '600'
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: '#FFE300',
    padding: 20,
    borderRadius: 8
  },
  cancelButtonText: {
    color: '#FFE300',
    textAlign: 'center',
    fontWeight: '600'
  }
});