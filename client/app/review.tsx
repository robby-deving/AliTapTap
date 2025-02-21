import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import StepperComponent from '../components/StepperComponent';
import { Header } from '../components/Header';
import { createPaymentIntent, createPaymentMethod, attachPaymentMethod } from '../services/paymentService';
import { WebView } from 'react-native-webview';

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

  const handleCheckout = async () => {
    try {
      setIsLoading(true);

      // Step 1: Create Payment Intent
      const intentData = await createPaymentIntent(10000, 'test');
      if (!intentData.success) throw new Error('Failed to create payment intent');
      
      const paymentIntentId = intentData.data.paymentIntentId;
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
      // For cards: direct success
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
            onNavigationStateChange={(navState) => {
              // Handle return URL from payment
              if (navState.url.includes('success')) {
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
        </View>
      </View>

      <View className="absolute bottom-0 w-full p-10 bg-white">
        <TouchableOpacity
          className={`bg-[#FDCB07] w-full p-4 rounded ${isLoading ? 'opacity-50' : ''}`}
          onPress={handleCheckout}
          disabled={isLoading}
        >
          <Text className="text-white text-center text-xl font-semibold">
            {isLoading ? 'Processing Payment...' : 'Checkout'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}