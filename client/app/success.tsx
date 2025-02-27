import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const SuccessScreen: React.FC = () => {
    const router = useRouter();
    const navigation = useNavigation();
    const { orderNumber, paymentTime, quantity, totalAmount } = useLocalSearchParams();

    const handleGoBack = () => {
        router.push('/');
    };

    return (
        <View style={styles.container}>
            {/* Header Section */}
            <View style={styles.header}>
                <TouchableOpacity onPress={handleGoBack}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Image 
                    source={require('../assets/images/logo.png')} 
                    style={styles.logo}
                    resizeMode="contain"
                />
            </View>

            {/* Success Icon & Message */}
            <View style={styles.successContainer}>
                <Image 
                    source={require('../assets/images/success.png')} 
                    style={styles.successImage}
                    resizeMode="contain"
                />
                <Text style={styles.successText}>Order Success!</Text>
            </View>

            {/* Order Details */}
            <View style={styles.detailsContainer}>
                <View style={styles.detailRow}>
                    <Text style={styles.label}>Order Number</Text>
                    <Text style={styles.value}>{orderNumber}</Text>
                </View>
                <View style={styles.detailRow}>
                    <Text style={styles.label}>Payment Time</Text>
                    <Text style={styles.value}>{paymentTime}</Text>
                </View>
                <View style={styles.detailRow}>
                    <Text style={styles.label}>Payment Method</Text>
                    <Text style={styles.value}>Card</Text>
                </View>
                <View style={styles.separator} />
                <View style={styles.detailRow}>
                    <Text style={styles.label}>Quantity</Text>
                    <Text style={styles.value}>{quantity}</Text>
                </View>
                <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Total Amount</Text>
                    <Text style={styles.totalValue}>P{totalAmount}</Text>
                </View>
            </View>

            {/* Buttons */}
            <TouchableOpacity style={styles.homeButton} onPress={handleGoBack}>
                <Text style={styles.homeButtonText}>Back to Home</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.viewOrderButton}>
                <Text style={styles.viewOrderText}>View Order</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    header: {
        width: '100%',
        height: 80,
        backgroundColor: '#1C1C1C',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 40,
    },
    logo: {
        height: 30,
        width: 30,
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    successContainer: {
        alignItems: 'center',
        marginTop: 40,
    },
    successImage: {
        width: 100,  // Increased image size
        height: 100, // Increased image size
        marginBottom: 15,
    },
    successText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FEE308', // Updated to requested color
    },
    detailsContainer: {
        width: '90%',
        backgroundColor: '#fff',
        paddingVertical: 20,
        paddingHorizontal: 15,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    label: {
        fontSize: 14,
        color: '#333',
    },
    value: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    separator: {
        height: 1,
        backgroundColor: '#ccc',
        marginVertical: 10,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    totalValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
    },
    homeButton: {
        width: '90%',
        backgroundColor: '#FFC107',
        paddingVertical: 12,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 20,
    },
    homeButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
    },
    viewOrderButton: {
        width: '90%',
        paddingVertical: 12,
        borderRadius: 5,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#FFC107',
        marginTop: 10,
    },
    viewOrderText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFC107',
    },
});

export default SuccessScreen;
