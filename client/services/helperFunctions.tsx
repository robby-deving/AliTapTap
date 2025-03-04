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



export { saveCardAsImage , uploadImageToCloudinary, updateOrderDetails };