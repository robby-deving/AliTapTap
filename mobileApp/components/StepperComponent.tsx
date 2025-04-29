import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

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
    <View style={styles.container}>
      {steps.map((step, index) => (
        <React.Fragment key={step.id}>
          <View style={styles.stepContainer}>
            <Image
              source={currentStep === step.id ? step.activeIcon : step.inactiveIcon}
              style={step.iconSize}
            />
            <Text style={[
              styles.stepText,
              currentStep === step.id ? styles.activeText : styles.inactiveText
            ]}>
              {step.title}
            </Text>
          </View>
          {index < steps.length - 1 && (
            <View style={styles.line} />
          )}
        </React.Fragment>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20
  },
  stepContainer: {
    flexDirection: 'column',
    alignItems: 'center'
  },
  stepText: {
    fontSize: 16,
    fontWeight: '600'
  },
  activeText: {
    color: '#FDCB07'
  },
  inactiveText: {
    color: '#000000'
  },
  line: {
    backgroundColor: '#FFE300',
    height: 2,
    width: 30,
    marginHorizontal: 8
  }
});

export default StepperComponent;