import AsyncStorage from '@react-native-async-storage/async-storage';
import { captureRef } from 'react-native-view-shot';
import axios from 'axios';
import { ViewStyle } from 'react-native';

// Define interface for order details
interface OrderDetails {
  design_id: string;
  front_image: string;
  back_image: string;
  material: string;
  quantity: number;
  payment_method: string;
}

// Define interface for order data
interface OrderData {
  customer_id: string;
  design_id: string;
  front_image: string;
  back_image: string;
  details: {
    material: string;
  };
  quantity: number;
  order_status: string;
  address_id: number;
}

// Define interface for transaction data
interface TransactionData {
  order_id: string;
  customer_id: string;
  merchandise_subtotal: number;
  shipping_subtotal: number;
  total_amount: number;
  payment_method: string;
  status: string;
}

const Base_Url = 'http://192.168.137.1:4000';

const saveCardAsImage = async (cardRef: React.RefObject<ViewStyle>, side: 'front' | 'back'): Promise<void> => {
  try {
    const uri = await captureRef(cardRef, {
      format: 'png',
      quality: 1,
    });

    const existingCardImageString = await AsyncStorage.getItem('card_image');
    const existingCardImage = existingCardImageString ? JSON.parse(existingCardImageString) : {};

    const updatedCardImage = {
      ...existingCardImage,
      [side]: uri,
    };

    await AsyncStorage.setItem('card_image', JSON.stringify(updatedCardImage));
    console.log(`Card image (${side}) saved successfully:`, uri);
  } catch (error) {
    console.error(`Error saving card image (${side}):`, error);
  }
};

const uploadImageToCloudinary = async (imageUri: string, paymentIntentId: string): Promise<string | null> => {
  const formData = new FormData();
  formData.append('file', {
    uri: imageUri,
    type: 'image/jpeg',
    name: `${paymentIntentId}.jpg`,
  } as any);
  formData.append('upload_preset', 'robert');

  try {
    const response = await axios.post('https://api.cloudinary.com/v1_1/ddye8veua/image/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log('Cloudinary response:', response.data);
    return response.data.secure_url;
  } catch (error) {
    console.error('Failed to upload image to Cloudinary', error);
    return null;
  }
};

const updateOrderDetails = async (attribute: keyof OrderDetails, value: any): Promise<void> => {
  try {
    const orderDetailsString = await AsyncStorage.getItem('orderDetails');
    let orderDetails: OrderDetails = orderDetailsString ? JSON.parse(orderDetailsString) : {};

    orderDetails[attribute] = value;

    await AsyncStorage.setItem('orderDetails', JSON.stringify(orderDetails));
    console.log('Order details updated successfully:', orderDetails);
  } catch (error) {
    console.error('Error updating order details:', error);
  }
};

const orderSummary = async (attribute: string, value: any): Promise<void> => {
  try {
    const orderSummaryString = await AsyncStorage.getItem('orderSummary');
    let orderSummary = orderSummaryString ? JSON.parse(orderSummaryString) : {};

    orderSummary[attribute] = value;

    await AsyncStorage.setItem('orderSummary', JSON.stringify(orderSummary));
    console.log('Order summary updated successfully:', orderSummary);
  } catch (error) {
    console.error('Error updating order details:', error);
  }
};

const saveOrderAndTransaction = async () => {
  try {
    const orderDetailsString = await AsyncStorage.getItem('orderDetails');
    const orderDetails: OrderDetails = orderDetailsString ? JSON.parse(orderDetailsString) : {};

    console.log('Order details:', orderDetails);

    const orderData: OrderData = {
      customer_id: "67caa10d3e7138c6cf4d6101",
      design_id: orderDetails.design_id ,
      front_image: orderDetails.front_image ,
      back_image: orderDetails.back_image ,
      details: {
        material: orderDetails.material,
      },
      quantity: orderDetails.quantity,
      order_status: "Pending",
      address_id: 1
    };

    // Create order with better error handling
    let orderResponse;
    try {
      orderResponse = await axios.post(`${Base_Url}/api/v1/orders/create`, orderData);
      if (!orderResponse.data || !orderResponse.data.data) {
        throw new Error('Invalid order response format');
      }
    } catch (orderError) {
      if (orderError.response) {
        throw new Error(`Order creation failed: ${orderError.response.data.message || 'Unknown error'}`);
      }
      throw new Error(`Network error: ${orderError.message}`);
    }

    const savedOrder = orderResponse.data.data;

    // Validate saved order has required fields
    if (!savedOrder._id || !savedOrder.total_price) {
      throw new Error('Invalid order data received from server');
    }

    console.log('Order saved successfully:', savedOrder);

    const transactionData: TransactionData = {
      order_id: savedOrder._id,
      customer_id: orderData.customer_id,
      merchandise_subtotal: savedOrder.total_price,
      shipping_subtotal: 150, // change later-on when shipping is implemented
      total_amount: savedOrder.total_price + 150,
      payment_method: orderDetails.payment_method || 'cash',
      status: "Completed"
    };

    console.log('Transaction data:', transactionData);

    // Create transaction with better error handling
    let transactionResponse;
    try {
      transactionResponse = await axios.post(`${Base_Url}/api/v1/transactions/create`, transactionData);
      if (!transactionResponse.data || !transactionResponse.data.data) {
        throw new Error('Invalid transaction response format');
      }
    } catch (transactionError) {
      if (transactionError.response) {
        throw new Error(`Transaction creation failed: ${transactionError.response.data.message || 'Unknown error'}`);
      }
      throw new Error(`Network error: ${transactionError.message}`);
    }

    const savedTransaction = transactionResponse.data.data;
    console.log('Transaction saved successfully:', savedTransaction);

    await orderSummary('transaction_number', savedTransaction.transaction_number);
    await orderSummary('shipping_subtotal', savedTransaction.shipping_subtotal);
    await orderSummary('total_amount', savedTransaction.total_amount);
    await orderSummary('payment_method', savedTransaction.payment_method);
    await orderSummary('quantity', orderDetails.quantity);
    await orderSummary('created_at', savedTransaction.created_at);



    // Clear only specific AsyncStorage items after successful save
    try {
      await Promise.all([
        AsyncStorage.removeItem('orderDetails'),
        AsyncStorage.removeItem('card_image'),
        AsyncStorage.removeItem('frontSavedItems'),
        AsyncStorage.removeItem('backSavedItems')
        // Removed orderSummary from the clear list to preserve it for the success screen
      ]);
      console.log('Selected AsyncStorage items cleared successfully');
    } catch (clearError) {
      console.warn('Failed to clear AsyncStorage items:', clearError);
    }

    return {
      order: savedOrder,
      transaction: savedTransaction
    };

  } catch (error) {
    console.error('Error in saveOrderAndTransaction:', error);
    throw error; // Re-throw to handle in calling code
  }
};

export { saveCardAsImage, uploadImageToCloudinary, updateOrderDetails, orderSummary, saveOrderAndTransaction };