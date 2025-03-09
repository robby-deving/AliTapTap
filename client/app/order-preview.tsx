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
  const { id } = useLocalSearchParams(); // Get the order ID from the route params

  // Simulated order data based on the selected ID
  const order = {
    id: id as string,
    title: "Tap Basic - Black",
    material: "Metal",
    quantity: 100,
    price: 1200.00,
    orderNumber: "00000123",
    status: "In Transit",
    paymentTime: "16-02-2025, 11:30pm", // Simulated payment time
    paymentMethod: "Card",
    totalAmount: 1200.00, // Total amount matches price for simplicity
  };

    const handleOrderReceived = () => {
        // Add logic for marking order as received (e.g., API call or state update)
        alert("Order marked as received!");
        router.back();
    };

    return (
        <View className="flex-1 bg-white">
        {/* Header with Back Arrow */}
        <Header showBackButton={true} />

        {/* Scrollable Content */}
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            <View className="px-8 py-5 w-full items-center">
                <Text className="font-semibold text-3xl border-b-4 pb-2 border-[#FFE300] mt-5 mb-4">
                    Order Preview
                </Text>

                <View className="w-full flex flex-col items-center mt-5">
                    <View className="w-full mt-6">
                        {/* First Card Image */}
                        <Image
                            // source={require('../../assets/images/order-icon.png')} // Replace with the actual image
                            style={{ width: 200, height: 150, borderRadius: 10, backgroundColor: "gray" }}
                            className="self-center mb-8"
                        />

                        {/* Second Card Image with Details */}
                        <Image
                            // source={require('../../assets/images/card-with-details.png')} // Replace with the actual image
                            style={{ width: 200, height: 150, borderRadius: 10, backgroundColor: "gray" }} // Placeholder gray background
                            className="self-center mb-10"
                        />

                        {/* Order Details */}
                        <View className="w-full mt-4">
                            <View className="mb-2 flex-row justify-between">
                            <Text className="text-gray-500 text-l">Order Number</Text>
                            <Text className="text-black text-l">{order.orderNumber}</Text>
                            </View>
                            <View className="mb-2 flex-row justify-between">
                            <Text className="text-gray-500 text-l">Payment Time</Text>
                            <Text className="text-black text-l">{order.paymentTime}</Text>
                            </View>
                            <View className="mb-2 flex-row justify-between">
                            <Text className="text-gray-500 text-l">Payment Method</Text>
                            <Text className="text-black text-l">{order.paymentMethod}</Text>
                            </View>
                            {/* Horizontal Line */}
                            <View className="w-full h-0.5 bg-gray-200 my-2" />
                            <View className="mb-2 flex-row justify-between">
                            <Text className="text-gray-500 text-l">Quantity</Text>
                            <Text className="text-black text-l">{order.quantity}</Text>
                            </View>
                            <View className="mb-2 flex-row justify-between">
                            <Text className="text-black-500 text-xl font-bold">Total Amount</Text>
                            <Text className="text-black text-xl font-bold">P{order.totalAmount.toFixed(2)}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>

            <View className="h-32" />
        </ScrollView>

        {/* Fixed Order Received Button at the Bottom */}
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
        </View>
    );
}