import React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

interface HeaderProps {
    onPress?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onPress }) => {
  const router = useRouter();
  
  return (
    <SafeAreaView edges={['top']} style={{ backgroundColor: '#231F20' }}>
      <View className="w-full p-4 flex-row items-center justify-between">
        <TouchableOpacity onPress={onPress || (() => router.back())} className="p-2">
          <Image
            source={require('../assets/images/backBTN.png')}
            style={{ width: 20, height: 20 }}
          />
        </TouchableOpacity>
        <Image
          source={require('../assets/images/logo.png')}
          style={{ width: 27.61, height: 38 }}
        />
        <View style={{ width: 20 }} />
      </View>
    </SafeAreaView>
  );
};