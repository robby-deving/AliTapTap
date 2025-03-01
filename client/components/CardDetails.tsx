import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
<<<<<<< HEAD
import { useRouter } from "expo-router"; // Import useRouter for navigation
=======
import { useRouter } from "expo-router";
>>>>>>> origin/f/dynamicDataCustom

type Product = {
  front_image?: string;
  back_image?: string;  // Add this field
  materials?: { [key: string]: { price_per_unit: number } };
  details?: { front_info: any[]; back_info: any[] };  // Add this field, assuming details are arrays
};


type CardDetailsProps = {
  product: Product;
};

const CardDetails = ({ product }: CardDetailsProps) => {
  const router = useRouter(); // Initialize the router for navigation
  const materialOptions = product?.materials ? Object.keys(product.materials) : ["PVC", "Metal", "Wood"];

  const [selectedMaterial, setSelectedMaterial] = useState(materialOptions[0]);
<<<<<<< HEAD
  const [quantity, setQuantity] = useState(1); 
=======
  const [quantity, setQuantity] = useState(1); // Default quantity is 1
  const router = useRouter();
>>>>>>> origin/f/dynamicDataCustom

  const handleIncrease = () => {
    setQuantity((prevQuantity) => prevQuantity + 1); 
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity((prevQuantity) => prevQuantity - 1); 
    }
  };

  const getPrice = () => {
    const unitPrice = product?.materials?.[selectedMaterial]?.price_per_unit || 1200;
    const totalPrice = unitPrice * quantity;
    return totalPrice.toLocaleString(); 
  };

  const handleEditPress = () => {
    router.push({ pathname: "/edit", params: { product: JSON.stringify(product) } });
  };

  return (
    <View style={styles.container}>
      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={styles.content}>
        {/* Product Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: product?.front_image || "https://via.placeholder.com/300" }} 
            style={styles.productImage}
            resizeMode="contain"
          />
        </View>

        {/* Product Details */}
        <View style={styles.detailsContainer}>
          <Text style={styles.price}>₱ {getPrice()}</Text>
          <View style={styles.separator} />

          {/* Material Selection */}
          <Text style={styles.label}>Material</Text>
          <View style={styles.materialContainer}>
            {["PVC", "Metal", "Wood"].map((material) => (
              <TouchableOpacity
                key={material}
                style={[styles.materialButton, selectedMaterial === material && styles.materialSelected]}
                onPress={() => setSelectedMaterial(material)}
              >
                <Text style={[styles.materialText, selectedMaterial === material && styles.materialTextSelected]}>
                  {material}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Quantity Selector */}
          <Text style={styles.label}>Quantity</Text>
          <View style={styles.quantityContainer}>
            <TouchableOpacity onPress={handleDecrease} style={styles.quantityButton}>
              <Ionicons name="remove" size={20} color="black" />
            </TouchableOpacity>
            <Text style={styles.quantityText}>{quantity}</Text>
            <TouchableOpacity onPress={handleIncrease} style={styles.quantityButton}>
              <Ionicons name="add" size={20} color="black" />
            </TouchableOpacity>
          </View>

          {/* Edit Design Button */}
          <View style={styles.editButtonContainer}>
<<<<<<< HEAD
          <TouchableOpacity 
                style={styles.editButton} 
                onPress={() => router.push({
                  pathname: "/edit",  
                  params: {  
                    frontImage: product.front_image,
                    backImage: product.back_image,
                    materials: JSON.stringify(product.materials), 
                    details: JSON.stringify(product.details), 
                  }
                })}
              >
                <Text style={styles.editButtonText}>Edit Design</Text>
              </TouchableOpacity>
=======
            <TouchableOpacity onPress={handleEditPress} style={styles.editButton}>
              <Text style={styles.editButtonText}>Edit Design</Text>
            </TouchableOpacity>
>>>>>>> origin/f/dynamicDataCustom
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#F5F5F5" 
  },
  content: {
    flexGrow: 1, 
    justifyContent: "space-between", 
    paddingBottom: 1, 
  },

  /* Product Image */
  imageContainer: { 
    alignItems: "center", 
    justifyContent: "center", 
    marginVertical: 50, 
    height: 220, 
    width: "100%",  
  },

  productImage: { 
    width: "100%",  
    height: "100%",  
    borderRadius: 12,
  },

  detailsContainer: {
    backgroundColor: "white",
    padding: 30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },

  /* Price Section */
  price: { 
    fontSize: 22, 
    fontWeight: "bold", 
    marginBottom: 5 
  },

  /* Yellow Separator */
  separator: {
    height: 2,
    backgroundColor: "#FFD700",
    width: "100%",
    marginVertical: 5,
  },

  /* Material Selection */
  label: { 
    fontSize: 16, 
    fontWeight: "600", 
    marginTop: 10 
  },

  materialContainer: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    marginTop: 10,
  },

  materialButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#BDBDBD",
    alignItems: "center",
    marginHorizontal: 5,
    backgroundColor: "#FFF",
    marginTop: 13,
    marginBottom: 12,
  },

  materialSelected: { 
    backgroundColor: "#1C1C1C" 
  },

  materialText: { 
    fontSize: 14, 
    fontWeight: "600", 
    color: "#333" 
  },

  materialTextSelected: { 
    color: "white" 
  },

  /* Quantity Selector */
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start", 
    marginTop: 13,
  },

  quantityButton: {
    paddingVertical: 7,
    paddingHorizontal: 11,
    borderRadius: 5,
    backgroundColor: "#FFFFFF",  
    borderWidth: 0.8,  
    borderColor: "#000000", 
    alignItems: "center",
    justifyContent: "center",
  },

  quantityText: { 
    fontSize: 16,  
    fontWeight: "bold", 
    minWidth: 60,  
    textAlign: "center",
    backgroundColor: "#F7F7F7",  
    paddingVertical: 8,  
    paddingHorizontal: 15,  
    borderRadius: 5,
  },

  editButtonContainer: {
    alignItems: "center",
    marginTop: 45,  
  },

  editButton: {
    backgroundColor: "#FFC107",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    width: 325,
    height: 50,
  },

  editButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
});

export default CardDetails;
