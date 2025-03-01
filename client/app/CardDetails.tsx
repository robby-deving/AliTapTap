import React from "react";
import { View, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Header } from '../components/Header';
import CardDetails from "../components/CardDetails";

const CardDetailsScreen = () => {
  const { product } = useLocalSearchParams();
  const parsedProduct = typeof product === "string" ? JSON.parse(product) : product;
  console.log('Parsed Product:', parsedProduct);


  return (
    <View style={styles.container}>
      {/* Use the Header component */}
      <Header />
      {/* Pass the product as a prop to CardDetails */}
      <CardDetails product={parsedProduct} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default CardDetailsScreen;
