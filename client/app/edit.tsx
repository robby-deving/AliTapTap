import React, { useRef, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Animated, PanResponder, Pressable, Modal, TextInput, Dimensions, ImageBackground } from 'react-native';
import { captureRef } from 'react-native-view-shot';
import { Header } from '@/components/Header';
import * as ImagePicker from 'expo-image-picker';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { saveCardAsImage } from '@/services/helperFunctions';

interface SavedItem {
  id: number;
  text?: string;
  uri?: string;
  position: {
    x: number;
    y: number;
  };
  size: number;
}

interface DraggableItem {
  id: number;
  text?: string;
  uri?: string;
  pan: Animated.ValueXY;
  size: Animated.Value;
  selected: boolean;
  position: { x: number; y: number }; // Add position property
}

interface CardData {
  frontImage: string;
  backImage: string;
  items: DraggableItem[];
}

export default function BackEdit() {
  const [isPressed, setIsPressed] = useState(false);
  const [items, setItems] = useState<DraggableItem[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<DraggableItem | null>(null);
  const [newText, setNewText] = useState('');
  const itemIdRef = useRef(0);
  const scale = useRef(new Animated.Value(1)).current;
  const lastScale = useRef(1);
  const pan = useRef(new Animated.ValueXY()).current;
  const lastPan = useRef({ x: 0, y: 0 });
<<<<<<< HEAD
  const [cardData, setCardData] = useState<CardData | null>(null);

  const { width, height } = Dimensions.get('window');
=======
>>>>>>> origin/f/dynamicDataCustom
  const router = useRouter();

  const { product } = useLocalSearchParams();
  const parsedProduct = typeof product === "string" ? JSON.parse(product) : product;
  const image = parsedProduct.front_image

  

  useEffect(() => {
    loadCardData();
  }, []);

<<<<<<< HEAD
  const loadCardData = async () => {
=======
  const initialData: SavedItem[] = parsedProduct.details.front_info.map((info: any, index: number) => ({
    id: index + 1,
    text: info.text || "",
    uri: info.uri || "",
    position: info.position || { x: 0, y: 0 },
    size: info.size || 14,
  }));

  const saveInitialData = async () => {
>>>>>>> origin/f/dynamicDataCustom
    try {
      const savedCardData = await AsyncStorage.getItem('cardData');
      if (savedCardData) {
        const parsedCardData: CardData = JSON.parse(savedCardData);
        setCardData(parsedCardData);

        const loadedItems: DraggableItem[] = parsedCardData.items.map(item => ({
          id: item.id,
          text: item.text,
          uri: item.uri,
          pan: new Animated.ValueXY({ x: item.position.x * width, y: item.position.y * height }),
          size: new Animated.Value(item.size),
          selected: false,
          position: item.position, // Ensure position is included
        }));

        setItems(loadedItems);
        itemIdRef.current = Math.max(...parsedCardData.items.map(item => item.id), 0);
      } else {
        console.log('No card data found');
      }
    } catch (error) {
      console.error('Error loading card data:', error);
    }
  };

  const saveCardData = async () => {
    try {
      const itemsToSave: SavedItem[] = items.map(item => ({
        id: item.id,
        text: item.text,
        uri: item.uri,
        position: { x: item.pan.x.value / width, y: item.pan.y.value / height }, // Access .value for Animated.Value
        size: item.size.value, // Access .value for Animated.Value
      }));

      const updatedCardData: CardData = {
        frontImage: cardData?.frontImage || '',
        backImage: cardData?.backImage || '',
        items: itemsToSave,
      };

      await AsyncStorage.setItem('cardData', JSON.stringify(updatedCardData));
      console.log('Card data saved successfully');
    } catch (error) {
      console.error('Error saving card data:', error);
    }
  };

  const addText = () => {
    itemIdRef.current += 1;
    const newItems = [
      ...items,
      {
        id: itemIdRef.current,
        text: 'New Text',
        pan: new Animated.ValueXY({ x: width * 0.1, y: height * 0.1 }),
        size: new Animated.Value(16),
        selected: false,
        position: { x: width * 0.1, y: height * 0.1 }, // Add position
      },
    ];
    setItems(newItems);
    saveCardData();
  };

  const addImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      itemIdRef.current += 1;
      const newItems = [
        ...items,
        {
          id: itemIdRef.current,
          uri: result.assets[0].uri,
          pan: new Animated.ValueXY({ x: width * 0.1, y: height * 0.1 }),
          size: new Animated.Value(100),
          selected: false,
          position: { x: width * 0.1, y: height * 0.1 }, // Add position
        },
      ];
      setItems(newItems);
      saveCardData();
    }
  };

  const deleteItem = (id: number) => {
    const newItems = items.filter(item => item.id !== id);
    setItems(newItems);
    saveCardData();
  };

  const toggleSelectItem = (id: number) => {
    setItems(items.map(item => ({ ...item, selected: item.id === id })));
  };

  const deselectAll = () => {
    setItems(items.map(item => ({ ...item, selected: false })));
  };

  const openEditModal = (item: DraggableItem) => {
    setSelectedItem(item);
    setNewText(item.text || '');
    setIsModalVisible(true);
  };

  const saveText = () => {
    if (selectedItem) {
      const newItems = items.map(item =>
        item.id === selectedItem.id ? { ...item, text: newText } : item
      );
      setItems(newItems);
      setIsModalVisible(false);
      saveCardData();
    }
  };

  const saveFrontCardAsImage = async () => {
    if (cardData?.frontImage) {
      await saveCardAsImage(cardRef, 'front');
    }
  };

  const renderDraggableItem = (item: DraggableItem) => {
    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        item.pan.setOffset({
          x: item.pan.x.value,
          y: item.pan.y.value,
        });
        item.pan.setValue({ x: 0, y: 0 });
        toggleSelectItem(item.id);
      },
      onPanResponderMove: Animated.event([null, { dx: item.pan.x, dy: item.pan.y }], { useNativeDriver: false }),
      onPanResponderRelease: () => {
        item.pan.flattenOffset();
      },
    });

    const resizeResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        let newSize = Math.max(14, item.size.value + gestureState.dx / 10);
        item.size.setValue(newSize);
      },
      onPanResponderRelease: () => {
        saveCardData();
      },
    });

    return (
      <Animated.View
        key={item.id}
        {...panResponder.panHandlers}
        style={{
          position: 'absolute',
          transform: item.pan.getTranslateTransform(),
          borderWidth: item.selected ? 2 : 0,
          borderColor: item.selected ? '#FFDE01' : 'transparent',
        }}
      >
        {item.text ? (
          <Animated.Text style={{ fontSize: item.size.value, minHeight: 14 }}>{item.text}</Animated.Text>
        ) : (
          <Animated.Image source={{ uri: item.uri }} style={{ width: item.size.value, height: item.size.value }} />
        )}

        {item.selected && (
          <>
            <TouchableOpacity
              onPress={() => deleteItem(item.id)}
              style={{
                position: 'absolute',
                top: -10,
                right: -10,
                width: 20,
                height: 20,
                backgroundColor: 'white',
                borderRadius: 10,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Image source={require('../assets/images/delete.png')} className='h-[18px] w-[18px]' />
            </TouchableOpacity>
            {item.text && (
              <TouchableOpacity
                onPress={() => openEditModal(item)}
                style={{
                  position: 'absolute',
                  top: -10,
                  left: -10,
                  width: 22,
                  height: 22,
                  backgroundColor: '#FFDE01',
                  borderRadius: 5,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Image source={require('../assets/images/edit.png')} className='h-[15px] w-[15px]' />
              </TouchableOpacity>
            )}
            <Animated.View
              {...resizeResponder.panHandlers}
              style={{
                position: 'absolute',
                bottom: -10,
                right: -10,
                width: 20,
                height: 20,
                backgroundColor: 'transparent',
                borderWidth: 1,
                borderColor: '#FFDE01',
              }}
            />
          </>
        )}
      </Animated.View>
    );
  };

  return (
    <GestureHandlerRootView>
      <View style={{ flex: 1 }}>
        <Header title="Edit Card Back" />

        <Pressable style={{ flex: 1 }} onPress={deselectAll}>
          <View style={{ flex: 1, position: 'relative' }}>
            {cardData?.backImage && (
              <ImageBackground
                source={{ uri: cardData?.backImage }}
                style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
              >
                {items.map(renderDraggableItem)}
              </ImageBackground>
<<<<<<< HEAD
            )}
=======
            </Animated.View>
          </PinchGestureHandler>

        </View>

      </Pressable>

      <View className='flex flex-row gap-10 px-10 mb-10'>
        <View className='flex flex-row gap-5'>
          <TouchableOpacity className='flex flex-col items-center' onPress={addText}>
            <Image source={require('../assets/images/text-icon.png')} className='w-[25px] h-[25px] mb-2' />
            <Text className='font-semibold'>Add Text</Text>
          </TouchableOpacity>
          <TouchableOpacity className='flex flex-col items-center' onPress={addImage}>
            <Image source={require('../assets/images/img-icon.png')} className='w-[25px] h-[25px] mb-2' />
            <Text className='font-semibold'>Add Image</Text>
          </TouchableOpacity>
        </View>
        <View className='flex-1'>
          <TouchableOpacity
            className={`${isPressed ? 'bg-white border border-[#FDCB07]' : 'bg-[#FDCB07]'} w-full p-4 rounded`}
            onPressIn={() => setIsPressed(true)}
            onPressOut={() => setIsPressed(false)}
            onPress={async () => {
              await saveFrontCardAsImage();
              saveText();
              deselectAll();
              router.push({ pathname: "/backEdit", params: { product: JSON.stringify(parsedProduct) } });
            }}
          >
            <Text className={`${isPressed ? 'text-[#FDCB07]' : 'text-white'} text-center text-xl font-semibold`}>Next</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View style={{ width: 300, padding: 20, backgroundColor: 'white', borderRadius: 10 }}>
            <Text style={{ fontSize: 18, marginBottom: 10 }}>Edit Text</Text>
            <TextInput
              value={newText}
              onChangeText={setNewText}
              style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 20 }}
            />
            <TouchableOpacity onPress={saveText} style={{ backgroundColor: '#FDCB07', padding: 10, borderRadius: 5 }}>
              <Text style={{ color: 'white', textAlign: 'center' }}>Save</Text>
            </TouchableOpacity>
>>>>>>> origin/f/dynamicDataCustom
          </View>
        </Pressable>

        <View style={{ position: 'absolute', bottom: 20, left: 10 }}>
          <TouchableOpacity onPress={saveCardData}>
            <Text>Save Changes</Text>
          </TouchableOpacity>
        </View>

        <Modal visible={isModalVisible} transparent={true}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <View style={{ backgroundColor: 'white', padding: 20 }}>
              <Text>Edit Text</Text>
              <TextInput
                value={newText}
                onChangeText={setNewText}
                style={{ borderBottomWidth: 1, marginBottom: 10 }}
              />
              <TouchableOpacity onPress={saveText}>
                <Text>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                <Text>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </GestureHandlerRootView>
  );
}
