import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, FlatList, ScrollView, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";

const ProductCatalogue: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://192.168.105.87:4000/api/v1/card-designs/admin/get-card-products");
      let fetchedProducts = response.data.data || [];

      // Ensure "Upload your own design" option is included dynamically
      const uploadOption = {
        id: "upload",
        name: "Upload your own design",
        price: "₱ 1200.00",
        isUploadOption: true
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
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="options-outline" size={24} color="#696969" />
        </TouchableOpacity>
      </View>

      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Image source={require("../assets/images/banner.png")} style={styles.banner} resizeMode="contain" />

        {/* Product Grid */}
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.productList}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.productCard, item.isUploadOption && styles.uploadCard]}
              activeOpacity={0.7}
              onPress={() => item.isUploadOption ? handleUploadPress() : null}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
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
  logo: {
    height: 30,
    width: 30,
  },
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
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#333",
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
  scrollContainer: {
    paddingBottom: 20,
  },
  banner: {
    width: "100%",
    height: 150,
    alignSelf: "center",
    marginVertical: 10,
  },
  productList: {
    paddingHorizontal: 15,
  },
  productCard: {
    flex: 1,
    backgroundColor: "#FFF",
    margin: 10,
    borderRadius: 8,
    padding: 20,
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  uploadCard: {
    flex: 1,
    backgroundColor: "#FFF",
    margin: 10,
    borderRadius: 8,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  uploadContainer: {
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  uploadText: {
    fontSize: 15,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 8,
  },
  productImage: {
    width: "100%",
    height: 110,
    borderRadius: 8,
  },
  productInfo: {
    marginTop: 12,
  },
  productName: {
    fontSize: 15,
    fontWeight: "bold",
    textAlign: "left",
  },
  productPrice: {
    fontSize: 13,
    color: "#777",
    textAlign: "left",
    marginTop: 2,
  },
});

export default ProductCatalogue;
