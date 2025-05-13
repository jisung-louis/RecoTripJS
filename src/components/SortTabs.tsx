import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

interface SortTabsProps {
  value: 'latest' | 'like';
  onChange: (v: 'latest' | 'like') => void;
}

const SortTabs = ({ value, onChange }: SortTabsProps) => (
  <View style={styles.row}>
    <TouchableOpacity style={[styles.tab, value === 'latest' && styles.selected]} onPress={() => onChange('latest')}>
      <Text style={[styles.text, value === 'latest' && styles.selectedText]}>최신순</Text>
    </TouchableOpacity>
    <TouchableOpacity style={[styles.tab, value === 'like' && styles.selected]} onPress={() => onChange('like')}>
      <Text style={[styles.text, value === 'like' && styles.selectedText]}>좋아요순</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  row: { flexDirection: 'row', marginBottom: 10, gap: 8 },
  tab: { flex: 1, paddingVertical: 10, borderRadius: 8, backgroundColor: '#E0F7F3', alignItems: 'center' },
  selected: { backgroundColor: '#1CB5A3' },
  text: { color: '#197C6B', fontWeight: 'bold', fontSize: 15 },
  selectedText: { color: '#fff' },
});

export default SortTabs; 