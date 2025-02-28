import React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

export const Header = () => {
  const router = useRouter();
  
  return (
    <SafeAreaView edges={['top']} style={{ backgroundColor: '#1C1C1C' }}>
      <View style={{ width: '100%', height: 80, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 40 }}>
        
        {/* Back Button */}
        <TouchableOpacity onPress={() => router.back()}>
          <Image source={require('../assets/images/backBTN.png')} style={{ width: 20, height: 20 }} />
        </TouchableOpacity>
        
        {/* Logo */}
        <Image source={require('../assets/images/logo.png')} style={{ width: 27.61, height: 38 }} resizeMode="contain" />
        
        {/* Empty Space (for alignment) */}
        <View style={{ width: 20 }} />
      </View>
    </SafeAreaView>
  );
};
