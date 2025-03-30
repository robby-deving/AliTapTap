import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, Modal, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import StepperComponent from '../components/StepperComponent';
import { Header } from '../components/Header';
import { createPaymentIntent, createPaymentMethod, attachPaymentMethod , retrievePaymentIntent } from '../services/paymentService';
import { WebView } from 'react-native-webview';
import { uploadImageToCloudinary, updateOrderDetails, saveOrderAndTransaction,   } from '@/services/helperFunctions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FailedPaymentModal from '../components/FailedPaymentModal';


interface PaymentData {
  paymentMethod: 'card' | 'gcash' | 'grab_pay';
  cardDetails?: PaymentMethodDetails;
}

interface PaymentMethodDetails {
  cardHolderName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}

export default function Review() {
  const router = useRouter();
  const { paymentData } = useLocalSearchParams();
  const parsedPaymentData: PaymentData | null = paymentData ? JSON.parse(paymentData as string) : null;
  const [isLoading, setIsLoading] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);
  const [cardImage, setCardImage] = useState({ front: '', back: '' });
  const [paymentIntentIds, setPaymentIntentId] = useState<string | ''>('');
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [shipping_cost, setShippingCost] = useState<number>(0);
  const [isFailedModalVisible, setIsFailedModalVisible] = useState(false);


  useEffect(() => {
    const fetchCardImage = async () => {
      try {
        const image = await AsyncStorage.getItem('card_image');
        if (image !== null) {
          console.log('Card Image:', image); // Log the content of card_image
          setCardImage(JSON.parse(image));
        }
      } catch (error) {
        console.error('Failed to load image from AsyncStorage', error);
      }
    };
// later-on update with description or name of the product
    const fetchTotalAmount = async () => {
      try {
        const orderDetails = await AsyncStorage.getItem('orderDetails');
        if (orderDetails) {
          const parsedDetails = JSON.parse(orderDetails);
          const total = parsedDetails.total_price || 0;
          const toPay = total + parsedDetails.shipping_method.price;
          setShippingCost(parsedDetails.shipping_method.price);
          setTotalAmount(toPay);
          console.log('Total Amount:', toPay);
        }
      } catch (error) {
        console.error('Failed to fetch total amount:', error);
      }
    };

    fetchCardImage();
    fetchTotalAmount();
  }, []);

  const logAsyncStorageContent = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const result = await AsyncStorage.multiGet(keys);
      result.forEach(([key, value]) => {
        console.log(`AsyncStorage ${key}: ${value}`);
      });
    } catch (error) {
      console.error('Failed to log AsyncStorage content', error);
    }
  };

  const checkPayment = async () => {
    try {
    const paymentIntent = await retrievePaymentIntent(paymentIntentIds);
      return paymentIntent.data.attributes.status;
    } catch (error) {
      console.error('Error retrieving payment intent:', error);
    }
  }


  const handleUpload = async () => {
    setIsLoading(true);
    if (cardImage.front) {
      const frontImageUrl = await uploadImageToCloudinary(cardImage.front, paymentIntentIds);
      console.log('Front Image URL:', frontImageUrl);
      updateOrderDetails('front_image', frontImageUrl);
      console.log('saved url: ', frontImageUrl);
      

    }
    if (cardImage.back) {
      const backImageUrl = await uploadImageToCloudinary(cardImage.back,paymentIntentIds);
      console.log('Back Image URL:', backImageUrl);
      updateOrderDetails('back_image', backImageUrl);
      console.log('saved back url: ', backImageUrl);
    }

    console.log('Order Details Updated' ); 
    await logAsyncStorageContent();
    
    setIsLoading(false);
  };

  const handleCheckout = async () => {
    try {
      setIsLoading(true);

      // Step 1: Create Payment Intent with totalAmount instead of hardcoded value
      const intentData = await createPaymentIntent(totalAmount, 'test');
      if (!intentData.success) throw new Error('Failed to create payment intent');
      
      const paymentIntentId = intentData.data.paymentIntentId;
      setPaymentIntentId(paymentIntentId);
      console.log('Payment Intent Created:', paymentIntentId);

      // Step 2: Create Payment Method
      let methodData;
      if (parsedPaymentData?.paymentMethod === 'card') {
        if (!parsedPaymentData?.cardDetails) {
          throw new Error('No card details found');
        }
        methodData = await createPaymentMethod({
          type: 'card',
          cardDetails: parsedPaymentData.cardDetails
        });
      } else if (parsedPaymentData?.paymentMethod) {
        methodData = await createPaymentMethod({
          type: parsedPaymentData.paymentMethod
        });
      } else {
        throw new Error('Invalid payment method');
      }

      if (!methodData.success) throw new Error('Failed to create payment method');
      
      const paymentMethodId = methodData.data.id;
      console.log('Payment Method Created:', paymentMethodId);

      // Step 3: Attach Payment Method to Intent
      const result = await attachPaymentMethod(paymentIntentId, paymentMethodId);
      
      if (result.data?.attributes?.status === 'awaiting_next_action' && 
        result.data?.attributes?.next_action?.redirect?.url) {
      // For e-wallets: redirect to payment page
      setRedirectUrl(result.data.attributes.next_action.redirect.url);
    } else if (result.data?.attributes?.status === 'succeeded') {

      await handleUpload();
      await saveOrderAndTransaction();

      router.push('/success');
    } else {
      throw new Error('Payment failed or invalid status received');
    }

    } catch (error) {
      Alert.alert('Error', error.message || 'Payment process failed');
    } finally {
      setIsLoading(false);
    }
  };

  if (redirectUrl) {
    return (
      <View className="flex-1 bg-white">
        <Header />
        <View className="flex-1">
          <WebView 
            source={{ uri: redirectUrl }}
            style={{ flex: 1 }}
            startInLoadingState={true}
            renderLoading={() => (
              <View className="absolute inset-0 bg-white justify-center items-center">
                <Text className="text-gray-600">Loading payment page...</Text>
              </View>
            )}

            onNavigationStateChange={async (navState) => {
              if (navState.url.includes('success')) {
                setRedirectUrl(null);
                setIsFailedModalVisible(false);
                const status = await checkPayment();
                if (status === 'awaiting_next_action') {
                  setIsFailedModalVisible(true);
                  return;
                }
                // Only handle success navigation, don't check payment status here
                await handleUpload(); 
                await saveOrderAndTransaction();
                setRedirectUrl(null);
                router.push('/success');
              } else if (navState.url.includes('cancel')) {
                setRedirectUrl(null);
                Alert.alert('Payment Cancelled', 'Your payment was cancelled');
              }
            }}
            onError={() => {
              Alert.alert(
                'Error',
                'Failed to load payment page',
                [{ text: 'OK', onPress: () => setRedirectUrl(null) }]
              );
            }}
          />
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 relative bg-white">
      <Header />

      <View className="p-10 w-full flex-1">
        <Text className="font-semibold text-3xl border-b-4 pb-2 border-[#FFE300]">
          Review Payment
        </Text>
        
        <StepperComponent currentStep="review" />

        <View className="mt-8">
            <Text className="text-lg font-semibold mb-4">Payment Details</Text>
            {parsedPaymentData?.paymentMethod === 'card' ? (
              <>
                <Text>Card Holder: {parsedPaymentData?.cardDetails?.cardHolderName}</Text>
                <Text>Card Number: •••• •••• •••• {parsedPaymentData?.cardDetails?.cardNumber.slice(-4)}</Text>
                <Text>Expiry Date: {parsedPaymentData?.cardDetails?.expiryDate}</Text>
              </>
            ) : (
              <Text className="capitalize">Payment Method: {parsedPaymentData?.paymentMethod}</Text>
            )}

            {/* Add Order Summary Section */}
            <View className="mt-6">
              <Text className="text-lg font-semibold mb-4">Order Summary</Text>
              <View className="space-y-2">
                <View className="flex-row justify-between">
                  <Text className="text-gray-600">Subtotal</Text>
                  <Text>₱ {totalAmount.toFixed(2)}</Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-gray-600">Shipping Fee</Text>
                  <Text>₱ {shipping_cost.toFixed(2)}</Text>
                </View>
                <View className="h-[1px] bg-gray-200 my-2" />
                <View className="flex-row justify-between">
                  <Text className="font-semibold">Total Amount</Text>
                  <Text className="font-semibold">₱ {totalAmount.toFixed(2)}</Text>
                </View>
              </View>
            </View>
          </View>
      </View>

      <View className="absolute bottom-0 w-full p-10 bg-white">
        <TouchableOpacity
          className={`bg-[#FDCB07] w-full p-4 rounded ${isLoading ? 'opacity-50' : ''}`}
          onPress={handleCheckout}
          disabled={isLoading}
        >
          <Text className="text-white text-center text-xl font-semibold">
            Checkout
          </Text>
        </TouchableOpacity>

        <Modal
          transparent={true}
          animationType="fade"
          visible={isLoading}
        >
          <View className="flex-1 justify-center items-center bg-black/50 ">
            <View className="bg-white p-6 rounded-lg items-center">
              <ActivityIndicator size="large" color="#FDCB07" />
              <Text className="mt-2 text-gray-600">Processing Payment...</Text>
            </View>
          </View>
        </Modal>
      </View>
      <FailedPaymentModal 
        isVisible={isFailedModalVisible}
        onTryAgain={() => {
          setIsFailedModalVisible(false);
          router.push('/payment');
        }}
        onCancel={() => {
          setIsFailedModalVisible(false);
          router.push('/productcatalogue');
        }}
      />
    </View>
  );
}