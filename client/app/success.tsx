import React from 'react';
import { View, Text, StyleSheet, Button, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRouter, useLocalSearchParams } from 'expo-router';

const SuccessScreen: React.FC = () => {
    const router = useRouter();
    const navigation = useNavigation();
    const { orderNumber, paymentTime, quantity, totalAmount } = useLocalSearchParams();

    const handleGoBack = () => {
        router.push('/');
    };

    return (
        <View style={styles.container}>
            <Image 
                source={require('../assets/images/success.png')} 
                resizeMode="contain" // Correctly using resizeMode as a prop
                style={styles.successImage} // Use the styles defined in StyleSheet
            />

            <Text style={styles.successText}>Order Success!</Text>
            <Text style={styles.messageText}>Your transaction was completed successfully.</Text>
            
            <Text style={styles.detailText}>Order Number: {orderNumber}</Text>
            <Text style={styles.detailText}>Payment Time: {paymentTime}</Text>
            <Text style={styles.detailText}>Quantity: {quantity}</Text>
            <Text style={styles.detailText}>Total Amount: {totalAmount}</Text>

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
    successImage: {
        width: 100, // Adjust the width of the image
        height: 100, // Adjust the height of the image
        marginBottom: 20,
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
    detailText: {
        fontSize: 16,
        marginBottom: 10,
    },
});

export default SuccessScreen;
