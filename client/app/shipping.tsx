import React, { useState } from "react";
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
import { useRouter } from "expo-router";
import InputField from "../components/InputField";
import StepperComponent from "../components/StepperComponent";
import { Header } from "../components/Header";
import { Asset } from "expo-asset";

export default function Shipping() {
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [shippingAddresses, setShippingAddresses] = useState<string[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  // Address fields
  const [street, setStreet] = useState("");
  const [barangay, setBarangay] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [zipCode, setZipCode] = useState("");

  const router = useRouter();

  const handleAddAddress = () => {
    if (!street || !barangay || !city || !province || !zipCode) {
      alert("Please complete all address fields");
      return;
    }

    const newAddress = `${street}, ${barangay}, ${city}, ${province}, ${zipCode}`;
    setShippingAddresses((prevAddresses) => [...prevAddresses, newAddress]); // Correctly update state

    // Reset fields
    setStreet("");
    setBarangay("");
    setCity("");
    setProvince("");
    setZipCode("");
    setModalVisible(false);
  };

  const handleContinue = () => {
    if (!fullName || !phoneNumber || shippingAddresses.length === 0) {
      alert(
        "Please enter your full name, phone number, and at least one shipping address"
      );
      return;
    }

    const shippingData = {
      fullName,
      phoneNumber,
      shippingAddresses, // Pass the array instead of a single value
    };

    router.push({
      pathname: "/payment",
      params: {
        shippingData: JSON.stringify(shippingData),
      },
    });
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
                    <View
                      key={index}
                      className="border border-gray-200 p-4 rounded-lg bg-white mb-2"
                    >
                      <Text className="text-black text-sm">{address}</Text>
                    </View>
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
          <View className="bg-white w-full h-[600px] p-6 rounded-t-2xl">
            <Text className="text-base font-semibold mb-9 text-center">
              Add Address
            </Text>

            {/* Street Input */}
            <View className="w-full mb-2">
              <InputField
                label="St./Purok/Sitio/Subd."
                placeholder="Enter your street"
                value={street}
                onChangeText={setStreet}
              />
            </View>

            {/* Barangay Input */}
            <View className="w-full mb-2">
              <InputField
                label="Barangay"
                placeholder="Enter your barangay"
                value={barangay}
                onChangeText={setBarangay}
              />
            </View>

            {/* City Input */}
            <View className="w-full mb-2">
              <InputField
                label="City/Municipality"
                placeholder="Enter your city"
                value={city}
                onChangeText={setCity}
              />
            </View>

            {/* Province Input */}
            <View className="w-full mb-2">
              <InputField
                label="Province"
                placeholder="Enter your province"
                value={province}
                onChangeText={setProvince}
              />
            </View>

            {/* ZIP Code Input */}
            <View className="w-full mb-2">
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
