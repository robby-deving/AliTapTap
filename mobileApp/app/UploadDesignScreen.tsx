import React, { useState, useRef, useEffect } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Image, 
  Modal, 
  TextInput,
  StyleSheet 
} from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { Header } from "@/components/Header";
import { saveCardAsImage , updateOrderDetails } from "@/services/helperFunctions";
import { useRouter } from "expo-router";

interface Product {
  _id: string;
  materials: {
    [key: string]: {
      price_per_unit: number;
    };
  };
}

const UploadDesignScreen = () => {
  const [product, setProduct] = useState<Product | null>(null);
  const [frontImage, setFrontImage] = useState<string | null>(null);
  const [backImage, setBackImage] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [variant, setVariant] = useState<'PVC' | 'Metal' | 'Wood' | null>(null);
  const [quantity, setQuantity] = useState(1);
  const frontImageRef = useRef(null);
  const backImageRef = useRef(null);

  const router = useRouter();

  const Base_Url = `https://api.alitaptap.me`;

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
    <View style={styles.container}>
      <Header />
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Upload Design</Text>
        <View style={styles.titleUnderline} />
      </View>

      <View style={styles.uploadContainer}>
        {/* Front Image Upload */}
        <TouchableOpacity
          style={styles.imageUploadButton}
          onPress={() => pickImage(setFrontImage)}
        >
          {frontImage ? (
            <Image 
              ref={frontImageRef}
              source={{ uri: frontImage }} 
              style={styles.uploadedImage}
            />
          ) : (
            <Text style={styles.uploadText}>Upload the front part of your design</Text>
          )}
        </TouchableOpacity>

        {/* Back Image Upload */}
        <TouchableOpacity
          style={styles.imageUploadButton}
          onPress={() => pickImage(setBackImage)}
        >
          {backImage ? (
            <Image 
              ref={backImageRef}
              source={{ uri: backImage }} 
              style={styles.uploadedImage}
            />
          ) : (
            <Text style={styles.uploadText}>Upload the back part of your design</Text>
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
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Variant and Quantity</Text>
            
            <View style={styles.variantContainer}>
              {product && product.materials && (
                Object.entries(product.materials).map(([materialType, materialData]) => (
                  <TouchableOpacity
                    key={materialType}
                    onPress={() => setVariant(materialType as 'PVC' | 'Metal' | 'Wood')}
                    style={[
                      styles.variantButton,
                      variant === materialType && styles.variantButtonSelected
                    ]}
                  >
                    <Text style={[
                      styles.variantText,
                      variant === materialType && styles.variantTextSelected
                    ]}>
                      {materialType} - ₱{materialData.price_per_unit}
                    </Text>
                  </TouchableOpacity>
                ))
              )}
            </View>

            <Text style={styles.quantityLabel}>Quantity:</Text>
            <View style={styles.quantityContainer}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={decrementQuantity}
              >
                <Text>-</Text>
              </TouchableOpacity>
              <Text style={styles.quantityText}>{quantity}</Text>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={incrementQuantity}
              >
                <Text>+</Text>
              </TouchableOpacity>
            </View>
            
            {variant && product && (
              <View style={styles.totalContainer}>
                <Text style={styles.totalText}>
                  Total: ₱{product.materials[variant].price_per_unit * quantity}
                </Text>
              </View>
            )}

            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.confirmButton,
                  !variant && styles.confirmButtonDisabled
                ]}
                disabled={!variant}
                onPress={handleConfirm}
              >
                <Text style={[
                  styles.confirmButtonText,
                  !variant && styles.confirmButtonTextDisabled
                ]}>
                  Confirm
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Next Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[
            styles.nextButton,
            (!frontImage || !backImage) && styles.nextButtonDisabled
          ]}
          disabled={!frontImage || !backImage}
          onPress={handleSubmit}
        >
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6'
  },
  headerContainer: {
    padding: 16,
    alignItems: 'center'
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: 'black'
  },
  titleUnderline: {
    width: 64,
    height: 4,
    backgroundColor: '#FACC15',
    marginTop: 4
  },
  uploadContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
    paddingHorizontal: 16
  },
  imageUploadButton: {
    height: 210,
    width: 367.5,
    backgroundColor: '#D1D5DB',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  uploadedImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8
  },
  uploadText: {
    color: '#6B7280'
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 8,
    width: '80%'
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16
  },
  variantContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16
  },
  variantButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#E5E7EB'
  },
  variantButtonSelected: {
    backgroundColor: '#FACC15'
  },
  variantText: {
    color: 'black'
  },
  variantTextSelected: {
    color: 'white'
  },
  quantityLabel: {
    fontSize: 14,
    marginBottom: 8
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16
  },
  quantityButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 8
  },
  quantityText: {
    marginHorizontal: 16
  },
  totalContainer: {
    marginBottom: 16,
    padding: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 8
  },
  totalText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#D97706'
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#E5E7EB'
  },
  confirmButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#FACC15'
  },
  confirmButtonDisabled: {
    backgroundColor: '#D1D5DB'
  },
  confirmButtonText: {
    color: 'white'
  },
  confirmButtonTextDisabled: {
    color: '#6B7280'
  },
  bottomContainer: {
    padding: 16
  },
  nextButton: {
    backgroundColor: '#FACC15',
    padding: 16,
    borderRadius: 8
  },
  nextButtonDisabled: {
    opacity: 0.5
  },
  nextButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '700'
  }
});

export default UploadDesignScreen;