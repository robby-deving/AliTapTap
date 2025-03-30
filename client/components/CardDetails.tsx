import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { updateOrderDetails, saveOrderAndTransaction  } from "@/services/helperFunctions";
import { Svg, Path } from 'react-native-svg';  // Add this import at the top
import { base_url } from "@env";

type Product = {
  front_image?: string;
  materials?: { [key: string]: { price_per_unit: number } };
  name?: string;
  _id?: string;
};

type Review = {
  _id: string;
  customer_name: string;
  ratings: number;
  review_text: string;
  created_at: string;
};

type CardDetailsProps = {
  product: Product;
};

const CardDetails = ({ product }: CardDetailsProps) => {
  const materialOptions = product?.materials ? Object.keys(product.materials) : ["PVC", "Metal", "Wood"];
  const [selectedMaterial, setSelectedMaterial] = useState(materialOptions[0]);
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [reviews, setReviews] = useState<Review[]>([]);
  const router = useRouter();
  const Base_Url = `http://${base_url}:4000`;


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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: '2-digit'
    });
  };

  useEffect(() => {
    const fetchReviews = async () => {
        if (!product?._id) return;

        try {
            const response = await fetch(`${Base_Url}/api/v1/review/get-product-reviews/${product._id}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            if (data?.data) {
                setReviews(data.data);
            } else {
                console.warn("No reviews data in response");
                setReviews([]);
            }
        } catch (error) {
            console.error('Error fetching reviews:', error.message);
            setReviews([]);
        }
    };

    fetchReviews();
}, [product?._id]);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Product Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: product?.front_image || "https://via.placeholder.com/300" }} 
            style={styles.productImage}
            resizeMode="cover" // Use cover to maintain aspect ratio
          />
        </View>

        {/* Product Details */}
        
        <View style={styles.detailsContainer}>
        <Text className="text-3xl pb-2 font-bold">{ product.name}</Text>
          <Text className="text-xl font-normal mb-5">₱ {totalPrice.toLocaleString()}</Text>
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

          <View style={styles.reviewsContainer}>
            <View style={[styles.separator, { marginTop: 40 }]} />
            <View style={styles.reviewsWrapper}>
              <Text style={styles.reviewsTitle}>Reviews</Text>
              {reviews.map((review) => (
                <View key={review._id} style={styles.reviewItem}>
                  <Image 
                    source={require('../assets/images/profile-icon.png')} 
                    style={{ width: 30.2, height: 30, marginRight: 15, }} />
                  <View style={styles.reviewContent}>
                    <View style={styles.reviewHeader}>
                      <Text style={styles.reviewerName}>{review.customer_name}</Text>
                      <Text style={styles.reviewDate}>{formatDate(review.created_at)}</Text>
                    </View>
                    <View className="flex-row mb-2" >
                    {[...Array(5)].map((_, index) => (
                        <Svg 
                          key={index} 
                          width={12} 
                          height={12} 
                          viewBox="0 0 22 21"
                        >
                          <Path
                            d="M4.2075 20.9L5.995 13.1725L0 7.975L7.92 7.2875L11 0L14.08 7.2875L22 7.975L16.005 13.1725L17.7925 20.9L11 16.8025L4.2075 20.9Z"
                            fill={index < review.ratings ? "#FFE300" : "#D3D3D3"}
                          />
                        </Svg>
                      ))}
                    </View>
                    <View>
                      <Text style={styles.reviewText}>{review.review_text}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
      
      {/* Move the edit button outside ScrollView */}
      <View style={styles.editButtonContainer}>
        <TouchableOpacity onPress={handleEditPress} style={styles.editButton}>
          <Text style={styles.editButtonText}>Edit Design</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#F5F5F5",
    position: 'relative' // Add this
  },
  content: {
    flexGrow: 1, 
    justifyContent: "space-between", 
    paddingBottom: 80, // Add padding to account for fixed button
  },

  /* Product Image */
  imageContainer: { 
    alignItems: "center",  // Center image horizontally
    justifyContent: "center", // Center image vertically
    marginVertical: 80,
    backgroundColor: "#F5F5F5",
    height: 220, // Set a fixed height for the container if necessary
    width: "100%",  // Ensure the container takes full width
    borderRadius: 10,
    overflow: "hidden",  // Ensure the image doesn't overflow the container
  },

  productImage: { 
    width: "90%",  // Ensure the image takes up full width of the container
    height: "100%",  // Image scales to the container's height
    borderRadius: 10,
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
    height: 1,
    backgroundColor: "#FFE300",
    opacity: 0.5,
    width: "100%",
    marginVertical: 5,
  },

  /* Material Selection */
  label: { 
    fontSize: 18, 
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
  fontSize: 18,  
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
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: 'white',
  paddingVertical: 15,
  paddingHorizontal: 30,

},

  /* Edit Design Button */
 editButton: {
  backgroundColor: "#FFC107",
  paddingVertical: 12,
  borderRadius: 8,
  alignItems: "center", // Centers horizontally
  justifyContent: "center", // Centers vertically
  width: '100%',
  height: 50,
},

editButtonText: {
  fontSize: 16,
  fontWeight: "bold",
  color: "white",
  textAlign: "center", // Ensures text is centered
},


  reviewsContainer: {
    width: '100%',
  },
  reviewsWrapper: {
    width: '100%',
  },
  reviewsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
    marginTop: 10,

  },
  reviewItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: '100%',

  },

  reviewContent: {
    flex: 1,
    paddingBottom: 20,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  reviewerName: {
    fontWeight: '500',
    fontSize: 16,
  },
  reviewDate: {
    color: '#666',
  },

  reviewText: {
    color: '#333',
    fontSize: 14,
  },
});

export default CardDetails;