import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Header } from '../components/Header';

interface TransactionData {
  transaction: {
    transaction_number: string;
    created_at: string;
    payment_method: string;
    quantity: number;
    shipping_subtotal: number;
    total_amount: number;
  };
}

export default function SuccessScreen() {
    const router = useRouter();
    const [transactionData, setTransactionData] = useState<TransactionData | null>(null);

    useEffect(() => {
        const fetchOrderSummary = async () => {
            try {
                const orderSummaryString = await AsyncStorage.getItem('orderSummary');
                if (orderSummaryString) {
                    const orderSummary = JSON.parse(orderSummaryString);
                    setTransactionData({
                        transaction: {
                            transaction_number: orderSummary.transaction_number || 'N/A',
                            created_at: orderSummary.created_at || new Date().toISOString(),
                            payment_method: orderSummary.payment_method || 'N/A',
                            quantity: orderSummary.quantity || 0,
                            shipping_subtotal: orderSummary.shipping_subtotal || 0,
                            total_amount: orderSummary.total_amount || 0
                        }
                    });
                }
            } catch (error) {
                console.error('Error fetching order summary:', error);
            }
        };

        fetchOrderSummary();
    }, []);

    const handleGoBack = async () => {
        try {
            await AsyncStorage.removeItem('orderSummary');
            router.replace('/productcatalogue');
        } catch (error) {
            console.error('Error clearing order summary:', error);
            router.replace('/');
        }
    };

    return (
        <View style={styles.container}>
            <Header />

            <View style={styles.content}>
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
                        <Text style={styles.value}>{transactionData?.transaction?.transaction_number || 'N/A'}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.label}>Payment Time</Text>
                        <Text style={styles.value}>
                            {transactionData?.transaction?.created_at ? 
                                new Date(transactionData.transaction.created_at).toLocaleString() : 'N/A'}
                        </Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.label}>Payment Method</Text>
                        <Text style={styles.value}>{transactionData?.transaction?.payment_method || 'N/A'}</Text>
                    </View>
                    <View style={styles.separator} />
                    <View style={styles.detailRow}>
                        <Text style={styles.label}>Quantity</Text>
                        <Text style={styles.value}>{transactionData?.transaction?.quantity || 'N/A'}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.label}>Shipping Cost</Text>
                        <Text style={styles.value}>₱{transactionData?.transaction?.shipping_subtotal?.toFixed(2) || 'N/A'}</Text>
                    </View>
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Total Amount</Text>
                        <Text style={styles.totalValue}>₱{transactionData?.transaction?.total_amount?.toFixed(2) || 'N/A'}</Text>
                    </View>
                </View>
            </View>

            {/* Buttons */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.homeButton} onPress={handleGoBack}>
                    <Text style={styles.homeButtonText}>Back to Home</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.viewOrderButton}>
                    <Text style={styles.viewOrderText}>View Order</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        flex: 1,
        alignItems: 'center',
    },
    successContainer: {
        alignItems: 'center',
        padding: 40,
    },
    successImage: {
        width: 120,
        height: 120,
        marginBottom: 20,
    },
    successText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FEE308',
    },
    detailsContainer: {
        width: '90%',
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    label: {
        fontSize: 14,
        color: '#666',
    },
    value: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    separator: {
        height: 1,
        backgroundColor: '#E5E5E5',
        marginVertical: 15,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15,
        paddingTop: 15,
        borderTopWidth: 1,
        borderTopColor: '#E5E5E5',
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    totalValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFC107',
    },
    buttonContainer: {
        width: '100%',
        padding: 20,
        backgroundColor: '#fff',
    },
    homeButton: {
        backgroundColor: '#FFC107',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 12,
    },
    homeButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
    viewOrderButton: {
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#FFC107',
    },
    viewOrderText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFC107',
    },
});
