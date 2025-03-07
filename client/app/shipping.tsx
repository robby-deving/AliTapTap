import React, { useState, useEffect } from "react";
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
import { Asset } from "expo-asset";

export default function Shipping() {
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [shippingAddresses, setShippingAddresses] = useState<Address[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  // Address fields
  const [street, setStreet] = useState("");
  const [barangay, setBarangay] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [zipCode, setZipCode] = useState("");

  const router = useRouter();

  type Address = {
    _id?: string;
    street: string;
    barangay: string;
    city: string;
    province: string;
    zip: string;
  };

  useEffect(() => {
    const getUserData = async () => {
      try {
        const userDataString = await AsyncStorage.getItem("userData");
        if (userDataString) {
          const userData = JSON.parse(userDataString);
          const fullName = `${userData.first_name} ${userData.last_name}`;
          setFullName(fullName);
          setPhoneNumber(userData.phone_number || "");

          // Ensure userData.address exists and is an array
          if (Array.isArray(userData.address)) {
            setShippingAddresses(userData.address); // Store as an array of Address objects
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    getUserData();
  }, []);

  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleAddAddress = async () => {
    if (!street || !barangay || !city || !province || !zipCode) {
      alert("Please complete all address fields");
      return;
    }
  
    let newAddress: Address = {
      _id: editingIndex !== null ? shippingAddresses[editingIndex]._id : Date.now().toString(), // Preserve _id
      street,
      barangay,
      city,
      province,
      zip: zipCode,
    };
  
    let updatedAddresses = [...shippingAddresses];
  
    if (editingIndex !== null) {
      updatedAddresses[editingIndex] = newAddress; // Update existing address
    } else {
      updatedAddresses.push(newAddress); // Add new address
    }
  
    try {
      const userDataString = await AsyncStorage.getItem("userData");
      if (!userDataString) throw new Error("User data not found");
  
      const userData = JSON.parse(userDataString);
      userData.address = updatedAddresses;
  
      await AsyncStorage.setItem("userData", JSON.stringify(userData));
      setShippingAddresses(updatedAddresses);
    } catch (error) {
      console.error("Error saving address:", error);
    }
  
    // Reset fields and close modal
    setStreet("");
    setBarangay("");
    setCity("");
    setProvince("");
    setZipCode("");
    setEditingIndex(null);
    setModalVisible(false);
  };

  const handleContinue = async () => {
    if (!fullName || !phoneNumber || shippingAddresses.length === 0) {
      alert(
        "Please enter your full name, phone number, and at least one shipping address"
      );
      return;
    }
  
    try {
      const userDataString = await AsyncStorage.getItem("userData");
      if (!userDataString) throw new Error("User data not found");
  
      const userData = JSON.parse(userDataString);
      const userId = userData._id;
  
      // Extract first and last name
      const nameParts = fullName.split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";
  
      // Send each address separately
      for (const address of shippingAddresses) {
        const payload = {
          ...address,
          phone_number: phoneNumber,
          first_name: firstName,
          last_name: lastName,
        };
  
        console.log("Sending address:", JSON.stringify(payload, null, 2));
  
        const response = await fetch(
          `http://192.168.1.9:4000/api/v1/users/${userId}/add-address`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${userData.token}`,
            },
            body: JSON.stringify(payload),
          }
        );
  
        const result = await response.json();
  
        if (!response.ok) {
          console.error("Server Error Response:", result);
          throw new Error("Failed to save shipping data.");
        }
  
        console.log("Shipping address saved:", result);
      }
  
      router.push({
        pathname: "/payment",
        params: {
          shippingData: JSON.stringify({
            fullName,
            phoneNumber,
            shippingAddresses,
          }),
        },
      });
    } catch (error) {
      console.error("Error saving shipping data:", error);
      alert("An error occurred while saving your shipping details.");
    }
  };

  const groupIcon = Asset.fromModule(require("../assets/images/Group.png")).uri;

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
                  shippingAddresses.map((address, index) => (
                    <TouchableOpacity
                      key={index}
                      className="border border-gray-200 p-4 rounded-lg bg-white mb-2"
                      onPress={() => {
                        setEditingIndex(index);
                        setStreet(address.street);
                        setBarangay(address.barangay);
                        setCity(address.city);
                        setProvince(address.province);
                        setZipCode(address.zip);
                        setModalVisible(true);
                      }}
                    >
                      <Text className="text-black text-sm">
                        {`${address.street}, ${address.barangay}, ${address.city}, ${address.province}, ${address.zip}`}
                      </Text>
                    </TouchableOpacity>
                  ))
                ) : (
                  <Text className="text-sm text-gray-400">
                    No address added
                  </Text>
                )}

                <TouchableOpacity
                  className="border border-gray-200 p-4 rounded-lg w-full bg-white flex-row justify-center items-center"
                  onPress={() => setModalVisible(true)}
                >
                  <Text className="text-sm text-gray-500">
                    + Add Another Address
                  </Text>
                </TouchableOpacity>
              </View>
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

      {/* Address Modal */}
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View className="flex-1 justify-end bg-black/30">
          <View className="bg-white w-full h-3/4 p-6 rounded-t-2xl">
            <Text className="text-lg font-semibold mb-9 text-center">
              Add Address
            </Text>

            {/* Street Input */}
            <View className="w-full mb-3">
              <InputField
                label="St./Purok/Sitio/Subd."
                placeholder="Enter your street"
                value={street}
                onChangeText={setStreet}
              />
            </View>

            {/* Barangay Input */}
            <View className="w-full mb-4">
              <InputField
                label="Barangay"
                placeholder="Enter your barangay"
                value={barangay}
                onChangeText={setBarangay}
              />
            </View>

            {/* City Input */}
            <View className="w-full mb-4">
              <InputField
                label="City/Municipality"
                placeholder="Enter your city"
                value={city}
                onChangeText={setCity}
              />
            </View>

            {/* Province Input */}
            <View className="w-full mb-4">
              <InputField
                label="Province"
                placeholder="Enter your province"
                value={province}
                onChangeText={setProvince}
              />
            </View>

            {/* ZIP Code Input */}
            <View className="w-full mb-4">
              <InputField
                label="ZIP Code"
                placeholder="Enter your ZIP code"
                value={zipCode}
                onChangeText={setZipCode}
                type="number"
              />
            </View>

            <View className="w-full">
              <TouchableOpacity
                className="bg-[#FDCB07] px-4 pt-4 rounded items-center w-full h-12"
                onPress={handleAddAddress}
              >
                <Text className="text-white text-center font-semibold">
                  Add Address
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}
