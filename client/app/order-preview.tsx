import React, {useState} from "react";
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
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";

const Base_Url = 'http://192.168.137.1:4000';

export default function OrderPreview() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [modalVisible, setModalVisible] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");

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
    design_id: params.design_id as string,
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

  const handleReview = () => {
    setModalVisible(true);
  };

  const handleSubmitReview = async () => {
    try {
      const userdata = await AsyncStorage.getItem('userData');
      const userDetails = userdata ? JSON.parse(userdata) : {};


      
      if (!userDetails._id) {
        alert("Please login to submit a review");
        return;
      }
  
      if (!rating) {
        alert("Please select a rating");
        return;
      }
  
      const reviewData = {
        customer_id: userDetails._id,
        design_id: order.design_id,
        order_id: order.id,
        ratings: rating,
        review_text: feedback
      };
  
      const response = await axios.post(`${Base_Url}/api/v1/review/create-review`, reviewData);
      const responseData = response.data;
      console.log('Review response:', responseData);      
      if (response.status === 201 || response.status === 200) {
        alert("Review submitted successfully!");
        setModalVisible(false);
        setRating(0);
        setFeedback("");
        router.back();
      } else {
        throw new Error('Failed to submit review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert("Failed to submit review. Please try again.");
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  return (
    <View className="flex-1 bg-white">
      <Header/>

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
      <View className="absolute bottom-0 w-full px-8 pb-8 pt-4 bg-white border-t border-gray-200">
      {order.status == 'Delivered' && (
        <View className="flex-row justify-between mb-4">
          
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
              className="bg-white w-[48%] border border-[#FFE300] p-4 rounded-lg items-center"
            >
              <Text className="text-[#FFE300] text-center text-l font-bold">
                Order Received
              </Text>
            </TouchableOpacity>
        </View>
          )}

      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <TouchableWithoutFeedback onPress={handleCloseModal}>
            <View className="flex-1 justify-end bg-black/50">
              <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
                <View className="bg-white rounded-t-3xl p-7">
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
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}