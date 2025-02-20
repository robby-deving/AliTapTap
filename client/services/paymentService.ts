import axios from "axios";

interface PaymentMethodDetails {
  cardHolderName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}

// Replace localhost with your computer's IP address
const BASE_URL = 'http://192.168.137.1:5000';

export const createPaymentIntent = async (amount: number, description: string) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/v1/pay/payment-intents`, {
      amount,
      description,
    });

    return response.data;
  } catch (error: any) {
    console.error("Error creating payment intent:", error.response?.data || error.message);
    throw error;
  }
};

export const createPaymentMethod = async (cardDetails: PaymentMethodDetails) => {
  console.log('Creating payment method');

  try {
    const [month, year] = cardDetails.expiryDate.split('/');
    const response = await axios.post(`${BASE_URL}/api/v1/pay/payment-methods`, {
      type: 'card',
      details: {
        card_number: cardDetails.cardNumber.replace(/\s/g, ''),
        exp_month: parseInt(month),
        exp_year: parseInt('20' + year), // Add '20' prefix for full year
        cvc: cardDetails.cvv,
        billing: {
          name: cardDetails.cardHolderName,
          email: 'customer@example.com',
          phone: '09123456789',
          address: {
            line1: '123 Test Street',
            city: 'Test City',
            postal_code: '1234',
            country: 'PH'
          }
        }
      }
    });

    console.log('Payment method created:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Payment method creation failed:', error.response?.data || error.message);
    throw error;
  }
};

export const attachPaymentMethod = async (intentId: string, methodId: string) => {
  console.log('Attaching payment method:', { intentId, methodId });

  try {
    const response = await axios.put(
      `${BASE_URL}/api/v1/pay/payment-intents/${intentId}/payment-methods/${methodId}`
    );

    console.log('Payment method attached:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Payment method attachment failed:', error.response?.data || error.message);
    throw error;
  }
};
