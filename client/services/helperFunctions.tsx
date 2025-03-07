import AsyncStorage from '@react-native-async-storage/async-storage';
import { captureRef } from 'react-native-view-shot';
import axios from 'axios';

const saveCardAsImage = async (cardRef, side) => {
  try {
    const uri = await captureRef(cardRef, {
      format: 'png',
      quality: 1,
    });

    // Retrieve the existing card_image object
    const existingCardImageString = await AsyncStorage.getItem('card_image');
    const existingCardImage = existingCardImageString ? JSON.parse(existingCardImageString) : {};

    // Update the object with the new image
    const updatedCardImage = {
      ...existingCardImage,
      [side]: uri,
    };

    // Save the updated object back to AsyncStorage
    await AsyncStorage.setItem('card_image', JSON.stringify(updatedCardImage));
    console.log(`Card image (${side}) saved successfully:`, uri);
  } catch (error) {
    console.error(`Error saving card image (${side}):`, error);
  }
};

  const uploadImageToCloudinary = async (imageUri: string, paymentIntentId: string) => {
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


  const updateOrderDetails = async (attribute: string, value: any) => {
    try {
      // Retrieve the existing order details
      const orderDetailsString = await AsyncStorage.getItem('orderDetails');
      let orderDetails = orderDetailsString ? JSON.parse(orderDetailsString) : {};
  
      // Update the specific attribute
      orderDetails[attribute] = value;
  
      // Save the updated order details back to AsyncStorage
      await AsyncStorage.setItem('orderDetails', JSON.stringify(orderDetails));
      console.log('Order details updated successfully:', orderDetails);
    } catch (error) {
      console.error('Error updating order details:', error);
    }
  };

  const orderSummary = async (attribute: string, value: any) => {
    try {
      // Retrieve the existing order details
      const orderSummaryString = await AsyncStorage.getItem('orderSummary');
      let orderSummary = orderSummaryString ? JSON.parse(orderSummaryString) : {};
  
      // Update the specific attribute
      orderSummary[attribute] = value;
  
      // Save the updated order details back to AsyncStorage
      await AsyncStorage.setItem('orderSummary', JSON.stringify(orderSummary));
      console.log('Order details updated successfully:', orderSummary);
    } catch (error) {
      console.error('Error updating order details:', error);
    }
  };

  const saveOrderAndTransaction = async () => {
    try {
      // Hardcoded order data for testing
      const orderData = {
        customer_id: "65f2e5b9e6bcd12345678901", // Replace with actual customer ID
        design_id: "65f2e5b9e6bcd12345678902",   // Replace with actual design ID
        front_image: "https://cloudinary.com/front-image-url",
        back_image: "https://cloudinary.com/back-image-url",
        details: {
          material: "PVC",
          color: "White",
          front_info: ["Name", "Position", "Company"],
          back_info: ["Phone", "Email", "Address"]
        },
        quantity: 100,
        total_price: 2500,
        order_status: "Pending"
      };
  
      // Create order
      const orderResponse = await axios.post('http://your-backend-url/api/orders', orderData);
      const savedOrder = orderResponse.data.data;
      
      // Hardcoded transaction data using the saved order
      const transactionData = {
        order_id: savedOrder._id,
        customer_id: orderData.customer_id,
        merchandise_subtotal: orderData.total_price,
        shipping_subtotal: 150,  // Hardcoded shipping cost
        total_amount: orderData.total_price + 150,
        payment_method: "GCash",
        status: "Pending"
      };
  
      // Create transaction
      const transactionResponse = await axios.post('http://your-backend-url/api/transactions', transactionData);
      const savedTransaction = transactionResponse.data.data;
  
      // Save references locally
      await AsyncStorage.setItem('currentOrder', JSON.stringify(savedOrder));
      await AsyncStorage.setItem('currentTransaction', JSON.stringify(savedTransaction));
  
      console.log('Order and transaction saved successfully:', {
        order: savedOrder,
        transaction: savedTransaction
      });
  
      return {
        order: savedOrder,
        transaction: savedTransaction
      };
  
    } catch (error) {
      console.error('Error saving order and transaction:', error);
      throw error;
    }
  };



export { saveCardAsImage , uploadImageToCloudinary, updateOrderDetails };