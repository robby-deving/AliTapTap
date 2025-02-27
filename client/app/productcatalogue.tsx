import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, FlatList, ScrollView, ActivityIndicator, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useRouter } from "expo-router"; // ✅ Use Expo Router for navigation

const ProductCatalogue: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filterVisible, setFilterVisible] = useState<boolean>(false); // State to toggle filter modal
  const [sortOrder, setSortOrder] = useState<string>("lowest-highest"); // Default sorting by lowest to highest
  const router = useRouter(); // ✅ Fix: Use Expo Router

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://192.168.105.87:4000/api/v1/card-designs/admin/get-card-products");
      let fetchedProducts = response.data.data || [];

      // Ensure "Upload your own design" option is included dynamically
      const uploadOption = {
        id: "upload",
        name: "Upload your own design",
        price: "₱ 1200.00",
        isUploadOption: true,
      };

      if (!fetchedProducts.find((p: any) => p.isUploadOption)) {
        fetchedProducts = [uploadOption, ...fetchedProducts]; // Add upload option at the beginning
      }

      setProducts(fetchedProducts);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Failed to load products");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleUploadPress = () => {
    console.log("Upload button clicked"); // Placeholder for future upload implementation
  };

  const handleFilterPress = () => {
    setFilterVisible(true); // Show the filter modal
  };

  const handleCloseFilter = () => {
    setFilterVisible(false); // Close the filter modal
  };

  const handleSort = (order: string) => {
    setSortOrder(order);
    setFilterVisible(false); // Close the filter modal after selecting
  };

  const getPrice = (item: any) => {
    const unitPrice = item.materials?.PVC?.price_per_unit || 1200;
    return unitPrice;
  };

  // Separate the "Upload your own design" option from the rest of the products
  const uploadOption = products.find((item: any) => item.isUploadOption);
  const otherProducts = products.filter((item: any) => !item.isUploadOption);

  // Sort products based on selected order (excluding the upload option)
  const sortedProducts = [...otherProducts].sort((a, b) => {
    const priceA = getPrice(a);
    const priceB = getPrice(b);
    if (sortOrder === "lowest-highest") {
      return priceA - priceB;
    } else if (sortOrder === "highest-lowest") {
      return priceB - priceA;
    }
    return 0;
  });

  // Merge the upload option at the top
  const finalProducts = uploadOption ? [uploadOption, ...sortedProducts] : sortedProducts;

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="person-circle-outline" size={24} color="white" />
        <Image source={require("../assets/images/logo.png")} style={styles.logo} resizeMode="contain" />
        <Ionicons name="chatbubble-ellipses-outline" size={24} color="white" />
      </View>

      {/* Search and Filter */}
      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="#696969" style={styles.searchIcon} />
          <TextInput style={styles.searchInput} placeholder="Search Designs" placeholderTextColor="#BDBDBD" />
        </View>
        <TouchableOpacity style={styles.filterButton} onPress={handleFilterPress}>
          <Ionicons name="options-outline" size={24} color="#696969" />
        </TouchableOpacity>
      </View>

      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Image source={require("../assets/images/banner.png")} style={styles.banner} resizeMode="contain" />

        {/* Product Grid */}
        <FlatList
          data={finalProducts}
          keyExtractor={(item, index) => `${item.id}-${index}`} // ✅ Ensures unique keys
          numColumns={2}
          contentContainerStyle={styles.productList}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.productCard}
              activeOpacity={0.7}
              onPress={() => 
                item.isUploadOption 
                  ? handleUploadPress() 
                  : router.push({ pathname: "/CardDetails", params: { product: JSON.stringify(item) } }) // ✅ Fix navigation
              }
            >
              {item.isUploadOption ? (
                <View style={styles.uploadContainer}>
                  <Ionicons name="cloud-upload-outline" size={50} color="gray" />
                  <Text style={styles.uploadText}>{item.name}</Text>
                  <Text style={styles.productPrice}>{item.price}</Text>
                </View>
              ) : (
                <>
                  <Image source={{ uri: item.front_image }} style={styles.productImage} resizeMode="contain" />
                  <View style={styles.productInfo}>
                    <Text style={styles.productName}>{item.name}</Text>
                    <Text style={styles.productPrice}>
                      {item.materials?.PVC?.price_per_unit ? `₱${item.materials.PVC.price_per_unit}` : "Price not available"}
                    </Text>
                  </View>
                </>
              )}
            </TouchableOpacity>
          )}
        />
      </ScrollView>

      {/* Filter Modal */}
      <Modal
        visible={filterVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCloseFilter}
      >
        <View style={styles.modalBackground}>
          <View style={styles.filterModal}>
            <Text style={styles.filterTitle}>Sort by Price</Text>
            <TouchableOpacity style={styles.filterOption} onPress={() => handleSort("lowest-highest")}>
              <Text style={styles.filterOptionText}>Lowest to Highest</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterOption} onPress={() => handleSort("highest-lowest")}>
              <Text style={styles.filterOptionText}>Highest to Lowest</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={handleCloseFilter}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },
  centerContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    width: "100%",
    height: 80,
    backgroundColor: "#1C1C1C",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  logo: { height: 30, width: 30 },
  searchSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 10,
    marginVertical: 10,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    backgroundColor: "#FFF",
    paddingHorizontal: 15,
    borderRadius: 8,
    height: 40,
    borderWidth: 1,
    borderColor: "#BDBDBD",
  },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 14, color: "#333" },
  filterButton: {
    marginLeft: 10,
    padding: 8,
    backgroundColor: "#FFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#BDBDBD",
    width: 44,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContainer: { paddingBottom: 20 },
  banner: { width: "100%", height: 150, alignSelf: "center", marginVertical: 10 },
  productList: { paddingHorizontal: 15 },
  productCard: {
    flex: 1,
    backgroundColor: "#FFF",
    margin: 10,
    borderRadius: 12, // Add border radius to the product card itself
    padding: 20,
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  uploadContainer: { height: 100, justifyContent: "center", alignItems: "center" },
  uploadText: { fontSize: 15, fontWeight: "bold", textAlign: "center", marginTop: 8 },
  productImage: { 
    width: "100%", 
    height: 110, 
    borderRadius: 12, 
  },
  productInfo: { marginTop: 12 },
  productName: { fontSize: 15, fontWeight: "bold", textAlign: "left" },
  productPrice: { fontSize: 13, color: "#777", textAlign: "left", marginTop: 2 },

  /* Modal Styles */
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  filterModal: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: 300,
  },
  filterTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  filterOption: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  filterOptionText: {
    fontSize: 16,
    color: "#333",
  },
  closeButton: {
    marginTop: 15,
    paddingVertical: 10,
    backgroundColor: "#1C1C1C",
    borderRadius: 5,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});


export default ProductCatalogue;