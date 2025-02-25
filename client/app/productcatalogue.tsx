import React from "react";
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, FlatList, ScrollView } from "react-native";
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

      {/* 🔥 Updated Search Bar and Filter Layout */}
      <View style={styles.searchSection}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#696969" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search Designs"
          placeholderTextColor="#BDBDBD"
        />
      </View>

    {/* Filter Button */}
    <TouchableOpacity style={styles.filterButton}>
      <Ionicons name="options-outline" size={24} color="#696969" />
    </TouchableOpacity>
  </View>


      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Banner Image */}
        <Image source={require("../assets/images/banner.png")} style={styles.banner} resizeMode="contain" />

        {/* Product Grid */}
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.productList}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.productCard} activeOpacity={0.7}>
              {item.isUploadOption ? (
                <View style={styles.uploadContainer}>
                  <Ionicons name="cloud-upload-outline" size={50} color="gray" />
                  <Text style={styles.uploadText}>{item.name}</Text>
                  <Text style={styles.productPrice}>{String(item.price)}</Text>
                </View>
              ) : (
                <>
                  <Image source={item.image} style={styles.productImage} resizeMode="contain" />
                  <View style={styles.productInfo}>
                    <Text style={styles.productName}>{item.name}</Text>
                    <Text style={styles.productPrice}>{String(item.price)}</Text>
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

  /* 🔥 New Search Bar and Filter Layout */
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
