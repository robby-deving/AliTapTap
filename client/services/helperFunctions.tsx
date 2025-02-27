import AsyncStorage from '@react-native-async-storage/async-storage';
import { captureRef } from 'react-native-view-shot';

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

export { saveCardAsImage };