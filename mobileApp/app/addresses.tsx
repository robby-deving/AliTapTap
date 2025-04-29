import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Modal,
  Image,
  StyleSheet
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Header } from "../components/Header";
import InputField from "../components/InputField";

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
  const Base_URL = `https://api.alitaptap.me`;

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
    <View style={styles.container}>
      <Header />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>
            My Addresses
          </Text>

          {shippingAddresses.map((address, index) => (
            <View key={index} style={styles.addressCard}>
              <TouchableOpacity
                style={styles.addressButton}
                onPress={() => handleSelectAddress(index)}
              >
                <Text style={styles.addressText}>
                  {`${address.street}, ${address.barangay}, ${address.city}, ${address.province}, ${address.zip}`}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.editButton}
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
                  style={styles.editIcon}
                />
              </TouchableOpacity>
            </View>
          ))}

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.addButtonText}>+ Add New Address</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalTitle}>
                {editingIndex !== null ? 'Edit Address' : 'Add Address'}
              </Text>

              <View style={styles.inputField}>
                <InputField
                  label="St./Purok/Sitio/Subd."
                  placeholder="Enter your street"
                  value={street}
                  onChangeText={setStreet}
                />
              </View>

              <View style={styles.inputField}>
                <InputField
                  label="Barangay"
                  placeholder="Enter your barangay"
                  value={barangay}
                  onChangeText={setBarangay}
                />
              </View>

              <View style={styles.inputField}>
                <InputField
                  label="City/Municipality"
                  placeholder="Enter your city"
                  value={city}
                  onChangeText={setCity}
                />
              </View>

              <View style={styles.inputField}>
                <InputField
                  label="Province"
                  placeholder="Enter your province"
                  value={province}
                  onChangeText={setProvince}
                />
              </View>

              <View style={styles.inputField}>
                <InputField
                  label="ZIP Code"
                  placeholder="Enter your ZIP code"
                  value={zipCode}
                  onChangeText={setZipCode}
                  type="number"
                />
              </View>

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.cancelButton}
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
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={handleSaveAddress}
                >
                  <Text style={styles.submitButtonText}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  scrollView: {
    flex: 1
  },
  contentContainer: {
    padding: 24,
    alignItems: 'center'
  },
  title: {
    fontWeight: '600',
    fontSize: 30,
    borderBottomWidth: 4,
    borderBottomColor: '#FFE300',
    paddingBottom: 8,
    marginBottom: 20
  },
  addressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    width: '100%',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
    borderRadius: 8,
    backgroundColor: 'white'
  },
  addressButton: {
    flex: 1,
    marginRight: 8
  },
  addressText: {
    color: 'black',
    fontSize: 14
  },
  editButton: {
    padding: 8
  },
  editIcon: {
    width: 20,
    height: 20
  },
  addButton: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
    borderRadius: 8,
    width: '100%',
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16
  },
  addButtonText: {
    fontSize: 14,
    color: '#6B7280'
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.3)'
  },
  modalContent: {
    backgroundColor: 'white',
    width: '100%',
    height: '80%',
    padding: 24,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 36,
    textAlign: 'center'
  },
  inputField: {
    width: '100%',
    marginBottom: 16
  },
  buttonContainer: {
    width: '100%',
    flexDirection: 'row',
    gap: 20,
    marginBottom: 40,
    marginTop: 16
  },
  cancelButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center'
  },
  cancelButtonText: {
    color: '#1F2937',
    textAlign: 'center',
    fontWeight: '600'
  },
  submitButton: {
    flex: 1,
    backgroundColor: '#FDCB07',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center'
  },
  submitButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '600'
  }
});