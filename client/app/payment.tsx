import React, { useState } from 'react';
import { 
  Text, 
  View, 
  Image, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  ScrollView, 
  Platform 
} from 'react-native';
import { useRouter } from 'expo-router';
import InputField from '../components/InputField';
import StepperComponent from '../components/StepperComponent';
import PaymentMethodSelect from '../components/PaymentMethodSelect';
import { Header } from '../components/Header';
import { updateOrderDetails } from '../services/helperFunctions';

export default function Payment() {
  const [cardHolderName, setCardHolderName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const router = useRouter();

  const [paymentMethod, setPaymentMethod] = useState('');

  const handleContinue = () => {
    updateOrderDetails('payment_method', paymentMethod);

    if (paymentMethod === 'card') {
      // Validate card inputs
      if (!cardHolderName || !cardNumber || !expiryDate || !cvv) {
        alert('Please fill in all card details');
        return;
      }
    }

    // Prepare payment data
    const paymentData = {
      paymentMethod,
      cardDetails: paymentMethod === 'card' ? {
        cardHolderName,
        cardNumber,
        expiryDate,
        cvv
      } : null
    };

    // Navigate to review with payment data
    router.push({
      pathname: '/review',
      params: {
        paymentData: JSON.stringify(paymentData)
      }
    });
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <View className="flex-1 relative bg-white">
        {/* Header */}
        <Header />


        {/* Scrollable Content */}
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="p-10 w-full items-center">
            <View className='flex flex-row justify-between'>
              <Text className="font-semibold text-3xl border-b-4 pb-2 border-[#FFE300]">
                Checkout
              </Text>
            </View>
            
            <View className='w-full flex flex-col items-center mt-5'>
              <StepperComponent currentStep="payment" />
              <Text className='mt-5 mb-5 text-[#696969]'>Select Payment Method</Text>

              <View className="w-full mb-4">
                <PaymentMethodSelect
                  selectedMethod={paymentMethod}
                  onSelect={setPaymentMethod}
                />
              </View>

              {paymentMethod === 'card' && (
                <View className="w-full">
                  <InputField 
                    type="text"
                    label="Card Holder Name"
                    placeholder="Enter your name"
                    value={cardHolderName}
                    onChangeText={setCardHolderName}
                  />
                  <InputField 
                    type="card"
                    label="Card Number"
                    placeholder="0000 0000 0000 0000"
                    value={cardNumber}
                    onChangeText={setCardNumber}
                    maxLength={19} // 16 digits + 3 spaces
                  />
                  <View className="flex flex-row space-x-4 gap-5">
                    <View className="flex-1">
                      <InputField
                        type="date"
                        label="Expiry Date"
                        placeholder="MM/YY"
                        value={expiryDate}
                        onChangeText={setExpiryDate}
                        maxLength={5}
                      />
                    </View>
                    <View className="flex-1">
                      <InputField 
                        type="number"
                        label="CVV"
                        placeholder="000"
                        value={cvv}
                        onChangeText={setCvv}
                        maxLength={3}
                      />
                    </View>
                  </View>
                </View>
              )}
            </View>
          </View>
          
          {/* Add padding at bottom to ensure content is scrollable above button */}
          <View className="h-32" />
        </ScrollView>

        {/* Fixed Bottom Button */}
        <View className="absolute bottom-0 w-full p-10  bg-white">
        <TouchableOpacity 
          className={`w-full p-4 rounded ${
            paymentMethod ? 'bg-[#FDCB07] opacity-100' : 'bg-[#FDCB07] opacity-50'
          }`}
          onPress={handleContinue}
          disabled={!paymentMethod}
        >
          <Text className="text-white text-center text-xl font-semibold">
            Continue to Review
          </Text>
        </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
