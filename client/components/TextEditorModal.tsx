import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { ColorPicker } from 'react-native-color-picker';


interface TextEditorModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSave: (text: string, styles: TextStyles) => void;
  initialText: string;
  initialStyles?: TextStyles;
}

interface TextStyles {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  color: string;
}

export const TextEditorModal: React.FC<TextEditorModalProps> = ({ 
  isVisible, 
  onClose, 
  onSave, 
  initialText,
  initialStyles = {
    bold: false,
    italic: false,
    underline: false,
    color: '#000000'
  }
}) => {
  const [text, setText] = useState(initialText);
  const [isBold, setIsBold] = useState(initialStyles.bold);
  const [isItalic, setIsItalic] = useState(initialStyles.italic);
  const [isUnderline, setIsUnderline] = useState(initialStyles.underline);
  const [textColor, setTextColor] = useState(initialStyles.color);
  const [showColorPicker, setShowColorPicker] = useState(false);
  
  useEffect(() => {
    setText(initialText);
  }, [initialText]);

  const handleColorSelected = (color: string) => {
    setTextColor(color);
    setShowColorPicker(false);
  };

  const handleSave = () => {
    onSave(text, {
      bold: isBold,
      italic: isItalic,
      underline: isUnderline,
      color: textColor
    });
    setText(''); // Clear text input
    onClose(); // Close modal after saving
  };

  const PRESET_COLORS = [
    '#000000', // Black
    '#FF0000', // Red
    '#00FF00', // Green
    '#0000FF', // Blue
    '#FFFF00', // Yellow
    '#FF00FF', // Magenta
    '#00FFFF', // Cyan
    '#FFFFFF', // White
  ];
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Edit Text</Text>
          
          {/* Text Formatting Controls */}
          <View style={styles.controlsContainer}>
            <TouchableOpacity 
              onPress={() => setIsBold(!isBold)}
              style={[styles.button, isBold && styles.activeButton]}
            >
              <Text style={styles.buttonText}>B</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={() => setIsItalic(!isItalic)}
              style={[styles.button, isItalic && styles.activeButton]}
            >
              <Text style={[styles.buttonText, { fontStyle: 'italic' }]}>I</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={() => setIsUnderline(!isUnderline)}
              style={[styles.button, isUnderline && styles.activeButton]}
            >
              <Text style={[styles.buttonText, { textDecorationLine: 'underline' }]}>U</Text>
            </TouchableOpacity>
            
            {/* Color Input */}
            <View style={styles.colorPickerContainer}>
            <TouchableOpacity
                style={[styles.colorPreview, { backgroundColor: textColor }]}
                onPress={() => setShowColorPicker(!showColorPicker)}
            />
            <Modal
                transparent={true}
                visible={showColorPicker}
                onRequestClose={() => setShowColorPicker(false)}
            >
                <TouchableOpacity
                style={styles.colorPickerOverlay}
                activeOpacity={1}
                onPress={() => setShowColorPicker(false)}
                >
                <View style={styles.colorPickerModal}>
                    <View style={styles.colorsGrid}>
                    {PRESET_COLORS.map((color) => (
                        <TouchableOpacity
                        key={color}
                        style={[styles.colorOption, { backgroundColor: color }]}
                        onPress={() => handleColorSelected(color)}
                        />
                    ))}
                    </View>
                </View>
                </TouchableOpacity>
            </Modal>
            </View>
          </View>

          {/* Text Input */}
          <TextInput
            value={text}
            onChangeText={setText}
            style={[
              styles.textInput,
              {
                fontWeight: isBold ? 'bold' : 'normal',
                fontStyle: isItalic ? 'italic' : 'normal',
                textDecorationLine: isUnderline ? 'underline' : 'none',
                color: textColor
              }
            ]}
            multiline
          />
          
          {/* Save Button */}
          <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: 350,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    gap: 10,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeButton: {
    backgroundColor: '#FDCB07',
  },
  buttonText: {
    fontSize: 16,
    color: '#333',
  },
  colorInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: 14,
    color: '#333',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    minHeight: 100,
    fontSize: 16,
    color: '#333',
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#FDCB07',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  colorPickerContainer: {
    width: 40,
    height: 40,
  },
  colorPreview: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  colorPickerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    padding: 10,
  },
  colorOption: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  colorPickerModal: {
    width: 250,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
  },
});
