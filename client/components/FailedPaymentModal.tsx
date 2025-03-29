import React from 'react';
import { View, Text, Image, TouchableOpacity, Modal, Dimensions } from 'react-native';

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
            <View style={{ width, height }} className="bg-white flex-1 justify-center items-center">
                <View className="items-center mb-10">
                    <Image 
                        source={require('../assets/images/failedPayment.png')} 
                        className="w-[104px] h-[68px] mb-5"
                        style={{ width: 104, height: 68 }}
                        resizeMode="contain"
                    />
                    <Text className="text-3xl font-bold text-red-500 mb-4">
                        Payment Failed!
                    </Text>
                    <Text className="text-gray-600 text-center px-6 mb-8">
                        Something went wrong with your payment. Please try again or choose a different payment method.
                    </Text>
                </View>

                <View className="flex flex-col gap-4 w-full px-8">
                    <TouchableOpacity 
                        className="bg-yellow-400 py-4 px-8 rounded-lg items-center mb-5"
                        onPress={onTryAgain}
                    >
                        <Text className="text-black font-semibold text-lg">
                            Try Again
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        className="bg-gray-200 py-4 px-8 rounded-lg items-center"
                        onPress={onCancel}
                    >
                        <Text className="text-gray-700 font-semibold text-lg">
                            Cancel
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default FailedPaymentModal;