import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Image, Animated, PanResponder, Pressable, Modal, TextInput, Dimensions } from 'react-native';
import { Header } from '@/components/Header';
import * as ImagePicker from 'expo-image-picker';
import { GestureHandlerRootView, PinchGestureHandler, State } from 'react-native-gesture-handler';

interface DraggableItem {
  id: number;
  text?: string;
  uri?: string;
  pan: Animated.ValueXY;
  size: Animated.Value;
  selected: boolean;
}

export default function Edit() {  
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

    const { width, height } = Dimensions.get('window');

    const addText = () => {
        itemIdRef.current += 1;
        setItems([...items, {
            id: itemIdRef.current,
            text: "New Text",
            pan: new Animated.ValueXY({ x: 50, y: 50 }),
            size: new Animated.Value(30),
            selected: false,
        }]);
    };

    const addImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            itemIdRef.current += 1;
            setItems([...items, {
                id: itemIdRef.current,
                uri: result.assets[0].uri,
                pan: new Animated.ValueXY({ x: 50, y: 50 }),
                size: new Animated.Value(100),
                selected: false,
            }]);
        }
    };

    const deleteItem = (id: number) => {
        setItems(items.filter(item => item.id !== id));
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
            setItems(items.map(item => item.id === selectedItem.id ? { ...item, text: newText } : item));
            setIsModalVisible(false);
        }
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
                let newSize = Math.max(30, item.size._value + gestureState.dx / 10);
                item.size.setValue(newSize);
            },
        });

        return (
            <Animated.View
                {...panResponder.panHandlers}
                style={{
                    position: "absolute",
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
                                backgroundColor: '#FFDE01',
                                borderRadius: 5,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Image source={require('../assets/images/resize.png')} className='h-[15px] w-[15px]' />
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

    return (
        <GestureHandlerRootView className='h-full bg-white'>
            <Header />
            <Pressable onPress={deselectAll} className='flex-1'>
                <View className='flex-1 bg-[#F5F5F5] rounded-b-[40px] mb-5'>
                    <View className='flex flex-col items-center p-10'>
                        <Text className="font-semibold text-3xl border-b-4 pb-2 border-[#FFE300]">Front Design</Text>
                    </View>
                    
                    <PinchGestureHandler onGestureEvent={onPinchEvent} onHandlerStateChange={onPinchStateChange}>
                        <Animated.View
                            {...panResponder.panHandlers}
                            className='relative bg-white shadow rounded-lg'
                            style={{ 
                                width: 525, 
                                height: 300, 
                                transform: [
                                    { scale: scale },
                                    { translateX: pan.x },
                                    { translateY: pan.y }
                                ],
                                alignSelf: 'center', // Center horizontally
                                justifyContent: 'center', // Center vertically
                                marginTop: 'auto', // Center vertically
                                marginBottom: 'auto' // Center vertically
                            }}
                        >
                            {items.map((item) => renderDraggableItem(item))}
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
                    </View>
                </View>
            </Modal>
        </GestureHandlerRootView>
    );
}
