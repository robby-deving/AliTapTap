import React from 'react';
import { View, Text, Image, TouchableOpacity, Modal, Dimensions, StyleSheet } from 'react-native';

interface FailedPaymentModalProps {
    isVisible: boolean;
    onTryAgain: () => void;
    onCancel: () => void;
}

const FailedPaymentModal: React.FC<FailedPaymentModalProps> = ({
    isVisible,
    onTryAgain,
    onCancel
}) => {
    const { width, height } = Dimensions.get('window');

    return (
        <Modal
            visible={isVisible}
            transparent={false}
            animationType="slide"
            statusBarTranslucent
        >
            <View style={[styles.container, { width, height }]}>
                <View style={styles.contentWrapper}>
                    <Image 
                        source={require('../assets/images/failedPayment.png')} 
                        style={styles.image}
                        resizeMode="contain"
                    />
                    <Text style={styles.title}>
                        Payment Failed!
                    </Text>
                    <Text style={styles.message}>
                        Something went wrong with your payment. Please try again or choose a different payment method.
                    </Text>
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity 
                        style={styles.tryAgainButton}
                        onPress={onTryAgain}
                    >
                        <Text style={styles.tryAgainText}>
                            Try Again
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.cancelButton}
                        onPress={onCancel}
                    >
                        <Text style={styles.cancelText}>
                            Cancel
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center'
    },
    contentWrapper: {
        alignItems: 'center',
        marginBottom: 40
    },
    image: {
        width: 104,
        height: 68,
        marginBottom: 20
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#EF4444',
        marginBottom: 16
    },
    message: {
        color: '#4B5563',
        textAlign: 'center',
        paddingHorizontal: 24,
        marginBottom: 32
    },
    buttonContainer: {
        flexDirection: 'column',
        gap: 16,
        width: '100%',
        paddingHorizontal: 32
    },
    tryAgainButton: {
        backgroundColor: '#FACC15',
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 20
    },
    tryAgainText: {
        color: 'black',
        fontWeight: '600',
        fontSize: 18
    },
    cancelButton: {
        backgroundColor: '#E5E7EB',
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 8,
        alignItems: 'center'
    },
    cancelText: {
        color: '#374151',
        fontWeight: '600',
        fontSize: 18
    }
});

export default FailedPaymentModal;