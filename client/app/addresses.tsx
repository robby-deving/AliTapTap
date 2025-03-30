import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Modal,
  Image
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Header } from "../components/Header";
import InputField from "../components/InputField";
import { base_url } from "@env";
type Address = {
  _id?: string;
  street: string;
  barangay: string;
  city: string;
  province: string;
  zip: string;
};

type UserData = {
  _id: string;
  token: string;
  address: Address[];
  selectedAddressIndex: number;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
};

export default function Addresses() {
  const [shippingAddresses, setShippingAddresses] = useState<Address[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState<number>(0);
  const [street, setStreet] = useState("");
  const [barangay, setBarangay] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [zipCode, setZipCode] = useState("");

  const router = useRouter();
  const Base_URL = `http://${base_url}:4000`;

  const loadAddresses = async () => {
    try {
      const userDataString = await AsyncStorage.getItem("userData");
      if (userDataString) {
        const userData: UserData = JSON.parse(userDataString);
        if (Array.isArray(userData.address)) {
          setShippingAddresses(userData.address);
          setSelectedAddressIndex(userData.selectedAddressIndex || 0);
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    }
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  const handleSelectAddress = async (index: number) => {
    try {
      const userDataString = await AsyncStorage.getItem("userData");
      if (!userDataString) throw new Error("User data not found");

      const userData: UserData = JSON.parse(userDataString);
      userData.selectedAddressIndex = index;
      
      await AsyncStorage.setItem("userData", JSON.stringify(userData));
      setSelectedAddressIndex(index);
      
      router.back();
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    }
  };

  const handleSaveAddress = async () => {
    if (!street || !barangay || !city || !province || !zipCode) {
      alert("Please complete all address fields");
      return;
    }
  
    try {
      const userDataString = await AsyncStorage.getItem("userData");
      if (!userDataString) throw new Error("User data not found");
  
      const userData: UserData = JSON.parse(userDataString);
      const addressPayload: Address = {
        ...(editingIndex !== null && shippingAddresses[editingIndex]?._id 
          ? { _id: shippingAddresses[editingIndex]._id } 
          : {}),
        street,
        barangay,
        city,
        province,
        zip: zipCode,
      };
  
      const response = await fetch(
        `${Base_URL}/api/v1/users/${userData._id}/add-address`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${userData.token}`,
          },
          body: JSON.stringify(addressPayload),
        }
      );
  
      const result = await response.json();
  
      if (!response.ok) {
        throw new Error(result.message || "Failed to save address");
      }
  
      userData.address = result.data.address;
      await AsyncStorage.setItem("userData", JSON.stringify(userData));
      setShippingAddresses(result.data.address);
  
      setStreet("");
      setBarangay("");
      setCity("");
      setProvince("");
      setZipCode("");
      setEditingIndex(null);
      setModalVisible(false);
  
      alert(result.message);
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    }
  };

  return (
    <View className="flex-1 bg-white">
      <Header />
      
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-6 flex items-center">
          <Text className="font-semibold text-3xl border-b-4 pb-2 mb-5 border-[#FFE300]">
            My Addresses
          </Text>

          {shippingAddresses.map((address, index) => (
            <View key={index} className="flex-row items-center justify-between mb-2 w-full border border-gray-200 p-4 rounded-lg bg-white">
              <TouchableOpacity
                className=" flex-1 mr-2"
                onPress={() => handleSelectAddress(index)}
              >
                <Text className="text-black text-sm">
                  {`${address.street}, ${address.barangay}, ${address.city}, ${address.province}, ${address.zip}`}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                className="p-2"
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
                <Image
                  source={require('../assets/images/line-md_edit.png')}
                  style={{ width: 20, height: 20 }}
                />
              </TouchableOpacity>
            </View>
          ))}

          <TouchableOpacity
            className="border border-gray-200 p-4 rounded-lg w-full bg-white flex-row justify-center items-center mt-4"
            onPress={() => setModalVisible(true)}
          >
            <Text className="text-sm text-gray-500">+ Add New Address</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Address Modal */}
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View className="flex-1 justify-end bg-black/30">
          <View className="bg-white w-full h-[80%] p-6 rounded-t-2xl">
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text className="text-lg font-semibold mb-9 text-center">
                {editingIndex !== null ? 'Edit Address' : 'Add Address'}
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

              <View className="w-full flex-row gap-5 mb-10 mt-4">
                <TouchableOpacity
                  className="border border-gray-300 px-4 py-4 rounded items-center flex-1"
                  onPress={() => {
                    setModalVisible(false);
                    setEditingIndex(null);
                    setStreet("");
                    setBarangay("");
                    setCity("");
                    setProvince("");
                    setZipCode("");
                  }}
                >
                  <Text className="text-gray-800 text-center font-semibold">
                    Cancel
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  className="bg-[#FDCB07] px-4 py-4 rounded items-center flex-1"
                  onPress={handleSaveAddress}
                >
                  <Text className="text-white text-center font-semibold">
                    {editingIndex !== null ? 'Update Address' : 'Add Address'}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}