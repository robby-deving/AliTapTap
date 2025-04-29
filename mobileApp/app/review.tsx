import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, Modal, ActivityIndicator, StyleSheet } from 'react-native';
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
      <View style={styles.container}>
        <Header />
        <View style={styles.webviewContainer}>
          <WebView 
            source={{ uri: redirectUrl }}
            style={styles.webview}
            startInLoadingState={true}
            renderLoading={() => (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Loading payment page...</Text>
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
    <View style={styles.container}>
      <Header />

      <View style={styles.mainContent}>
        <Text style={styles.title}>
          Review Payment
        </Text>
        
        <StepperComponent currentStep="review" />

        <View style={styles.detailsContainer}>
          <Text style={styles.sectionTitle}>Payment Details</Text>
          {parsedPaymentData?.paymentMethod === 'card' ? (
            <>
              <Text>Card Holder: {parsedPaymentData?.cardDetails?.cardHolderName}</Text>
              <Text>Card Number: •••• •••• •••• {parsedPaymentData?.cardDetails?.cardNumber.slice(-4)}</Text>
              <Text>Expiry Date: {parsedPaymentData?.cardDetails?.expiryDate}</Text>
            </>
          ) : (
            <Text style={styles.paymentMethod}>
              Payment Method: {parsedPaymentData?.paymentMethod}
            </Text>
          )}

          <View style={styles.orderSummary}>
            <Text style={styles.sectionTitle}>Order Summary</Text>
            <View style={styles.summaryContent}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text>₱ {totalAmount.toFixed(2)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Shipping Fee</Text>
                <Text>₱ {shipping_cost.toFixed(2)}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.summaryRow}>
                <Text style={styles.totalLabel}>Total Amount</Text>
                <Text style={styles.totalAmount}>₱ {totalAmount.toFixed(2)}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[styles.checkoutButton, isLoading && styles.checkoutButtonDisabled]}
          onPress={handleCheckout}
          disabled={isLoading}
        >
          <Text style={styles.checkoutButtonText}>
            Checkout
          </Text>
        </TouchableOpacity>

        <Modal
          transparent={true}
          animationType="fade"
          visible={isLoading}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <ActivityIndicator size="large" color="#FDCB07" />
              <Text style={styles.modalText}>Processing Payment...</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  webviewContainer: {
    flex: 1
  },
  webview: {
    flex: 1
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadingText: {
    color: '#4B5563'
  },
  mainContent: {
    padding: 40,
    width: '100%',
    flex: 1
  },
  title: {
    fontWeight: '600',
    fontSize: 30,
    borderBottomWidth: 4,
    borderBottomColor: '#FFE300',
    paddingBottom: 8
  },
  detailsContainer: {
    marginTop: 32
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16
  },
  paymentMethod: {
    textTransform: 'capitalize'
  },
  orderSummary: {
    marginTop: 24
  },
  summaryContent: {
    gap: 8
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  summaryLabel: {
    color: '#4B5563'
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 8
  },
  totalLabel: {
    fontWeight: '600'
  },
  totalAmount: {
    fontWeight: '600'
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 40,
    backgroundColor: 'white'
  },
  checkoutButton: {
    backgroundColor: '#FDCB07',
    width: '100%',
    padding: 16,
    borderRadius: 8
  },
  checkoutButtonDisabled: {
    opacity: 0.5
  },
  checkoutButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600'
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 8,
    alignItems: 'center'
  },
  modalText: {
    marginTop: 8,
    color: '#4B5563'
  }
});