import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, FlatList, ScrollView, ActivityIndicator, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { HomePageHeader } from "../components/HomePageHeader";
import { fetchProducts } from "../services/productService";

const ProductCatalogue: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filterVisible, setFilterVisible] = useState<boolean>(false);
  const [sortOrder, setSortOrder] = useState<string>("lowest-highest");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const router = useRouter();

  // Use the service to fetch products
  const fetchData = async () => {
    try {
      const fetchedProducts = await fetchProducts();
      setProducts(fetchedProducts);
      setLoading(false);
    } catch (err) {
      setError("Failed to load products");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUploadPress = () => {
    console.log("Upload button clicked");
  };

  const handleFilterPress = () => {
    setFilterVisible(true);
  };

  const handleCloseFilter = () => {
    setFilterVisible(false);
  };

  const handleSort = (order: string) => {
    setSortOrder(order);
    setFilterVisible(false);
  };

  const getPrice = (item: any) => {
    const unitPrice = item.materials?.PVC?.price_per_unit || 1200;
    return unitPrice;
  };

  const uploadOption = products.find((item: any) => item.isUploadOption);
  const otherProducts = products.filter((item: any) => !item.isUploadOption);

  const sortedProducts = [...otherProducts].sort((a, b) => {
    const priceA = getPrice(a);
    const priceB = getPrice(b);
    if (sortOrder === "lowest-highest") {
      return priceA - priceB;
    } else if (sortOrder === "highest-lowest") {
      return priceB - priceA;
    } else if (sortOrder === "alphabetical") {
      return a.name.localeCompare(b.name);
    }
    return 0;
  });

  const finalProducts = uploadOption ? [uploadOption, ...sortedProducts] : sortedProducts;

  const filteredProducts = finalProducts.filter((item: any) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      {/* Use HomePageHeader here */}
      <HomePageHeader />

      {/* Search and Filter */}
      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="#696969" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search Designs"
            placeholderTextColor="#BDBDBD" // Placeholder color
            value={searchQuery}
            onChangeText={(text) => setSearchQuery(text)}
          />
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
          data={filteredProducts}
          keyExtractor={(item, index) => `${item.id}-${index}`}
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
                  : router.push({ pathname: "/CardDetails", params: { product: JSON.stringify(item) } })
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
                  {/* Render only the front image */}
                  <Image source={{ uri: item.front_image }} style={styles.productImage} resizeMode="contain" />
                  <View style={styles.productInfo}>
                    <Text style={styles.productName}>{item.name}</Text>
                    <View style={styles.ratingContainer}>
                      {/* Display 4 stars as a static example */}
                      {[...Array(5)].map((_, index) => (
                        <Ionicons key={index} name="star" size={14} color="#FFD700" />
                      ))}
                    </View>
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
      <Modal visible={filterVisible} animationType="slide" transparent={true} onRequestClose={handleCloseFilter}>
        <View style={styles.modalBackground}>
          <View style={styles.filterModal}>
            <Text style={styles.filterTitle}>Sort by</Text>
            <TouchableOpacity style={styles.filterOption} onPress={() => handleSort("lowest-highest")}>
              <Text style={styles.filterOptionText}>Lowest to Highest</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterOption} onPress={() => handleSort("highest-lowest")}>
              <Text style={styles.filterOptionText}>Highest to Lowest</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterOption} onPress={() => handleSort("alphabetical")}>
              <Text style={styles.filterOptionText}>Alphabetical (A-Z)</Text>
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
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#333",
    fontStyle: "italic", // Apply italic to the input text
  },
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
    width: "45%", 
    backgroundColor: "#FFF",
    margin: 10,
    borderRadius: 12,
    padding: 20,
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    minHeight: 220, 
  },
  uploadContainer: { height: 100, justifyContent: "center", alignItems: "center" },
  uploadText: { fontSize: 15, fontWeight: "bold", textAlign: "center", marginTop: 8 },
  productImage: { width: "100%", height: 110, borderRadius: 12 },
  productInfo: { marginTop: 12 },
  productName: { fontSize: 15, fontWeight: "bold", textAlign: "left" },
  ratingContainer: { flexDirection: "row", marginTop: 4 },
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
