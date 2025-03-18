import React, { useState } from "react";
import {
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Header } from "../components/Header";
import { AirbnbRating } from "react-native-ratings";

export default function OrderPreview() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const order = {
    id: id as string,
    title: "Tap Basic - Black",
    material: "Metal",
    quantity: 100,
    price: 1200.0,
    orderNumber: "0000000123",
    status: "In Transit",
    paymentTime: "16-02-2025, 11:30pm",
    paymentMethod: "Card",
    totalAmount: 1200.0,
  };

  const [modalVisible, setModalVisible] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");

  const handleReview = () => {
    setModalVisible(true);
  };

  const handleOrderReceived = () => {
    alert(`Order Received!✅`);
    router.back();
  };

  const handleSubmitReview = () => {
    alert(`Review submitted! Rating: ${rating}, Feedback: ${feedback}`);
    setModalVisible(false);
    router.back();
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <View className="flex-1 bg-white">
        <Header showBackButton={true} />

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="px-8 py-5 w-full items-center">
            <Text className="font-semibold text-3xl border-b-4 pb-2 border-[#FFE300] mt-5 mb-5">
              Order Preview
            </Text>

            <View className="w-full flex flex-col items-center mt-5">
              <View className="w-full mt-0">
                <Image
                  style={{
                    width: 200,
                    height: 150,
                    borderRadius: 10,
                    backgroundColor: "gray",
                  }}
                  className="self-center mb-8"
                />

                <Image
                  style={{
                    width: 200,
                    height: 150,
                    borderRadius: 10,
                    backgroundColor: "gray",
                  }}
                  className="self-center mb-10"
                />

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
                  <View className="w-full h-0.5 bg-gray-200 my-2" />
                  <View className="mb-2 flex-row justify-between">
                    <Text className="text-gray-500 text-l">Quantity</Text>
                    <Text className="text-black text-l">{order.quantity}</Text>
                  </View>
                  <View className="mb-2 flex-row justify-between">
                    <Text className="text-black-500 text-xl font-bold">
                      Total Amount
                    </Text>
                    <Text className="text-black text-xl font-bold">
                      P{order.totalAmount.toFixed(2)}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
          <View className="h-28" />
        </ScrollView>

        <View className="absolute bottom-0 w-full px-8 pb-8 pt-4 mb-2 bg-white border-gray-200 flex-row justify-between">
          <TouchableOpacity
            onPress={handleReview}
            className="bg-white w-[48%] border border-[#FFE300] p-4 rounded-lg items-center"
          >
            <Text className="text-[#FFE300] text-center text-l font-bold">
              Rate
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleOrderReceived}
            className="w-[48%] border border-[#FFE300] p-4 rounded-lg items-center bg-[#FFE300]"
          >
            <Text className="text-white text-center text-l font-bold">
              Order Received
            </Text>
          </TouchableOpacity>
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <TouchableWithoutFeedback onPress={handleCloseModal}>
            <View className="flex-1 justify-end bg-black/50">
              <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
                <View className="bg-white rounded-t-3xl p-7 h-1/2">
                  <Text className="text-xl font-semibold text-center mb-8">
                    Give a Review
                  </Text>

                  <AirbnbRating
                    count={5}
                    defaultRating={0}
                    size={30}
                    onFinishRating={(value) => setRating(value)}
                    showRating={false}
                    selectedColor="#FFE300"
                  />

                  <Text className="text-gray-500 text-l mt-6 mb-4">
                    Detail Review
                  </Text>
                  <TextInput
                    className="border border-gray-300 rounded-lg p-4 h-32 text-l"
                    placeholder="Type your feedback here..."
                    multiline
                    value={feedback}
                    onChangeText={setFeedback}
                  />

                  <TouchableOpacity
                    onPress={handleSubmitReview}
                    className="bg-[#FFE300] p-4 rounded-lg items-center mt-10"
                  >
                    <Text className="text-white text-l font-bold">
                      Submit Review
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
    </KeyboardAvoidingView>
  );
}