import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';

interface PaymentMethod {
  id: string;
  name: string;
  icon: any;
  size: {
    width: number;
    height: number;
  };
}

interface PaymentMethodSelectProps {
  selectedMethod: string;
  onSelect: (method: string) => void;
}

const PaymentMethodSelect: React.FC<PaymentMethodSelectProps> = ({
  selectedMethod,
  onSelect,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'gcash',
      name: '',
      icon: require('../assets/images/gcash-icon.png'),
      size: { width: 85, height: 20 }
    },
    {
      id: 'grab_pay',
      name: '',
      icon: require('../assets/images/grab-icon.png'),
      size: { width: 50, height: 25 }
    },
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: require('../assets/images/Fpayment.png'),
      size: { width: 18.2, height: 14 }
    },
  ];

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => setIsOpen(!isOpen)}
        style={styles.selector}
      >
        <View style={styles.selectedMethod}>
          {selectedMethod && (
            <Image
              source={paymentMethods.find(m => m.id === selectedMethod)?.icon}
              style={paymentMethods.find(m => m.id === selectedMethod)?.size}
            />
          )}
          <Text style={styles.text}>
            {selectedMethod
              ? paymentMethods.find(m => m.id === selectedMethod)?.name
              : 'Select Payment Method'}
          </Text>
        </View>
        <Image
          source={require('../assets/images/chevron-down.png')}
          style={{ width: 16, height: 16 }}
        />
      </TouchableOpacity>

      {isOpen && (
        <View style={styles.dropdown}>
          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              onPress={() => {
                onSelect(method.id);
                setIsOpen(false);
              }}
              style={[
                styles.option,
                selectedMethod === method.id && styles.selectedOption
              ]}
            >
              <Image 
                source={method.icon} 
                style={method.size}
              />
              <Text style={styles.text}>{method.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    position: 'relative',
  },
  selector: {
    width: '100%',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedMethod: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    marginTop: 4,
    zIndex: 10,
  },
  option: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedOption: {
    backgroundColor: '#F3F4F6',
  },
  text: {
    fontSize: 16,
    marginLeft: 8,
  },
});

export default PaymentMethodSelect;