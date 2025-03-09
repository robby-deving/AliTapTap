import React, { useState } from "react";
import {
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { Header } from "../components/Header";

export default function Orders() {
  const router = useRouter();

  // Simulated order data with multiple sets
  const [orders] = useState([
    {
      id: "1",
      title: "Tap Basic - Black",
      material: "Metal",
      quantity: 100,
      price: 1200.00,
      orderNumber: "00000123",
      status: "In Transit",
    },
    {
      id: "2",
      title: "Tap Premium - Silver",
      material: "Aluminum",
      quantity: 50,
      price: 1800.50,
      orderNumber: "00000124",
      status: "To Receive",
    },
    {
      id: "3",
      title: "Tap Standard - Gold",
      material: "Brass",
      quantity: 75,
      price: 1500.75,
      orderNumber: "00000125",
      status: "Completed",
    },
    {
      id: "4",
      title: "Tap Basic - Blue",
      material: "Plastic",
      quantity: 200,
      price: 900.00,
      orderNumber: "00000126",
      status: "In Transit",
    },
  ]);

  const handleOrderPreview = (orderId: string) => {
    // Navigate to the order preview page with the order ID
    router.push(`/order-preview`);
    //router.push(`/order-preview/${orderId}`);
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header (Fixed) */}
      <Header showBackButton={true} />

      {/* Fixed Title and Tabs */}
      <View className="px-8 py-5 w-full items-center">
        <Text className="font-semibold text-3xl border-b-4 pb-2 border-[#FFE300] mt-5 mb-4">
          <Text>My Orders</Text>
        </Text>
        <View className="w-full">
          {/* Order Status Tabs (Fixed) */}
          <View className="flex-row justify-evenly mb-1 mt-3">
            <Text className="text-black-500 font-bold">
              <Text>To Receive</Text>
            </Text>
            <Text className="text-gray-500">
              <Text>Completed</Text>
            </Text>
          </View>
        </View>
      </View>

      {/* Scrollable Orders Section */}
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-8 w-full">
          {/* Order List */}
          {orders.map((order) => (
            <TouchableOpacity
              key={order.id}
              onPress={() => handleOrderPreview(order.id)}
              className="border border-gray-200 p-5 rounded-lg bg-white mb-4"
            >
              <View>
                {/* Status Badge at the Top */}
                <View className="self-end mb-2">
                  <View className="border bg-[#FFFDEB] border-[#FFE300] p-1.5 rounded w-24 items-center">
                    <Text className="text-[#FDDF05] text-center text-xs font-bold">
                      <Text>{order.status}</Text>
                    </Text>
                  </View>
                </View>

                {/* Order Details */}
                <View className="flex-row">
                  <Image
                    // source={require('../assets/images/orders-icon.png')} // Replace with the actual image of the card
                    style={{ width: 150, height: 100, backgroundColor: "gray", borderRadius: 10 }}
                    className="self-center"
                  />
                  <View className="flex-1 ml-4">
                    <Text className="text-black font-semibold text-xl mb-2">
                      <Text>{order.title}</Text>
                    </Text>
                    <View className="mb-1">
                      <Text className="text-black text-sm">
                        <Text>Material: {order.material}</Text>
                      </Text>
                    </View>
                    <View className="mb-1">
                      <Text className="text-black text-sm">
                        <Text>Quantity: {order.quantity}</Text>
                      </Text>
                    </View>
                    <View className="mb-1">
                      <Text className="text-black text-sm">
                        <Text>Price: P{order.price.toFixed(2)}</Text>
                      </Text>
                    </View>
                    <View>
                      <Text className="text-black text-sm">
                        <Text>Order Number: {order.orderNumber}</Text>
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        <View className="h-10" /> {/* Spacer for better scrolling */}
      </ScrollView>
    </View>
  );
}