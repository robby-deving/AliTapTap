import React from 'react';
import { View, Text, Image } from 'react-native';

interface StepperProps {
  currentStep: 'shipping' | 'payment' | 'review';
}

const StepperComponent: React.FC<StepperProps> = ({ currentStep }) => {
  const steps = [
    {
      id: 'shipping',
      title: 'Shipping',
      activeIcon: require('../assets/images/Tshipping.png'),
      inactiveIcon: require('../assets/images/Fshipping.png'),
      iconSize: { width: 29, height: 20 }
    },
    {
      id: 'payment',
      title: 'Payment',
      activeIcon: require('../assets/images/Tpayment.png'),
      inactiveIcon: require('../assets/images/Fpayment.png'),
      iconSize: { width: 26, height: 20 }
    },
    {
      id: 'review',
      title: 'Review',
      activeIcon: require('../assets/images/Treview.png'),
      inactiveIcon: require('../assets/images/Freview.png'),
      iconSize: { width: 17, height: 20 }
    }
  ];

  return (
    <View className="w-full flex-row justify-center items-center mt-5">
      {steps.map((step, index) => (
        <React.Fragment key={step.id}>
          <View className="flex flex-col items-center">
            <Image
              source={currentStep === step.id ? step.activeIcon : step.inactiveIcon}
              style={step.iconSize}
            />
            <Text 
              className={`text-base font-semibold ${
                currentStep === step.id ? 'text-[#FDCB07]' : 'text-black'
              }`}
            >
              {step.title}
            </Text>
          </View>
          {index < steps.length - 1 && (
            <View className="bg-[#FFE300] h-[0.125rem] w-[3rem] mt-4 mx-2" />
          )}
        </React.Fragment>
      ))}
    </View>
  );
};

export default StepperComponent;