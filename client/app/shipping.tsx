import React, { useState, useEffect , useCallback} from "react";
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

  const shippingCost =[
    {name: "standard", price: 58 , duration: "10 to 15 days"},
    {name: "express", price: 150 , duration: "5 to 7 days"},
    {name: "priority", price: 220 , duration: "3 to 4 day"}
  ]

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
  }

  useEffect(() => {
    console.log('Current shipping addresses:', shippingAddresses);
    console.log('Selected address index:', selectedAddressIndex);
    console.log('Selected address:', shippingAddresses[selectedAddressIndex]);
  }, [shippingAddresses, selectedAddressIndex]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <View className="flex-1 relative bg-white">
        {/* Header */}
        <Header />

        {/* Scrollable Content */}
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="p-10 w-full items-center">
            <Text className="font-semibold text-3xl border-b-4 pb-2 border-[#FFE300]">
              Checkout
            </Text>

            <View className="w-full flex flex-col items-center mt-5">
              <StepperComponent currentStep="shipping" />
              <Text className="mt-5 mb-5 text-[#696969]">
                Enter Shipping Details
              </Text>

              {/* Full Name Input */}
              <View className="w-full mb-4">
                <InputField
                  label="Full Name"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChangeText={setFullName}
                />
              </View>

              {/* Phone Number Input */}
              <View className="w-full mb-4">
                <InputField
                  type="number"
                  label="Phone Number"
                  placeholder="Enter your phone number"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  maxLength={11}
                />
              </View>

              {/* Shipping Address Input with Icon */}
              <View className="w-full mb-4">
                <Text className="text-black font-semibold mb-2 text-base">
                  Shipping Address
                </Text>

                {shippingAddresses.length > 0 ? (
                  <TouchableOpacity
                    className="border border-gray-200 p-4 rounded-lg bg-white mb-2"
                    onPress={() => {
                      console.log('Navigating to addresses with index:', selectedAddressIndex);
                      router.push("/addresses");
                    }}
                  >
                    {shippingAddresses[selectedAddressIndex] ? (
                      <View className="flex-row items-center justify-between">
                        <Text className="text-black text-sm flex-1">
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
                            style={{ width: 30, height: 30 }}
                          />
                        
                      </View>
                    ) : (
                      <Text className="text-sm text-gray-500">
                        Error loading address. Please select again.
                      </Text>
                    )}
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    className="border border-gray-200 p-4 rounded-lg w-full bg-white flex-row justify-center items-center"
                    onPress={() => {
                      console.log('No addresses, navigating to add address');
                      router.push("/addresses");
                    }}
                  >
                    <Text className="text-sm text-gray-500">
                      + Add Shipping Address
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              <View className="w-full ">
                <Text className="text-black font-semibold mb-2 text-base">
                  Shipping Method
                </Text>
                <TouchableOpacity
                  className="border border-gray-200 p-4 rounded-lg bg-white"
                  onPress={() => setShippingModalVisible(true)}
                >
                  <View className="flex-row items-center justify-between">
                    <View>
                      <Text className="text-black font-semibold">
                        {getSelectedShippingDetails()?.name.charAt(0).toUpperCase() + 
                        getSelectedShippingDetails()?.name.slice(1)}
                      </Text>
                      <Text className="text-gray-500 text-sm">
                        Expected delivery is within {getSelectedShippingDetails()?.duration}
                      </Text>
                    </View>
                    <View className="flex-row items-center">
                      <Text className="text-black font-semibold mr-2">
                        ₱{getSelectedShippingDetails()?.price}
                      </Text>
                      <Image
                        source={require('../assets/images/arrow_right.png')}
                        style={{ width: 20, height: 20 }}
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
                <View className="flex-1 justify-end bg-black/50">
                  <View className="bg-white rounded-t-3xl p-6">
                    <View className="flex-row justify-between items-center mb-4">
                      <Text className="text-xl font-bold">Select Shipping Method</Text>
                      <TouchableOpacity onPress={() => setShippingModalVisible(false)}>
                        <Text className="text-xl">✕</Text>
                      </TouchableOpacity>
                    </View>
                    
                    {shippingCost.map((option) => (
                      <TouchableOpacity
                        key={option.name}
                        className={`border rounded-lg p-4 mb-2 ${
                          selectedShipping === option.name
                            ? "border-[#FDCB07] bg-[#FDCB07]/10"
                            : "border-gray-200"
                        }`}
                        onPress={() => {
                          setSelectedShipping(option.name);
                          setShippingModalVisible(false);
                        }}
                      >
                        <View className="flex-row justify-between items-center">
                          <View>
                            <Text className="font-semibold capitalize">
                              {option.name}
                            </Text>
                            <Text className="text-gray-500 text-sm">
                            Expected delivery is within {option.duration}
                            </Text>
                          </View>
                          <Text className="font-semibold">₱{option.price}</Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </Modal>
            </View>
          </View>

          <View className="h-32" />
        </ScrollView>

        {/* Fixed Bottom Button */}
        <View className="absolute bottom-0 w-full p-10 bg-white">
          <TouchableOpacity
            className="bg-[#FDCB07] w-full p-4 rounded"
            onPress={handleContinue}
          >
            <Text className="text-white text-center text-xl font-semibold">
              Continue
            </Text>
          </TouchableOpacity>
        </View>
      </View>      
    </KeyboardAvoidingView>
  );
}