import React, { useState } from 'react';
import { 
  Text, 
  View, 
  Image, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  ScrollView, 
  Platform,
  StyleSheet 
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
      style={styles.container}
    >
      <View style={styles.mainContainer}>
        <Header />

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.contentContainer}>
            <View style={styles.headerContainer}>
              <Text style={styles.title}>
                Checkout
              </Text>
            </View>
            
            <View style={styles.stepperContainer}>
              <StepperComponent currentStep="payment" />
              <Text style={styles.stepperText}>Select Payment Method</Text>

              <View style={styles.methodContainer}>
                <PaymentMethodSelect
                  selectedMethod={paymentMethod}
                  onSelect={setPaymentMethod}
                />
              </View>

              {paymentMethod === 'card' && (
                <View style={styles.cardFormContainer}>
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
                    maxLength={19}
                  />
                  <View style={styles.cardDetailsRow}>
                    <View style={styles.cardDetailField}>
                      <InputField
                        type="date"
                        label="Expiry Date"
                        placeholder="MM/YY"
                        value={expiryDate}
                        onChangeText={setExpiryDate}
                        maxLength={5}
                      />
                    </View>
                    <View style={styles.cardDetailField}>
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
          
          <View style={styles.bottomSpacer} />
        </ScrollView>

        <View style={styles.bottomButtonContainer}>
          <TouchableOpacity 
            style={[
              styles.continueButton,
              !paymentMethod && styles.continueButtonDisabled
            ]}
            onPress={handleContinue}
            disabled={!paymentMethod}
          >
            <Text style={styles.continueButtonText}>
              Continue to Review
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  mainContainer: {
    flex: 1,
    backgroundColor: 'white',
    position: 'relative'
  },
  scrollView: {
    flex: 1
  },
  contentContainer: {
    padding: 40,
    width: '100%',
    alignItems: 'center'
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  title: {
    fontWeight: '600',
    fontSize: 30,
    borderBottomWidth: 4,
    borderBottomColor: '#FFE300',
    paddingBottom: 8
  },
  stepperContainer: {
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 20
  },
  stepperText: {
    marginTop: 20,
    marginBottom: 20,
    color: '#696969'
  },
  methodContainer: {
    width: '100%',
    marginBottom: 16
  },
  cardFormContainer: {
    width: '100%'
  },
  cardDetailsRow: {
    flexDirection: 'row',
    gap: 20
  },
  cardDetailField: {
    flex: 1
  },
  bottomSpacer: {
    height: 128
  },
  bottomButtonContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 40,
    backgroundColor: 'white'
  },
  continueButton: {
    width: '100%',
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#FDCB07'
  },
  continueButtonDisabled: {
    opacity: 0.5
  },
  continueButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600'
  }
});
