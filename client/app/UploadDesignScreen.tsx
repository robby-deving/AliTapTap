import React, { useState, useRef, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, Modal, TextInput } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { Header } from "@/components/Header";
import { saveCardAsImage , updateOrderDetails } from "@/services/helperFunctions";
import { useRouter } from "expo-router";
import { base_url } from "@env";

interface Product {
  _id: string;
  materials: {
    [key: string]: {
      price_per_unit: number;
    };
  };
}

const UploadDesignScreen = () => {
  // Update the product state to use the interface
  const [product, setProduct] = useState<Product | null>(null);
  const [frontImage, setFrontImage] = useState<string | null>(null);
  const [backImage, setBackImage] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [variant, setVariant] = useState<'PVC' | 'Metal' | 'Wood' | null>(null);
  const [quantity, setQuantity] = useState(1);
  const frontImageRef = useRef(null);
  const backImageRef = useRef(null);

  const router = useRouter();

  const Base_Url = `http://${base_url}:4000`;


  useEffect(() => {
    fetchProductData();
  }, []);

  const fetchProductData = async () => {
    try {
      const response = await fetch(`${Base_Url}/api/v1/card-designs/get-card-design/67e4ca6b12225fb762bff3f0`);
      const data = await response.json();
      setProduct(data.data);
    } catch (error) {
      console.error('Error fetching product data:', error);
    }
  };

  const handleSubmit = async () => {
    setModalVisible(true);
  };

  const handleConfirm = async () => {
    try {
      if (frontImage && backImage && variant && product) {
        await saveCardAsImage(frontImageRef, 'front');
        await saveCardAsImage(backImageRef, 'back');
        
        // Calculate total price using product materials
        const basePrice = product.materials[variant].price_per_unit;
        const total = basePrice * quantity;
        
        setModalVisible(false);
        await updateOrderDetails('quantity', quantity);    
        await updateOrderDetails('total_price', total);
        await updateOrderDetails('design_id', product._id);
        await updateOrderDetails('material', variant);
      
        router.push("/shipping");
      }
    } catch (error) {
      console.error('Error saving images:', error);
      alert('Failed to save images. Please try again.');
    }
  };

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    setQuantity(prev => prev > 1 ? prev - 1 : 1);
  };

  const pickImage = async (setImage: (uri: string) => void) => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      alert('Failed to pick image. Please try again.');
    }
  };

  return (
    <View className="flex-1 bg-gray-100">
      <Header />
      <View className="p-4 items-center">
        <Text className="text-lg font-bold text-black">Upload Design</Text>
        <View className="w-16 h-1 bg-yellow-400 mt-1" />
      </View>

      <View className="flex-1 justify-center items-center gap-6 px-4">
        {/* Front Image Upload */}
        <TouchableOpacity
          className="h-[210px] w-[367.5px] bg-gray-300 rounded-lg items-center justify-center"
          onPress={() => pickImage(setFrontImage)}
        >
          {frontImage ? (
            <Image 
              ref={frontImageRef}
              source={{ uri: frontImage }} 
              className="w-full h-full rounded-lg" 
            />
          ) : (
            <Text className="text-gray-500">Upload the front part of your design</Text>
          )}
        </TouchableOpacity>

        {/* Back Image Upload */}
        <TouchableOpacity
          className="h-[210px] w-[367.5px] bg-gray-300 rounded-lg items-center justify-center"
          onPress={() => pickImage(setBackImage)}
        >
          {backImage ? (
            <Image 
              ref={backImageRef}
              source={{ uri: backImage }} 
              className="w-full h-full rounded-lg" 
            />
          ) : (
            <Text className="text-gray-500">Upload the back part of your design</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Variant Selection Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white p-6 rounded-lg w-[80%]">
            <Text className="text-lg font-bold mb-4">Select Variant and Quantity</Text>
            
            <View className="flex-row flex-wrap gap-2 mb-4">
              {product && product.materials && (
                Object.entries(product.materials).map(([materialType, materialData]) => (
                  <TouchableOpacity
                    key={materialType}
                    onPress={() => setVariant(materialType as 'PVC' | 'Metal' | 'Wood')}
                    className={`px-4 py-2 rounded-lg ${
                      variant === materialType ? 'bg-yellow-400' : 'bg-gray-200'
                    }`}
                  >
                    <Text className={variant === materialType ? 'text-white' : 'text-black'}>
                      {materialType} - ₱{materialData.price_per_unit}
                    </Text>
                  </TouchableOpacity>
                ))
              )}
            </View>


            <Text className="text-sm mb-2">Quantity:</Text>
            <View className="flex-row items-center mb-4">
              <TouchableOpacity
                className="px-4 py-2 bg-gray-200 rounded-lg"
                onPress={decrementQuantity}
              >
                <Text>-</Text>
              </TouchableOpacity>
              <Text className="mx-4">{quantity}</Text>
              <TouchableOpacity
                className="px-4 py-2 bg-gray-200 rounded-lg"
                onPress={incrementQuantity}
              >
                <Text>+</Text>
              </TouchableOpacity>
            </View>
            
            {variant && product && (
              <View className="mb-4 p-2 bg-gray-100 rounded-lg">
                <Text className="text-lg font-bold text-yellow-600">
                  Total: ₱{product.materials[variant].price_per_unit * quantity}
                </Text>
              </View>
            )}

            <View className="flex-row justify-end gap-2">
              <TouchableOpacity
                className="px-4 py-2 rounded-lg bg-gray-200"
                onPress={() => setModalVisible(false)}
              >
                <Text>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`px-4 py-2 rounded-lg ${
                  variant ? 'bg-yellow-400' : 'bg-gray-300'
                }`}
                disabled={!variant}
                onPress={handleConfirm}
              >
                <Text className={variant ? 'text-white' : 'text-gray-500'}>
                  Confirm
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Next Button */}
      <View className="p-4">
        <TouchableOpacity
          className="bg-yellow-400 p-4 rounded-lg"
          disabled={!frontImage || !backImage}
          onPress={handleSubmit}
        >
          <Text className="text-white text-center font-bold">Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default UploadDesignScreen;