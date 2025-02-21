import axios from "axios";

interface CardDetails {
  cardHolderName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}

interface PaymentMethodDetails {
  type: 'card' | 'gcash' | 'grab_pay';
  cardDetails?: CardDetails;
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

export const createPaymentMethod = async (paymentDetails: PaymentMethodDetails) => {
  console.log('Creating payment method');

  try {
    let requestBody: any = { type: paymentDetails.type };
console.log('paymentDetails',paymentDetails);

    if (paymentDetails.type === 'card' && paymentDetails.cardDetails) {
      const [month, year] = paymentDetails.cardDetails.expiryDate.split('/');
      requestBody.details = {
        card_number: paymentDetails.cardDetails.cardNumber.replace(/\s/g, ''),
        exp_month: parseInt(month),
        exp_year: parseInt('20' + year),
        cvc: paymentDetails.cardDetails.cvv,
        billing: {
          name: paymentDetails.cardDetails.cardHolderName,
          email: 'customer@example.com',
          phone: '09123456789',
          address: {
            line1: '123 Test Street',
            city: 'Test City',
            postal_code: '1234',
            country: 'PH'
          }
        }
      };
    }
console.log('requestBody',requestBody);

    const response = await axios.post(`${BASE_URL}/api/v1/pay/payment-methods`, requestBody);

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
