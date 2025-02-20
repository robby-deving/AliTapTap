import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import StepperComponent from '../components/StepperComponent';
import { Header } from '../components/Header';
import { createPaymentIntent, createPaymentMethod, attachPaymentMethod } from '../services/paymentService';

interface PaymentData {
  paymentMethod: string;
  cardDetails: PaymentMethodDetails;
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
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [paymentMethodId, setPaymentMethodId] = useState<string | null>(null);

  const handlePaymentIntent = async () => {
    try {
      setIsLoading(true);
      const intentData = await createPaymentIntent(10000,'test');
      if (!intentData.success) throw new Error('Failed to create payment intent');
      
      setPaymentIntentId(intentData.data.paymentIntentId);
      Alert.alert('Success', `Payment Intent Created: ${intentData.data.paymentIntentId}`);
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to create payment intent');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentMethod = async () => {
    try {
      if (!parsedPaymentData?.cardDetails) {
        throw new Error('No payment details found');
      }
      setIsLoading(true);
      const methodData = await createPaymentMethod(parsedPaymentData.cardDetails);
      if (!methodData.success) throw new Error('Failed to create payment method');
      
      setPaymentMethodId(methodData.data.id);
      Alert.alert('Success', `Payment Method Created: ${methodData.data.id}`);
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to create payment method');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAttachPayment = async () => {
    try {
      if (!paymentIntentId || !paymentMethodId) {
        throw new Error('Missing payment intent or method ID');
      }
      setIsLoading(true);
      const attachData = await attachPaymentMethod(paymentIntentId, paymentMethodId);
      if (!attachData.success) throw new Error('Failed to attach payment method');
      
      Alert.alert('Success', 'Payment method attached successfully!');
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to attach payment method');
    } finally {
      setIsLoading(false);
    }
  };

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
          <Text>Card Holder: {parsedPaymentData?.cardDetails?.cardHolderName}</Text>
          <Text>Card Number: •••• •••• •••• {parsedPaymentData?.cardDetails?.cardNumber.slice(-4)}</Text>
          <Text>Expiry Date: {parsedPaymentData?.cardDetails?.expiryDate}</Text>
        </View>
      </View>

      <View className="absolute bottom-0 w-full p-10 bg-white space-y-4">
        <TouchableOpacity
          className={`bg-[#FDCB07] w-full p-4 rounded ${isLoading ? 'opacity-50' : ''}`}
          onPress={handlePaymentIntent}
          disabled={isLoading}
        >
          <Text className="text-white text-center text-xl font-semibold">
            {isLoading ? 'Creating...' : 'Create Payment Intent'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={`bg-[#FDCB07] w-full p-4 rounded ${isLoading ? 'opacity-50' : ''}`}
          onPress={handlePaymentMethod}
          disabled={isLoading}
        >
          <Text className="text-white text-center text-xl font-semibold">
            {isLoading ? 'Creating...' : 'Create Payment Method'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={`bg-[#FDCB07] w-full p-4 rounded ${isLoading ? 'opacity-50' : ''}`}
          onPress={handleAttachPayment}
          disabled={isLoading || !paymentIntentId || !paymentMethodId}
        >
          <Text className="text-white text-center text-xl font-semibold">
            {isLoading ? 'Attaching...' : 'Attach Payment Method'}
          </Text>
        </TouchableOpacity>

        {paymentIntentId && (
          <Text className="text-xs text-gray-600">Intent ID: {paymentIntentId}</Text>
        )}
        {paymentMethodId && (
          <Text className="text-xs text-gray-600">Method ID: {paymentMethodId}</Text>
        )}
      </View>
    </View>
  );
}