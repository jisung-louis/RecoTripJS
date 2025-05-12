import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

interface CustomButtonProps {
  onPress: () => void;
  title: string;
  type?: 'primary' | 'secondary' | 'outline' | 'text';
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  onPress,
  title,
  type = 'primary',
  disabled = false,
  style,
  textStyle,
  fullWidth = false,
}) => {
  const getButtonStyle = () => {
    switch (type) {
      case 'primary':
        return [styles.primaryButton, disabled && styles.disabledButton, fullWidth && styles.fullWidth, style];
      case 'secondary':
        return [styles.secondaryButton, disabled && styles.disabledButton, fullWidth && styles.fullWidth, style];
      case 'outline':
        return [styles.outlineButton, disabled && styles.disabledOutlineButton, fullWidth && styles.fullWidth, style];
      case 'text':
        return [styles.textButton, fullWidth && styles.fullWidth, style];
      default:
        return [styles.primaryButton, disabled && styles.disabledButton, fullWidth && styles.fullWidth, style];
    }
  };

  const getTextStyle = () => {
    switch (type) {
      case 'primary':
        return [styles.primaryText, disabled && styles.disabledText, textStyle];
      case 'secondary':
        return [styles.secondaryText, disabled && styles.disabledText, textStyle];
      case 'outline':
        return [styles.outlineText, disabled && styles.disabledOutlineText, textStyle];
      case 'text':
        return [styles.textButtonText, disabled && styles.disabledTextButtonText, textStyle];
      default:
        return [styles.primaryText, disabled && styles.disabledText, textStyle];
    }
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Text style={getTextStyle()}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  primaryButton: {
    backgroundColor: '#1CB5A3',
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  secondaryButton: {
    backgroundColor: '#5CB8B2',
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1CB5A3',
  },
  textButton: {
    backgroundColor: 'transparent',
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#B0B0B0',
  },
  disabledOutlineButton: {
    borderColor: '#B0B0B0',
  },
  fullWidth: {
    width: '100%',
  },
  primaryText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  secondaryText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  outlineText: {
    color: '#1CB5A3',
    fontSize: 17,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  textButtonText: {
    color: '#197C6B',
    fontSize: 14,
    fontWeight: '500',
  },
  disabledText: {
    color: '#fff',
  },
  disabledOutlineText: {
    color: '#B0B0B0',
  },
  disabledTextButtonText: {
    color: '#B0B0B0',
  },
});

export default CustomButton; 