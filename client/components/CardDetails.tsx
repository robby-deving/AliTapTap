import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { updateOrderDetails, saveOrderAndTransaction  } from "@/services/helperFunctions";

type Product = {
  front_image?: string;
  materials?: { [key: string]: { price_per_unit: number } };
  name?: string;
};

type CardDetailsProps = {
  product: Product;
};

const CardDetails = ({ product }: CardDetailsProps) => {
  const materialOptions = product?.materials ? Object.keys(product.materials) : ["PVC", "Metal", "Wood"];
  const [selectedMaterial, setSelectedMaterial] = useState(materialOptions[0]);
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const router = useRouter();

  // Calculate total price when quantity or material changes
  React.useEffect(() => {
    const unitPrice = product?.materials?.[selectedMaterial]?.price_per_unit || 1200;
    const calculatedTotal = unitPrice * quantity;
    setTotalPrice(calculatedTotal);
  }, [quantity, selectedMaterial, product]);

  const handleIncrease = () => {
    setQuantity((prevQuantity) => prevQuantity + 1); // Increase quantity by 1
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity((prevQuantity) => prevQuantity - 1); // Prevent going below 1
    }
  };

  const handleEditPress = async () => {
    try {
      await updateOrderDetails('quantity', quantity);    
      await updateOrderDetails('material', selectedMaterial);
      await updateOrderDetails('total_price', totalPrice);
      router.push({ 
        pathname: "/edit", 
        params: { product: JSON.stringify(product) } 
      });
    } catch (error) {
      console.error('Error updating order details:', error);
      // You might want to show an error message to the user here
    }
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
        <Text className="text-2xl pb-2 font-bold">{ product.name}</Text>
          <Text className="text-xl font-semibold">₱ {totalPrice.toLocaleString()}</Text>
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
            <TouchableOpacity onPress={handleEditPress} style={styles.editButton}>
              <Text style={styles.editButtonText}>Edit Design</Text>
            </TouchableOpacity>
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
    alignItems: "center",  // Center image horizontally
    justifyContent: "center", // Center image vertically
    marginVertical: 50, 
    height: 220, // Set a fixed height for the container if necessary
    width: "100%",  // Ensure the container takes full width
  },

  productImage: { 
    width: "100%",  // Ensure the image takes up full width of the container
    height: "100%",  // Image scales to the container's height
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

/* Edit Button Container */
editButtonContainer: {
  alignItems: "center", // Center the button horizontally
  marginTop: 45,  // Space from previous elements
},

  /* Edit Design Button */
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