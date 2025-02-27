import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ImageBackground } from 'react-native';
import { Header } from '@/components/Header';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface CustomCheckBoxProps {
  isChecked: boolean;
  onPress: () => void;
}

const CustomCheckBox: React.FC<CustomCheckBoxProps> = ({ isChecked, onPress }) => (
  <TouchableOpacity onPress={onPress} className="flex items-center">
    <View className="h-5 w-5 border border-black items-center justify-center mr-2">
      {isChecked && <View className="h-3 w-3 bg-black" />}
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
    <View className="h-full bg-white">
      <Header />
      
      <View className=" flex-1 bg-[#F5F5F5] rounded-b-[40px] mb-5 px-10 py-5">
        <View className="items-center mb-5">
          <Text className="font-semibold text-3xl border-b-4 pb-2 border-[#FFE300]">
            Review Design
          </Text>
        </View>

        <View className="flex flex-1 items-center justify-center gap-8">
          <ImageBackground source={{ uri: cardImage.front || '' }} style={{ height: 150, width: 262.5, borderRadius: 15 }} />
          <ImageBackground source={{ uri: cardImage.back || ''}} style={{ height: 150, width: 262.5, borderRadius: 15 }} />
        </View>
      </View>

      <View className="px-10 mb-10 gap-3">
        <View className="flex flex-row items-center">
          <CustomCheckBox isChecked={isChecked} onPress={() => setIsChecked(!isChecked)} />
          <Text className="ml-2">I have reviewed my design</Text>
        </View>

        <TouchableOpacity 
          className={`${isPressed ? 'bg-white border border-[#FDCB07]' : isChecked ? 'bg-[#FDCB07]' : 'bg-[#FCECA5]'} w-full p-4 rounded ${!isChecked ? 'opacity-50' : ''}`}
          onPressIn={() => setIsPressed(true)}
          onPressOut={() => setIsPressed(false)}
          onPress={() => router.push('/payment')}
          disabled={!isChecked}
        >
          <Text className={`${isPressed ? 'text-[#FDCB07]' : isChecked ? 'text-white' : 'text-black'} text-center text-xl font-semibold`}>
            Next
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
