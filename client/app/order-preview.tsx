import React from "react";
import {
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Header } from "../components/Header";

export default function OrderPreview() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Create order object from params
  const order = {
    id: params.id as string,
    title: params.title as string,
    material: params.material as string,
    quantity: parseInt(params.quantity as string),
    price: parseFloat(params.price as string),
    orderNumber: params.orderNumber as string,
    status: params.status as string,
    front_image: params.front_image as string,
    back_image: params.back_image as string,
    paymentTime: new Date().toLocaleString(), // You might want to pass this from the order data
    paymentMethod: "Card", // You might want to pass this from the order data
    totalAmount: parseFloat(params.price as string)
  };

  const handleOrderReceived = async () => {
    try {
      // Add API call here to update order status
      // await axios.put(`${Base_Url}/api/v1/orders/${order.id}/received`);
      alert("Order marked as received!");
      router.back();
    } catch (error) {
      console.error('Error marking order as received:', error);
      alert("Failed to mark order as received");
    }
  };

  return (
    <View className="flex-1 bg-white">
      <Header showBackButton={true} />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-8 py-5 w-full items-center">
          <Text className="font-semibold text-3xl border-b-4 pb-2 border-[#FFE300] mt-5 mb-4">
            Order Preview
          </Text>

          <View className="w-full flex flex-col items-center mt-5">
            <View className="w-full mt-6">
              {/* Front Image */}
              <Image
                source={{ uri: order.front_image }}
                style={{ width: 200, height: 150, borderRadius: 10 }}
                className="self-center mb-8"
              />

              {/* Back Image */}
              <Image
                source={{ uri: order.back_image }}
                style={{ width: 200, height: 150, borderRadius: 10 }}
                className="self-center mb-10"
              />

              {/* Order Details */}
              <View className="w-full mt-4">
                <View className="mb-2 flex-row justify-between">
                  <Text className="text-gray-500 text-l">Order Number</Text>
                  <Text className="text-black text-l">{order.orderNumber}</Text>
                </View>
                <View className="mb-2 flex-row justify-between">
                  <Text className="text-gray-500 text-l">Material</Text>
                  <Text className="text-black text-l">{order.material}</Text>
                </View>
                <View className="mb-2 flex-row justify-between">
                  <Text className="text-gray-500 text-l">Status</Text>
                  <Text className="text-black text-l">{order.status}</Text>
                </View>
                <View className="w-full h-0.5 bg-gray-200 my-2" />
                <View className="mb-2 flex-row justify-between">
                  <Text className="text-gray-500 text-l">Quantity</Text>
                  <Text className="text-black text-l">{order.quantity}</Text>
                </View>
                <View className="mb-2 flex-row justify-between">
                  <Text className="text-black-500 text-xl font-bold">Total Amount</Text>
                  <Text className="text-black text-xl font-bold">P{order.price.toFixed(2)}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View className="h-32" />
      </ScrollView>

      {/* Show Order Received button only if order is not delivered */}
      {order.status !== 'Delivered' && (
        <View className="absolute bottom-0 w-full p-10 border-gray-200">
          <TouchableOpacity
            onPress={handleOrderReceived}
            className="w-full border border-[#FFE300] p-4 rounded-lg items-center"
          >
            <Text className="text-[#FFE300] text-center text-l font-bold">
              Order Received
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}