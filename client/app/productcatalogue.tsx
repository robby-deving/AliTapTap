import React from "react";
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const products = [
  { id: "1", name: "Upload your own design", price: "₱ 1200.00", isUploadOption: true },
  { id: "2", name: "Tap Basic - Black", price: "₱ 1200.00", image: require("../assets/images/card-black2.png") },
  { id: "3", name: "Tap Premium - Gold", price: "₱ 1500.00", image: require("../assets/images/card-black1.png") },
  { id: "4", name: "Tap Basic - Silver", price: "₱ 1300.00", image: require("../assets/images/card-black1.png") },
  { id: "5", name: "Tap Basic - Black", price: "₱ 1200.00", image: require("../assets/images/card-black1.png") },
  { id: "6", name: "Tap Basic - White", price: "₱ 1200.00", image: require("../assets/images/card-black1.png") },
  { id: "7", name: "Tap Basic - Red", price: "₱ 1250.00", image: require("../assets/images/card-black1.png") },
  { id: "8", name: "Tap Basic - Blue", price: "₱ 1250.00", image: require("../assets/images/card-black1.png") },
  { id: "9", name: "Tap Premium - Platinum", price: "₱ 1800.00", image: require("../assets/images/card-black1.png") },
  { id: "10", name: "Tap Premium - Rose Gold", price: "₱ 1700.00", image: require("../assets/images/card-black1.png") },
  { id: "11", name: "Tap Basic - Green", price: "₱ 1250.00", image: require("../assets/images/card-black1.png") },
  { id: "12", name: "Tap Exclusive - Matte Black", price: "₱ 2000.00", image: require("../assets/images/card-black1.png") },
];

const ProductCatalogue: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="person-circle-outline" size={24} color="white" />
        <Image source={require("../assets/images/logo.png")} style={styles.logo} resizeMode="contain" />
        <Ionicons name="chatbubble-ellipses-outline" size={24} color="white" />
      </View>

      {/* Search Bar with Filter */}
      <View style={styles.searchContainer}>
        <View style={styles.searchWrapper}>
          <Ionicons name="search" size={20} color="#555" style={styles.searchIcon} />
          <TextInput style={styles.searchInput} placeholder="Search Designs" />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="options-outline" size={24} color="#555" />
        </TouchableOpacity>
      </View>

      {/* Banner Image */}
      <Image source={require("../assets/images/banner.png")} style={styles.banner} resizeMode="contain" />

      {/* Product Grid */}
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.productList}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.productCard}
            activeOpacity={0.7} // Touch effect without visible hover
          >
            {item.isUploadOption ? (
              <View style={styles.uploadContainer}>
                <Ionicons name="cloud-upload-outline" size={50} color="gray" />
                <Text style={styles.uploadText}>{item.name}</Text>
              </View>
            ) : (
              <>
                <Image source={item.image} style={styles.productImage} resizeMode="contain" />
                <View style={styles.productInfo}>
                  <Text style={styles.productName}>{item.name}</Text>
                  <Text style={styles.productPrice}>{item.price}</Text>
                </View>
              </>
            )}
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
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
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    margin: 10,
    borderRadius: 5,
    paddingHorizontal: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    backgroundColor: "#FFF",
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  searchInput: {
    flex: 1,
    height: 40,
    marginLeft: 5,
  },
  searchIcon: {
    marginRight: 5,
  },
  filterButton: {
    padding: 8,
  },
  banner: {
    width: "90%",
    height: 120,
    alignSelf: "center",
    marginVertical: 10,
  },
  productList: {
    paddingHorizontal: 15, // Increased space between items
    paddingBottom: 20,
  },
  productCard: {
    flex: 1,
    backgroundColor: "#FFF",
    margin: 10, // More space between cards
    borderRadius: 8,
    padding: 20,
    justifyContent: "center",
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
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 8,
  },
  productImage: {
    width: "100%",
    height: 110, // Increased image size
    borderRadius: 8,
  },
  productInfo: {
    marginTop: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "left",
  },
  productPrice: {
    fontSize: 14,
    color: "#777",
    textAlign: "left",
    marginTop: 2,
  },
});

export default ProductCatalogue;
