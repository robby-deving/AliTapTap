import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Image,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { Header } from "../components/Header";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Profile() {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");

  const router = useRouter();

  useEffect(() => {
    const initializeUser = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        if (userData) {
          const parsedUserData = JSON.parse(userData);
          console.log('Parsed user data:', parsedUserData);

          setUserEmail(parsedUserData.email);
          setUserName(parsedUserData.username);
        }
      } catch (err) {
        console.error('Error loading user data:', err);
      }
    };

    initializeUser();
  }, []);

  const handleLogout = () => {
    AsyncStorage.removeItem('token');
    AsyncStorage.removeItem('userData');
    router.push("/login"); // Redirect to login screen after logout
  };

  const handleOrders = () => {
    // Navigate to orders screen
    router.push("/orders");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.mainContainer}>
        <Header />

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.contentContainer}>
            <Text style={styles.title}>
              Profile
            </Text>

            <View style={styles.profileContainer}>
              <View style={styles.profileDetailsContainer}>
                <View style={styles.profileImageContainer}>
                  <Image 
                    source={require('../assets/images/profile-icon.png')} 
                    style={styles.profileImage}
                  />
                </View>
                <Text style={styles.userName}>{userName}</Text>
                <Text style={styles.userEmail}>{userEmail}</Text>
                <TouchableOpacity
                  onPress={() => router.push("/edit-profile")}
                  style={styles.editProfileButton}
                >
                  <View style={styles.editProfileContent}>
                    <Image 
                      source={require('../assets/images/edit-icon.png')}
                      style={styles.editIcon}
                    />
                    <Text style={styles.editProfileText}>
                      Edit Profile
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>

              <View style={styles.ordersContainer}>
                <TouchableOpacity
                  style={styles.ordersButton}
                  onPress={handleOrders}
                >
                  <View style={styles.ordersContent}>
                    <Image
                      source={require('../assets/images/orders-icon.png')}
                      style={styles.ordersIcon}
                    />
                    <Text style={styles.ordersText}>My Orders</Text>
                  </View>
                  <Image
                    source={require('../assets/images/arrow-right-icon.png')}
                    style={styles.arrowIcon}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.bottomSpacer} />
        </ScrollView>

        <View style={styles.logoutContainer}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Text style={styles.logoutText}>
              Logout
            </Text>
          </TouchableOpacity>
        </View>
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
    backgroundColor: 'white',
    position: 'relative'
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
  profileContainer: {
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 20
  },
  profileDetailsContainer: {
    width: '100%',
    marginVertical: 48,
    alignItems: 'center'
  },
  profileImageContainer: {
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingBottom: 24,
    flex: 1
  },
  profileImage: {
    width: 110,
    height: 110,
    alignSelf: 'center'
  },
  userName: {
    color: 'black',
    fontWeight: '600',
    fontSize: 30
  },
  userEmail: {
    color: '#6B7280',
    fontSize: 20
  },
  editProfileButton: {
    marginTop: 24
  },
  editProfileContent: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  editIcon: {
    width: 17,
    height: 17,
    alignSelf: 'center',
    marginHorizontal: 8
  },
  editProfileText: {
    fontSize: 20,
    fontWeight: '600'
  },
  ordersContainer: {
    width: '100%',
    marginBottom: 16
  },
  ordersButton: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 20,
    borderRadius: 8,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  ordersContent: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  ordersIcon: {
    width: 25,
    height: 25,
    alignSelf: 'center',
    marginHorizontal: 8
  },
  ordersText: {
    color: 'black',
    fontSize: 24,
    fontWeight: '600'
  },
  arrowIcon: {
    width: 20,
    height: 20,
    alignSelf: 'center',
    marginLeft: 8
  },
  bottomSpacer: {
    height: 128
  },
  logoutContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 40,
    backgroundColor: 'white'
  },
  logoutButton: {
    borderWidth: 1,
    borderColor: '#FFE300',
    width: '100%',
    padding: 16,
    borderRadius: 8
  },
  logoutText: {
    color: '#FFE300',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600'
  }
});