import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

interface SearchBarProps {
  value: string;
  onChange: (text: string) => void;
  placeholder?: string;
}

const SearchBar = ({ value, onChange, placeholder }: SearchBarProps) => (
  <View style={styles.wrapper}>
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={onChange}
      placeholder={placeholder || '검색어를 입력하세요'}
      placeholderTextColor="#888"
      returnKeyType="search"
    />
  </View>
);

const styles = StyleSheet.create({
  wrapper: { backgroundColor: '#fff', borderRadius: 10, marginBottom: 12, paddingHorizontal: 12, paddingVertical: 6 },
  input: { fontSize: 16, color: '#222' },
});

export default SearchBar; 