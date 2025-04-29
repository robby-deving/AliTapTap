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
  StyleSheet,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Header } from "../components/Header";
import { AirbnbRating } from "react-native-ratings";
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";

const Base_Url = `https://api.alitaptap.me`;

export default function OrderPreview() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [modalVisible, setModalVisible] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");

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
    paymentTime: new Date().toLocaleString(),
    paymentMethod: "Card",
    totalAmount: parseFloat(params.price as string)
  };

  const handleOrderReceived = async () => {
    try {
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
    <View style={styles.container}>
      <Header/>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>
            Order Preview
          </Text>

          <View style={styles.designContainer}>
            <View style={styles.imagesContainer}>
              <Image
                source={{ uri: order.front_image }}
                style={styles.cardImage}
              />
              <Image
                source={{ uri: order.back_image }}
                style={styles.cardImage}
              />

              <View style={styles.orderDetails}>
                <View style={styles.detailRow}>
                  <Text style={styles.labelText}>Order Number</Text>
                  <Text style={styles.valueText}>{order.orderNumber}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.labelText}>Material</Text>
                  <Text style={styles.valueText}>{order.material}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.labelText}>Status</Text>
                  <Text style={styles.valueText}>{order.status}</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.detailRow}>
                  <Text style={styles.labelText}>Quantity</Text>
                  <Text style={styles.valueText}>{order.quantity}</Text>
                </View>
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Total Amount</Text>
                  <Text style={styles.totalAmount}>P{order.price.toFixed(2)}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      <View style={styles.bottomContainer}>
        {order.status == 'Delivered' && (
          <View style={styles.buttonRow}>
            <TouchableOpacity
              onPress={handleReview}
              style={styles.actionButton}
            >
              <Text style={styles.actionButtonText}>
                Rate
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={handleOrderReceived}
              style={styles.actionButton}
            >
              <Text style={styles.actionButtonText}>
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
          style={styles.modalContainer}
        >
          <TouchableWithoutFeedback onPress={handleCloseModal}>
            <View style={styles.modalOverlay}>
              <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>
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

                  <Text style={styles.feedbackLabel}>
                    Detail Review
                  </Text>
                  <TextInput
                    style={styles.feedbackInput}
                    placeholder="Type your feedback here..."
                    multiline
                    value={feedback}
                    onChangeText={setFeedback}
                  />

                  <TouchableOpacity
                    onPress={handleSubmitReview}
                    style={styles.submitButton}
                  >
                    <Text style={styles.submitButtonText}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  scrollView: {
    flex: 1
  },
  contentContainer: {
    paddingHorizontal: 32,
    paddingVertical: 20,
    width: '100%',
    alignItems: 'center'
  },
  title: {
    fontWeight: '600',
    fontSize: 30,
    borderBottomWidth: 4,
    borderBottomColor: '#FFE300',
    paddingBottom: 8,
    marginTop: 20,
    marginBottom: 16
  },
  designContainer: {
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 20
  },
  imagesContainer: {
    width: '100%',
    marginTop: 24
  },
  cardImage: {
    width: 200,
    height: 150,
    borderRadius: 10,
    alignSelf: 'center',
    marginBottom: 32
  },
  orderDetails: {
    width: '100%',
    marginTop: 16
  },
  detailRow: {
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  labelText: {
    color: '#6B7280',
    fontSize: 20
  },
  valueText: {
    color: 'black',
    fontSize: 20
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 8
  },
  totalRow: {
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  totalLabel: {
    color: 'black',
    fontSize: 24,
    fontWeight: '700'
  },
  totalAmount: {
    color: 'black',
    fontSize: 24,
    fontWeight: '700'
  },
  bottomSpacer: {
    height: 128
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    paddingHorizontal: 32,
    paddingBottom: 32,
    paddingTop: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB'
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16
  },
  actionButton: {
    backgroundColor: 'white',
    width: '48%',
    borderWidth: 1,
    borderColor: '#FFE300',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center'
  },
  actionButtonText: {
    color: '#FFE300',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '700'
  },
  modalContainer: {
    flex: 1
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 28
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 32
  },
  feedbackLabel: {
    color: '#6B7280',
    fontSize: 20,
    marginTop: 24,
    marginBottom: 16
  },
  feedbackInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 16,
    height: 128,
    fontSize: 20
  },
  submitButton: {
    backgroundColor: '#FFE300',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 40
  },
  submitButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '700'
  }
});