import React, { useRef, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Animated, PanResponder, Pressable, Modal, TextInput, Dimensions, ImageBackground, StyleSheet } from 'react-native';
import { captureRef } from 'react-native-view-shot';
import { Header } from '@/components/Header';
import * as ImagePicker from 'expo-image-picker';
import { GestureHandlerRootView, PinchGestureHandler, State } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { saveCardAsImage } from '@/services/helperFunctions';
import { TextEditorModal } from '@/components/TextEditorModal';

interface SavedItem {
  id: number;
  text?: string;
  uri?: string;
  position: {
    x: number;
    y: number;
  };
  size: number;
  textStyle?: {
    bold: boolean;
    italic: boolean;
    underline: boolean;
    color: string;
  };
}
interface DraggableItem {
  id: number;
  text?: string;
  uri?: string;
  pan: Animated.ValueXY;
  size: Animated.Value;
  selected: boolean;
  textStyle?: {
    bold: boolean;
    italic: boolean;
    underline: boolean;
    color: string;
  };
}

export default function backEdit() {
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
  const router = useRouter();

  const { product } = useLocalSearchParams();
  const parsedProduct = typeof product === "string" ? JSON.parse(product) : product;
  const image = parsedProduct.front_image;

  useEffect(() => {
    loadSavedItems();
  }, []);

  const loadSavedItems = async () => {
    try {
      const savedItemsString = await AsyncStorage.getItem('frontSavedItems');
      if (savedItemsString) {
        const savedItems: SavedItem[] = JSON.parse(savedItemsString);
  
        const loadedItems: DraggableItem[] = savedItems.map(item => ({
          id: item.id,
          text: item.text,
          uri: item.uri,
          pan: new Animated.ValueXY({ x: item.position.x * 525, y: item.position.y * 300 }),
          size: new Animated.Value(item.size),
          selected: false,
          textStyle: item.textStyle || {
            bold: false,
            italic: false,
            underline: false,
            color: '#000000'
          }
        }));
  
        setItems(loadedItems);
        itemIdRef.current = Math.max(...savedItems.map(item => item.id), 0);
      }
    } catch (error) {
      console.error('Error loading saved items:', error);
    }
  };

  const saveItems = async () => {
    try {
      const itemsToSave: SavedItem[] = items.map(item => ({
        id: item.id,
        text: item.text,
        uri: item.uri,
        position: {
          x: item.pan.x._value / 525,
          y: item.pan.y._value / 300,
        },
        size: item.size._value,
        textStyle: item.textStyle
      }));
  
      await AsyncStorage.setItem('frontSavedItems', JSON.stringify(itemsToSave));
      console.log('Items saved successfully');
    } catch (error) {
      console.error('Error saving items:', error);
    }
  };

  const addText = () => {
    itemIdRef.current += 1;
    const newItems = [...items, {
      id: itemIdRef.current,
      text: "New Text",
      pan: new Animated.ValueXY({ x: 50, y: 50 }),
      size: new Animated.Value(16),
      selected: true,
    }];
    console.log('Adding new text item:', newItems[newItems.length - 1]);
    setItems(newItems);
    saveItems();
  };

  const addImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      itemIdRef.current += 1;
      const newItems = [...items, {
        id: itemIdRef.current,
        uri: result.assets[0].uri,
        pan: new Animated.ValueXY({ x: 50, y: 50 }),
        size: new Animated.Value(100),
        selected: false,
      }];
      console.log('Adding new image item:', newItems[newItems.length - 1]);
      setItems(newItems);
      saveItems();
    }
  };

  const deleteItem = (id: number) => {
    console.log('Deleting item with id:', id);
    const newItems = items.filter(item => item.id !== id);
    setItems(newItems);
    saveItems();
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
      console.log('Updating text for item:', selectedItem.id, 'New text:', newText);
      const newItems = items.map(item =>
        item.id === selectedItem.id ? { ...item, text: newText } : item
      );
      setItems(newItems);
      setIsModalVisible(false);
      saveItems();
    }
  };

  const saveFrontCardAsImage = async () => {
    await saveCardAsImage(cardRef, 'front');
  };

  const renderDraggableItem = (item: DraggableItem) => {
    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        item.pan.setOffset({
          x: item.pan.x._value,
          y: item.pan.y._value,
        });
        item.pan.setValue({ x: 0, y: 0 });
        toggleSelectItem(item.id);
      },
      onPanResponderMove: Animated.event([
        null, { dx: item.pan.x, dy: item.pan.y }
      ], { useNativeDriver: false }),
      onPanResponderRelease: () => {
        item.pan.flattenOffset();
      },
    });

    const resizeResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        let newSize = Math.max(14, item.size._value + gestureState.dx / 10);
        item.size.setValue(newSize);
      },
      onPanResponderRelease: () => {
        console.log('Item resized:', item.id, 'New size:', item.size._value);
        saveItems();
      },
    });

    return (
      <Animated.View
        key={item.id}
        {...panResponder.panHandlers}
        style={{
          position: "absolute",
          transform: item.pan.getTranslateTransform(),
          borderWidth: item.selected ? 2 : 0,
          borderColor: item.selected ? '#FFDE01' : 'transparent',
        }}
      >
        {item.text ? (
           <Animated.Text 
           style={[
             { 
               fontSize: item.size,
               minHeight: 14,
               fontWeight: item.textStyle?.bold ? 'bold' : 'normal',
               fontStyle: item.textStyle?.italic ? 'italic' : 'normal',
               textDecorationLine: item.textStyle?.underline ? 'underline' : 'none',
               color: item.textStyle?.color || '#000000'
             }
           ]}
         >
           {item.text}
         </Animated.Text>
        ) : (
          <Animated.Image source={{ uri: item.uri }} style={{ width: item.size, height: item.size }} />
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
              <Image source={require('../assets/images/delete.png')} style={{ width: 18, height: 18 }} />
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
                <Image source={require('../assets/images/edit.png')} style={{ width: 15, height: 15 }} />
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
                backgroundColor: '#FFDE01',
                borderRadius: 5,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Image source={require('../assets/images/resize.png')} style={{ width: 15, height: 15 }} />
            </Animated.View>
          </>
        )}
      </Animated.View>
    );
  };

  const onPinchEvent = Animated.event(
    [{ nativeEvent: { scale: scale } }],
    { useNativeDriver: true }
  );

  const onPinchStateChange = (event: any) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      lastScale.current *= event.nativeEvent.scale;
      scale.setValue(lastScale.current);
    }
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      pan.setOffset({
        x: lastPan.current.x,
        y: lastPan.current.y,
      });
      pan.setValue({ x: 0, y: 0 });
    },
    onPanResponderMove: Animated.event([
      null, { dx: pan.x, dy: pan.y }
    ], { useNativeDriver: false }),
    onPanResponderRelease: () => {
      lastPan.current = {
        x: lastPan.current.x + pan.x._value,
        y: lastPan.current.y + pan.y._value,
      };
      pan.flattenOffset();
    },
  });

  const cardRef = useRef(null);

  return (
    <GestureHandlerRootView style={styles.container}>
      <Header />

      <Pressable onPress={deselectAll} style={styles.mainContent}>
        <View style={styles.designContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Front Design</Text>
          </View>
          <PinchGestureHandler 
            onGestureEvent={onPinchEvent} 
            onHandlerStateChange={onPinchStateChange}
          >
            <Animated.View
              ref={cardRef}
              {...panResponder.panHandlers}
              style={[
                styles.cardContainer,
                {
                  transform: [
                    { scale: scale },
                    { translateX: pan.x },
                    { translateY: pan.y }
                  ]
                }
              ]}
            >
              <ImageBackground
                source={{ uri: image }}
                style={styles.backgroundImage}
                resizeMode="cover"
              >
                {items.map((item) => renderDraggableItem(item))}
              </ImageBackground>
            </Animated.View>
          </PinchGestureHandler>
        </View>
      </Pressable>

      <View style={styles.bottomContainer}>
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={addText}>
            <Image source={require('../assets/images/text-icon.png')} style={styles.actionIcon} />
            <Text style={styles.actionText}>Add Text</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={addImage}>
            <Image source={require('../assets/images/img-icon.png')} style={styles.actionIcon} />
            <Text style={styles.actionText}>Add Image</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.nextButtonContainer}>
          <TouchableOpacity
            style={[
              styles.nextButton,
              isPressed && styles.nextButtonPressed
            ]}
            onPressIn={() => setIsPressed(true)}
            onPressOut={() => setIsPressed(false)}
            onPress={async () => {
              await saveFrontCardAsImage();
              saveText();
              deselectAll();
              router.push({ pathname: "/backEdit", params: { product: JSON.stringify(parsedProduct) } });
            }}
          >
            <Text style={[
              styles.nextButtonText,
              isPressed && styles.nextButtonTextPressed
            ]}>Next</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TextEditorModal
        isVisible={isModalVisible}
        onClose={() => {
          setIsModalVisible(false);
          setSelectedItem(null);
        }}
        initialText={selectedItem?.text || ''}
        initialStyles={selectedItem?.textStyle}
        onSave={(text, styles) => {
          if (selectedItem) {
            const newItems = items.map(item =>
              item.id === selectedItem.id
                ? { ...item, text, textStyle: styles }
                : item
            );
            setItems(newItems);
            setIsModalVisible(false);
            setSelectedItem(null);
            saveItems();
          }
        }}
      />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  mainContent: {
    flex: 1
  },
  designContainer: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    marginBottom: 20
  },
  titleContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    padding: 40
  },
  title: {
    fontWeight: '600',
    fontSize: 30,
    borderBottomWidth: 4,
    borderBottomColor: '#FFE300',
    paddingBottom: 8
  },
  cardContainer: {
    position: 'relative',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderRadius: 8,
    width: 525,
    height: 300,
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: 'auto',
    marginBottom: 'auto'
  },
  backgroundImage: {
    width: 525,
    height: 300
  },
  bottomContainer: {
    flexDirection: 'row',
    gap: 40,
    paddingHorizontal: 40,
    marginBottom: 40
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    gap: 20
  },
  actionButton: {
    flexDirection: 'column',
    alignItems: 'center'
  },
  actionIcon: {
    width: 25,
    height: 25,
    marginBottom: 8
  },
  actionText: {
    fontWeight: '600'
  },
  nextButtonContainer: {
    flex: 1
  },
  nextButton: {
    backgroundColor: '#FDCB07',
    width: '100%',
    padding: 16,
    borderRadius: 8
  },
  nextButtonPressed: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#FDCB07'
  },
  nextButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600'
  },
  nextButtonTextPressed: {
    color: '#FDCB07'
  }
});