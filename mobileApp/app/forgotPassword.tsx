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
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const InputField = ({ label, placeholder, value, onChangeText, secureTextEntry, toggleSecureEntry, showToggle, error }) => (
  <View style={styles.inputContainer}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.inputWrapper}>
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        style={[
          styles.input,
          error && styles.inputError
        ]}
        placeholderTextColor="#A0A0A0"
      />
      {showToggle && (
        <TouchableOpacity onPress={toggleSecureEntry} style={styles.toggleButton}>
          <Ionicons name={secureTextEntry ? 'eye-off' : 'eye'} size={22} color="gray" />
        </TouchableOpacity>
      )}
    </View>
    {error && <Text style={styles.errorText}>{error}</Text>}
  </View>
);

export default function ForgotPassword() {
  const router = useRouter();
  const windowHeight = Dimensions.get('window').height;

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [pinCode, setPinCode] = useState(['', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [newPasswordError, setNewPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [error, setError] = useState('');

  const pinCodeRefs = useRef(pinCode.map(() => React.createRef())).current;

  const handlePinChange = (text, index) => {
    const newPinCode = [...pinCode];
    newPinCode[index] = text;
    setPinCode(newPinCode);

    if (text.length === 1 && index < pinCode.length - 1) {
      pinCodeRefs[index + 1].current.focus();
    }

    if (text.length === 0 && index > 0) {
      pinCodeRefs[index - 1].current.focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && pinCode[index] === '' && index > 0) {
      pinCodeRefs[index - 1].current.focus();
    }
  };

  const handleFocus = (index) => {
    if (pinCode[index] === '') {
      const newPinCode = [...pinCode];
      newPinCode[index] = '';
      setPinCode(newPinCode);
    }
  };

  const handleBlur = (index) => {
    if (pinCode[index] === '') {
      const newPinCode = [...pinCode];
      newPinCode[index] = '';
      setPinCode(newPinCode);
    }
  };

  const handleForgotPassword = async () => {
    try {
      const response = await fetch(`https://api.alitaptap.me/api/v1/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send pin code.");
      }

      setStep(2);
    } catch (err) {
      setError(err.message || "An error occurred.");
    }
  };

  const handleSetNewPassword = async () => {
    let hasError = false;
    setNewPasswordError('');
    setConfirmPasswordError('');

    if (!newPassword) {
      setNewPasswordError('New Password is required');
      hasError = true;
    }
    if (!confirmPassword) {
      setConfirmPasswordError('Confirm Password is required');
      hasError = true;
    }

    if (newPassword && newPassword.length < 8) {
      setNewPasswordError('Password must be at least 8 characters');
      hasError = true;
    }

    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      hasError = true;
    }

    if (!hasError) {
      try {
        const response = await fetch(`https://api.alitaptap.me/api/v1/auth/reset-password`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            pinCode: pinCode.join(""),
            newPassword,
          }),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Failed to reset password.");
        }

        router.push("/login");
      } catch (err) {
        setError(err.message || "An error occurred while resetting the password.");
      }
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { minHeight: windowHeight }
          ]}
          keyboardShouldPersistTaps="handled"
          bounces={false}
        >
          <LinearGradient
            colors={['#FFE300', '#FFFFFF', '#FFFFFF', '#FFFFFF']}
            style={styles.gradient}
          >
            <View style={styles.contentContainer}>
              <Image
                source={require('../assets/images/logo_b.png')}
                style={styles.logo}
              />

              {step === 1 && (
                <>
                  <Text style={styles.title}>Forgot Password?</Text>
                  <Text style={styles.subtitle}>
                    No worries, we'll send you reset instructions.
                  </Text>
                  <InputField
                    label="Email"
                    placeholder="Enter Email"
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text);
                      setError('');
                    }}
                  />
                  {error && <Text style={styles.errorText}>{error}</Text>}
                  <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={handleForgotPassword}
                  >
                    <Text style={styles.primaryButtonText}>Reset Password</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.push('/login')}
                  >
                    <Image
                      source={require('../assets/images/backBTN.png')}
                      style={styles.backIcon}
                    />
                    <Text style={styles.backText}>Back to</Text>
                    <Text style={styles.backTextBold}>Log In</Text>
                  </TouchableOpacity>
                </>
              )}

              {step === 2 && (
                <>
                  <Text style={styles.title}>Enter Pin Code</Text>
                  <Text style={styles.subtitle}>
                    We sent a code to
                    <Text style={styles.subtitleBold}>{email}</Text>
                  </Text>
                  <View style={styles.pinCodeContainer}>
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
                        style={styles.pinInput}
                        placeholder="0"
                        placeholderTextColor="#A0A0A0"
                      />
                    ))}
                  </View>
                  <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={() => setStep(3)}
                  >
                    <Text style={styles.primaryButtonText}>Continue</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.push('/login')}
                  >
                    <Image
                      source={require('../assets/images/backBTN.png')}
                      style={styles.backIcon}
                    />
                    <Text style={styles.backText}>Back to</Text>
                    <Text style={styles.backTextBold}>Log In</Text>
                  </TouchableOpacity>
                </>
              )}

              {step === 3 && (
                <>
                  <Text style={styles.title}>Set a New Password</Text>
                  <Text style={styles.subtitle}>
                    Must be at least 8 characters.
                  </Text>

                  <InputField
                    label="New Password"
                    placeholder="Enter New Password"
                    value={newPassword}
                    onChangeText={(text) => {
                      setNewPassword(text);
                      setNewPasswordError('');
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
                      setConfirmPasswordError('');
                    }}
                    secureTextEntry={!showConfirmPassword}
                    toggleSecureEntry={() => setShowConfirmPassword(!showConfirmPassword)}
                    showToggle={true}
                    error={confirmPasswordError}
                  />

                  <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={handleSetNewPassword}
                  >
                    <Text style={styles.primaryButtonText}>Reset Password</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.push('/login')}
                  >
                    <Image
                      source={require('../assets/images/backBTN.png')}
                      style={styles.backIcon}
                    />
                    <Text style={styles.backText}>Back to</Text>
                    <Text style={styles.backTextBold}>Log In</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2C2C2C'
  },
  keyboardView: {
    flex: 1
  },
  scrollContent: {
    flexGrow: 1
  },
  gradient: {
    flex: 1,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: 'hidden'
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32
  },
  logo: {
    alignSelf: 'center',
    marginBottom: 20,
    width: 88,
    height: 125
  },
  title: {
    fontSize: 30,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8
  },
  subtitle: {
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 32
  },
  subtitleBold: {
    fontWeight: '700'
  },
  inputContainer: {
    marginBottom: 16
  },
  label: {
    fontSize: 16,
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
    borderColor: '#D1D5DB',
    borderRadius: 8,
    backgroundColor: 'white'
  },
  inputError: {
    borderColor: '#EF4444'
  },
  toggleButton: {
    position: 'absolute',
    right: 20,
    top: 12
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    marginTop: 4
  },
  primaryButton: {
    backgroundColor: '#FACC15',
    padding: 16,
    borderRadius: 8,
    marginTop: 24
  },
  primaryButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '600'
  },
  backButton: {
    marginTop: 32,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  backIcon: {
    width: 13,
    height: 13,
    tintColor: 'gray',
    marginRight: 8
  },
  backText: {
    color: '#6B7280',
    marginRight: 4
  },
  backTextBold: {
    color: '#6B7280',
    fontWeight: '600'
  },
  pinCodeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24
  },
  pinInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    backgroundColor: 'white',
    padding: 16,
    width: 56,
    textAlign: 'center',
    fontSize: 30
  }
});