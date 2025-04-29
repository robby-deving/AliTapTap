import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, StyleSheet } from 'react-native';
import { Header } from '@/components/Header';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface CustomCheckBoxProps {
  isChecked: boolean;
  onPress: () => void;
}

const CustomCheckBox: React.FC<CustomCheckBoxProps> = ({ isChecked, onPress }) => (
  <TouchableOpacity onPress={onPress} style={styles.checkboxContainer}>
    <View style={styles.checkbox}>
      {isChecked && <View style={styles.checkboxInner} />}
    </View>
  </TouchableOpacity>
);

export default function reviewDesign() {  
  const [isPressed, setIsPressed] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [cardImage, setCardImage] = useState({ front: '', back: '' });
  const router = useRouter();

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

    fetchCardImage();
  }, []);

  return (
    <View style={styles.container}>
      <Header />
      
      <View style={styles.mainContent}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>
            Review Design
          </Text>
        </View>

        <View style={styles.designContainer}>
          <ImageBackground 
            source={{ uri: cardImage.front || '' }} 
            style={styles.cardImage} 
          />
          <ImageBackground 
            source={{ uri: cardImage.back || ''}} 
            style={styles.cardImage} 
          />
        </View>
      </View>

      <View style={styles.bottomContainer}>
        <View style={styles.checkboxRow}>
          <CustomCheckBox 
            isChecked={isChecked} 
            onPress={() => setIsChecked(!isChecked)} 
          />
          <Text style={styles.checkboxLabel}>I have reviewed my design</Text>
        </View>

        <TouchableOpacity 
          style={[
            styles.nextButton,
            isPressed && styles.nextButtonPressed,
            !isChecked && styles.nextButtonDisabled
          ]}
          onPressIn={() => setIsPressed(true)}
          onPressOut={() => setIsPressed(false)}
          onPress={() => router.push('/payment')}
          disabled={!isChecked}
        >
          <Text style={[
            styles.nextButtonText,
            isPressed && styles.nextButtonTextPressed,
            !isChecked && styles.nextButtonTextDisabled
          ]}>
            Next
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  mainContent: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    marginBottom: 20,
    paddingHorizontal: 40,
    paddingVertical: 20
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 20
  },
  title: {
    fontWeight: '600',
    fontSize: 30,
    borderBottomWidth: 4,
    borderBottomColor: '#FFE300',
    paddingBottom: 8
  },
  designContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 32
  },
  cardImage: {
    height: 150,
    width: 262.5,
    borderRadius: 15
  },
  bottomContainer: {
    paddingHorizontal: 40,
    marginBottom: 40,
    gap: 12
  },
  checkboxContainer: {
    alignItems: 'center'
  },
  checkbox: {
    height: 20,
    width: 20,
    borderWidth: 1,
    borderColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8
  },
  checkboxInner: {
    height: 12,
    width: 12,
    backgroundColor: 'black'
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  checkboxLabel: {
    marginLeft: 8
  },
  nextButton: {
    width: '100%',
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#FDCB07'
  },
  nextButtonPressed: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#FDCB07'
  },
  nextButtonDisabled: {
    backgroundColor: '#FCECA5',
    opacity: 0.5
  },
  nextButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600'
  },
  nextButtonTextPressed: {
    color: '#FDCB07'
  },
  nextButtonTextDisabled: {
    color: 'black'
  }
});
