import React from 'react';
import { View, Text, TextInput, KeyboardType } from 'react-native';

interface InputFieldProps {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  type?: 'text' | 'email' | 'number' | 'card' | 'date';
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
    <View className="w-full mb-4">
      <Text className="text-base font-semibold mb-2">{label}</Text>
      <TextInput
        className="w-full p-4 border border-gray-300 rounded-lg bg-white"
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        value={value}
        onChangeText={handleTextChange}
        keyboardType={getKeyboardType()}
        maxLength={maxLength}
        autoCapitalize={type === 'email' ? 'none' : 'sentences'}
        autoComplete={type === 'email' ? 'email' : 'off'}
        style={{
          borderWidth: 1,
          borderColor: '#E5E7EB'
        }}
      />
    </View>
  );
};

export default InputField;