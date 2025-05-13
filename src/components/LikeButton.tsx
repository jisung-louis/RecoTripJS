import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface LikeButtonProps {
  liked: boolean;
  count: number;
  onPress: () => void;
}

const LikeButton = ({ liked, count, onPress }: LikeButtonProps) => (
  <TouchableOpacity style={styles.button} onPress={onPress}>
    <Text style={[styles.heart, liked && styles.liked]}>{liked ? '♥' : '♡'}</Text>
    <Text style={styles.count}>{count}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: { flexDirection: 'row', alignItems: 'center', padding: 6 },
  heart: { fontSize: 22, color: '#FF6B6B', marginRight: 4 },
  liked: { color: '#FF6B6B' },
  count: { fontSize: 15, color: '#197C6B', fontWeight: 'bold' },
});

export default LikeButton; 