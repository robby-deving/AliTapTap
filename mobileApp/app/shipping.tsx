import React, { useState, useEffect, useCallback } from "react";
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Modal,
  TextInput,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import InputField from "../components/InputField";
import StepperComponent from "../components/StepperComponent";
import { Header } from "../components/Header";
import { useFocusEffect } from 'expo-router';
import { updateOrderDetails } from "../services/helperFunctions";

export default function Shipping() {
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [shippingAddresses, setShippingAddresses] = useState<Address[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState<number>(0);
  const [selectedShipping, setSelectedShipping] = useState("standard");
  const [shippingModalVisible, setShippingModalVisible] = useState(false);

  // Address fields
  const [street, setStreet] = useState("");
  const [barangay, setBarangay] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [zipCode, setZipCode] = useState("");

  const router = useRouter();

  const shippingCost = [
    { name: "standard", price: 58, duration: "10 to 15 days" },
    { name: "express", price: 150, duration: "5 to 7 days" },
    { name: "priority", price: 220, duration: "3 to 4 day" }
  ];

  type Address = {
    _id?: string;
    street: string;
    barangay: string;
    city: string;
    province: string;
    zip: string;
  };

  const getSelectedShippingDetails = () => {
    const selectedOption = shippingCost.find(option => option.name === selectedShipping);
    if (!selectedOption) {
      return shippingCost[0];
    }

    updateOrderDetails('shipping_method', {
      name: selectedOption?.name,
      price: selectedOption?.price,
      duration: selectedOption?.duration
    });
    return selectedOption;
  };

  useFocusEffect(
    useCallback(() => {
      const loadUserData = async () => {
        try {
          const userDataString = await AsyncStorage.getItem("userData");
          if (userDataString) {
            const userData = JSON.parse(userDataString);

            if (Array.isArray(userData.address)) {
              setShippingAddresses(userData.address);
            }
            setSelectedAddressIndex(userData.selectedAddressIndex || 0);

            if (userData.first_name || userData.last_name) {
              setFullName(`${userData.first_name || ''} ${userData.last_name || ''}`.trim());
            }

            if (userData.phone_number) {
              setPhoneNumber(userData.phone_number);
            }
          }
        } catch (error) {
          console.error("Error reloading user data:", error);
        }
      };

      loadUserData();
    }, [])
  );

  const handleContinue = async () => {
    router.push("/payment");
  };

  useEffect(() => {
    console.log('Current shipping addresses:', shippingAddresses);
    console.log('Selected address index:', selectedAddressIndex);
    console.log('Selected address:', shippingAddresses[selectedAddressIndex]);
  }, [shippingAddresses, selectedAddressIndex]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.mainContainer}>
        <Header />

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.contentContainer}>
            <Text style={styles.title}>Checkout</Text>

            <View style={styles.stepperContainer}>
              <StepperComponent currentStep="shipping" />
              <Text style={styles.stepperText}>Enter Shipping Details</Text>

              <View style={styles.inputContainer}>
                <InputField
                  label="Full Name"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChangeText={setFullName}
                />
              </View>

              <View style={styles.inputContainer}>
                <InputField
                  type="number"
                  label="Phone Number"
                  placeholder="Enter your phone number"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  maxLength={11}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.labelText}>Shipping Address</Text>

                {shippingAddresses.length > 0 ? (
                  <TouchableOpacity
                    style={styles.addressButton}
                    onPress={() => router.push("/addresses")}
                  >
                    {shippingAddresses[selectedAddressIndex] ? (
                      <View style={styles.addressContent}>
                        <Text style={styles.addressText}>
                          {`${shippingAddresses[selectedAddressIndex]?.street || ''}, 
                            ${shippingAddresses[selectedAddressIndex]?.barangay || ''}, 
                            ${shippingAddresses[selectedAddressIndex]?.city || ''}, 
                            ${shippingAddresses[selectedAddressIndex]?.province || ''}, 
                            ${shippingAddresses[selectedAddressIndex]?.zip || ''}`
                            .replace(/\s+/g, ' ')
                            .trim()}
                        </Text>
                        <Image
                          source={require('../assets/images/arrow_right.png')}
                          style={styles.arrowIcon}
                        />
                      </View>
                    ) : (
                      <Text style={styles.errorText}>
                        Error loading address. Please select again.
                      </Text>
                    )}
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.addAddressButton}
                    onPress={() => router.push("/addresses")}
                  >
                    <Text style={styles.addAddressText}>+ Add Shipping Address</Text>
                  </TouchableOpacity>
                )}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.labelText}>Shipping Method</Text>
                <TouchableOpacity
                  style={styles.addressButton}
                  onPress={() => setShippingModalVisible(true)}
                >
                  <View style={styles.addressContent}>
                    <View>
                      <Text style={styles.labelText}>
                        {getSelectedShippingDetails()?.name.charAt(0).toUpperCase() +
                          getSelectedShippingDetails()?.name.slice(1)}
                      </Text>
                      <Text style={styles.stepperText}>
                        Expected delivery is within {getSelectedShippingDetails()?.duration}
                      </Text>
                    </View>
                    <View style={styles.addressContent}>
                      <Text style={styles.labelText}>
                        ₱{getSelectedShippingDetails()?.price}
                      </Text>
                      <Image
                        source={require('../assets/images/arrow_right.png')}
                        style={styles.arrowIcon}
                      />
                    </View>
                  </View>
                </TouchableOpacity>
              </View>

              <Modal
                animationType="slide"
                transparent={true}
                visible={shippingModalVisible}
                onRequestClose={() => setShippingModalVisible(false)}
              >
                <View style={styles.modalContainer}>
                  <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                      <Text style={styles.title}>Select Shipping Method</Text>
                      <TouchableOpacity onPress={() => setShippingModalVisible(false)}>
                        <Text style={styles.title}>✕</Text>
                      </TouchableOpacity>
                    </View>

                    {shippingCost.map((option) => (
                      <TouchableOpacity
                        key={option.name}
                        style={[
                          styles.addressButton,
                          selectedShipping === option.name
                            ? styles.selectedShipping
                            : null
                        ]}
                        onPress={() => {
                          setSelectedShipping(option.name);
                          setShippingModalVisible(false);
                        }}
                      >
                        <View style={styles.addressContent}>
                          <View>
                            <Text style={styles.labelText}>
                              {option.name}
                            </Text>
                            <Text style={styles.stepperText}>
                              Expected delivery is within {option.duration}
                            </Text>
                          </View>
                          <Text style={styles.labelText}>₱{option.price}</Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </Modal>
            </View>
          </View>

          <View style={styles.bottomSpacer} />
        </ScrollView>

        <View style={styles.bottomButtonContainer}>
          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleContinue}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
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
  stepperContainer: {
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 20
  },
  stepperText: {
    marginTop: 5,
    marginBottom: 5,
    color: '#696969',
    fontSize: 12
  },
  inputContainer: {
    width: '100%',
    marginBottom: 16
  },
  labelText: {
    color: 'black',
    fontWeight: '600',
    fontSize: 14
  },
  addressButton: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
    borderRadius: 8,
    backgroundColor: 'white',
    marginBottom: 8
  },
  addressContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  addressText: {
    color: 'black',
    fontSize: 14,
    flex: 1
  },
  arrowIcon: {
    width: 30,
    height: 30
  },
  errorText: {
    fontSize: 14,
    color: '#6B7280'
  },
  addAddressButton: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
    borderRadius: 8,
    width: '100%',
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  addAddressText: {
    fontSize: 14,
    color: '#6B7280'
  },
  bottomSpacer: {
    height: 128
  },
  bottomButtonContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 40,
    backgroundColor: 'white'
  },
  continueButton: {
    backgroundColor: '#FDCB07',
    width: '100%',
    padding: 16,
    borderRadius: 8
  },
  continueButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600'
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  selectedShipping: {
    borderColor: '#FDCB07',
    backgroundColor: 'rgba(253, 203, 7, 0.1)'
  }
});