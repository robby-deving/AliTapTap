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

export default function Payment() {
  const [cardHolderName, setCardHolderName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const router = useRouter();

  const [paymentMethod, setPaymentMethod] = useState('');

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <View className="flex-1 relative bg-white">
        {/* Header */}
        <View className="bg-[#231F20] w-full p-4 flex flex-row items-center pt-20">
        <TouchableOpacity onPress={() => router.back()}>
          <Image
            source={require('../assets/images/backBTN.png')}
            style={{ width: 20, height: 20 }}
            className="mt-2 mr-[155]"
          />
        </TouchableOpacity>
        <Image
          source={require('../assets/images/logo.png')}
          style={{ width: 27.61, height: 38 }}
        />
      </View>

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
        <View className="absolute bottom-0 w-full p-10 mb-2 bg-white">
          <TouchableOpacity className="bg-[#FDCB07] w-full p-4 rounded">
            <Text className="text-white text-center text-xl font-semibold">
              Continue
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
