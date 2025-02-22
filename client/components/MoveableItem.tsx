import React, { useRef, useState } from 'react';
import { Animated, PanResponder, View, Text, Image, TextInput, TouchableOpacity } from 'react-native';

interface MoveableItemProps {
  type: 'text' | 'image';
  content: string;
  initialPosition?: { x: number; y: number };
}

export const MoveableItem: React.FC<MoveableItemProps> = ({ type, content, initialPosition = { x: 0, y: 0 } }) => {
  const [isSelected, setIsSelected] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(content);
  const pan = useRef(new Animated.ValueXY({ x: initialPosition.x, y: initialPosition.y })).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !isEditing, // Disable dragging while editing
      onPanResponderGrant: () => {
        setIsSelected(true);
      },
      onPanResponderMove: Animated.event([
        null,
        { dx: pan.x, dy: pan.y }
      ], { useNativeDriver: false }),
      onPanResponderRelease: () => {
        // Keep selected state when released
      }
    })
  ).current;

  return (
    <Animated.View
      style={{
        transform: [{ translateX: pan.x }, { translateY: pan.y }],
        position: 'absolute',
      }}
      {...panResponder.panHandlers}
    >
      {type === 'text' ? (
        <TouchableOpacity 
          onPress={() => setIsEditing(true)}
          activeOpacity={0.8}
        >
          <View className={`
            bg-white p-4 rounded-lg shadow-md
            ${isSelected ? 'border-2 border-[#FFE300]' : ''}
            ${isEditing ? 'bg-gray-50' : ''}
          `}>
            <View className="min-w-[150px] min-h-[40px]">
              <TextInput
                value={text}
                onChangeText={setText}
                placeholder="Enter text here"
                placeholderTextColor="#999"
                className="text-black text-base"
                onFocus={() => {
                  setIsEditing(true);
                  setIsSelected(true);
                }}
                onBlur={() => {
                  setIsEditing(false);
                  setIsSelected(false);
                }}
                multiline
              />
            </View>
            {isSelected && (
              <View className="absolute -top-2 -right-2 w-4 h-4 bg-[#FFE300] rounded-full" />
            )}
          </View>
        </TouchableOpacity>
      ) : (
        <View className={`bg-white p-1 rounded-md shadow-sm ${
          isSelected ? 'border-2 border-[#FFE300]' : ''
        }`}>
          <Image
            source={{ uri: content }}
            className="w-[100px] h-[100px]"
            resizeMode="contain"
          />
        </View>
      )}
    </Animated.View>
  );
};