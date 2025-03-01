import React, { useRef, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Animated, PanResponder, Pressable, Modal, TextInput, Dimensions, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
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
}

interface CardData {
  frontImage: string;
  backImage: string;
  items: DraggableItem[];
}

export default function BackEdit() {
  const [items, setItems] = useState<DraggableItem[]>([]);
  const [cardData, setCardData] = useState<CardData | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<DraggableItem | null>(null);
  const [newText, setNewText] = useState('');
  const itemIdRef = useRef(0);
  const scale = useRef(new Animated.Value(1)).current;
  const lastScale = useRef(1);
  const pan = useRef(new Animated.ValueXY()).current;
  const lastPan = useRef({ x: 0, y: 0 });

  const { width, height } = Dimensions.get('window');
  const router = useRouter();

  useEffect(() => {
    loadCardData();
  }, []);

  const loadCardData = async () => {
    const { frontImage, backImage, materials, details } = router.query;

    // Parse the materials and details if they are passed as stringified JSON
    const parsedMaterials = materials ? JSON.parse(materials as string) : {};
    const parsedDetails = details ? JSON.parse(details as string) : {};

    // Initialize the card data
    const newCardData: CardData = {
      frontImage: frontImage as string,
      backImage: backImage as string,
      items: parsedDetails?.back_info || [],
    };

    setCardData(newCardData);

    const loadedItems: DraggableItem[] = newCardData.items.map((item: any) => ({
      id: item.id,
      text: item.text,
      uri: item.uri,
      pan: new Animated.ValueXY({ x: item.position.x * width, y: item.position.y * height }),
      size: new Animated.Value(item.size),
      selected: false,
    }));

    setItems(loadedItems);
  };

  const saveItems = async () => {
    try {
      const itemsToSave: SavedItem[] = items.map((item) => ({
        id: item.id,
        text: item.text,
        uri: item.uri,
        position: { x: item.pan.x._value / width, y: item.pan.y._value / height },
        size: item.size._value,
      }));

      await AsyncStorage.setItem('backSavedItems', JSON.stringify(itemsToSave));
      console.log('Items saved successfully');
    } catch (error) {
      console.error('Error saving items:', error);
    }
  };

  const renderDraggableItem = (item: DraggableItem) => {
    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        item.pan.setOffset({ x: item.pan.x._value, y: item.pan.y._value });
        item.pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: Animated.event([null, { dx: item.pan.x, dy: item.pan.y }], { useNativeDriver: false }),
      onPanResponderRelease: () => {
        item.pan.flattenOffset();
        saveItems();  // Save data after dragging
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
          <Animated.Text style={{ fontSize: item.size, minHeight: 14 }}>{item.text}</Animated.Text>
        ) : (
          <Animated.Image source={{ uri: item.uri }} style={{ width: item.size, height: item.size }} />
        )}
      </Animated.View>
    );
  };

  return (
    <GestureHandlerRootView>
      <View style={{ flex: 1 }}>
        <Pressable style={{ flex: 1 }} onPress={() => setItems(items.map(item => ({ ...item, selected: false })))}>
          <View style={{ flex: 1, position: 'relative' }}>
            {cardData?.backImage && (
              <ImageBackground source={{ uri: cardData?.backImage }} style={{ flex: 1 }}>
                {items.map(renderDraggableItem)}
              </ImageBackground>
            )}
          </View>
        </Pressable>

        <Modal visible={isModalVisible} transparent={true}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <View style={{ width: 300, padding: 20, backgroundColor: 'white', borderRadius: 10 }}>
              <Text style={{ fontSize: 18, marginBottom: 10 }}>Edit Text</Text>
              <TextInput
                value={newText}
                onChangeText={setNewText}
                style={{ borderBottomWidth: 1, marginBottom: 10 }}
              />
              <TouchableOpacity onPress={() => setIsModalVisible(false)}>
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
