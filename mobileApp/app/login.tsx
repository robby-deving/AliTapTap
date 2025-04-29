import React, { useState, useEffect } from 'react';
import { 
    Text,
    View,
    Image,
    TouchableOpacity,
    KeyboardAvoidingView,
    Alert,
    ActivityIndicator,
    AppState,
    AppStateStatus,
    ScrollView,
    Dimensions,
    Platform,
    StyleSheet,
} from 'react-native';
import { useRouter } from "expo-router";
import InputField from "../components/InputField";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from 'expo-linear-gradient';

export default function login() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [checkingAuth, setCheckingAuth] = useState(true);
    const windowHeight = Dimensions.get('window').height;

    const Base_Url = `https://api.alitaptap.me`;

    useEffect(() => {
      const checkAuth = async () => {
        const token = await AsyncStorage.getItem("token");
        if (token) {
          setIsAuthenticated(true);
        }
        setCheckingAuth(false);
      };
      checkAuth();
    }, []);


    const handleLogin = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${Base_Url}/api/v1/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
    
        const text = await response.text();
        // console.log("🔍 Raw Server Response:", text);
    
        let data;
        try {
          data = JSON.parse(text);
        } catch (err) {
          throw new Error("Invalid JSON response from server");
        }
    
        if (!response.ok) throw new Error(data.message || "Login failed");
    
        const { data: userData } = data;
        if (!userData?.token || !userData?._id) throw new Error("Invalid response from server");
    
        if (userData.isAdmin) {
          Alert.alert("Access Denied", "Admin accounts are not allowed to log in.");
          return;
        }
    
        await AsyncStorage.setItem("userData", JSON.stringify(userData));
        await AsyncStorage.setItem("userId", userData._id); // Store userId separately
        await AsyncStorage.setItem("token", userData.token);

    
        setIsAuthenticated(true);
        router.push("/productcatalogue");
      } catch (error) {
        console.error("❌ Login Error:", error);
        Alert.alert("Login Failed", error instanceof Error ? error.message : "An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };  

    const handleLogout = async () => {
      await AsyncStorage.removeItem("token");
      setIsAuthenticated(false);
      Alert.alert("Logged Out", "You have been logged out.");
      router.replace("/");
    };

    if (checkingAuth) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FDCB07" />
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={{ 
              minHeight: windowHeight,
            }}
            keyboardShouldPersistTaps="handled"
            bounces={false}
          >
            {!isAuthenticated && (
              <View style={styles.authContainer}>
                <LinearGradient 
                  colors={['#FFE300', '#FFFFFF', '#FFFFFF', '#FFFFFF']} 
                  style={styles.gradient}
                >
                  <View style={styles.contentContainer}>
                    <Image 
                      source={require('../assets/images/logo_b.png')} 
                      style={styles.logo}
                    />
                    <Text style={styles.title}>
                      AliTapTap
                    </Text>

                    <InputField 
                      label='Email' 
                      placeholder="Enter Email" 
                      value={email} 
                      onChangeText={setEmail} 
                      type='email'
                    />
                    <InputField 
                      label='Password' 
                      placeholder="Enter Password" 
                      value={password} 
                      onChangeText={setPassword} 
                      type='password'
                    />

                    <TouchableOpacity style={styles.forgotPassword} onPress={() => router.push('/forgotPassword')}>
                      <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                      style={styles.loginButton} 
                      onPress={handleLogin} 
                      disabled={loading}
                    >
                      <Text style={styles.loginButtonText}>
                        {loading ? "Logging in..." : "Login"}
                      </Text>
                    </TouchableOpacity>

                    
                  </View>
                </LinearGradient>
              </View>
            )}

            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>
                Don't have an account?
                <TouchableOpacity onPress={() => router.push("/signup")}>
                  <Text style={styles.signupLink}> Sign Up</Text>
                </TouchableOpacity>
              </Text>
            </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white'
  },
  authContainer: {
    width: '100%',
    height: '93%',
    justifyContent: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30
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
    width: 105,
    height: 150,
    alignSelf: 'center'
  },
  title: {
    fontSize: 48,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 40
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: 16
  },
  forgotPasswordText: {
    color: '#6B7280'
  },
  loginButton: {
    backgroundColor: '#FACC15',
    padding: 16,
    borderRadius: 8,
    marginTop: 40
  },
  loginButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '600'
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#D1D5DB'
  },
  dividerText: {
    color: '#9CA3AF',
    marginHorizontal: 16
  },
  googleButton: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    padding: 16,
    borderRadius: 8,
    marginTop: 24,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  googleIcon: {
    width: 20,
    height: 20,
    marginRight: 8
  },
  googleButtonText: {
    color: '#6B7280'
  },
  signupContainer: {
    width: '100%'
  },
  signupText: {
    textAlign: 'center',
    color: 'white',
    padding: 16
  },
  signupLink: {
    color: 'white',
    fontWeight: '600'
  }
});