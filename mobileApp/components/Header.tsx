import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

interface HeaderProps {
    onPress?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onPress }) => {
  const router = useRouter();
  
  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <View style={styles.container}>
        <TouchableOpacity 
          onPress={onPress || (() => router.back())} 
          style={styles.backButton}
        >
          <Image
            source={require('../assets/images/backBTN.png')}
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <Image
          source={require('../assets/images/logo.png')}
          style={styles.logo}
        />
        <View style={styles.spacer} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#231F20'
  },
  container: {
    width: '100%',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  backButton: {
    padding: 8
  },
  backIcon: {
    width: 20,
    height: 20
  },
  logo: {
    width: 27.61,
    height: 38
  },
  spacer: {
    width: 20
  }
});