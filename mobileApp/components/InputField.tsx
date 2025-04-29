import React from 'react';
import { View, Text, TextInput, KeyboardType, StyleSheet } from 'react-native';

interface InputFieldProps {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  type?: 'text' | 'email' | 'number' | 'card' | 'date' | 'password';
  maxLength?: number;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  type = 'text',
  maxLength,
}) => {
  const getKeyboardType = (): KeyboardType => {
    switch (type) {
      case 'email':
        return 'email-address';
      case 'number':
      case 'card':
        return 'numeric';
      default:
        return 'default';
    }
  };

  const handleTextChange = (text: string) => {
    let formattedText = text;

    switch (type) {
      case 'card':
        // Format card number with spaces every 4 digits
        formattedText = text.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
        break;
      case 'date':
        // Format date as MM/YY
        formattedText = text.replace(/\D/g, '')
          .replace(/(\d{2})(\d)/, '$1/$2')
          .substring(0, 5);
        break;
    }

    onChangeText(formattedText);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        value={value}
        onChangeText={handleTextChange}
        keyboardType={getKeyboardType()}
        maxLength={maxLength}
        autoCapitalize={type === 'email' ? 'none' : 'sentences'}
        autoComplete={type === 'email' ? 'email' : 'off'}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 16 // mb-4 in Tailwind
  },
  label: {
    fontSize: 16, // text-base
    fontWeight: '600', // font-semibold
    marginBottom: 8 // mb-2
  },
  input: {
    width: '100%',
    padding: 16, // p-4
    borderWidth: 1,
    borderColor: '#E5E7EB', // border-gray-300
    borderRadius: 8, // rounded-lg
    backgroundColor: 'white' // bg-white
  }
});

export default InputField;