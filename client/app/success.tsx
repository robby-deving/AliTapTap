import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRouter, useLocalSearchParams } from 'expo-router';
const SuccessScreen: React.FC = () => {
    const router = useRouter();

    const handleGoBack = () => {
        router.push('/');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.successText}>Success!</Text>
            <Text style={styles.messageText}>Your transaction was completed successfully.</Text>
            <Button title="Go to Home" onPress={handleGoBack} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    successText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: 'green',
        marginBottom: 20,
    },
    messageText: {
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 20,
    },
});

export default SuccessScreen;