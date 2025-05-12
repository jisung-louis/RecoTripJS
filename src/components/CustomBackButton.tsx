import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

interface CustomBackButtonProps {
  style?: ViewStyle;
  color?: string;
  size?: number;
}

const CustomBackButton: React.FC<CustomBackButtonProps> = ({ style, color = '#222', size = 28 }) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => navigation.goBack()}
      style={[styles.button, style]}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <Icon name="arrow-back" size={size} color={color} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.7)',
    alignSelf: 'flex-start',
  },
});

export default CustomBackButton; 